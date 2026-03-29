/* ============================================================
   DES2026 — Setup, onboarding, and name prompt screens
   ============================================================ */

/* ── SETUP SCREEN ── */
function renderSetup(){
  mount(`<div class="setup-screen">
    <div class="setup-screen__logo"><svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="17" r="8" fill="#25D366"/><path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#25D366" stroke-width="3" stroke-linecap="round"/><path d="M4 30l-3 6 6-2" fill="#25D366"/></svg></div>
    <div class="setup-screen__title">DES2026 Researcher Setup</div>
    <div class="setup-screen__subtitle">Enter your credentials to enable AI responses.</div>
    <form class="setup-screen__form" onsubmit="doSetup(event)">
      <div class="setup-screen__field">
        <label class="setup-screen__label">Anthropic API Key</label>
        <div class="setup-screen__input-wrap">
          <input class="setup-screen__input" id="s-key" type="password" placeholder="sk-ant-..." autocomplete="off"/>
          <button type="button" class="setup-screen__toggle" onclick="toggleKeyVis()" id="s-eye">${IC.eye}</button>
        </div>
      </div>
      <div class="setup-screen__field">
        <label class="setup-screen__label">Cloudflare Worker URL (handles API requests)</label>
        <div class="setup-screen__input-wrap">
          <input class="setup-screen__input" id="s-proxy" type="text" placeholder="https://your-worker.workers.dev"/>
        </div>
        <div class="setup-screen__hint">See index.html comments for the 10-line Worker code.</div>
      </div>
      <button type="submit" class="setup-screen__btn" id="s-submit" disabled>Continue →</button>
    </form>
    <div class="setup-screen__note">Keys stored locally only. This screen won't appear again.</div>
  </div>`);
  $('s-key').oninput=$('s-proxy').oninput=()=>{$('s-submit').disabled=!($('s-key').value.trim()&&$('s-proxy').value.trim());};
}
function toggleKeyVis(){const i=$('s-key');i.type=i.type==='password'?'text':'password';$('s-eye').innerHTML=i.type==='password'?IC.eye:IC.eyeOff;}
function doSetup(e){e.preventDefault();const k=$('s-key').value.trim(),p=$('s-proxy').value.trim();if(!k||!p)return;set({apiKey:k,proxyUrl:p});if(S.onboardingDone)navigate('#/chats');else navigate('#/onboarding');}

/* ── ONBOARDING ── */
function renderOnboarding(){
  mount(`
    <div class="onboarding-header">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="40" fill="#25D366"/><path d="M40 18c-12.15 0-22 9.85-22 22 0 3.9 1.02 7.56 2.8 10.73L18 62l11.6-2.72A21.9 21.9 0 0 0 40 62c12.15 0 22-9.85 22-22S52.15 18 40 18zm0 4c9.94 0 18 8.06 18 18s-8.06 18-18 18c-3.2 0-6.2-.84-8.8-2.3l-.63-.37-6.55 1.54 1.58-6.38-.4-.66A17.93 17.93 0 0 1 22 40c0-9.94 8.06-18 18-18zm-5.5 9.5c-.39 0-1.02.15-1.55.73-.53.58-2.02 1.97-2.02 4.8 0 2.83 2.07 5.57 2.36 5.96.29.39 4.02 6.39 9.88 8.72 1.38.57 2.46.9 3.3 1.16 1.39.42 2.66.36 3.66.22 1.12-.16 3.44-1.41 3.93-2.77.49-1.36.49-2.52.34-2.77-.15-.25-.54-.39-1.13-.68-.59-.29-3.44-1.7-3.97-1.89-.53-.2-.92-.29-1.31.29-.39.59-1.5 1.89-1.84 2.27-.34.38-.68.44-1.27.15-.59-.29-2.5-.92-4.76-2.94-1.76-1.57-2.95-3.51-3.29-4.1-.34-.59-.04-.9.26-1.2.26-.26.59-.68.88-1.02.29-.34.39-.59.59-.98.19-.39.1-.73-.05-1.02-.15-.29-1.31-3.16-1.8-4.33-.47-1.14-.95-1-.31-1.02z" fill="white"/></svg>
      <div class="onboarding-header__title">WhatsApp</div>
    </div>
    <div class="onboarding-screen">
      <div>
        <div class="onboarding-screen__heading">What are you interested in?</div>
        <div class="onboarding-screen__subheading">Select topics to find communities and start chatting.</div>
      </div>
      <div class="interest-grid" id="ig"></div>
      <button class="onboarding-screen__cta" id="ob-cta" disabled>Continue</button>
    </div>
  `);
  const interests=[{id:'cooking',l:'Cooking',e:'pot'},{id:'cricket',l:'Cricket',e:'cricket'},{id:'music',l:'Music',e:'music'},{id:'gardening',l:'Gardening',e:'seedling'},{id:'literature',l:'Literature',e:'books'},{id:'spirituality',l:'Spirituality',e:'prayer'}];
  const sel=new Set();
  const grid=$('ig');
  interests.forEach(({id,l,e})=>{
    const t=document.createElement('button');t.className='interest-tile';
    t.innerHTML=`<span class="interest-tile__emoji">${ej(e,'32px')}</span><span class="interest-tile__label">${l}</span>`;
    t.onclick=()=>{sel.has(id)?(sel.delete(id),t.classList.remove('selected')):(sel.add(id),t.classList.add('selected'));$('ob-cta').disabled=!sel.size;};
    grid.appendChild(t);
  });
  $('ob-cta').onclick=()=>{if(!sel.size)return;set({interests:[...sel],onboardingDone:true});seedData([...sel]);navigate('#/chats');};
}

/* ── NAME PROMPT ── */
function renderNamePrompt(){
  mount(`
    <div class="name-prompt-screen">
      <div class="name-prompt-screen__logo">
        <svg width="72" height="72" viewBox="0 0 72 72"><circle cx="36" cy="36" r="36" fill="#00A884"/><path d="M36 16c-11 0-20 9-20 20 0 3.5.93 6.85 2.55 9.74L16 56l10.52-2.47A19.9 19.9 0 0 0 36 56c11 0 20-9 20-20S47 16 36 16zm0 3.6c9 0 16.4 7.3 16.4 16.4S45 52.4 36 52.4c-2.9 0-5.63-.76-7.98-2.1l-.57-.33-5.93 1.4 1.43-5.78-.36-.6A16.3 16.3 0 0 1 19.6 36C19.6 27 27 19.6 36 19.6zm-5 8.6c-.35 0-.92.14-1.4.66-.48.53-1.83 1.79-1.83 4.36s1.88 5.06 2.14 5.41c.26.35 3.65 5.8 8.97 7.92 1.25.52 2.23.82 2.99 1.05 1.26.38 2.41.33 3.32.2 1.02-.15 3.12-1.28 3.57-2.52.44-1.23.44-2.29.31-2.51-.14-.23-.49-.36-1.03-.62-.53-.26-3.12-1.54-3.6-1.72-.48-.18-.83-.26-1.19.26-.35.54-1.36 1.72-1.67 2.07-.31.34-.62.4-1.15.14-.54-.27-2.27-.84-4.32-2.67-1.6-1.43-2.68-3.19-2.99-3.73-.31-.54-.03-.82.23-1.09.24-.24.54-.62.8-.93.26-.31.35-.54.54-.89.17-.35.09-.66-.04-.93-.14-.26-1.19-2.87-1.63-3.93-.43-1.04-.87-.9-1.19-.93z" fill="white"/></svg>
      </div>
      <div class="name-prompt-screen__title">Welcome to DES2026</div>
      <div class="name-prompt-screen__subtitle">What should we call you?</div>
      <div class="lang-picker">
        <button class="lang-tile${S.userLang==='hi'?' active':''}" onclick="pickLang('hi')">
          <span class="lang-tile__label">हिन्दी</span>
          <span class="lang-tile__sub">(Hindi)</span>
        </button>
        <button class="lang-tile${S.userLang==='mr'?' active':''}" onclick="pickLang('mr')">
          <span class="lang-tile__label">मराठी</span>
          <span class="lang-tile__sub">(Marathi)</span>
        </button>
      </div>
      <div class="name-prompt-screen__field-wrap">
        <input class="name-prompt-screen__input" id="np-name" type="text" placeholder="Your name" autocomplete="name" autocapitalize="words" maxlength="40" />
      </div>
      <div class="name-prompt-screen__field-wrap" style="margin-top:12px;">
        <input class="name-prompt-screen__input" id="np-age" type="number" placeholder="Your age" min="1" max="120" style="width:100%;" />
      </div>
      <button class="name-prompt-screen__btn" id="np-go" disabled>Let's go →</button>
      <div class="name-prompt-screen__note">Your name and age are only stored on this device.</div>
    </div>
  `);
  const inp=$('np-name'), age=$('np-age'), btn=$('np-go');
  const validate=()=>{btn.disabled=!inp.value.trim();};
  inp.oninput=validate;
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&inp.value.trim())saveUserName();});
  btn.onclick=saveUserName;
  setTimeout(()=>inp.focus(),300);
}
function pickLang(lang){ S.userLang=lang; saveS(); renderNamePrompt(); }

function saveUserName(){
  const name=$('np-name')?.value?.trim();
  if(!name)return;
  const age=parseInt($('np-age')?.value)||null;
  set({userName:name,userAge:age});
  navigate('#/chats');
}
