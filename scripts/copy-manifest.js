import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const manifestSrc = path.resolve(rootDir, 'manifest.json');
const manifestDist = path.resolve(distDir, 'manifest.json');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDist);
  console.log('✓ Successfully copied manifest.json to dist/');
} else {
  console.error('✗ manifest.json not found in project root!');
}
