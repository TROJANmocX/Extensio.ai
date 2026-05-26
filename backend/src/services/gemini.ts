import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Standard system instructions for Gemini to output strict Manifest V3 Chrome Extension structures.
 */
const SYSTEM_PROMPT = `You are Extensio.ai, an elite developer AI specializing in building secure, clean, and highly functional Google Chrome Extensions adhering strictly to Manifest V3.

You MUST return your output as a single, valid JSON object where keys are the filenames (e.g. "manifest.json", "content.js", "background.js", "popup.html", "popup.js", "styles.css") and the values are their complete code contents as strings.
Do NOT wrap the output in markdown block code tags (like \`\`\`json). The entire output must be parseable directly by JSON.parse().

Rules:
1. ONLY generate Manifest V3 extensions ("manifest_version": 3).
2. All code must be 100% complete and working. DO NOT write placeholders like "// implement here" or "// code goes here".
3. Write modern, responsive HTML/CSS for popup.html and styles.css, styled with dark themes, clean flex layouts, and glassmorphic designs.
4. Minimize requested permissions in manifest.json to only those required by the extension.
5. In background.js, use service workers ("background": { "service_worker": "background.js" }), NOT background pages.
6. Do not include external remote scripts (HTTP/HTTPS CDN scripts) to comply with Manifest V3 security rules. Write custom local JS to implement functionality.
7. Return a complete, self-contained set of files. If a file is referenced, it must be defined.
`;

const DEFAULT_MOCK_YOUTUBE = {
  "manifest.json": JSON.stringify({
    "manifest_version": 3,
    "name": "YouTube Comment Shield",
    "version": "1.0.0",
    "description": "Cleanse your YouTube experience by hiding comments and distracted feeds automatically.",
    "permissions": ["activeTab", "storage"],
    "action": {
      "default_popup": "popup.html",
      "default_icon": "icon.png"
    },
    "content_scripts": [
      {
        "matches": ["*://*.youtube.com/*"],
        "js": ["content.js"],
        "run_at": "document_end"
      }
    ]
  }, null, 2),
  "popup.html": `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="popup-container">
    <div class="header">
      <span class="logo">Extensio.ai</span>
      <span class="badge">Shield Active</span>
    </div>
    <div class="status-box">
      <h3>YouTube Comment Shield</h3>
      <p class="description">Toggle visibility of comment sections instantly.</p>
      
      <div class="toggle-container">
        <span class="label">Hide Comments</span>
        <label class="switch">
          <input type="checkbox" id="commentToggle" checked>
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    <div class="footer">
      <span>Powered by Extensio.ai</span>
    </div>
  </div>
  <script src="popup.js"></script>
</body>
</html>`,
  "styles.css": `body {
  margin: 0;
  padding: 12px;
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #0d0e15;
  color: #f3f4f6;
  width: 300px;
}
.popup-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 8px;
}
.logo {
  font-weight: 700;
  background: linear-gradient(135deg, #a78bfa, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 14px;
}
.badge {
  font-size: 10px;
  background-color: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  padding: 2px 6px;
  border-radius: 9999px;
  border: 1px solid rgba(139, 92, 246, 0.3);
}
.status-box {
  background-color: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 12px;
}
.status-box h3 {
  margin: 0 0 6px 0;
  font-size: 13px;
  font-weight: 600;
}
.description {
  margin: 0 0 12px 0;
  font-size: 11px;
  color: #9ca3af;
}
.toggle-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255,255,255,0.02);
  padding: 8px;
  border-radius: 6px;
}
.label {
  font-size: 12px;
  font-weight: 500;
}
.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #374151;
  transition: .3s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
}
input:checked + .slider {
  background-color: #8b5cf6;
}
input:checked + .slider:before {
  transform: translateX(16px);
}
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
.footer {
  text-align: center;
  font-size: 10px;
  color: #4b5563;
}`,
  "popup.js": `document.getElementById('commentToggle').addEventListener('change', (e) => {
  const hideComments = e.target.checked;
  chrome.storage.local.set({ hideComments }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleComments", hide: hideComments });
      }
    });
  });
});

// Load saved settings
chrome.storage.local.get('hideComments', (data) => {
  if (data.hasOwnProperty('hideComments')) {
    document.getElementById('commentToggle').checked = data.hideComments;
  }
});`,
  "content.js": `function updateComments(hide) {
  const selectors = [
    '#comments', 
    'ytd-comments', 
    '.ytd-item-section-renderer'
  ];
  
  selectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) {
      el.style.display = hide ? 'none' : 'block';
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleComments") {
    updateComments(request.hide);
  }
});

// Run check on intervals since YouTube is a Single Page App (SPA)
setInterval(() => {
  chrome.storage.local.get('hideComments', (data) => {
    const hide = data.hasOwnProperty('hideComments') ? data.hideComments : true;
    updateComments(hide);
  });
}, 1000);`
};

const DEFAULT_MOCK_ADBLOCK = {
  "manifest.json": JSON.stringify({
    "manifest_version": 3,
    "name": "Extensio Ad Blocker",
    "version": "1.0.0",
    "description": "Block distracting banner ads and visual clutter from websites seamlessly.",
    "permissions": ["activeTab", "storage", "declarativeNetRequest"],
    "action": {
      "default_popup": "popup.html"
    }
  }, null, 2),
  "popup.html": `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="popup-container">
    <div class="header">
      <span class="logo">Extensio.ai</span>
    </div>
    <div class="status-box">
      <h3>Ad Blocker</h3>
      <div class="count-box">
        <span class="count-number" id="blockCount">142</span>
        <span class="count-label">Ads Blocked Today</span>
      </div>
      <div class="toggle-container">
        <span class="label">Ad Shield</span>
        <label class="switch">
          <input type="checkbox" id="adToggle" checked>
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  </div>
  <script src="popup.js"></script>
</body>
</html>`,
  "styles.css": `body {
  margin: 0; padding: 12px;
  font-family: system-ui, sans-serif;
  background-color: #0b0c10; color: #fff;
  width: 250px;
}
.logo { font-weight: bold; color: #a78bfa; }
.status-box { text-align: center; margin-top: 10px; }
.count-box { padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; margin: 10px 0; }
.count-number { font-size: 28px; font-weight: 800; color: #10b981; display: block; }
.count-label { font-size: 11px; color: #9ca3af; }
.toggle-container { display: flex; justify-content: space-between; align-items: center; }
.switch { position: relative; display: inline-block; width: 34px; height: 20px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top:0; left:0; right:0; bottom:0; background-color: #4b5563; transition: .4s; border-radius: 34px; }
.slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: #10b981; }
input:checked + .slider:before { transform: translateX(14px); }`,
  "popup.js": `// Ad Blocker logic
document.getElementById('adToggle').addEventListener('change', (e) => {
  const enabled = e.target.checked;
  chrome.storage.local.set({ adBlockEnabled: enabled });
});
chrome.storage.local.get('adBlockEnabled', (data) => {
  if (data.hasOwnProperty('adBlockEnabled')) {
    document.getElementById('adToggle').checked = data.adBlockEnabled;
  }
});`
};

/**
 * Sends a generation request to the Gemini API. Falls back to mock structures if no API Key or on error.
 */
export async function generateExtensionFromPrompt(prompt: string): Promise<Record<string, string>> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment variables. Falling back to static template generators...");
    return getFallbackExtension(prompt);
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Create a Google Chrome extension based on this prompt: "${prompt}". Make sure it is beautiful, robust, and safe.`
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2
        },
        systemInstruction: {
          parts: [
            {
              text: SYSTEM_PROMPT
            }
          ]
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error (HTTP ${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("Empty candidate list received from Gemini model response.");
    }

    // Safely parse JSON
    return parseGeminiOutput(generatedText);
  } catch (error) {
    console.error("Gemini invocation failed, serving smart fallback template. Error: ", error);
    return getFallbackExtension(prompt);
  }
}

/**
 * Handles modifying an existing set of files with a follow-up instructions prompt.
 */
export async function editExtensionFromPrompt(
  currentFiles: Record<string, string>,
  editRequest: string
): Promise<Record<string, string>> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. Simulating local prompt edits...");
    return simulateLocalEdit(currentFiles, editRequest);
  }

  try {
    const editInstruction = `You are modifying an existing Chrome extension. Below is the file mapping representing the current state of the extension:
${JSON.stringify(currentFiles, null, 2)}

The user has requested the following edit/updates:
"${editRequest}"

Apply the modification completely. Regenerate and return the COMPLETE updated file mapping including all files in the same format. Ensure manifest.json and all JavaScript files are completely syntactically correct. Do not abbreviate code. Ensure Manifest V3 standards.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: editInstruction
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.15
        },
        systemInstruction: {
          parts: [
            {
              text: SYSTEM_PROMPT
            }
          ]
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error (HTTP ${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("Empty text returned during extension edit prompt.");
    }

    return parseGeminiOutput(generatedText);
  } catch (error) {
    console.error("Gemini modification call failed, simulating local edits. Error: ", error);
    return simulateLocalEdit(currentFiles, editRequest);
  }
}

/**
 * Parses raw text, cleaning markdown wrapping and escaping trailing commas if any.
 */
function parseGeminiOutput(text: string): Record<string, string> {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    const match = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (match && match[1]) {
      cleaned = match[1].trim();
    }
  }
  // Try clean up code blocks
  cleaned = cleaned.replace(/^```json/gi, "").replace(/```$/g, "").trim();
  return JSON.parse(cleaned);
}

/**
 * Yields realistic structures for testability during offline or dev modes.
 */
function getFallbackExtension(prompt: string): Record<string, string> {
  const p = prompt.toLowerCase();
  if (p.includes("youtube") || p.includes("comment")) {
    return DEFAULT_MOCK_YOUTUBE;
  }
  if (p.includes("ad") || p.includes("block")) {
    return DEFAULT_MOCK_ADBLOCK;
  }

  // General fallbacks
  return {
    "manifest.json": JSON.stringify({
      "manifest_version": 3,
      "name": "Custom Extension Helper",
      "version": "1.0.0",
      "description": `Chrome Helper: ${prompt}`,
      "permissions": ["activeTab", "storage"],
      "action": {
        "default_popup": "popup.html"
      }
    }, null, 2),
    "popup.html": `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="popup-container">
    <h3>Custom extension:</h3>
    <p class="desc">${prompt.substring(0, 80)}...</p>
    <button class="btn" id="actionBtn">Trigger Feature</button>
  </div>
  <script src="popup.js"></script>
</body>
</html>`,
    "styles.css": `body {
  width: 220px; padding: 12px;
  background-color: #0f172a; color: #fff;
  font-family: sans-serif;
}
h3 { font-size: 13px; margin: 0 0 4px 0; color: #8b5cf6; }
.desc { font-size: 11px; color: #94a3b8; margin: 0 0 12px 0; }
.btn {
  width: 100%; border: none; padding: 8px; border-radius: 4px;
  background: #8b5cf6; color: #fff; font-weight: bold; cursor: pointer;
}`,
    "popup.js": `document.getElementById('actionBtn').addEventListener('click', () => {
  alert('Custom Feature Activated for: ' + document.querySelector('.desc').innerText);
});`,
    "content.js": `console.log('Custom content script loaded for: ${prompt}');`
  };
}

/**
 * Simulates a local search and replace modification.
 */
function simulateLocalEdit(currentFiles: Record<string, string>, editRequest: string): Record<string, string> {
  const files = { ...currentFiles };
  const req = editRequest.toLowerCase();

  // If user requested changing colors or styles
  if (req.includes("red") || req.includes("color")) {
    if (files["styles.css"]) {
      files["styles.css"] = files["styles.css"].replace(/#8b5cf6/g, "#ef4444")
                                               .replace(/#10b981/g, "#ef4444");
    }
  }

  // Update manifest with prompt tags
  if (files["manifest.json"]) {
    try {
      const manifest = JSON.parse(files["manifest.json"]);
      manifest.description = manifest.description + ` (Modified: ${editRequest})`;
      files["manifest.json"] = JSON.stringify(manifest, null, 2);
    } catch (_) {}
  }

  return files;
}
