import { log } from 'console';
import path from 'path';
import fs from 'fs/promises';
import {JSDOM} from 'jsdom';

//Windows Only
const minecraft = path.join(process.env.APPDATA, '.minecraft');
const objectsFolder = path.join(minecraft, 'assets', 'objects');

const targetFolder = path.resolve('../sounds');

log('Fetching versions . . .');
const versions = await fetchJSON('https://launchermeta.mojang.com/mc/game/version_manifest.json');
const latestVersion = versions.versions[0];
await fs.writeFile(path.join(targetFolder, 'info.json'), JSON.stringify({ version: latestVersion.id }, null, 2));
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

log('Copying sounds . . .');
for (const [k, v] of Object.entries(objects)) {
  if (!k.startsWith('minecraft/sounds/')) continue;
  const file = k.replace(/^minecraft\/sounds\//, '');
  await fs.mkdir(path.join(targetFolder, path.dirname(file)), { recursive: true });
  await fs.copyFile(fetchObject(v.hash), path.join(targetFolder, k.replace(/^minecraft\/sounds\//, '')));
}

log('Generating HTML . . .');

const jsdom = new JSDOM(await readAsString('assets/index.html'), { runScripts: 'outside-only' });
let script = '';
script += `const version = ${await readAsString('../sounds/info.json')}.version;\n`;
script += `const sounds = ${await readAsString('../sounds/sounds.json')}\n`;
script += await readAsString('assets/script.js');
await jsdom.window.eval(script);

fs.writeFile('../index.html', jsdom.serialize() );

log('Done!');


async function fetchJSON(url) {
  return (await fetch(url)).json();
}

function fetchObject(hash) {
  const index = hash.slice(0, 2);
  return path.join(objectsFolder, index, hash);
}

async function readAsString(file){
  return (await fs.readFile(file)).toString();
}