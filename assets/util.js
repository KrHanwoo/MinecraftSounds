const $ = (id) => document.getElementById(id);
let keys = [];
let fuse;

(async () => {
  let k = await fetch('sounds/keys.json');
  keys = await k.json();
  fuse = new Fuse(keys, { threshold: 0.5 });

  let id = document.location.hash.replace('#', '');
  navid(id);
})();

async function dl(elem) {
  let name = elem.getAttribute('dl');
  elem.classList.add('downloading');
  const blob = await (await fetch(`sounds/${name}.mp3`)).blob();
  let blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = `${name}.mp3`;
  a.href = blobUrl;
  a.click();
  elem.classList.remove('downloading');
}

async function ps(elem) {
  if (elem.audio) {
    elem.audio.pause();
    elem.audio.remove();
    elem.audio = undefined;
    elem.classList.remove('loading');
    elem.classList.remove('playing');
    return;
  }
  const audio = new Audio(`sounds/${elem.textContent}.mp3`);
  audio.onended = () => {
    elem.classList.remove('playing');
    elem.audio = undefined;
  };
  elem.audio = audio;
  elem.classList.add('loading');
  await audio.play().catch(() => null);
  elem.classList.add('playing');
  elem.classList.remove('loading');
}

function nav(elem) {
  navid(elem.textContent);
}

function navid(id) {
  $(id)?.toggleAttribute('open', true);
  $(id)?.scrollIntoView({ block: "center" });
}

function li(e) {
  e.preventDefault();
  const id = e.target.parentNode.parentNode.id;
  navid(id);
  history.pushState({}, '', `#${id}`);
  navigator.clipboard.writeText(document.location.href);
}

document.onclick = (e) => {
  const target = e.target;
  if (!target || !(target instanceof Element)) return;
  if (target.hasAttribute('dl')) return dl(target);
  if (target.hasAttribute('snd')) return ps(target);
}

$('sound').oninput = (e) => {
  const txt = e.target.value;
  if (!txt) {
    $('results').innerHTML = '';
    $('main').style.display = 'unset';
    return;
  }
  $('main').style.display = 'none';
  if (!fuse) return;

  let filtered = fuse.search(txt, { limit: 30 }).map(x => x.item);
  let html = '';
  filtered.forEach(x => {
    html += $(x).outerHTML.replace(/<span>.+?<\/span>/, `<span>${x}</span>`);
  });
  $('results').innerHTML = html;
}