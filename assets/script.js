(async () => {
  const version = (await fetchJSON('sounds/info.json')).version;
  $('version-text').innerText = version;

  const sounds = await fetchJSON('sounds/sounds.json');
  const groups = createGroups(Object.keys(sounds));
  document.body.append(...groups);

  Object.keys(sounds).forEach(s => {
    $(s).append(...sounds[s].sounds.map(sk => {
      const name = sk.name || sk;
      const isEvent = sk.type == 'event';
      const div = document.createElement('div');

      if (isEvent) {
        const span = document.createElement('span');
        span.innerText = name;
        span.classList.add('sound-key');
        span.classList.add('event-key');
        span.setAttribute('onclick', 'navigateEvent(this)');
        div.append(span);
        return div;
      }

      const download = document.createElement('a');
      download.classList.add('download');
      download.innerText = 'Download';
      download.href = `sounds/${sk}.ogg`;
      download.toggleAttribute('download');

      const span = document.createElement('span');
      span.innerText = name;
      span.classList.add('sound-key');
      span.setAttribute('onclick', 'playsound(this)');

      div.append(download, span);
      return div;
    }));
  });
})();