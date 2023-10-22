import { log } from 'console';
import path from 'path';
import fs from 'fs/promises';

//Windows Only
const minecraft = path.join(process.env.APPDATA, '.minecraft');
const objectsFolder = path.join(minecraft, 'assets', 'objects');

const targetFolder = path.resolve('../sounds');

log('Fetching versions . . .');
const versions = await fetchJSON('https://launchermeta.mojang.com/mc/game/version_manifest.json');
const latestVersion = versions.versions[0];
const launcherDataURL = latestVersion.url;
log(`Target version: ${latestVersion.id}`);

log('Fetching launcher data . . .');
const launcherData = await fetchJSON(launcherDataURL);
const assetIndexURL = launcherData.assetIndex.url;

log('Fetching asset index . . .');
const assetIndex = await fetchJSON(assetIndexURL);
const objects = assetIndex.objects;

const soundsHash = objects['minecraft/sounds.json'].hash;

log('Copying sounds.json . . .');
fs.copyFile(fetchObject(soundsHash), path.join(targetFolder, 'sounds.json'));

for (const [k, v] of Object.entries(objects)) {
  if (!k.startsWith('minecraft/sounds/')) continue;
  const file = k.replace(/^minecraft\/sounds\//, '');
  log(`Copying ${file}`);
  await fs.mkdir(path.join(targetFolder, path.dirname(file)), { recursive: true });
  await fs.copyFile(fetchObject(v.hash), path.join(targetFolder, k.replace(/^minecraft\/sounds\//, '')));
}



async function fetchJSON(url) {
  return (await fetch(url)).json();
}

function fetchObject(hash) {
  const index = hash.slice(0, 2);
  return path.join(objectsFolder, index, hash);
}