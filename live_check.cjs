// BUG TRACKER - Run after each deployment to verify the live site
const https = require("https");

const DOMAIN = "agentclaw.sale";
const paths = [
  "/",
  "/tool",
  "/wear",
  "/ops",
  "/en",
  "/en/tool",
  "/en/wear",
  "/en/ops",
  "/robots.txt",
  "/sitemap.xml",
];

let passed = 0;
let failed = 0;

function check(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 10000 }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) {
          // Check for common error patterns
          if (body.includes("Application error") || body.includes("500") || body.includes("not found")) {
            console.log(`⚠️  ${url} -> 200 but error content detected`);
            failed++;
          } else {
            console.log(`✅ ${url} -> 200`);
            passed++;
          }
        } else if (res.statusCode >= 400) {
          console.log(`❌ ${url} -> ${res.statusCode}`);
          failed++;
        } else {
          console.log(`✅ ${url} -> ${res.statusCode}`);
          passed++;
        }
        resolve();
      });
    });
    req.on("timeout", () => {
      console.log(`❌ ${url} -> TIMEOUT`);
      failed++;
      req.destroy();
      resolve();
    });
    req.on("error", (e) => {
      console.log(`❌ ${url} -> ${e.message}`);
      failed++;
      resolve();
    });
  });
}

(async () => {
  console.log(`\n=== LIVE SITE CHECK: ${DOMAIN} ===\n`);
  await Promise.all(paths.map((p) => check(`https://${DOMAIN}${p}`)));
  console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===\n`);
  if (failed > 0) process.exit(1);
  process.exit(0);
})();
