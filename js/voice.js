/* ============================================================
   DES2026 — Voice Input/Output (Web Speech API)
   ============================================================ */

let currentUtterance = null;
let onSpeechResult = null;
let recognition = null;
let isRecognitionActive = false;

/* ---- TTS (speechSynthesis) ---- */
function speak(text, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = STT_LANGUAGE;
  utt.rate = 0.9;
  utt.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  const indian = voices.find(v =>
    v.lang.includes('IN') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('indian')
  );
  const english = voices.find(v => v.lang.startsWith('en'));
  if (indian) utt.voice = indian;
  else if (english) utt.voice = english;

  utt.onend = onEnd || null;
  currentUtterance = utt;
  window.speechSynthesis.speak(utt);
}

function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  currentUtterance = null;
}

function isSpeechSynthesisAvailable() {
  return !!window.speechSynthesis;
}

/* ---- STT (SpeechRecognition) ---- */
function isSpeechRecognitionAvailable() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function startRecognition({ onInterim, onFinal, onError, onEnd }) {
  if (!isSpeechRecognitionAvailable()) { onError?.('unavailable'); return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = STT_LANGUAGE;
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (e) => {
    let interim = '', final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) final += t;
      else interim += t;
    }
    if (interim) onInterim?.(interim);
    if (final) onFinal?.(final);
  };

  recognition.onerror = (e) => {
    isRecognitionActive = false;
    onError?.(e.error);
  };

  recognition.onend = () => {
    isRecognitionActive = false;
    onEnd?.();
  };

  recognition.start();
  isRecognitionActive = true;
}

function stopRecognition() {
  if (recognition && isRecognitionActive) {
    try { recognition.stop(); } catch (_) {}
    isRecognitionActive = false;
  }
}

/* ---- Speaker button component ---- */
function makeSpeakerBtn(text) {
  if (!isSpeechSynthesisAvailable()) return '';
  const btn = document.createElement('button');
  btn.className = 'bubble__speaker';
  btn.setAttribute('aria-label', 'Read aloud');
  btn.innerHTML = Icons.speaker;
  let playing = false;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (playing) {
      stopSpeaking();
      playing = false;
      btn.classList.remove('bubble__speaker--playing');
    } else {
      speak(text, () => {
        playing = false;
        btn.classList.remove('bubble__speaker--playing');
      });
      playing = true;
      btn.classList.add('bubble__speaker--playing');
    }
  });
  return btn;
}
