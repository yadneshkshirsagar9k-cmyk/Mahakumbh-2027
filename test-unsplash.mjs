import https from 'https';

const urls = [
  "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800",
  "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
  "https://images.unsplash.com/photo-1582490050807-6bcfc707db0f?w=800",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
  "https://images.unsplash.com/photo-1555627622-cce77f7de7a0?w=800",
  "https://images.unsplash.com/photo-1627850893325-10330dcaf826?w=800",
  "https://images.unsplash.com/photo-1610058564177-3e47514a4087?w=800",
  "https://images.unsplash.com/photo-1588619623238-16e6d194c259?w=800",
  "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800",
  "https://images.unsplash.com/photo-1604586202410-b9bb3b8b15d0?w=800",
  "https://images.unsplash.com/photo-1549473889-14f410d83298?w=800",
  "https://images.unsplash.com/photo-1565019018449-6bb1cc39c4d9?w=800"
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', () => resolve({ url, status: 'ERROR' }));
  });
}

async function run() {
  const working = [];
  for (const url of urls) {
    const result = await checkUrl(url);
    if (result.status === 200 || result.status === 302) {
      working.push(url);
      console.log(`WORKING: ${url}`);
    } else {
      console.log(`FAILED (${result.status}): ${url}`);
    }
  }
}

run();
