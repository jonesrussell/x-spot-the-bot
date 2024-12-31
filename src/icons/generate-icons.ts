import { writeFileSync } from 'fs';
import { resolve } from 'path';

const generateIcon = (size: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Draw a simple robot icon
  ctx.fillStyle = '#1DA1F2';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = 'white';
  ctx.font = `${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🤖', size / 2, size / 2);

  return canvas.toDataURL().split(',')[1];
};

const sizes = [48, 128];
sizes.forEach(size => {
  const iconData = generateIcon(size);
  if (iconData) {
    writeFileSync(resolve(__dirname, `icon${size}.png`), Buffer.from(iconData, 'base64'));
  }
});
