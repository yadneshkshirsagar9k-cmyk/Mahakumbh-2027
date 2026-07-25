import https from 'https';

const pages = {
  trimbakeshwar: 'https://en.wikipedia.org/wiki/Trimbakeshwar_Shiva_Temple',
  ramkund: 'https://en.wikipedia.org/wiki/Panchavati',
  ellora: 'https://en.wikipedia.org/wiki/Ellora_Caves',
  ajanta: 'https://en.wikipedia.org/wiki/Ajanta_Caves'
};

function fetchUrls(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/[^"]+\.jpg\/[^"]+/g);
        if (matches) {
          // filter out small icons, keep ones that end in px-... and have decent size
          const good = matches.filter(m => m.includes('px-') && !m.includes('20px-') && !m.includes('15px-'));
          resolve([...new Set(good)].slice(0, 3));
        } else {
          resolve([]);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const results = {};
  for (const [key, url] of Object.entries(pages)) {
    console.log(`Fetching ${key}...`);
    results[key] = await fetchUrls(url);
  }
  console.log(JSON.stringify(results, null, 2));
}

run();
