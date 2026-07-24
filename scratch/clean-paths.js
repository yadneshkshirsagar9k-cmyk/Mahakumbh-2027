const fs = require('fs');

const filePath = 'C:\\Users\\prite\\OneDrive\\Desktop\\my-shirdi-ws\\constants\\maharashtra-svg-paths.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Find the last coordinates end in DHU
// We know DHU ends with: 1663.3-417.9L1663.3-417.9z"
const searchStr = '1663.3-417.9L1663.3-417.9z"';
const index = content.indexOf(searchStr);

if (index === -1) {
  console.error("Could not find the end of DHU path coordinates!");
  process.exit(1);
}

// Slice content up to the end of the coordinate quotes
const cleanContent = content.substring(0, index + searchStr.length) + '\n};';

fs.writeFileSync(filePath, cleanContent);
console.log("Successfully cleaned maharashtra-svg-paths.ts!");
