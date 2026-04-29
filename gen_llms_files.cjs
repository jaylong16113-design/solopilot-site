const fs = require("fs");
const path = require("path");

const base = "https://agentclaw.sale";
const idxPath = path.join(process.cwd(), "src", "lib", "content", "zh", "index.json");
const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
const enIdxPath = path.join(process.cwd(), "src", "lib", "content", "en", "index.json");
const enIdx = JSON.parse(fs.readFileSync(enIdxPath, "utf8"));

// ——— llms.txt ———
const llmsLines = [
  "# AgentClaw \u2014 AI Content Nebula",
  "> \u4ece\u5de5\u5177\u3001\u7a7f\u642d\u3001\u8fd0\u8425\u5230\u60c5\u7eea\u77ed\u89c6\u9891\uff0c\u56db\u4e2a\u5185\u5bb9\u7ad9\u7ec4\u6210 AI \u589e\u957f\u7cfb\u7edf",
  "",
  "## \u7ad9\u70b9\u5bfc\u822a",
  "- AI\u5de5\u5177\u7ad9: " + base + "/tool",
  "- \u7a7f\u642d\u7ad9: " + base + "/wear",
  "- \u8fd0\u8425\u7ad9: " + base + "/ops",
  "- \u60c5\u7eea\u77ed\u89c6\u9891: " + base + "/mood",
  "",
  "## English",
  "- AI Tools: " + base + "/en/tool",
  "- Style Guide: " + base + "/en/wear",
  "- Solo OPS: " + base + "/en/ops",
  "- Mood Videos: " + base + "/en/mood",
  "",
  "## \u70ed\u95e8\u6587\u7ae0",
  "- [" + idx.tool[0].title + "]: " + base + "/tool/" + idx.tool[0].slug,
  "- [" + idx.wear[0].title + "]: " + base + "/wear/" + idx.wear[0].slug,
  "- [" + idx.ops[0].title + "]: " + base + "/ops/" + idx.ops[0].slug,
  "- [" + (idx.ops[1]||idx.ops[0]).title + "]: " + base + "/ops/" + (idx.ops[1]||idx.ops[0]).slug,
  "- [" + idx.mood[0].title + "]: " + base + "/mood/" + idx.mood[0].slug,
];

fs.writeFileSync("public/llms.txt", llmsLines.join("\n") + "\n", "utf8");
console.log("llms.txt: " + fs.statSync("public/llms.txt").size + " bytes");

// ——— llms-full.txt ———
var fullLines = [
  "# AgentClaw Full Content Index",
  "",
  "> \u4ece\u5de5\u5177\u3001\u7a7f\u642d\u3001\u8fd0\u8425\u5230\u60c5\u7eea\u77ed\u89c6\u9891\uff0c\u56db\u4e2a\u5185\u5bb9\u7ad9\u7684\u4e2d\u82f1\u6587\u6587\u7ae0\u5b8c\u6574\u7d22\u5f15",
  "> \u7ad9\u70b9\uff1a" + base,
  "",
];

var zhGroups = [
  { name: "AI\u5de5\u5177\u7ad9", key: "tool" },
  { name: "\u7a7f\u642d\u7ad9", key: "wear" },
  { name: "\u8fd0\u8425\u7ad9", key: "ops" },
  { name: "\u60c5\u7eea\u77ed\u89c6\u9891\u7ad9", key: "mood" },
];

zhGroups.forEach(function(g) {
  var arts = idx[g.key] || [];
  fullLines.push("## " + g.name + " (" + arts.length + " posts)");
  fullLines.push("");
  arts.forEach(function(a) {
    fullLines.push("- [" + a.title + "]: " + base + "/" + g.key + "/" + a.slug + " \u2014 " + (a.excerpt||"").slice(0,100));
  });
  fullLines.push("");
});

fullLines.push("---");
fullLines.push("");
fullLines.push("## English");
fullLines.push("");

var enGroups = [
  { name: "AI Tools", key: "tool" },
  { name: "Style Guide", key: "wear" },
  { name: "Solo OPS", key: "ops" },
  { name: "Mood Videos", key: "mood" },
];

enGroups.forEach(function(g) {
  var arts = enIdx[g.key] || [];
  fullLines.push("### " + g.name + " (" + arts.length + " posts)");
  fullLines.push("");
  arts.forEach(function(a) {
    fullLines.push("- [" + a.title + "]: " + base + "/en/" + g.key + "/" + a.slug + " \u2014 " + (a.excerpt||"").slice(0,100));
  });
  fullLines.push("");
});

fs.writeFileSync("public/llms-full.txt", fullLines.join("\n") + "\n", "utf8");
console.log("llms-full.txt: " + fs.statSync("public/llms-full.txt").size + " bytes");
