const fs = require('fs');
const path = require('path');

// Read the unpkg downloaded file
const contentPath = 'C:\\Users\\prite\\.gemini\\antigravity\\brain\\f02e9949-7279-4b38-a87a-b8380e909684\\.system_generated\\steps\\1211\\content.md';
const fileContent = fs.readFileSync(contentPath, 'utf8');

// The file contains raw js after line 9
// Let's find the 'v=' definition
const jsStartIndex = fileContent.indexOf('"use strict";');
const jsCode = fileContent.substring(jsStartIndex);

// Let's find the definition of v
// We know it is formatted as v={SOL:"...",AHM:"...",...}
const vStartIndex = jsCode.indexOf('v={SOL:');
if (vStartIndex === -1) {
  console.error("Could not find start of paths object v!");
  process.exit(1);
}

// Find the matching closing bracket for v
let openBrackets = 1;
let vEndIndex = vStartIndex + 2; // skip 'v=' and '{'
while (openBrackets > 0 && vEndIndex < jsCode.length) {
  const char = jsCode[vEndIndex];
  if (char === '{') openBrackets++;
  else if (char === '}') openBrackets--;
  vEndIndex++;
}

const vObjectString = jsCode.substring(vStartIndex, vEndIndex);

// Let's write it to a TypeScript file
const outPath = 'C:\\Users\\prite\\OneDrive\\Desktop\\my-shirdi-ws\\constants\\maharashtra-svg-paths.ts';
fs.writeFileSync(outPath, `/**
 * @file maharashtra-svg-paths.ts
 * @description High-fidelity SVG paths for all 35 district regions of Maharashtra.
 * Extracted from the svgmap-maharashtra package.
 */

export const MAHARASHTRA_VIEWBOX = "1132 -929.7 3105.8 2453";

export const MAHARASHTRA_DISTRICT_CODES = [
  "SOL", "AHM", "RAI", "JLN", "GON", "NAN", "WAR", "KOL", "BUL", "CHA", "SIN", "JAL",
  "AUR", "WAS", "NAG", "BEE", "GAD", "MUM", "USM", "THA", "AMA", "YAV", "NDB", "AKO",
  "PUN", "LAT", "HIN", "RAT", "NAS", "SAT", "PAR", "BHA", "SAN", "PAL", "DHU"
];

export const MAHARASHTRA_DISTRICT_NAMES: Record<string, string> = {
  GAD: "Gadchiroli",
  GON: "Gondia",
  CHA: "Chandrapur",
  BHA: "Bhandara",
  NAG: "Nagpur",
  WAR: "Wardha",
  YAV: "Yavatmal",
  AMA: "Amravati",
  AKO: "Akola",
  WAS: "Washim",
  NAN: "Nanded",
  HIN: "Hingoli",
  PAR: "Parbhani",
  BUL: "Buldhana",
  JAL: "Jalgaon",
  DHU: "Dhule",
  NDB: "Nandurbar",
  NAS: "Nashik",
  AHM: "Ahmednagar",
  JLN: "Jalna",
  AUR: "Aurangabad",
  LAT: "Latur",
  USM: "Osmanabad",
  BEE: "Beed",
  SOL: "Solapur",
  SAN: "Sangli",
  KOL: "Kolhapur",
  SAT: "Satara",
  PUN: "Pune",
  PAL: "Palghar",
  THA: "Thane",
  MUM: "Mumbai",
  RAI: "Raigad",
  RAT: "Ratnagiri",
  SIN: "Sindhudurg"
};

export const MAHARASHTRA_SVG_PATHS: Record<string, string> = ${vObjectString.replace('v=', '')};
`);

console.log("Successfully extracted SVG paths!");
