var fs = require('fs');
var slugs = ['solo-customer-acquisition','no-code-automation-workflow','keyword-research-guide','solo-pricing-strategy','solo-booking-system','content-site-1000-month'];
slugs.forEach(function(s) {
  var f = 'C:\\Users\\31232\\.openclaw\\workspace\\solopilot-site\\src\\lib\\content\\zh\\' + s + '.json';
  try {
    var d = JSON.parse(fs.readFileSync(f, 'utf8'));
    console.log(s + ' OK | title:', d.title.length, 'excerpt:', d.excerpt.length, 'content:', d.content.length);
  } catch(e) {
    console.log(s + ' ERROR: ' + e.message);
  }
});
// Check index.json
var idx = JSON.parse(fs.readFileSync('C:\\Users\\31232\\.openclaw\\workspace\\solopilot-site\\src\\lib\\content\\zh\\index.json', 'utf8'));
console.log('index.json ops count:', idx.ops.length);
console.log('First 6 ops slugs:', idx.ops.slice(0,6).map(function(o){return o.slug;}).join(', '));
