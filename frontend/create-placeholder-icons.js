const fs = require('fs');
const path = require('path');

// Simple 1x1 PNG data (transparent)
const createPNG = (width, height) => {
  // Create a simple PNG with a solid color
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  const ihdrCrc = Buffer.from([0x73, 0x68, 0x48, 0x82]); // Pre-calculated CRC for IHDR
  const ihdrChunk = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x0D]), // length
    Buffer.from('IHDR'),
    ihdrData,
    ihdrCrc
  ]);
  
  // IDAT chunk with simple gradient data
  const pixelData = [];
  for (let y = 0; y < height; y++) {
    pixelData.push(0); // filter type
    for (let x = 0; x < width; x++) {
      // Create a simple gradient from dark blue to green
      const r = Math.floor(26 + (x / width) * 50);
      const g = Math.floor(26 + (y / height) * 100);
      const b = Math.floor(46 + ((x + y) / (width + height)) * 50);
      pixelData.push(r, g, b);
    }
  }
  
  // Compress the pixel data (simplified - just store as is for placeholder)
  const idatData = Buffer.from(pixelData);
  const idatCrc = Buffer.from([0x3E, 0x23, 0x94, 0x25]); // Placeholder CRC
  
  const idatChunk = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, idatData.length]),
    Buffer.from('IDAT'),
    idatData,
    idatCrc
  ]);
  
  // IEND chunk
  const iendChunk = Buffer.from([
    0x00, 0x00, 0x00, 0x00, // length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
};

// Create all required icon sizes
const iconSizes = [16, 32, 70, 96, 128, 144, 150, 152, 192, 310, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

iconSizes.forEach(size => {
  const pngData = createPNG(size, size);
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  fs.writeFileSync(filepath, pngData);
  console.log(`Created ${filename}`);
});

console.log('All placeholder icons created successfully!');
