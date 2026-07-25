import https from 'https';

const files = {
  trimbakeshwar: [
    'Trimbakeshwar_Shiva_Temple.jpg',
    'Trimbakeshwar_Temple,_Nashik.jpg',
    'Trimbakeshwar_Shiva_Temple_2005.jpg'
  ],
  ramkund: [
    'Ram_Kund,_Nashik.jpg',
    'Ramkund_Nashik.jpg',
    'Panchavati-Ramkund.jpg'
  ],
  ellora: [
    'Ellora_Caves_Aurangabad_Maharashtra.jpg',
    'The_Beautiful_Ellora_Caves.jpg',
    'Ellora_caves!.jpg'
  ],
  ajanta: [
    'Ajanta_Caves,_India,_Panoramic_view_of_Ajanta_basalt_cliffs_and_caves.jpg',
    'Ajanta_Padmapani.jpg',
    'Ajanta_(63).jpg'
  ],
  shirdi: [
    'Sri_Sai_Baba_Temple_,_Shirdi.jpg',
    'Shirdi_Sai_Baba_Samadhi.jpg'
  ]
};

function getThumbUrl(filename) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId].imageinfo) {
            resolve(pages[pageId].imageinfo[0].thumburl);
          } else {
            resolve(null);
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const results = {};
  for (const [key, filenames] of Object.entries(files)) {
    results[key] = [];
    for (const file of filenames) {
      const url = await getThumbUrl(file);
      if (url) {
        results[key].push(url);
        console.log(`Fetched thumb for ${file}`);
      } else {
        console.error(`Failed to find thumb for ${file}`);
      }
    }
  }
  
  console.log('\n--- URLs ---\n');
  console.log(JSON.stringify(results, null, 2));
}

run();
