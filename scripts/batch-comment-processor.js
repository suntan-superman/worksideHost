const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function processFile(filePath) {
  try {
    // Construct the cursor CLI command
    const cursorCommand = `cursor --file "${filePath}" --command "add comprehensive comments to this file"`;
    
    console.log(`Processing: ${filePath}`);
    await execPromise(cursorCommand);
    console.log(`✅ Completed: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

async function batchProcessComments(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Recursively process subdirectories
      await batchProcessComments(filePath);
    } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
      await processFile(filePath);
    }
  }
}

// Start the batch process
console.log('Starting batch comment processing...');
batchProcessComments('./src')
  .then(() => console.log('Batch processing completed!'))
  .catch(error => console.error('Batch processing failed:', error)); 