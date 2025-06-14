const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const MAX_WIDTH = 1200; // Maximum width for images
const COMPRESSED_DIR = 'compressed_images';
const PNG_QUALITY = 80; // PNG compression quality (0-100)
const REPLACE_ORIGINALS = true; // Set to true to replace original images with compressed ones

// Create compressed directory if it doesn't exist
if (!fs.existsSync(COMPRESSED_DIR)) {
  fs.mkdirSync(COMPRESSED_DIR, { recursive: true });
}

// Function to compress a single image
async function compressImage(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Calculate new dimensions while maintaining aspect ratio
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width);
      width = MAX_WIDTH;
    }

    // Process the image
    await image
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .png({
        quality: PNG_QUALITY,
        compressionLevel: 9, // Maximum compression
        palette: true, // Enable palette mode for better compression
        effort: 10 // Maximum effort for compression
      })
      .toFile(outputPath);

    // Get original and compressed sizes
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

    console.log(`\nProcessing: ${path.basename(inputPath)}`);
    console.log(`Original path: ${inputPath}`);
    console.log(`Compressed path: ${outputPath}`);
    console.log(`Original size: ${(originalSize / 1024).toFixed(2)}KB`);
    console.log(`Compressed size: ${(compressedSize / 1024).toFixed(2)}KB`);
    console.log(`Savings: ${savings}%`);

    // Replace original with compressed if enabled
    if (REPLACE_ORIGINALS) {
      fs.copyFileSync(outputPath, inputPath);
      console.log(`Replaced original with compressed version`);
    }

  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

// Function to process all images in a directory
async function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Create corresponding directory in compressed folder
      const relativePath = path.relative('public/images', fullPath);
      const compressedDir = path.join(COMPRESSED_DIR, relativePath);
      if (!fs.existsSync(compressedDir)) {
        fs.mkdirSync(compressedDir, { recursive: true });
      }
      await processDirectory(fullPath);
    } else if (stat.isFile() && /\.png$/i.test(item)) {
      // Process PNG file
      const relativePath = path.relative('public/images', fullPath);
      const outputPath = path.join(COMPRESSED_DIR, relativePath);
      await compressImage(fullPath, outputPath);
    }
  }
}

// Main function
async function main() {
  console.log('Starting PNG image compression...\n');
  console.log('Configuration:');
  console.log(`- Max width: ${MAX_WIDTH}px`);
  console.log(`- PNG quality: ${PNG_QUALITY}%`);
  console.log(`- Replace originals: ${REPLACE_ORIGINALS ? 'Yes' : 'No'}`);
  console.log('\nDirectory structure:');
  console.log(`Source: ${path.resolve('public/images')}`);
  console.log(`Compressed: ${path.resolve(COMPRESSED_DIR)}\n`);
  
  const sourceDir = path.join('public', 'images');
  
  if (!fs.existsSync(sourceDir)) {
    console.error('Source directory not found:', sourceDir);
    return;
  }

  try {
    await processDirectory(sourceDir);
    console.log('\nPNG compression completed!');
    if (REPLACE_ORIGINALS) {
      console.log('Original images have been replaced with compressed versions.');
    } else {
      console.log(`Compressed images are in: ${path.resolve(COMPRESSED_DIR)}`);
    }
  } catch (error) {
    console.error('Error during compression:', error);
  }
}

main(); 