const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'app', 'admin', 'moteur', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace any raw > inside JSX text with the safe JSX expression
content = content.replace(
  /\(ex: > 100 articles\)/g,
  "(ex: {'>'} 100 articles)"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done. Line 66 context:');
const lines = content.split('\n');
console.log(lines[65]);
