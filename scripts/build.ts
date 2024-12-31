import { copyFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

async function copyFiles() {
  try {
    // Ensure dist directory exists
    await mkdir(resolve(rootDir, 'dist'), { recursive: true });
    await mkdir(resolve(rootDir, 'dist/icons'), { recursive: true });

    // Copy manifest
    await copyFile(
      resolve(rootDir, 'src/manifest.json'),
      resolve(rootDir, 'dist/manifest.json')
    );

    console.log('✓ Files copied successfully');
  } catch (error) {
    console.error('Error copying files:', error);
    process.exit(1);
  }
}

copyFiles(); 