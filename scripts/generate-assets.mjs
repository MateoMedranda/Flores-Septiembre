import { readdir, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const root = process.cwd();
const ignored = new Set(['readme.md', '.ds_store']);

async function filesIn(folder) {
  const absoluteFolder = join(root, folder);
  let entries = [];
  try { entries = await readdir(absoluteFolder, { withFileTypes: true }); } catch { return []; }
  const nested = await Promise.all(entries.map(async entry => {
    if (entry.isDirectory()) return filesIn(join(folder, entry.name));
    if (!entry.isFile() || ignored.has(entry.name.toLowerCase()) || entry.name.startsWith('.') || entry.name.endsWith('.crdownload')) return [];
    return [relative(root, join(absoluteFolder, entry.name)).split(sep).join('/')];
  }));
  return nested.flat().sort((a, b) => a.localeCompare(b));
}

const photoFiles = await filesIn('assets/photos');
const musicFiles = await filesIn('assets/music');
const romanticPhrases = [
  "Mi lugar favorito",
  "Siempre juntos",
  "Eres mi sol",
  "Magia en cada instante",
  "Te amo",
  "Mi persona favorita",
  "Nuestra historia",
  "Inolvidable",
  "Haces mi mundo mejor",
  "Un instante perfecto",
  "A tu lado",
  "Eres mi todo",
  "Mi mejor casualidad",
  "Contigo siempre",
  "Mi felicidad",
  "Sonrisas contigo"
];

const assets = {
  photos: photoFiles.map((src, i) => ({ src, caption: romanticPhrases[i % romanticPhrases.length] })),
  playlist: musicFiles,
};
await writeFile(join(root, 'assets.js'), `window.ASSETS = ${JSON.stringify(assets, null, 2)};\n`);
console.log(`Encontradas ${assets.photos.length} fotos y ${assets.playlist.length} canciones.`);
