/* ============================================================
   DES2026 — Speech recognition and text-to-speech
   ============================================================ */

const STT_LANGUAGE = 'en-IN';

/* ── VOICE ── */
let _recog=null, _recActive=false;
function canSTT(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition);}
function canTTS(){return !!window.speechSynthesis;}

function speak(text,onEnd){
  if(!canTTS()) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=STT_LANGUAGE; u.rate=0.9;
  const voices=window.speechSynthesis.getVoices();
  const v=voices.find(v=>v.lang.includes('IN')||v.name.toLowerCase().includes('india'))||voices.find(v=>v.lang.startsWith('en'));
  if(v) u.voice=v;
  u.onend=onEnd||null;
  window.speechSynthesis.speak(u);
}
function stopSpeak(){if(canTTS())window.speechSynthesis.cancel();}

function startRec({onInterim,onFinal,onError,onEnd}){
  if(!canSTT()){onError?.('unavailable');return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  _recog=new SR(); _recog.lang=STT_LANGUAGE; _recog.continuous=false; _recog.interimResults=true;
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
