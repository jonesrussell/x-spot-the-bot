import { promises as fs } from 'fs';

async function copyManifest() {
  try {
    // Read the source manifest
    const manifest = JSON.parse(
      await fs.readFile('src/manifest.json', 'utf-8')
    );

    // Ensure required fields are present
    const finalManifest = {
      ...manifest,
      manifest_version: 3,
      name: "X Spot The Bot",
      short_name: "XSpotBot",
      version: "1.0.0",
      description: "Identifies potential bot accounts in X (Twitter) notifications",
      action: {
        default_title: "X Spot The Bot",
        default_icon: {
          "16": "icons/icon16.png",
          "32": "icons/icon32.png",
          "48": "icons/icon48.png",
          "128": "icons/icon128.png"
        }
      }
    };

    // Create dist directory if it doesn't exist
    await fs.mkdir('dist', { recursive: true });

    // Write the manifest with proper formatting
    await fs.writeFile(
      'dist/manifest.json',
      JSON.stringify(finalManifest, null, 2),
      'utf-8'
    );

    console.log('✓ Manifest copied successfully');
  } catch (error) {
    console.error('Error copying manifest:', error);
    process.exit(1);
  }
}

copyManifest(); 