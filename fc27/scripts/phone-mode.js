(() => {
  'use strict';
  const STORAGE_KEY = 'fc27_phone_mode';
  let enabled = false, stage = null, screen = null, phoneContent = null, clockTimer = 0;

  /* ── helpers ── */
  const pad = v => String(v).padStart(2, '0');
  const safeGet = () => { try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; } };
  const safeSet = v => { try { localStorage.setItem(STORAGE_KEY, v ? '1' : '0'); } catch {} };

  function updateClock() {
    const el = document.getElementById('fcPhoneClock');
    if (!el) return;
    const n = new Date();
    el.textContent = `${n.getHours()}:${pad(n.getMinutes())}`;
  }

  /* ── Build the phone shell ONCE at load time (hidden by default) ── */
  function buildStage() {
    stage = document.createElement('div');
    stage.className = 'fc-phone-stage';
    stage.setAttribute('aria-label', 'FC 27 phone view');
    stage.setAttribute('aria-hidden', 'true');
    /* hidden until activated — CSS handles opacity/pointer-events */
    stage.dataset.phoneState = 'off';

    stage.innerHTML = `
      <div class="fc-phone-shell">
        <div class="fc-phone-screen">
          <div class="fc-phone-status" aria-hidden="true">
            <span class="fc-phone-time" id="fcPhoneClock">9:41</span>
            <button class="fc-phone-island" type="button" tabindex="-1">
              <span class="fc-phone-island-copy"><i></i>FC 27 Mobile</span>
            </button>
            <span class="fc-phone-status-icons">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" style="opacity:.9"><rect x="0" y="3" width="3" height="9" rx="1"/><rect x="4.5" y="2" width="3" height="10" rx="1"/><rect x="9" y="0.5" width="3" height="11.5" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1" opacity=".3"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" style="opacity:.9"><path d="M8 2.5C5.5 2.5 3.3 3.5 1.7 5.1L0 3.4C2 1.3 4.8 0 8 0s6 1.3 8 3.4L14.3 5.1C12.7 3.5 10.5 2.5 8 2.5z"/><path d="M8 6.5c-1.4 0-2.7.6-3.6 1.5L2.7 6.3C4 4.9 5.9 4 8 4s4 .9 5.3 2.3L11.6 8C10.7 7.1 9.4 6.5 8 6.5z"/><circle cx="8" cy="10.5" r="1.5"/></svg>
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none" style="opacity:.9"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" stroke-opacity=".35"/><rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor"/><path d="M23 4.5v3a2 2 0 0 0 0-3z" fill="currentColor" fill-opacity=".4"/></svg>
            </span>
          </div>
          <div class="fc-phone-content"></div>
          <span class="fc-phone-home" aria-hidden="true"></span>
        </div>
      </div>`;

    screen = stage.querySelector('.fc-phone-screen');
    phoneContent = stage.querySelector('.fc-phone-content');

    /* Island click */
    stage.querySelector('.fc-phone-island').addEventListener('click', e => {
      e.currentTarget.classList.toggle('open');
    });

    /* Scroll → nav shadow */
    phoneContent.addEventListener('scroll', () => {
      phoneContent.querySelector('.local-nav')?.classList.toggle('is-scrolled', phoneContent.scrollTop > 18);
    }, { passive: true });

    document.body.appendChild(stage);
  }

  /* ── Inject real page content into the phone screen ── */
  function populatePhoneContent() {
    if (phoneContent.children.length > 0) return; /* already populated */

    /* Clone main page content (everything inside <main> + header/footer) */
    const bodyChildren = Array.from(document.body.children).filter(el => {
      const tag = el.tagName.toLowerCase();
      const id = el.id;
      /* skip the stage itself, toggle button, settings gear, overlays, modals, scripts */
      if (el === stage) return false;
      if (id === 'fcPhoneToggle') return false;
      if (id === 'lvSettingsGear' || id === 'lvSettingsPanel' || id === 'lvBackToVisuals') return false;
      if (el.classList.contains('fc-checkout')) return false;
      if (tag === 'script' || tag === 'style') return false;
      return true;
    });

    bodyChildren.forEach(el => {
      const clone = el.cloneNode(true);
      /* Remove any inline display:none from edition cards that were hidden in desktop */
      clone.querySelectorAll('[style*="display: none"]').forEach(n => {
        if (n.dataset.bonus !== undefined) n.style.removeProperty('display');
      });
      phoneContent.appendChild(clone);
    });

    /* Wire up Pre-Order buttons inside phone content → open real checkout */
    phoneContent.querySelectorAll('[data-open-buy], .buy-edition, .cta').forEach(btn => {
      btn.addEventListener('click', () => {
        const real = document.body.querySelector('[data-open-buy]');
        real?.click();
      });
    });
  }

  /* ── Activate phone view ── */
  function activate() {
    if (enabled) return;
    enabled = true;

    populatePhoneContent();

    /* Move the real checkout modal into the phone screen so it renders inside */
    const checkout = document.getElementById('buyModal') || document.querySelector('.fc-checkout');
    if (checkout && checkout.parentElement !== screen) screen.appendChild(checkout);

    document.body.classList.add('fc-phone-mode');
    stage.dataset.phoneState = 'on';
    stage.setAttribute('aria-hidden', 'false');

    updateClock();
    clockTimer = window.setInterval(updateClock, 15000);
  }

  /* ── Deactivate phone view ── */
  function deactivate() {
    if (!enabled) return;
    enabled = false;

    window.clearInterval(clockTimer);

    /* Return checkout modal to body */
    const checkout = screen.querySelector(':scope > #buyModal, :scope > .fc-checkout');
    if (checkout) document.body.insertBefore(checkout, stage);

    document.body.classList.remove('fc-phone-mode');
    stage.dataset.phoneState = 'off';
    stage.setAttribute('aria-hidden', 'true');
  }

  /* ── Toggle ── */
  function setMode(next, persist = true) {
    next ? activate() : deactivate();
    const toggle = document.getElementById('fcPhoneToggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(next));
      toggle.setAttribute('aria-label', next ? 'Exit FC 27 phone view' : 'Open FC 27 phone view');
      toggle.title = next ? 'Exit phone view' : 'Phone view';
    }
    if (persist) safeSet(next);
    window.dispatchEvent(new CustomEvent('fc27-phone-mode', { detail: { enabled: next } }));
  }

  /* ── Mount: build stage + toggle button ── */
  function mount() {
    if (document.getElementById('fcPhoneToggle')) return;

    buildStage();

    const button = document.createElement('button');
    button.id = 'fcPhoneToggle';
    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    button.title = 'Phone view';
    button.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="6.5" y="2.5" width="11" height="19" rx="2.4"></rect><path d="M10 5h4M10.5 18.5h3"></path></svg><span class="fc-phone-toggle-dot" aria-hidden="true"></span>';
    button.addEventListener('click', () => setMode(!enabled));
    document.body.appendChild(button);

    /* Never auto-restore phone mode from localStorage on this local build */
    safeSet(false);
    setMode(false, false);

    window.FC27PhoneMode = {
      enable: () => setMode(true),
      disable: () => setMode(false),
      toggle: () => setMode(!enabled),
      isEnabled: () => enabled
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(mount, 0), { once: true });
  } else {
    setTimeout(mount, 0);
  }
})();
