const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('page.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src/app');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const original = content;
  content = content.replace(/onclick="[^"]*"/gi, '');
  content = content.replace(/required(="[^"]*")?/gi, 'required={true}');
  content = content.replace(/disabled(="[^"]*")?/gi, 'disabled={true}');
  content = content.replace(/checked(="[^"]*")?/gi, 'defaultChecked={true}');
  content = content.replace(/selected(="[^"]*")?/gi, 'selected={true}');
  content = content.replace(/rows="(\d+)"/gi, 'rows={$1}');
  content = content.replace(/cols="(\d+)"/gi, 'cols={$1}');
  content = content.replace(/maxlength="(\d+)"/gi, 'maxLength={$1}');
  content = content.replace(/autocomplete="([^"]*)"/gi, 'autoComplete="$1"');
  
  if (original !== content) {
    fs.writeFileSync(f, content);
    console.log('Fixed TS errors in ' + f);
  }
});
