import https from 'https';

const queries = [
  "Kalaram Temple Nashik",
  "Kushavarta Kund",
  "Anjaneri",
  "Pandavleni Caves",
  "Kapaleshwar Temple Nashik",
  "Muktidham Nashik"
];

function fetchFile(query) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json`;
    https.get(url, { headers: { 'User-Agent': 'MahakumbhTourismApp/1.0 (dev@mahakumbhapp.com)' } }, (res) => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(d);
          const results = parsed.query?.search || [];
          if (results.length > 0) {
            const title = results[0].title.replace(/^File:/, '');
            resolve({ query, filename: title });
          } else {
            resolve({ query, filename: null });
          }
        } catch (e) {
          resolve({ query, filename: null });
        }
      });
    }).on('error', () => resolve({ query, filename: null }));
  });
}

async function run() {
  console.log("Searching for Kumbh Mela filenames on Wikimedia...");
  for (const q of queries) {
    const res = await fetchFile(q);
    console.log(`Query: "${q}" => Filename: "${res.filename}"`);
    await new Promise(r => setTimeout(r, 500));
  }
}

run();
