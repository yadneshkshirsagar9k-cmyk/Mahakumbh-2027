import https from 'https';
import fs from 'fs';
import path from 'path';

const files = {
  trimbakeshwar: [
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
    "https://images.unsplash.com/photo-1623062635399-52264b4c10c1?w=800&q=80",
    "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80"
  ],
  ramkund: [
    "https://images.unsplash.com/photo-1600077625368-809c951bb7fc?w=800&q=80",
    "https://images.unsplash.com/photo-1627850893325-10330dcaf826?w=800&q=80",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80"
  ],
  ellora: [
    "https://images.unsplash.com/photo-1610058564177-3e47514a4087?w=800&q=80",
    "https://images.unsplash.com/photo-1588619623238-16e6d194c259?w=800&q=80",
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&q=80"
  ],
  ajanta: [
    "https://images.unsplash.com/photo-1604586202410-b9bb3b8b15d0?w=800&q=80",
    "https://images.unsplash.com/photo-1549473889-14f410d83298?w=800&q=80",
    "https://images.unsplash.com/photo-1565019018449-6bb1cc39c4d9?w=800&q=80"
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

async function run() {
  for (const [key, urls] of Object.entries(files)) {
    let index = 1;
    for (const imgUrl of urls) {
      const filename = `${key}_${index}.jpg`;
      const dest = path.join(destDir, filename);
      
      console.log(`Downloading ${filename}...`);
      try {
        await download(imgUrl, dest);
        console.log(`Successfully saved ${filename}`);
      } catch (err) {
        console.error(`Failed to download ${filename}:`, err);
      }
      index++;
    }
  }
}

run();
