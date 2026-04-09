const fs = require('fs');
const files = ['messages/en.json', 'messages/fr.json', 'messages/ar.json'];

function findAndFixDuplicates(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  
  // Parse with a custom function that tracks duplicates
  const lines = text.split('\n');
  const keyCount = {};
  const duplicates = new Set();
  
  lines.forEach(line => {
    const match = line.match(/^\s+"([^"]+)"\s*:/);
    if (match) {
      const key = match[1];
      keyCount[key] = (keyCount[key] || 0) + 1;
      if (keyCount[key] > 1) {
        duplicates.add(key);
      }
    }
  });

  if (duplicates.size === 0) {
    console.log(filePath + ': OK - no duplicates');
    return;
  }

  console.log(filePath + ' DUPLICATES FOUND: ' + [...duplicates].join(', '));

  // Fix: keep only first occurrence of each key within each JSON object
  const result = [];
  const seenInCurrentObject = [];
  let depth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    
    // Track depth changes
    if (openBraces > closeBraces) {
      depth += openBraces - closeBraces;
      seenInCurrentObject[depth] = new Set();
    } else if (closeBraces > openBraces) {
      depth -= closeBraces - openBraces;
    }

    const match = line.match(/^(\s+)"([^"]+)"\s*:/);
    if (match) {
      const key = match[2];
      if (!seenInCurrentObject[depth]) seenInCurrentObject[depth] = new Set();
      
      if (seenInCurrentObject[depth].has(key)) {
        console.log('  Removing duplicate key: ' + key + ' at line ' + (i + 1));
        // Skip this duplicate line (and the value if it spans multiple lines)
        // Simple case: skip single-line keys
        if (!line.trim().endsWith('{') && !line.trim().endsWith('[')) {
          continue; // skip duplicate
        }
      }
      seenInCurrentObject[depth].add(key);
    }
    
    result.push(line);
  }

  fs.writeFileSync(filePath, result.join('\n'), 'utf8');
  console.log('  Fixed and saved: ' + filePath);
}

files.forEach(findAndFixDuplicates);
