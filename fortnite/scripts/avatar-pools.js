(() => {
  'use strict';
  const range = (start, end) => Array.from({
     length: end - start + 1 
  }, (_, index) => start + index);
  const file = (platform, id, extension) => `/assets/avatars/${platform}-avatar-${String(id).padStart(2, '0')}.${extension}`;
  const freeze = (items) => Object.freeze(items);
  const pools = Object.freeze({
    ps: freeze([
      ...range(2, 12).map((id) => file('ps', id, 'webp')),
      ...range(13, 54).map((id) => file('ps', id, 'png')),
    ]),
    xbox: freeze([
      ...range(1, 16).map((id) => file('xbox', id, 'webp')),
      ...range(17, 107).map((id) => file('xbox', id, 'png')),
    ]),
    pc: freeze(range(1, 13).map((id) => file('pc', id, 'webp'))),
  });
  const aliases = Object.freeze({
    ps: 'ps', ps4: 'ps', ps5: 'ps', playstation: 'ps', psn: 'ps',
    xbox: 'xbox', xboxone: 'xbox', series: 'xbox', xboxseries: 'xbox', xboxseriesxs: 'xbox',
    pc: 'pc', steam: 'pc', epic: 'pc', windows: 'pc', ea: 'pc',
  });
  const lastByPlatform = new Map();
  function platformKey(value) {
    const compact = String(value || '').toLowerCase().replace(/[
      ^a-z0-9
    ]/g, '');
    return aliases[
      compact
    ] || 'pc';
  }
  function randomIndex(length) {
    if (length <= 1) return 0;
    if (globalThis.crypto?.getRandomValues) {
      const values = new Uint32Array(1);
      globalThis.crypto.getRandomValues(values);
      return Math.floor((values[
        0
      ] / 4294967296) * length);
    }
    return Math.floor(Math.random() * length);
  }
  function forPlatform(platform) {
    return pools[
      platformKey(platform)
    ];
  }
  function random(platform, previous = '') {
    const key = platformKey(platform);
    const pool = pools[
      key
    ];
    const avoid = new Set([
      previous, lastByPlatform.get(key)
    ].filter(Boolean));
    let selected = pool[
      randomIndex(pool.length)
    ];
    if (pool.length > 1 && avoid.has(selected)) {
      const start = pool.indexOf(selected);
      for (let offset = 1;
       offset < pool.length;
       offset += 1) {
        const candidate = pool[
          (start + offset) % pool.length
        ];
        if (!avoid.has(candidate)) {
          selected = candidate;
          break;
        }
      }
    }
    lastByPlatform.set(key, selected);
    return selected;
  }
  function preload(platform, count = 3) {
    const pool = forPlatform(platform);
    const limit = Math.max(0, Math.min(Number(count) || 0, pool.length));
    for (let index = 0;
     index < limit;
     index += 1) {
      const image = new Image();
      image.decoding = 'async';
      image.src = pool[
        randomIndex(pool.length)
      ];
    }
  }
  globalThis.LVAvatarPools = Object.freeze({
    all: pools,
    forPlatform,
    platformKey,
    preload,
    random,
  });
})();
