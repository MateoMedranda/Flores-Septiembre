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
    if (!entry.isFile() || ignored.has(entry.name.toLowerCase()) || entry.name.startsWith('.')) return [];
    return [relative(root, join(absoluteFolder, entry.name)).split(sep).join('/')];
  }));
  return nested.flat().sort((a, b) => a.localeCompare(b));
}

const photoFiles = await filesIn('assets/photos');
const musicFiles = await filesIn('assets/music');
const title = path => path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
const assets = {
  photos: photoFiles.map(src => ({ src, caption: title(src) || 'Un recuerdo contigo' })),
  playlist: musicFiles,
};
await writeFile(join(root, 'assets.json'), `${JSON.stringify(assets, null, 2)}\n`);
console.log(`Encontradas ${assets.photos.length} fotos y ${assets.playlist.length} canciones.`);
