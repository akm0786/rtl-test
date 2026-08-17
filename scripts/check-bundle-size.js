import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { gzipSize } from 'gzip-size';

const distDir = 'dist';
const maxTotalKb = 500;

// Recursively read all files inside dist
const files = await readdir(distDir, { recursive: true });
const jsCssFiles = files
  .filter((f) => f.endsWith('.js') || f.endsWith('.css'))
  .map((f) => join(distDir, f));

let totalGzip = 0;
for (const filePath of jsCssFiles) {
  const fileContent = await readFile(filePath);
  const gzip = await gzipSize(fileContent);
  totalGzip += gzip;
  console.log(`${filePath}: ${(gzip / 1024).toFixed(2)} KB (gzip)`);
}

console.log(`Total gzip size: ${(totalGzip / 1024).toFixed(2)} KB`);

if (totalGzip / 1024 > maxTotalKb) {
  console.error(`❌ Bundle size exceeds ${maxTotalKb} KB!`);
  process.exit(1);
} else {
  console.log(`✅ Bundle size within limit (${maxTotalKb} KB)`);
}
