const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const srcDir = path.join(__dirname, '..', 'src');
const allFiles = getAllFiles(srcDir);
let issuesFound = 0;

const IGNORED_TYPES = new Set([
  'HTMLInputElement', 'HTMLDivElement', 'HTMLButtonElement', 'HTMLFormElement',
  'HTMLTextAreaElement', 'HTMLElement', 'Record', 'TFieldValues', 'React', 'Promise', 'Array'
]);

const fileIssues = {};

allFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  
  // Find all JSX tags like <SomeComponent
  const matches = content.matchAll(/<([A-Z][a-zA-Z0-9_]*)/g);
  const jsxTags = [];
  for (const m of matches) {
    if (!IGNORED_TYPES.has(m[1])) {
      jsxTags.push(m[1]);
    }
  }
  const uniqueJsxTags = Array.from(new Set(jsxTags));

  uniqueJsxTags.forEach((tag) => {
    // Check if tag is imported or defined in file
    const isImportedOrDeclared = new RegExp(
      `import\\s+.*\\b${tag}\\b|function\\s+${tag}\\b|const\\s+${tag}\\b|class\\s+${tag}\\b|interface\\s+${tag}\\b|type\\s+${tag}\\b`
    ).test(content);

    if (!isImportedOrDeclared) {
      const relPath = path.relative(srcDir, file);
      if (!fileIssues[relPath]) fileIssues[relPath] = [];
      fileIssues[relPath].push(tag);
      issuesFound++;
    }
  });
});

console.log('=== REAL MISSING JSX COMPONENT IMPORTS BY FILE ===');
Object.entries(fileIssues).forEach(([file, tags]) => {
  console.log(`\n📄 ${file}:`);
  console.log(`   Missing imports: ${tags.join(', ')}`);
});

console.log(`\nTOTAL MISSING IMPORTS: ${issuesFound}`);
