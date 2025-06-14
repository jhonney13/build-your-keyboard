const fs = require('fs');
const path = require('path');

// Create public/images directory if it doesn't exist
const publicImagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Copy files from Files directory to public/images
const sourceDir = path.join(__dirname, 'Files');
const targetDir = path.join(__dirname, 'public', 'images');

// Function to copy directory recursively
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDir(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy the Files directory to public/images
copyDir(sourceDir, targetDir);

console.log('Images have been copied to public/images directory'); 