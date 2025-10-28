/**
 * AUDIT API CALLS IN WORKSIDEHOST
 * 
 * Finds all raw fetch() and axios() calls that need auth tokens
 * 
 * Usage: node audit-api-calls.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Check worksideAPI.jsx for raw API calls
const apiFile = path.join(__dirname, 'src/api/worksideAPI.jsx');
const content = fs.readFileSync(apiFile, 'utf-8');
const lines = content.split('\n');

console.log(`\n${colors.bold}${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}║     WORKSIDEHOST API AUTHENTICATION AUDIT                       ║${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

console.log(`${colors.cyan}Analyzing: src/api/worksideAPI.jsx${colors.reset}\n`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

const issues = [];

// Find all function definitions
const functionPattern = /^(?:export )?const (\w+) = async/;
let currentFunction = null;
let inFunction = false;
let braceDepth = 0;
let functionStartLine = 0;

lines.forEach((line, index) => {
  const lineNum = index + 1;
  
  // Track function boundaries
  const funcMatch = line.match(functionPattern);
  if (funcMatch) {
    currentFunction = funcMatch[1];
    inFunction = true;
    braceDepth = 0;
    functionStartLine = lineNum;
  }
  
  if (inFunction) {
    braceDepth += (line.match(/{/g) || []).length;
    braceDepth -= (line.match(/}/g) || []).length;
    
    if (braceDepth <= 0 && line.includes('}')) {
      inFunction = false;
    }
  }
  
  // Skip if in fetchWithHandling or apiRequest (these ARE the auth helpers)
  if (currentFunction === 'fetchWithHandling' || currentFunction === 'apiRequest') {
    return;
  }
  
  // Skip public endpoints that don't require authentication
  const publicEndpoints = ['UserLogin', 'UserRegister'];
  if (publicEndpoints.includes(currentFunction)) {
    return;
  }
  
  // Look for raw fetch() calls
  if (line.includes('await fetch(') && inFunction) {
    // Check if this fetch includes Authorization header in next few lines
    const contextLines = lines.slice(index, index + 10).join('\n');
    const hasAuth = /Authorization.*Bearer/.test(contextLines) || 
                    /headers.*Authorization/.test(contextLines);
    
    if (!hasAuth) {
      issues.push({
        type: 'RAW_FETCH',
        function: currentFunction,
        line: lineNum,
        code: line.trim(),
      });
    }
  }
  
  // Look for raw axios() calls (not using helpers)
  if (line.match(/await axios\.(get|post|patch|put|delete)\(/i) && inFunction) {
    // Check if this axios call includes headers with auth (check more lines and look for token)
    const contextLines = lines.slice(Math.max(0, index - 5), index + 10).join('\n');
    const hasAuth = /headers.*Authorization/.test(contextLines) || 
                    /const token = localStorage\.getItem/.test(contextLines);
    
    if (!hasAuth && currentFunction !== 'fetchWithHandling' && currentFunction !== 'apiRequest') {
      issues.push({
        type: 'RAW_AXIOS',
        function: currentFunction,
        line: lineNum,
        code: line.trim(),
      });
    }
  }
});

// Print results
let fixedCount = 0;
let unfixedCount = 0;

issues.forEach(issue => {
  // Check if this function uses fetchWithHandling or apiRequest
  const functionCode = content.substring(
    content.indexOf(`const ${issue.function} =`),
    content.indexOf(`const ${issue.function} =`) + 1000
  );
  
  const usesFetchWithHandling = /fetchWithHandling/.test(functionCode);
  const usesApiRequest = /apiRequest/.test(functionCode);
  
  if (usesFetchWithHandling || usesApiRequest) {
    console.log(`${colors.green}✓ ${colors.bold}${issue.function}${colors.reset} ${colors.green}(Line ${issue.line})${colors.reset}`);
    console.log(`  ${colors.green}Already uses authenticated helper${colors.reset}\n`);
    fixedCount++;
  } else {
    console.log(`${colors.red}❌ ${colors.bold}${issue.function}${colors.reset} ${colors.red}(Line ${issue.line})${colors.reset}`);
    console.log(`  ${colors.red}Uses: ${issue.type}${colors.reset}`);
    console.log(`  ${colors.yellow}${issue.code}${colors.reset}`);
    console.log(`  ${colors.cyan}Fix: Convert to use fetchWithHandling() or apiRequest()${colors.reset}\n`);
    unfixedCount++;
  }
});

// Summary
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bold}SUMMARY:${colors.reset}\n`);
console.log(`  Total Issues Found:       ${issues.length}`);
console.log(`  ${colors.green}Already Using Helpers:   ${fixedCount}${colors.reset}`);
console.log(`  ${colors.red}Need Fixing:             ${unfixedCount}${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

if (unfixedCount === 0) {
  console.log(`${colors.green}${colors.bold}✅ ALL API CALLS ARE AUTHENTICATED!${colors.reset}\n`);
} else {
  console.log(`${colors.red}${colors.bold}⚠️  ${unfixedCount} FUNCTIONS NEED AUTH TOKENS${colors.reset}\n`);
  console.log(`${colors.yellow}These functions will fail with 401 errors when called.${colors.reset}\n`);
}

process.exit(unfixedCount > 0 ? 1 : 0);

