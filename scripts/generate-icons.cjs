const sharp = require('sharp');
const path = require('path');

const sizes = [192, 512];

async function generate() {
  for (const size of sizes) {
    const rx = Math.round(size * 0.18);
    const fontSize = Math.round(size * 0.44);
    const textY = Math.round(size * 0.68);
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b5dff"/>
          <stop offset="100%" style="stop-color:#7c3aed"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${rx}" fill="url(#bg)"/>
      <text x="${size / 2}" y="${textY}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff">CL</text>
    </svg>`;
    
    const outPath = path.join(__dirname, '..', 'apps', 'web', 'public', `icon-${size}.png`);
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
    console.log(`Generated icon-${size}.png`);
  }
}

generate().catch(e => { console.error(e); process.exit(1); });
