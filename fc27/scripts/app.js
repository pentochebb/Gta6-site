(()=>{
  const data=window.FC27_DATA||{
    platforms:{
    },editions:{
    },order:[
    ]
  };
  const modal=document.getElementById('buyModal');
  if(!modal)return;
  const editions={
    'ultimate-plus-edition':{
      title:'Ultimate Plus Edition',usd:149.99,access:'Up to 7 days early access',release:'18 Sep 2026',art:'https://drop-assets.ea.com/images/50mR0s1y0jE6s3Vl1kvdPA/3bfad29e464bd9460e59b279d1fd4058/EA_FC27_ULT__KeyArt_RGB_16-9_3840x2160.jpg?im=AspectCrop=(16,9),xPosition=0.5,yPosition=0.5',cover:'assets/checkout/fc27-ultimate-plus-cover-final.jpg'
    },
    ultimate:{
      title:'Ultimate Edition',usd:99.99,access:'Up to 7 days early access',release:'18 Sep 2026',art:'https://drop-assets.ea.com/images/45vNZQj5j4RfKdJp29rT9O/b32963be7bfd5f240ebffb65dd742d6a/EA_FC27_ULT_KeyArt_RGB_16x9_3840x2160_ALT-LightLogo.jpg?im=AspectCrop=(16,9),xPosition=0.5,yPosition=0.5',cover:'assets/checkout/fc27-ultimate-vinicius-cover-v6.jpg'
    },
    standard:{
      title:'Standard Edition',usd:69.99,access:'Global launch access',release:'25 Sep 2026',art:'assets/checkout/fc27-standard-landscape-mbappe-20260724.webp',cover:'assets/checkout/fc27-standard-mbappe-city-cover-v6.jpg'
    }
  };
  const platforms={
    pc:{
      title:'PC',avatarType:'pc',icon:'assets/icons/windows-pc-white.svg',accent:'#272b29'
    },
    playstation:{
      title:'PlayStation',avatarType:'ps',icon:'assets/icons/playstation-white.svg',accent:'#1473e6'
    },
    xbox:{
      title:'Xbox',avatarType:'xbox',icon:'assets/icons/xbox-white.svg',accent:'#107c10'
    }
  };
  const relaxedUsername=value=>/^[
    A-Za-z0-9 _.-
  ]+$/.test(value);
  const usernameRules={
    pc:{
      test:relaxedUsername,hint:'Use letters, numbers, spaces, underscores, hyphens or dots.'
    },
    playstation:{
      test:relaxedUsername,hint:'Use letters, numbers, spaces, underscores, hyphens or dots.'
    },
    xbox:{
      test:relaxedUsername,hint:'Use letters, numbers, spaces, underscores, hyphens or dots.'
    }
  };
  const currencyTable={
    USD:{
      symbol:'US$',rate:1
    },
    NZD:{
      symbol:'NZ$',rate:1.63934
    },
    AUD:{
      symbol:'A$',rate:1.4918
    },
    GBP:{
      symbol:'£',rate:.7869
    }
  };
  let currency=String(localStorage.getItem('fc27Currency')||'USD').toUpperCase();
  if(!currencyTable[
    currency
  ])currency='USD';
  const formatMoney=usd=>{
    const c=currencyTable[
      currency
    ]||currencyTable.USD;
    return `${c.symbol}${(Number(usd)*c.rate).toFixed(2)}`
  };
  const editionPrice=edition=>formatMoney(edition.usd);
  const storedGlobalSettings=()=>{
    try{
      return JSON.parse(localStorage.getItem('lv_global_settings')||'{}')||{
      }
    }catch{
      return {
      }
    }
  };
  const PAYMENT_METHOD_KEY='fc27PaymentMethod';
  const storedPaymentMethod=()=>{
    try{
      return localStorage.getItem(PAYMENT_METHOD_KEY)==='visa'?'visa':'applepay'
    }catch{
      return'applepay'
    }
  };
  const state={
    edition:'standard',platform:'pc',username:'',avatar:'assets/avatars/pc-avatar-02.webp',email:'',order:'',paymentMethod:storedPaymentMethod()
  };
  let lookupTimer=null,applePayTimer=null,processTimers=[
  ],currentPaymentMethod=state.paymentMethod;
  const $=id=>document.getElementById(id);
  const all=(selector,root=document)=>[
    ...root.querySelectorAll(selector)
  ];
  const put=(id,value)=>{
    const node=$(id);
    if(node)node.textContent=value
  };
  const image=(id,src)=>{
    const node=$(id);
    if(node)node.src=src
  };
  const isMobilePaymentFlow=()=>document.body.classList.contains('fc-phone-mode')||matchMedia('(max-width:620px)').matches;
  const effectivePaymentMethod=()=>isMobilePaymentFlow()?'applepay':state.paymentMethod;
  const paymentLabel=method=>method==='visa'?'Visa •••• 4242':'Apple Pay';
  function syncPaymentMethodDisplay(){
    const method=effectivePaymentMethod();
    const select=$('paymentMethodSelect');
    if(select)select.value=state.paymentMethod;
    all('.fc-payment-method-panel',modal).forEach(panel=>panel.classList.toggle('active',panel.dataset.method===method));
    const e=editions[
      state.edition
    ];
    const confirm=$('confirmCheckout');
    if(confirm)confirm.textContent=method==='visa'?`Confirm Visa · ${editionPrice(e)}`:`Continue with Apple Pay · ${editionPrice(e)}`;
    put('applePaySummary',isMobilePaymentFlow()?'Confirm with the side button on this iPhone.':'Scan with iPhone to continue your Apple Pay purchase.');
  }
  function syncStorefrontPrices(){
    all('.buy-edition').forEach(button=>{
      const edition=editions[
        button.dataset.edition
      ];
      const price=button.closest('.edition-card')?.querySelector('.edition-price');
      if(edition&&price)price.textContent=editionPrice(edition);
    });
    all('[data-checkout-edition]',modal).forEach(button=>{
      const edition=editions[
        button.dataset.checkoutEdition
      ];
      const price=button.querySelector('strong');
      if(edition&&price)price.textContent=editionPrice(edition);
    });
    const heroPrice=document.querySelector('.side-card .price');
    if(heroPrice)heroPrice.textContent=editionPrice(editions.standard);
  }
  function applySavedCardName(settings={
  }){
    const globalSettings={
      ...storedGlobalSettings(),...settings
    };
    const name=String(globalSettings.paymentName||localStorage.getItem('fc27PayPalName')||'Thomas Smith').trim().slice(0,32)||'Thomas Smith';
    put('fcSavedCardName',name);
  }
  function applyVisualSettings(settings={
  }){
    const globalSettings={
      ...storedGlobalSettings(),...settings
    };
    const next=String(globalSettings.currency||localStorage.getItem('fc27Currency')||currency).toUpperCase();
    if(currencyTable[
      next
    ])currency=next;
    appleSpeed=Math.max(0,Math.min(3,Number(globalSettings.paymentSpeed??localStorage.getItem('lvx-apple-speed')??1)));
    localStorage.setItem('fc27Currency',currency);
    applySavedCardName(globalSettings);
    syncStorefrontPrices();
    syncOrder();
  }
  function hash(text){
    let h=0;
    for(let i=0;
    i<text.length;
    i++){
      h=((h<<5)-h)+text.charCodeAt(i);
      h|=0
    }return Math.abs(h)
  }
  function emailFor(name){
    const clean=String(name||'player').toLowerCase().replace(/\s+/g,'').replace(/[
      ^a-z0-9._-
    ]/g,'').replace(/^\.+|\.+$/g,'')||'player';
    const roll=Math.random();
    const domain=roll<.7?'gmail.com':roll<.8?'outlook.com':'icloud.com';
    return `${clean}@${domain}`;
  }
  function avatarFor(){
    const type=platforms[
      state.platform
    ].avatarType;
    return window.LVAvatarPools?.random(type,state.avatar)||'/assets/avatars/pc-avatar-02.webp';
  }
  function orderNumber(){
    const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const part=()=>Array.from({
      length:4
    },()=>alphabet[
      Math.floor(Math.random()*alphabet.length)
    ]).join('');
    return `EA-${part()}-${part()}-${part()}`
  }
  function toast(message){
    const node=$('checkoutToast');
    if(!node)return;
    node.textContent=message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>node.classList.remove('show'),1800)
  }
  function setProgress(panel){
    const order=[
      'order','profile','payment','complete'
    ];
    const normalized=panel==='processing'||panel==='applepay-scan'||panel==='applepay-mobile'?'payment':panel==='success'?'complete':panel;
    const index=order.indexOf(normalized);
    all('[data-progress]',modal).forEach((step,i)=>{
      step.classList.toggle('active',i===index);
      step.classList.toggle('done',i<index)
    });
  }
  function showPanel(name){
    modal.dataset.view=name;
    all('[data-panel]',modal).forEach(panel=>panel.classList.toggle('active',panel.dataset.panel===name));
    setProgress(name);
  }
  function syncOrder(){
    syncStorefrontPrices();
    applySavedCardName();
    const e=editions[
      state.edition
    ],p=platforms[
      state.platform
    ];
    all('[data-checkout-edition]',modal).forEach(btn=>btn.classList.toggle('active',btn.dataset.checkoutEdition===state.edition));
    all('[data-checkout-platform]',modal).forEach(btn=>btn.classList.toggle('active',btn.dataset.checkoutPlatform===state.platform));
    [
      'checkoutEditionArt','profileCover','paymentCover','successCover','mobileApplePayCover'
    ].forEach(id=>{
      image(id,e.cover);
      const cover=$(id);
      if(cover)cover.alt=`${e.title} cover`
    });
    put('checkoutEditionTitle',e.title);
    put('checkoutEditionAccess',`${e.access} · Digital download`);
    put('checkoutPlatformTitle',p.title);
    put('checkoutRelease',e.release);
    put('checkoutPrice',editionPrice(e));
    put('profileEdition',e.title);
    put('profilePlatform',p.title);
    put('profilePrice',editionPrice(e));
    put('profileAccess',e.access);
    image('paymentPlatformIcon',p.icon);
    modal.style.setProperty('--checkout-platform-accent',p.accent||'#2c3230');
    put('paymentPlatformName',p.title);
    put('paymentEdition',e.title);
    put('paymentOrderPlatform',p.title);
    put('paymentTotal',editionPrice(e));
    put('paymentSummary',`${e.title} for ${state.username||'your selected player'}.`);
    put('mobileApplePayEdition',e.title);
    put('mobileApplePayTotal',editionPrice(e));
    put('mobileApplePayPlayer',state.username||'Player');
    syncPaymentMethodDisplay();
  }
  function resetLookup(){
    clearTimeout(lookupTimer);
    state.username='';
    state.email='';
    const input=$('playerUsername');
    if(input){
      input.value='';
      input.removeAttribute('maxlength');
      input.classList.remove('invalid')
    }
    const searchButton=$('findPlayer');
    if(searchButton){
      searchButton.disabled=false;
      searchButton.textContent='Search'
    }
    $('lookupSpinner')?.classList.remove('on');
    put('lookupText','');
    $('accountPreview')?.classList.remove('ready');
    if($('accountAvatar'))$('accountAvatar').innerHTML='<span class="fc-avatar-placeholder">?</span>';
    put('accountName','Player profile');
    put('accountPlatform','Waiting for account lookup');
    if($('accountTags'))$('accountTags').innerHTML='<em>Avatar service ready</em><em>Global region</em>';
    if($('continueToPayment'))$('continueToPayment').disabled=true;
  }
  function openCheckout(edition){
    if(edition&&editions[
      edition
    ])state.edition=edition;
    syncOrder();
    resetLookup();
    showPanel('order');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden'
  }
  function closeCheckout(){
    clearTimeout(lookupTimer);
    clearTimeout(applePayTimer);
    applePayTimer=null;
    processTimers.forEach(clearTimeout);
    processTimers=[
    ];
    $('fcMobileSideConfirm')?.classList.remove('arming');
    modal.classList.remove('open');
    modal.removeAttribute('data-view');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow=''
  }
  all('[data-open-buy]').forEach(btn=>btn.addEventListener('click',()=>openCheckout('standard')));
  all('.buy-edition').forEach(btn=>btn.addEventListener('click',()=>openCheckout(btn.dataset.edition)));
  all('[data-checkout-edition]',modal).forEach(btn=>btn.addEventListener('click',()=>{
    state.edition=btn.dataset.checkoutEdition;
    syncOrder()
  }));
  all('[data-checkout-platform]',modal).forEach(btn=>btn.addEventListener('click',()=>{
    state.platform=btn.dataset.checkoutPlatform;
    syncOrder();
    resetLookup()
  }));
  $('closeModal')?.addEventListener('click',closeCheckout);
  all('[data-close-checkout]',modal).forEach(node=>node.addEventListener('click',closeCheckout));
  addEventListener('keydown',event=>{
    if(event.key==='Escape'&&modal.classList.contains('open'))closeCheckout()
  });
  $('continueToProfile')?.addEventListener('click',()=>{
    showPanel('profile');
    setTimeout(()=>$('playerUsername')?.focus(),80)
  });
  $('backToOrder')?.addEventListener('click',()=>showPanel('order'));
  $('backToProfile')?.addEventListener('click',()=>showPanel('profile'));
  $('finishCheckout')?.addEventListener('click',closeCheckout);
  function findPlayer(){
    const input=$('playerUsername');
    const raw=input.value.trim();
    const rule=usernameRules[
      state.platform
    ]||usernameRules.pc;
    if(!rule.test(raw)){
      input.classList.add('invalid');
      put('lookupText',rule.hint);
      toast('Enter a valid platform username');
      return
    }
    input.classList.remove('invalid');
    clearTimeout(lookupTimer);
    $('lookupSpinner')?.classList.add('on');
    put('lookupText',`Searching ${platforms[state.platform].title}…`);
    $('continueToPayment').disabled=true;
    $('accountPreview')?.classList.remove('ready');
    const searchButton=$('findPlayer');
    if(searchButton){
      searchButton.disabled=true;
      searchButton.textContent='Searching'
    }
    const lookupDelay=window.LVRuntime?.delay(720,1760,'lookup')??(720+Math.floor(Math.random()*850));
    lookupTimer=setTimeout(()=>{
      state.username=raw;
      state.avatar=avatarFor();
      state.email=emailFor(raw);
      $('lookupSpinner')?.classList.remove('on');
      put('lookupText','User found.');
      if(searchButton){
        searchButton.disabled=false;
        searchButton.textContent='Search'
      }if($('accountAvatar'))$('accountAvatar').innerHTML=`<img src="${state.avatar}" alt="${raw} avatar">`;
      put('accountName',raw);
      put('accountPlatform',platforms[
        state.platform
      ].title);
      if($('accountTags'))$('accountTags').innerHTML=`<em>Online recently</em><em>${14+(hash(raw)%83)} trophies</em><em>Account created ${2016+(hash(raw)%9)}</em>`;
      $('accountPreview')?.classList.add('ready');
      $('continueToPayment').disabled=false
    },lookupDelay);
  }
  $('findPlayer')?.addEventListener('click',findPlayer);
  $('playerUsername')?.addEventListener('keydown',event=>{
    if(event.key==='Enter')findPlayer()
  });
  $('continueToPayment')?.addEventListener('click',()=>{
    if(!state.username){
      toast('Find the player profile first');
      return
    }
    const e=editions[
      state.edition
    ],p=platforms[
      state.platform
    ];
    image('paymentPlatformIcon',p.icon);
    modal.style.setProperty('--checkout-platform-accent',p.accent||'#2c3230');
    put('paymentPlatformName',p.title);
    put('paymentPlayer',state.username);
    put('paymentTotal',editionPrice(e));
    put('paymentSummary',`${e.title} for ${state.username}.`);
    put('mobileApplePayEdition',e.title);
    put('mobileApplePayTotal',editionPrice(e));
    put('mobileApplePayPlayer',state.username);
    syncPaymentMethodDisplay();
    showPanel('payment');
  });
  function startProcessing(method=effectivePaymentMethod()){
    clearTimeout(applePayTimer);
    applePayTimer=null;
    $('fcMobileSideConfirm')?.classList.remove('arming');
    currentPaymentMethod=method;
    const e=editions[
      state.edition
    ],p=platforms[
      state.platform
    ];
    showPanel('processing');
    $('processingBar').style.width='0%';
    put('processingLabel',method==='visa'?`Authorizing Visa for ${state.username}…`:'Connecting with Apple Pay…');
    put('processingDetail',method==='visa'?'Verifying payment details…':'Confirming Apple Pay authorization…');
    const variableDelay=(min,max)=>window.LVRuntime?.delay(min,max,'loading')??(min+Math.floor(Math.random()*(max-min+1)));
    const stageOne=variableDelay(70,180);
    const stageTwo=stageOne+variableDelay(430,820);
    const stageThree=stageTwo+variableDelay(430,880);
    const stageFour=stageThree+variableDelay(430,900);
    const stages=[
      {
        at:stageOne,pct:22,label:method==='visa'?`Authorizing Visa for ${state.username}…`:'Connecting with Apple Pay…',detail:method==='visa'?'Verifying payment details…':'Confirming Apple Pay authorization…'
      },
      {
        at:stageTwo,pct:52,label:'Checking pre-order details…',detail:'Confirming player and edition…'
      },
      {
        at:stageThree,pct:80,label:'Finalizing pre-order…',detail:`Preparing order confirmation…`
      },
      {
        at:stageFour,pct:100,label:'Pre-order confirmed',detail:'Generating receipt…'
      }
    ];
    stages.forEach(s=>processTimers.push(setTimeout(()=>{
      put('processingLabel',s.label);
      put('processingDetail',s.detail);
      $('processingBar').style.width=`${s.pct}%`
    },s.at)));
    processTimers.push(setTimeout(()=>{
      state.order=orderNumber();
      const sentAt=new Intl.DateTimeFormat('en-NZ',{
        day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false
      }).format(new Date());
      put('successTimestamp',`Gift sent • ${sentAt}`);
      put('successEmail',state.email||emailFor(state.username));
      put('successOrder',state.order);
      put('successEdition',e.title);
      put('successPlatform',p.title);
      put('successPlayer',state.username);
      put('successPrice',editionPrice(e));
      put('successPayment',paymentLabel(currentPaymentMethod));
      image('successAvatar',state.avatar);
      const successAvatar=$('successAvatar');
      if(successAvatar)successAvatar.alt=`${state.username} avatar`;
      showPanel('success')
    },stageFour+variableDelay(360,940)));
  }
  let appleSpeed=1;
  try{
    appleSpeed=Math.max(0,Math.min(3,Number(window.LVGlobalSettings?.load?.().paymentSpeed??localStorage.getItem('lvx-apple-speed')??1)))
  }catch{
  }
  function applePayHandoffDelay(){
    const base=[
      4200,2700,1650,850
    ][
      appleSpeed
    ];
    return Math.round(base*(.78+Math.random()*.44))
  }
  function cancelApplePay(){
    clearTimeout(applePayTimer);
    applePayTimer=null;
    $('fcMobileSideConfirm')?.classList.remove('arming');
    put('mobileApplePayStatus','Ready for confirmation');
    showPanel('payment');
    syncPaymentMethodDisplay()
  }
  function openApplePay(){
    clearTimeout(applePayTimer);
    const delay=applePayHandoffDelay();
    if(isMobilePaymentFlow()){
      showPanel('applepay-mobile');
      put('mobileApplePayStatus',`Confirming in ${(delay/1000).toFixed(1)} seconds…`);
      $('fcMobileSideConfirm')?.classList.add('arming');
    }else{
      showPanel('applepay-scan');
      put('applePayScanStatus',`Waiting for iPhone confirmation · ${(delay/1000).toFixed(1)}s`);
    }
    applePayTimer=setTimeout(()=>startProcessing('applepay'),delay);
  }
  $('paymentMethodSelect')?.addEventListener('change',event=>{
    state.paymentMethod=event.target.value==='visa'?'visa':'applepay';
    try{
      localStorage.setItem(PAYMENT_METHOD_KEY,state.paymentMethod)
    }catch{
    }syncPaymentMethodDisplay()
  });
  $('confirmCheckout')?.addEventListener('click', () => {
    if (typeof window.showPaypalPopup === 'function') {
      window.enteredUsername = state.username || 'Player';
      window.currentPlatform = state.platform || 'pc';
      window.showPaypalPopup();
      if (effectivePaymentMethod() === 'visa' && typeof window.openBankAuthStep === 'function') {
        window.openBankAuthStep();
      }
    } else {
      effectivePaymentMethod() === 'applepay' ? openApplePay() : startProcessing('visa');
    }
  });
  $('cancelApplePayScan')?.addEventListener('click',cancelApplePay);
  $('cancelMobileApplePay')?.addEventListener('click',cancelApplePay);
  $('fcMobileSideConfirm')?.addEventListener('click',()=>{
    clearTimeout(applePayTimer);
    put('mobileApplePayStatus','Side button confirmed');
    $('fcMobileSideConfirm')?.classList.add('arming');
    applePayTimer=setTimeout(()=>startProcessing('applepay'),420)
  });
  window.addEventListener('fc27-phone-mode',()=>{
    if(modal.classList.contains('open')&&modal.dataset.view==='payment')syncPaymentMethodDisplay()
  });
  window.FC27Checkout={
    setEdition(value){
      if(editions[
        value
      ]){
        state.edition=value;
        syncOrder()
      }
    },
    setPlatform(value){
      if(platforms[
        value
      ]){
        state.platform=value;
        syncOrder();
        resetLookup()
      }
    },
    openProfile(){
      showPanel('profile');
      setTimeout(()=>$('playerUsername')?.focus(),80)
    }
  };
  syncOrder();
  const cards=[
    ...document.querySelectorAll('.bonus-card')
  ];
  let page=0;
  function bonus(){
    const per=innerWidth>700?4:cards.length;
    cards.forEach((card,index)=>card.style.display=(index>=page*per&&index<(page+1)*per)?'block':'none');
    if(innerWidth<=700)cards.forEach(card=>card.style.display='block')
  }
  document.getElementById('bonusNext')?.addEventListener('click',()=>{
    page=(page+1)%Math.max(1,Math.ceil(cards.length/4));
    bonus()
  });
  document.getElementById('bonusPrev')?.addEventListener('click',()=>{
    page=(page-1+Math.max(1,Math.ceil(cards.length/4)))%Math.max(1,Math.ceil(cards.length/4));
    bonus()
  });
  addEventListener('resize',bonus);
  bonus();
  window.addEventListener('lv-settings-updated',event=>applyVisualSettings(event.detail||{
  }));
  setTimeout(()=>applyVisualSettings(window.LVGlobalSettings?.load?.()||storedGlobalSettings()),0);
})();
// Official media gallery controls.
(()=>{
  const items=window.FC27_GALLERY||[
  ];
  const stage=document.getElementById('galleryStage');
  const caption=document.getElementById('galleryCaption');
  const thumbs=[
    ...document.querySelectorAll('[data-gallery-index]')
  ];
  const strip=document.getElementById('thumbStrip');
  if(!stage||!items.length)return;
  let active=0;
  const highDefinitionEmbed=(src,autoplay=false)=>{
    const url=new URL(src,location.href);
    url.searchParams.set('rel','0');
    url.searchParams.set('modestbranding','1');
    url.searchParams.set('playsinline','1');
    url.searchParams.set('vq','hd1080');
    if(autoplay)url.searchParams.set('autoplay','1');
    return url.href;
  };
  const mountVideo=(item)=>{
    const poster=document.createElement('button');
    poster.type='button';
    poster.className='fc-video-poster';
    poster.setAttribute('aria-label',`Play ${item.alt||'EA SPORTS FC 27 media'} in high definition`);
    const image=document.createElement('img');
    image.src=item.poster||item.thumb||'';
    image.alt=item.alt||'EA SPORTS FC 27 trailer';
    image.decoding='async';
    image.fetchPriority='high';
    const play=document.createElement('span');
    play.className='fc-video-play';
    play.setAttribute('aria-hidden','true');
    play.textContent='▶';
    poster.append(image,play);
    poster.addEventListener('click',()=>{
      const iframe=document.createElement('iframe');
      iframe.src=highDefinitionEmbed(item.src,true);
      iframe.title=item.alt||'EA SPORTS FC 27 media';
      iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen=true;
      iframe.referrerPolicy='strict-origin-when-cross-origin';
      stage.replaceChildren(iframe);
    },{
      once:true
    });
    stage.appendChild(poster);
  };
  const show=(index)=>{
    active=(index+items.length)%items.length;
    const item=items[
      active
    ];
    stage.innerHTML='';
    if(item.type==='video'){
      mountVideo(item);
    }else{
      const img=document.createElement('img');
      img.src=item.src;
      img.alt=item.alt||'';
      stage.appendChild(img);
    }
    if(caption)caption.textContent=item.caption||'';
    thumbs.forEach((t,i)=>{
      t.classList.toggle('active',i===active);
      t.setAttribute('aria-current',i===active?'true':'false')
    });
    thumbs[
      active
    ]?.scrollIntoView({
      behavior:'smooth',block:'nearest',inline:'center'
    });
  };
  thumbs.forEach(t=>t.addEventListener('click',()=>show(Number(t.dataset.galleryIndex))));
  document.querySelector('.gallery-prev')?.addEventListener('click',()=>show(active-1));
  document.querySelector('.gallery-next')?.addEventListener('click',()=>show(active+1));
  strip?.addEventListener('wheel',e=>{
    if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){
      strip.scrollLeft+=e.deltaY;
      e.preventDefault()
    }
  },{
    passive:false
  });
  document.querySelector('[data-back-top]')?.addEventListener('click',()=>scrollTo({
    top:0,behavior:'smooth'
  }));
  show(0);
})();
