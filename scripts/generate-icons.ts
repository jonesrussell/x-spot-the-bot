import { promises as fs } from 'fs';
import { join } from 'path';
import { createCanvas } from 'canvas';

async function generateIcons() {
  try {
    const sizes = [16, 32, 48, 128];
    const iconDir = join('src', 'icons');
    
    // Ensure icons directory exists
    await fs.mkdir(iconDir, { recursive: true }).catch(() => {});

    for (const size of sizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');

      // Draw icon (simple placeholder)
      ctx.fillStyle = '#1DA1F2'; // Twitter blue
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = 'white';
      ctx.font = `${size * 0.6}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🤖', size/2, size/2);

      // Save as PNG
      const buffer = canvas.toBuffer('image/png');
      const iconPath = join(iconDir, `icon${size}.png`);
      await fs.writeFile(iconPath, buffer);
    }

    console.log('✓ Icons generated successfully');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 