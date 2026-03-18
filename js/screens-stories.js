/* ============================================================
   DES2026 — Stories Feed & Story View Screens
   ============================================================ */

function renderStories() {
  const app = getApp();
  app.innerHTML = '';

  const tapCount = { count: 0, timer: null };
  const resBar = renderResearcherBar();
  if (resBar) app.appendChild(resBar);

  const header = renderHeader({
    title: 'Stories',
    tapCount,
    rightButtons: [{ icon: Icons.search, label: 'Search', fn: () => {} }]
  });
  app.appendChild(header);

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.style.position = 'relative';

  const scroll = document.createElement('div');
  scroll.className = 'screen__scroll';
  scroll.style.background = '#F0F2F5';

  const stories = AppState.stories || [];

  if (stories.length === 0) {
    scroll.innerHTML = `<div class="empty-state"><div class="empty-state__icon">📖</div><div class="empty-state__title">No stories yet</div><div class="empty-state__desc">Be the first to share a story with your community.</div></div>`;
  } else {
    stories.forEach(story => {
      scroll.appendChild(renderStoryCard(story));
    });
  }

  screen.appendChild(scroll);

  // FAB
  const fab = document.createElement('button');
  fab.className = 'fab';
  fab.setAttribute('aria-label', 'Share your story');
  fab.innerHTML = Icons.add;
  fab.addEventListener('click', () => showStoryComposeSheet());
  screen.appendChild(fab);

  app.appendChild(screen);
  app.appendChild(renderBottomNav('stories'));
}

function renderStoryCard(story, expanded = false) {
  const isUser = story.authorId === 'user';
  const persona = !isUser && PERSONAS[story.authorId];
  const authorName = story.authorName || (persona ? persona.name : 'You');

  const card = document.createElement('div');
  card.className = 'story-card';

  const header = document.createElement('div');
  header.className = 'story-card__header';
  header.innerHTML = `
    ${renderAvatar(authorName, 'md')}
    <div class="story-card__author-info">
      <div class="story-card__author-name">${authorName}${persona && AppState.researcherMode ? '<span class="ai-badge">AI</span>' : ''}</div>
      <div class="story-card__time">${formatDate(story.timestamp)}</div>
    </div>
  `;

  const textDiv = document.createElement('div');
  textDiv.className = `story-card__text${expanded ? ' expanded' : ''}`;
  textDiv.textContent = story.text;

  const readMoreBtn = document.createElement('button');
  readMoreBtn.className = 'story-card__read-more';
  readMoreBtn.textContent = 'Read more';
  readMoreBtn.addEventListener('click', () => navigate(`#/story/${story.id}`));

  const actions = document.createElement('div');
  actions.className = 'story-card__actions';

  // Speaker button for the story text
  const speakerBtn = makeSpeakerBtn(story.text);
  if (speakerBtn) {
    speakerBtn.style.minWidth = '44px';
    actions.appendChild(speakerBtn);
  }

  if (!isUser) {
    const replyBtn = document.createElement('button');
    replyBtn.className = 'story-card__reply-btn';
    replyBtn.innerHTML = `${Icons.reply} Reply`;
    replyBtn.addEventListener('click', () => {
      // Pre-populate chat with story context then navigate
      const chatMsgs = AppState.chats[story.authorId] || [];
      if (!chatMsgs.some(m => m.storyRef === story.id)) {
        const refMsg = makeMessage(story.authorId, 'text', `[Story] ${story.text.slice(0, 80)}...`);
        refMsg.storyRef = story.id;
        addMessage('chats', story.authorId, refMsg);
        const u = { ...AppState.unreadChats };
        delete u[story.authorId];
        setState({ unreadChats: u });
      }
      navigate(`#/chat/${story.authorId}`);
    });
    actions.appendChild(replyBtn);
  }

  card.appendChild(header);
  card.appendChild(textDiv);
  if (!expanded) card.appendChild(readMoreBtn);
  card.appendChild(actions);

  return card;
}

/* ---- Individual Story View ---- */
function renderStory(storyId) {
  const story = (AppState.stories || []).find(s => s.id === storyId);
  if (!story) { navigate('#/stories'); return; }

  const app = getApp();
  app.innerHTML = '';

  const isUser = story.authorId === 'user';
  const persona = !isUser && PERSONAS[story.authorId];
  const authorName = story.authorName || (persona ? persona.name : 'You');

  const tapCount = { count: 0, timer: null };
  const header = renderHeader({
    title: authorName,
    backFn: goBack,
    avatarName: authorName,
    tapCount
  });
  app.appendChild(header);

  const screen = document.createElement('div');
  screen.className = 'screen';

  const scroll = document.createElement('div');
  scroll.className = 'screen__scroll';
  scroll.style.background = '#F0F2F5';
  scroll.style.padding = '0.75rem';

  scroll.appendChild(renderStoryCard(story, true));

  // Reply thread
  if (story.replies && story.replies.length > 0) {
    const heading = document.createElement('div');
    heading.className = 'section-heading';
    heading.textContent = 'Replies';
    scroll.appendChild(heading);

    story.replies.forEach(reply => {
      scroll.appendChild(renderBubble(reply));
    });
  }

  screen.appendChild(scroll);

  if (!isUser) {
    const inputBar = renderMessageInputBar({
      placeholder: 'Reply to this story...',
      onSend: async ({ type, text }) => {
        const msg = makeMessage('user', type, text);
        const updatedStories = AppState.stories.map(s =>
          s.id === storyId ? { ...s, replies: [...(s.replies || []), msg] } : s
        );
        setState({ stories: updatedStories });
        scroll.appendChild(renderBubble(msg));
        scrollToBottom(scroll);

        // AI responds to story reply
        const typing = renderTypingIndicator();
        scroll.appendChild(typing);
        scrollToBottom(scroll);

        await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
        typing.remove();

        const context = `The user is replying to your story: "${story.text.slice(0, 100)}". Their reply: "${text}". Respond warmly.`;
        const aiText = await callClaude(story.authorId, [msg], context);
        const aiMsg = makeMessage(story.authorId, 'text', aiText);

        const updatedStories2 = AppState.stories.map(s =>
          s.id === storyId ? { ...s, replies: [...(s.replies || []), aiMsg] } : s
        );
        setState({ stories: updatedStories2 });
        scroll.appendChild(renderBubble(aiMsg));
        scrollToBottom(scroll);
      }
    });
    screen.appendChild(inputBar);
  }

  app.appendChild(screen);
}

/* ---- Story Compose Sheet ---- */
function showStoryComposeSheet() {
  const backdrop = document.createElement('div');
  backdrop.className = 'bottom-sheet-backdrop';
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });

  const sheet = document.createElement('div');
  sheet.className = 'bottom-sheet';

  const chips = [
    'Share a recipe memory',
    'Your neighbourhood growing up',
    'A film that changed you',
    'A festival memory'
  ];

  sheet.innerHTML = `
    <div class="bottom-sheet__handle"></div>
    <div class="bottom-sheet__title">Share Your Story</div>
    <div class="compose-chips" id="story-chips"></div>
    <textarea class="compose-textarea" id="story-text" placeholder="What would you like to share?" rows="4"></textarea>
    <div class="compose-actions">
      <button class="compose-mic-btn" id="story-mic" aria-label="Record voice story">${Icons.mic}</button>
      <button class="compose-post-btn" id="story-post" disabled>Post Story</button>
    </div>
  `;

  const chipsDiv = sheet.querySelector('#story-chips');
  chips.forEach(chip => {
    const btn = document.createElement('button');
    btn.className = 'compose-chip';
    btn.textContent = chip;
    btn.addEventListener('click', () => {
      sheet.querySelector('#story-text').value = chip + ': ';
      sheet.querySelector('#story-text').focus();
      sheet.querySelector('#story-post').disabled = false;
    });
    chipsDiv.appendChild(btn);
  });

  const textarea = sheet.querySelector('#story-text');
  const postBtn = sheet.querySelector('#story-post');
  const micBtn = sheet.querySelector('#story-mic');

  textarea.addEventListener('input', () => {
    postBtn.disabled = !textarea.value.trim();
  });

  // Voice input for compose
  let storyRecording = false;
  let storyTranscript = '';

  micBtn.addEventListener('click', () => {
    if (!isSpeechRecognitionAvailable()) {
      showToast('Voice input not available. Please type your story.');
      return;
    }
    if (storyRecording) {
      stopRecognition();
      storyRecording = false;
      micBtn.classList.remove('recording');
      micBtn.innerHTML = Icons.mic;
      return;
    }
    storyRecording = true;
    micBtn.classList.add('recording');
    micBtn.innerHTML = Icons.micOff;
    storyTranscript = '';

    startRecognition({
      onInterim: (t) => { textarea.value = storyTranscript + t; },
      onFinal: (t) => {
        storyTranscript += t + ' ';
        textarea.value = storyTranscript.trim();
        postBtn.disabled = !textarea.value.trim();
      },
      onError: () => {
        storyRecording = false;
        micBtn.classList.remove('recording');
        micBtn.innerHTML = Icons.mic;
      },
      onEnd: () => {
        storyRecording = false;
        micBtn.classList.remove('recording');
        micBtn.innerHTML = Icons.mic;
      }
    });
  });

  postBtn.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) return;

    const story = makeStory('user', 'You', text);
    const stories = [story, ...AppState.stories];
    setState({ stories });
    backdrop.remove();
    showToast('Story shared!');
    renderStories();

    // AI personas react after a short delay
    setTimeout(() => triggerStoryReactions(story), 5000 + Math.random() * 5000);
  });

  backdrop.appendChild(sheet);
  document.getElementById('app').appendChild(backdrop);
}

/* ---- AI reactions to user story ---- */
async function triggerStoryReactions(story) {
  const chatPersonas = Object.keys(AppState.chats).filter(id => PERSONAS[id]);
  const reactors = chatPersonas.length > 0
    ? chatPersonas.slice(0, 2)
    : PERSONA_LIST.slice(0, 2).map(p => p.id);

  for (const personaId of reactors) {
    await new Promise(r => setTimeout(r, 3000 + Math.random() * 4000));
    const context = `React to this story posted by a community member: "${story.text.slice(0, 120)}". Give a warm, brief reaction as if commenting on it.`;
    const text = await callClaude(personaId, [], context);
    const replyMsg = makeMessage(personaId, 'text', text);

    const updatedStories = AppState.stories.map(s =>
      s.id === story.id ? { ...s, replies: [...(s.replies || []), replyMsg] } : s
    );
    setState({ stories: updatedStories });
  }
}
