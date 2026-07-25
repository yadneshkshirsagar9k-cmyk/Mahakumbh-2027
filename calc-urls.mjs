import crypto from 'crypto';

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

const results = {};

for (const [key, filenames] of Object.entries(files)) {
  results[key] = [];
  for (let file of filenames) {
    // MediaWiki expects spaces as underscores
    const safeFile = file.replace(/ /g, '_');
    const md5 = crypto.createHash('md5').update(safeFile).digest('hex');
    const a = md5.charAt(0);
    const ab = md5.substring(0, 2);
    
    // Construct the 800px thumbnail URL
    const url = `https://upload.wikimedia.org/wikipedia/commons/thumb/${a}/${ab}/${encodeURIComponent(safeFile)}/800px-${encodeURIComponent(safeFile)}`;
    results[key].push(url);
  }
}

console.log(JSON.stringify(results, null, 2));
