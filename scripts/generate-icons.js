import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createPNG(size) {
  // Simple PNG generator with raw RGBA data
  const width = size;
  const height = size;
  const buffer = Buffer.alloc(height * (width * 4 + 1));
  
  // Fill RGBA data
  let pos = 0;
  for (let y = 0; y < height; y++) {
    buffer[pos++] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      // Create a cinematic gradient clapperboard icon
      const nx = x / width;
      const ny = y / height;
      const cx = (x - width / 2) / (width / 2);
      const cy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(cx * cx + cy * cy);

      let r = 11, g = 15, b = 25, a = 255; // Midnight Navy base

      if (dist < 0.88) {
        // Gradient fill: Electric blue to Purple to Cyan
        r = Math.floor(20 + 70 * nx + 120 * ny);
        g = Math.floor(40 + 90 * (1 - nx) + 30 * ny);
        b = Math.floor(200 + 40 * nx + 15 * ny);

        // Clapperboard stripe pattern
        if (ny < 0.45) {
          const stripe = Math.floor((nx + ny) * 10) % 2;
          if (stripe === 0) {
            r = Math.min(255, r + 90);
            g = Math.min(255, g + 90);
            b = Math.min(255, b + 90);
          } else {
            r = Math.floor(r * 0.4);
            g = Math.floor(g * 0.4);
            b = Math.floor(b * 0.4);
          }
        }

        // Inner glowing star/sparkle in center
        const sx = Math.abs(x - width / 2) / (width / 2);
        const sy = Math.abs(y - height * 0.7) / (height / 2);
        if (sx + sy < 0.28) {
          r = 6, g = 182, b = 212; // Cyan glow
        }
      } else if (dist < 0.95) {
        // Border ring: Neon cyan
        r = 6; g = 182; b = 212; a = 220;
      } else {
        a = 0; // Transparent outside
      }

      buffer[pos++] = r;
      buffer[pos++] = g;
      buffer[pos++] = b;
      buffer[pos++] = a;
    }
  }

  const deflated = zlib.deflateSync(buffer);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = crc32Table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ -1) >>> 0;
  }

  const crc32Table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? -306674912 ^ (c >>> 1) : (c >>> 1);
    }
    crc32Table[i] = c;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const toCrc = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(toCrc), 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.resolve(__dirname, '../public/icons');
fs.mkdirSync(iconsDir, { recursive: true });

[16, 32, 48, 128].forEach(size => {
  const png = createPNG(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), png);
  console.log(`Generated icon-${size}.png`);
});
