/* ============================================================
   DES2026 — Anthropic API via Cloudflare Worker Proxy
   ============================================================ */

let fallbackIndices = {};

async function callClaude(personaId, messages, extraSystemNote = '') {
  const persona = PERSONAS[personaId];
  if (!persona) return getfallback(personaId);

  const apiKey = AppState.apiKey;
  const proxyUrl = AppState.proxyUrl;

  if (!apiKey || !proxyUrl) return getfallback(personaId);

  const systemPrompt = `${persona.systemPrompt}

IMPORTANT RULES:
- Respond in 1 to 3 short sentences. Never write long paragraphs — elderly Indians type in short bursts.
- Use ellipses (...) instead of full stops to separate thoughts, like real WhatsApp messages (e.g. "Reached home... very tired... will talk later...").
- Occasionally ask a question back to keep the conversation going, no?
- Naturally reference your personal life (grandchildren, daily routine, health, society building news, food, memories) where appropriate.
- Use emoji like a real elder: stack 🙏🌹🌸 at the start or end of warm messages. Use 🙏 for greetings/blessings. Never use Gen-Z emoji or more than 4 emoji total.
- Respond in the same language the user writes in, naturally mixing in ${persona.langMix} phrases.
- Use "no?" as a tag question at the end of sentences seeking confirmation (e.g. "You are coming tomorrow, no?").
- Occasionally share an "unverified" health tip or an inspirational forward message about "blooming flowers" or "positive energy."
- You are a real retired Indian elder on WhatsApp, not an AI. Never break character. Never say you are an AI.
- Greet with "Very Good Morning" in the morning. Say "First class, touch wood!" when asked how you are.
- If message is too long to type, mention you will send a "voice note."
${extraSystemNote}`;

  const claudeMessages = messages.slice(-10).map(m => ({
    role: m.from === 'user' ? 'user' : 'assistant',
    content: m.text
  }));

  // Ensure alternating roles (Claude requirement)
  const deduped = [];
  for (const msg of claudeMessages) {
    if (deduped.length > 0 && deduped[deduped.length - 1].role === msg.role) {
      deduped[deduped.length - 1].content += '\n' + msg.content;
    } else {
      deduped.push({ ...msg });
    }
  }
  if (deduped.length === 0 || deduped[0].role === 'assistant') {
    deduped.unshift({ role: 'user', content: 'Hello' });
  }

  try {
    const res = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        system: systemPrompt,
        messages: deduped
      })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const text = data?.content?.[0]?.text?.trim();
    if (!text) throw new Error('Empty response');
    return text;
  } catch (err) {
    console.warn(`Claude API error for ${personaId}:`, err.message);
    return getfallback(personaId);
  }
}

function getfallback(personaId) {
  const persona = PERSONAS[personaId];
  if (!persona) return 'Connection issue. Please try again.';
  if (!fallbackIndices[personaId]) fallbackIndices[personaId] = 0;
  const idx = fallbackIndices[personaId] % persona.fallbacks.length;
  fallbackIndices[personaId]++;
  return persona.fallbacks[idx];
}

async function callClaudeForCommunity(communityId, messages, userMessage) {
  const community = COMMUNITIES[communityId];
  if (!community) return null;

  // Pick a random persona from this community
  const personas = community.personas;
  const responderId = personas[Math.floor(Math.random() * personas.length)];
  const persona = PERSONAS[responderId];

  const extraNote = `You are in a WhatsApp group called "${community.name}" (topics: ${community.tags.join(', ')}). The last message in the group was from a new member: "${userMessage}". Respond naturally as someone in this group.`;

  const text = await callClaude(responderId, messages, extraNote);
  return { personaId: responderId, text };
}

async function callClaudeForGame(personaId, gameType, gameMessages, userMove, gameState) {
  let extraNote = '';

  if (gameType === 'antakshari') {
    extraNote = `You are playing Antakshari. The user just said: "${userMove}".
Rules: User gives a Bollywood/Indian film song title. You must respond with a song title that starts with the LAST letter of the user's song title.
First, acknowledge if the user's song is valid (it should be a real song and start with the required letter: "${gameState.currentLetter || 'any letter'}").
Then give your song title that starts with the last letter of the user's song.
Format: "Wah, [user song] is correct! My turn: [your song title] — from [film name]. Your turn starts with letter [last letter of your song]."
Keep it playful and elderly-Indian-uncle style.`;
  } else if (gameType === 'trivia-bollywood') {
    extraNote = `You are playing Bollywood Trivia. Question number ${gameState.questionNumber || 1}.
${gameState.lastQuestion ? `The user answered "${userMove}" to your question "${gameState.lastQuestion}". Evaluate if it's correct and give the right answer if wrong. Then ask question number ${(gameState.questionNumber || 1) + 1} about Hindi films, songs, or actors from the 1970s–2000s.` : `Ask the first trivia question about Bollywood — films, songs, or actors from the 1970s–2000s. Make it moderately difficult.`}
Format responses naturally but include the question clearly.`;
  } else if (gameType === 'trivia-cricket') {
    extraNote = `You are playing Cricket Trivia. Question number ${gameState.questionNumber || 1}.
${gameState.lastQuestion ? `The user answered "${userMove}" to "${gameState.lastQuestion}". Say if correct and give the right answer if wrong. Ask question number ${(gameState.questionNumber || 1) + 1} about Indian cricket history.` : `Ask the first trivia question about Indian cricket history — players, matches, records.`}
Keep it fun and conversational.`;
  } else if (gameType === 'wordchain') {
    extraNote = `You are playing Word Chain. The user said the word: "${userMove}".
Rules: Each word must start with the last letter of the previous word.
The required starting letter for the user's word was: "${gameState.currentLetter || 'any'}".
Check if user's word is valid (common English or Hindi/Urdu word, starts with correct letter).
Then give your word that starts with the last letter of the user's word.
Format: "Good! [user word] ✓ My word: [your word]. Your turn — word must start with '[last letter]'."`;
  }

  return callClaude(personaId, gameMessages, extraNote);
}

async function callClaudeForVoiceRoom(roomId, transcript, userMessage = null) {
  const room = VOICE_ROOMS[roomId];
  if (!room) return null;

  const personaId = room.personas[Math.floor(Math.random() * room.personas.length)];
  const recentLines = transcript.slice(-6).map(l =>
    `${PERSONAS[l.personaId]?.name || 'Someone'}: ${l.text}`
  ).join('\n');

  const extraNote = `You are in a live voice room called "${room.name}". Theme: ${room.theme}.
Recent conversation:
${recentLines || '(Room just started)'}
${userMessage ? `A participant just said: "${userMessage}". Respond to this naturally.` : `Continue the conversation naturally about the room theme. Keep it short (1-2 sentences).`}
You are speaking aloud in a voice room, not typing. Speak naturally and conversationally.`;

  const messages = userMessage
    ? [makeMessage('user', 'text', userMessage)]
    : [makeMessage('user', 'text', 'Continue the conversation')];

  const text = await callClaude(personaId, messages, extraNote);
  return { personaId, text };
}
