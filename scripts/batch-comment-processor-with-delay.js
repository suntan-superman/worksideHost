const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function processFile(filePath) {
  try {
    const cursorCommand = `cursor --file "${filePath}" --command "add comprehensive comments to this file"`;
    
    console.log(`Processing: ${filePath}`);
    await execPromise(cursorCommand);
    console.log(`✅ Completed: ${filePath}`);
    
    await delay(2000);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
} 