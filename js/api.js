/* ============================================================
   DES2026 — Claude API calls and async utilities
   ============================================================ */

/* ── API ── */
let _fallbackIdx={};
async function claude(personaId, messages, extraNote='', imageUrl=''){
  const p=PERSONAS[personaId]; if(!p) return fallback(personaId);
  const proxyUrl = S.proxyUrl || DEFAULT_PROXY;
  const userAge=S.userAge||60;
  const userRef=S.userName
    ?`The person you are chatting with is named ${S.userName}${userAge?`, and they are ${userAge} years old`:''}.${userAge&&userAge>=55?' They are a fellow senior — treat them as a peer or elder, never as a youngster. Do not use terms like "beta" or "dear child" with them.':''} Use their name naturally sometimes.`
    :'';
  const sys=`${p.system}
${userRef}
RULES:
- You are chatting on WhatsApp. Never break character or reveal you are AI.
- Reply as you would naturally type — sometimes a brief reaction ("Aiyyo!" / "Wah!"), sometimes a memory, sometimes just a plain statement. Vary the length freely.
- Do NOT follow a formula. You don't need to ask a question back every time. You don't need emoji. You don't need advice. Just respond to what was actually said.
- Pick up on specific words and details the user mentioned — show you were listening, not just waiting to talk.
- Ground your replies in your actual daily life ("Was just back from my walk when I saw this", "Making rasam and thinking the same thing...").
- Use emoji only when it genuinely fits — never as punctuation or to signal warmth you should express through words.
- Respond in the same language the user writes in, mixing in your natural language phrases.
- Your voice should be distinctly yours — not generic WhatsApp elder.
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
  // Attach image to the last user message if provided
  if(imageUrl){
    const last=deduped[deduped.length-1];
    if(last.role==='user'){
      let imgSrc;
      if(imageUrl.startsWith('data:')){
        const [meta,data]=imageUrl.split(',');
        const mediaType=meta.match(/data:([^;]+)/)[1]||'image/jpeg';
        imgSrc={type:'base64',media_type:mediaType,data};
      } else {
        imgSrc={type:'url',url:imageUrl};
      }
      last.content=[{type:'image',source:imgSrc},{type:'text',text:typeof last.content==='string'?last.content:''}];
    }
  }
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
