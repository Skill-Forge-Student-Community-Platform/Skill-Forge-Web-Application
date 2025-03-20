const fs = require('fs');
const path = require('path');

// Define required directories
const requiredDirs = [
  'public',
  'public/uploads',
  'public/uploads/avatars',
  'public/uploads/badges',
  'public/uploads/certificates'
];

/**
 * Ensure all required directories exist
 * @returns {void}
 */
function ensureDirectories() {
  console.log('Checking and creating required directories...');
  
  requiredDirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`Creating directory: ${fullPath}`);
      fs.mkdirSync(fullPath, { recursive: true });
    } else {
      console.log(`Directory already exists: ${fullPath}`);
    }
  });
  
  console.log('Directory setup complete!');
}

// If this script is run directly
if (require.main === module) {
  ensureDirectories();
}

module.exports = { ensureDirectories };
