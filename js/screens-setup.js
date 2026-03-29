/* ============================================================
   DES2026 — Setup, onboarding, and name prompt screens
   ============================================================ */

/* ── SETUP SCREEN (dev-only: visible only when URL contains ?dev=true) ── */
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
function doSetup(e){e.preventDefault();const k=$('s-key').value.trim(),p=$('s-proxy').value.trim();if(!k||!p)return;set({apiKey:k,proxyUrl:p});if(S.onboardingDone)navigate('#/chats');else navigate('#/lang');}

/* ── LANG + NAME — combined first onboarding screen ── */
function renderLangPicker(){
  /* Labels shown in the form fields — updated dynamically when a language is picked */
  const langLabels = {
    hi: { name: 'आपका नाम', namePh: 'अपना नाम लिखें', age: 'आपकी उम्र (वैकल्पिक)', agePh: 'उम्र लिखें' },
    mr: { name: 'तुमचे नाव', namePh: 'नाव लिहा', age: 'तुमचे वय (पर्यायी)', agePh: 'वय लिहा' },
    en: { name: 'Your name', namePh: 'Enter your name', age: 'Your age (optional)', agePh: 'Enter your age' }
  };
  const ll = langLabels[S.userLang] || langLabels.en;
  mount(`
    <div class="lang-pick-screen">
      <div class="lang-pick-screen__logo">
        <svg width="64" height="64" viewBox="0 0 72 72"><circle cx="36" cy="36" r="36" fill="#00A884"/><path d="M36 16c-11 0-20 9-20 20 0 3.5.93 6.85 2.55 9.74L16 56l10.52-2.47A19.9 19.9 0 0 0 36 56c11 0 20-9 20-20S47 16 36 16zm0 3.6c9 0 16.4 7.3 16.4 16.4S45 52.4 36 52.4c-2.9 0-5.63-.76-7.98-2.1l-.57-.33-5.93 1.4 1.43-5.78-.36-.6A16.3 16.3 0 0 1 19.6 36C19.6 27 27 19.6 36 19.6z" fill="white"/></svg>
      </div>
      <div class="lang-pick-screen__heading">
        <span class="lang-pick-screen__hi">अपनी भाषा चुनें</span>
        <span class="lang-pick-screen__sep"> · </span>
        <span class="lang-pick-screen__mr">तुमची भाषा निवडा</span>
      </div>
      <div class="lang-pick-screen__subtext">Choose your language / भाषा निवडा</div>
      <div class="lang-pick-screen__tiles">
        <button class="lang-pick-tile${S.userLang==='hi'?' active':''}" id="lp-hi" onclick="pickLang('hi')">
          <span class="lang-pick-tile__script">हिन्दी</span>
          <span class="lang-pick-tile__eng">Hindi</span>
        </button>
        <button class="lang-pick-tile${S.userLang==='mr'?' active':''}" id="lp-mr" onclick="pickLang('mr')">
          <span class="lang-pick-tile__script">मराठी</span>
          <span class="lang-pick-tile__eng">Marathi</span>
        </button>
        <button class="lang-pick-tile${S.userLang==='en'?' active':''}" id="lp-en" onclick="pickLang('en')">
          <span class="lang-pick-tile__script">English</span>
          <span class="lang-pick-tile__eng">English</span>
        </button>
      </div>
      <div class="lang-pick-screen__name-section">
        <div class="name-prompt-screen__field-wrap">
          <label class="name-prompt-screen__label" for="lp-name">${ll.name}</label>
          <input class="name-prompt-screen__input" id="lp-name" type="text" placeholder="${ll.namePh}" autocomplete="name" autocapitalize="words" maxlength="40" value="${S.userName||''}" />
        </div>
        <div class="name-prompt-screen__field-wrap" style="margin-top:12px;">
          <label class="name-prompt-screen__label" for="lp-age">${ll.age}</label>
          <input class="name-prompt-screen__input" id="lp-age" type="number" placeholder="${ll.agePh}" min="1" max="120" style="width:100%;" value="${S.userAge||''}" />
        </div>
      </div>
      <div class="persona-welcome">
        <img src="./avatars/meenakshiamma.svg" class="persona-welcome__avatar" alt="Meenakshiamma" />
        <div class="persona-welcome__text">Meenakshiamma and 7 others are waiting to meet you!</div>
      </div>
      <button class="lang-pick-screen__cta" id="lp-go" ${(S.userLang&&S.userName)?'':'disabled'}>Continue →</button>
      <div id="lp-hint" style="font-size:0.78rem;color:#E53935;text-align:center;margin-top:6px;min-height:1.2em;"></div>
      <div class="name-prompt-screen__note">Your details are only stored on this device.</div>
    </div>
  `);
  const inp=$('lp-name'), cta=$('lp-go');
  /* Enable Continue only when both language and name are set; show hint for what's missing */
  const validate=()=>{
    const hasLang=!!S.userLang;
    const hasName=!!(inp?.value.trim());
    cta.disabled=!(hasLang&&hasName);
    const hint=document.getElementById('lp-hint');
    if(hint){
      if(!hasLang&&!hasName) hint.textContent='';
      else if(!hasLang) hint.textContent=S.userLang==='hi'?'भाषा चुनें':S.userLang==='mr'?'भाषा निवडा':'Please choose a language';
      else if(!hasName) hint.textContent=S.userLang==='hi'?'कृपया अपना नाम लिखें':S.userLang==='mr'?'कृपया नाव लिहा':'Please enter your name';
      else hint.textContent='';
    }
  };
  inp.oninput=validate;
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&inp.value.trim()&&S.userLang)saveLangName();});
  cta.onclick=saveLangName;
}

/* pickLang: saves language choice, highlights the tile, translates labels, re-validates Continue.
   Called from both the combined screen and legacy route-direct calls. */
function pickLang(lang){
  S.userLang=lang; saveS();
  /* Update tile active states without a full re-render */
  document.querySelectorAll('.lang-pick-tile').forEach(t=>t.classList.remove('active'));
  const tile = lang==='hi'?$('lp-hi'):lang==='mr'?$('lp-mr'):$('lp-en');
  if(tile) tile.classList.add('active');
  /* Translate name/age labels and placeholders to the chosen language */
  const labels = {
    hi: { name: 'आपका नाम', namePh: 'अपना नाम लिखें', age: 'आपकी उम्र (वैकल्पिक)', agePh: 'उम्र लिखें' },
    mr: { name: 'तुमचे नाव', namePh: 'नाव लिहा', age: 'तुमचे वय (पर्यायी)', agePh: 'वय लिहा' },
    en: { name: 'Your name', namePh: 'Enter your name', age: 'Your age (optional)', agePh: 'Enter your age' }
  };
  const l=labels[lang];
  if(l){
    const nameLabel=document.querySelector('label[for="lp-name"]');
    const ageLabel=document.querySelector('label[for="lp-age"]');
    const nameInput=document.getElementById('lp-name');
    const ageInput=document.getElementById('lp-age');
    if(nameLabel) nameLabel.textContent=l.name;
    if(ageLabel) ageLabel.textContent=l.age;
    if(nameInput) nameInput.placeholder=l.namePh;
    if(ageInput) ageInput.placeholder=l.agePh;
  }
  /* Re-validate: need both lang and a name; also update hint text */
  const cta=$('lp-go'), inp=$('lp-name');
  const hasName=!!(inp?.value||'').trim();
  if(cta) cta.disabled=!hasName;
  const hint=document.getElementById('lp-hint');
  if(hint){
    if(!hasName) hint.textContent=lang==='hi'?'कृपया अपना नाम लिखें':lang==='mr'?'कृपया नाव लिहा':'Please enter your name';
    else hint.textContent='';
  }
}

/* saveLangName: persist language + name/age, seed with default interests, go straight to chats */
function saveLangName(){
  const name=($('lp-name')?.value||'').trim();
  if(!name||!S.userLang)return;
  const age=parseInt($('lp-age')?.value)||null;
  set({userName:name,userAge:age,onboardingDone:true});
  seedData(['cooking','cricket','spirituality']);
  navigate('#/chats');
}

/* renderNamePrompt: kept as alias — the combined screen now handles name entry */
function renderNamePrompt(){ renderLangPicker(); }
