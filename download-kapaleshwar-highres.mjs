import https from 'https';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const files = [
  { filename: 'Kapaleshwar Temple (west view).jpg', dest: 'public/assets/images/tourism/kapaleshwar-temple_1.jpg' },
  { filename: 'Kapaleshwar Temple (Internal view).jpg', dest: 'public/assets/images/tourism/kapaleshwar-temple_2.jpg' },
  { filename: 'Kapaleshwar Temple.jpg', dest: 'public/assets/images/tourism/kapaleshwar-temple_3.jpg' }
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

async function run() {
  console.log("Downloading high-resolution files for Kapaleshwar Temple...");
  for (const item of files) {
    const url = getWikimediaUrl(item.filename);
    console.log(`Downloading ${item.filename}...`);
    try {
      await download(url, item.dest);
      const stats = fs.statSync(item.dest);
      console.log(`Successfully saved ${item.dest} (${Math.round(stats.size / 1024)} KB)`);
    } catch (e) {
      console.error(`Failed to download ${item.filename}:`, e.message);
    }
  }
}

run();
