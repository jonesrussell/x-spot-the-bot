import { writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateIcon(size: number): Promise<Buffer> {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Draw a simple robot icon
  ctx.fillStyle = '#1DA1F2';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = 'white';
  ctx.font = `${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🤖', size/2, size/2);

  return canvas.toBuffer('image/png');
}

async function generateIcons() {
  const sizes = [48, 128];
  const iconDir = resolve(__dirname, '../src/icons');
  
  await mkdir(iconDir, { recursive: true });

  for (const size of sizes) {
    const iconData = await generateIcon(size);
    await writeFile(resolve(iconDir, `icon${size}.png`), iconData);
  }
}

generateIcons().catch(console.error); 