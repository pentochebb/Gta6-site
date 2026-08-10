(() => {
  'use strict';
  function randomUnit() {
    if (globalThis.crypto?.getRandomValues) {
      const value = new Uint32Array(1);
      globalThis.crypto.getRandomValues(value);
      return value[
        0
      ] / 4294967296;
    }
    return Math.random();
  }
  function between(minimum, maximum) {
    const min = Math.max(0, Number(minimum) || 0);
    const max = Math.max(min, Number(maximum) || min);
    const natural = (randomUnit() + randomUnit()) / 2;
    const occasionalLongPause = randomUnit() < 0.12 ? randomUnit() * 0.22 : 0;
    return Math.round(min + (max - min) * Math.min(1, natural + occasionalLongPause));
  }
  function delay(minimum, maximum, kind = 'loading') {
    void kind;
    return between(minimum, maximum);
  }
  function wait(minimum, maximum = minimum, kind = 'loading') {
    return new Promise((resolve) => setTimeout(resolve, delay(minimum, maximum, kind)));
  }
  globalThis.LVRuntime = Object.freeze({
    between,
    delay,
    wait,
  });
})();
