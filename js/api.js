/* ============================================================
   DES2026 — Claude API calls and async utilities
   ============================================================ */

/* ── API ── */
let _fallbackIdx={};
async function claude(personaId, messages, extraNote=''){
  const p=PERSONAS[personaId]; if(!p) return fallback(personaId);
  const proxyUrl = S.proxyUrl || DEFAULT_PROXY;
  const userRef=S.userName?`The person you are chatting with is named ${S.userName}. Address them by name naturally sometimes.`:'';
  const sys=`${p.system}
${userRef}
RULES:
- You are chatting on WhatsApp. Never break character or reveal you are AI.
- Respond in 1–3 short messages. Keep it natural and conversational — like a real text exchange.
- Do NOT use a formula. Not every message needs emoji, not every message needs a question, not every message needs a health tip. Vary your responses.
- Use emoji only when it genuinely fits the mood. Some messages have no emoji at all. That is fine.
- Respond in the same language the user writes in, mixing in your natural language phrases.
- Your voice should be distinctly yours — not generic "Indian elder on WhatsApp."
${extraNote}`;
  const msgs=messages.slice(-10).map(m=>({role:m.from==='user'?'user':'assistant',content:m.text||'...'}));
  // Ensure valid alternating structure
  const deduped=[];
  for(const m of msgs){
    if(deduped.length&&deduped[deduped.length-1].role===m.role)
      deduped[deduped.length-1].content+=' '+m.content;
    else deduped.push({...m});
  }
  if(!deduped.length||deduped[0].role==='assistant') deduped.unshift({role:'user',content:'Hello'});
  try{
    const r=await fetch(proxyUrl,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:200,system:sys,messages:deduped})});
    if(!r.ok) throw new Error(r.status);
    const d=await r.json();
    const t=d?.content?.[0]?.text?.trim(); if(!t) throw new Error('empty');
    return t;
  }catch(e){console.warn('API err',e); return fallback(personaId);}
}
function fallback(id){
  const p=PERSONAS[id]; if(!p) return 'Connection issue. Please try again.';
  if(!_fallbackIdx[id])_fallbackIdx[id]=0;
  return p.fallbacks[_fallbackIdx[id]++%p.fallbacks.length];
}

function delay(ms){return new Promise(r=>setTimeout(r,ms));}
