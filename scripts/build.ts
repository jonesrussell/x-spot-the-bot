import { promises as fs } from 'fs';
import { join } from 'path';

async function copyFiles() {
  try {
    // Create dist directory if it doesn't exist
    await fs.mkdir('dist', { recursive: true }).catch(() => {});

    // Copy manifest
    await fs.copyFile('src/manifest.json', 'dist/manifest.json');

    // Copy icons
    const iconDir = join('dist', 'icons');
    await fs.mkdir(iconDir, { recursive: true }).catch(() => {});
    
    // Use withFileTypes to avoid fs.Stats
    const entries = await fs.readdir('src/icons', { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.png')) {
        const srcPath = join('src/icons', entry.name);
        const destPath = join(iconDir, entry.name);
        await fs.copyFile(srcPath, destPath);
      }
    }

    console.log('✓ Files copied successfully');
  } catch (error) {
    console.error('Error copying files:', error);
    process.exit(1);
  }
}

copyFiles(); 