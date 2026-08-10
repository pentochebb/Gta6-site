// Shared visual navigation — bottom-right return control.
(() => {
  if (document.getElementById('lvBackToVisuals')) return;
  const style = document.createElement('style');
  style.id = 'lvBackToVisualsStyle';
  style.textContent = `
    #lvBackToVisuals{
      position:fixed!important;
      right:18px!important;
      bottom:18px!important;
      z-index:2147483647!important;
      display:inline-flex!important;
      align-items:center!important;
      justify-content:center!important;
      gap:0!important;
      width:44px!important;
      min-width:44px!important;
      max-width:calc(100vw - 24px)!important;
      min-height:44px!important;
      padding:0!important;
      overflow:hidden!important;
      border:1px solid rgba(255,255,255,.16)!important;
      border-radius:14px!important;
      background:rgba(8,9,13,.92)!important;
      color:#fff!important;
      text-decoration:none!important;
      font:800 11px/1 Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
      letter-spacing:.09em!important;
      text-transform:uppercase!important;
      white-space:nowrap!important;
      box-shadow:0 12px 36px rgba(0,0,0,.46),0 0 30px rgba(93,119,255,.12),inset 0 1px rgba(255,255,255,.08)!important;
      -webkit-backdrop-filter:blur(10px)!important;
      backdrop-filter:blur(10px)!important;
      cursor:pointer!important;
      opacity:1!important;
      transform:none!important;
      transition:width .28s cubic-bezier(.2,.8,.2,1),padding .28s cubic-bezier(.2,.8,.2,1),gap .28s ease,transform .2s ease,border-color .2s ease,box-shadow .2s ease!important;
    }
    #lvBackToVisuals::before{
      content:"";
      position:absolute;
      inset:-1px;
      border-radius:inherit;
      pointer-events:none;
      background:linear-gradient(110deg,transparent 18%,rgba(255,255,255,.10) 39%,rgba(95,151,255,.15) 50%,transparent 72%);
      background-size:220% 100%;
      animation:lvBackSweep 5s linear infinite;
      opacity:.72;
    }
    #lvBackToVisuals > *{position:relative;z-index:1}
    #lvBackToVisuals:hover{
      width:156px!important;
      padding:0 14px!important;
      gap:9px!important;
      transform:translateY(-2px)!important;
      border-color:rgba(110,151,255,.44)!important;
      box-shadow:0 16px 44px rgba(0,0,0,.52),0 0 38px rgba(85,139,255,.22),inset 0 1px rgba(255,255,255,.1)!important;
    }
    #lvBackToVisuals svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    #lvBackToVisuals span{
      display:block!important;
      max-width:0!important;
      overflow:hidden!important;
      opacity:0!important;
      transform:translateX(8px)!important;
      transition:max-width .28s cubic-bezier(.2,.8,.2,1),opacity .16s ease .04s,transform .28s cubic-bezier(.2,.8,.2,1)!important;
    }
    #lvBackToVisuals:hover span,#lvBackToVisuals:focus-visible span{
      max-width:112px!important;
      opacity:1!important;
      transform:none!important;
    }
    #lvBackToVisuals:focus-visible{width:156px!important;padding:0 14px!important;gap:9px!important;outline:2px solid rgba(104,164,255,.8)!important;outline-offset:3px!important}
    @keyframes lvBackSweep{0%{background-position:180% 0}100%{background-position:-80% 0}}
    @media(max-width:640px){#lvBackToVisuals{right:12px!important;bottom:12px!important;width:42px!important;min-width:42px!important;min-height:42px!important;padding:0!important}#lvBackToVisuals:hover,#lvBackToVisuals:focus-visible{width:148px!important;padding:0 12px!important}}
  `;
  document.head.appendChild(style);
  const link = document.createElement('a');
  link.id = 'lvBackToVisuals';
  link.href = '../index.html';
  link.setAttribute('aria-label', 'Back to MVP Visuals');
  link.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18 9 12l6-6"></path></svg>
    <span>Back to Visuals</span>
  `;
  document.body.appendChild(link);
  if (link.animate) {
    link.animate([
      {
         opacity: 0, transform: 'translateY(16px) scale(.96)' 
      },
      {
         opacity: 1, transform: 'translateY(0) scale(1)' 
      }
    ], {
       duration: 520, delay: 240, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' 
    });
  }
})();
