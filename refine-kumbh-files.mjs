import https from 'https';

const queries = [
  "Kalaram Temple",
  "Pandavleni",
  "Kapaleshwar Temple",
  "Anjaneri Hills"
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
          const filenames = results.slice(0, 3).map(r => r.title.replace(/^File:/, ''));
          resolve({ query, filenames });
        } catch (e) {
          resolve({ query, filenames: [] });
        }
      });
    }).on('error', () => resolve({ query, filenames: [] }));
  });
}

async function run() {
  for (const q of queries) {
    const res = await fetchFile(q);
    console.log(`Query: "${q}" => Filenames:`, res.filenames);
    await new Promise(r => setTimeout(r, 500));
  }
}

run();
