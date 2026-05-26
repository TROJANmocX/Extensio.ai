import archiver from "archiver";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface ZipResult {
  zipBuffer: Buffer;
  tempDirPath: string;
}

/**
 * Writes the file mapping to a physical temp directory and archives it to a ZIP buffer.
 */
export async function zipExtensionFiles(files: Record<string, string>): Promise<ZipResult> {
  const tempDirBase = path.resolve(__dirname, "../../temp");
  if (!fs.existsSync(tempDirBase)) {
    fs.mkdirSync(tempDirBase, { recursive: true });
  }

  const uniqueId = crypto.randomUUID();
  const tempDirPath = path.join(tempDirBase, uniqueId);
  fs.mkdirSync(tempDirPath, { recursive: true });

  // Write files physically
  for (const [filename, content] of Object.entries(files)) {
    // Resolve filepath and prevent path traversal
    const safeFilename = path.normalize(filename).replace(/^(\.\.(\/|\\))+/, "");
    const filePath = path.join(tempDirPath, safeFilename);
    const fileDir = path.dirname(filePath);

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, "utf8");
  }

  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const buffers: Buffer[] = [];

    archive.on("data", (data) => {
      buffers.push(data);
    });

    archive.on("end", () => {
      const zipBuffer = Buffer.concat(buffers);
      resolve({ zipBuffer, tempDirPath });
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.directory(tempDirPath, false);
    archive.finalize();
  });
}

/**
 * Removes the temporary folder created during compilation.
 */
export function cleanupTempDir(dirPath: string): void {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  } catch (err) {
    console.error(`Error cleaning up directory: ${dirPath}`, err);
  }
}
