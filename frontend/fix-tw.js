const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat && stat.isDirectory() && !full.includes('node_modules') && !full.includes('.next') && !full.includes('.git')) {
        results = results.concat(walk(full));
      } else if (full.match(/\.(tsx|ts|css)$/)) {
        results.push(full);
      }
    });
  } catch (e) {}
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let totalFiles = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const original = content;

  // Core fix: replace -(--color-X) with -X (handles all prefixes automatically)
  // e.g. bg-(--color-primary-50) → bg-primary-50
  //      text-(--color-text-muted) → text-text-muted
  //      border-(--color-border)/30 → border-border/30
  content = content.replace(/\(--color-([a-zA-Z0-9-]+)\)/g, '$1');

  // flex-shrink-0 → shrink-0
  content = content.replace(/\bflex-shrink-0\b/g, 'shrink-0');

  // bg-gradient-to-* → bg-linear-to-*
  content = content.replace(/\bbg-gradient-to-/g, 'bg-linear-to-');

  // Arbitrary pixel sizes  
  content = content.replace(/\bh-\[300px\]/g, 'h-75');
  content = content.replace(/\bmin-w-\[200px\]/g, 'min-w-50');
  content = content.replace(/\bmax-w-\[200px\]/g, 'max-w-50');

  if (content !== original) {
    fs.writeFileSync(f, content);
    totalFiles++;
    console.log('✓ ' + path.relative(__dirname, f));
  }
});

console.log('\n✅ ' + totalFiles + ' fichiers mis à jour.');
