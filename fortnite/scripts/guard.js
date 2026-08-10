(() => {
  'use strict';
  const HOME_URL = '../index.html';
  const host = location.hostname.toLowerCase();
  const allowedHost =
    host === 'lachyvisuals.com' ||
    host === 'www.lachyvisuals.com' ||
    host === 'lachyvisuals.netlify.app' ||
    host.endsWith('--lachyvisuals.netlify.app') ||
    host === 'localhost' ||
    host === '127.0.0.1';
  // A saved/copied page opened from disk or re-hosted elsewhere should not be usable as-is.
  if (false) {
    if (location.protocol === 'http:' || location.protocol === 'https:') {
      location.replace(HOME_URL);
      return;
    }
    document.documentElement.innerHTML = `
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Access unavailable</title>
      </head>
      <body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#050505;color:#fff;font:600 16px system-ui,sans-serif;text-align:center;padding:24px">
        <div>
          <div style="font-size:28px;margin-bottom:10px">Lachy's Visuals</div>
          <div style="color:#8f93a1">This copy is not running from an authorized site.</div>
        </div>
      </body>`;
    return;
  }
  const style = document.createElement('style');
  style.textContent = `
    html.lv-protected,
    html.lv-protected body {
      -webkit-touch-callout:none;
    }
    html.lv-protected img {
      -webkit-user-drag:none;
      user-drag:none;
    }
    html.lv-protected body,
    html.lv-protected body *:not(input):not(textarea):not([contenteditable="true"]) {
      -webkit-user-select:none;
      user-select:none;
    }
    input,
    textarea,
    [contenteditable="true"] {
      -webkit-user-select:text!important;
      user-select:text!important;
    }
    @media print {
      html.lv-protected body > * {
        display:none!important;
      }
      html.lv-protected body::before {
        content:"Protected content — printing disabled";
        display:grid!important;
        min-height:100vh;
        place-items:center;
        color:#111;
        font:700 22px system-ui,sans-serif;
      }
    }
  `;
  document.head.appendChild(style);
  document.documentElement.classList.add('lv-protected');
  const isEditable = (target) => {
    if (!(target instanceof Element)) return false;
    return !!target.closest('input,textarea,[contenteditable="true"],select');
  };
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  }, {
     capture: true 
  });
  document.addEventListener('dragstart', (event) => {
    event.preventDefault();
  }, {
     capture: true 
  });
  document.addEventListener('selectstart', (event) => {
    if (!isEditable(event.target)) {
      event.preventDefault();
    }
  }, {
     capture: true 
  });
  document.addEventListener('keydown', (event) => {
    const key = String(event.key || '').toLowerCase();
    const mod = event.ctrlKey || event.metaKey;
    const blocked =
      event.key === 'F12' ||
      (mod && key === 's') ||
      (mod && key === 'u') ||
      (mod && event.shiftKey && [
      'i', 'j', 'c'
    ].includes(key));
    if (blocked) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, {
     capture: true 
  });
})();
