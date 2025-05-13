const { execSync } = require('child_process');
const path = require('path');

// Ensure we're in the frontend directory
process.chdir(path.join(__dirname));

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Run the build
  console.log('Building the application...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 