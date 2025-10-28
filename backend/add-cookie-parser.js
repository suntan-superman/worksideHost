const fs = require('fs');
const path = require('path');

// Read the server.js file
const serverPath = path.join(__dirname, 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Add cookie-parser import after express
serverContent = serverContent.replace(
  'const express = require("express");',
  'const express = require("express");\nconst cookieParser = require("cookie-parser");'
);

// Add cookie parser middleware after express.json
serverContent = serverContent.replace(
  'app.use(express.json({ limit: "50mb" }));',
  'app.use(express.json({ limit: "50mb" }));\napp.use(cookieParser());'
);

// Write the updated content back
fs.writeFileSync(serverPath, serverContent);

console.log('✅ Added cookie-parser to server.js');
