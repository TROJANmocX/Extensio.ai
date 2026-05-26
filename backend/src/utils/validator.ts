/**
 * Utility to validate the generated Chrome Extension files and enforce security controls.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateExtensionFiles(files: Record<string, string>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Check if manifest.json exists
  if (!files["manifest.json"]) {
    errors.push("Missing required file: manifest.json");
    return { isValid: false, errors, warnings };
  }

  // 2. Validate manifest.json structure
  try {
    const manifest = JSON.parse(files["manifest.json"]);

    // Enforce Manifest V3
    if (manifest.manifest_version !== 3) {
      errors.push(`Invalid manifest version: ${manifest.manifest_version}. Only Manifest V3 is supported.`);
    }

    // Check manifest permissions and security properties
    if (manifest.permissions) {
      if (!Array.isArray(manifest.permissions)) {
        errors.push("Manifest permissions must be an array of strings.");
      } else {
        // Look for overly invasive permissions and issue warnings
        const invasivePermissions = ["debugger", "proxy", "vpnProvider", "webNavigation"];
        invasivePermissions.forEach(perm => {
          if (manifest.permissions.includes(perm)) {
            warnings.push(`Extension requests powerful permission: '${perm}'. Verify need.`);
          }
        });
      }
    }

    // Content Security Policy (CSP) Validation (enforce secure CSP in V3)
    if (manifest.content_security_policy) {
      const csp = manifest.content_security_policy;
      if (typeof csp === "string") {
        if (csp.includes("unsafe-eval")) {
          errors.push("Security violation: 'unsafe-eval' is strictly forbidden in Chrome extension scripts.");
        }
        if (csp.includes("http://")) {
          errors.push("Security violation: Insecure HTTP protocols are not allowed in CSP directives.");
        }
      } else if (typeof csp === "object") {
        // V3 CSP object form: extension_pages, sandbox, etc.
        const cspStr = JSON.stringify(csp);
        if (cspStr.includes("unsafe-eval")) {
          errors.push("Security violation: 'unsafe-eval' is forbidden in CSP extension pages.");
        }
        if (/https?:\/\//.test(cspStr) && !cspStr.includes("https://fonts.googleapis.com")) {
          errors.push("Security violation: Loading external scripts (HTTP/HTTPS) is restricted in V3 extensions.");
        }
      }
    }

    // Check for inline background scripts (which aren't allowed in V3 as background pages, must be service workers)
    if (manifest.background) {
      if (manifest.background.page) {
        errors.push("Manifest V3 violation: 'background.page' is no longer supported. Use 'background.service_worker' instead.");
      }
      if (!manifest.background.service_worker) {
        warnings.push("Background script specified but 'background.service_worker' is missing.");
      }
    }

  } catch (error) {
    errors.push("Failed to parse manifest.json: " + (error as Error).message);
  }

  // 3. Scan scripts for dangerous patterns
  for (const [filename, content] of Object.entries(files)) {
    if (filename.endsWith(".js") || filename.endsWith(".ts")) {
      // Check for eval usage
      if (content.includes("eval(") || content.includes("new Function(")) {
        errors.push(`Security violation in ${filename}: Dynamic code execution ('eval' or 'new Function') is banned.`);
      }

      // Check for remote script inclusion
      if (content.includes("document.createElement('script')") && (content.includes("http://") || content.includes("https://"))) {
        warnings.push(`Script ${filename} dynamically constructs a script tag loading external URLs. This might be blocked by Manifest V3.`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
