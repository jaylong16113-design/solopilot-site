const fs = require("fs");
const path = require("path");

const zh = JSON.parse(fs.readFileSync("src/lib/content/zh/index.json", "utf8"));
const en = JSON.parse(fs.readFileSync("src/lib/content/en/index.json", "utf8"));

const sections = ["tool", "wear", "ops", "mood"];
const zhNames = { tool: "AI工具站", wear: "穿搭站", ops: "运营站/一人公司", mood: "情绪短视频站" };
const enNames = { tool: "AI Tools", wear: "Fashion/Style", ops: "Solo OPS", mood: "Mood Videos" };

let lines = [];
lines.push("# AgentClaw Full Content Index");
lines.push("");
lines.push("> 从工具、穿搭、运营到情绪短视频，四个内容站的中英文文章完整索引");
lines.push("> 站点：https://agentclaw.sale");
lines.push("");

// Chinese sections
for (const s of sections) {
  const articles = zh[s] || [];
  lines.push("## " + zhNames[s] + " (" + articles.length + " posts)");
  lines.push("");
  for (const a of articles) {
    const excerpt = a.excerpt.length > 100 ? a.excerpt.substring(0, 100) + "…" : a.excerpt;
    lines.push("- [" + a.title + "]: https://agentclaw.sale/" + s + "/" + a.slug + " — " + excerpt);
  }
  lines.push("");
}

lines.push("---");
lines.push("");

// English sections
lines.push("## English");
lines.push("");
for (const s of sections) {
  const articles = en[s] || [];
  lines.push("### " + enNames[s] + " (" + articles.length + " posts)");
  lines.push("");
  for (const a of articles) {
    const excerpt = a.excerpt.length > 100 ? a.excerpt.substring(0, 100) + "…" : a.excerpt;
    lines.push("- [" + a.title + "]: https://agentclaw.sale/en/" + s + "/" + a.slug + " — " + excerpt);
  }
  lines.push("");
}

fs.writeFileSync("public/llms-full.txt", lines.join("\n"), "utf8");
console.log("llms-full.txt generated with " + lines.length + " lines");
