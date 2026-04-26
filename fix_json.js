var fs = require('fs');
var dir = 'C:\\Users\\31232\\.openclaw\\workspace\\solopilot-site\\src\\lib\\content\\zh\\';
var slugs = [
  'solo-customer-acquisition',
  'no-code-automation-workflow', 
  'keyword-research-guide',
  'solo-pricing-strategy',
  'solo-booking-system',
  'content-site-1000-month'
];

slugs.forEach(function(slug) {
  var f = dir + slug + '.json';
  var c = fs.readFileSync(f, 'utf8');
  
  // The content has unescaped double quotes " inside the JSON string values.
  // Strategy: keep opening {, slug, title, excerpt, site fields as-is.
  // The content field needs its internal " replaced with \u201C and \u201D (Chinese quotes) or escaped.
  
  // Better approach: parse the JSON properly by escaping quotes in content.
  // Since content is between "content": "..." and then "site": "...",
  // we can target the specific pattern.
  
  // Let's find the pattern: "content": "..."  followed by "site":
  var startIdx = c.indexOf('"content": "');
  if (startIdx === -1) { console.log(slug + ': no content field found'); return; }
  startIdx += 12; // skip "content": "
  
  var endIdx = c.indexOf('",\n  "site"');
  if (endIdx === -1) endIdx = c.indexOf('",  "site"');
  if (endIdx === -1) { console.log(slug + ': no site field after content'); return; }
  
  var prefix = c.substring(0, startIdx);
  var content = c.substring(startIdx, endIdx);
  var suffix = c.substring(endIdx);
  
  // Replace unescaped double quotes with Chinese quotation marks
  var fixedContent = content.replace(/"/g, '\u201C');
  // Replace leading/trailing smart quotes back to actual double-quote if needed
  // Actually, the content field value should not have literal " inside.  
  // Let's just escape them: replace " with \"
  // But we need to be careful to only replace the ones inside content
  
  var fixedC = prefix + fixedContent + suffix;
  
  // Now the actual double-quote in the content value is gone,
  // but we also turned the closing " into Chinese quote.
  // So suffix starts with '",' but we replaced that " in content.
  // Actually since '",' is at position endIdx, content stops before that.
  // The suffix is: '",\n  "site":...'
  // So the original " before , is part of suffix, not content.
  
  fs.writeFileSync(f, fixedC, 'utf8');
  console.log(slug + ': fixed');
});
