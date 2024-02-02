document.addEventListener('DOMContentLoaded', () => {

  const inputs = document.getElementsByTagName('input');
  const textareas = document.getElementsByTagName('textarea');

  const all = [...inputs, ...textareas];

  all.forEach((input) => {
    input.addEventListener('change', (e) => {
      const value = e.target.value;
      if (sanitize(value) !== value) {
        input.value = '';
      }
    });
  });
});


function sanitize(str) {
  function stringToHTML () {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.body || document.createElement('body');
  }


  function removeScripts (html) {
    const scripts = html.querySelectorAll('script');

    for (const script of scripts) {
      script.remove();
    }
  }

  function isPossiblyDangerous (name, value) {
    const val = value.replace(/\s+/g, '').toLowerCase();

    if (['src', 'href', 'xlink:href'].includes(name)) {
      if (val.includes('javascript:') || val.includes('data:text/html')) return true;
    }
    if (name.startsWith('on')) return true;
  }

  function removeAttributes (elem) {
    const atts = elem.attributes;

    for (const {name, value} of atts) {
      if (!isPossiblyDangerous(name, value)) continue;
      elem.removeAttribute(name);
    }

  }

  function clean (html) {
    const nodes = html.children;
    for (const node of nodes) {
      removeAttributes(node);
      clean(node);
    }
  }

  const html = stringToHTML();

  removeScripts(html);
  clean(html);

  return html.innerHTML;
}