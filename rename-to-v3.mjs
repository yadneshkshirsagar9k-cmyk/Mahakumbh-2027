import fs from 'fs';
import path from 'path';

const destinations = [
  'bhimashankar',
  'grishneshwar',
  'aundha-nagnath',
  'parli-vaijnath',
  'pandharpur',
  'dagadusheth',
  'siddhivinayak',
  'kolhapur-mahalakshmi',
  'tuljapur',
  'saptashrungi',
  'shegaon',
  'hazur-sahib',
  'kalaram-temple',
  'kushavarta-kund',
  'anjaneri-hills',
  'pandavleni-caves',
  'kapaleshwar-temple',
  'muktidham-temple'
];

const dir = 'public/assets/images/tourism';

// 1. Rename files on disk
console.log("Renaming images on disk to _v3.jpg to bust Next.js cache...");
for (const id of destinations) {
  for (let i = 1; i <= 3; i++) {
    const oldName = `${id}_${i}.jpg`;
    const newName = `${id}_${i}_v3.jpg`;
    const oldPath = path.join(dir, oldName);
    const newPath = path.join(dir, newName);
    
    if (fs.existsSync(oldPath)) {
      try {
        fs.renameSync(oldPath, newPath);
        console.log(`  Renamed: ${oldName} -> ${newName}`);
      } catch (e) {
        console.error(`  Failed to rename ${oldName}:`, e.message);
      }
    } else {
      console.log(`  File not found: ${oldName}`);
    }
  }
}

// 2. Update page.tsx
const pagePath = 'app/account/discover-maharashtra/page.tsx';
console.log(`\nUpdating image paths in ${pagePath} to _v3.jpg...`);
try {
  let content = fs.readFileSync(pagePath, 'utf8');
  
  for (const id of destinations) {
    for (let i = 1; i <= 3; i++) {
      const oldSearch = `/assets/images/tourism/${id}_${i}.jpg`;
      const newReplace = `/assets/images/tourism/${id}_${i}_v3.jpg`;
      content = content.replaceAll(oldSearch, newReplace);
    }
  }
  
  fs.writeFileSync(pagePath, content, 'utf8');
  console.log("Successfully updated page.tsx!");
} catch (e) {
  console.error("Failed to update page.tsx:", e.message);
}
