const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const SHADCN_MAPPINGS = {
  Dialog: "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';",
  DialogTrigger: "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';",
  DialogContent: "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';",
  DialogHeader: "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';",
  DialogTitle: "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';",
  DialogDescription: "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';",
  DialogFooter: "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';",
  Table: "import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';",
  TableHeader: "import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';",
  TableRow: "import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';",
  TableHead: "import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';",
  TableBody: "import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';",
  TableCell: "import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';",
  DropdownMenu: "import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';",
  DropdownMenuTrigger: "import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';",
  DropdownMenuContent: "import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';",
  DropdownMenuLabel: "import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';",
  DropdownMenuSeparator: "import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';",
  DropdownMenuItem: "import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';",
};

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

const allFiles = getAllFiles(srcDir);
let fixedCount = 0;

allFiles.forEach((file) => {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // 1. Check for lucide-react icons missing in lucide import
  const lucideMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"];?/);
  
  // Find all JSX tags
  const matches = content.matchAll(/<([A-Z][a-zA-Z0-9_]*)/g);
  const jsxTags = new Set();
  for (const m of matches) {
    jsxTags.add(m[1]);
  }

  const missingLucideIcons = [];
  const missingShadcnImports = new Set();

  jsxTags.forEach((tag) => {
    // Is it defined or imported?
    const isDeclared = new RegExp(
      `import\\s+.*\\b${tag}\\b|function\\s+${tag}\\b|const\\s+${tag}\\b|class\\s+${tag}\\b|interface\\s+${tag}\\b|type\\s+${tag}\\b`
    ).test(content);

    if (!isDeclared) {
      if (SHADCN_MAPPINGS[tag]) {
        missingShadcnImports.add(SHADCN_MAPPINGS[tag]);
      } else if (!['HTMLVideoElement', 'HTMLCanvasElement', 'HTMLInputElement', 'HTMLAudioElement', 'MediaStream', 'NodeJS'].includes(tag)) {
        missingLucideIcons.push(tag);
      }
    }
  });

  // Inject missing Lucide icons into existing lucide-react import or add new line
  if (missingLucideIcons.length > 0) {
    if (lucideMatch) {
      const existingIconsStr = lucideMatch[1];
      const existingIcons = existingIconsStr.split(',').map(s => s.trim()).filter(Boolean);
      const combined = Array.from(new Set([...existingIcons, ...missingLucideIcons])).join(', ');
      content = content.replace(lucideMatch[0], `import { ${combined} } from 'lucide-react';`);
    } else {
      const newImport = `import { ${missingLucideIcons.join(', ')} } from 'lucide-react';\n`;
      content = newImport + content;
    }
  }

  // Inject missing Shadcn UI component imports at top after 'use client'
  if (missingShadcnImports.size > 0) {
    missingShadcnImports.forEach((imp) => {
      if (!content.includes(imp)) {
        if (content.startsWith("'use client'") || content.startsWith('"use client"')) {
          content = content.replace(/(['"]use client['"];?\s*)/, `$1\n${imp}\n`);
        } else {
          content = `${imp}\n` + content;
        }
      }
    });
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✅ FIXED IMPORTS in: ${path.relative(srcDir, file)}`);
    fixedCount++;
  }
});

console.log(`\n🎉 FIXED ALL MISSING IMPORTS IN ${fixedCount} FILES!`);
