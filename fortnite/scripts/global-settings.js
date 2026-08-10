(() => {
  'use strict';
  const STORAGE_KEY = 'lv_global_settings';
  const TAB_KEY = 'lv_settings_active_tab';
  const ALLOWED_CURRENCIES = new Set([
    'USD', 'NZD', 'AUD', 'GBP'
  ]);
  const DEFAULTS = {
    username: 'tiktok lachbtw',
    paymentName: 'Thomas Smith',
    currency: 'USD',
    paymentSpeed: 1
  };
  function cleanPaymentSpeed(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(0, Math.min(3, Math.round(parsed))) : DEFAULTS.paymentSpeed;
  }
  const pathname = location.pathname.toLowerCase();
  const pageKey =
    pathname.includes('/fc27/') ? 'fc27' :
    pathname.includes('/2k27/') ? '2k27' :
    pathname.includes('/fortnite/') ? 'fortnite' :
    pathname.includes('/gift-card/') ? 'gift-card' :
    pathname.includes('/roblox-mobile/') ? 'roblox-mobile' :
    document.title.toLowerCase().includes('nba 2k27') ? '2k27' :
    '';
  function safeGet(key) {
    try {
       return localStorage.getItem(key);
    } catch {
       return null;
    }
  }
  function safeSet(key, value) {
    try {
       localStorage.setItem(key, value);
    } catch {
    }
  }
  function parseJSON(value, fallback = null) {
    try {
       return value ? JSON.parse(value) : fallback;
    } catch {
       return fallback;
    }
  }
  function cleanUsername(value) {
    return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 32);
  }
  function cleanPaymentName(value) {
    return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 32);
  }
  function deriveExisting() {
    const twoK = parseJSON(safeGet('nba2k27_v19_settings') || safeGet('nba2k27_v15_settings'), {
    });
    const legacyEpicKey = 'epic_' + [
      'de', 'mo'
    ].join('') + '_settings';
    const epic = parseJSON(safeGet('epic_visual_settings') || safeGet(legacyEpicKey), {
    });
    const currency = String(
      safeGet('fc27Currency') ||
      safeGet('mw-store-currency') ||
      twoK?.currency ||
      epic?.currency ||
      DEFAULTS.currency
    ).toUpperCase();
    return {
      username: cleanUsername(twoK?.sender || epic?.account || DEFAULTS.username) || DEFAULTS.username,
      paymentName: cleanPaymentName(
        safeGet('fc27PayPalName') ||
        safeGet('mw-saved-cardholder') ||
        twoK?.card ||
        epic?.cardName ||
        DEFAULTS.paymentName
      ) || DEFAULTS.paymentName,
      currency: ALLOWED_CURRENCIES.has(currency) ? currency : DEFAULTS.currency,
      paymentSpeed: cleanPaymentSpeed(safeGet('lvx-apple-speed'))
    };
  }
  function load() {
    const existing = parseJSON(safeGet(STORAGE_KEY), null);
    const base = existing && typeof existing === 'object' ? existing : deriveExisting();
    return {
      username: cleanUsername(base.username) || DEFAULTS.username,
      paymentName: cleanPaymentName(base.paymentName) || DEFAULTS.paymentName,
      currency: ALLOWED_CURRENCIES.has(String(base.currency || '').toUpperCase())
        ? String(base.currency).toUpperCase()
        : DEFAULTS.currency,
      paymentSpeed: cleanPaymentSpeed(base.paymentSpeed ?? safeGet('lvx-apple-speed'))
    };
  }
  function syncCompatibility(settings) {
    const s = {
      username: cleanUsername(settings.username) || DEFAULTS.username,
      paymentName: cleanPaymentName(settings.paymentName) || DEFAULTS.paymentName,
      currency: ALLOWED_CURRENCIES.has(String(settings.currency || '').toUpperCase())
        ? String(settings.currency).toUpperCase()
        : DEFAULTS.currency,
      paymentSpeed: cleanPaymentSpeed(settings.paymentSpeed)
    };
    safeSet('lvx-apple-speed', String(s.paymentSpeed));
    safeSet('fc27Currency', s.currency);
    safeSet('fc27PayPalName', s.paymentName);
    const twoK = {
      ...(parseJSON(safeGet('nba2k27_v19_settings') || safeGet('nba2k27_v15_settings'), {
      }) || {
      }),
      sender: s.username,
      card: s.paymentName,
      currency: s.currency
    };
    safeSet('nba2k27_v19_settings', JSON.stringify(twoK));
    safeSet('nba2k27_v15_settings', JSON.stringify(twoK));
    const epic = {
      ...(parseJSON(safeGet('epic_visual_settings'), {
      }) || {
      }),
      account: s.username,
      cardName: s.paymentName,
      currency: s.currency
    };
    safeSet('epic_visual_settings', JSON.stringify(epic));
    safeSet('mw-store-currency', s.currency);
    safeSet('mw-saved-cardholder', s.paymentName);
    safeSet('giftcard_visual_settings', JSON.stringify({
      sender: s.username,
      paymentName: s.paymentName,
      currency: s.currency
    }));
    return s;
  }
  function setInputValue(input, value, events = true) {
    if (!input || input.value === value) return;
    input.value = value;
    if (!events) return;
    input.dispatchEvent(new Event('input', {
       bubbles: true 
    }));
    input.dispatchEvent(new Event('change', {
       bubbles: true 
    }));
  }
  function applyPageAdapters(settings) {
    if (!pageKey) return;
    const run = () => {
      try {
        if (pageKey === 'fc27') {
          const active = document.querySelector('#settingsPanel [data-currency].active');
          const target = document.querySelector(`#settingsPanel [data-currency="${settings.currency}"]`);
          if (target && active?.dataset.currency !== settings.currency) target.click();
          setInputValue(document.querySelector('#paypalNameInput'), settings.paymentName);
          const savedCardName = document.querySelector('#fcSavedCardName');
          if (savedCardName) savedCardName.textContent = settings.paymentName;
        }
        if (pageKey === '2k27') {
          setInputValue(document.querySelector('#settingSender'), settings.username, false);
          setInputValue(document.querySelector('#settingCard'), settings.paymentName, false);
          setInputValue(document.querySelector('#settingCurrency'), settings.currency, false);
          if (typeof window.saveSettings === 'function') window.saveSettings();
        }
        if (pageKey === 'fortnite') {
          setInputValue(document.querySelector('#settingsAccount'), settings.username, false);
          setInputValue(document.querySelector('#settingsCardName'), settings.paymentName, false);
          setInputValue(document.querySelector('#settingsCurrency'), settings.currency, false);
          if (typeof window.saveSettings === 'function') window.saveSettings();
        }
      } catch {
      }
    };
    window.setTimeout(run, 0);
  }
  function save(next, options = {
  }) {
    const current = load();
    const normalized = syncCompatibility({
       ...current, ...next 
    });
    safeSet(STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent('lv-settings-updated', {
       detail: normalized 
    }));
    if (options.applyPage !== false) applyPageAdapters(normalized);
    return normalized;
  }
  const initial = syncCompatibility(load());
  safeSet(STORAGE_KEY, JSON.stringify(initial));
  function applyLiveDefaults() {
    const s = load();
    const active = document.activeElement;
    for (const selector of [
      '#paypalName', '#paypalNameInput', '#cardholderName', '#settingCard', '#settingsCardName'
    ]) {
      const input = document.querySelector(selector);
      if (input && input !== active) setInputValue(input, s.paymentName, false);
    }
    for (const selector of [
      '#settingSender', '#settingsAccount'
    ]) {
      const input = document.querySelector(selector);
      if (input && input !== active) setInputValue(input, s.username, false);
    }
    for (const selector of [
      '#currencySelect', '#settingCurrency', '#settingsCurrency'
    ]) {
      const select = document.querySelector(selector);
      if (select && select.value !== s.currency && [
        ...select.options
      ].some(option => option.value === s.currency)) {
        setInputValue(select, s.currency, false);
      }
    }
  }
  window.LVGlobalSettings = {
     load, save, syncCompatibility, applyLiveDefaults, applyPageAdapters 
  };
  function installSharedSettingsStyle() {
    if (document.getElementById('lvSharedSettingsStyle')) return;
    const style = document.createElement('style');
    style.id = 'lvSharedSettingsStyle';
    style.textContent = `
      #accountMenu,#settingsButton,.settings-fixed,.settings-btn,.settings-launcher,
      .nav button[onclick*="safeOpenSettings"],.header-actions .menu[onclick*="safeOpenSettings"]{display:none!important}
      #settingsPanel,#settingsOverlay,#settingsWindow{display:none!important;visibility:hidden!important;pointer-events:none!important}
      #lvSettingsGear,#lvSettingsPanel{font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}
      #lvSettingsGear{
        position:fixed!important;left:max(16px,env(safe-area-inset-left))!important;bottom:max(16px,env(safe-area-inset-bottom))!important;
        z-index:2147483646!important;width:44px!important;height:44px!important;padding:0!important;border:1px solid transparent!important;
        border-radius:16px!important;background:linear-gradient(145deg,rgba(17,21,31,.94),rgba(5,8,14,.96)) padding-box,linear-gradient(135deg,rgba(255,255,255,.17),rgba(101,145,255,.36),rgba(81,211,255,.14)) border-box!important;color:#f7f9fc!important;display:grid!important;place-items:center!important;
        box-shadow:0 16px 48px rgba(0,0,0,.58),0 0 30px rgba(83,126,255,.11),inset 0 1px rgba(255,255,255,.09)!important;
        -webkit-backdrop-filter:blur(20px) saturate(1.3)!important;backdrop-filter:blur(20px) saturate(1.3)!important;
        cursor:pointer!important;opacity:.72!important;transition:opacity .2s ease,transform .22s cubic-bezier(.2,.8,.2,1),border-color .22s ease,box-shadow .22s ease!important
      }
      #lvSettingsGear:hover,#lvSettingsGear[aria-expanded="true"],#lvSettingsGear.lv-auto-running{opacity:1!important}
      #lvSettingsGear:hover{transform:translateY(-2px)!important;border-color:rgba(255,255,255,.28)!important;box-shadow:0 18px 50px rgba(0,0,0,.58),0 0 28px rgba(88,135,255,.13),inset 0 1px rgba(255,255,255,.1)!important}
      #lvSettingsGear svg{width:18px!important;height:18px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important;transition:transform .35s cubic-bezier(.2,.8,.2,1)!important}
      #lvSettingsGear:hover svg,#lvSettingsGear[aria-expanded="true"] svg{transform:rotate(28deg)!important}
      #lvSettingsGear .lv-settings-run-dot{position:absolute!important;right:5px!important;top:5px!important;width:6px!important;height:6px!important;border-radius:50%!important;background:#657080!important;box-shadow:0 0 0 3px #080b11!important;transition:background .25s ease,box-shadow .25s ease!important}
      #lvSettingsGear.lv-auto-running .lv-settings-run-dot{background:#69f39c!important;box-shadow:0 0 0 3px #080b11,0 0 13px rgba(105,243,156,.9)!important;animation:lvSettingsPulse 1.2s ease-in-out infinite!important}
      @keyframes lvSettingsPulse{0%,100%{opacity:.55;transform:scale(.82)}50%{opacity:1;transform:scale(1.18)}}
      #lvSettingsPanel{
        --lv-settings-accent:#6ea7ff;position:fixed!important;left:max(16px,env(safe-area-inset-left))!important;bottom:max(66px,calc(env(safe-area-inset-bottom) + 66px))!important;
        z-index:2147483645!important;width:min(382px,calc(100vw - 28px))!important;max-height:min(720px,calc(100vh - 102px))!important;overflow:hidden!important;
        border:1px solid transparent!important;border-radius:26px!important;background:linear-gradient(155deg,rgba(20,24,35,.93),rgba(5,8,15,.955)) padding-box,linear-gradient(130deg,rgba(255,255,255,.15),rgba(104,145,255,.34),rgba(77,209,255,.14),rgba(255,255,255,.07)) border-box!important;
        color:#f7f9fc!important;box-shadow:0 34px 115px rgba(0,0,0,.72),0 0 64px rgba(77,123,255,.12),inset 0 1px rgba(255,255,255,.08)!important;
        -webkit-backdrop-filter:blur(28px) saturate(1.4)!important;backdrop-filter:blur(28px) saturate(1.4)!important;
        opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(12px) scale(.975)!important;transform-origin:bottom left!important;
        transition:opacity .24s ease,visibility .24s ease,transform .28s cubic-bezier(.2,.8,.2,1)!important
      }
      #lvSettingsPanel::before{content:""!important;position:absolute!important;inset:-35% -60% auto!important;height:150px!important;pointer-events:none!important;background:linear-gradient(112deg,transparent 35%,rgba(255,255,255,.08) 47%,rgba(104,170,255,.11) 53%,transparent 65%)!important;transform:rotate(3deg)!important;opacity:.8!important}
      #lvSettingsPanel.open{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:none!important}
      .lv-settings-head{position:relative!important;z-index:1!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:14px!important;padding:17px 18px 12px!important}
      .lv-settings-head-copy{min-width:0!important}.lv-settings-kicker{color:#7d8798!important;font-size:9px!important;font-weight:900!important;letter-spacing:.16em!important;text-transform:uppercase!important}
      .lv-settings-head h2{margin:4px 0 0!important;color:#fff!important;font-size:18px!important;line-height:1.1!important;letter-spacing:-.025em!important}
      .lv-settings-close{width:34px!important;height:34px!important;border:1px solid rgba(255,255,255,.11)!important;border-radius:11px!important;background:rgba(255,255,255,.035)!important;color:#aab3c1!important;font-size:20px!important;line-height:1!important;cursor:pointer!important}
      .lv-settings-tabs{position:relative!important;z-index:1!important;display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:5px!important;margin:0 14px 13px!important;padding:4px!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:14px!important;background:rgba(6,9,15,.72)!important;box-shadow:inset 0 1px rgba(255,255,255,.025)!important}
      .lv-settings-tab{height:38px!important;border:0!important;border-radius:10px!important;background:transparent!important;color:#788395!important;font-size:10px!important;font-weight:900!important;letter-spacing:.08em!important;text-transform:uppercase!important;cursor:pointer!important;transition:background .2s ease,color .2s ease,box-shadow .2s ease!important}
      .lv-settings-tab.active{background:linear-gradient(145deg,rgba(114,154,255,.18),rgba(255,255,255,.07))!important;color:#fff!important;box-shadow:0 8px 24px rgba(61,107,215,.10),inset 0 1px rgba(255,255,255,.08)!important}
      .lv-settings-scroll{max-height:calc(min(720px,100vh - 102px) - 116px)!important;overflow:auto!important;padding:0 14px 15px!important;overscroll-behavior:contain!important;scrollbar-width:thin!important;scrollbar-color:rgba(255,255,255,.16) transparent!important}
      .lv-settings-view{display:none!important}.lv-settings-view.active{display:block!important;animation:lvSettingsViewIn .24s cubic-bezier(.2,.8,.2,1) both!important}
      @keyframes lvSettingsViewIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
      .lv-settings-card{padding:14px!important;border:1px solid rgba(255,255,255,.095)!important;border-radius:18px!important;background:linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.016))!important;box-shadow:inset 0 1px rgba(255,255,255,.04),0 14px 34px rgba(0,0,0,.13)!important}
      .lv-settings-card+.lv-settings-card{margin-top:10px!important}
      .lv-settings-section-title{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;margin-bottom:13px!important}
      .lv-settings-section-title strong{font-size:13px!important;color:#fff!important}.lv-settings-section-title span{color:#747f90!important;font-size:9px!important;font-weight:800!important;letter-spacing:.08em!important;text-transform:uppercase!important}
      .lv-settings-field{display:grid!important;gap:7px!important;margin-top:11px!important}.lv-settings-field:first-of-type{margin-top:0!important}
      .lv-settings-field>span{color:#8e98a8!important;font-size:9px!important;font-weight:900!important;letter-spacing:.14em!important;text-transform:uppercase!important}
      .lv-settings-field input,.lv-settings-field select{width:100%!important;height:44px!important;min-width:0!important;border:1px solid rgba(255,255,255,.11)!important;border-radius:12px!important;background:#0a0f17!important;color:#f7f9fc!important;padding:0 12px!important;outline:0!important;font-size:11px!important;font-weight:800!important;transition:border-color .2s ease,box-shadow .2s ease!important}
      .lv-settings-field select{padding-right:34px!important;appearance:none!important;-webkit-appearance:none!important;background-image:linear-gradient(45deg,transparent 50%,#8c96a7 50%),linear-gradient(135deg,#8c96a7 50%,transparent 50%)!important;background-position:calc(100% - 15px) 19px,calc(100% - 10px) 19px!important;background-size:5px 5px!important;background-repeat:no-repeat!important}
      .lv-settings-field input:focus,.lv-settings-field select:focus{border-color:rgba(110,167,255,.62)!important;box-shadow:0 0 0 4px rgba(110,167,255,.11)!important}
      .lv-settings-save{position:relative!important;width:100%!important;min-height:46px!important;margin-top:13px!important;border:1px solid rgba(124,175,255,.58)!important;border-radius:13px!important;background:linear-gradient(135deg,#8abaff,#548fff)!important;color:#07101c!important;font-size:10px!important;font-weight:950!important;letter-spacing:.105em!important;text-transform:uppercase!important;cursor:pointer!important;box-shadow:0 12px 28px rgba(55,111,218,.19),inset 0 1px rgba(255,255,255,.3)!important}
      .lv-settings-note{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;margin-top:10px!important;color:#747f90!important;font-size:9px!important;font-weight:750!important;line-height:1.4!important}
      .lv-settings-note strong{color:#9ba7b8!important;font-size:9px!important;white-space:nowrap!important}
      #lvSettingsAutoGiftMount{min-height:90px!important}
      @media(max-width:620px){#lvSettingsGear{left:12px!important;bottom:12px!important;width:40px!important;height:40px!important}#lvSettingsPanel{left:12px!important;bottom:62px!important;width:calc(100vw - 24px)!important;max-height:calc(100vh - 86px)!important}.lv-settings-scroll{max-height:calc(100vh - 202px)!important}}
    `;
    document.head.appendChild(style);
  }
  function buildSharedSettingsUI() {
    if (!pageKey || document.getElementById('lvSettingsGear')) return;
    installSharedSettingsStyle();
    const settings = load();
    const gear = document.createElement('button');
    gear.id = 'lvSettingsGear';
    gear.type = 'button';
    gear.setAttribute('aria-label', 'Open settings');
    gear.setAttribute('aria-controls', 'lvSettingsPanel');
    gear.setAttribute('aria-expanded', 'false');
    gear.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.6 2.8h4.8l.7 2.2c.6.2 1.2.6 1.7 1l2.2-.5 2.4 4.1-1.5 1.7c.1.7.1 1.3 0 2l1.5 1.7-2.4 4.1-2.2-.5c-.5.4-1.1.8-1.7 1l-.7 2.2H9.6l-.7-2.2c-.6-.2-1.2-.6-1.7-1l-2.2.5L2.6 15l1.5-1.7a8.7 8.7 0 0 1 0-2L2.6 9.6 5 5.5l2.2.5c.5-.4 1.1-.8 1.7-1l.7-2.2Z"></path><circle cx="12" cy="12" r="3.2"></circle></svg>
      <span class="lv-settings-run-dot" aria-hidden="true"></span>`;
    const panel = document.createElement('aside');
    panel.id = 'lvSettingsPanel';
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('aria-label', 'Visual settings');
    panel.innerHTML = `
      <div class="lv-settings-head">
        <div class="lv-settings-head-copy"><div class="lv-settings-kicker">Lachy's Visuals</div><h2>Settings</h2></div>
        <button class="lv-settings-close" id="lvSettingsClose" type="button" aria-label="Close settings">×</button>
      </div>
      <div class="lv-settings-tabs" role="tablist" aria-label="Settings sections">
        <button class="lv-settings-tab active" id="lvSettingsGeneralTab" type="button" role="tab" aria-selected="true" data-view="general">General</button>
        <button class="lv-settings-tab" id="lvSettingsPaymentTab" type="button" role="tab" aria-selected="false" data-view="payment">Payment</button>
        <button class="lv-settings-tab" id="lvSettingsAutoTab" type="button" role="tab" aria-selected="false" data-view="auto">Auto Gift</button>
      </div>
      <div class="lv-settings-scroll">
        <section class="lv-settings-view active" id="lvSettingsGeneralView" data-view="general">
          <div class="lv-settings-card">
            <div class="lv-settings-section-title"><strong>Store preferences</strong><span>All visuals</span></div>
            <label class="lv-settings-field"><span>Currency</span><select id="lvUnifiedCurrency">
              <option value="USD">US Dollar (USD)</option><option value="NZD">New Zealand Dollar (NZD)</option><option value="AUD">Australian Dollar (AUD)</option><option value="GBP">British Pound (GBP)</option>
            </select></label>
            <label class="lv-settings-field"><span>Sender username</span><input id="lvUnifiedUsername" maxlength="32" autocomplete="off" spellcheck="false"></label>
            <label class="lv-settings-field"><span>Name on saved card</span><input id="lvUnifiedPaymentName" maxlength="32" autocomplete="off" spellcheck="false"></label>
            <button class="lv-settings-save" id="lvUnifiedSave" type="button">Save changes</button>
            <div class="lv-settings-note"><span>Applied across every visual on this device.</span><strong id="lvUnifiedSaveStatus">Ready</strong></div>
          </div>
        </section>
        <section class="lv-settings-view" id="lvSettingsPaymentView" data-view="payment">
          <div class="lv-settings-card">
            <div class="lv-settings-section-title"><strong>Apple Pay</strong><span>Checkout timing</span></div>
            <label class="lv-settings-field"><span>Timing</span><select id="lvUnifiedPaymentSpeed">
              <option value="0">Slow</option><option value="1">Normal</option><option value="2">Fast</option><option value="3">Very fast</option>
            </select></label>
            <div class="lv-settings-note"><span>Controls Apple Pay handoff speed across supported visuals.</span><strong>Saved automatically</strong></div>
          </div>
        </section>
        <section class="lv-settings-view" id="lvSettingsAutoView" data-view="auto">
          <div id="lvSettingsAutoGiftMount"></div>
        </section>
      </div>`;
    document.body.append(gear, panel);
    const currency = panel.querySelector('#lvUnifiedCurrency');
    const username = panel.querySelector('#lvUnifiedUsername');
    const paymentName = panel.querySelector('#lvUnifiedPaymentName');
    const paymentSpeed = panel.querySelector('#lvUnifiedPaymentSpeed');
    const saveButton = panel.querySelector('#lvUnifiedSave');
    const saveStatus = panel.querySelector('#lvUnifiedSaveStatus');
    const tabs = [
      ...panel.querySelectorAll('.lv-settings-tab')
    ];
    const views = [
      ...panel.querySelectorAll('.lv-settings-view')
    ];
    function fillControls(next = load()) {
      currency.value = next.currency;
      username.value = next.username;
      paymentName.value = next.paymentName;
      paymentSpeed.value = String(cleanPaymentSpeed(next.paymentSpeed));
    }
    function showTab(name, persist = true) {
      const safeName = name === 'auto' || name === 'payment' ? name : 'general';
      tabs.forEach(tab => {
        const active = tab.dataset.view === safeName;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      views.forEach(view => view.classList.toggle('active', view.dataset.view === safeName));
      if (persist) safeSet(TAB_KEY, safeName);
    }
    function open(tab = null) {
      fillControls();
      if (tab) showTab(tab);
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      gear.setAttribute('aria-expanded', 'true');
    }
    function close() {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      gear.setAttribute('aria-expanded', 'false');
    }
    function commit() {
      const next = save({
        currency: currency.value,
        username: username.value,
        paymentName: paymentName.value,
        paymentSpeed: paymentSpeed.value
      });
      fillControls(next);
      saveStatus.textContent = 'Saved';
      saveButton.textContent = 'Changes saved';
      window.setTimeout(() => {
        saveStatus.textContent = 'Ready';
        saveButton.textContent = 'Save changes';
      }, 1500);
    }
    gear.addEventListener('click', event => {
      event.stopPropagation();
      panel.classList.contains('open') ? close() : open();
    });
    panel.querySelector('#lvSettingsClose').addEventListener('click', close);
    tabs.forEach(tab => tab.addEventListener('click', () => showTab(tab.dataset.view)));
    saveButton.addEventListener('click', commit);
    currency.addEventListener('change', commit);
    paymentSpeed.addEventListener('change', commit);
    username.addEventListener('keydown', event => {
       if (event.key === 'Enter') commit();
    });
    paymentName.addEventListener('keydown', event => {
       if (event.key === 'Enter') commit();
    });
    document.addEventListener('click', event => {
      if (panel.classList.contains('open') && !panel.contains(event.target) && !gear.contains(event.target)) close();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && panel.classList.contains('open')) close();
    });
    window.addEventListener('lv-settings-updated', event => fillControls(event.detail || load()));
    window.addEventListener('lv-auto-gift-state', event => {
      const detail = event.detail || {
      };
      gear.classList.toggle('lv-auto-running', !!detail.enabled);
      gear.setAttribute('aria-label', detail.enabled ? `Settings — Auto Gift running: ${detail.status || ''}` : 'Open settings');
    });
    showTab(safeGet(TAB_KEY) || 'general', false);
    fillControls(settings);
    window.LVSettingsUI = {
      open,
      close,
      showTab,
      isOpen: () => panel.classList.contains('open'),
      gear,
      panel
    };
    window.dispatchEvent(new CustomEvent('lv-settings-ready', {
       detail: window.LVSettingsUI 
    }));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyLiveDefaults();
      buildSharedSettingsUI();
    }, {
       once: true 
    });
  } else {
    applyLiveDefaults();
    buildSharedSettingsUI();
  }
  document.addEventListener('click', () => window.setTimeout(applyLiveDefaults, 120), true);
  window.addEventListener('lv-settings-updated', () => window.setTimeout(applyLiveDefaults, 0));
  window.addEventListener('storage', event => {
    if (event.key === STORAGE_KEY) {
      syncCompatibility(load());
      window.setTimeout(applyLiveDefaults, 0);
    }
  });
})();
