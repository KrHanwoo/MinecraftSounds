(async () => {
  const version = (await fetchJSON('sounds/info.json')).version;
  $('version-text').innerText = version;

  const sounds = await fetchJSON('sounds/sounds.json');
  const groups = createGroups(Object.keys(sounds));
  document.body.append(...groups);

  Object.keys(sounds).forEach(s => {
    $(s).append(...sounds[s].sounds.map(sk => sk.name || sk).map(sk => {
      const span = document.createElement('span');
      span.innerText = sk;
      span.classList.add('sound-key');
      span.onclick = () => { playsound(sk, span); };
      return span;
    }));
  });

})();