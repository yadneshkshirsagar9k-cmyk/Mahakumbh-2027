import https from 'https';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const destinations = [
  { id: 'bhimashankar', query: 'Bhimashankar Temple' },
  { id: 'grishneshwar', query: 'Grishneshwar Temple' },
  { id: 'aundha-nagnath', query: 'Aundha Nagnath Temple' },
  { id: 'parli-vaijnath', query: 'Parli Vaijnath Temple' },
  { id: 'pandharpur', query: 'Vithoba Temple Pandharpur' },
  { id: 'dagadusheth', query: 'Dagadusheth Halwai Ganapati Temple' },
  { id: 'siddhivinayak', query: 'Siddhivinayak Temple Mumbai' },
  { id: 'kolhapur-mahalakshmi', query: 'Mahalakshmi Temple Kolhapur' },
  { id: 'tuljapur', query: 'Tulja Bhavani temple' },
  { id: 'saptashrungi', query: 'Saptashrungi Devi Temple' },
  { id: 'shegaon', query: 'Gajanan Maharaj Temple Shegaon' },
  { id: 'hazur-sahib', query: 'Hazur Sahib Nanded' },
  { id: 'kalaram-temple', query: 'Kalaram Temple Nashik' },
  { id: 'kushavarta-kund', query: 'Kushavarta Kund Trimbak' },
  { id: 'anjaneri-hills', query: 'Anjaneri Hills' },
  { id: 'pandavleni-caves', query: 'Pandavleni Caves' },
  { id: 'kapaleshwar-temple', query: 'Kapaleshwar Temple Nashik' },
  { id: 'muktidham-temple', query: 'Muktidham Nashik' }
];

function apiRequest(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'MahakumbhTourismApp/4.0 (dev@mahakumbhapp.com)' } }, (res) => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function getHighResImages(query) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json&srlimit=40`;
  const searchData = await apiRequest(searchUrl);
  const results = searchData?.query?.search || [];
  
  const validImages = [];
  
  for (const item of results) {
    const filename = item.title.replace(/^File:/, '');
    if (!filename.match(/\.(jpe?g|png)$/i)) continue;
    
    // Fetch image info (width, height, size)
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=size|url&titles=File:${encodeURIComponent(filename)}&format=json`;
    const infoData = await apiRequest(infoUrl);
    const pages = infoData?.query?.pages || {};
    const pageId = Object.keys(pages)[0];
    const info = pages[pageId]?.imageinfo?.[0];
    
    if (info) {
      const width = info.width || 0;
      const height = info.height || 0;
      const size = info.size || 0;
      
      // Filter criteria: Minimum width of 1000px, height of 700px, and size > 80 KB
      // To ensure no tiny icons, avatars, or low-res paintings get selected
      if (width >= 1000 && height >= 700 && size > 80000) {
        validImages.push({
          filename,
          width,
          height,
          size,
          url: info.url
        });
      }
    }
    
    if (validImages.length >= 3) break;
  }
  
  return validImages;
}

async function download(url, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'MahakumbhTourismApp/4.0 (dev@mahakumbhapp.com)' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 308) {
        return resolve(download(response.headers.location, dest));
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log("Starting High-Resolution batch downloads for all 18 galleries...");
  for (const dest of destinations) {
    console.log(`\nProcessing "${dest.id}"...`);
    const images = await getHighResImages(dest.query);
    console.log(`Found ${images.length} high-res images.`);
    
    let index = 1;
    for (const img of images) {
      const destPath = `public/assets/images/tourism/${dest.id}_${index}.jpg`;
      console.log(`  Downloading image ${index}: ${img.filename} (${img.width}x${img.height}, ${Math.round(img.size/1024)} KB)...`);
      try {
        await download(img.url, destPath);
        console.log(`  Success!`);
        await delay(1000);
      } catch (err) {
        console.error(`  Failed to download ${img.filename}: ${err.message}`);
      }
      index++;
    }
    
    // Fill in missing images if less than 3 were found
    if (images.length > 0 && images.length < 3) {
      console.log(`  Only found ${images.length} images. Duplicating to fill 3 slots...`);
      for (let i = images.length + 1; i <= 3; i++) {
        const srcPath = `public/assets/images/tourism/${dest.id}_1.jpg`;
        const destPath = `public/assets/images/tourism/${dest.id}_${i}.jpg`;
        try {
          fs.copyFileSync(srcPath, destPath);
          console.log(`  Duplicated image 1 to ${destPath}`);
        } catch (e) {
          console.error(`  Failed to duplicate: ${e.message}`);
        }
      }
    }
  }
  console.log("\nAll high-resolution galleries successfully updated!");
}

run();
