const fs = require('fs');
const path = require('path');

const checkComments = (dir) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      checkComments(filePath);
    } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const hasFileDoc = content.includes('@fileoverview');
      
      console.log(`${filePath}: ${hasFileDoc ? '✅' : '❌'} Documentation`);
    }
  });
};

checkComments('./src'); // Start from your src directory 