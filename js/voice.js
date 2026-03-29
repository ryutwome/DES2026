/* ============================================================
   DES2026 — Speech recognition and text-to-speech
   ============================================================ */

/* Returns 'mr-IN' when user language is Marathi, otherwise 'hi-IN' */
function voiceLang(){ return (typeof S!=='undefined'&&S.userLang==='mr')?'mr-IN':'hi-IN'; }

/* ── VOICE ── */
let _recog=null, _recActive=false;
function canSTT(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition);}
function canTTS(){return !!window.speechSynthesis;}

function speak(text,onEnd){
  if(!canTTS()) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  const lang=voiceLang();
  u.lang=lang; u.rate=0.9;
  const voices=window.speechSynthesis.getVoices();
  // Prefer exact region match (e.g. hi-IN), fall back to same language prefix (hi), then any Indian/English voice
  const v=voices.find(v=>v.lang===lang)
    ||voices.find(v=>v.lang.startsWith(lang.slice(0,2)))
    ||voices.find(v=>v.lang.includes('IN')||v.name.toLowerCase().includes('india'))
    ||voices.find(v=>v.lang.startsWith('en'));
  if(v) u.voice=v;
  u.onend=onEnd||null;
  window.speechSynthesis.speak(u);
}
function stopSpeak(){if(canTTS())window.speechSynthesis.cancel();}

function startRec({onInterim,onFinal,onError,onEnd}){
  if(!canSTT()){onError?.('unavailable');return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  _recog=new SR(); _recog.lang=voiceLang(); _recog.continuous=false; _recog.interimResults=true;
  _recog.onresult=e=>{
    let interim='',final='';
    for(let i=e.resultIndex;i<e.results.length;i++){
      if(e.results[i].isFinal)final+=e.results[i][0].transcript;
      else interim+=e.results[i][0].transcript;
    }
    if(interim)onInterim?.(interim);
    if(final)onFinal?.(final);
  };
  _recog.onerror=e=>{_recActive=false;onError?.(e.error);};
  _recog.onend=()=>{_recActive=false;onEnd?.();};
  _recog.start(); _recActive=true;
}
function stopRec(){if(_recog&&_recActive){try{_recog.stop();}catch(e){}}_recActive=false;}
