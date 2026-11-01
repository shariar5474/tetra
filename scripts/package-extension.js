import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const outputFile = path.resolve(rootDir, 'cineforge-ai-v1.0.0.zip');

async function addDirectoryToZip(zip, dirPath, rootPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    const relativePath = path.relative(rootPath, fullPath).replace(/\\/g, '/');

    if (stat.isDirectory()) {
      await addDirectoryToZip(zip, fullPath, rootPath);
    } else {
      const content = fs.readFileSync(fullPath);
      zip.file(relativePath, content);
    }
  }
}

async function packageExtension() {
  if (!fs.existsSync(distDir)) {
    console.error('Dist directory does not exist. Run "npm run build" first.');
    process.exit(1);
  }

  const zip = new JSZip();
  console.log('Packaging extension from dist/ ...');
  await addDirectoryToZip(zip, distDir, distDir);

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  fs.writeFileSync(outputFile, zipBuffer);
  const sizeMB = (zipBuffer.length / (1024 * 1024)).toFixed(2);
  console.log(`✓ Successfully packaged Chrome Web Store bundle: cineforge-ai-v1.0.0.zip (${sizeMB} MB)`);
}

packageExtension().catch(console.error);
