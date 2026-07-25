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
  { id: 'saptashrungi', query: 'Goddess Saptashrungi Devi Temple' },
  { id: 'shegaon', query: 'Gajanan Maharaj Temple Shegaon' },
  { id: 'hazur-sahib', query: 'Hazur Sahib' },
  { id: 'kalaram-temple', query: 'Kalaram Temple' },
  { id: 'kushavarta-kund', query: 'Kushavarta Kund' },
  { id: 'anjaneri-hills', query: 'Anjaneri' },
  { id: 'pandavleni-caves', query: 'Pandavleni' },
  { id: 'kapaleshwar-temple', query: 'Kapaleshwar Temple' },
  { id: 'muktidham-temple', query: 'Muktidham Nashik' }
];

function searchWikimedia(query) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json&srlimit=15`;
    https.get(url, { headers: { 'User-Agent': 'MahakumbhTourismApp/3.0 (dev@mahakumbhapp.com)' } }, (res) => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(d);
          const results = parsed.query?.search || [];
          // Filter for JPEGs/PNGs only
          const imageFilenames = results
            .map(r => r.title.replace(/^File:/, ''))
            .filter(name => name.match(/\.(jpe?g|png)$/i))
            .slice(0, 3);
          resolve(imageFilenames);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

function getWikimediaUrl(filename) {
  const canonicalName = filename.replace(/\s+/g, '_');
  const hash = crypto.createHash('md5').update(canonicalName).digest('hex');
  const h1 = hash[0];
  const h2 = hash.slice(0, 2);
  const escapedFilename = encodeURIComponent(canonicalName).replace(/'/g, "%27");
  return `https://upload.wikimedia.org/wikipedia/commons/${h1}/${h2}/${escapedFilename}`;
}

async function download(url, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'MahakumbhTourismApp/3.0 (dev@mahakumbhapp.com)' } }, (response) => {
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
  console.log("Starting full-gallery downloads for 18 destinations...");
  for (const dest of destinations) {
    console.log(`\nSearching images for "${dest.id}"...`);
    const filenames = await searchWikimedia(dest.query);
    console.log(`Found:`, filenames);
    
    let index = 1;
    for (const filename of filenames) {
      const destPath = `public/assets/images/tourism/${dest.id}_${index}.jpg`;
      const url = getWikimediaUrl(filename);
      console.log(`  Downloading image ${index} from ${url}...`);
      try {
        await download(url, destPath);
        const size = fs.statSync(destPath).size;
        console.log(`  Saved ${destPath} (${Math.round(size / 1024)} KB)`);
        await delay(1500); // 1.5s delay to be safe
      } catch (err) {
        console.error(`  Error downloading image ${index}:`, err.message);
      }
      index++;
    }
  }
  console.log("\nAll galleries downloaded!");
}

run();
