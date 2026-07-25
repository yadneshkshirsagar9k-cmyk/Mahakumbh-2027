import https from 'https';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const filesToDownload = [
  {
    filename: 'Kalaram Temple Nashik Corner View.jpg',
    destPath: 'public/assets/images/tourism/kalaram_temple_1.jpg'
  },
  {
    filename: 'Pandavleni-B Picture-1.jpg',
    destPath: 'public/assets/images/tourism/pandavleni_1.jpg'
  },
  {
    filename: 'Kapaleshwar Temple (west view).jpg',
    destPath: 'public/assets/images/tourism/kapaleshwar_1.jpg'
  },
  {
    filename: 'Anjineri fort Nasik.jpg',
    destPath: 'public/assets/images/tourism/anjaneri_1.jpg'
  },
  {
    filename: 'Muktidham Temple, Nashik, Maharastra.jpg',
    destPath: 'public/assets/images/tourism/muktidham_1.jpg'
  }
];

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
    https.get(url, { headers: { 'User-Agent': 'MahakumbhTourismApp/2.0 (dev@mahakumbhapp.com)' } }, (response) => {
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
  console.log("Starting batch download of Kumbh Mela locations...");
  for (const item of filesToDownload) {
    const url = getWikimediaUrl(item.filename);
    console.log(`Downloading ${item.filename}...`);
    try {
      await download(url, item.destPath);
      const stats = fs.statSync(item.destPath);
      console.log(`Successfully saved ${item.destPath} (${Math.round(stats.size / 1024)} KB)`);
      await delay(2000); // 2s delay
    } catch (err) {
      console.error(`Failed to download ${item.filename}:`, err.message);
      await delay(1000);
    }
  }
  
  // Local Copy for Kushavarta
  const srcKushavarta = 'public/assets/images/tourism/trimbakeshwar_3_v2.jpg';
  const destKushavarta = 'public/assets/images/tourism/kushavarta_1.jpg';
  console.log(`Copying Kushavarta Kund local file...`);
  try {
     fs.copyFileSync(srcKushavarta, destKushavarta);
     console.log(`Successfully copied Kushavarta Kund!`);
  } catch (err) {
     console.error(`Failed to copy Kushavarta:`, err.message);
  }
  
  console.log("Done!");
}

run();
