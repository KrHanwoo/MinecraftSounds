const id = (id) => document.getElementById(id);

(async () => {
  id('version-text').textContent = version;
  const groups = createGroups(Object.keys(sounds));
  document.body.append(...groups);

  Object.keys(sounds).forEach(s => {
    id(s).append(...sounds[s].sounds.map(sk => {
      const name = sk.name || sk;
      const isEvent = sk.type == 'event';
      const div = document.createElement('div');

      if (isEvent) {
        const a = document.createElement('a');
        a.textContent = name;
        a.setAttribute('onclick', 'nav(this)');
        div.append(a);
        return div;
      }

      const download = document.createElement('span');
      download.textContent = 'download';
      download.setAttribute('onclick', `dl('${name}')`);

      const span = document.createElement('span');
      span.textContent = name;
      span.setAttribute('onclick', `ps(this)`);

      div.append(download, span);
      return div;
    }));
  });
})();

function createGroups(keys, parent, additional) {
  const map = new Map();
  keys.map(k => {
    const s = k.split('.');
    const arr = map.get(s[0]) || [];
    arr.push(s.splice(1).join('.'));
    map.set(s[0], arr);
  });
  return Array.from(map).map(([k, v]) => {
    const isParent = v[0].length != 0 && v.length != 1;
    const details = document.createElement('details');
    const current = v.length == 1 && v[0].length != 0 ? `${k}.${v[0]}` : k;
    const parentCurrent = parent ? `${parent}.${current}` : current;
    if (v[0].length == 0 || v.length == 1)
      details.id = parentCurrent;
    const summary = document.createElement('summary');
    const span = document.createElement('span');
    span.textContent = additional ? `${additional}.${k}` : current;
    summary.append(span);
    
    if(!isParent){
      const link = document.createElement('span');
      link.textContent = 'link';
      link.setAttribute('onclick', 'li(event)');
      summary.append(link);
    }

    details.append(summary);
    if (isParent) details.append(...createGroups(v, parentCurrent).flat());
    else {
      details.classList.add('sound');
      if (v.length == 1) return details;
      return [details, ...createGroups(v.splice(1), parentCurrent, additional ? `${additional}.${k}` : k).flat()];
    }
    return details;
  });
}