(()=>{
  if(window.__cashSourceKeyboard)return;
  window.__cashSourceKeyboard=true;
  let active=null,shift=true,numbers=false,audio=null,settleTimer=null,hideTimer=null;
  const letters=[
    ...'qwertyuiop'
  ],middle=[
    ...'asdfghjkl'
  ],bottom=[
    ...'zxcvbnm'
  ];
  const symbols=[
    ...'1234567890'
  ],symbolsMid=[
    ...'-/:;()$&@"'
  ],symbolsBottom=[
    ...".,?!'"
  ];
  const eligible=input=>input instanceof HTMLInputElement&&!input.disabled&&!input.readOnly&&![
    'password','checkbox','radio','file','range','color'
  ].includes(input.type)&&(input.closest('.fc-phone-screen,.iphone-screen')||matchMedia('(max-width:700px)').matches&&(input.closest('.lvx-checkout')||input.dataset.cashKeyboard==='true'));
  const sound=()=>{
    try{
      audio=audio||new Audio('/cash-keyboard-click.mp3');
      audio.currentTime=0;
      audio.volume=.72;
      audio.play().catch(()=>{
      })
    }catch{
    }
  };
  const emit=()=>{
    if(!active)return;
    active.dispatchEvent(new Event('input',{
      bubbles:true
    }));
    active.dispatchEvent(new Event('change',{
      bubbles:true
    }))
  };
  const type=value=>{
    if(!active)return;
    const start=active.selectionStart??active.value.length,end=active.selectionEnd??start;
    active.value=active.value.slice(0,start)+value+active.value.slice(end);
    const pos=start+value.length;
    try{
      active.setSelectionRange(pos,pos)
    }catch{
    }emit();
    if(shift&&!numbers){
      shift=false;
      render()
    }
  };
  const remove=()=>{
    if(!active)return;
    const start=active.selectionStart??active.value.length,end=active.selectionEnd??start;
    if(start!==end){
      active.value=active.value.slice(0,start)+active.value.slice(end);
      try{
        active.setSelectionRange(start,start)
      }catch{
      }
    }else if(start>0){
      active.value=active.value.slice(0,start-1)+active.value.slice(end);
      try{
        active.setSelectionRange(start-1,start-1)
      }catch{
      }
    }emit()
  };
  const icon=name=>name==='shift'?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 11 7-7 7 7h-4v8H9v-8H5Z"/></svg>':'<svg viewBox="0 0 28 22" aria-hidden="true"><path d="M10 3h14v16H10L2 11l8-8Z"/><path d="m14 8 6 6m0-6-6 6"/></svg>';
  const key=(label,action,cls='',popup=true,dataKey=label)=>{
    const b=document.createElement('button');
    b.type='button';
    b.className=`cash-kb-key ${cls}`;
    b.dataset.key=String(dataKey).toLowerCase();
    if(label==='⇧'){
      b.innerHTML=icon('shift');
      b.setAttribute('aria-label','Shift')
    }else if(label==='⌫'){
      b.innerHTML=icon('backspace');
      b.setAttribute('aria-label','Backspace')
    }else b.textContent=label;
    b.addEventListener('pointerdown',e=>{
      e.preventDefault();
      sound();
      b.classList.add('pressed');
      if(popup){
        const p=document.createElement('span');
        p.className='cash-kb-popup';
        p.textContent=label;
        b.appendChild(p)
      }action();
      setTimeout(()=>{
        b.classList.remove('pressed');
        b.querySelector('.cash-kb-popup')?.remove()
      },140)
    });
    return b
  };
  const row=(items,cls='')=>{
    const r=document.createElement('div');
    r.className=`cash-kb-row ${cls}`;
    items.forEach(char=>r.appendChild(key(shift&&!numbers?char.toUpperCase():char,()=>type(shift&&!numbers?char.toUpperCase():char))));
    return r
  };
  const keyboard=document.createElement('div');
  keyboard.className='cash-source-keyboard';
  keyboard.setAttribute('aria-label','Cash App on-screen keyboard');
  function render(){
    keyboard.innerHTML='';
    const tools=document.createElement('div');
    tools.className='cash-kb-tools';
    const dismiss=document.createElement('button');
    dismiss.type='button';
    dismiss.className='cash-kb-dismiss';
    dismiss.textContent='⌨';
    dismiss.setAttribute('aria-label','Hide keyboard');
    dismiss.addEventListener('pointerdown',e=>{
      e.preventDefault();
      close()
    });
    tools.appendChild(dismiss);
    keyboard.appendChild(tools);
    keyboard.appendChild(row(numbers?symbols:letters));
    keyboard.appendChild(row(numbers?symbolsMid:middle,'row-two'));
    const third=document.createElement('div');
    third.className='cash-kb-row';
    third.appendChild(key(numbers?'#+=':'⇧',()=>{
      if(!numbers){
        shift=!shift;
        render()
      }
    },'special',false));
    third.appendChild(document.createElement('span'));
    third.lastChild.style.flex='.35';
    (numbers?symbolsBottom:bottom).forEach(char=>third.appendChild(key(shift&&!numbers?char.toUpperCase():char,()=>type(shift&&!numbers?char.toUpperCase():char))));
    third.appendChild(document.createElement('span'));
    third.lastChild.style.flex='.35';
    third.appendChild(key('⌫',remove,'special',false));
    keyboard.appendChild(third);
    const last=document.createElement('div');
    last.className='cash-kb-row';
    last.appendChild(key(numbers?'ABC':'123',()=>{
      numbers=!numbers;
      shift=false;
      render()
    },'special',false));
    last.appendChild(key('space',()=>type(' '),'space',false));
    last.appendChild(key('return',()=>{
      active?.dispatchEvent(new KeyboardEvent('keydown',{
        key:'Enter',bubbles:true
      }));
      close()
    },'return',false));
    keyboard.appendChild(last);
    const home=document.createElement('div');
    home.className='cash-kb-home';
    keyboard.appendChild(home)
  }
  function open(input){
    if(!eligible(input))return;
    clearTimeout(settleTimer);
    clearTimeout(hideTimer);
    active=input;
    input.setAttribute('inputmode','none');
    input.setAttribute('autocomplete','off');
    const host=input.closest('.fc-phone-screen,.iphone-screen');
    if(host){
      keyboard.classList.add('inside-phone');
      if(keyboard.parentElement!==host)host.appendChild(keyboard);
      host.classList.add('cash-keyboard-open')
    }else{
      keyboard.classList.remove('inside-phone');
      if(keyboard.parentElement!==document.body)document.body.appendChild(keyboard);
      document.documentElement.classList.add('cash-keyboard-open')
    }render();
    keyboard.style.display='block';
    requestAnimationFrame(()=>keyboard.classList.add('visible'))
  }
  function close(){
    keyboard.classList.remove('visible');
    const previous=active;
    active=null;
    clearTimeout(settleTimer);
    clearTimeout(hideTimer);
    settleTimer=setTimeout(()=>{
      document.documentElement.classList.remove('cash-keyboard-open');
      document.querySelectorAll('.cash-keyboard-open').forEach(n=>n.classList.remove('cash-keyboard-open'));
      previous?.blur()
    },200);
    hideTimer=setTimeout(()=>{
      if(!keyboard.classList.contains('visible'))keyboard.style.display='none'
    },280)
  }
  const flash=token=>{
    const button=[
      ...keyboard.querySelectorAll('.cash-kb-key')
    ].find(item=>item.dataset.key===String(token).toLowerCase());
    if(!button)return;
    button.classList.remove('pressed');
    void button.offsetWidth;
    button.classList.add('pressed');
    setTimeout(()=>button.classList.remove('pressed'),140)
  };
  document.addEventListener('focusin',e=>{
    if(eligible(e.target))open(e.target)
  });
  document.addEventListener('pointerdown',e=>{
    if(active&&!keyboard.contains(e.target)&&e.target!==active&&!e.target.closest('.cash-kb-key')){
      const next=e.target.closest('input');
      if(!eligible(next))close()
    }
  },true);
  document.addEventListener('keydown',e=>{
    if(!active)return;
    if(e.key==='Escape'){
      close();
      return
    }if(e.ctrlKey||e.metaKey||e.altKey)return;
    if(e.key==='Backspace'){
      e.preventDefault();
      sound();
      remove();
      flash('⌫');
      return
    }if(e.key==='Enter'){
      e.preventDefault();
      sound();
      flash('return');
      active.dispatchEvent(new KeyboardEvent('keydown',{
        key:'Enter',bubbles:true
      }));
      close();
      return
    }if(e.key===' '){
      e.preventDefault();
      sound();
      type(' ');
      flash('space');
      return
    }if(e.key.length===1){
      e.preventDefault();
      sound();
      type(e.key);
      flash(e.key)
    }
  });
})();
