const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "src", "lib", "content", "zh", "silent-diary-narrative.json");
const raw = fs.readFileSync(file, "utf8");

// Try to parse first to see the error
try {
  JSON.parse(raw);
  console.log("Already valid JSON");
  process.exit(0);
} catch (e) {
  console.log("Error:", e.message);
}

// Find the position of the issue
// The error says position 2289 (line 5 column 2138)
// Let's look at what's around that position
const before = raw.substring(0, 2289);
const problematic = raw.substring(2289, 2295);
const after = raw.substring(2295, 2310);
console.log("Before:", JSON.stringify(before.substring(before.length - 20)));
console.log("Problematic char:", JSON.stringify(problematic));
console.log("After:", JSON.stringify(after));

// Check for unescaped quotes or smart quotes
// The issue is likely unescaped " in the content
// Let me fix by replacing the problematic content

// Actually, let me check if there's a free-standing " in the content
// A content field should have its internal quotes escaped
// Search for patterns where " appears without \ before it within the content string
let fixed = "";
let inString = false;
let strStart = -1;
let strChar = "";
let escapeNext = false;
let issues = 0;

for (let i = 0; i < raw.length; i++) {
  const ch = raw[i];
  
  if (escapeNext) {
    escapeNext = false;
    fixed += ch;
    continue;
  }
  
  if (ch === '\\') {
    escapeNext = true;
    fixed += ch;
    continue;
  }
  
  if (!inString) {
    if (ch === '"') {
      inString = true;
      strStart = i;
      strChar = '"';
    }
    fixed += ch;
    continue;
  }
  
  // We're inside a string
  if (ch === '"') {
    // Check if this closing quote makes sense by trying to parse
    // For now, just track it
    inString = false;
    strStart = -1;
    fixed += ch;
    continue;
  }
  
  fixed += ch;
}

// Write the fixed version
fs.writeFileSync(file, fixed);
console.log("Written fixed version");

// Verify
try {
  JSON.parse(fs.readFileSync(file, "utf8"));
  console.log("Now valid JSON");
} catch (e) {
  console.log("Still broken:", e.message);
}
