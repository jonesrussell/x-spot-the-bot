import { copyFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const srcDir = resolve(__dirname, '../src');
const distDir = resolve(__dirname, '../dist');
const iconDir = resolve(distDir, 'icons');

// Create dist directory if it doesn't exist
mkdirSync(distDir, { recursive: true });
mkdirSync(iconDir, { recursive: true });

// Copy manifest
copyFileSync(
  resolve(srcDir, 'manifest.json'),
  resolve(distDir, 'manifest.json')
);

// Copy icons
copyFileSync(
  resolve(srcDir, 'icons/icon48.png'),
  resolve(distDir, 'icons/icon48.png')
);
copyFileSync(
  resolve(srcDir, 'icons/icon128.png'),
  resolve(distDir, 'icons/icon128.png')
); 