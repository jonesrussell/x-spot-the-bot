import { promises as fs } from 'fs';
import { join } from 'path';

async function generateIcons() {
  try {
    const sizes = [16, 32, 48, 128];
    const iconDir = join('src', 'icons');
    
    // Ensure icons directory exists
    await fs.mkdir(iconDir, { recursive: true }).catch(() => {});

    // Create a simple robot icon SVG
    const createSVG = (size: number) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#1DA1F2"/>
  <text x="${size/2}" y="${size/2}" font-family="Arial" font-size="${size * 0.6}" 
    fill="white" text-anchor="middle" dominant-baseline="middle">🤖</text>
</svg>`;

    for (const size of sizes) {
      const svgContent = createSVG(size);
      const iconPath = join(iconDir, `icon${size}.svg`);
      await fs.writeFile(iconPath, svgContent, 'utf8');
    }

    console.log('✓ Icons generated successfully');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 