import https from 'https';
import fs from 'fs';
import path from 'path';

const files = {
  trimbakeshwar: [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Trimbakeshwar_Shiva_Temple.jpg/800px-Trimbakeshwar_Shiva_Temple.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Trimbakeshwar_Temple%2C_Nashik.jpg/800px-Trimbakeshwar_Temple%2C_Nashik.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Trimbakeshwar_Shiva_Temple_2005.jpg/800px-Trimbakeshwar_Shiva_Temple_2005.jpg"
  ],
  ramkund: [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ram_Kund%2C_Nashik.jpg/800px-Ram_Kund%2C_Nashik.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Ramkund_Nashik.jpg/800px-Ramkund_Nashik.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Panchavati-Ramkund.jpg/800px-Panchavati-Ramkund.jpg"
  ],
  ellora: [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Ellora_Caves_Aurangabad_Maharashtra.jpg/800px-Ellora_Caves_Aurangabad_Maharashtra.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Beautiful_Ellora_Caves.jpg/800px-The_Beautiful_Ellora_Caves.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Ellora_caves!.jpg/800px-Ellora_caves!.jpg"
  ],
  ajanta: [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Ajanta_Caves%2C_India%2C_Panoramic_view_of_Ajanta_basalt_cliffs_and_caves.jpg/800px-Ajanta_Caves%2C_India%2C_Panoramic_view_of_Ajanta_basalt_cliffs_and_caves.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ajanta_Padmapani.jpg/800px-Ajanta_Padmapani.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ajanta_(63).jpg/800px-Ajanta_(63).jpg"
  ]
};

const destDir = path.join(process.cwd(), 'public', 'assets', 'images', 'tourism');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (response) => {
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
  for (const [key, urls] of Object.entries(files)) {
    let index = 1;
    for (const wikiUrl of urls) {
      const filename = `${key}_${index}.jpg`;
      const dest = path.join(destDir, filename);
      const ddgUrl = `https://external-content.duckduckgo.com/iu/?u=${encodeURIComponent(wikiUrl)}`;
      
      console.log(`Downloading ${filename} via Proxy...`);
      try {
        await download(ddgUrl, dest);
        
        // Verify file size to ensure it's not a tiny error page
        const stats = fs.statSync(dest);
        if (stats.size < 1000) {
           throw new Error(`File too small (${stats.size} bytes). Likely an error page.`);
        }
        
        console.log(`Successfully saved ${filename} (${Math.round(stats.size/1024)} KB)`);
        await delay(1000); 
      } catch (err) {
        console.error(`Failed to download ${filename}:`, err);
      }
      index++;
    }
  }
}

run();
