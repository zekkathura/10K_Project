/**
 * Generate properly padded adaptive icon for Android
 *
 * Android adaptive icons need ~25% padding on all sides because
 * launchers crop the foreground into various shapes (circles, squares, etc.)
 *
 * The "safe zone" is roughly the center 66% of the image.
 */

const sharp = require('sharp');
const path = require('path');

const INPUT_LOGO = path.join(__dirname, '../assets/images/10k_logo_whiteOnly.png');
const OUTPUT_ADAPTIVE = path.join(__dirname, '../assets/adaptive-icon.png');

// Adaptive icon dimensions (1024x1024 is ideal for high-res)
const CANVAS_SIZE = 1024;

// The logo should fit in the safe zone (center 66%)
// Adding extra padding to be safe with circular masks
const LOGO_SIZE = Math.floor(CANVAS_SIZE * 0.60); // 60% of canvas = 614px

async function generateAdaptiveIcon() {
  try {
    console.log('Reading source logo...');
    const logoBuffer = await sharp(INPUT_LOGO)
      .resize(LOGO_SIZE, LOGO_SIZE, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    console.log(`Creating ${CANVAS_SIZE}x${CANVAS_SIZE} adaptive icon...`);

    // Calculate position to center the logo
    const offset = Math.floor((CANVAS_SIZE - LOGO_SIZE) / 2);

    // Create canvas with transparent background and composite the logo in center
    await sharp({
      create: {
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([
        {
          input: logoBuffer,
          top: offset,
          left: offset
        }
      ])
      .png()
      .toFile(OUTPUT_ADAPTIVE);

    console.log(`✓ Generated adaptive icon: ${OUTPUT_ADAPTIVE}`);
    console.log(`  Canvas: ${CANVAS_SIZE}x${CANVAS_SIZE}`);
    console.log(`  Logo: ${LOGO_SIZE}x${LOGO_SIZE} (centered)`);
    console.log(`  Padding: ${offset}px on each side (~${Math.round(offset/CANVAS_SIZE*100)}%)`);
  } catch (error) {
    console.error('Error generating adaptive icon:', error);
    process.exit(1);
  }
}

generateAdaptiveIcon();
