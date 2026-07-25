import https from 'https';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const filesToDownload = [
  {
    filename: 'Kushawart,_Trimbakeshwar_in_Maharashtra_state,_India.jpg',
    destPath: 'public/assets/images/tourism/trimbakeshwar_3_v2.jpg'
  },
  {
    filename: 'Ellora_Caves,_India,_The_Vishvakarma_Buddhist_Cave.jpg',
    destPath: 'public/assets/images/tourism/ellora_3_v2.jpg'
  },
  {
    filename: 'Boundary_wall_of_Shirdi_temple.jpg',
    destPath: 'public/assets/images/shirdi/shirdi-2_v2.jpg'
  },
  {
    filename: 'Kalash_shirdi_temple.jpg',
    destPath: 'public/assets/images/shirdi/shirdi-3_v2.jpg'
  }
];

function getWikimediaUrl(filename) {
  // Hash the filename using MD5 to get the path structure
  const hash = crypto.createHash('md5').update(filename).digest('hex');
  const h1 = hash[0];
  const h2 = hash.slice(0, 2);
  const escapedFilename = encodeURIComponent(filename).replace(/'/g, "%27");
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
  for (const item of filesToDownload) {
    const url = getWikimediaUrl(item.filename);
    console.log(`Downloading ${item.filename} from:\n  ${url}\n  to ${item.destPath}...`);
    try {
      await download(url, item.destPath);
      const stats = fs.statSync(item.destPath);
      console.log(`Success! Saved ${item.destPath} (${Math.round(stats.size / 1024)} KB)\n`);
      await delay(2000); // Respectful 2s delay
    } catch (err) {
      console.error(`Failed to download ${item.filename}:`, err.message, `\n`);
    }
  }
}

run();
