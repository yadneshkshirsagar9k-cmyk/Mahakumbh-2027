import https from 'https';

const locations = [
  "Bhimashankar Temple",
  "Grishneshwar Temple",
  "Aundha Nagnath Temple",
  "Parli Vaijnath Temple",
  "Vithoba Temple Pandharpur",
  "Dagadusheth Halwai Ganapati Temple",
  "Siddhivinayak Temple Mumbai",
  "Mahalakshmi Temple Kolhapur",
  "Tulja Bhavani Temple",
  "Saptashrungi",
  "Gajanan Maharaj Temple Shegaon",
  "Takht Sachkhand Sri Hazur Abchalnagar Sahib"
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
            // Get the title which is usually "File:Filename.jpg"
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
  console.log("Searching for accurate filenames on Wikimedia...");
  for (const loc of locations) {
    const res = await fetchFile(loc);
    console.log(`LOC: "${loc}" => Filename: "${res.filename}"`);
    await new Promise(r => setTimeout(r, 500)); // Sleep 500ms
  }
}

run();
