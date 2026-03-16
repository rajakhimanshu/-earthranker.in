import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = [192, 512];

async function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Gradient background: #6C47FF to #9B7FFF
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#6C47FF');
  gradient.addColorStop(1, '#9B7FFF');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Bold "U" lettermark white Space Grotesk
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Font scale (approx 55% of canvas size)
  const fontSize = Math.floor(size * 0.55);
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillText('U', size / 2, size / 2 + size * 0.05);

  // Teal dot accent: #00D4AA
  const dotRadius = size * 0.08;
  const dotX = size * 0.75;
  const dotY = size * 0.25;

  ctx.beginPath();
  ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#00D4AA';
  ctx.fill();

  const outPath = path.join(__dirname, '..', 'public', 'icons', `icon-${size}.png`);
  
  // Ensure directory exists
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }

  const out = fs.createWriteStream(outPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  
  return new Promise((resolve, reject) => {
    out.on('finish', () => {
      console.log(`Generated icon-${size}.png`);
      resolve();
    });
    out.on('error', reject);
  });
}

async function run() {
  for (const size of SIZES) {
    await generateIcon(size);
  }
}

run().catch(console.error);
