/* ============================================================
   DES2026 — Settings sheet: font size, name, researcher mode
   ============================================================ */

/* ── SETTINGS ── */
function applyFontSize(){
  const app=document.getElementById('app');
  if(!app)return;
  app.classList.remove('fs-large','fs-xlarge');
  if(S.fontSize==='large') app.classList.add('fs-large');
  else if(S.fontSize==='xlarge') app.classList.add('fs-xlarge');
}

function showSettings(){
  const sizes=[
    {id:'normal',label:'A',desc:'Normal'},
    {id:'large',label:'A',desc:'Large',big:true},
    {id:'xlarge',label:'A',desc:'Extra Large',bigger:true},
  ];
  const bk=sheet(`
    <div class="bottom-sheet__handle"></div>
    <div class="bottom-sheet__title">Settings</div>
    <div class="settings-section-label">Text Size</div>
    <div class="settings-font-row" id="fs-row">
      ${sizes.map(s=>`
        <button class="settings-font-btn${S.fontSize===s.id?' active':''}" onclick="setFontSize('${s.id}')" id="fs-${s.id}">
          <span style="font-size:${s.bigger?'22px':s.big?'18px':'15px'};font-weight:700;line-height:1;">${s.label}</span>
          <span style="font-size:11px;color:#667781;margin-top:3px;">${s.desc}</span>
        </button>`).join('')}
    </div>
    <div class="settings-section-label" style="margin-top:16px;">Account</div>
    <div class="settings-row" onclick="showChangeNameSheet()">
      <i data-lucide="user" style="width:20px;height:20px;color:#54656f;flex-shrink:0;"></i>
      <div class="settings-row__body">
        <div class="settings-row__label">Your name</div>
        <div class="settings-row__value">${S.userName||'Not set'}</div>
      </div>
      <i data-lucide="chevron-right" style="width:18px;height:18px;color:#b0bec5;"></i>
    </div>
    <div class="settings-row" onclick="showResearcherDialog();this.closest('.bottom-sheet-backdrop').remove()">
      <i data-lucide="eye" style="width:20px;height:20px;color:#54656f;flex-shrink:0;"></i>
      <div class="settings-row__body">
        <div class="settings-row__label">Researcher Mode</div>
        <div class="settings-row__value">${S.researcherMode?'On':'Off'}</div>
      </div>
      <i data-lucide="chevron-right" style="width:18px;height:18px;color:#b0bec5;"></i>
    </div>
    <div style="height:16px;"></div>
  `);
  lucide.createIcons();
}

function setFontSize(size){
  set({fontSize:size});
  applyFontSize();
  document.querySelectorAll('.settings-font-btn').forEach(b=>b.classList.remove('active'));
  const btn=document.getElementById('fs-'+size);
  if(btn)btn.classList.add('active');
}

function showChangeNameSheet(){
  const bk=sheet(`
    <div class="bottom-sheet__handle"></div>
    <div class="bottom-sheet__title">Change Your Name</div>
    <input class="name-prompt-screen__input" id="cn-input" type="text" value="${S.userName||''}" placeholder="Your name" autocapitalize="words" maxlength="40" style="margin:8px 0 16px;font-size:16px;text-align:left;border-radius:10px;" />
    <button class="onboarding-screen__cta" id="cn-save" style="margin-top:0;">Save</button>
  `);
  const inp=$('cn-input');
  $('cn-save').onclick=()=>{const v=inp.value.trim();if(!v)return;set({userName:v});closeSheet(bk);toast('Name updated');render();};
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){const v=inp.value.trim();if(v){set({userName:v});closeSheet(bk);toast('Name updated');render();}}});
  setTimeout(()=>inp.focus(),200);
}
