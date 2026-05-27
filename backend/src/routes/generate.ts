import { Router, Request, Response } from "express";
import { generateExtensionFromPrompt, editExtensionFromPrompt } from "../services/gemini";
import { validateExtensionFiles } from "../utils/validator";
import { zipExtensionFiles, cleanupTempDir } from "../generators/zipper";

const router = Router();

/**
 * Endpoint: POST /api/generate
 * Generates a Manifest V3 extension based on a prompt.
 */
router.post("/generate", async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ success: false, error: "Prompt string is required." });
    return;
  }

  const clientApiKey = req.headers['x-gemini-api-key'] as string | undefined;

  try {
    const files = await generateExtensionFromPrompt(prompt, clientApiKey);
    const validation = validateExtensionFiles(files);

    res.json({
      success: true,
      files,
      validation
    });
  } catch (error) {
    console.error("Route generation failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate extension files.",
      details: (error as Error).message
    });
  }
});

/**
 * Endpoint: POST /api/modify
 * Modifies an existing set of extension files based on standard edit text prompt.
 */
router.post("/modify", async (req: Request, res: Response): Promise<void> => {
  const { files, editRequest } = req.body;

  if (!files || typeof files !== "object") {
    res.status(400).json({ success: false, error: "Current file structure is required." });
    return;
  }

  if (!editRequest || typeof editRequest !== "string") {
    res.status(400).json({ success: false, error: "Modification request string is required." });
    return;
  }

  const clientApiKey = req.headers['x-gemini-api-key'] as string | undefined;

  try {
    const updatedFiles = await editExtensionFromPrompt(files, editRequest, clientApiKey);
    const validation = validateExtensionFiles(updatedFiles);

    res.json({
      success: true,
      files: updatedFiles,
      validation
    });
  } catch (error) {
    console.error("Route modification failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to modify extension files.",
      details: (error as Error).message
    });
  }
});

/**
 * Endpoint: POST /api/download
 * Compiles a set of files into a downloadable ZIP format.
 */
router.post("/download", async (req: Request, res: Response): Promise<void> => {
  const { files, name } = req.body;

  if (!files || typeof files !== "object") {
    res.status(400).json({ success: false, error: "Files mapping object is required." });
    return;
  }

  const extensionName = name ? name.toLowerCase().replace(/[^a-z0-9_-]/g, "_") : "extension";

  let tempDirPath = "";
  try {
    // Compile and ZIP files
    const result = await zipExtensionFiles(files);
    tempDirPath = result.tempDirPath;

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${extensionName}.zip"`);
    res.send(result.zipBuffer);

  } catch (error) {
    console.error("Route download failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to compile ZIP archive.",
      details: (error as Error).message
    });
  } finally {
    // Cleanup temporary files asynchronously to release space
    if (tempDirPath) {
      setTimeout(() => {
        cleanupTempDir(tempDirPath);
      }, 2000);
    }
  }
});

export default router;
