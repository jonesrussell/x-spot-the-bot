import { writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

async function generateIcon(size: number): Promise<Buffer> {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = '#1DA1F2'; // Twitter blue
  ctx.fillRect(0, 0, size, size);

  // Draw robot emoji
  ctx.fillStyle = 'white';
  ctx.font = `${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🤖', size / 2, size / 2);

  return canvas.toBuffer('image/png');
}

async function generateIcons() {
  try {
    // Create icons directory
    const iconsDir = resolve(rootDir, 'dist/icons');
    await mkdir(iconsDir, { recursive: true });

    // Generate icons
    const sizes = [48, 128];
    for (const size of sizes) {
      const iconData = await generateIcon(size);
      await writeFile(resolve(iconsDir, `icon${size}.png`), iconData);
    }

    console.log('✓ Icons generated successfully');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 