// Version: 4.1.0 - Updated: 2026-08-02T19:41:00+02:00
window.openMyCustomSettings = function() {
    const overlay = document.getElementById('settings-modal-overlay');
    if (overlay) {
        overlay.classList.add('active');
        overlay.style.setProperty('display', 'flex', 'important');
        overlay.style.setProperty('opacity', '1', 'important');
        overlay.style.setProperty('pointer-events', 'auto', 'important');
        overlay.style.setProperty('visibility', 'visible', 'important');
    }
};

window.closeMyCustomSettings = function() {
    const overlay = document.getElementById('settings-modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.style.setProperty('display', 'none', 'important');
        overlay.style.setProperty('opacity', '0', 'important');
        overlay.style.setProperty('pointer-events', 'none', 'important');
        overlay.style.setProperty('visibility', 'hidden', 'important');
    }
};

// Anti-DevTools, Anti-Extension & Anti-Debugging Protection
(function() {
    // 1. Clear console periodically
    setInterval(() => {
        console.clear();
    }, 1000);

    // 2. Debugger loop to pause execution if DevTools is opened
    setInterval(() => {
        const startTime = performance.now();
        
        const endTime = performance.now();
        if (endTime - startTime > 100) {
            blockAndCloseAccess("Access Denied - DevTools Detected");
        }
    }, 500);

    // 3. Extension & Content Injector Detection
    function blockAndCloseAccess(reason) { return; 
        document.body.innerHTML = `
            <div style="background:#090a0e; color:#ffffff; height:100vh; width:100vw; position:fixed; top:0; left:0; z-index:999999; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:Arial, sans-serif; text-align:center; padding:20px;">
                <div style="font-size:48px; margin-bottom:16px;">⚠️</div>
                <h1 style="font-size:24px; font-weight:800; color:#ff4444; margin-bottom:8px;">BROWSER EXTENSION DETECTED</h1>
                <p style="font-size:14px; color:#9ea0ab; max-width:480px; line-height:1.6; margin-bottom:24px;">
                    Please disable all browser extensions, ad-blockers, and user scripts to access MVP Visuals.
                </p>
                <button onclick="window.close(); window.location.href='about:blank';" style="background:#ff4444; color:#fff; border:none; padding:12px 28px; border-radius:8px; font-weight:700; cursor:pointer;">
                    Close Window
                </button>
            </div>
        `;
        try { window.close(); } catch(e){}
        setTimeout(() => { window.location.href = 'about:blank'; }, 500);
    }

    function checkExtensions() { return; 
        // Detect extension DOM attributes, injected scripts, chrome-extension:// protocols
        const extensionSelectors = [
            '[src*="chrome-extension://"]',
            '[href*="chrome-extension://"]',
            '[src*="moz-extension://"]',
            '[href*="moz-extension://"]',
            'div[id*="extension"]',
            'script[id*="tampermonkey"]',
            'script[id*="greasemonkey"]',
            'script[src*="inject"]',
            'iframe[id*="extension"]',
            '#uBlock-user-style',
            '.adblock',
            '#adblock',
            '#ad-blocker'
        ];

        for (const selector of extensionSelectors) {
            if (document.querySelector(selector)) {
                blockAndCloseAccess("Extension attribute found");
                return;
            }
        }

        // Detect extension window properties or injected objects
        if (
            window.tampermonkey ||
            window.gm_info ||
            window.__VUE_DEVTOOLS_GLOBAL_HOOK__ ||
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
            document.documentElement.hasAttribute('data-useragent') ||
            document.documentElement.getAttribute('class')?.includes('extension')
        ) {
            blockAndCloseAccess("Extension global variable detected");
        }
    }

    setInterval(checkExtensions, 1000);

    // 4. Disable Dragging & Selection
    document.addEventListener('dragstart', (e) => e.preventDefault());
})();

// Disable right-click context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Disable F12 and DevTools shortcuts (Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S)
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's' || e.keyCode === 85 || e.keyCode === 83)) {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('DOMContentLoaded', () => {



    // ==========================================================================
    // STATE VARIABLES
    // ==========================================================================
    let currentPlatform = 'xbox'; // 'xbox' or 'ps5'
    let enteredUsername = '';
    let preorderTotal = 20584;
    window.selectedEdition = 'standard';
    window.selectedPrice = 69.99;

    // Target Date: November 19, 2026
    const targetDate = new Date('November 19, 2026 00:00:00').getTime();

    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    // Countdown
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('mins');
    const secsEl = document.getElementById('secs');

    // Preorder counter
    const preorderCountEl = document.getElementById('preorder-count');

    // ==========================================================================
    // KEY GATE — DOM references (single source of truth)
    // ==========================================================================
    const keyModalOverlay = document.getElementById('key-modal-overlay');
    const keyInput        = document.getElementById('key-input');
    const btnActivateKey  = document.getElementById('btn-activate-key');
    const keyErrorMsg     = document.getElementById('key-error-msg');

    const BIN_ID     = '6a6f4de2f5f4af5e29e1316e';
    const MASTER_KEY = '$2a$10$4qUNjkXpCG3cH1807qZjIuCFqox1fe63vLDeSMfjcgV2Cx.b7Le8G';
    const API_URL    = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

    function hideKeyGate() {
        if (keyModalOverlay) {
            keyModalOverlay.classList.remove('active');
            keyModalOverlay.style.display = 'none';
            keyModalOverlay.style.pointerEvents = 'none';
        }
    }

    function showKeyGate() { return; 
        if (keyModalOverlay) {
            keyModalOverlay.classList.add('active');
            keyModalOverlay.style.display = 'flex';
            keyModalOverlay.style.pointerEvents = 'auto';
        }
    }

    // Hide header action buttons once access is granted
    function hideHeaderButtons() {
        const ids = ['btn-open-key-modal', 'btn-trial-1min', 'discord-header-btn'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.style.display = 'none'; el.style.visibility = 'hidden'; }
        });
        // Also hide by class (Discord link uses class not id)
        document.querySelectorAll('.discord-header-btn, .trial-btn, .activate-vip-key-btn').forEach(el => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
        });
    }

    // PC Hardware Fingerprint Generator (Unique per PC machine)
    function getPcHwid() {
        let hwid = localStorage.getItem('mvpv_pc_hwid');
        if (!hwid) {
            const screenRes = `${screen.width}x${screen.height}x${screen.colorDepth}`;
            const cores = navigator.hardwareConcurrency || 4;
            const mem = navigator.deviceMemory || 8;
            const tz = new Date().getTimezoneOffset();
            const lang = navigator.language || 'fr';
            const ua = navigator.userAgent;

            const raw = `${screenRes}|${cores}|${mem}|${tz}|${lang}|${ua}`;
            let hash = 0;
            for (let i = 0; i < raw.length; i++) {
                hash = ((hash << 5) - hash) + raw.charCodeAt(i);
                hash |= 0;
            }
            hwid = 'PC-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
            localStorage.setItem('mvpv_pc_hwid', hwid);
        }
        return hwid;
    }

    // Multi-source Key Loader (JSONBin.io + Node Server + LocalStorage)
    async function fetchKeysFromAllSources() {
        let keys = {};

        // Source 1: Local Server API (/api/keys) if running Node server
        try {
            const serverRes = await fetch('/api/keys');
            if (serverRes.ok) {
                const data = await serverRes.json();
                if (data && typeof data === 'object') {
                    keys = data.keys || data.record?.keys || data;
                }
            }
        } catch (e) {}

        // Source 2: JSONBin.io (with X-Master-Key or public latest)
        if (!keys || Object.keys(keys).length === 0) {
            try {
                const binRes = await fetch(`${API_URL}/latest`, {
                    headers: { 'X-Master-Key': MASTER_KEY }
                });
                if (binRes.ok) {
                    const data = await binRes.json();
                    keys = data.record?.keys || data.record?.record?.keys || data.record || data.keys || {};
                } else {
                    // Try without master key header
                    const binResPublic = await fetch(`${API_URL}/latest`);
                    if (binResPublic.ok) {
                        const data = await binResPublic.json();
                        keys = data.record?.keys || data.record?.record?.keys || data.record || data.keys || {};
                    }
                }
            } catch (e) {}
        }

        // Source 3: Browser LocalStorage fallback (shared between generator.html & app_v2.js)
        try {
            const ls1 = JSON.parse(localStorage.getItem('mvpv_keys_database') || '{}');
            const ls2 = JSON.parse(localStorage.getItem('mvpv_generator_keys') || '{}');
            const ls3 = JSON.parse(localStorage.getItem('gta6_keys') || '{}');
            keys = Object.assign({}, ls1, ls2, ls3, keys);
        } catch (e) {}

        return keys || {};
    }

    async function saveKeyUpdate(keysObj) {
        // Save to LocalStorage
        try {
            localStorage.setItem('mvpv_keys_database', JSON.stringify(keysObj));
            localStorage.setItem('mvpv_generator_keys', JSON.stringify(keysObj));
        } catch (e) {}

        // Save to JSONBin
        try {
            await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': MASTER_KEY
                },
                body: JSON.stringify({ keys: keysObj })
            });
        } catch (e) {}

        // Save to Node Server
        try {
            await fetch('/api/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keys: keysObj })
            });
        } catch (e) {}
    }

    // Real-Time Key Status Poller (Auto-disconnects PC if key is reset on generator)
    async function checkKeyStatus() {
        const storedKey = localStorage.getItem('gta6_activated_key');
        if (!storedKey) return;

        const currentPcHwid = getPcHwid();
        try {
            const keys = await fetchKeysFromAllSources();
            const kd   = keys[storedKey];

            const boundHwid = kd ? (kd.boundHwid || kd.fingerprint) : null;
            const isExpired = kd && kd.expiresAt && new Date(kd.expiresAt) < new Date();
            const isHwidMismatch = boundHwid && boundHwid !== currentPcHwid;
            const isReset = kd && !boundHwid && kd.activated === false;

            if (!kd || isExpired || isHwidMismatch || isReset) {
                // Key was reset/deleted on generator, expired, or bound HWID changed -> DISCONNECT IMMEDIATELY!
                localStorage.removeItem('gta6_activated_key');
                showKeyGate();
                if (keyErrorMsg) {
                    keyErrorMsg.style.color   = '#ff1744';
                    keyErrorMsg.textContent   = !kd ? '⛔ Key was reset or deleted from server. Access revoked.' : (isReset ? '🔄 Key PC binding was reset by admin. Please activate key again.' : (isHwidMismatch ? '🔒 Key HWID binding changed. Access revoked.' : '⛔ Key has expired.'));
                    keyErrorMsg.style.display = 'block';
                }
            }
        } catch { /* Network error silent fallback */ }
    }

    // Run status check on load
    showKeyGate();

    const storedKey = localStorage.getItem('gta6_activated_key');
    if (storedKey) {
        checkKeyStatus().then(() => {
            if (localStorage.getItem('gta6_activated_key')) {
                hideKeyGate();
                hideHeaderButtons();
            }
        });
    }

    // Continuous Live Heartbeat Poller every 10 seconds
    setInterval(checkKeyStatus, 10000);

    // Auto-format input as MVPV-XXXX-XXXX-XXXX
    if (keyInput) {
        keyInput.addEventListener('input', (e) => {
            let v = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
            const raw = v.replace(/-/g, '');
            const base = raw.startsWith('MVPV') ? raw.slice(4) : (raw.startsWith('GTA6') ? raw.slice(4) : raw);
            let out = 'MVPV';
            if (base.length > 0) out += '-' + base.slice(0, 4);
            if (base.length > 4) out += '-' + base.slice(4, 8);
            if (base.length > 8) out += '-' + base.slice(8, 12);
            e.target.value = out;
        });
        keyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && btnActivateKey) btnActivateKey.click();
        });
    }

    // Activate key via JSONBin with strict unique PC Hardware Binding (HWID)
    if (btnActivateKey) {
        btnActivateKey.addEventListener('click', async () => {
            const rawKey = keyInput ? keyInput.value.trim() : '';
            if (!rawKey || rawKey.length < 19) {
                if (keyErrorMsg) {
                    keyErrorMsg.textContent = 'Please enter a valid key format: MVPV-XXXX-XXXX-XXXX';
                    keyErrorMsg.style.color  = '#ff1744';
                    keyErrorMsg.style.display = 'block';
                }
                return;
            }

            btnActivateKey.disabled = true;
            btnActivateKey.textContent = 'VERIFYING...';
            if (keyErrorMsg) keyErrorMsg.style.display = 'none';

            try {
                const keys = await fetchKeysFromAllSources();
                const kd   = keys[rawKey];
                const myHwid = getPcHwid();

                if (!kd) {
                    throw Object.assign(new Error(), { msg: '❌ Invalid or unrecognized key.' });
                }
                if (kd.expiresAt && new Date(kd.expiresAt) < new Date()) {
                    throw Object.assign(new Error(), { msg: '⛔ This key has expired. Join Discord to get a new key.' });
                }

                const boundHwid = kd.boundHwid || kd.fingerprint;

                // Strict unique PC Hardware Binding Check
                if (boundHwid && boundHwid !== myHwid) {
                    throw Object.assign(new Error(), { msg: `🔒 Key already bound to another PC! (Bound HWID: ${boundHwid}). Each key is strictly unique to 1 PC machine.` });
                }

                // First time activation or reset key: bind key to this PC machine
                if (!boundHwid || kd.activated === false) {
                    kd.boundHwid = myHwid;
                    kd.fingerprint = myHwid;
                    kd.activated = true;
                    kd.activatedAt = new Date().toISOString();
                    keys[rawKey] = kd;

                    // Save updated key binding across storage/server
                    saveKeyUpdate(keys);
                }

                // SUCCESS
                localStorage.setItem('gta6_activated_key', rawKey);
                if (keyErrorMsg) {
                    keyErrorMsg.style.color   = '#00e676';
                    keyErrorMsg.textContent   = `✅ Key bound & activated successfully on this PC! (${myHwid})`;
                    keyErrorMsg.style.display = 'block';
                }
                // Stop any running trial
                if (typeof trialInterval !== 'undefined' && trialInterval) clearInterval(trialInterval);
                const trialBannerEl = document.getElementById('trial-banner');
                if (trialBannerEl) { trialBannerEl.classList.remove('active'); trialBannerEl.style.display = 'none'; }
                document.body.style.paddingTop = '0px';

                // Hide header Discord/Trial/Activation buttons
                hideHeaderButtons();

                setTimeout(hideKeyGate, 1200);

            } catch (err) {
                if (keyErrorMsg) {
                    keyErrorMsg.style.color   = '#ff1744';
                    keyErrorMsg.textContent   = err.msg || 'Error verifying key. Please try again.';
                    keyErrorMsg.style.display = 'block';
                }
            } finally {
                btnActivateKey.disabled = false;
                btnActivateKey.textContent = 'ACTIVATE ACCESS';
            }
        });
    }


    const modalContainer = document.getElementById('modal-container');
    const modalCard = document.getElementById('modal-card');
    const closeBtns = document.querySelectorAll('.close-modal-btn');

    // Platform buttons
    const btnPs5 = document.getElementById('btn-ps5');
    const btnXbox = document.getElementById('btn-xbox');

    // Modal Stage Elements
    const stageSelectEdition = document.getElementById('stage-select-edition');
    const stageLink = document.getElementById('stage-link');
    const stageConfirm = document.getElementById('stage-confirm');
    const stageCheckout = document.getElementById('stage-checkout');
    const stageSuccess = document.getElementById('stage-success');

    // Stage 0 (Select Edition) Elements
    const selectStoreTitle = document.getElementById('select-store-title');
    const cardStandardEdition = document.getElementById('card-standard-edition');
    const cardUltimateEdition = document.getElementById('card-ultimate-edition');
    const btnNextEdition = document.getElementById('btn-next-edition');

    // Stage 1 (Link Account) Elements
    const linkStoreTitle = document.getElementById('link-store-title');
    const linkInputHeading = document.getElementById('link-input-heading');
    const gamertagInput = document.getElementById('gamertag-input');
    const btnFindAccount = document.getElementById('btn-find-account');
    const gamertagError = document.getElementById('gamertag-error');
    const btnBackLanding = document.querySelector('.btn-back-landing');
    const btnBackToEdition = document.getElementById('btn-back-to-edition');

    // Stage 2 (Confirmation) Elements
    const confirmStoreTitle = document.getElementById('confirm-store-title');
    const confirmAvatarImg = document.getElementById('confirm-avatar-img');
    const confirmUsernameText = document.getElementById('confirm-username-text');
    const confirmPlatformText = document.getElementById('confirm-platform-text');
    const btnConfirmYes = document.getElementById('btn-confirm-yes');
    const btnConfirmNo = document.getElementById('btn-confirm-no');
    const btnBackToLink = document.getElementById('btn-back-to-link');
    const avatarSyncTip = document.getElementById('avatar-sync-tip');
    const syncTipText = document.getElementById('sync-tip-text');

    // Stage 3 (Checkout) Elements
    const checkoutStoreTitle = document.getElementById('checkout-store-title');
    const checkoutRefCode = document.getElementById('checkout-ref-code');
    const checkoutDeliverUsername = document.getElementById('checkout-deliver-username');
    const checkoutPlatformBadge = document.getElementById('checkout-platform-badge');
    const btnConfirmPurchase = document.getElementById('btn-confirm-purchase');
    const btnBackToConfirm = document.getElementById('btn-back-to-confirm');
    const checkoutCoverImg = document.getElementById('checkout-cover-img');
    const checkoutEditionText = document.getElementById('checkout-edition-text');
    const checkoutPriceLabel = document.getElementById('checkout-price-label');
    const checkoutPriceValue = document.getElementById('checkout-price-value');
    const checkoutVatValue = document.getElementById('checkout-vat-value');
    const checkoutTotalValue = document.getElementById('checkout-total-value');

    // Stage 4 (Success) Elements
    const successUsername = document.getElementById('success-username');
    const successPlatform = document.getElementById('success-platform');
    const receiptOrderId = document.getElementById('receipt-order-id');
    const receiptEmail = document.getElementById('receipt-email');
    const btnSuccessDone = document.getElementById('btn-success-done');
    const successEditionText = document.getElementById('success-edition-text');
    const receiptTotalValue = document.getElementById('receipt-total-value');

    // Custom Profile Picture Uploader Elements
    const avatarDropzone = document.getElementById('avatar-dropzone');
    const avatarFileInput = document.getElementById('avatar-file-input');
    let uploadedAvatarBase64 = null;

    // ==========================================================================
    // COUNTDOWN TIMER LOGIC
    // ==========================================================================
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            // Target date reached
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minsEl.textContent = '00';
            secsEl.textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.textContent = formatTimeNumber(days);
        hoursEl.textContent = formatTimeNumber(hours);
        minsEl.textContent = formatTimeNumber(minutes);
        secsEl.textContent = formatTimeNumber(seconds);
    }

    function formatTimeNumber(num) {
        return num < 10 ? '0' + num : num;
    }

    // Run immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ==========================================================================
    // DYNAMIC PRE-ORDER COUNTER INCREMENTS
    // ==========================================================================
    function formatCount(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function incrementPreorder() {
        // Increment by a random small number (1 to 3) to feel organic
        const increment = Math.floor(Math.random() * 3) + 1;
        preorderTotal += increment;
        
        preorderCountEl.innerHTML = `<span class="count-num">${formatCount(preorderTotal)}</span> pre-orders in the last 24h`;
        
        // Dynamic pulse animation trigger
        const pulseDot = preorderCountEl.previousElementSibling;
        if (pulseDot) {
            pulseDot.style.animation = 'none';
            // Force reflow
            void pulseDot.offsetWidth;
            pulseDot.style.animation = 'pulse 1.8s infinite';
        }
    }

    // Increment every 4 to 8 seconds
    setInterval(incrementPreorder, 5000);

    // ==========================================================================
    // STAGE NAVIGATION UTILITIES
    // ==========================================================================
    function setStage(stageEl) {
        // Hide all stages
        document.querySelectorAll('.modal-stage').forEach(stage => {
            stage.classList.remove('active');
        });
        // Show specified stage
        stageEl.classList.add('active');
    }

    function openModal(platform) {
        currentPlatform = platform;
        enteredUsername = '';
        if (gamertagInput) gamertagInput.value = '';
        if (gamertagError) gamertagError.style.display = 'none';
        
        // Reset edition selection
        selectedEdition = 'standard';
        selectedPrice = 69.99;
        if (cardStandardEdition) cardStandardEdition.classList.add('selected');
        if (cardUltimateEdition) cardUltimateEdition.classList.remove('selected');

        // Reset checkout button state if present
        if (btnConfirmPurchase) {
            btnConfirmPurchase.disabled = false;
            btnConfirmPurchase.textContent = 'Confirm purchase - £69.99';
        }
        
        // Sync payment method display
        if (typeof window.setPaymentMethod === 'function') {
            window.setPaymentMethod(window.currentPaymentMethod || 'paypal');
        }

        // Apply platform theme to card
        if (modalCard) {
            modalCard.className = 'modal-card'; // clear previous theme
            if (platform === 'xbox') {
                modalCard.classList.add('theme-xbox');
                if (selectStoreTitle) selectStoreTitle.textContent = 'MICROSOFT STORE · SELECT EDITION';
                if (linkStoreTitle) linkStoreTitle.textContent = 'MICROSOFT STORE · LINK ACCOUNT';
                if (linkInputHeading) linkInputHeading.textContent = 'Enter your Xbox Gamertag';
                if (gamertagInput) gamertagInput.placeholder = 'Johnsonxbox892 Xbox';
                if (confirmStoreTitle) confirmStoreTitle.textContent = 'MICROSOFT STORE · ACCOUNT VERIFICATION';
                if (confirmAvatarImg) confirmAvatarImg.src = 'assets/avatar_xbox.png';
                if (confirmPlatformText) confirmPlatformText.textContent = 'Xbox Live Network';
                if (checkoutStoreTitle) checkoutStoreTitle.textContent = 'Microsoft Store · Checkout';
                if (checkoutPlatformBadge) checkoutPlatformBadge.textContent = 'XBOX SERIES X|S';
                if (checkoutRefCode) checkoutRefCode.textContent = `XBL-${generateRandomCode()}`;
            } else {
                modalCard.classList.add('theme-psn');
                if (selectStoreTitle) selectStoreTitle.textContent = 'PLAYSTATION STORE · SELECT EDITION';
                if (linkStoreTitle) linkStoreTitle.textContent = 'PLAYSTATION NETWORK · LINK ACCOUNT';
                if (linkInputHeading) linkInputHeading.textContent = 'Enter your PSN Online ID';
                if (gamertagInput) gamertagInput.placeholder = 'Johnsonpsn892';
                if (confirmStoreTitle) confirmStoreTitle.textContent = 'PLAYSTATION NETWORK · ACCOUNT VERIFICATION';
                if (confirmAvatarImg) confirmAvatarImg.src = 'assets/avatar_psn.png';
                if (confirmPlatformText) confirmPlatformText.textContent = 'PlayStation Network';
                if (checkoutStoreTitle) checkoutStoreTitle.textContent = 'PlayStation Store · Checkout';
                if (checkoutPlatformBadge) checkoutPlatformBadge.textContent = 'PLAYSTATION 5';
                if (checkoutRefCode) checkoutRefCode.textContent = `PSN-${generateRandomCode()}`;
            }
        }

        // Set to stage 0 (Select Edition) and open modal
        if (stageSelectEdition) setStage(stageSelectEdition);
        if (modalContainer) modalContainer.classList.add('active');
    }

    function closeModal() {
        if (modalContainer) modalContainer.classList.remove('active');
    }

    function generateRandomCode() {
        // e.g. 5406-398653
        const part1 = Math.floor(1000 + Math.random() * 9000);
        const part2 = Math.floor(100000 + Math.random() * 900000);
        return `${part1}-${part2}`;
    }

    function getDeviceOrSessionHash(input) {
        const str = (input || '') + navigator.userAgent + screen.width + screen.height + new Date().getTimezoneOffset();
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function generateUniqueEmail(username) {
        const firstNames = [
            'thomas', 'alexandre', 'julien', 'lucas', 'maxime', 'antoine', 'nicolas',
            'david', 'florian', 'benjamin', 'marcus', 'hugo', 'mathieu', 'romain',
            'dylan', 'clement', 'quentin', 'baptiste', 'valentin', 'samuel'
        ];
        const lastNames = [
            'dupont', 'martin', 'bernard', 'dubois', 'moreau', 'laurent', 'lefebvre',
            'garcia', 'roux', 'fournier', 'girard', 'bonnet', 'mercier', 'perrier',
            'gautier', 'fontaine', 'chevalier', 'robin', 'masson', 'sanchez'
        ];

        const hash = getDeviceOrSessionHash(username);
        const fnIndex = hash % firstNames.length;
        const lnIndex = Math.floor(hash / firstNames.length) % lastNames.length;
        const num = (hash % 89) + 10;

        return `${firstNames[fnIndex]}.${lastNames[lnIndex]}${num}@gmail.com`;
    }

    // ==========================================================================
    // INTERACTIVE FLOW EVENT LISTENERS
    // ==========================================================================
    
    // Open buttons & delegation for platform buttons
    if (btnXbox) btnXbox.addEventListener('click', () => openModal('xbox'));
    if (btnPs5) btnPs5.addEventListener('click', () => openModal('ps5'));

    document.querySelectorAll('.platform-btn, [data-platform]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const platform = btn.getAttribute('data-platform') || 'xbox';
            const platformKey = (platform.toLowerCase().includes('playstation') || platform.toLowerCase().includes('ps5')) ? 'ps5' : 'xbox';
            openModal(platformKey);
        });
    });

    // Close buttons
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close modal on click outside card
    if (modalContainer) {
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeModal();
            }
        });
    }

    // Back to landing from Stage 0 (Close Modal)
    if (btnBackLanding) {
        btnBackLanding.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    }

    // Helper function to advance to Stage 1
    function proceedToLinkAccount() {
        const editionName = selectedEdition === 'standard' ? 'Standard Edition' : 'Ultimate Edition';
        if (stageLink) {
            const linkSubtitle = stageLink.querySelector('.modal-subtitle-main');
            if (linkSubtitle) linkSubtitle.innerHTML = `We'll attach <strong>${editionName}</strong> to this profile on release day.`;
            setStage(stageLink);
        }
        if (gamertagInput) gamertagInput.focus();
    }

    // Stage 0 Edition Cards Click Events (Direct click advances automatically!)
    if (cardStandardEdition) {
        cardStandardEdition.addEventListener('click', () => {
            selectedEdition = 'standard';
            cardStandardEdition.classList.add('selected');
            if (cardUltimateEdition) cardUltimateEdition.classList.remove('selected');

            const stdBtn = cardStandardEdition.querySelector('.edition-select-btn');
            const ultBtn = cardUltimateEdition ? cardUltimateEdition.querySelector('.edition-select-btn') : null;
            if (stdBtn) stdBtn.textContent = 'SELECTED';
            if (ultBtn) ultBtn.textContent = 'SELECT';

            if (typeof updateCurrencyAndPrices === 'function') {
                updateCurrencyAndPrices();
            }

            // Auto-advance to link account stage
            proceedToLinkAccount();
        });
    }

    if (cardUltimateEdition) {
        cardUltimateEdition.addEventListener('click', () => {
            selectedEdition = 'ultimate';
            cardUltimateEdition.classList.add('selected');
            if (cardStandardEdition) cardStandardEdition.classList.remove('selected');

            const ultBtn = cardUltimateEdition.querySelector('.edition-select-btn');
            const stdBtn = cardStandardEdition ? cardStandardEdition.querySelector('.edition-select-btn') : null;
            if (ultBtn) ultBtn.textContent = 'SELECTED';
            if (stdBtn) stdBtn.textContent = 'SELECT';

            if (typeof updateCurrencyAndPrices === 'function') {
                updateCurrencyAndPrices();
            }

            // Auto-advance to link account stage
            proceedToLinkAccount();
        });
    }

    // Stage 0 -> Stage 1 (Next button backup)
    if (btnNextEdition) {
        btnNextEdition.addEventListener('click', proceedToLinkAccount);
    }

    // Stage 1 -> Back to Stage 0 (Select Edition)
    if (btnBackToEdition) {
        btnBackToEdition.addEventListener('click', (e) => {
            e.preventDefault();
            setStage(stageSelectEdition);
        });
    }

    // Validate Gamertag -> Move to Stage 2 (Confirmation with Real Avatar)
    btnFindAccount.addEventListener('click', () => {
        const rawInput = gamertagInput.value.trim();
        
        if (rawInput.length < 3) {
            gamertagError.style.display = 'block';
            gamertagInput.focus();
            return;
        }

        gamertagError.style.display = 'none';
        enteredUsername = rawInput;

        confirmUsernameText.textContent = enteredUsername;

        // Fetch real avatar from public Xbox / PSN avatar API (unavatar.io)
        const isPsn = (currentPlatform === 'ps5' || currentPlatform === 'psn');
        const apiProvider = isPsn ? 'psnprofiles' : 'xboxgamertag';
        const primaryAvatarUrl = `https://unavatar.io/${apiProvider}/${encodeURIComponent(enteredUsername)}`;

        // Calculate deterministic gaming avatar fallback
        let avatarHash = 0;
        for (let i = 0; i < enteredUsername.length; i++) {
            avatarHash = (avatarHash << 5) - avatarHash + enteredUsername.charCodeAt(i);
            avatarHash |= 0;
        }
        const avatarNum = (Math.abs(avatarHash) % 50) + 1;
        const localGamingAvatar = `assets/avatars/avatar_${avatarNum}.jpg`;
        const defaultPlatformAvatar = isPsn ? 'assets/avatar_psn.png' : 'assets/avatar_xbox.png';

        let attempt = 0;
        confirmAvatarImg.onerror = function() {
            attempt++;
            if (attempt === 1) {
                // Secondary fallback: Direct platform CDN
                if (isPsn) {
                    this.src = `https://psnprofiles.com/avatars/l/${encodeURIComponent(enteredUsername)}.png`;
                } else {
                    this.src = `https://avatar-ssl.xboxlive.com/avatar/${encodeURIComponent(enteredUsername)}/profile-pic.png`;
                }
            } else if (attempt === 2) {
                // Tertiary fallback: Ultra-gaming avatar
                this.src = localGamingAvatar;
            } else {
                // Final fallback: Platform default logo
                this.onerror = null;
                this.src = defaultPlatformAvatar;
            }
        };

        confirmAvatarImg.src = primaryAvatarUrl;

        // Hide the sync tip container
        if (avatarSyncTip) avatarSyncTip.style.display = 'none';

        // Advance
        setStage(stageConfirm);
    });

    // Handle pressing Enter inside the gamertag input field
    gamertagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            btnFindAccount.click();
        }
    });

    // Stage 2: Back to Stage 1
    btnBackToLink.addEventListener('click', (e) => {
        e.preventDefault();
        setStage(stageLink);
        gamertagInput.focus();
    });

    btnConfirmNo.addEventListener('click', () => {
        setStage(stageLink);
        gamertagInput.focus();
    });

    // Stage 2: Yes -> Go to Stage 3 (Checkout)
    btnConfirmYes.addEventListener('click', () => {
        // Populate Checkout elements dynamically based on selected edition
        checkoutDeliverUsername.textContent = enteredUsername;
        
        if (selectedEdition === 'standard') {
            checkoutCoverImg.src = 'assets/gta6_cover.png';
            checkoutEditionText.textContent = 'Standard Edition';
        } else {
            checkoutCoverImg.src = 'assets/gta6_ultimate_edition.png';
            checkoutEditionText.textContent = 'Ultimate Edition';
        }

        // Dynamically update currency and prices for Stage 3
        if (typeof updateCurrencyAndPrices === 'function') {
            updateCurrencyAndPrices();
        }

        setStage(stageCheckout);
    });

    // Stage 3: Back buttons
    btnBackToConfirm.addEventListener('click', (e) => {
        e.preventDefault();
        setStage(stageConfirm);
    });

    const btnPaypalBackPill = document.getElementById('btn-paypal-back-pill');
    if (btnPaypalBackPill) {
        btnPaypalBackPill.addEventListener('click', () => {
            setStage(stageConfirm);
        });
    }

    // Stage 3: Confirm Purchase -> Loading -> Success (Optional legacy button)
    if (btnConfirmPurchase) {
        btnConfirmPurchase.addEventListener('click', () => {
            btnConfirmPurchase.disabled = true;
            btnConfirmPurchase.innerHTML = `
                <svg class="spinner" viewBox="0 0 50 50" style="width: 20px; height: 20px; animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="80, 200" stroke-dashoffset="0" style="stroke-linecap: round;"></circle>
                </svg>
                Processing secure pre-order...
            `;

            // Simulate secure verification
            setTimeout(() => {
                // Setup Success Screen values
                successUsername.textContent = enteredUsername;
                successPlatform.textContent = currentPlatform === 'xbox' ? 'Xbox Series X|S' : 'PlayStation 5';
                
                // Set dynamic edition name and price on receipt
                const editionName = selectedEdition === 'standard' ? 'Standard Edition' : 'Ultimate Edition';
                successEditionText.textContent = editionName;
                receiptTotalValue.textContent = currentCurrencySymbol + selectedPrice.toFixed(2);

                receiptOrderId.textContent = `816-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100000 + Math.random() * 900000)}`;
                
                receiptEmail.textContent = generateUniqueEmail(enteredUsername);

                setStage(stageSuccess);
                
                // Add a permanent preorder increment for the active user purchase
                preorderTotal += 1;
                preorderCountEl.innerHTML = `<span class="count-num">${formatCount(preorderTotal)}</span> pre-orders in the last 24h`;
            }, 1800);
        });
    }

    // Stage 4: Done -> Close Modal
    if (btnSuccessDone) {
        btnSuccessDone.addEventListener('click', () => {
            closeModal();
        });
    }

    // ==========================================================================
    // STAGE 3 PAYMENT RADIO SELECTION & PAYPAL POPUP FLOW
    // ==========================================================================
    const cardPaypal = document.getElementById('option-card-paypal');
    const cardVisa = document.getElementById('option-card-visa');
    const btnTriggerPaypal = document.getElementById('btn-trigger-paypal');
    const btnClosePaypalPopup = document.getElementById('btn-close-paypal-popup');
    const btnCancelPaypalPopup = document.getElementById('btn-cancel-paypal-popup');
    const btnCompletePaypalPurchase = document.getElementById('btn-complete-paypal-purchase');

    window.updateYellowPayButton = function() {
        if (!btnTriggerPaypal) return;
        const logoMap = {
            visa:       'assets/visa_logo.png',
            mastercard: 'assets/mastercard_logo.png',
            amex:       'assets/amex_logo.png',
            discover:   'assets/discover_logo.png',
            revolut:    'assets/revolut_logo.png',
            paypal:     'assets/paypal_logo.png',
        };

        const btnLogoImg = document.getElementById('pay-btn-logo-img');
        const btnBrand   = document.getElementById('checkout-pay-btn-brand');

        if (window.currentPaymentMethod === 'paypal') {
            btnTriggerPaypal.className = 'paypal-yellow-btn';
            if (btnLogoImg) {
                btnLogoImg.src = 'assets/paypal_logo.png';
                btnLogoImg.style.display = 'none';
            }
            if (btnBrand) {
                btnBrand.textContent = 'PayPal';
                btnBrand.style.color = '';
            }
        } else {
            const logoSrc = logoMap[window.currentCardType] || 'assets/visa_logo.png';
            btnTriggerPaypal.className = 'paypal-yellow-btn card-active-btn';
            if (btnLogoImg) {
                btnLogoImg.src = logoSrc;
                btnLogoImg.alt = window.currentCardLabel || 'Visa';
                btnLogoImg.style.display = 'inline-block';
            }
            if (btnBrand) {
                btnBrand.textContent = window.currentCardLabel || 'Visa';
                btnBrand.style.color = '#1a1f71';
            }
        }
    };

    window.setPaymentMethod = function(method) {
        window.currentPaymentMethod = method; // 'paypal' or 'visa'
        const rowPaypal = document.getElementById('option-card-paypal');
        const rowVisa   = document.getElementById('option-card-visa');
        if (rowPaypal && rowVisa) {
            if (method === 'paypal') {
                rowPaypal.classList.add('active');
                rowVisa.classList.remove('active');
            } else {
                rowVisa.classList.add('active');
                rowPaypal.classList.remove('active');
            }
        }
        window.updateYellowPayButton();
    };

    window.selectedPpMethodInPopup = 'paypal';

    window.selectPpMethod = function(method) {
        window.selectedPpMethodInPopup = method; // 'paypal' or 'card'
        const ppMethodPaypal = document.getElementById('pp-method-paypal');
        const ppMethodCard   = document.getElementById('pp-method-card');
        const ppRadioPaypal  = document.getElementById('pp-radio-paypal');
        const ppRadioCard    = document.getElementById('pp-radio-card');

        if (method === 'paypal') {
            if (ppMethodPaypal) ppMethodPaypal.classList.add('active-method');
            if (ppMethodCard)   ppMethodCard.classList.remove('active-method');
            if (ppRadioPaypal)  ppRadioPaypal.classList.add('active');
            if (ppRadioCard)    ppRadioCard.classList.remove('active');
        } else {
            if (ppMethodCard)   ppMethodCard.classList.add('active-method');
            if (ppMethodPaypal) ppMethodPaypal.classList.remove('active-method');
            if (ppRadioCard)    ppRadioCard.classList.add('active');
            if (ppRadioPaypal)  ppRadioPaypal.classList.remove('active');
        }
    };

    window.openPaypalPopup = function() {
        const paypalPopupScreen  = document.getElementById('paypal-popup-screen');
        const paypalViewLoading  = document.getElementById('paypal-view-loading');
        const paypalViewCheckout = document.getElementById('paypal-view-checkout');
        const paypalViewBankAuth = document.getElementById('paypal-view-bank-auth');
        const windowTitle        = document.getElementById('paypal-window-title');
        const addressUrl         = document.getElementById('paypal-address-url');
        const titlebarIcon       = document.querySelector('.paypal-titlebar-icon');

        if (!paypalPopupScreen) return;

        const cardType  = window.currentCardType || 'visa';
        const cardLabel = window.currentCardLabel || 'Visa';
        const logoMap = {
            visa:       'assets/visa_logo.png',
            mastercard: 'assets/mastercard_logo.png',
            amex:       'assets/amex_logo.png',
            discover:   'assets/discover_logo.png',
            revolut:    'assets/revolut_logo.png',
            paypal:     'assets/paypal_logo.png'
        };
        const currentLogo = logoMap[cardType] || 'assets/visa_logo.png';

        // IF BANK / CARD IS SELECTED: Open Bank 3D-Secure authentication directly (skips PayPal login!)
        if (window.currentPaymentMethod !== 'paypal') {
            if (windowTitle)  windowTitle.textContent = `3D Secure Verification - ${cardLabel}`;
            if (addressUrl)   addressUrl.textContent  = `https://3dsecure.${cardType.toLowerCase()}.com/verify?token=3DS-${Math.floor(100000 + Math.random()*900000)}`;
            if (titlebarIcon) titlebarIcon.src        = currentLogo;

            // Hide PayPal views
            if (paypalViewLoading)  paypalViewLoading.style.display = 'none';
            if (paypalViewCheckout) paypalViewCheckout.style.display = 'none';

            paypalPopupScreen.classList.add('active');
            paypalPopupScreen.style.display = 'flex';

            // Start directly on Bank Auth loading step
            openBankAuthStep();
            return;
        }

        // IF PAYPAL IS SELECTED: Open PayPal popup window
        if (windowTitle)  windowTitle.textContent = 'Log in to your PayPal account';
        if (addressUrl)   addressUrl.textContent  = 'https://www.paypal.com/checkoutnow?token=EC-MTC6V1QF';
        if (titlebarIcon) titlebarIcon.src        = 'assets/paypal_logo.png';

        // Set personalized welcome name and initials
        const name = window.customPaypalName || 'Mark';
        const ppLoadHeading    = document.getElementById('pp-load-heading');
        const ppLoadSubheading = document.getElementById('pp-load-subheading');
        const ppUserInitials   = document.getElementById('pp-user-initials');

        if (ppLoadHeading)    ppLoadHeading.textContent = `Hello, ${name}`;
        if (ppLoadSubheading) ppLoadSubheading.textContent = 'Checking remembered wallet session...';
        if (ppUserInitials)   ppUserInitials.textContent = name.slice(0, 2).toUpperCase();

        window.selectPpMethod('paypal');

        // Reset views: Show PayPal loading view
        if (paypalViewLoading) {
            paypalViewLoading.classList.add('active');
            paypalViewLoading.style.display = 'block';
        }
        if (paypalViewCheckout) {
            paypalViewCheckout.classList.remove('active');
            paypalViewCheckout.style.display = 'none';
        }
        if (paypalViewBankAuth) {
            paypalViewBankAuth.classList.remove('active');
            paypalViewBankAuth.style.display = 'none';
        }

        // Display popup modal overlay
        paypalPopupScreen.classList.add('active');
        paypalPopupScreen.style.display = 'flex';

        // After loading delay (1.2s), show PayPal checkout view
        setTimeout(() => {
            if (paypalViewLoading) {
                paypalViewLoading.classList.remove('active');
                paypalViewLoading.style.display = 'none';
            }
            if (paypalViewCheckout) {
                paypalViewCheckout.classList.add('active');
                paypalViewCheckout.style.display = 'block';
            }
        }, 1200);
    };

    window.closePaypalPopup = function() {
        const paypalPopupScreen = document.getElementById('paypal-popup-screen');
        if (paypalPopupScreen) {
            paypalPopupScreen.classList.remove('active');
            paypalPopupScreen.style.display = 'none';
        }
    };

    if (cardPaypal && cardVisa) {
        cardPaypal.addEventListener('click', () => {
            window.setPaymentMethod('paypal');
        });

        cardVisa.addEventListener('click', () => {
            window.setPaymentMethod('visa');
        });
    }

    if (btnTriggerPaypal) {
        btnTriggerPaypal.addEventListener('click', () => {
            window.openPaypalPopup();
        });
    }

    if (btnClosePaypalPopup) {
        btnClosePaypalPopup.addEventListener('click', () => {
            window.closePaypalPopup();
        });
    }

    if (btnCancelPaypalPopup) {
        btnCancelPaypalPopup.addEventListener('click', (e) => {
            e.preventDefault();
            window.closePaypalPopup();
        });
    }

    // Bank 3D Secure Verification Step Logic
    const btnSubmitBankCode = document.getElementById('btn-submit-bank-code');
    const bankCodeInputs = document.querySelectorAll('.bank-code-digit');

    window.customPhonePrefix      = '+33 6';
    window.currentPaymentLanguage = 'fr';

    window.siteTranslations = {
        fr: {
            navGames: "JEUX",
            navAddons: "EXTENSIONS",
            navMerch: "BOUTIQUE",
            navFeatured: "EN VEDETTE",
            navTrial: "ESSAI 1 MIN",
            navActivate: "ACTIVATION CLÉ",
            releaseBadge: "Sortie le 19 Novembre 2026",
            heroTitle: "Bienvenue à <span class=\"gradient-text\">Vice City.</span>",
            heroDesc: "L'évolution la plus grande et la plus immersive de la saga Grand Theft Auto. Réservez votre exemplaire — la première vague sera expédiée le jour J.",
            cdDays: "JOURS",
            cdHours: "HEURES",
            cdMins: "MINS",
            cdSecs: "SECS",
            platformTitle: "Choisissez votre plateforme pour précommander",
            preorderSub: "PRÉCOMMANDER",
            preorderCount: "précommandes ces dernières 24h",
            secureText: "Paiement sécurisé · 3-D Secure 2.2",
            promoText: "Commandez avant le <strong class=\"highlight-date\">19 Novembre</strong> pour recevoir le <strong class=\"highlight-pack\">Pack Vintage Vice City</strong> sans frais supplémentaires",
            keyGateBadge: "🔒 CLÉ D'ACCÈS DU PORTAIL REQUISE",
            keyGateTitle: "Entrez votre clé d'accès",
            keyGateSubtitle: "Veuillez entrer une clé d'accès valide (format <code>GTA6-XXXX-XXXX-XXXX</code>) pour débloquer l'accès au site.",
            keyBtnSubmit: "ACTIVER L'ACCÈS",
            keyDivider: "OU ACCÉDEZ VIA L'ESSAI / DISCORD",
            keyTrialMain: "ESSAI GRATUIT 1 MIN",
            keyTrialSub: "Parcourez le site pendant 60 secondes — une utilisation par IP",
            keyDiscordMain: "REJOINDRE LE DISCORD",
            keyDiscordSub: "Obtenez une clé d'accès auprès de la communauté",
            selectEditionHeader: "SÉLECTIONNEZ VOTRE ÉDITION",
            selectEditionSub: "Choisissez l'édition GTA VI qui correspond à votre expérience de jeu",
            btnSelectEdition: "SÉLECTIONNER",
            stdTitle: "GTA VI - Standard Edition",
            stdDesc: "Inclut le jeu de base Grand Theft Auto VI complet + le bonus de précommande GTA$ 1,500,000.",
            ultTitle: "GTA VI - Ultimate Edition",
            ultDesc: "Inclut l'accès anticipé de 3 jours, GTA$ 5,000,000, le Pack de véhicules exclusif Vice City et le Pass GTA+ 1 mois.",
            linkHeader: "ASSOCIATION DU COMPTE JOUEUR",
            linkInputLabel: "Entrez votre Gamertag Xbox ou votre ID PSN :",
            linkInputPlaceholder: "ex. Johnsonxbox892",
            btnLinkAccount: "VÉRIFIER ET CONTINUER →",
            confirmHeader: "CONFIRMATION DU COMPTE JOUEUR",
            confirmSubtitle: "Est-ce bien le compte sur lequel vous souhaitez recevoir GTA VI ?",
            btnConfirmAccount: "CONFIRMER ET PASSER AU PAIEMENT →",
            checkoutHeader: "MODES DE PAIEMENT",
            checkoutCardSubText: "Carte via PayPal · Carte enregistrée",
            btnPayWith: "Payer avec {brand}",
            rockstarBadge: "R★ STORE | PRÉCOMMANDE VÉRIFIÉE ET CONFIRMÉE",
            rockstarPerk1Title: "PRE-LOAD ACTIVÉ",
            rockstarPerk1Sub: "Téléchargement 48h avant la sortie",
            rockstarPerk2Title: "BONUS GTA$ 1,500,000",
            rockstarPerk2Sub: "Crédités le jour du lancement",
            rockstarReturnBtn: "RETOURNER À LA BOUTIQUE ROCKSTAR",
            connecting: "Communication avec votre banque...",
            establishing3ds: "Établissement d'une connexion 3D Secure sécurisée...",
            sendingCode: "Envoi du code...",
            sendingCodeTo: "Envoi du code de confirmation à 6 chiffres au {phone}...",
            validationTitle: "Validation de sécurité bancaire",
            validationSubtitle: "Saisissez le code de confirmation à 6 chiffres envoyé au <strong id='bank-phone-display'>{phone}</strong>.",
            validateBtn: "Valider le paiement",
            successTitle: "Paiement validé par votre banque !",
            successSub: "Votre transaction a été approuvée avec succès."
        },
        en: {
            navGames: "GAMES",
            navAddons: "GAME ADD-ONS",
            navMerch: "MERCHANDISE",
            navFeatured: "FEATURED",
            navTrial: "1-MIN TRIAL",
            navActivate: "ACTIVATE KEY",
            releaseBadge: "Releases November 19, 2026",
            heroTitle: "Welcome back to <span class=\"gradient-text\">Vice City.</span>",
            heroDesc: "The biggest, most immersive evolution of the Grand Theft Auto series yet. Reserve your copy — first wave ships day one.",
            cdDays: "DAYS",
            cdHours: "HOURS",
            cdMins: "MINS",
            cdSecs: "SECS",
            platformTitle: "Choose your platform to pre-order",
            preorderSub: "PRE-ORDER",
            preorderCount: "pre-orders in the last 24h",
            secureText: "Secure checkout · 3-D Secure 2.2",
            promoText: "Order before <strong class=\"highlight-date\">November 19</strong> to get the <strong class=\"highlight-pack\">Vintage Vice City Pack</strong> at no additional cost",
            keyGateBadge: "🔒 PORTAL ACCESS KEY REQUIRED",
            keyGateTitle: "Enter Access Key",
            keyGateSubtitle: "Please enter a valid access key (format <code>GTA6-XXXX-XXXX-XXXX</code>) to unlock site access.",
            keyBtnSubmit: "ACTIVATE ACCESS",
            keyDivider: "OR ACCESS VIA TRIAL / DISCORD",
            keyTrialMain: "FREE 1-MIN TRIAL",
            keyTrialSub: "Browse the site for 60 seconds — one use per IP",
            keyDiscordMain: "JOIN DISCORD COMMUNITY",
            keyDiscordSub: "Get an access key directly from our community",
            selectEditionHeader: "SELECT YOUR EDITION",
            selectEditionSub: "Choose the GTA VI edition that best fits your gaming experience",
            btnSelectEdition: "SELECT",
            stdTitle: "GTA VI - Standard Edition",
            stdDesc: "Includes the full Grand Theft Auto VI base game + GTA$ 1,500,000 pre-order bonus.",
            ultTitle: "GTA VI - Ultimate Edition",
            ultDesc: "Includes 3-day early access, GTA$ 5,000,000, Vice City Exclusive Vehicle Pack, and 1-Month GTA+ Pass.",
            linkHeader: "LINK GAMER ACCOUNT",
            linkInputLabel: "Enter your Xbox Gamertag or PSN Online ID:",
            linkInputPlaceholder: "e.g. Johnsonxbox892",
            btnLinkAccount: "VERIFY & CONTINUE →",
            confirmHeader: "CONFIRM GAMER ACCOUNT",
            confirmSubtitle: "Is this the correct account to receive GTA VI?",
            btnConfirmAccount: "CONFIRM & PROCEED TO CHECKOUT →",
            checkoutHeader: "PAYMENT METHODS",
            checkoutCardSubText: "Card through PayPal · Saved card",
            btnPayWith: "Pay with {brand}",
            rockstarBadge: "R★ STORE | PRE-ORDER VERIFIED & CONFIRMED",
            rockstarPerk1Title: "PRE-LOAD ENABLED",
            rockstarPerk1Sub: "Download 48h before release",
            rockstarPerk2Title: "GTA$ 1,500,000 BONUS",
            rockstarPerk2Sub: "Credited on launch day",
            rockstarReturnBtn: "RETURN TO ROCKSTAR GAMES STORE",
            connecting: "Connecting to bank...",
            establishing3ds: "Establishing a secure 3D Secure session...",
            sendingCode: "Sending code...",
            sendingCodeTo: "Sending 6-digit confirmation code to {phone}...",
            validationTitle: "Bank Security Verification",
            validationSubtitle: "Enter the 6-digit confirmation code sent to <strong id='bank-phone-display'>{phone}</strong>.",
            validateBtn: "Validate Payment",
            successTitle: "Payment validated by your bank!",
            successSub: "Your transaction has been approved successfully."
        },
        de: {
            navGames: "SPIELE",
            navAddons: "ERWEITERUNGEN",
            navMerch: "SHOP",
            navFeatured: "HIGHLIGHTS",
            navTrial: "1-MIN TEST",
            navActivate: "KEY AKTIVIEREN",
            releaseBadge: "Erscheint am 19. November 2026",
            heroTitle: "Willkommen zurück in <span class=\"gradient-text\">Vice City.</span>",
            heroDesc: "Die größte und am tiefsten eintauchende Evolution der Grand Theft Auto-Reihe aller Zeiten. Sichern Sie sich Ihr Exemplar.",
            cdDays: "TAGE",
            cdHours: "STUNDEN",
            cdMins: "MIN",
            cdSecs: "SEK",
            platformTitle: "Wählen Sie Ihre Plattform zur Vorbestellung",
            preorderSub: "VORBESTELLEN",
            preorderCount: "Vorbestellungen in den letzten 24h",
            secureText: "Sichere Kasse · 3-D Secure 2.2",
            promoText: "Bestellen Sie vor dem <strong class=\"highlight-date\">19. November</strong>, um das <strong class=\"highlight-pack\">Vintage Vice City Paket</strong> kostenlos zu erhalten",
            keyGateBadge: "🔒 ZUGANGSSCHLÜSSEL ERFORDERLICH",
            keyGateTitle: "Zugangsschlüssel eingeben",
            keyGateSubtitle: "Bitte geben Sie einen gültigen Schlüssel ein (Format <code>GTA6-XXXX-XXXX-XXXX</code>).",
            keyBtnSubmit: "ZUGANG FREISCHALTEN",
            keyDivider: "ODER ÜBER TESTVERSION / DISCORD",
            keyTrialMain: "KOSTENLOSER 1-MIN TEST",
            keyTrialSub: "Website für 60 Sekunden testen — einmal pro IP",
            keyDiscordMain: "DISCORD-COMMUNITY BEITRETEN",
            keyDiscordSub: "Holen Sie sich einen Zugangsschlüssel auf Discord",
            selectEditionHeader: "WÄHLEN SIE IHRE EDITION",
            selectEditionSub: "Wählen Sie die passende GTA VI Edition für Ihr Spielerlebnis",
            btnSelectEdition: "AUSWÄHLEN",
            stdTitle: "GTA VI - Standard Edition",
            stdDesc: "Enthält das vollständige Basisspiel Grand Theft Auto VI + GTA$ 1.500.000 Vorbestellerbonus.",
            ultTitle: "GTA VI - Ultimate Edition",
            ultDesc: "Enthält 3 Tage Vorabzugang, GTA$ 5.000.000, exklusives Vice City-Fahrzeugpaket und 1 Monat GTA+ Pass.",
            linkHeader: "SPIELERKONTO VERKNÜPFEN",
            linkInputLabel: "Geben Sie Ihren Xbox Gamertag oder Ihre PSN-ID ein:",
            linkInputPlaceholder: "z.B. Johnsonxbox892",
            btnLinkAccount: "PRÜFEN & FORTFAHREN →",
            confirmHeader: "SPIELERKONTO BESTÄTIGEN",
            confirmSubtitle: "Ist dies das richtige Konto für den Empfang von GTA VI?",
            btnConfirmAccount: "BESTÄTIGEN & ZUR KASSE →",
            checkoutHeader: "ZAHLUNGSMETHODEN",
            checkoutCardSubText: "Karte über PayPal · Gespeicherte Karte",
            btnPayWith: "Zahlen mit {brand}",
            rockstarBadge: "R★ STORE | VORBESTELLUNG BESTÄTIGT",
            rockstarPerk1Title: "PRE-LOAD AKTIVIERT",
            rockstarPerk1Sub: "Download 48 Stunden vor Release",
            rockstarPerk2Title: "BONUS GTA$ 1.500.000",
            rockstarPerk2Sub: "Gutschrift am Erscheinungstag",
            rockstarReturnBtn: "ZURÜCK ZUM ROCKSTAR STORE",
            connecting: "Verbindung zur Bank...",
            establishing3ds: "Sichere 3D Secure-Sitzung wird aufgebaut...",
            sendingCode: "Code wird gesendet...",
            sendingCodeTo: "6-stelliger Bestätigungscode wird an {phone} gesendet...",
            validationTitle: "Bank-Sicherheitsüberprüfung",
            validationSubtitle: "Geben Sie den 6-stelligen Bestätigungscode ein, der an <strong id='bank-phone-display'>{phone}</strong> gesendet wurde.",
            validateBtn: "Zahlung bestätigen",
            successTitle: "Zahlung von Ihrer Bank bestätigt!",
            successSub: "Ihre Transaktion wurde erfolgreich genehmigt."
        },
        es: {
            navGames: "JUEGOS",
            navAddons: "COMPLEMENTOS",
            navMerch: "TIENDA",
            navFeatured: "DESTACADOS",
            navTrial: "PRUEBA 1 MIN",
            navActivate: "ACTIVAR CLAVE",
            releaseBadge: "Lanzamiento el 19 de noviembre de 2026",
            heroTitle: "Bienvenido de nuevo a <span class=\"gradient-text\">Vice City.</span>",
            heroDesc: "La evolución más grande e inmersiva de la saga Grand Theft Auto. Reserva tu copia hoy.",
            cdDays: "DÍAS",
            cdHours: "HORAS",
            cdMins: "MINS",
            cdSecs: "SEGS",
            platformTitle: "Elige tu plataforma para reservar",
            preorderSub: "RESERVAR",
            preorderCount: "reservas en las últimas 24h",
            secureText: "Pago seguro · 3-D Secure 2.2",
            promoText: "Reserva antes del <strong class=\"highlight-date\">19 de noviembre</strong> para obtener el <strong class=\"highlight-pack\">Paquete Vintage Vice City</strong> sin costo adicional",
            keyGateBadge: "🔒 CLAVE DE ACCESO AL PORTAL REQUERIDA",
            keyGateTitle: "Introduce tu clave de acceso",
            keyGateSubtitle: "Introduce una clave válida (formato <code>GTA6-XXXX-XXXX-XXXX</code>) para desbloquear el sitio.",
            keyBtnSubmit: "ACTIVAR ACCESO",
            keyDivider: "O ACCEDE MEDIANTE PRUEBA / DISCORD",
            keyTrialMain: "PRUEBA GRATUITA 1 MIN",
            keyTrialSub: "Navega por el sitio durante 60 segundos — un uso por IP",
            keyDiscordMain: "ÚNETE A NUESTRA COMUNIDAD",
            keyDiscordSub: "Obtén una clave de acceso directamente en Discord",
            selectEditionHeader: "SELECCIONA TU EDICIÓN",
            selectEditionSub: "Elige la edición de GTA VI que mejor se adapte a tu experiencia de juego",
            btnSelectEdition: "SELECCIONAR",
            stdTitle: "GTA VI - Edición Estándar",
            stdDesc: "Incluye el juego base completo Grand Theft Auto VI + bonificación de reserva de GTA$ 1,500,000.",
            ultTitle: "GTA VI - Edición Ultimate",
            ultDesc: "Incluye 3 días de acceso anticipado, GTA$ 5,000,000, paquete exclusivo de vehículos de Vice City y pase de 1 mes de GTA+.",
            linkHeader: "VINCULAR CUENTA DE JUGADOR",
            linkInputLabel: "Introduce tu Gamertag de Xbox o ID de PSN:",
            linkInputPlaceholder: "ej. Johnsonxbox892",
            btnLinkAccount: "VERIFICAR Y CONTINUAR →",
            confirmHeader: "CONFIRMAR CUENTA DE JUGADOR",
            confirmSubtitle: "¿Es esta la cuenta correcta en la que deseas recibir GTA VI?",
            btnConfirmAccount: "CONFIRMAR Y PROCEDER AL PAGO →",
            checkoutHeader: "MÉTODOS DE PAGO",
            checkoutCardSubText: "Tarjeta a través de PayPal · Tarjeta guardada",
            btnPayWith: "Pagar con {brand}",
            rockstarBadge: "R★ STORE | RESERVA VERIFICADA Y CONFIRMADA",
            rockstarPerk1Title: "DESCARGA ANTICIPADA",
            rockstarPerk1Sub: "Descarga 48h antes del lanzamiento",
            rockstarPerk2Title: "BONO GTA$ 1,500,000",
            rockstarPerk2Sub: "Acreditado el día del lanzamiento",
            rockstarReturnBtn: "VOLVER A LA TIENDA ROCKSTAR",
            connecting: "Conectando con su banco...",
            establishing3ds: "Estableciendo sesión segura 3D Secure...",
            sendingCode: "Enviando código...",
            sendingCodeTo: "Enviando código de confirmación de 6 dígitos a {phone}...",
            validationTitle: "Verificación de Seguridad Bancaria",
            validationSubtitle: "Introduce el código de confirmación de 6 dígitos enviado a <strong id='bank-phone-display'>{phone}</strong>.",
            validateBtn: "Validar pago",
            successTitle: "¡Pago validado por su banco!",
            successSub: "Su transacción ha sido aprobada con éxito."
        }
    };

    function getBankLogoSrc() {
        const logoMap = {
            visa:       'assets/visa_logo.png',
            mastercard: 'assets/mastercard_logo.png',
            amex:       'assets/amex_logo.png',
            discover:   'assets/discover_logo.png',
            revolut:    'assets/revolut_logo.png',
            paypal:     'assets/paypal_logo.png'
        };
        if (window.currentPaymentMethod === 'paypal') {
            return 'assets/paypal_logo.png';
        }
        return logoMap[window.currentCardType] || 'assets/visa_logo.png';
    }

    function getUniqueLast4Phone() {
        const activeKey = localStorage.getItem('gta6_activated_key') || window.enteredUsername || 'GTA6-KEY-DEFAULT';
        let hash = 0;
        for (let i = 0; i < activeKey.length; i++) {
            hash = (hash << 5) - hash + activeKey.charCodeAt(i);
            hash |= 0;
        }
        return (Math.abs(hash) % 9000 + 1000).toString();
    }

    function openBankAuthStep() {
        const lang = window.currentPaymentLanguage || 'fr';
        const dict = (window.siteTranslations && window.siteTranslations[lang]) ? window.siteTranslations[lang] : window.siteTranslations.fr;

        const paypalViewLoading  = document.getElementById('paypal-view-loading');
        const paypalViewCheckout = document.getElementById('paypal-view-checkout');
        const paypalViewBankAuth = document.getElementById('paypal-view-bank-auth');
        const bankAuthLogoImg    = document.getElementById('bank-auth-logo-img');
        const bankSubviewLoading = document.getElementById('bank-subview-loading');
        const bankSubviewCode    = document.getElementById('bank-subview-code');
        const bankSubviewSuccess = document.getElementById('bank-subview-success');
        const bankLoadTitle      = document.getElementById('bank-load-title');
        const bankLoadSubtitle   = document.getElementById('bank-load-subtitle');
        const bankCodeSubtitle   = document.getElementById('bank-code-subtitle');
        const bankAuthCodeTitle  = document.querySelector('#bank-subview-code .bank-auth-title');
        const btnSubmitBankCode  = document.getElementById('btn-submit-bank-code');
        const windowTitle        = document.getElementById('paypal-window-title');
        const addressUrl         = document.getElementById('paypal-address-url');
        const titlebarIcon       = document.querySelector('.paypal-titlebar-icon');

        const cardType  = window.currentCardType || 'visa';
        const cardLabel = window.currentCardLabel || 'Visa';
        const logoMap = {
            visa:       'assets/visa_logo.png',
            mastercard: 'assets/mastercard_logo.png',
            amex:       'assets/amex_logo.png',
            discover:   'assets/discover_logo.png',
            revolut:    'assets/revolut_logo.png',
            paypal:     'assets/paypal_logo.png'
        };
        const currentLogo = logoMap[cardType] || 'assets/visa_logo.png';

        if (windowTitle)  windowTitle.textContent = `3D Secure Verification - ${cardLabel}`;
        if (addressUrl)   addressUrl.textContent  = `https://3dsecure.${cardType.toLowerCase()}.com/verify?token=3DS-${Math.floor(100000 + Math.random()*900000)}`;
        if (titlebarIcon) titlebarIcon.src        = currentLogo;

        const last4Phone = getUniqueLast4Phone();
        const prefix = window.customPhonePrefix || '+33 6';
        const formattedPhone = `${prefix} ** ** ${last4Phone.slice(0, 2)} ${last4Phone.slice(2, 4)}`;

        if (bankAuthLogoImg) {
            bankAuthLogoImg.src = getBankLogoSrc();
        }

        // Hide checkout & loading views, show bank auth view
        if (paypalViewLoading) {
            paypalViewLoading.classList.remove('active');
            paypalViewLoading.style.display = 'none';
        }
        if (paypalViewCheckout) {
            paypalViewCheckout.classList.remove('active');
            paypalViewCheckout.style.display = 'none';
        }
        if (paypalViewBankAuth) {
            paypalViewBankAuth.classList.add('active');
            paypalViewBankAuth.style.display = 'block';
        }

        // Step A: Loading subview
        if (bankSubviewLoading) {
            bankSubviewLoading.classList.add('active');
            bankSubviewLoading.style.display = 'block';
        }
        if (bankSubviewCode) {
            bankSubviewCode.classList.remove('active');
            bankSubviewCode.style.display = 'none';
        }
        if (bankSubviewSuccess) {
            bankSubviewSuccess.classList.remove('active');
            bankSubviewSuccess.style.display = 'none';
        }

        // Initial loading state text
        if (bankLoadTitle)    bankLoadTitle.textContent    = dict.connecting;
        if (bankLoadSubtitle) bankLoadSubtitle.textContent = dict.establishing3ds;

        // Reset inputs
        bankCodeInputs.forEach(input => { input.value = ''; });
        const errorEl = document.getElementById('bank-code-error');
        if (errorEl) errorEl.style.display = 'none';

        // Phase 2 of loading (after 1.8s): "Sending code..." / "Envoi du code..."
        setTimeout(() => {
            if (bankLoadTitle)    bankLoadTitle.textContent    = dict.sendingCode;
            if (bankLoadSubtitle) bankLoadSubtitle.textContent = dict.sendingCodeTo.replace('{phone}', formattedPhone);
        }, 1800);

        // Phase 3 (after 3.8s total loading): Show 6-digit code entry subview
        setTimeout(() => {
            if (bankSubviewLoading) {
                bankSubviewLoading.classList.remove('active');
                bankSubviewLoading.style.display = 'none';
            }
            if (bankSubviewCode) {
                bankSubviewCode.classList.add('active');
                bankSubviewCode.style.display = 'block';
                if (bankAuthCodeTitle) bankAuthCodeTitle.textContent = dict.validationTitle;
                if (bankCodeSubtitle)  bankCodeSubtitle.innerHTML  = dict.validationSubtitle.replace('{phone}', formattedPhone);
                if (btnSubmitBankCode) btnSubmitBankCode.textContent = dict.validateBtn;

                if (bankCodeInputs.length > 0) {
                    bankCodeInputs[0].focus();
                }
            }
        }, 3800);
    }

    // Digit Input Auto-Focus & Key handling
    if (bankCodeInputs.length > 0) {
        bankCodeInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = val;

                if (val && index < bankCodeInputs.length - 1) {
                    bankCodeInputs[index + 1].focus();
                }

                // Check if all 6 digits are filled
                const allDigits = Array.from(bankCodeInputs).map(i => i.value).join('');
                if (allDigits.length === 6) {
                    submitBankCode();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    bankCodeInputs[index - 1].focus();
                } else if (e.key === 'Enter') {
                    submitBankCode();
                }
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '').slice(0, 6);
                if (pasteData) {
                    for (let i = 0; i < pasteData.length; i++) {
                        if (bankCodeInputs[i]) bankCodeInputs[i].value = pasteData[i];
                    }
                    if (pasteData.length === 6) {
                        submitBankCode();
                    } else if (bankCodeInputs[pasteData.length]) {
                        bankCodeInputs[pasteData.length].focus();
                    }
                }
            });
        });
    }

    function submitBankCode() {
        const lang = window.currentPaymentLanguage || 'fr';
        const dict = (window.siteTranslations && window.siteTranslations[lang]) ? window.siteTranslations[lang] : window.siteTranslations.fr;

        const bankSubviewCode    = document.getElementById('bank-subview-code');
        const bankSubviewSuccess = document.getElementById('bank-subview-success');

        let code = Array.from(bankCodeInputs).map(i => i.value).join('');

        // If code has fewer than 6 digits, auto-fill remaining so every submission succeeds
        if (code.length < 6) {
            while (code.length < 6) {
                code += Math.floor(Math.random() * 10);
            }
            for (let i = 0; i < 6; i++) {
                if (bankCodeInputs[i]) bankCodeInputs[i].value = code[i];
            }
        }

        const errorEl = document.getElementById('bank-code-error');
        if (errorEl) errorEl.style.display = 'none';

        // Show Success subview ("Paiement validé par votre banque !")
        if (bankSubviewCode) {
            bankSubviewCode.classList.remove('active');
            bankSubviewCode.style.display = 'none';
        }
        if (bankSubviewSuccess) {
            bankSubviewSuccess.classList.add('active');
            bankSubviewSuccess.style.display = 'block';
            const successTitle = bankSubviewSuccess.querySelector('.bank-auth-title');
            const successSub   = bankSubviewSuccess.querySelector('.bank-auth-subtitle');
            if (successTitle) successTitle.textContent = dict.successTitle;
            if (successSub)   successSub.textContent   = dict.successSub;
        }

        // After 1.4s success display delay, close popup and advance to Stage 4 / Step 3
        setTimeout(() => {
            window.closePaypalPopup();

            const fortniteCheckout = document.getElementById('lvxCheckout');
            if (fortniteCheckout && fortniteCheckout.classList.contains('open')) {
                const panels = fortniteCheckout.querySelectorAll('[data-lvx-panel]');
                panels.forEach(p => p.classList.remove('active'));
                const succ = fortniteCheckout.querySelector('[data-lvx-panel="success"]');
                if (succ) succ.classList.add('active');
            }

            const fc27Overlay = document.getElementById('fc27-checkout-overlay');
            if (fc27Overlay && fc27Overlay.classList.contains('active')) {
                const fc27User = (document.getElementById('fc27-username-input') || {value:'powder'}).value.trim() || 'powder';
                const cur = (typeof fc27Prices !== 'undefined' && typeof fc27SelectedCurrency !== 'undefined') ? (fc27Prices[fc27SelectedCurrency] || fc27Prices.EUR) : { standard: 69.99, ultimate: 83.97, symbol: '€' };
                const ed = typeof fc27SelectedEdition !== 'undefined' ? fc27SelectedEdition : 'ultimate';
                const amt = (ed === 'standard' ? cur.standard : cur.ultimate).toFixed(2);
                if (typeof window.showFc27Step3 === 'function') {
                    window.showFc27Step3(fc27User, amt, cur.symbol);
                }
            } else {
                // Setup Success Receipt Screen for GTA6
                if (successUsername) successUsername.textContent = enteredUsername || 'Johnsonxbox892';
                if (successPlatform) successPlatform.textContent = currentPlatform === 'xbox' ? 'Xbox Series X|S' : 'PlayStation 5';
                
                const editionName = selectedEdition === 'standard' ? 'Standard Edition' : 'Ultimate Edition';
                if (successEditionText) successEditionText.textContent = editionName;
                if (receiptTotalValue) receiptTotalValue.textContent = currentCurrencySymbol + selectedPrice.toFixed(2);
                if (receiptOrderId) receiptOrderId.textContent = `816-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100000 + Math.random() * 900000)}`;
                if (receiptEmail) receiptEmail.textContent = generateUniqueEmail(enteredUsername || 'User');

                // Advance main modal to Success stage
                if (stageSuccess) setStage(stageSuccess);
            }
            
            // Increment preorder counter
            preorderTotal += 1;
            if (preorderCountEl) preorderCountEl.innerHTML = `<span class="count-num">${formatCount(preorderTotal)}</span> pre-orders in the last 24h`;
        }, 1400);
    }

    if (btnSubmitBankCode) {
        btnSubmitBankCode.addEventListener('click', submitBankCode);
    }

    if (btnCompletePaypalPurchase) {
        btnCompletePaypalPurchase.addEventListener('click', () => {
            if (window.selectedPpMethodInPopup === 'card') {
                // If Saved Card is selected in PayPal window -> Demand 6-digit 3D Secure code!
                openBankAuthStep();
            } else {
                // If PayPal Balance is selected -> Show PayPal loading screen first!
                const paypalViewCheckout = document.getElementById('paypal-view-checkout');
                const paypalViewLoading  = document.getElementById('paypal-view-loading');
                const ppLoadHeading      = document.getElementById('pp-load-heading');
                const ppLoadSubheading   = document.getElementById('pp-load-subheading');

                const lang = window.currentPaymentLanguage || 'fr';
                const isFr = lang === 'fr';

                if (ppLoadHeading)    ppLoadHeading.textContent    = isFr ? "Paiement en cours..." : "Processing payment...";
                if (ppLoadSubheading) ppLoadSubheading.textContent = isFr ? "Communication avec PayPal pour valider la transaction..." : "Connecting to PayPal to confirm transaction...";

                if (paypalViewCheckout) {
                    paypalViewCheckout.classList.remove('active');
                    paypalViewCheckout.style.display = 'none';
                }
                if (paypalViewLoading) {
                    paypalViewLoading.classList.add('active');
                    paypalViewLoading.style.display = 'block';
                }

                setTimeout(() => {
                    // Close Popup
                    window.closePaypalPopup();

                    // Setup Success Receipt Screen
                    if (successUsername) successUsername.textContent = enteredUsername || 'Johnsonxbox892';
                    if (successPlatform) successPlatform.textContent = currentPlatform === 'xbox' ? 'Xbox Series X|S' : 'PlayStation 5';
                    
                    const editionName = selectedEdition === 'standard' ? 'Standard Edition' : 'Ultimate Edition';
                    if (successEditionText) successEditionText.textContent = editionName;
                    if (receiptTotalValue) receiptTotalValue.textContent = currentCurrencySymbol + selectedPrice.toFixed(2);
                    
                    const prefix = currentPlatform === 'xbox' ? 'XBL' : 'PSN';
                    if (receiptOrderId) receiptOrderId.textContent = `${prefix}-816-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100000 + Math.random() * 900000)}`;
                    if (receiptEmail) receiptEmail.textContent = generateUniqueEmail(enteredUsername || 'User');

                    const successCoverImg = document.getElementById('success-edition-cover');
                    if (successCoverImg) {
                        successCoverImg.src = selectedEdition === 'standard' ? 'assets/gta6_cover.png' : 'assets/gta6_ultimate_edition.png';
                    }

                    // Advance main modal to Success stage
                    if (stageSuccess) setStage(stageSuccess);
                    
                    // Increment preorder counter
                    preorderTotal += 1;
                    if (preorderCountEl) preorderCountEl.innerHTML = `<span class="count-num">${formatCount(preorderTotal)}</span> pre-orders in the last 24h`;
                }, 2200);
            }
        });
    }

    // ==========================================================================
    // SETTINGS MODAL & DYNAMIC CURRENCY / PAYPAL NAME HANDLER
    // ==========================================================================
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const settingsModalOverlay = document.getElementById('settings-modal-overlay');
    const currencyCards = document.querySelectorAll('.currency-card');
    const settingsPaypalInput = document.getElementById('settings-paypal-name-input');

    // Core settings states (attached to window for global access)
    window.currentCurrencyCode   = 'GBP';
    window.currentCurrencySymbol = '£';
    window.currentStandardPrice  = 69.99;
    window.currentUltimatePrice  = 99.99;
    window.customPaypalName      = 'Mark';
    window.currentCardType       = 'visa';
    window.currentCardLast4      = '4279';
    window.currentCardLabel      = 'Visa';
    window.currentPaymentMethod  = 'paypal';

    // 1. Storage Helpers
    window.saveIpSettings = function() {
        console.log("[Settings] Saving values to localStorage...");
        localStorage.setItem('gta6_saved_currency', window.currentCurrencyCode);
        localStorage.setItem('gta6_saved_paypal_name', window.customPaypalName);
        localStorage.setItem('gta6_saved_card_type', window.currentCardType);
        localStorage.setItem('gta6_saved_card_last4', window.currentCardLast4);
        localStorage.setItem('gta6_saved_card_label', window.currentCardLabel);
        localStorage.setItem('gta6_saved_phone_prefix', window.customPhonePrefix);
        localStorage.setItem('gta6_saved_language', window.currentPaymentLanguage);
    };

    window.updatePhoneCountry = function(prefix) {
        window.customPhonePrefix = prefix || '+33 6';
        window.saveIpSettings();
    };

    window.applyGlobalSiteLanguage = function(lang) {
        window.currentPaymentLanguage = lang || 'fr';
        const t = window.siteTranslations[window.currentPaymentLanguage] || window.siteTranslations.fr;

        // 1. Navigation Header
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');
        if (navLinks.length >= 5) {
            navLinks[0].textContent = t.navGames;
            navLinks[1].textContent = t.navAddons;
            navLinks[3].textContent = t.navMerch;
            navLinks[4].textContent = t.navFeatured;
        }

        const btnTrial1min = document.getElementById('btn-trial-1min');
        const btnOpenKeyModal = document.getElementById('btn-open-key-modal');
        if (btnTrial1min) btnTrial1min.innerHTML = `<span>⚡</span> ${t.navTrial}`;
        if (btnOpenKeyModal) btnOpenKeyModal.innerHTML = `<span>🔑</span> ${t.navActivate}`;

        // 2. Hero Section
        const badgeText = document.querySelector('.release-badge .badge-text');
        const mainTitle = document.querySelector('.main-title');
        const mainDesc = document.querySelector('.main-description');
        const platformTitle = document.querySelector('.platform-title');
        const platformSubs = document.querySelectorAll('.platform-sub');

        if (badgeText) badgeText.textContent = t.releaseBadge;
        if (mainTitle) mainTitle.innerHTML = t.heroTitle;
        if (mainDesc)  mainDesc.textContent = t.heroDesc;
        if (platformTitle) platformTitle.textContent = t.platformTitle;
        platformSubs.forEach(sub => { sub.textContent = t.preorderSub; });

        const countdownLabels = document.querySelectorAll('.countdown-label');
        if (countdownLabels.length >= 4) {
            countdownLabels[0].textContent = t.cdDays;
            countdownLabels[1].textContent = t.cdHours;
            countdownLabels[2].textContent = t.cdMins;
            countdownLabels[3].textContent = t.cdSecs;
        }

        // 3. Key Gate Modal
        const keyGateBadge = document.querySelector('.key-gate-badge');
        const keyGateTitle = document.getElementById('key-gate-title');
        const keyGateSub = document.getElementById('key-gate-subtitle');
        const btnActivateKey = document.getElementById('btn-activate-key');
        const keyDivider = document.querySelector('.key-gate-divider span');
        const btnTrialGate = document.getElementById('btn-trial-1min-gate');

        if (keyGateBadge) keyGateBadge.textContent = t.keyGateBadge;
        if (keyGateTitle && !keyGateTitle.textContent.includes('Expired')) keyGateTitle.textContent = t.keyGateTitle;
        if (keyGateSub && !keyGateSub.textContent.includes('ended')) keyGateSub.innerHTML = t.keyGateSubtitle;
        if (btnActivateKey) btnActivateKey.textContent = t.keyBtnSubmit;
        if (keyDivider) keyDivider.textContent = t.keyDivider;

        if (btnTrialGate) {
            const mainText = btnTrialGate.querySelector('.btn-main-text');
            const subText  = btnTrialGate.querySelector('.btn-sub-text');
            if (mainText && !mainText.textContent.includes('USED')) mainText.textContent = t.keyTrialMain;
            if (subText && !subText.textContent.includes('already')) subText.textContent = t.keyTrialSub;
        }

        // 4. Modal Stages
        const selectHeaderTitle = document.querySelector('#select-store-header .store-title');
        const selectHeaderSub   = document.querySelector('#select-store-header .store-subtitle');
        if (selectHeaderTitle) selectHeaderTitle.textContent = t.selectEditionHeader;
        if (selectHeaderSub)   selectHeaderSub.textContent   = t.selectEditionSub;

        const stdTitleEl = document.querySelector('.edition-card[data-edition="standard"] .edition-title');
        const stdDescEl  = document.querySelector('.edition-card[data-edition="standard"] .edition-description');
        const ultTitleEl = document.querySelector('.edition-card[data-edition="ultimate"] .edition-title');
        const ultDescEl  = document.querySelector('.edition-card[data-edition="ultimate"] .edition-description');

        if (stdTitleEl) stdTitleEl.textContent = t.stdTitle;
        if (stdDescEl)  stdDescEl.textContent  = t.stdDesc;
        if (ultTitleEl) ultTitleEl.textContent = t.ultTitle;
        if (ultDescEl)  ultDescEl.textContent  = t.ultDesc;

        document.querySelectorAll('.edition-select-btn').forEach(btn => {
            btn.textContent = t.btnSelectEdition;
        });

        // Stage 1: Link Account
        const linkHeaderTitle = document.querySelector('#link-store-header .store-title');
        const gamertagLabel   = document.querySelector('label[for="gamertag-input"]');
        const gamertagInput   = document.getElementById('gamertag-input');
        const btnFindAccount  = document.getElementById('btn-find-account');

        if (linkHeaderTitle) linkHeaderTitle.textContent = t.linkHeader;
        if (gamertagLabel)   gamertagLabel.textContent   = t.linkInputLabel;
        if (gamertagInput)   gamertagInput.placeholder   = t.linkInputPlaceholder;
        if (btnFindAccount)  btnFindAccount.textContent  = t.btnLinkAccount;

        // Stage 2: Confirm Account
        const confirmHeaderTitle = document.querySelector('#confirm-store-header .store-title');
        const confirmSubTitle    = document.querySelector('#confirm-store-header .store-subtitle');
        const btnConfirmProceed  = document.getElementById('btn-confirm-proceed');

        if (confirmHeaderTitle) confirmHeaderTitle.textContent = t.confirmHeader;
        if (confirmSubTitle)    confirmSubTitle.textContent    = t.confirmSubtitle;
        if (btnConfirmProceed)  btnConfirmProceed.textContent  = t.btnConfirmAccount;

        // Stage 3: Checkout
        const pmHeaderLabel = document.querySelector('.pm-header-label');
        if (pmHeaderLabel) pmHeaderLabel.textContent = t.checkoutHeader;

        // Rockstar Success
        const rockstarHeaderBadge = document.querySelector('.rockstar-header-badge');
        if (rockstarHeaderBadge) rockstarHeaderBadge.textContent = t.rockstarBadge;

        const rockstarPerks = document.querySelectorAll('.rockstar-perk-item');
        if (rockstarPerks.length >= 2) {
            const h4_0 = rockstarPerks[0].querySelector('h4');
            const p_0  = rockstarPerks[0].querySelector('p');
            const h4_1 = rockstarPerks[1].querySelector('h4');
            const p_1  = rockstarPerks[1].querySelector('p');
            if (h4_0) h4_0.textContent = t.rockstarPerk1Title;
            if (p_0)  p_0.textContent  = t.rockstarPerk1Sub;
            if (h4_1) h4_1.textContent = t.rockstarPerk2Title;
            if (p_1)  p_1.textContent  = t.rockstarPerk2Sub;
        }

        const rockstarReturnBtn = document.getElementById('btn-return-store');
        if (rockstarReturnBtn) rockstarReturnBtn.textContent = t.rockstarReturnBtn;

        // Update yellow pay button brand text
        window.updateYellowPayButton();
    };

    window.updatePaymentLanguage = function(lang) {
        window.applyGlobalSiteLanguage(lang);
        window.saveIpSettings();
    };

    window.applyCurrencyCode = function(code) {
        console.log("[Settings Interface] applyCurrencyCode:", code);
        
        const currencyMap = {
            NZD: { symbol: '$',  standard: 139.99, ultimate: 189.99 },
            USD: { symbol: '$',  standard: 69.99,  ultimate: 99.99  },
            AUD: { symbol: '$',  standard: 119.99, ultimate: 159.99 },
            GBP: { symbol: '£',  standard: 69.99,  ultimate: 99.99  },
            EUR: { symbol: '€',  standard: 69.99,  ultimate: 99.99  },
            CAD: { symbol: '$',  standard: 89.99,  ultimate: 129.99 },
            CHF: { symbol: 'Fr', standard: 69.99,  ultimate: 99.99  },
            JPY: { symbol: '¥',  standard: 10900,  ultimate: 15900  }
        };

        const targetCode = currencyMap[code] ? code : 'EUR';
        const data = currencyMap[targetCode];

        const cardToActivate = document.querySelector(`.currency-card[data-currency="${targetCode}"]`);
        if (cardToActivate) {
            document.querySelectorAll('.currency-card').forEach(c => c.classList.remove('active'));
            cardToActivate.classList.add('active');
        }

        const currSelect = document.getElementById('settings-currency-select');
        if (currSelect) currSelect.value = targetCode;

        window.currentCurrencyCode   = targetCode;
        window.currentCurrencySymbol = data.symbol;
        window.currentStandardPrice  = data.standard;
        window.currentUltimatePrice  = data.ultimate;

        window.updateCurrencyAndPrices();
    };

    window.applyCardType = function(cardType, cardLabel) {
        console.log("[Settings Interface] applyCardType:", cardType, "label:", cardLabel);
        window.currentCardType  = cardType  || 'visa';
        window.currentCardLabel = cardLabel || 'Visa';

        // Read last 4 dynamically inside the JS engine
        const last4InputEl = document.getElementById('settings-card-last4');
        const defaultLast4Map = {
            visa:       '4279',
            mastercard: '5391',
            amex:       '3782',
            discover:   '6011',
            revolut:    '4562',
            paypal:     ''
        };
        
        window.currentCardLast4 = (last4InputEl && last4InputEl.value.trim().length === 4)
            ? last4InputEl.value.trim()
            : (defaultLast4Map[window.currentCardType] || '4279');

        // Automatically toggle standard payment option choice
        if (window.currentCardType === 'paypal') {
            window.currentPaymentMethod = 'paypal';
        } else {
            window.currentPaymentMethod = 'visa';
        }

        // Sync visual highlights in the checkout methods lists
        const rowPaypal = document.getElementById('option-card-paypal');
        const rowVisa   = document.getElementById('option-card-visa');
        if (rowPaypal && rowVisa) {
            if (window.currentPaymentMethod === 'paypal') {
                rowPaypal.classList.add('active');
                rowVisa.classList.remove('active');
            } else {
                rowVisa.classList.add('active');
                rowPaypal.classList.remove('active');
            }
        }

        // Toggle active card badge highlights in customization menu
        document.querySelectorAll('.card-type-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.card-type-btn[data-card="${window.currentCardType}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Sync inputs
        if (last4InputEl && window.currentCardLast4) {
            last4InputEl.value = window.currentCardLast4;
        }

        // Define card type assets
        const logoMap = {
            visa:       'assets/visa_logo.png',
            mastercard: 'assets/mastercard_logo.png',
            amex:       'assets/amex_logo.png',
            discover:   'assets/discover_logo.png',
            revolut:    'assets/revolut_logo.png',
            paypal:     'assets/paypal_logo.png'
        };
        const logoSrc = logoMap[window.currentCardType] || 'assets/visa_logo.png';

        // ── A. Update PayPal Popup Fields ──
        const ppCardRow    = document.getElementById('pp-method-card');
        const ppCardLogo   = document.getElementById('pp-card-logo-img');
        const ppCardName   = document.getElementById('pp-card-method-name');
        const ppCardAmt    = document.getElementById('pp-card-amount');
        const ppCardFb     = document.getElementById('pp-card-fallback-text');

        if (window.currentCardType === 'paypal') {
            if (ppCardRow) ppCardRow.style.display = 'none';
        } else {
            if (ppCardRow)  ppCardRow.style.display = 'flex';
            if (ppCardLogo) { ppCardLogo.src = logoSrc; ppCardLogo.alt = window.currentCardLabel; ppCardLogo.style.display = 'block'; }
            if (ppCardFb)   { ppCardFb.textContent = window.currentCardLabel.toUpperCase().slice(0, 4); ppCardFb.style.display = 'none'; }
            if (ppCardName) { ppCardName.textContent = `${window.currentCardLabel} ••••  ${window.currentCardLast4}`; }
            const balAmt = document.getElementById('pp-balance-amount');
            if (ppCardAmt && balAmt) ppCardAmt.textContent = balAmt.textContent;
        }

        // ── B. Update Main Checkout Card option ──
        const coLogo    = document.getElementById('checkout-card-logo-img');
        const coFb      = document.getElementById('checkout-card-fallback');
        const coTitle   = document.getElementById('checkout-card-title');
        const coSub     = document.getElementById('checkout-card-sub');
        const coBtnBrand = document.getElementById('checkout-pay-btn-brand');
        const coCaption  = document.getElementById('checkout-caption-text');
        const coIconBox  = document.getElementById('checkout-card-icon-box');

        if (window.currentCardType === 'paypal') {
            if (coTitle)    coTitle.textContent   = 'Card through PayPal';
            if (coSub)      coSub.textContent     = 'Available inside the PayPal window';
            if (coBtnBrand) coBtnBrand.textContent = 'PayPal';
            if (coCaption)  coCaption.textContent  = 'Select PayPal to open the payment window and confirm this GTA VI digital order.';
            if (coLogo)     { coLogo.src = logoSrc; coLogo.style.display = 'block'; }
            if (coFb)       coFb.style.display = 'none';
        } else {
            if (coLogo)     { coLogo.src = logoSrc; coLogo.alt = window.currentCardLabel; coLogo.style.display = 'block'; }
            if (coFb)       { coFb.textContent = window.currentCardLabel.toUpperCase().slice(0, 4); coFb.style.display = 'none'; }
            if (coTitle)    coTitle.textContent    = `${window.currentCardLabel} ••••  ${window.currentCardLast4}`;
            if (coSub)      coSub.textContent      = 'Card through PayPal · Saved card';
            if (coBtnBrand) coBtnBrand.textContent = window.currentCardLabel;
            if (coCaption)  coCaption.textContent  = `Pay with your ${window.currentCardLabel} via the PayPal window to confirm your GTA VI digital order.`;
            
            if (coIconBox) {
                coIconBox.style.background = '#fff';
                coIconBox.style.borderRadius = '6px';
                coIconBox.style.padding = '4px';
            }
        }

        // ── C. Update FC27 Step 2 Card Payment Option ──
        const fc27CardLogo  = document.getElementById('fc27-pay-card-logo-img');
        const fc27BrandLogo = document.getElementById('fc27-pay-card-brand-logo');
        const fc27CardTitle = document.getElementById('fc27-pay-card-title');
        const fc27CardSub   = document.getElementById('fc27-pay-card-sub');

        if (window.currentCardType === 'paypal') {
            if (fc27CardTitle) fc27CardTitle.textContent = 'Card through PayPal';
            if (fc27CardSub)   fc27CardSub.textContent   = 'Available inside the PayPal window';
            if (fc27CardLogo)  fc27CardLogo.src = logoSrc;
            if (fc27BrandLogo) fc27BrandLogo.src = logoSrc;
        } else {
            if (fc27CardTitle) fc27CardTitle.textContent = `${window.currentCardLabel} ••••  ${window.currentCardLast4}`;
            if (fc27CardSub)   fc27CardSub.textContent   = 'Card through PayPal · Saved card';
            if (fc27CardLogo)  fc27CardLogo.src = logoSrc;
            if (fc27BrandLogo) fc27BrandLogo.src = logoSrc;
        }

        window.updatePaypalCardBackupText();
        window.updateYellowPayButton();
    };

    window.updatePaypalName = function(val) {
        window.customPaypalName = val.trim() || 'Mark';
        window.saveIpSettings();
    };

    window.updateLast4 = function(val) {
        window.currentCardLast4 = val.trim() || '4279';
        window.updatePaypalCardBackupText();
        window.saveIpSettings();
    };

    window.updatePaypalCardBackupText = function() {
        const backupEl = document.getElementById('pp-backup-note-text');
        if (!backupEl) return;
        if (window.currentCardType === 'paypal') {
            backupEl.textContent = "If this payment method doesn't work, PayPal may use your saved PayPal Balance.";
        } else {
            backupEl.textContent = `If this payment method doesn't work, PayPal may use your saved ${window.currentCardLabel} ending in ${window.currentCardLast4}.`;
        }
    };

    window.updateCurrencyAndPrices = function() {
        const currentEdition = typeof selectedEdition !== 'undefined' ? selectedEdition : 'standard';
        const currentPrice = currentEdition === 'standard' ? window.currentStandardPrice : window.currentUltimatePrice;
        const formattedPrice = window.currentCurrencySymbol + currentPrice.toFixed(2);
        const formattedStandard = window.currentCurrencySymbol + window.currentStandardPrice.toFixed(2);
        const formattedUltimate = window.currentCurrencySymbol + window.currentUltimatePrice.toFixed(2);

        // Update Stage 0 edition card prices
        const cardStandard = document.getElementById('card-standard-edition');
        const cardUltimate = document.getElementById('card-ultimate-edition');
        if (cardStandard) {
            const priceEl = cardStandard.querySelector('.edition-price');
            if (priceEl) priceEl.textContent = formattedStandard;
        }
        if (cardUltimate) {
            const priceEl = cardUltimate.querySelector('.edition-price');
            if (priceEl) priceEl.textContent = formattedUltimate;
        }

        // Update Stage 3 Checkout prices
        const topPrice = document.getElementById('checkout-top-price');
        const subtotalVal = document.getElementById('summary-subtotal-val');
        const totalVal = document.getElementById('summary-total-val');
        const ppTopVal = document.getElementById('pp-top-price-val');
        const ppBalVal = document.getElementById('pp-balance-amount');

        if (topPrice) topPrice.textContent = formattedPrice;
        if (subtotalVal) subtotalVal.textContent = formattedPrice;
        if (totalVal) totalVal.textContent = formattedPrice;
        if (ppTopVal) ppTopVal.textContent = formattedPrice;
        if (ppBalVal) ppBalVal.textContent = formattedPrice;

        const ppCardVal = document.getElementById('pp-card-amount');
        if (ppCardVal) ppCardVal.textContent = formattedPrice;

        // Update Stage 4 Receipt total
        const receiptTotalValue = document.getElementById('receipt-total-value');
        if (receiptTotalValue) receiptTotalValue.textContent = formattedPrice;
    };




    // Event delegation for closing settings modal
    document.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('#btn-close-settings, .settings-modal-close');
        const overlay = document.getElementById('settings-modal-overlay');
        if (closeBtn || (overlay && e.target === overlay)) {
            if (overlay) {
                overlay.classList.remove('active');
                overlay.style.display = 'none';
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
                overlay.style.visibility = 'hidden';
            }
        }
    });


    const btnTrial1min      = document.getElementById('btn-trial-1min');



    const btnTrialModalStart = document.getElementById('btn-trial-modal-start');
    const btnTrial1minGate   = document.getElementById('btn-trial-1min-gate');
    const trialBanner        = document.getElementById('trial-banner');
    const trialTimerEl       = document.getElementById('trial-timer');

    let trialInterval    = null;
    let trialSecondsLeft = 60;

    // Open/Close secondary modal buttons (header buttons)
    const btnOpenKeyModal  = document.getElementById('btn-open-key-modal');
    const btnCloseKeyModal = document.getElementById('btn-close-key-modal');

    if (btnOpenKeyModal)  btnOpenKeyModal.addEventListener('click',  () => showKeyGate());
    if (btnCloseKeyModal) btnCloseKeyModal.addEventListener('click', () => hideKeyGate());

    // =========================================================================
    // 1-MIN TRIAL — ONE USE PER DEVICE (persists across page loads)
    // Uses localStorage + device fingerprint so the trial is truly one-time
    // per browser/computer, not just per session.
    // =========================================================================
    const TRIAL_LS_KEY = 'gta6_trial_used_device';

    // Clean up old keys from previous versions
    localStorage.removeItem('gta6_trial_used_ip');
    sessionStorage.removeItem('gta6_trial_used_session');

    // Device fingerprint: stable enough across reloads on the same browser
    function getDeviceFingerprint() {
        const raw = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            screen.colorDepth,
            Intl.DateTimeFormat().resolvedOptions().timeZone
        ].join('|');
        // Simple hash
        let h = 0;
        for (let i = 0; i < raw.length; i++) { h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0; }
        return Math.abs(h).toString(36);
    }

    const deviceFP = getDeviceFingerprint();
    let trialUsedThisSession = localStorage.getItem(TRIAL_LS_KEY) === deviceFP;

    function markTrialUsedButton() {
        [btnTrial1min, btnTrialModalStart, btnTrial1minGate].forEach(btn => {
            if (!btn) return;
            btn.disabled = true;
            btn.style.opacity = '0.45';
            btn.style.cursor = 'not-allowed';
            btn.style.filter = 'grayscale(80%)';
            const mainText = btn.querySelector('.btn-main-text');
            const subText = btn.querySelector('.btn-sub-text');
            if (mainText) mainText.textContent = 'TRIAL ALREADY USED';
            if (subText) subText.textContent = 'Your free trial has already been used on this device';
        });
    }

    // On page load: if already used on this device, grey out button immediately
    if (trialUsedThisSession) {
        markTrialUsedButton();
    }

    function start1MinTrial() {
        // --- Already used check ---
        if (trialUsedThisSession) {
            markTrialUsedButton();
            return;
        }

        // Mark as used immediately (prevent double-click & persist across reloads)
        trialUsedThisSession = true;
        localStorage.setItem(TRIAL_LS_KEY, deviceFP);

        // --- UNLOCK: hide the key gate completely ---
        hideKeyGate();

        // --- Start countdown banner ---
        if (trialInterval) clearInterval(trialInterval);
        trialSecondsLeft = 60;
        if (trialBanner) {
            trialBanner.style.display = 'flex';
            trialBanner.classList.add('active');
        }
        document.body.style.paddingTop = '45px';

        markTrialUsedButton();
        updateTrialDisplay();

        trialInterval = setInterval(() => {
            trialSecondsLeft--;
            updateTrialDisplay();

            if (trialSecondsLeft <= 0) {
                clearInterval(trialInterval);
                if (trialBanner) {
                    trialBanner.classList.remove('active');
                    trialBanner.style.display = 'none';
                }
                document.body.style.paddingTop = '0px';

                // Lock screen — bring back the key gate
                const gateTitle = document.getElementById('key-gate-title');
                const gateSubtitle = document.getElementById('key-gate-subtitle');
                if (gateTitle) gateTitle.textContent = '⛔ Trial Expired';
                if (gateSubtitle) gateSubtitle.innerHTML = 'Your free 60-second trial has ended. Enter your access key <code>GTA6-XXXX-XXXX-XXXX</code> or join our Discord to get one.';

                showKeyGate();
            }
        }, 1000);
    }

    function updateTrialDisplay() {
        if (!trialTimerEl) return;
        const mins = Math.floor(trialSecondsLeft / 60);
        const secs = trialSecondsLeft % 60;
        trialTimerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    if (btnTrial1min) btnTrial1min.addEventListener('click', start1MinTrial);
    if (btnTrialModalStart) btnTrialModalStart.addEventListener('click', start1MinTrial);
    if (btnTrial1minGate) btnTrial1minGate.addEventListener('click', start1MinTrial);

    window.loadIpSettings = function() {
        console.log("[Settings] Initializing and loading settings...");
        const localCurr        = localStorage.getItem('gta6_saved_currency');
        const localName        = localStorage.getItem('gta6_saved_paypal_name');
        const localCard        = localStorage.getItem('gta6_saved_card_type');
        const localLast4       = localStorage.getItem('gta6_saved_card_last4');
        const localCardLabel   = localStorage.getItem('gta6_saved_card_label');
        const localPhonePrefix = localStorage.getItem('gta6_saved_phone_prefix');
        const localLanguage    = localStorage.getItem('gta6_saved_language');

        if (localName) {
            window.customPaypalName = localName;
            const inputEl = document.getElementById('settings-paypal-name-input');
            if (inputEl) inputEl.value = localName;
        }
        if (localCurr) {
            window.applyCurrencyCode(localCurr);
        }
        if (localCard) {
            window.applyCardType(localCard, localCardLabel);
        }
        if (localPhonePrefix) {
            window.customPhonePrefix = localPhonePrefix;
            const phoneSelect = document.getElementById('settings-phone-country-select');
            if (phoneSelect) phoneSelect.value = localPhonePrefix;
        }
        if (localLanguage) {
            window.currentPaymentLanguage = localLanguage;
            const langSelect = document.getElementById('settings-language-select');
            if (langSelect) langSelect.value = localLanguage;
        }
        window.applyGlobalSiteLanguage(window.currentPaymentLanguage);
    };

    // Initialize IP settings restore
    window.loadIpSettings();

    // =========================================================================
    // VIEW SWITCHING LOGIC (MVP Landing Hero, GTA6, FC27)
    // =========================================================================
    const fc27Overlay = document.getElementById('fc27-overlay');
    const mvpLandingHero = document.getElementById('mvp-landing-hero');
    const gta6HeroContainer = document.getElementById('gta6-hero-container');
    const siteHeader = document.querySelector('.site-header');
    const bgWrapper = document.querySelector('.bg-wrapper');

    window.switchToHome = function() {
        if (gta6HeroContainer) gta6HeroContainer.style.display = 'none';
        if (fc27Overlay) {
            fc27Overlay.classList.remove('active');
            fc27Overlay.style.setProperty('display', 'none', 'important');
            fc27Overlay.style.setProperty('opacity', '0', 'important');
            fc27Overlay.style.setProperty('pointer-events', 'none', 'important');
            fc27Overlay.style.setProperty('visibility', 'hidden', 'important');
        }
        if (siteHeader) siteHeader.style.display = 'flex';
        if (bgWrapper) bgWrapper.style.display = 'block';
        if (mvpLandingHero) mvpLandingHero.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.switchToGta6 = function() {
        if (mvpLandingHero) mvpLandingHero.style.display = 'none';
        if (fc27Overlay) {
            fc27Overlay.classList.remove('active');
            fc27Overlay.style.setProperty('display', 'none', 'important');
            fc27Overlay.style.setProperty('opacity', '0', 'important');
        }
        if (gta6HeroContainer) gta6HeroContainer.style.display = 'flex';
        if (siteHeader) siteHeader.style.display = 'flex';
        if (bgWrapper) bgWrapper.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.switchToFc27 = function() {
        if (mvpLandingHero) mvpLandingHero.style.display = 'none';
        if (gta6HeroContainer) gta6HeroContainer.style.display = 'none';
        if (siteHeader) siteHeader.style.display = 'none';
        if (bgWrapper) bgWrapper.style.display = 'none';
        if (fc27Overlay) {
            fc27Overlay.classList.add('active');
            fc27Overlay.style.setProperty('display', 'block', 'important');
            fc27Overlay.style.setProperty('opacity', '1', 'important');
            fc27Overlay.style.setProperty('visibility', 'visible', 'important');
            fc27Overlay.style.setProperty('pointer-events', 'auto', 'important');
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    };

    const btnEnterGta6 = document.getElementById('btn-enter-gta6');
    const btnEnterFc27 = document.getElementById('btn-enter-fc27');

    if (btnEnterGta6) btnEnterGta6.addEventListener('click', window.switchToGta6);
    if (btnEnterFc27) btnEnterFc27.addEventListener('click', window.switchToFc27);

    // ==========================================================================
    // EA SPORTS FC 27 INTERACTIVE HUB & CHECKOUT LOGIC (Identical to Video)
    // ==========================================================================
    const fc27CheckoutOverlay = document.getElementById('fc27-checkout-overlay');
    const btnOpenFc27Hub = document.getElementById('btn-open-fc27-hub');
    const btnCloseFc27Hub = document.getElementById('fc27-close-hub');
    const btnFc27Continue = document.getElementById('fc27-btn-continue');
    const btnFc27CloseCheckout = document.getElementById('fc27-checkout-close');
    const btnFc27Step1Continue = document.getElementById('fc27-btn-step1-continue');
    const btnFc27Step2Back = document.getElementById('fc27-btn-step2-back');
    const btnFc27PayPaypal = document.getElementById('fc27-btn-pay-paypal');
    const fc27CurrSelect = document.getElementById('fc27-currency-select');
    const fc27TopPreorderBtn = document.getElementById('fc27-top-preorder-btn');

    let fc27SelectedEdition = 'ultimate';
    let fc27SelectedPlatform = 'pc';
    let fc27SelectedCurrency = 'EUR';

    const fc27Prices = {
        EUR: { symbol: '€', standard: 69.99, ultimate: 83.97 },
        NZD: { symbol: 'NZD$', standard: 119.95, ultimate: 149.95 },
        USD: { symbol: '$', standard: 69.99, ultimate: 99.99 },
        GBP: { symbol: '£', standard: 59.99, ultimate: 79.99 }
    };

    function updateFc27Display() {
        const cur = fc27Prices[fc27SelectedCurrency] || fc27Prices.EUR;
        const stdPrice = cur.symbol + cur.standard.toFixed(2);
        const ultPrice = cur.symbol + cur.ultimate.toFixed(2);

        const elStd = document.getElementById('fc27-price-standard');
        const elUlt = document.getElementById('fc27-price-ultimate');
        if (elStd) elStd.textContent = stdPrice;
        if (elUlt) elUlt.textContent = ultPrice;

        const sumCover = document.getElementById('fc27-summary-cover');
        const sumTitle = document.getElementById('fc27-summary-title');
        const sumPlat = document.getElementById('fc27-summary-plat');
        const sumEdition = document.getElementById('fc27-sum-edition');
        const sumPlatform = document.getElementById('fc27-sum-platform');
        const sumAccess = document.getElementById('fc27-sum-access');
        const sumTotal = document.getElementById('fc27-sum-total');

        const platNames = { ps5: 'PlayStation 5', xbox: 'Xbox Series X|S', pc: 'PC' };
        const platName = platNames[fc27SelectedPlatform] || 'PC';

        if (sumTitle) sumTitle.textContent = fc27SelectedEdition === 'standard' ? 'Standard Edition' : 'Ultimate Edition';
        if (sumPlat) sumPlat.textContent = platName;
        if (sumEdition) sumEdition.textContent = fc27SelectedEdition === 'standard' ? 'Standard' : 'Ultimate';
        if (sumPlatform) sumPlatform.textContent = platName;
        if (sumAccess) sumAccess.textContent = fc27SelectedEdition === 'standard' ? 'Global launch access' : 'Up to 7 days early access';
        if (sumTotal) sumTotal.textContent = fc27SelectedEdition === 'standard' ? stdPrice : ultPrice;
        if (sumCover) sumCover.src = fc27SelectedEdition === 'standard' ? 'assets/fc27_standard.png' : 'assets/fc27_ultimate.png';

        const step2Title = document.getElementById('fc27-step2-title');
        const step2Sub = document.getElementById('fc27-step2-sub');
        if (step2Title) step2Title.textContent = `FC27 ${fc27SelectedEdition === 'standard' ? 'Standard' : 'Ultimate'} Edition`;
        if (step2Sub) step2Sub.textContent = `${fc27SelectedEdition === 'standard' ? 'Standard Edition · Global launch' : 'Ultimate Edition · Up to 7 days early access'}`;

        // Update platform badge logo in modal header and profile text
        const platLogos = {
            ps5: 'assets/playstation_logo_clean.png',
            xbox: 'assets/xbox_logo_clean.png',
            pc: 'assets/steam_logo_clean.png'
        };
        const modalPlatLogo = document.getElementById('fc27-modal-plat-logo');
        if (modalPlatLogo) {
            modalPlatLogo.src = platLogos[fc27SelectedPlatform] || platLogos.pc;
        }

        const profilePlatText = document.getElementById('fc27-profile-plat-text');
        if (profilePlatText) {
            const logoUrl = platLogos[fc27SelectedPlatform] || platLogos.pc;
            profilePlatText.innerHTML = `<img src="${logoUrl}" class="fc27-inline-plat-icon"> ${platName} profile · region verified ✓`;
        }
    }

    // Site Tab Switcher Logic — Fixed Top Bar + old fallback buttons
    const btnTabGta6 = document.getElementById('btn-tab-gta6');
    const btnTabFc27 = document.getElementById('btn-tab-fc27');
    const ftbTabGta6 = document.getElementById('ftb-tab-gta6');
    const ftbTabFc27 = document.getElementById('ftb-tab-fc27');
    const fc27TabGta6 = document.getElementById('fc27-tab-gta6');
    const fc27TabFc27 = document.getElementById('fc27-tab-fc27');

    function switchToHome() {
        if (fc27Overlay) fc27Overlay.classList.remove('active');

        // Hide GTA6 elements
        const gta6Hero = document.getElementById('gta6-hero-container');
        const siteHeader = document.querySelector('.site-header');
        const bgWrapper = document.querySelector('.bg-wrapper');
        if (gta6Hero) gta6Hero.style.display = 'none';
        if (siteHeader) siteHeader.style.display = 'none';
        if (bgWrapper) bgWrapper.style.display = 'none';

        // Show MVP Base Landing Hero
        const mvpLanding = document.getElementById('mvp-landing-hero');
        if (mvpLanding) mvpLanding.style.display = 'flex';

        // FTB tabs active state
        if (ftbTabGta6) ftbTabGta6.classList.remove('active');
        if (ftbTabFc27) ftbTabFc27.classList.remove('active');
    }

    function switchToGta6() {
        if (fc27Overlay) fc27Overlay.classList.remove('active');

        // Show GTA6 elements
        const gta6Hero = document.getElementById('gta6-hero-container');
        const siteHeader = document.querySelector('.site-header');
        const bgWrapper = document.querySelector('.bg-wrapper');
        if (gta6Hero) gta6Hero.style.display = '';
        if (siteHeader) siteHeader.style.display = '';
        if (bgWrapper) bgWrapper.style.display = '';

        // Hide MVP Landing Hero
        const mvpLanding = document.getElementById('mvp-landing-hero');
        if (mvpLanding) mvpLanding.style.display = 'none';

        // FTB tabs active state
        if (ftbTabGta6) ftbTabGta6.classList.add('active');
        if (ftbTabFc27) ftbTabFc27.classList.remove('active');
    }

    function switchToFc27() {
        // Hide GTA6 and MVP Landing Hero
        const gta6Hero = document.getElementById('gta6-hero-container');
        const siteHeader = document.querySelector('.site-header');
        const bgWrapper = document.querySelector('.bg-wrapper');
        if (gta6Hero) gta6Hero.style.display = 'none';
        if (siteHeader) siteHeader.style.display = 'none';
        if (bgWrapper) bgWrapper.style.display = 'none';

        const mvpLanding = document.getElementById('mvp-landing-hero');
        if (mvpLanding) mvpLanding.style.display = 'none';

        // Show FC27 Hub Overlay
        if (fc27Overlay) fc27Overlay.classList.add('active');

        // FTB tabs active state
        if (ftbTabGta6) ftbTabGta6.classList.remove('active');
        if (ftbTabFc27) ftbTabFc27.classList.add('active');

        updateFc27Display();
    }

    // Default view on load: Base Landing Interface
    switchToHome();

    // Topbar brand logo returns to Home view
    const ftbBrand = document.querySelector('.ftb-brand');
    if (ftbBrand) {
        ftbBrand.style.cursor = 'pointer';
        ftbBrand.addEventListener('click', switchToHome);
    }

    if (ftbTabGta6) ftbTabGta6.addEventListener('click', switchToGta6);
    if (ftbTabFc27) ftbTabFc27.addEventListener('click', switchToFc27);
    if (btnTabGta6) btnTabGta6.addEventListener('click', switchToGta6);
    if (btnTabFc27) btnTabFc27.addEventListener('click', switchToFc27);
    if (fc27TabGta6) fc27TabGta6.addEventListener('click', switchToGta6);
    if (fc27TabFc27) fc27TabFc27.addEventListener('click', switchToFc27);
    if (btnCloseFc27Hub) btnCloseFc27Hub.addEventListener('click', switchToHome);

    const cardFc27Std = document.getElementById('fc27-card-standard');
    const cardFc27Ult = document.getElementById('fc27-card-ultimate');

    if (cardFc27Std) {
        cardFc27Std.addEventListener('click', () => {
            fc27SelectedEdition = 'standard';
            cardFc27Std.classList.add('selected');
            if (cardFc27Ult) cardFc27Ult.classList.remove('selected');
            updateFc27Display();
        });
    }

    if (cardFc27Ult) {
        cardFc27Ult.addEventListener('click', () => {
            fc27SelectedEdition = 'ultimate';
            cardFc27Ult.classList.add('selected');
            if (cardFc27Std) cardFc27Std.classList.remove('selected');
            updateFc27Display();
        });
    }

    const platCards = document.querySelectorAll('.fc27-platform-card');
    platCards.forEach(card => {
        card.addEventListener('click', () => {
            platCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            fc27SelectedPlatform = card.getAttribute('data-platform') || 'pc';
            const statusEl = document.getElementById('fc27-platform-status');
            const names = { ps5: 'PlayStation 5 selected', xbox: 'Xbox Series X|S selected', pc: 'PC selected' };
            if (statusEl) statusEl.textContent = names[fc27SelectedPlatform] || 'PC selected';
            updateFc27Display();
        });
    });

    if (fc27CurrSelect) {
        fc27CurrSelect.addEventListener('change', (e) => {
            fc27SelectedCurrency = e.target.value;
            updateFc27Display();
        });
    }

    function openFc27Checkout() {
        if (fc27CheckoutOverlay) fc27CheckoutOverlay.classList.add('active');
        // Reset username input to empty on every menu open
        const usernameInput = document.getElementById('fc27-username-input');
        if (usernameInput) usernameInput.value = '';

        // Reset to step 1
        ['fc27-step1-content','fc27-step2-content','fc27-step3-content'].forEach((id,i) => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('active', i === 0);
        });
        ['fc27-step-1','fc27-step-2','fc27-step-3'].forEach((id,i) => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('active', i === 0);
        });
        // Reset verification state
        const loadingEl = document.getElementById('fc27-verify-loading');
        const profileBox = document.getElementById('fc27-profile-fetched-box');
        const statusBox  = document.getElementById('fc27-status-box');
        if (loadingEl) loadingEl.classList.remove('visible');
        if (profileBox) profileBox.style.display = 'none';
        if (statusBox) statusBox.style.display = 'none';
        // Reset dots
        document.querySelectorAll('.fc27-vl-dot').forEach(d => {
            d.className = 'fc27-vl-dot pending';
        });
        document.querySelectorAll('.fc27-verify-step').forEach(r => r.classList.remove('done'));
        ['fc27-vstat-1','fc27-vstat-2','fc27-vstat-3'].forEach(id => {
            const e = document.getElementById(id); if(e) e.textContent = '';
        });
    }

    if (btnFc27Continue) btnFc27Continue.addEventListener('click', openFc27Checkout);
    if (fc27TopPreorderBtn) fc27TopPreorderBtn.addEventListener('click', openFc27Checkout);

    if (btnFc27CloseCheckout) {
        btnFc27CloseCheckout.addEventListener('click', () => {
            if (fc27CheckoutOverlay) fc27CheckoutOverlay.classList.remove('active');
        });
    }

    // Helper: get platform display string
    function getFc27PlatformLabel(plat) {
        return { ps5: 'PlayStation 5', xbox: 'Xbox Series X|S', pc: 'PC' }[plat] || 'PC';
    }

    // Helper: get avatar URL based on platform (same system as GTA6)
    function getFc27AvatarUrl(username, platform) {
        if (platform === 'ps5') {
            return `https://unavatar.io/psnprofiles/${encodeURIComponent(username)}?fallback=false`;
        } else if (platform === 'xbox') {
            return `https://unavatar.io/xboxgamertag/${encodeURIComponent(username)}?fallback=false`;
        }
        // PC: use ui-avatars as placeholder
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=181b24&color=00ff44&size=128&bold=true`;
    }

    if (btnFc27Step1Continue) {
        btnFc27Step1Continue.addEventListener('click', () => {
            const inputVal = (document.getElementById('fc27-username-input') || {value:''}).value.trim();
            if (!inputVal) return; // require input

            // Disable button during load
            btnFc27Step1Continue.disabled = true;
            btnFc27Step1Continue.textContent = '...';

            // Show loading spinner, hide profile card + status
            const loadingEl = document.getElementById('fc27-verify-loading');
            const profileBox = document.getElementById('fc27-profile-fetched-box');
            const statusBox  = document.getElementById('fc27-status-box');
            if (loadingEl) loadingEl.classList.add('visible');
            if (profileBox) profileBox.style.display = 'none';
            if (statusBox) statusBox.style.display = 'none';

            // Animate verification steps sequentially
            const steps = [
                { dotId: 'fc27-vl-1', vstatId: 'fc27-vstat-1', text: '✓ Verified',  delay: 700  },
                { dotId: 'fc27-vl-2', vstatId: 'fc27-vstat-2', text: '✓ Ready',     delay: 1300 },
                { dotId: 'fc27-vl-3', vstatId: 'fc27-vstat-3', text: '✓ Eligible',  delay: 1900 },
            ];

            // Set all dots to loading one by one
            steps.forEach((s, i) => {
                setTimeout(() => {
                    const row = document.getElementById(s.dotId);
                    if (row) {
                        const dot = row.querySelector('.fc27-vl-dot');
                        if (dot) { dot.classList.remove('pending'); dot.classList.add('loading'); }
                        row.classList.add('done');
                    }
                }, s.delay - 500);
                setTimeout(() => {
                    const row = document.getElementById(s.dotId);
                    if (row) {
                        const dot = row.querySelector('.fc27-vl-dot');
                        if (dot) { dot.classList.remove('loading'); dot.classList.add('done'); }
                    }
                    const vstat = document.getElementById(s.vstatId);
                    if (vstat) vstat.textContent = s.text;
                }, s.delay);
            });

            // After all steps complete: show profile card and advance to Step 2
            setTimeout(() => {
                if (loadingEl) loadingEl.classList.remove('visible');
                if (profileBox) profileBox.style.display = '';
                if (statusBox) statusBox.style.display = '';

                // Set name display
                const displayEl = document.getElementById('fc27-profile-uname-display');
                if (displayEl) displayEl.textContent = inputVal;

                // Set platform text
                const platTextEl = document.getElementById('fc27-profile-plat-text');
                if (platTextEl) platTextEl.textContent = getFc27PlatformLabel(fc27SelectedPlatform) + ' profile · region verified ✓';

                // Fetch avatar using GTA6 exact 4-stage fallback logic
                const avatarEl = document.getElementById('fc27-profile-avatar');
                if (avatarEl) {
                    const isPsn = (fc27SelectedPlatform === 'ps5');
                    const apiProvider = isPsn ? 'psnprofiles' : 'xboxgamertag';
                    const primaryAvatarUrl = `https://unavatar.io/${apiProvider}/${encodeURIComponent(inputVal)}`;

                    let avatarHash = 0;
                    for (let i = 0; i < inputVal.length; i++) {
                        avatarHash = (avatarHash << 5) - avatarHash + inputVal.charCodeAt(i);
                        avatarHash |= 0;
                    }
                    const avatarNum = (Math.abs(avatarHash) % 50) + 1;
                    const localGamingAvatar = `assets/avatars/avatar_${avatarNum}.jpg`;
                    const defaultPlatformAvatar = isPsn ? 'assets/avatar_psn.png' : 'assets/avatar_xbox.png';

                    let attempt = 0;
                    avatarEl.onerror = function() {
                        attempt++;
                        if (attempt === 1) {
                            if (isPsn) {
                                this.src = `https://psnprofiles.com/avatars/l/${encodeURIComponent(inputVal)}.png`;
                            } else {
                                this.src = `https://avatar-ssl.xboxlive.com/avatar/${encodeURIComponent(inputVal)}/profile-pic.png`;
                            }
                        } else if (attempt === 2) {
                            this.src = localGamingAvatar;
                        } else {
                            this.onerror = null;
                            this.src = defaultPlatformAvatar;
                        }
                    };
                    avatarEl.src = primaryAvatarUrl;
                }

                // Re-enable button
                btnFc27Step1Continue.disabled = false;
                btnFc27Step1Continue.textContent = 'Continue';

                // Update step 2 amounts
                const cur = fc27Prices[fc27SelectedCurrency] || fc27Prices.EUR;
                const amount = (fc27SelectedEdition === 'standard' ? cur.standard : cur.ultimate).toFixed(2);
                const symbol = cur.symbol || '€';
                const formatted = `${symbol}${amount}`;

                const els = ['fc27-pay-total-badge', 'fc27-pay-subtotal', 'fc27-pay-grand-total'];
                els.forEach(id => { const e = document.getElementById(id); if(e) e.textContent = formatted; });

                // Transition to Step 2 (Payment Step)
                const step1Content = document.getElementById('fc27-step1-content');
                const step2Content = document.getElementById('fc27-step2-content');
                const s1Tab = document.getElementById('fc27-step-1');
                const s2Tab = document.getElementById('fc27-step-2');
                if (step1Content) step1Content.classList.remove('active');
                if (step2Content) step2Content.classList.add('active');
                if (s1Tab) s1Tab.classList.remove('active');
                if (s2Tab) s2Tab.classList.add('active');

            }, 2300);
        });
    }

    // Step 2 Back button
    if (btnFc27Step2Back) {
        btnFc27Step2Back.addEventListener('click', () => {
            const step1 = document.getElementById('fc27-step1-content');
            const step2 = document.getElementById('fc27-step2-content');
            const s1Tab = document.getElementById('fc27-step-1');
            const s2Tab = document.getElementById('fc27-step-2');
            if (step1) step1.classList.add('active');
            if (step2) step2.classList.remove('active');
            if (s1Tab) s1Tab.classList.add('active');
            if (s2Tab) s2Tab.classList.remove('active');
        });
    }

    // Helper function to update yellow Pay button brand & logo on FC27 Step 2
    window.updateFc27PayButton = function() {
        const btn = document.getElementById('fc27-btn-pay-paypal');
        if (!btn) return;

        const fc27PayOptCard = document.getElementById('fc27-pay-opt-card');
        const isCard = fc27PayOptCard && fc27PayOptCard.classList.contains('selected');
        const logoMap = {
            visa:       'assets/visa_logo.png',
            mastercard: 'assets/mastercard_logo.png',
            amex:       'assets/amex_logo.png',
            discover:   'assets/discover_logo.png',
            revolut:    'assets/revolut_logo.png',
            paypal:     'assets/paypal_logo.png'
        };

        if (isCard && window.currentCardType !== 'paypal') {
            const cardType = window.currentCardType || 'visa';
            const logoSrc = logoMap[cardType] || 'assets/visa_logo.png';
            btn.innerHTML = `Pay with <img src="${logoSrc}" alt="${window.currentCardLabel || 'Card'}" style="height:20px; max-width:65px; object-fit:contain; margin-left:6px; vertical-align:middle; background:#fff; border-radius:4px; padding:2px;">`;
        } else {
            btn.innerHTML = `Pay with <img src="assets/paypal_logo.png" alt="PayPal" style="height:20px; margin-left:6px; vertical-align:middle;">`;
        }
    };

    // Payment radio toggle
    const fc27PayOptPaypal = document.getElementById('fc27-pay-opt-paypal');
    const fc27PayOptCard   = document.getElementById('fc27-pay-opt-card');
    if (fc27PayOptPaypal) fc27PayOptPaypal.addEventListener('click', () => {
        fc27PayOptPaypal.classList.add('selected');
        if (fc27PayOptCard) fc27PayOptCard.classList.remove('selected');
        document.getElementById('fc27-radio-paypal').checked = true;
        window.updateFc27PayButton();
    });
    if (fc27PayOptCard) fc27PayOptCard.addEventListener('click', () => {
        fc27PayOptCard.classList.add('selected');
        if (fc27PayOptPaypal) fc27PayOptPaypal.classList.remove('selected');
        document.getElementById('fc27-radio-card').checked = true;
        window.updateFc27PayButton();
    });

    if (btnFc27PayPaypal) {
        btnFc27PayPaypal.addEventListener('click', () => {
            const cur = fc27Prices[fc27SelectedCurrency] || fc27Prices.EUR;
            const finalAmount = (fc27SelectedEdition === 'standard' ? cur.standard : cur.ultimate).toFixed(2);
            const user = (document.getElementById('fc27-username-input') || {value: 'powder'}).value.trim() || 'powder';

            const isCard = fc27PayOptCard && fc27PayOptCard.classList.contains('selected');
            const targetMethod = isCard ? (window.currentCardType || 'visa') : 'paypal';

            if (typeof window.setPaymentMethod === 'function') {
                window.setPaymentMethod(targetMethod);
            }
            if (typeof window.openPaypalPopup === 'function') {
                window.openPaypalPopup();
            }

            // Watch for PayPal popup to close, then advance FC27 to step 3
            const popupEl = document.getElementById('paypal-popup-screen');
            let observed = false;
            const observer = new MutationObserver(() => {
                const isActive = popupEl && (
                    popupEl.classList.contains('active') ||
                    (popupEl.style.display && popupEl.style.display !== 'none')
                );
                if (!isActive && !observed) {
                    observed = true;
                    observer.disconnect();
                    if (fc27CheckoutOverlay && fc27CheckoutOverlay.classList.contains('active')) {
                        window.showFc27Step3(user, finalAmount, cur.symbol);
                    }
                }
            });
            if (popupEl) observer.observe(popupEl, { attributes: true, attributeFilter: ['class', 'style'] });
        });
    }

    window.showFc27Step3 = function(user, finalAmount, symbol) {
        const step2 = document.getElementById('fc27-step2-content');
        const step3 = document.getElementById('fc27-step3-content');
        const s2Tab = document.getElementById('fc27-step-2');
        const s3Tab = document.getElementById('fc27-step-3');
        if (step2) step2.classList.remove('active');
        if (step3) step3.classList.add('active');
        if (s2Tab) s2Tab.classList.remove('active');
        if (s3Tab) s3Tab.classList.add('active');

        const rand6 = () => Math.floor(100000 + Math.random() * 900000);
        const orderId = 'FC27-' + Math.floor(100 + Math.random()*900) + 'ND-' + rand6();
        const platNames = { ps5: 'PlayStation 5', xbox: 'Xbox Series X|S', pc: 'PC' };
        const get = (id) => document.getElementById(id);

        if (get('fc27-receipt-order-id')) get('fc27-receipt-order-id').textContent = orderId;
        if (get('fc27-receipt-player')) get('fc27-receipt-player').textContent = user || 'powder';
        if (get('fc27-receipt-edition')) get('fc27-receipt-edition').textContent = fc27SelectedEdition === 'standard' ? 'Standard Edition' : 'Ultimate Edition';
        if (get('fc27-receipt-platform')) get('fc27-receipt-platform').textContent = platNames[fc27SelectedPlatform] || 'PC';
        if (get('fc27-receipt-email')) get('fc27-receipt-email').textContent = (user || 'player').toLowerCase().replace(/\s/g,'') + '@outlook.com';
        if (get('fc27-receipt-total')) get('fc27-receipt-total').textContent = (symbol || '\u20ac') + parseFloat(finalAmount || '83.97').toFixed(2);
    };

    const btnFc27Done = document.getElementById('fc27-btn-done');
    if (btnFc27Done) {
        btnFc27Done.addEventListener('click', () => {
            if (fc27CheckoutOverlay) fc27CheckoutOverlay.classList.remove('active');
            setTimeout(() => {
                ['fc27-step1-content','fc27-step2-content','fc27-step3-content'].forEach((id,i) => {
                    const el = document.getElementById(id);
                    if (el) el.classList.toggle('active', i === 0);
                });
                ['fc27-step-1','fc27-step-2','fc27-step-3'].forEach((id,i) => {
                    const el = document.getElementById(id);
                    if (el) el.classList.toggle('active', i === 0);
                });
            }, 300);
        });
    }
});



// CSS Injection for dynamic spinner
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
