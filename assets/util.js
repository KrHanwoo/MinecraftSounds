const $ = (id) => document.getElementById(id);

async function fetchJSON(url) {
  return (await fetch(url)).json();
}

function createGroups(keys, parent, additional) {
  const map = new Map();
  keys.map(k => {
    const s = k.split('.');
    const arr = map.get(s[0]) || [];
    arr.push(s.splice(1).join('.'));
    map.set(s[0], arr);
  });
  return Array.from(map).map(([k, v]) => {
    const details = document.createElement('details');
    const current = v.length == 1 && v[0].length != 0 ? `${k}.${v[0]}` : k;
    const parentCurrent = parent ? `${parent}.${current}` : current;
    if (v[0].length == 0 || v.length == 1)
      details.id = parentCurrent;
    const summary = document.createElement('summary');
    summary.innerText = additional ? `${additional}.${k}` : current;
    details.append(summary);
    if (v[0].length != 0 && v.length != 1) details.append(...createGroups(v, parentCurrent).flat());
    else {
      details.classList.add('sound');
      if (v.length == 1) return details;
      return [details, ...createGroups(v.splice(1), parentCurrent, additional ? `${additional}.${k}` : k).flat()];
    }
    return details;
  });
}

async function playsound(key, elem) {
  if(elem.audio){
    elem.audio.pause();
    elem.audio.remove();
    elem.audio = undefined;
    elem.classList.remove('loading');
    elem.classList.remove('playing');
    return;
  }
  const audio = new Audio(`sounds/${key}.ogg`);
  elem.audio = audio;
  elem.classList.add('loading');
  await audio.play();
  elem.classList.add('playing');
  elem.classList.remove('loading');
  audio.onended = () => {
    elem.classList.remove('playing');
    elem.audio = undefined;
  };
}