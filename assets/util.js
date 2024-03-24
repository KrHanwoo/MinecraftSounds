const $ = (id) => document.getElementById(id);

(() => {
  const id = document.location.hash.replace('#', '');
  navid(id);
})();

function dl(name) {
  const a = document.createElement('a');
  a.download = `${name}.mp3`
  a.href = `sounds/${name}.mp3`;
  a.click();
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

function li(e){
  e.preventDefault();
  const id = e.target.parentNode.parentNode.id;
  navid(id);
  document.location.hash = `#${id}`;
  navigator.clipboard.writeText(document.location.href);
}