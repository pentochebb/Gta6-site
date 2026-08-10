(() => {
  'use strict';
  const path = location.pathname.toLowerCase();
  const pageKey =
    path.includes('/fc27/') ? 'fc27' :
    path.includes('/2k27/') ? '2k27' :
    path.includes('/fortnite/') ? 'fortnite' :
    path.includes('/gift-card/') ? 'gift-card' :
    path.includes('/roblox-mobile/') ? 'roblox-mobile' :
    document.title.toLowerCase().includes('nba 2k27') ? '2k27' :
    '';
  if (!pageKey || document.querySelector('.lv-auto-panel')) return;
  const FORTNITE_PRODUCTS = Object.freeze([
    [
      '0', '800 V-Bucks'
    ],
    [
      '1', '2,400 V-Bucks'
    ],
    [
      '2', '4,500 V-Bucks'
    ],
    [
      '3', '12,500 V-Bucks'
    ],
    [
      '4', '(OG) Renegade Raider'
    ],
    [
      '5', '(OG) Aerial Assault Trooper'
    ],
    [
      '6', '(OG) Ghoul Trooper'
    ],
    [
      '7', '(OG) Skull Trooper'
    ],
    [
      '8', 'Wildcat'
    ],
    [
      '9', 'Ikonik'
    ],
    [
      '10', 'Astronomical Bundle'
    ],
    [
      '11', 'Glow'
    ],
    [
      '12', '(OG) Raiders Revenge'
    ],
    [
      '13', 'Merry Minty Axe'
    ],
    [
      '14', 'Leviathan Axe'
    ]
  ]).map(([
    value, label
  ]) => ({
     value, label 
  }));
  const CONFIGS = {
    fc27: {
      title: 'FC27 Auto Gift',
      accent: '#00ff85',
      accent2: '#79ffb8',
      products: [
        {
           value: 'standard', label: 'Standard Edition' 
        },
        {
           value: 'ultimate', label: 'Ultimate Edition' 
        },
        {
           value: 'ultimate-plus-edition', label: 'Ultimate Plus Edition' 
        }
      ],
      platforms: [
        {
           value: 'mixed', label: 'Mixed — PS/Xbox preferred' 
        },
        {
           value: 'playstation', label: 'PlayStation', weight: 45 
        },
        {
           value: 'xbox', label: 'Xbox', weight: 45 
        },
        {
           value: 'pc', label: 'PC', weight: 10 
        }
      ],
      defaultProduct: 'standard',
      defaultPlatform: 'mixed',
      input: '#playerUsername',
      modal: '.fc-checkout.open',
      actions: [
        {
           selector: '#findPlayer', label: 'Checking account…' 
        },
        {
           selector: '#continueToPayment', label: 'Continuing to payment…' 
        },
        {
           selector: '#confirmCheckout', label: 'Confirming pre-order…' 
        }
      ],
      success: '.fc-panel[data-panel="success"].active',
      done: '#finishCheckout',
      usernameMode: cycleSelection => ({
        playstation: 'psn',
        xbox: 'xbox',
        pc: 'general'
      }[
        cycleSelection.platform
      ] || 'ea'),
      async prepare(token) {
        const buy = await waitFor(`.buy-edition[data-edition="${cssEscape(selection.product)}"]`, token, {
           usable: true, timeout: 12000 
        });
        if (!buy) return false;
        if (!await waitForProductView(token)) return false;
        if (!await naturalClick(buy, token, 'Opening checkout…')) return false;
        const checkout = await waitFor('.fc-checkout.open', token, {
           timeout: 12000 
        });
        if (!checkout) return false;
        if (checkout.querySelector('.fc-panel[data-panel="profile"].active')) {
          const platformChoice = activeCyclePlatform || selection.platform;
          window.FC27Checkout?.setEdition?.(selection.product);
          window.FC27Checkout?.setPlatform?.(platformChoice);
          if (!await waitForSettled(token, 240, 500)) return false;
          return !!await waitFor('#playerUsername', token, {
             usable: true, timeout: 10000 
          });
        }
        const edition = await waitFor(`[data-checkout-edition="${cssEscape(selection.product)}"]`, token, {
           usable: true, timeout: 10000 
        });
        if (edition && !edition.classList.contains('active')) {
          if (!await naturalClick(edition, token, `Selecting ${selectedProductLabel()}…`)) return false;
          if (!await waitForSettled(token, 220, 460)) return false;
        }
        const platformChoice = activeCyclePlatform || selection.platform;
        const platform = await waitFor(`[data-checkout-platform="${cssEscape(platformChoice)}"]`, token, {
           usable: true, timeout: 10000 
        });
        if (platform && !platform.classList.contains('active')) {
          if (!await naturalClick(platform, token, `Selecting ${selectedPlatformLabel()}…`)) return false;
          if (!await waitForSettled(token, 240, 500)) return false;
        }
        const continueButton = await waitFor('#continueToProfile', token, {
           usable: true, timeout: 10000 
        });
        return !!continueButton && naturalClick(continueButton, token, 'Opening player lookup…');
      }
    },
    '2k27': {
      title: '2K27 Auto Gift',
      accent: '#ff344d',
      accent2: '#ff7b8b',
      products: [
        {
           value: 'standard', label: 'Standard Edition' 
        },
        {
           value: 'deluxe', label: 'Deluxe Edition' 
        },
        {
           value: 'ultra', label: 'Ultra Edition' 
        }
      ],
      platforms: [
        {
           value: 'mixed', label: 'Mixed — PS/Xbox preferred' 
        },
        {
           value: 'playstation', label: 'PlayStation 5', weight: 45 
        },
        {
           value: 'xbox', label: 'Xbox Series X|S', weight: 45 
        },
        {
           value: 'pc', label: 'PC', weight: 10 
        }
      ],
      defaultProduct: 'standard',
      defaultPlatform: 'mixed',
      input: '#lvxUsername',
      modal: '#lvxCheckout.open',
      actions: [
        {
           selector: '#lvxSearch', label: 'Checking player…', after: '#lvxPlayer.ready' 
        },
        {
           selector: '#lvxContinue', label: 'Continuing to payment…', after: '#lvxCheckout [data-lvx-panel="payment"].active' 
        },
        {
           selector: '#lvxPay', label: 'Confirming order with Apple Pay…' 
        }
      ],
      success: '#lvxCheckout [data-lvx-panel="success"].active',
      done: '#lvxDone',
      usernameMode: cycleSelection => cycleSelection.platform === 'playstation' ? 'psn' : cycleSelection.platform === 'xbox' ? 'xbox' : 'steam',
      async prepare(token) {
        const platformChoice = activeCyclePlatform || selection.platform;
        const buy = await waitFor(`.official-edition-card.${cssEscape(selection.product)} .official-edition-button`, token, {
          usable: true,
          timeout: 12000
        });
        if (!buy || !await naturalClick(buy, token, `Opening ${selectedProductLabel()}…`)) return false;
        const checkout = await waitFor('#lvxCheckout.open', token, {
           timeout: 12000 
        });
        if (!checkout) return false;
        const platform = await waitFor(`[data-lvx-platform="${cssEscape(platformChoice)}"]`, token, {
           usable: true, timeout: 10000 
        });
        if (!platform) return false;
        if (!platform.classList.contains('active') && !await naturalClick(platform, token, `Selecting ${selectedPlatformLabel()}…`)) return false;
        if (!await waitForSettled(token, 220, 480)) return false;
        return !!await waitFor('#lvxUsername', token, {
           usable: true, timeout: 10000 
        });
      }
    },
    fortnite: {
      title: 'Fortnite Auto Gift',
      accent: '#2f9cff',
      accent2: '#8c62ff',
      products: FORTNITE_PRODUCTS,
      platforms: [
        {
           value: 'epic', label: 'PC / Epic' 
        },
        {
           value: 'playstation', label: 'PlayStation' 
        },
        {
           value: 'xbox', label: 'Xbox' 
        }
      ],
      defaultProduct: '9',
      defaultPlatform: 'epic',
      input: '#lvxUsername',
      modal: '#lvxCheckout.open',
      actions: [
        {
           selector: '#lvxSearch', label: 'Checking player…', after: '#lvxPlayer.ready' 
        },
        {
           selector: '#lvxContinue', label: 'Continuing to payment…', after: '#lvxCheckout [data-lvx-panel="payment"].active' 
        },
        {
           selector: '#lvxPay', label: 'Confirming gift with Apple Pay…' 
        }
      ],
      success: '#lvxCheckout [data-lvx-panel="success"].active',
      done: '#lvxDone',
      usernameMode: cycleSelection => cycleSelection.platform === 'playstation' ? 'psn' : cycleSelection.platform === 'xbox' ? 'xbox' : 'epic',
      async prepare(token) {
        const index = Number(selection.product);
        if (!Number.isInteger(index) || index < 0) return false;
        setStatus(`Selecting ${selectedProductLabel()}${activeCyclePlatform ? ` on ${
          cyclePlatformLabel()
        }` : ''}…`, 'busy');
        if (typeof window.goPage === 'function') {
          try {
             window.goPage('browse');
          } catch {
          }
          if (!await waitForSettled(token, 160, 320)) return false;
        }
        let opened = false;
        const label = selectedProductLabel();
        const productCard = [
          ...document.querySelectorAll('.product-card')
        ].find(card => {
          const title = card.querySelector('.title')?.textContent?.trim();
          return title === label;
        });
        const productButton = productCard?.querySelector('.card-main');
        if (usable(productButton)) {
          opened = await naturalClick(productButton, token, `Selecting ${label}…`);
        } else if (typeof window.openDetail === 'function') {
          try {
             window.openDetail(index);
             opened = true;
          } catch {
          }
        }
        if (!opened) return false;
        if (!await waitForProductView(token, 1.15)) return false;
        const buy = await waitFor('#detail.on .side-buy,.detail.on .side-buy', token, {
           usable: true, timeout: 12000 
        });
        if (!buy || !await naturalClick(buy, token, 'Opening checkout…')) return false;
        const checkout = await waitFor('#lvxCheckout.open', token, {
           timeout: 12000 
        });
        if (!checkout) return false;
        const platformChoice = activeCyclePlatform || selection.platform || 'epic';
        const checkoutPlatform = platformChoice === 'epic' ? 'pc' : platformChoice;
        const platform = await waitFor(`[data-lvx-platform="${cssEscape(checkoutPlatform)}"]`, token, {
           usable: true, timeout: 10000 
        });
        if (!platform) return false;
        if (!platform.classList.contains('active') && !await naturalClick(platform, token, `Selecting ${cyclePlatformLabel() || 'PC / Epic'}…`)) return false;
        if (!await waitForSettled(token, 220, 480)) return false;
        return !!await waitFor('#lvxUsername', token, {
           usable: true, timeout: 10000 
        });
      }
    },
    'roblox-mobile': {
      title: 'Roblox Auto Gift',
      accent: '#ffffff',
      accent2: '#9bb7ff',
      products: [
        {
           value: '25', label: '25 Robux' 
        },
        {
           value: '50', label: '50 Robux' 
        },
        {
           value: '100', label: '100 Robux' 
        },
        {
           value: '200', label: '200 Robux' 
        }
      ],
      platforms: [
      ], defaultProduct: '100', defaultPlatform: '',
      input: '#srSearch', modal: '#sendRobuxModal',
      actions: [
        {
           selector: '#srNextBtn', label: 'Opening confirmation…', after: '#srStep3' 
        },
        {
           selector: '#srConfirmSendButton', label: 'Sending Robux…', after: '#robuxSendSuccess.open', afterTimeout: 15000 
        }
      ],
      success: '#robuxSendSuccess.open', done: '.robux-send-success-ok',
      usernameMode: () => 'general',
      async afterUsername(token, username) {
        const started = Date.now();
        let result = null;
        let stableResult = null;
        let stableSince = 0;
        const expected = username.toLowerCase();
        while (enabled && token === runToken && Date.now() - started < 22000) {
          result = findVisible('#srDropdown .api-user-row');
          const input = findVisible('#srSearch');
          const resultText = String(result?.textContent || '').toLowerCase();
          const matchesFinalQuery = String(input?.value || '').toLowerCase() === expected
            && resultText.includes(`@${expected}`);
          if (usable(result) && matchesFinalQuery) {
            if (result !== stableResult) {
              stableResult = result;
              stableSince = Date.now();
            } else if (Date.now() - stableSince >= 450) {
              break;
            }
          } else {
            stableResult = null;
            stableSince = 0;
          }
          const message = String(findVisible('#srDropdown')?.textContent || '').trim();
          if (/not found|could not be found|not valid|invalid|unable to reach|try again|network/i.test(message)) {
            setStatus(`Skipping @${username} — no Roblox account found.`, 'waiting');
            return false;
          }
          if (!await cancellableWait(140, token)) return false;
        }
        result = stableResult;
        if (!result) return false;
        setStatus('Selecting Roblox player…', 'busy');
        result.classList.add('lv-auto-click');
        result.click();
        setTimeout(() => result.classList.remove('lv-auto-click'), 380);
        if (!await waitForSettled(token, 420, 920)) return false;
        const required = Number(selection.product) || 0;
        try {
          if (typeof _robuxBal !== 'undefined' && _robuxBal < required) {
            const topUp = Math.ceil((required - _robuxBal + random(420, 1800)) / 80) * 80;
            _robuxBal += topUp;
            localStorage.setItem('robuxBalance', String(_robuxBal));
            if (typeof updateBalanceDisplay === 'function') updateBalanceDisplay();
            if (typeof srSyncBal === 'function') srSyncBal();
            setStatus(`Added ${topUp.toLocaleString()} Robux to continue…`, 'busy');
            if (!await cancellableWait(humanMilliseconds([
              780, 1600
            ], 'action'), token)) return false;
          }
        } catch {
        }
        const preset = await waitFor(`[data-robux-amount="${cssEscape(selection.product)}"]`, token, {
           usable: true, timeout: 12000 
        });
        if (!preset) return false;
        setStatus(`Selecting ${selectedProductLabel()}…`, 'busy');
        preset.classList.add('lv-auto-click');
        preset.click();
        setTimeout(() => preset.classList.remove('lv-auto-click'), 380);
        if (!await waitForSettled(token, 260, 620)) return false;
        const amountDisplay = await waitFor('#srAmountDisplay', token, {
           timeout: 8000 
        });
        if (!amountDisplay) return false;
        if (String(amountDisplay.textContent || '').replace(/\D/g, '') !== selection.product) {
          preset.click();
          if (!await waitForSettled(token, 160, 320)) return false;
        }
        if (String(amountDisplay.textContent || '').replace(/\D/g, '') !== selection.product) return false;
        const nextButton = await waitFor('#srNextBtn', token, {
           usable: true, timeout: 12000 
        });
        return !!nextButton;
      },
      async prepare(token) {
        if (!findVisible('#robuxModal')) {
          setStatus('Open the Robux page to start Auto Gift.', 'waiting');
          return false;
        }
        const sendButton = await waitFor('#robuxSendOpenButton', token, {
           usable: true, timeout: 12000 
        });
        if (!sendButton || !await naturalClick(sendButton, token, 'Opening Send Robux…')) return false;
        const input = await waitFor('#srSearch', token, {
           usable: true, timeout: 12000 
        });
        return !!input;
      }
    },
    'gift-card': {
      title: 'Gift Card Auto Gift',
      accent: '#1e99ff',
      accent2: '#6fc4ff',
      products: [
        {
           value: '25', label: '25 Gift Card' 
        },
        {
           value: '50', label: '50 Gift Card' 
        },
        {
           value: '100', label: '100 Gift Card' 
        },
        {
           value: 'custom', label: 'Custom Amount' 
        }
      ],
      customAmount: {
         min: 1, max: 500, default: 150 
      },
      platforms: [
        {
           value: 'mixed', label: 'Mixed — PlayStation/Xbox' 
        },
        {
           value: 'ps', label: 'PlayStation', weight: 50 
        },
        {
           value: 'xbox', label: 'Xbox', weight: 50 
        }
      ],
      defaultProduct: '25',
      defaultPlatform: 'mixed',
      input: '#recipientInput',
      modal: '#overlay.open',
      actions: [
        {
           selector: '#continueBtn', label: 'Opening payment…' 
        },
        {
           selector: '#payBtn', label: 'Confirming payment…' 
        }
      ],
      success: '#doneBtn',
      done: '#doneBtn',
      usernameMode: cycleSelection => cycleSelection.platform === 'ps' ? 'psn' : cycleSelection.platform === 'xbox' ? 'xbox' : 'general',
      async prepare(token) {
        const platformChoice = activeCyclePlatform || selection.platform;
        const tab = document.querySelector(platformChoice === 'xbox' ? '#xboxTab' : '#psTab');
        if (tab && !tab.classList.contains('active')) {
          if (!await naturalClick(tab, token, `Selecting ${cyclePlatformLabel()}…`)) return false;
          if (!await waitForSettled(token, 220, 480)) return false;
        }
        if (!await waitForProductView(token, .72)) return false;
        if (selection.product === 'custom') {
          const customButton = await waitFor('#customAmountButton', token, {
             usable: true, timeout: 12000 
          });
          if (!customButton || !await naturalClick(customButton, token, 'Opening custom amount…')) return false;
          const amountInput = await waitFor('#customAmountInput', token, {
             usable: true, timeout: 12000 
          });
          if (!amountInput) return false;
          amountInput.focus({
             preventScroll: true 
          });
          amountInput.value = String(selection.customAmount);
          dispatchInput(amountInput, 'insertText', String(selection.customAmount));
          amountInput.dispatchEvent(new Event('change', {
             bubbles: true 
          }));
          const continueButton = await waitFor('#customAmountContinue', token, {
             usable: true, timeout: 12000 
          });
          return !!continueButton && naturalClick(continueButton, token, `Selecting ${selectedProductLabel()}…`);
        }
        const card = await waitFor(`.gift-card[data-amount="${cssEscape(selection.product)}"]`, token, {
           usable: true, timeout: 12000 
        });
        return !!card && naturalClick(card, token, `Selecting ${selectedProductLabel()}…`);
      }
    }
  };
  const config = CONFIGS[
    pageKey
  ];
  if (!config) return;
  const PACE_MIN = 2;
  const PACE_MAX = 10;
  const PACE_STEP = 0.5;
  const DEFAULT_PACE = 6;
  const LEGACY_PACES = Object.freeze({
     fast: 3.5, normal: 6, relaxed: 9 
  });
  // Synthetic username ingredients. These are combined locally and are not
  // scraped from real platform accounts. Each final value is checked against
  // the selected platform's conservative username rules before it is used.
  const FIRST_NAMES = Object.freeze([
    'jack','mason','liam','noah','lucas','oliver','ethan','leo','theo','harry','jake','josh','kai','ryan','dylan','logan','luke','finn','sam','charlie','alex','max','ben','toby','jayden','aiden','harrison','oscar','archie','freddie','milo','nathan','caleb','isaac','connor','cameron','blake','riley','jordan','tyler','zach','cole','eli','levi','niko','jett','ash','hayden','jamie','reece','bailey','evan','owen','aaron','adam','daniel','matt','tom','will','george','henry','seb','alfie','hudson','lachlan','cooper','xavier','marcus','dean','kieran','brody','cody','seth','miles','roman','felix','fletcher','louie','carter','wyatt','emmett','gabriel','michael','james','jacob','isaiah','declan','dom','chris','ollie','austin','tristan','brandon','drew','maddox','jasper','hunter','parker','rowan','beckett','zane','tama','ari','koa','eliot','frankie','sonny','mikey','danny','tommy','jordo','macca','ellie','sophie','mia','emma','lily','ava','ruby','millie','grace','chloe','ella','lucy','zoe','isla','holly','molly','amelia','evie','charlotte','scarlett','matilda','poppy','maisie','georgia','abbie','lauren','hannah','brooke','paige','maddie','sienna','layla','maya','aria','ivy','willow','summer','bella','daisy','alice','emily','jess','kate','liv','nina','lola','sadie','talia','leah','keira','indie','skye','lexi','millie','izzy','beth','annie','ella','livvy'
  ]);
  const NICKNAMES = Object.freeze([
    'lachy','macca','jordo','ollie','mikey','danny','tommy','charlie','frankie','sonny','toby','milo','finn','kai','zane','riley','bailey','reece','coops','parks','huddy','archie','freddie','lexi','livvy','izzy','maddie','ellie','soph','millie','poppy','skye','indie','ruby','maya','aria','evie'
  ]);
  const LAST_INITIALS = Object.freeze(['a','b','c','d','e','f','g','h','j','k','l','m','n','p','r','s','t','v','w']);
  const SURNAME_STEMS = Object.freeze([
    'adams','allen','baker','bell','brooks','brown','carter','clark','collins','cook','cooper','davies','davis','edwards','evans','fisher','foster','gray','green','hall','harris','hayes','hill','hughes','james','johnson','jones','kelly','king','lee','lewis','martin','miller','moore','morgan','murphy','parker','price','reed','richards','roberts','ross','scott','smith','stevens','taylor','thomas','thompson','turner','walker','ward','white','wilson','wood','young','hart','cole','stone','wells','wright','marsh','shaw','grant','clarke','bennett','fraser','murray','dixon','ford','ellis','webb','west','knox','lane'
  ]);
  const NATURAL_WORDS = Object.freeze([
    'north','coast','drift','wave','orbit','echo','ember','sage','cloud','mint','roam','nova','lunar','raven','fox','kiwi','hawk','otter','storm','river','summit','field','vale','ridge','cove','night','daylight','lowkey','mellow','steady','local','rare','bright','quiet','small','solid','swift','blue','gold','green','red','seven','eleven'
  ]);
  const SPORT_NUMBERS = Object.freeze(['5','7','8','9','10','11','14','17','18','19','21','23','24','27','30','33','44','77','99']);
  const YEAR_ENDINGS = Object.freeze(['98','99','00','01','02','03','04','05','06','07','08','09','10','11','12']);
  const RARE_TAILS = Object.freeze(['fc','nz','au','rl','fps']);
  // User-approved Auto Gift pool. Keep every tag exactly as supplied and use
  // the same pool on every platform so the visible lookup name never changes.
  const LEGACY_USER_SUPPLIED_TAGS = Object.freeze([
    'lachy_07',
    'josh__12',
    'itsjordy',
    'heytyler_',
    'cloudydays',
    'sleepyeli',
    'voidriley',
    'fadedjay_',
    'zxcv_josh',
    'qxrynn_',
    'moonbythelake',
    'luvsophie_',
    'brodyplays_',
    'noahlol_',
    'maxisfine',
    'xlogan_12',
    'imbrady_',
    'xxethan07',
    'justkai_',
    'userjay',
    'randomliam',
    'oliver_08',
    'benji__09',
    'itsmason',
    'hey_luca',
    'sammy247',
    'ryan__17',
    'jackson.21',
    'lilnoah_',
    'imjayden',
    'ethan_123',
    'harryyy',
    'luca_09',
    'aiden__08',
    'jordylol',
    'itscharlie_',
    'ava_clouds',
    'emma__99',
    'zoe.07',
    'maddie_12',
    'hannahhh',
    'heyella_',
    'lilyplays',
    'sophie__21',
    'olivia247',
    'notchloe',
    'grace_08',
    'izzy_lol',
    'abby__07',
    'kate.123',
    'tayla_09',
    'jayden.17',
    'cooper__08',
    'liam_247',
    'aidenlol',
    'itsarchie',
    'jake_07',
    'ben_09',
    'rylee__',
    'connor.99',
    'dylan_12',
    'mason__21',
    'tylerisok',
    'nate_08',
    'ryder.07',
    'caleb247',
    'owen__09',
    'loganlol_',
    'hunter_17',
    'blake.12',
    'cammy_08',
    'zac__123',
    'mitchell07',
    'jett_09',
    'itshugo',
    'joel__21',
    'isaac.08',
    'aaron_17',
    'rileycloud',
    'finn__07',
    'kai.99',
    'jaxon_08',
    'brady247',
    'evie__12',
    'ellie.07',
    'mia_09',
    'char__21',
    'rubycloud',
    'lucy_123',
    'ellalol_',
    'itsbella',
    'lilivy_08',
    'heyemma',
    'ash__17',
    'claire247',
    'zxcv_liam',
    'zxcv_ryan',
    'qwertyjosh',
    'asdf_noah',
    'qxrliam',
    'heybrody_',
    'notmax_',
    'imluca07',
    'yojosh_12',
    'itsava_',
    'itsnoah__',
    'imzoe_08',
    'heymason',
    'justethan',
    'userluca',
    'userava_',
    'randomjay_',
    'randomzoe',
    'cloudyjake',
    'sleepykai_',
    'fadednoah',
    'voidelliot',
    'moodymason',
    'late2class',
    'schoolwifi',
    'pizzajay_',
    'cerealkid',
    'coldmornings',
    'nightliam',
    'cozytyler',
    'heyitsben',
    'brody__07',
    'joshua.08',
    'ethan__99',
    'logan_123',
    'matt_247',
    'alex__12',
    'nick.09',
    'tyson_17',
    'cody_08',
    'jordan__07',
    'chase.21',
    'lukey_09',
    'bailey__08',
    'jamie247',
    'hayden_12',
    'casey__99',
    'imfinn_',
    'heyrylee',
    'itsmaddie',
    'lilsam_07',
    'notlucy_',
    'xava_09',
    'xkai_',
    'zliam17',
    'iammax_',
    'elliot.__',
    'jay__cloud',
    'nathan_08',
    'brayden247',
    'tommy_07',
    'aidan.123',
    'levi__21',
    'owenisok',
    'mikey_09',
    'cameron__12',
    'harrison07',
    'archie_lol',
    'jess.08',
    'ruby__247',
    'molly_17',
    'userben_'
  ]);
  const USER_SUPPLIED_TAGS = Object.freeze([
    'StaticReload','HappyOtter842','VortexOn60','Brave-Panda-291','LilRecoil','SilentFox503','TTV_SweatMode','Rapid_Tiger76',
    'ShadowCrankz','BlueFalcon','ToxicLoadout','CleverWolf932','WKeyBandit','Mighty-Shark-47','xXVoidShotXx','CalmTurtle625',
    'ZeroPingKid','GoldenBear391','FrostyClips','Swift_Rabbit','ImNotSweaty','PurpleEagle704','DarkMatterFN','Lucky-Lion-853',
    'BoxedByLag','TinyMoose','Phantom.exe','BrightGecko479','YT_RapidFire','Wild_Penguin52','lilbrooffline','SneakyKoala619',
    'PixelRaider','Cool-Hawk','ControllerDrift','FuzzyBadger907','GotAimAssist','TurboDuck341','rqzzy_','Red_Wombat88',
    'LootGoblin','JollyRaven','xKryptic_','Epic-Ferret-130','TooColdBTW','SilverCobra795','TTV_Dripz','BouncyLizard',
    'maxxfps7','Green_Owl63','RespawnPending','CosmicRhino248','qxStatic','Proud-Fox','ICantBuildBro','MagicOtter935',
    'OnMcDonaldsWifi','QuietPanda','LilMenace69','Neon_Tiger','AquaZone_','CleverShark820','CallMeTrash','Stormy-Wolf',
    'xX_DarkRift_Xx','HappyFalcon673','K1NG_OF_LOOT','SwiftBear','hzGhost','Golden_Gecko84','SweatySocks_','MightyMoose518',
    'notyourteammate','Rapid-Raven','TTV_MiniMango','LuckyCobra941','zQuickScope','TinyPenguin','ImCrackedLOL','Brave_Otter607',
    '7evenShots','BlueBadger429','PlayingOn30Ping','Silent-Hawk','qwertyAim','FuzzyLion764','BoxedUAgain','TurboPanda',
    'Its_NotThatDeep','Purple_Wolf587','StillOnPS4','BrightTurtle120','xReaperMode','Wild-Falcon','goofyahhloadout','CoolRabbit253',
    'PingIsCrazy','Sneaky_Shark71','MicMutedAgain','JollyGecko698'
  ]);
  const ROBLOX_VERIFIED_TAGS = Object.freeze([
    'ZeroPingKid','LootGoblin','Its_NotThatDeep','Swift_Rabbit','PixelRaider','ImCrackedLOL','StillOnPS4','TTV_Dripz',
    'BoxedByLag','DarkMatterFN','TTV_SweatMode','JollyRaven','PlayingOn30Ping','TurboPanda','GoldenBear391','LilMenace69',
    'qwertyAim','7evenShots','RespawnPending','Neon_Tiger','TinyPenguin','notyourteammate','CallMeTrash','VortexOn60',
    'Golden_Gecko84','ToxicLoadout','ControllerDrift','BouncyLizard','xXVoidShotXx','lilbrooffline','zQuickScope','FrostyClips',
    'QuietPanda','BlueFalcon','ImNotSweaty','WKeyBandit','TinyMoose','LilRecoil','PingIsCrazy','TTV_MiniMango',
    'TooColdBTW','hzGhost','SwiftBear','OnMcDonaldsWifi'
  ]);
  const USERNAME_RULES = Object.freeze({
    psn: Object.freeze({ min: 3, max: 16, fallback: 'StaticReload', pattern: /^[A-Za-z][A-Za-z0-9_-]*$/ }),
    xbox: Object.freeze({ min: 1, max: 12, fallback: 'StaticReload', pattern: /^[A-Za-z0-9]+$/ }),
    ea: Object.freeze({ min: 4, max: 16, fallback: 'StaticReload', pattern: /^[A-Za-z][A-Za-z0-9_-]*$/ }),
    epic: Object.freeze({ min: 3, max: 16, fallback: 'StaticReload', pattern: /^[A-Za-z0-9._-]+$/ }),
    steam: Object.freeze({ min: 2, max: 32, fallback: 'StaticReload', pattern: /^[A-Za-z0-9._-]+$/ }),
    general: Object.freeze({ min: 3, max: 20, fallback: 'StaticReload', pattern: /^[A-Za-z0-9_]+$/ })
  });
  const CURATED_TAGS = Object.freeze({
    psn: Object.freeze(USER_SUPPLIED_TAGS.filter(name => USERNAME_RULES.psn.pattern.test(name) && name.length >= USERNAME_RULES.psn.min && name.length <= USERNAME_RULES.psn.max)),
    xbox: Object.freeze(USER_SUPPLIED_TAGS.filter(name => USERNAME_RULES.xbox.pattern.test(name) && name.length >= USERNAME_RULES.xbox.min && name.length <= USERNAME_RULES.xbox.max)),
    ea: Object.freeze(USER_SUPPLIED_TAGS.filter(name => USERNAME_RULES.ea.pattern.test(name) && name.length >= USERNAME_RULES.ea.min && name.length <= USERNAME_RULES.ea.max)),
    epic: Object.freeze(USER_SUPPLIED_TAGS.filter(name => USERNAME_RULES.epic.pattern.test(name) && name.length >= USERNAME_RULES.epic.min && name.length <= USERNAME_RULES.epic.max)),
    steam: Object.freeze(USER_SUPPLIED_TAGS.filter(name => USERNAME_RULES.steam.pattern.test(name) && name.length >= USERNAME_RULES.steam.min && name.length <= USERNAME_RULES.steam.max)),
    general: Object.freeze(ROBLOX_VERIFIED_TAGS.filter(name => USERNAME_RULES.general.pattern.test(name) && name.length >= USERNAME_RULES.general.min && name.length <= USERNAME_RULES.general.max))
  });
  const recentNames = [];
  const STORAGE_KEY = 'lv_auto_gift_all_enabled';
  const SETTINGS_KEY = `lv_auto_gift_${pageKey}_settings_v3`;
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = values => values[random(0, values.length - 1)];
  const cssEscape = value => window.CSS?.escape ? CSS.escape(String(value)) : String(value).replace(/["\\]/g, '\\$&');
  let enabled = false;
  let running = false;
  let runToken = 0;
  let completed = 0;
  let currentUsername = '';
  let wakeLock = null;
  let activeCyclePlatform = '';
  let lastCyclePlatform = '';
  let lastCycleUsername = '';
  let usernameQueue = [];
  let cycleRhythm = { multiplier: 1, pasteChance: .32, correctionChance: .1 };
  const pending = new Set();
  const storedSettings = readSettings();
  const migratedPace = storedSettings.paceSeconds ?? LEGACY_PACES[storedSettings.speed] ?? DEFAULT_PACE;
  const selection = {
    product: pageKey === 'fc27'
      ? config.defaultProduct
      : validValue(config.products, storedSettings.product, config.defaultProduct),
    platform: validValue(config.platforms, storedSettings.platform, config.defaultPlatform),
    paceSeconds: clampPace(migratedPace),
    limit: ['0','1','3','5','10','25','50'].includes(String(storedSettings.limit)) ? String(storedSettings.limit) : '0',
    customAmount: config.customAmount
      ? String(Math.min(config.customAmount.max, Math.max(config.customAmount.min, Number(storedSettings.customAmount) || config.customAmount.default)))
      : '',
    open: false
  };
  function clampPace(value) {
    const number = Number(value);
    const safe = Number.isFinite(number) ? number : DEFAULT_PACE;
    const stepped = Math.round(safe / PACE_STEP) * PACE_STEP;
    return Math.min(PACE_MAX, Math.max(PACE_MIN, stepped));
  }
  function validValue(options, value, fallback) {
    if (!options?.length) return '';
    return options.some(option => option.value === String(value)) ? String(value) : String(fallback ?? options[0].value);
  }
  function readSettings() {
    try {
      const value = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{
  }');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  }
  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(selection));
    } catch {}
  }
  function selectedProductLabel() {
    if (config.customAmount && selection.product === 'custom') return `${selection.customAmount} Gift Card`;
    return config.products.find(option => option.value === selection.product)?.label || 'selected product';
  }
  function selectedPlatformLabel() {
    return config.platforms.find(option => option.value === selection.platform)?.label || '';
  }
  function weightedPlatformPick(options) {
    const candidates = options.filter(option => option.value !== 'mixed');
    if (!candidates.length) return '';
    if (candidates.length === 1) return candidates[0].value;
    const choose = pool => {
      const total = pool.reduce((sum, option) => sum + Math.max(0, Number(option.weight) || 1), 0);
      let cursor = Math.random() * total;
      for (const option of pool) {
        cursor -= Math.max(0, Number(option.weight) || 1);
        if (cursor <= 0) return option.value;
      }
      return pool[pool.length - 1].value;
    };
    let chosen = choose(candidates);
    // Mixed should feel genuinely varied rather than sticking to the same
    // platform several gifts in a row. One weighted reroll keeps the console
    // preference while gently reducing immediate repeats.
    if (chosen === lastCyclePlatform && Math.random() < 0.58) {
      chosen = choose(candidates);
    }
    lastCyclePlatform = chosen;
    return chosen;
  }
  function resolveCyclePlatform() {
    if (!config.platforms?.length) return '';
    if (selection.platform !== 'mixed') {
      lastCyclePlatform = selection.platform;
      return selection.platform;
    }
    return weightedPlatformPick(config.platforms);
  }
  function cyclePlatformLabel() {
    return config.platforms.find(option => option.value === activeCyclePlatform)?.label || selectedPlatformLabel();
  }
  function currentCycleSelection() {
    return { ...selection, platform: activeCyclePlatform || selection.platform };
  }
  function paceProgress() {
    return (selection.paceSeconds - PACE_MIN) / (PACE_MAX - PACE_MIN);
  }
  function paceLabel() {
    const value = selection.paceSeconds;
    if (value <= 4) return 'Quick';
    if (value <= 6) return 'Balanced';
    if (value <= 8) return 'Natural';
    return 'Very natural';
  }
  function interpolate(start, end, progress) {
    return start + (end - start) * progress;
  }
  function timingRange(quickRange, relaxedRange, options = {}) {
    const progress = paceProgress();
    const multiplier = options.ignoreRhythm ? 1 : cycleRhythm.multiplier;
    return [
      Math.round(interpolate(quickRange[0], relaxedRange[0], progress) * multiplier),
      Math.round(interpolate(quickRange[1], relaxedRange[1], progress) * multiplier)
    ];
  }
  function currentSpeed() {
    return {
      initial: timingRange([450, 850], [1900, 3100]),
      click: timingRange([180, 390], [610, 1120]),
      press: timingRange([42, 80], [105, 205]),
      character: timingRange([28, 62], [78, 168]),
      paste: timingRange([170, 330], [480, 930]),
      actionGap: timingRange([360, 720], [1050, 2050]),
      receipt: timingRange([1200, 2200], [2450, 4300]),
      between: timingRange([2300, 4300], [7200, 12800], { ignoreRhythm: true }),
      productView: timingRange([520, 900], [1900, 3400]),
      prepare: timingRange([260, 520], [760, 1380]),
      settle: timingRange([130, 280], [320, 620]),
      retry: timingRange([900, 1650], [1750, 3100], { ignoreRhythm: true })
    };
  }
  function humanMilliseconds(range, kind = '') {
    const [min, max] = range;
    // Averaging three random values avoids robotic min/max jumps while still
    // making every action land at a slightly different point in the range.
    const centered = (Math.random() + Math.random() + Math.random()) / 3;
    let value = min + (max - min) * centered;
    const progress = paceProgress();
    const hesitationChance = {
      click: .06 + progress * .09,
      action: .05 + progress * .1,
      product: .08 + progress * .12,
      receipt: .05 + progress * .08
    }[kind] || 0;
    if (hesitationChance && Math.random() < hesitationChance) {
      value += random(120, Math.round(320 + progress * 580));
    }
    return Math.max(1, Math.round(value));
  }
  function refreshCycleRhythm() {
    const progress = paceProgress();
    cycleRhythm = {
      multiplier: .91 + Math.random() * .2,
      pasteChance: .22 + Math.random() * .18,
      correctionChance: .055 + progress * .075
    };
  }
  async function acquireWakeLock() {
    if (!enabled || wakeLock || !('wakeLock' in navigator)) return;
    try {
      const lock = await navigator.wakeLock.request('screen');
      if (!enabled) {
        try { await lock.release(); } catch {}
        return;
      }
      wakeLock = lock;
      wakeLock.addEventListener?.('release', () => { wakeLock = null; }, { once: true });
    } catch {
      wakeLock = null;
    }
  }
  function releaseWakeLock() {
    const current = wakeLock;
    wakeLock = null;
    try { current?.release?.(); } catch {}
  }
  function cancellableWait(ms, token = runToken) {
    if (!enabled || token !== runToken) return Promise.resolve(false);
    return new Promise(resolve => {
      const entry = { timer: 0, resolve };
      entry.timer = setTimeout(() => {
        pending.delete(entry);
        resolve(enabled && token === runToken);
      }, ms);
      pending.add(entry);
    });
  }
  function cancelPending() {
    for (const entry of pending) {
      clearTimeout(entry.timer);
      try { entry.resolve(false); } catch {}
    }
    pending.clear();
  }
  function computedVisible(element) {
    if (!element || !element.isConnected) return false;
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    if (element.closest('[
    hidden
  ],[
    aria-hidden="true"
  ]')) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }
  function findVisible(selector, textPattern = null) {
    return [...document.querySelectorAll(selector)].find(element => {
      if (!computedVisible(element)) return false;
      if (textPattern && !textPattern.test(String(element.textContent || '').trim())) return false;
      return true;
    }) || null;
  }
  function usable(element) {
    return !!element && computedVisible(element) && !element.disabled && element.getAttribute('aria-disabled') !== 'true';
  }
  function setStatus(text, state = '') {
    if (status) {
      status.textContent = text;
      status.title = text;
    }
    if (panel) panel.dataset.state = state;
    if (headerStatus) headerStatus.textContent = enabled ? (state === 'complete' ? 'Complete' : 'Running') : 'Stopped';
    window.dispatchEvent(new CustomEvent('lv-auto-gift-state', {
      detail: { enabled, state, status: text, completed, limit: Number(selection.limit) || 0, pageKey }
    }));
  }
  function updateCounter() {
    const limit = Number(selection.limit) || 0;
    if (counter) counter.textContent = limit ? `${completed} / ${limit}` : `${completed} completed`;
  }
  function setControlsLocked(locked) {
    [productSelect, platformSelect, paceRange, limitSelect, customAmountInput].forEach(control => {
      if (control) control.disabled = locked;
    });
    if (startButton) {
      startButton.textContent = locked ? 'Stop Auto Gift · F8' : 'Start Auto Gift · F8';
      startButton.classList.toggle('is-stop', locked);
    }
    panel?.classList.toggle('lv-auto-on', locked);
    window.dispatchEvent(new CustomEvent('lv-auto-gift-state', {
      detail: { enabled: locked, state: locked ? 'busy' : 'idle', status: locked ? 'Running' : 'Stopped', completed, limit: Number(selection.limit) || 0, pageKey }
    }));
  }
  function dispatchInput(input, inputType = 'insertText', data = null) {
    try {
      input.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, cancelable: true, inputType, data }));
    } catch {}
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function setNativeInputValue(input, value, inputType = 'insertText', data = null) {
    const ownSetter = Object.getOwnPropertyDescriptor(input, 'value')?.set;
    const prototypeSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value')?.set;
    if (prototypeSetter && ownSetter !== prototypeSetter) {
      prototypeSetter.call(input, value);
    } else if (ownSetter) {
      ownSetter.call(input, value);
    } else {
      input.value = value;
    }
    dispatchInput(input, inputType, data);
  }
  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function chance(probability) {
    return Math.random() < probability;
  }
  function weightedChoice(entries) {
    const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
    let cursor = Math.random() * total;
    for (const entry of entries) {
      cursor -= entry.weight;
      if (cursor <= 0) return entry.make();
    }
    return entries[entries.length - 1].make();
  }
  function styledWord(value, style = 'lower') {
    const word = String(value || '').toLowerCase();
    if (style === 'title') return capitalize(word);
    if (style === 'upper') return word.toUpperCase();
    return word;
  }
  function naturalNumber() {
    const options = [
      { weight: 54, make: () => '' },
      { weight: 28, make: () => pick(SPORT_NUMBERS) },
      { weight: 14, make: () => pick(YEAR_ENDINGS) },
      { weight: 4, make: () => String(random(2, 98)) }
    ];
    return weightedChoice(options);
  }
  function separatorFor(mode) {
    if (mode === 'xbox') return weightedChoice([
      { weight: 52, make: () => ' ' },
      { weight: 48, make: () => '' }
    ]);
    if (mode === 'psn') return weightedChoice([
      { weight: 48, make: () => '' },
      { weight: 43, make: () => '_' },
      { weight: 9, make: () => '-' }
    ]);
    if (mode === 'steam') return weightedChoice([
      { weight: 57, make: () => '' },
      { weight: 43, make: () => '_' }
    ]);
    if (mode === 'ea' || mode === 'epic' || mode === 'general') return '';
    return weightedChoice([
      { weight: 70, make: () => '' },
      { weight: 30, make: () => '_' }
    ]);
  }
  function casingFor(mode) {
    if (mode === 'xbox') return weightedChoice([
      { weight: 52, make: () => 'title' },
      { weight: 35, make: () => 'camel' },
      { weight: 13, make: () => 'lower' }
    ]);
    return weightedChoice([
      { weight: 68, make: () => 'lower' },
      { weight: 23, make: () => 'camel' },
      { weight: 9, make: () => 'title' }
    ]);
  }
  function applyCasing(parts, style, separator) {
    if (style === 'title') return parts.map(part => capitalize(part)).join(separator);
    if (style === 'camel') {
      if (separator) return parts.map(part => capitalize(part)).join(separator);
      return parts.map((part, index) => index ? capitalize(part) : part.toLowerCase()).join('');
    }
    return parts.join(separator).toLowerCase();
  }
  function fittedSurname(first, surname, separator = '', maxLength = 16) {
    const room = maxLength - first.length - separator.length;
    if (surname.length <= room) return surname;
    return surname.charAt(0);
  }
  function makeNameBasedTag(mode) {
    const first = pick(FIRST_NAMES);
    const nickname = pick(NICKNAMES);
    const surname = pick(SURNAME_STEMS);
    const initial = pick(LAST_INITIALS);
    const word = pick(NATURAL_WORDS);
    const number = naturalNumber();
    const requiredNumber = number || pick(SPORT_NUMBERS);
    const separator = separatorFor(mode);
    const style = casingFor(mode);
    const patterns = [
      { weight: 21, make: () => applyCasing([first, chance(.38) ? surname.charAt(0) : fittedSurname(first, surname, separator)], style, separator) },
      { weight: 18, make: () => applyCasing([nickname, word], style, separator) },
      { weight: 16, make: () => applyCasing([first, initial], style, separator) + number },
      { weight: 14, make: () => applyCasing([first], style, '') + requiredNumber },
      { weight: 11, make: () => applyCasing([first, word], style, separator) },
      { weight: 8, make: () => applyCasing([nickname], style, '') + requiredNumber },
      { weight: 6, make: () => applyCasing(['its', first], style, separator) },
      { weight: 4, make: () => applyCasing([word, first], style, separator) },
      { weight: 2, make: () => applyCasing([first, pick(RARE_TAILS)], style, separator) + (chance(.35) ? pick(SPORT_NUMBERS) : '') }
    ];
    return weightedChoice(patterns);
  }
  function makeXboxTag() {
    const first = pick(FIRST_NAMES);
    const nickname = pick(NICKNAMES);
    const surname = pick(SURNAME_STEMS);
    const word = pick(NATURAL_WORDS);
    const number = naturalNumber();
    const requiredNumber = number || pick(SPORT_NUMBERS);
    return weightedChoice([
      { weight: 24, make: () => `${capitalize(first)} ${capitalize(fittedSurname(first, surname, ' ', 12))}` },
      { weight: 20, make: () => `${capitalize(first)} ${pick(LAST_INITIALS).toUpperCase()}` },
      { weight: 17, make: () => `${capitalize(nickname)}${capitalize(word)}` },
      { weight: 14, make: () => `${capitalize(first)}${requiredNumber}` },
      { weight: 11, make: () => `${capitalize(nickname)} ${requiredNumber}` },
      { weight: 8, make: () => `${capitalize(word)}${capitalize(first)}` },
      { weight: 4, make: () => `${capitalize(first)} ${capitalize(pick(LAST_INITIALS))}${number}` },
      { weight: 2, make: () => `${capitalize(nickname)} ${capitalize(word)}` }
    ]);
  }
  function buildRealisticUsername(mode) {
    const safeMode = USERNAME_RULES[mode] ? mode : 'general';
    let candidate = '';
    for (let attempt = 0; attempt < 160; attempt++) {
      const curatedPool = CURATED_TAGS[safeMode] || CURATED_TAGS.general;
      candidate = pick(curatedPool);
      candidate = sanitizeUsername(candidate, safeMode);
      if (!isValidUsername(candidate, safeMode)) continue;
      const normalized = candidate.toLowerCase().replace(/[^a-z0-9]/g, '');
      const recentlyUsed = recentNames.some(name => name.normalized === normalized || name.value === candidate);
      if (!recentlyUsed && candidate !== currentUsername) break;
    }
    if (!isValidUsername(candidate, safeMode)) candidate = USERNAME_RULES[safeMode].fallback;
    currentUsername = candidate;
    recentNames.push({ value: candidate, normalized: candidate.toLowerCase().replace(/[^a-z0-9]/g, '') });
    if (recentNames.length > 120) recentNames.shift();
    return candidate;
  }
  function sanitizeUsername(name, mode) {
    const safeMode = USERNAME_RULES[mode] ? mode : 'general';
    const rules = USERNAME_RULES[safeMode];
    let value = String(name || '').trim();
    if (value.length < rules.min) value = rules.fallback;
    return value;
  }
  function isValidUsername(name, mode) {
    const safeMode = USERNAME_RULES[mode] ? mode : 'general';
    const rules = USERNAME_RULES[safeMode];
    const value = String(name || '');
    if (value.length < rules.min || value.length > rules.max) return false;
    return rules.pattern.test(value);
  }
  try {
    Object.defineProperty(window, '__lvAutoGiftUsernameQA', {
      configurable: true,
      value: Object.freeze({
        generate: mode => buildRealisticUsername(mode),
        isValid: (name, mode) => isValidUsername(name, mode),
        pool: USER_SUPPLIED_TAGS,
        robloxVerifiedPool: ROBLOX_VERIFIED_TAGS,
        modes: Object.freeze(Object.keys(USERNAME_RULES))
      })
    });
  } catch {}
  async function enterUsername(input, username, token, platformLabel = '') {
    if (!enabled || token !== runToken || !input?.isConnected) return false;
    input.focus({ preventScroll: true });
    setNativeInputValue(input, '', 'deleteContentBackward', null);
    const speed = currentSpeed();
    if (Math.random() < cycleRhythm.pasteChance) {
      setStatus('Pasting username…', 'busy');
      input.classList.add('lv-auto-input-paste');
      if (!await cancellableWait(humanMilliseconds(speed.paste, 'action'), token)) return false;
      if (!input.isConnected) return false;
      setNativeInputValue(input, username, 'insertFromPaste', username);
      input.dispatchEvent(new Event('change', { bubbles: true }));
      if (platformLabel) {
        const suffix = ` ${platformLabel}`;
        for (const character of suffix) {
          setNativeInputValue(input, `${input.value}${character}`, 'insertText', character);
          if (!await cancellableWait(humanMilliseconds([42, 115]), token)) return false;
        }
        if (!await cancellableWait(humanMilliseconds([280, 720], 'action'), token)) return false;
        for (let index = suffix.length; index > 0; index--) {
          setNativeInputValue(input, input.value.slice(0, -1), 'deleteContentBackward', null);
          if (!await cancellableWait(humanMilliseconds([32, 88]), token)) return false;
        }
      }
      try { input.blur(); } catch {}
      if (!await cancellableWait(random(220, 520), token)) return false;
      input.classList.remove('lv-auto-input-paste');
      return enabled && token === runToken;
    }
    setStatus('Typing username…', 'busy');
    input.classList.add('lv-auto-input-typing');
    const correctionIndex = Math.random() < cycleRhythm.correctionChance && username.length > 7
      ? random(2, username.length - 3)
      : -1;
    for (let index = 0; index < username.length; index++) {
      if (!enabled || token !== runToken || !input.isConnected) {
        input.classList.remove('lv-auto-input-typing');
        return false;
      }
      const character = username[index];
      if (index === correctionIndex && /[a-z0-9]/i.test(character)) {
        const wrongCharacter = /\d/.test(character) ? String((Number(character) + random(1, 8)) % 10) : pick('qwertyuiopasdfghjklzxcvbnm'.split(''));
        setNativeInputValue(input, `${input.value}${wrongCharacter}`, 'insertText', wrongCharacter);
        if (!await cancellableWait(humanMilliseconds([120, 330], 'action'), token)) return false;
        setNativeInputValue(input, input.value.slice(0, -1), 'deleteContentBackward', null);
        if (!await cancellableWait(humanMilliseconds([85, 240]), token)) return false;
      }
      setNativeInputValue(input, `${input.value}${character}`, 'insertText', character);
      let ms = humanMilliseconds(speed.character);
      if (index > 0 && index % random(3, 6) === 0) ms += random(70, 260);
      if (character === '_' || character === ' ') ms += random(45, 125);
      if (/\d/.test(character)) ms += random(15, 70);
      if (!await cancellableWait(ms, token)) return false;
    }
    // Re-apply the finished value through the native setter. Controlled
    // React inputs (including 2K27's Player ID field) can otherwise display
    // text before their internal state has received the final character.
    setNativeInputValue(input, username, 'insertText', username);
    input.dispatchEvent(new Event('change', {
     bubbles: true 
  }));
    if (platformLabel) {
      const suffix = ` ${platformLabel}`;
      for (const character of suffix) {
        setNativeInputValue(input, `${input.value}${character}`, 'insertText', character);
        if (!await cancellableWait(humanMilliseconds([
        42, 115
      ]), token)) return false;
    }
      if (!await cancellableWait(humanMilliseconds([
      280, 720
    ], 'action'), token)) return false;
      for (let index = suffix.length;
     index > 0;
     index--) {
        setNativeInputValue(input, input.value.slice(0, -1), 'deleteContentBackward', null);
        if (!await cancellableWait(humanMilliseconds([
        32, 88
      ]), token)) return false;
    }
      setNativeInputValue(input, username, 'insertText', username);
      input.dispatchEvent(new Event('change', {
       bubbles: true 
    }));
  }
    try {
     input.blur();
  } catch {
  }
    input.classList.remove('lv-auto-input-typing');
    return cancellableWait(humanMilliseconds(currentSpeed().settle), token);
}
  async function naturalClick(element, token, label = 'Continuing…') {
    if (!enabled || token !== runToken || !usable(element)) return false;
    const speed = currentSpeed();
    setStatus(label, 'busy');
    try {
     element.scrollIntoView({
       behavior: 'smooth', block: 'center' 
    });
  } catch {
  }
    if (!await cancellableWait(humanMilliseconds(speed.click, 'click'), token)) return false;
    if (!usable(element)) return false;
    element.classList.add('lv-auto-click');
    try {
      const PointerCtor = window.PointerEvent || window.MouseEvent;
      element.dispatchEvent(new PointerCtor('pointerdown', {
       bubbles: true, pointerType: 'mouse' 
    }));
      element.dispatchEvent(new MouseEvent('mousedown', {
       bubbles: true 
    }));
  } catch {
  }
    if (!await cancellableWait(humanMilliseconds(speed.press), token)) {
      element.classList.remove('lv-auto-click');
      return false;
  }
    if (!usable(element)) {
      element.classList.remove('lv-auto-click');
      return false;
  }
    element.click();
    try {
      element.dispatchEvent(new MouseEvent('mouseup', {
       bubbles: true 
    }));
      const PointerCtor = window.PointerEvent || window.MouseEvent;
      element.dispatchEvent(new PointerCtor('pointerup', {
       bubbles: true, pointerType: 'mouse' 
    }));
  } catch {
  }
    setTimeout(() => element.classList.remove('lv-auto-click'), 380);
    return true;
}
  async function waitFor(selector, token, options = {
}) {
    const timeout = options.timeout || 60000;
    const started = Date.now();
    while (enabled && token === runToken && Date.now() - started < timeout) {
      const element = findVisible(selector, options.text || null);
      if (element && (!options.usable || usable(element))) return element;
      if (options.stopAtSuccess && findVisible(config.success)) return null;
      if (!await cancellableWait(random(100, 190), token)) return null;
  }
    return null;
}
  async function waitUntilHidden(selector, token, timeout = 9000) {
    const started = Date.now();
    while (enabled && token === runToken && Date.now() - started < timeout) {
      if (!findVisible(selector)) return true;
      if (!await cancellableWait(120, token)) return false;
  }
    return !findVisible(selector);
}
  async function waitForSettled(token, min, max) {
    return cancellableWait(random(min, max), token);
}
  async function waitForProductView(token, scale = 1) {
    const [
    min, max
  ] = currentSpeed().productView;
    return cancellableWait(humanMilliseconds([
    Math.round(min * scale), Math.round(max * scale)
  ], 'product'), token);
}
  async function clickConfiguredAction(action, token) {
    for (let attempt = 0;
   attempt < 3;
   attempt++) {
      const button = await waitFor(action.selector, token, {
        text: action.text || null,
        usable: true,
        timeout: action.optionalUntilSuccess ? 50000 : 70000,
        stopAtSuccess: action.optionalUntilSuccess
    });
      if (!button) return action.optionalUntilSuccess && !!findVisible(config.success);
      if (await naturalClick(button, token, action.label || 'Continuing…')) {
        if (!action.after) return true;
        let appeared = await waitFor(action.after, token, {
         usable: true, timeout: action.afterTimeout || 12000 
      });
        if (!appeared && enabled && token === runToken && usable(button)) {
          button.click();
          appeared = await waitFor(action.after, token, {
           usable: true, timeout: 3500 
        });
      }
        return !!appeared;
    }
      if (!await cancellableWait(humanMilliseconds(currentSpeed().settle), token)) return false;
  }
    return false;
}
  async function ensureCheckout(token) {
    const existing = findVisible(config.input);
    if (existing) return existing;
    setStatus(`Selecting ${selectedProductLabel()}${activeCyclePlatform ? ` on ${
    cyclePlatformLabel()
  }` : ''}…`, 'busy');
    if (!await cancellableWait(humanMilliseconds(currentSpeed().prepare, 'product'), token)) return null;
    let prepared = false;
    try {
     prepared = await config.prepare(token);
  } catch {
     prepared = false;
  }
    if (!prepared || !enabled || token !== runToken) return null;
    return waitFor(config.input, token, {
     timeout: 18000 
  });
}
  function hasReachedLimit() {
    const limit = Number(selection.limit) || 0;
    return limit > 0 && completed >= limit;
}
  function nextUsername(mode) {
    const uniquePool = [
    ...new Set(config.usernamePool || [
    ])
  ];
    if (!uniquePool.length) return buildRealisticUsername(mode);
    if (!usernameQueue.length) {
      usernameQueue = [
      ...uniquePool
    ];
      for (let index = usernameQueue.length - 1;
     index > 0;
     index -= 1) {
        const swapWith = random(0, index);
        [
        usernameQueue[
          index
        ], usernameQueue[
          swapWith
        ]
      ] = [
        usernameQueue[
          swapWith
        ], usernameQueue[
          index
        ]
      ];
    }
      if (usernameQueue.length > 1 && usernameQueue[
      0
    ] === lastCycleUsername) {
        [
        usernameQueue[
          0
        ], usernameQueue[
          1
        ]
      ] = [
        usernameQueue[
          1
        ], usernameQueue[
          0
        ]
      ];
    }
  }
    lastCycleUsername = usernameQueue.shift();
    return lastCycleUsername;
}
  async function runOneCycle(token) {
    activeCyclePlatform = resolveCyclePlatform();
    refreshCycleRhythm();
    const input = await ensureCheckout(token);
    if (!input) return false;
    const speed = currentSpeed();
    const initial = humanMilliseconds(speed.initial, 'action');
    setStatus(`Preparing recipient in ${(initial / 1000).toFixed(1)}s`, 'waiting');
    if (!await cancellableWait(initial, token)) return false;
    const mode = typeof config.usernameMode === 'function' ? config.usernameMode(currentCycleSelection()) : 'general';
    const username = nextUsername(mode);
    const rawPlatformLabel = cyclePlatformLabel();
    const typingPlatformLabel = /playstation/i.test(rawPlatformLabel) ? 'PS5' : /xbox/i.test(rawPlatformLabel) ? 'Xbox' : /steam/i.test(rawPlatformLabel) ? 'Steam' : '';
    if (!await enterUsername(input, username, token, typingPlatformLabel)) return false;
    if (typeof config.afterUsername === 'function' && !await config.afterUsername(token, username)) return false;
    for (const action of config.actions) {
      if (!enabled || token !== runToken) return false;
      if (!await clickConfiguredAction(action, token)) return false;
      if (!await cancellableWait(humanMilliseconds(speed.actionGap, 'action'), token)) return false;
  }
    const success = await waitFor(config.success, token, {
     timeout: 100000 
  });
    if (!success) return false;
    completed += 1;
    updateCounter();
    setStatus(`${selectedProductLabel()} sent${activeCyclePlatform ? ` on ${
    cyclePlatformLabel()
  }` : ''}`, 'complete');
    if (!await cancellableWait(humanMilliseconds(speed.receipt, 'receipt'), token)) return false;
    // A few pages briefly keep their checkout busy after the success screen
    // appears. Retry the Done/Return button so an ignored first click can never
    // leave an unattended run parked on the receipt.
    for (let attempt = 0;
   attempt < 4;
   attempt++) {
      const done = await waitFor(config.done, token, {
        text: config.doneText || null,
        usable: true,
        timeout: attempt === 0 ? 30000 : 5000
    });
      if (!done) break;
      await naturalClick(done, token, 'Closing receipt…');
      if (await waitUntilHidden(config.success, token, attempt === 0 ? 1700 : 2600)) break;
      if (config.modal && !findVisible(config.modal)) break;
      if (!await cancellableWait(humanMilliseconds(currentSpeed().actionGap, 'action'), token)) return false;
  }
    await waitUntilHidden(config.success, token, 9000);
    if (config.modal) await waitUntilHidden(config.modal, token, 9000);
    return enabled && token === runToken;
}
  async function automationLoop(token) {
    if (running) return;
    running = true;
    try {
      while (enabled && token === runToken) {
        if (hasReachedLimit()) {
          finishLimit();
          return;
      }
        const completedCycle = await runOneCycle(token);
        if (!enabled || token !== runToken) return;
        if (!completedCycle) {
          setStatus('Retrying checkout…', 'waiting');
          if (!await cancellableWait(humanMilliseconds(currentSpeed().retry), token)) return;
          continue;
      }
        if (hasReachedLimit()) {
          finishLimit();
          return;
      }
        const nextDelay = humanMilliseconds(currentSpeed().between);
        setStatus(`Next gift in ${(nextDelay / 1000).toFixed(1)}s`, 'waiting');
        if (!await cancellableWait(nextDelay, token)) return;
    }
  } finally {
      if (token === runToken) running = false;
  }
}
  function finishLimit() {
    enabled = false;
    runToken += 1;
    running = false;
    cancelPending();
    releaseWakeLock();
    setControlsLocked(false);
    setStatus(`Finished ${completed} ${completed === 1 ? 'gift' : 'gifts'}`, 'complete');
    try {
     localStorage.setItem(STORAGE_KEY, '0');
  } catch {
  }
}
  function stop({
   persist = true, resetStatus = true 
} = {
}) {
    enabled = false;
    runToken += 1;
    running = false;
    cancelPending();
    releaseWakeLock();
    document.querySelectorAll('.lv-auto-input-typing,.lv-auto-input-paste,.lv-auto-click').forEach(element => {
      element.classList.remove('lv-auto-input-typing', 'lv-auto-input-paste', 'lv-auto-click');
  });
    setControlsLocked(false);
    if (resetStatus) setStatus('Stopped — ready to start', 'idle');
    if (persist) {
      try {
       localStorage.setItem(STORAGE_KEY, '0');
    } catch {
    }
  }
}
  function start({
   persist = true 
} = {
}) {
    if (enabled) return;
    enabled = true;
    completed = 0;
    updateCounter();
    saveSettings();
    setControlsLocked(true);
    acquireWakeLock();
    const token = ++runToken;
    setStatus(`Starting ${selectedProductLabel()}${selection.platform === 'mixed' ? ' with mixed platforms' : ''}…`, 'busy');
    if (persist) {
      try {
       localStorage.setItem(STORAGE_KEY, '1');
    } catch {
    }
  }
    automationLoop(token);
}
  function optionMarkup(options, selectedValue) {
    return options.map(option => `<option value="${escapeHtml(option.value)}"${option.value === selectedValue ? ' selected' : ''}>${escapeHtml(option.label)}</option>`).join('');
}
  function escapeHtml(value) {
    return String(value).replace(/[
    &<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;
    ', "'": '&#39;'
    }[character]));
  }
  let panel = null;
  let headerStatus = null;
  let productSelect = null;
  let customAmountField = null;
  let customAmountInput = null;
  let platformSelect = null;
  let paceRange = null;
  let paceValue = null;
  let paceDescription = null;
  let limitSelect = null;
  let startButton = null;
  let status = null;
  let counter = null;
  let mounted = false;
  function mountAutoGiftPanel() {
    if (mounted) return;
    const mount = document.querySelector('#lvSettingsAutoGiftMount');
    if (!mount) return;
    mounted = true;
    panel = document.createElement('section');
    panel.className = 'lv-auto-panel';
    panel.style.setProperty('--lv-auto-accent', config.accent);
    panel.style.setProperty('--lv-auto-accent-2', config.accent2);
    panel.setAttribute('aria-label', config.title);
    panel.innerHTML = `
      <div class="lv-auto-panel-head">
        <span class="lv-auto-brand"><i class="lv-auto-dot" aria-hidden="true"></i><span><strong>Auto Gift</strong><small id="lvAutoHeaderStatus">Stopped</small></span></span>
        <span class="lv-auto-ready-pill">Unattended</span>
      </div>
      <div class="lv-auto-panel-body" id="lvAutoPanelBody">
        <label class="lv-auto-field">
          <span>Product</span>
          <select id="lvAutoProduct">${optionMarkup(config.products, selection.product)}</select>
        </label>
        ${config.customAmount ? `
        <label class="lv-auto-field lv-auto-custom-field${
      selection.product === 'custom' ? ' is-visible' : ''
    }" id="lvAutoCustomField">
          <span>Custom amount</span>
          <input id="lvAutoCustomAmount" type="number" min="${
      config.customAmount.min
    }" max="${
      config.customAmount.max
    }" step="1" value="${
      escapeHtml(selection.customAmount)
    }" inputmode="numeric">
        </label>` : ''}
        ${config.platforms.length ? `
        <label class="lv-auto-field">
          <span>${pageKey === 'gift-card' ? 'Gift card type' : 'Platform'}</span>
          <select id="lvAutoPlatform">${optionMarkup(config.platforms, selection.platform)}</select>
        </label>` : ''}
        <div class="lv-auto-speed-card">
          <div class="lv-auto-speed-head">
            <span>Interaction pace</span>
            <strong><b id="lvAutoPaceValue">${selection.paceSeconds.toFixed(1)}s</b><small id="lvAutoPaceDescription">${paceLabel()}</small></strong>
          </div>
          <input class="lv-auto-range" id="lvAutoPace" type="range" min="${
      PACE_MIN
    }" max="${
      PACE_MAX
    }" step="${
      PACE_STEP
    }" value="${
      selection.paceSeconds
    }" aria-label="Auto Gift interaction pace">
          <div class="lv-auto-range-labels"><span>2s · Quick</span><span>10s · Natural</span></div>
          <p>Controls product selection, Buy Now, recipient entry and checkout pauses. Existing page loaders keep their normal duration.</p>
        </div>
        <label class="lv-auto-field">
          <span>Gifts</span>
          <select id="lvAutoLimit">
            <option value="0"${selection.limit === '0' ? ' selected' : ''}>Until stopped</option>
            <option value="1"${selection.limit === '1' ? ' selected' : ''}>1</option>
            <option value="3"${selection.limit === '3' ? ' selected' : ''}>3</option>
            <option value="5"${selection.limit === '5' ? ' selected' : ''}>5</option>
            <option value="10"${selection.limit === '10' ? ' selected' : ''}>10</option>
            <option value="25"${selection.limit === '25' ? ' selected' : ''}>25</option>
            <option value="50"${selection.limit === '50' ? ' selected' : ''}>50</option>
          </select>
        </label>
        <button aria-keyshortcuts="F8" class="lv-auto-start" id="lvAutoStart" type="button">Start Auto Gift · F8</button>
        <p class="lv-auto-note">Press <kbd>F8</kbd> anywhere to start or stop. The checkout repeats until stopped.</p>
        <div class="lv-auto-footer">
          <span id="lvAutoGiftStatus" role="status" aria-live="polite">Stopped — ready to start</span>
          <strong id="lvAutoCounter">0 completed</strong>
        </div>
      </div>`;
    mount.appendChild(panel);
    headerStatus = panel.querySelector('#lvAutoHeaderStatus');
    productSelect = panel.querySelector('#lvAutoProduct');
    customAmountField = panel.querySelector('#lvAutoCustomField');
    customAmountInput = panel.querySelector('#lvAutoCustomAmount');
    platformSelect = panel.querySelector('#lvAutoPlatform');
    paceRange = panel.querySelector('#lvAutoPace');
    paceValue = panel.querySelector('#lvAutoPaceValue');
    paceDescription = panel.querySelector('#lvAutoPaceDescription');
    limitSelect = panel.querySelector('#lvAutoLimit');
    startButton = panel.querySelector('#lvAutoStart');
    status = panel.querySelector('#lvAutoGiftStatus');
    counter = panel.querySelector('#lvAutoCounter');
    function syncCustomAmountField() {
      customAmountField?.classList.toggle('is-visible', selection.product === 'custom');
    }
    function syncPaceUI() {
      const progress = ((selection.paceSeconds - PACE_MIN) / (PACE_MAX - PACE_MIN)) * 100;
      if (paceRange) {
        paceRange.value = String(selection.paceSeconds);
        paceRange.style.setProperty('--lv-auto-range-progress', `${progress}%`);
        paceRange.setAttribute('aria-valuetext', `${selection.paceSeconds.toFixed(1)} seconds, ${paceLabel()}`);
      }
      if (paceValue) paceValue.textContent = `${selection.paceSeconds.toFixed(1)}s`;
      if (paceDescription) paceDescription.textContent = paceLabel();
    }
    productSelect.addEventListener('change', () => {
      selection.product = productSelect.value;
      syncCustomAmountField();
      saveSettings();
      setStatus(`Ready for ${selectedProductLabel()}`, 'idle');
    });
    customAmountInput?.addEventListener('input', () => {
      const min = config.customAmount.min;
      const max = config.customAmount.max;
      const value = Math.round(Number(customAmountInput.value) || config.customAmount.default);
      selection.customAmount = String(Math.min(max, Math.max(min, value)));
      saveSettings();
      setStatus(`Ready for ${selectedProductLabel()}`, 'idle');
    });
    customAmountInput?.addEventListener('change', () => {
      customAmountInput.value = selection.customAmount;
    });
    platformSelect?.addEventListener('change', () => {
      selection.platform = platformSelect.value;
      lastCyclePlatform = '';
      saveSettings();
      setStatus(`Ready for ${selectedPlatformLabel()}`, 'idle');
    });
    paceRange.addEventListener('input', () => {
      selection.paceSeconds = clampPace(paceRange.value);
      syncPaceUI();
      saveSettings();
      setStatus(`Pace set to ${selection.paceSeconds.toFixed(1)} seconds`, 'idle');
    });
    paceRange.addEventListener('change', () => {
      selection.paceSeconds = clampPace(paceRange.value);
      syncPaceUI();
      saveSettings();
    });
    limitSelect.addEventListener('change', () => {
      selection.limit = limitSelect.value;
      saveSettings();
      updateCounter();
    });
    startButton.addEventListener('click', () => {
      if (enabled) {
        stop();
      } else {
        start();
        window.setTimeout(() => window.LVSettingsUI?.close?.(), 420);
      }
    });
    updateCounter();
    syncCustomAmountField();
    syncPaceUI();
    setControlsLocked(enabled);
    setStatus(enabled ? 'Running' : 'Stopped — ready to start', enabled ? 'busy' : 'idle');
    let savedEnabled = false;
    try { savedEnabled = localStorage.getItem(STORAGE_KEY) === '1'; } catch {}
    if (savedEnabled && !enabled) requestAnimationFrame(() => start({ persist: false }));
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && enabled) acquireWakeLock();
  });
  document.addEventListener('keydown', event => {
    const isF8 = event.key === 'F8' || event.code === 'F8';
    if (event.repeat || !isF8 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    if (enabled) {
      stop();
    } else {
      start();
      window.setTimeout(() => window.LVSettingsUI?.close?.(), 420);
    }
  });
  window.addEventListener('pagehide', releaseWakeLock, { once: true });
  if (document.querySelector('#lvSettingsAutoGiftMount')) mountAutoGiftPanel();
  else window.addEventListener('lv-settings-ready', mountAutoGiftPanel, { once: true });
})();
