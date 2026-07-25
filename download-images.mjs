import https from 'https';
import fs from 'fs';
import path from 'path';

const images = [
  'https://commons.wikimedia.org/wiki/Special:FilePath/Trimbakeshwar_Temple,_Nashik.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Trimbakeshwar_Shiva_Temple_2005.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ram_Kund,_Nashik.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ramkund_Nashik.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ellora_Caves_Aurangabad_Maharashtra.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/The_Beautiful_Ellora_Caves.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ellora_caves!.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Ajanta_Caves,_India,_Panoramic_view_of_Ajanta_basalt_cliffs_and_caves.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Shirdi_Sai_Baba_Samadhi.jpg'
];

const destDir = path.join(process.cwd(), 'public', 'assets', 'images', 'tourism');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 MahakumbhBot/2.0' } }, (response) => {
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
  for (let i = 0; i < images.length; i++) {
    const url = images[i];
    const originalName = decodeURIComponent(url.split('/').pop());
    const filename = originalName.replace(/[^a-zA-Z0-9.\-]/g, '_');
    const dest = path.join(destDir, filename);
    console.log(`Downloading ${filename}...`);
    try {
      await download(url, dest);
      console.log(`Saved ${filename}`);
      await delay(2500); // 2.5 second delay
    } catch (err) {
      console.error(`Failed to download ${filename}:`, err);
    }
  }
}

run();
