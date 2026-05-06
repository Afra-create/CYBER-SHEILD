import fs from 'fs';
import path from 'path';

const catalog = {
  '@replit/vite-plugin-cartographer': '^0.5.1',
  '@replit/vite-plugin-dev-banner': '^0.1.1',
  '@replit/vite-plugin-runtime-error-modal': '^0.0.6',
  '@tailwindcss/vite': '^4.1.14',
  '@tanstack/react-query': '^5.90.21',
  '@types/node': '^25.3.3',
  '@types/react': '^19.2.0',
  '@types/react-dom': '^19.2.0',
  '@vitejs/plugin-react': '^5.0.4',
  'class-variance-authority': '^0.7.1',
  'clsx': '^2.1.1',
  'drizzle-orm': '^0.45.2',
  'framer-motion': '^12.23.24',
  'lucide-react': '^0.545.0',
  'react': '19.1.0',
  'react-dom': '19.1.0',
  'tailwind-merge': '^3.3.1',
  'tailwindcss': '^4.1.14',
  'tsx': '^4.21.0',
  'vite': '^7.3.2',
  'wouter': '^3.3.5',
  'zod': '^3.25.76'
};

function fixPackageJson(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = false;

  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(key => {
    if (content[key]) {
      Object.keys(content[key]).forEach(dep => {
        if (content[key][dep] === 'catalog:') {
          if (catalog[dep]) {
            content[key][dep] = catalog[dep];
            changed = true;
          } else {
            console.warn(`No catalog entry for ${dep}`);
          }
        }
      });
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`Fixed ${filePath}`);
  } else {
    console.log(`No changes needed for ${filePath}`);
  }
}

const files = [
  'package.json',
  'artifacts/cyber-safety-hub/package.json',
  'artifacts/cyber-surakshit-video/package.json',
  'lib/api-client-react/package.json'
];

files.forEach(f => fixPackageJson(path.resolve(f)));
