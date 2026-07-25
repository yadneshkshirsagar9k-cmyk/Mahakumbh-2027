import https from 'https';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const filesToDownload = [
  {
    filename: 'Bhimashankar.jpg',
    destPath: 'public/assets/images/tourism/bhimashankar_1.jpg'
  },
  {
    filename: 'Grishneshwar Temple Ellora.jpg',
    destPath: 'public/assets/images/tourism/grishneshwar_1.jpg'
  },
  {
    filename: 'Aundha Nagnath Shiva Temple Jyotirlinga Maharashtra India.jpg',
    destPath: 'public/assets/images/tourism/aundha_nagnath_1.jpg'
  },
  {
    filename: 'Parli Vaijnath Temple in AP W IMG 7914.jpg',
    destPath: 'public/assets/images/tourism/parli_vaijnath_1.jpg'
  },
  {
    filename: 'Vithoba Pandharpur temple chief gate.jpg',
    destPath: 'public/assets/images/tourism/pandharpur_1.jpg'
  },
  {
    filename: 'Dagadusheth Halwai Sarvajanik Ganeshotsav Mandal.jpg',
    destPath: 'public/assets/images/tourism/dagadusheth_1.jpg'
  },
  {
    filename: 'Shree Siddhivinayak Temple Mumbai.jpg',
    destPath: 'public/assets/images/tourism/siddhivinayak_1.jpg'
  },
  {
    filename: "Ambadevi's Temple, Kolhapur.jpg",
    destPath: 'public/assets/images/tourism/kolhapur_mahalakshmi_1.jpg'
  },
  {
    filename: 'Tulja Bhavani Mandir, Tuljapur.jpg',
    destPath: 'public/assets/images/tourism/tuljapur_1.jpg'
  },
  {
    filename: 'Goddess Saptashrungi Devi Temple1.jpg',
    destPath: 'public/assets/images/tourism/saptashrungi_1.jpg'
  },
  {
    filename: 'Shri Gajanan Maharaj Smruti Mandir.jpg',
    destPath: 'public/assets/images/tourism/shegaon_1.jpg'
  },
  {
    filename: 'Hazur Sahib.jpg',
    destPath: 'public/assets/images/tourism/nanded_hazur_sahib_1.jpg'
  }
];

function getWikimediaUrl(filename) {
  // Convert spaces to underscores to match Wikipedia's exact format
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
  console.log("Starting batch download of 12 destinations with spaces corrected...");
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
  console.log("Done!");
}

run();
