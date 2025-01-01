import { promises as fs } from 'fs';

async function copyManifest() {
  try {
    // Read the source manifest
    const manifest = JSON.parse(
      await fs.readFile('src/manifest.json', 'utf-8')
    );

    // Create dist directory if it doesn't exist
    await fs.mkdir('dist', { recursive: true });

    // Write the manifest with proper formatting
    await fs.writeFile(
      'dist/manifest.json',
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );

    console.log('✓ Manifest copied successfully');
  } catch (error) {
    console.error('Error copying manifest:', error);
    process.exit(1);
  }
}

copyManifest(); 