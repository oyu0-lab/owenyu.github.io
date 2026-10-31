(() => {
  const content = window.siteContent;
  if (!content) return;
  if (content.name) {
    document.querySelectorAll('[data-site-name]').forEach(element => { element.textContent = content.name; });
    document.title = `${document.title.split(' — ')[0]} — ${content.name}`;
  }
  const intro = document.querySelector('[data-intro]');
  if (intro && content.intro) intro.textContent = content.intro;
  const about = document.querySelector('[data-about]');
  if (about && Array.isArray(content.about)) {
    about.replaceChildren(...content.about.map(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }));
  }
  document.querySelectorAll('[data-list]').forEach(container => {
    const entries = content[container.dataset.list];
    if (!Array.isArray(entries) || !entries.length) return;
    const list = document.createElement('ul');
    list.className = 'link-list';
    entries.forEach(entry => {
      if (!entry || !entry.title) return;
      const item = document.createElement('li');
      let validLink = false;
      if (entry.url) {
        try {
          const url = new URL(entry.url, document.baseURI);
          validLink = ['http:', 'https:', 'file:'].includes(url.protocol);
        } catch {}
      }
      const title = document.createElement(validLink ? 'a' : 'span');
      title.textContent = entry.title;
      if (validLink) title.setAttribute('href', entry.url);
      item.append(title);
      if (entry.description) {
        const description = document.createElement('span');
        description.className = 'entry-description';
        description.textContent = entry.description;
        item.append(description);
      }
      list.append(item);
    });
    if (list.children.length) container.replaceChildren(list);
  });
})();
