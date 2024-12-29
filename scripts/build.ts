import { copyFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = resolve(__dirname, '../src');
const distDir = resolve(__dirname, '../dist');
const iconDir = resolve(distDir, 'icons');

async function build() {
  // Create directories
  await mkdir(distDir, { recursive: true });
  await mkdir(iconDir, { recursive: true });

  // Copy manifest
  await copyFile(
    resolve(srcDir, 'manifest.json'),
    resolve(distDir, 'manifest.json')
  );

  // Copy icons (assuming they exist)
  try {
    await copyFile(
      resolve(srcDir, 'icons/icon48.png'),
      resolve(distDir, 'icons/icon48.png')
    );
    await copyFile(
      resolve(srcDir, 'icons/icon128.png'),
      resolve(distDir, 'icons/icon128.png')
    );
  } catch (error) {
    console.warn('Icons not found, skipping...');
  }
}

build().catch(console.error); 