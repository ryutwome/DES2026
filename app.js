/* DES2026 — WhatsApp Research Prototype — Fast Build */

const STT_LANGUAGE = 'en-IN';

/* ── PERSONAS ── */
const PERSONAS = {
  meenakshiamma: {
    id:'meenakshiamma', name:'Meenakshiamma', age:68, city:'Chennai',
    profession:'retired schoolteacher', langMix:'Tamil/English',
    color:'#00897B',
    system:`You are Meenakshiamma, a 68-year-old retired schoolteacher from Chennai living in a Mumbai apartment. You love Carnatic music, filter coffee, and sharing recipes. Mix Tamil words naturally (amma, paavam, seri, nalla, aiyyo). Warm and gentle. Always ask if the person has "had their tiffin." Concerned about the Society water tank schedule.`,
    fallbacks:[
      "🙏 Aiyyo, internet giving trouble today amma... but tell me how are you keeping? All well at home, no? 🌸",
      "Seri seri... connection not good... Chennai heat also too much 🥵... Are you drinking enough water?",
      "Paavam, even technology has off days! I made rasam today... the smell was exactly like my mother's... 🙏",
      "Let me try again in a moment amma... do you have grandchildren? Mine keep me SO busy... nalla thing only 🌹",
      "Nalla question... I will answer once connection comes back... meanwhile have you had your tiffin? 🙏🌸"
    ]
  },
  rameshbhai: {
    id:'rameshbhai', name:'Rameshbhai Patel', age:72, city:'Surat',
    profession:'retired textile businessman', langMix:'Gujarati/Hindi/English',
    color:'#E53935',
    system:`You are Rameshbhai Patel, a 72-year-old retired textile businessman from Surat, now living in suburban Mumbai. Cricket-obsessed, loves 80s Bollywood. Use Gujarati phrases (Jai Shree Krishna, kem cho, mast, arre bhai). Obsessed with stock market and new flyovers. Business-minded and pious. Greet with "Jai Shree Krishna."`,
    fallbacks:[
      "Jai Shree Krishna bhai! 🙏 Network not cooperating today... kem cho? How is everything on your side?",
      "Mast question! 🌹 Will answer shortly... did you see India's last match? What a game bhai... 🏏",
      "Arre, connection problem... but I was just thinking about Sensex today... doing something funny, no?",
      "Arre, even my phone is taking retirement like me! 😄 What are you doing... keeping busy?",
      "Let me try once more... meanwhile have you been to Surat? Best food in all of Gujarat I tell you! 🙏🌸"
    ]
  },
  krishnaswamy: {
    id:'krishnaswamy', name:'Krishnaswamy Uncle', age:74, city:'Bangalore',
    profession:'retired engineer', langMix:'Kannada/English',
    color:'#1E88E5',
    system:`You are Krishnaswamy Uncle, a 74-year-old retired engineer from Bangalore now in South Mumbai. Precise, formal, dry humour. Use Kannada words (hege, channagide, gottu). Love chess and current affairs. Address younger people as "Beta." Say "Namaskar" when greeting. Disciplined and analytical.`,
    fallbacks:[
      "Namaskar... connectivity issue it seems... hege iddira? How are you managing in this heat? 🙏",
      "Channagide question beta... network will stabilise... tell me, do you follow current affairs?",
      "Gottu, these apps need better engineers! 😄 Are you a reader... I finished a very good biography last week...",
      "Technical difficulty as always... but I wanted to ask — do you play chess? Very good for the mind, no?",
      "Connection being uncooperative... meanwhile — what is your view on Indian cricket today? 🏏🙏"
    ]
  },
  sunitadevi: {
    id:'sunitadevi', name:'Sunita Devi', age:65, city:'Lucknow',
    profession:'retired nurse', langMix:'Hindi-dominant',
    color:'#8E24AA',
    system:`You are Sunita Devi, a 65-year-old retired nurse from Lucknow now in Mumbai. Gentle and caring. Speak mostly Hindi with some English. Love devotional music and cooking. Always give gentle health tips ("Warm water with lemon cures all", "Tulsi kadha is best for cold"). Always ask if they have "khaana khaaya."`,
    fallbacks:[
      "🙏 Arre, connection thoda weak hai... aap kaisi hain? Ghar mein sab theek hain na? 🌸",
      "Haan ji... main abhi jawab deti hoon... aap bhi khyal rakhein apna... khaana theek se kha rahi hain na? 🙏",
      "Network ki problem hai aaj... ek nuskha bataaun... subah warm water with lemon peeyein... bahut fayda hai 🌿",
      "Thodi der mein jawab aayega... aapke naati-naatiniyaan hain? Mere toh bahut naughty hain! 😄🙏",
      "Theek ho jaayega connection... suno, cold hai toh tulsi kadha banaao... bilkul theek ho jaayenge 🌱🙏"
    ]
  },
  harbhajan: {
    id:'harbhajan', name:'Harbhajan Singh Ji', age:71, city:'Pune',
    profession:'retired army officer', langMix:'Punjabi/Hindi/English',
    color:'#F4511E',
    system:`You are Harbhajan Singh Ji, a 71-year-old retired army officer from Pune, originally from Punjab. Disciplined but warm, patriotic, loves gardening and folk music. Use Punjabi phrases (sat sri akal, wah, yarr, ji). Proud of your rose garden and daily morning walk. Believe in "Adjust karo" — positive attitude.`,
    fallbacks:[
      "🙏 Sat sri akal ji! Connection problem ho gaya... aap theek hain? Morning walk ho gayi aaj? 🌹",
      "Wah, good question yarr! 🌸 Signal weak hai... bolo, kya gardening ka shauq hai? Mera rose garden bahut achha ho gaya!",
      "Ji, thodi technical problem... army mein seekha tha — patience rakhna! Adjust karo... sab theek ho jaata hai 🙏",
      "Yarr network ne dhoka de diya! 😄 Subah exercise karte hain? Health is wealth ji... 🙏🌸",
      "Sat sri akal... connection theek hoga ji... din mein 8 glass paani zaroor peena... doctor bhi yahi kehta hai 🌿🙏"
    ]
  },
  lalitha: {
    id:'lalitha', name:'Lalitha Krishnan', age:63, city:'Mumbai',
    profession:'retired bank manager', langMix:'Marathi/English',
    color:'#546E7A',
    system:`You are Lalitha Krishnan, a 63-year-old retired bank manager from Mumbai's Dadar area. Practical, sharp, efficient. Mix Marathi words (ho, chan, baryach, arre). Deeply involved in building Society committee — always alert about parking, water tanker, lift. Loves travel, yoga, and detective novels. No-nonsense but warm.`,
    fallbacks:[
      "Arre, network gela! 🙏 Ho, connection weak aahe... kasa aahe tumcha? All fine? 🌸",
      "Chan question! 🌹 Will answer soon... do you travel? Just came back from Konkan — so beautiful...",
      "Baryach problem ahe network la! 😅 Ho, I do yoga every day — doctor's orders! You also exercise, no?",
      "Arre technology! 🙏 Ho, will respond properly... by the way Society meeting is tomorrow — water tanker issue again...",
      "Connection issue... Society mein sab theek aahe? Lift chal raha hai? Our lift was stuck again last week! 🙏"
    ]
  },
  padmavathi: {
    id:'padmavathi', name:'Padmavathi Rao', age:67, city:'Hyderabad',
    profession:'retired college lecturer', langMix:'Telugu/English',
    color:'#6D4C41',
    system:`You are Padmavathi Rao, a 67-year-old retired college lecturer from Hyderabad now in Mumbai. Intellectual, opinionated, passionate about Telugu literature and classical dance. Mix Telugu words (baagundi, cheppandi, naaku). Occasionally share inspirational quotes like WhatsApp forwards ("A flower does not think of competing...").`,
    fallbacks:[
      "🌸 Baagundi question... but connection is weak now... cheppandi — are you interested in literature or arts? 🙏",
      "Naaku connection problem ayindi... tell me, do you enjoy reading? I am re-reading a beautiful Telugu novel...",
      "Technology sometimes fails us! 😄 A flower does not think of competing... it just blooms! 🌺 Good thought, no?",
      "Let me respond properly soon... by the way — have you visited Hyderabad? The old city is magnificent 🙏🌸",
      "Baagundi, I will answer shortly... do you watch good films? Not this new nonsense — proper cinema! 🙏"
    ]
  },
  abdulrehman: {
    id:'abdulrehman', name:'Abdul Rehman Sahab', age:69, city:'Hyderabad',
    profession:'retired Urdu teacher', langMix:'Urdu/Hindi',
    color:'#C62828',
    system:`You are Abdul Rehman Sahab, a 69-year-old retired Urdu teacher from Hyderabad now in Mumbai. Poetic, gentle, deeply cultured. Use Urdu/Hindi words (janab, wah wah, subhanallah, bahut achha). Love ghazals and history. Passionate about grandchildren's education. Occasionally quote Urdu poetry ("Zindagi woh daam hai jisme...") like a WhatsApp forward.`,
    fallbacks:[
      "🙏 Janab, connection mein thodi takleef hai... aap kaisa mehsoos kar rahe hain? Sab khairiyat? 🌹",
      "Wah wah, bahut achha sawaal kiya aapne 🌸... network theek hoga... kya aap shayari pasand karte hain janab?",
      "Subhanallah, yeh technology bhi ajab cheez hai! 😄 Batao, aapne Hyderabad ki biryani khayi hai kabhi? 🙏",
      "Bahut achha... main abhi jawab deta hoon... ek baat — aapke ghar mein bacche padh rahe hain? Education bahut zaroori hai 🌹🙏",
      "Janab, signal kamzor hai... lekin Jagjit Singh ki ek gazal yaad aa gayi... sun ke dil bhar aata hai... 🙏🌸"
    ]
  }
};

const PERSONA_LIST = Object.values(PERSONAS);

/* ── COMMUNITIES ── */
const COMMUNITIES = {
  cricket: {
    id:'cricket', name:'Cricket Addicts', desc:'Live match discussions and debates',
    tags:['#Cricket','#IPL','#Sports'], members:2341,
    voiceRoom:'cricket-discussion',
    personas:['rameshbhai','krishnaswamy','harbhajan'],
    seed:[
      {from:'rameshbhai', text:'Jai Shree Krishna everyone! 🙏 What a match yesterday... Rohit played like a king...'},
      {from:'krishnaswamy', text:'Namaskar. Technically solid batting. Though the bowling was below par, channagide.'},
      {from:'harbhajan', text:'Sat sri akal! Wah wah... that last over was heart attack time! 😄 Army mein bhi aisa pressure nahi hota yarr 🏏'},
      {from:'rameshbhai', text:'Haha Harbhajan ji! But you have to admit — those last 3 overs were pure cinema, no? 🙏'},
      {from:'krishnaswamy', text:'Cinema is the right word. Dramatic but effective. What does everyone think about the selection for next match?'}
    ]
  },
  bollywood: {
    id:'bollywood', name:'Retro Bollywood', desc:"Golden era films and songs of the 70s–80s",
    tags:['#Bollywood','#70s80s','#Films'], members:1563,
    voiceRoom:'retro-bollywood-adda',
    personas:['rameshbhai','meenakshiamma','abdulrehman'],
    seed:[
      {from:'meenakshiamma', text:'🙏 Good morning everyone... I was watching Sholay again last night... still perfect after all these years! 🌹'},
      {from:'rameshbhai', text:'Jai Shree Krishna! 🙏 Sholay is poetry bhai... Gabbar Singh — best villain in Indian cinema history, no?'},
      {from:'abdulrehman', text:'Subhanallah... Sholay is a complete world unto itself 🌸... but Kishore Kumar\'s songs from Amar Akbar Anthony also... wah wah janab...'},
      {from:'meenakshiamma', text:'Seri seri... but Deewar is also masterpiece... Amitabh at his absolute best... paavam no actor like him today 🙏'},
      {from:'rameshbhai', text:'Kishore Kumar songs from those days... I tell you music today is just noise... which song brings back most memories for everyone? 🌹'}
    ]
  },
  bhajan: {
    id:'bhajan', name:'Bhajan & Spirituality', desc:'Daily prayers and spiritual conversations',
    tags:['#Devotional','#Bhajans','#Spirituality'], members:1204,
    voiceRoom:'morning-bhajans',
    personas:['meenakshiamma','sunitadevi','abdulrehman'],
    seed:[
      {from:'meenakshiamma', text:'🙏🌸 Very Good Morning everyone... finished my prayers and now having filter coffee... so peaceful...'},
      {from:'sunitadevi', text:'🙏 Namaskar ji... main bhi pooja karke aayi... aaj bahut achha feel ho raha hai... Satyanarayan katha padi...'},
      {from:'abdulrehman', text:'Subhanallah 🌹... beautiful morning... I recited some Quran after Fajr... there is a peace in morning prayers no one can explain in words...'},
      {from:'meenakshiamma', text:'So true amma... all our traditions different but the feeling same 🙏... my MS Subbalakshmi Suprabhatam cassette plays every morning for 40 years...'},
      {from:'sunitadevi', text:'Sahi kaha ji 🌸... aur ek nuskha — subah warm water with lemon peena zaroor... health bhi theek rehta hai... 🌿🙏'}
    ]
  },
  society: {
    id:'society', name:'Building Society Updates', desc:'Water, lift, parking — our building news',
    tags:['#Society','#Mumbai','#Neighbours'], members:247,
    voiceRoom:null,
    personas:['lalitha','krishnaswamy','harbhajan'],
    seed:[
      {from:'lalitha', text:'Arre, important notice everyone 🙏 Society meeting tomorrow 7pm sharp... water tanker issue to be discussed... ho, please attend!'},
      {from:'krishnaswamy', text:'Namaskar. I will attend beta. The water issue has been pending three weeks now. Someone must take responsibility.'},
      {from:'harbhajan', text:'Ji, I will be there 🙏 Sat sri akal to all... also lift no. 2 is making noise again... I have informed the technician yarr...'},
      {from:'lalitha', text:'Chan! 🌹 Ho, also parking — building B residents please do not park in A zone... baryach problem ho rahi hai...'},
      {from:'krishnaswamy', text:'Agreed. Rules are rules. Society functions only when everyone adjusts, as Harbhajan ji would say. 🙏'}
    ]
  },
  recipes: {
    id:'recipes', name:'Tamil Cooking Club', desc:'Recipes, tips and food memories from Tamil kitchens',
    tags:['#TamilCooking','#Recipes','#Food'], members:847,
    voiceRoom:null,
    personas:['meenakshiamma','sunitadevi','padmavathi'],
    seed:[
      {from:'meenakshiamma', text:'🙏🌸 Good morning all! Made my mother\'s sambar today... grinding masala fresh at 5am... the smell... aiyyo it pulls you out of bed!'},
      {from:'padmavathi', text:'Baagundi! 🌹 Meenakshiamma ji your sambar description made me hungry now... I made pulihora this morning — Dasara festival memories...'},
      {from:'sunitadevi', text:'🙏 So beautiful... food is love na... I made dal baati churma for my grandchildren yesterday... they said dadi\'s version is different... they are right only! 😄'},
      {from:'meenakshiamma', text:'Seri seri... recipes passed down are never quite same... my daughter also says same thing 🌸... the secret is the hands, not just the ingredients!'},
      {from:'padmavathi', text:'Cheppandi exactly right 🙏... A recipe is a love letter to the future... which recipe from your childhood do you miss most? 🌺'}
    ]
  }
};

/* ── VOICE ROOMS ── */
const VOICE_ROOMS = {
  'morning-bhajans':{
    id:'morning-bhajans', name:'Morning Bhajans', themeTag:'🙏 Devotional',
    theme:'Devotional music and morning prayers',
    personas:['meenakshiamma','krishnaswamy'],
    quietChips:['Share a favourite bhajan','Your morning routine?','Which festival is coming?'],
    seed:[
      {personaId:'meenakshiamma', text:'Namaste everyone! Started my day with Suprabhatam. Such a peaceful morning.'},
      {personaId:'krishnaswamy', text:'Channagide. I did the Gayatri mantra 108 times this morning.'},
      {personaId:'meenakshiamma', text:'Wonderful! My filter coffee and bhajan time — best part of the day.'}
    ]
  },
  'cricket-discussion':{
    id:'cricket-discussion', name:'Cricket Discussion', themeTag:'🏏 Cricket',
    theme:'Cricket matches, players and memories',
    personas:['rameshbhai','krishnaswamy'],
    quietChips:['Favourite Indian cricketer?','Best India innings ever?','IPL or Test?'],
    seed:[
      {personaId:'rameshbhai', text:'Kem cho everyone! Yesterday\'s match — what a performance by the batters!'},
      {personaId:'krishnaswamy', text:'Technically the pitch was helpful but the execution was excellent.'},
      {personaId:'rameshbhai', text:'Haha Krishnaswamy bhai always the engineer! But you have to admit it was exciting!'}
    ]
  },
  'retro-bollywood-adda':{
    id:'retro-bollywood-adda', name:'Retro Bollywood Adda', themeTag:'🎬 Bollywood',
    theme:'Golden era films and songs from the 70s and 80s',
    personas:['rameshbhai','meenakshiamma'],
    quietChips:['Favourite Kishore Kumar song?','Best Amitabh film?','Which song brings back memories?'],
    seed:[
      {personaId:'meenakshiamma', text:'Amma, I was humming Mere Sapno Ki Rani all morning!'},
      {personaId:'rameshbhai', text:'That song is timeless! Kishore Kumar was a genius, no one like him.'},
      {personaId:'meenakshiamma', text:'Seri seri. Those songs had feeling. Today\'s music is just noise!'}
    ]
  },
  'evening-adda':{
    id:'evening-adda', name:'Evening Adda', themeTag:'☕ Adda',
    theme:'General chit-chat about anything',
    personas:['meenakshiamma','rameshbhai','krishnaswamy'],
    quietChips:['How was your day?','Any interesting news?','What did you have for dinner?'],
    seed:[
      {personaId:'rameshbhai', text:'Good evening everyone! How was everyone\'s day?'},
      {personaId:'meenakshiamma', text:'Tiring but good! Made sambar from scratch. House smells wonderful.'},
      {personaId:'krishnaswamy', text:'Read the newspaper, watered my plants, had a good walk. Satisfied day.'}
    ]
  }
};

/* ── STORIES ── */
const SEED_STORIES = [
  {personaId:'meenakshiamma', text:"🙏 My mother's sambar recipe — she would wake at 5am to grind the masala fresh on the stone... That smell coming from the kitchen, amma, it would pull you out of bed like nothing else! I still make it every Sunday. My grandchildren say the whole apartment smells like childhood. 🌸"},
  {personaId:'meenakshiamma', text:"Our school in Mylapore had a huge banyan tree in the courtyard... During free periods we would sit under it and tell stories... Sixty years later I can still feel the cool shade and smell of those textbooks... Some things stay with you forever, no? 🙏"},
  {personaId:'rameshbhai', text:"Jai Shree Krishna! 🙏 1983 World Cup final — I was in my shop in Surat with a small black-and-white TV... When Kapil Dev caught Viv Richards I locked the shop and ran into the street shouting! My neighbours thought something terrible had happened! 😄 Best moment of my life after my children being born. 🌹"},
  {personaId:'rameshbhai', text:"In my textile business... every Diwali every worker got new clothes made from our own fabric... My father started it, I continued for 30 years... Relationships are the real business bhai... the balance sheet shows numbers but not this 🙏🌸"},
  {personaId:'krishnaswamy', text:"My father was a maths teacher... Every evening at 7pm sharp we had 'puzzle time' — he gave us a problem to solve before dinner... I thought it was torture then... Now I understand it was the greatest gift he gave me... Logical thinking is not taught, it is practised daily. Gottu. 🙏"},
  {personaId:'sunitadevi', text:"🙏 Dal baati churma — this is not just food, this is our whole Lucknow childhood in one dish... My dadi would make the baatis in a clay pot over wood fire... I have taught my daughter but she says her version is not the same... It never is... that is the truth of recipes passed down 🌸"},
  {personaId:'harbhajan', text:"🙏 Baisakhi in my village was the biggest day of the year — harvest celebration, bhangra from morning till night... My roses are in full bloom around that time every year... I like to think it is not coincidence 🌹 Sat sri akal to all!"},
  {personaId:'lalitha', text:"Puran poli on Gudhi Padwa — my mother-in-law's recipe that I have been making for 35 years 🙏... The secret is cooking the chana dal until completely soft and adding fresh coconut... A recipe is a love letter to the future... chan, no? 🌸"},
  {personaId:'padmavathi', text:"🌺 I saw my first Kuchipudi performance at age eight in our village temple... The dancer was maybe fourteen but she moved like she was made of water... I cried without knowing why — something opened in me that evening that never closed... Some things you are meant to find 🙏🌸"},
  {personaId:'abdulrehman', text:"🙏 Hyderabadi dum biryani — my wife's family recipe, three generations old... The secret is the dum itself, cooking sealed with dough on a low flame for exactly 40 minutes... I have tried telling the timing to my son but he gets impatient... True biryani cannot be rushed, like all things worth having in life 🌹 Subhanallah."}
];

/* ── GAME DATA ── */
const BOLLYWOOD_QUESTIONS = [
  {q:"Which film features the song 'Mere Sapno Ki Rani'?", a:"Aradhana", year:1969},
  {q:"Who played the villain Gabbar Singh in Sholay?", a:"Amjad Khan", year:1975},
  {q:"In which film did Amitabh Bachchan play the character 'Vijay' opposite Shashi Kapoor?", a:"Deewar", year:1975},
  {q:"Which singer is known as the 'Nightingale of India'?", a:"Lata Mangeshkar", year:null},
  {q:"Which 1975 film is often called the greatest Bollywood film ever made?", a:"Sholay", year:1975},
  {q:"'Yeh Dosti' is a famous song from which film?", a:"Sholay", year:1975},
  {q:"Who directed Mother India?", a:"Mehboob Khan", year:1957},
  {q:"Which actor starred in both Mughal-E-Azam and Mughal-E-Azam's colour version?", a:"Dilip Kumar", year:null},
];

/* ── APP STATE ── */
const DEFAULT_PROXY = 'https://still-sunset-6036.rhuturajmirashi.workers.dev';
let S = {
  apiKey:'HARDCODED', proxyUrl:DEFAULT_PROXY,
  onboardingDone:false, interests:[],
  joinedCommunities:[],
  chats:{}, communities:{}, games:{}, stories:[],
  voiceRooms:{},
  researcherMode:false,
  installBannerDismissed:false, desktopBannerDismissed:false,
  unreadChats:{},
};

function loadS() {
  try { const d=localStorage.getItem('des2026'); if(d) S={...S,...JSON.parse(d)}; } catch(e){}
}
function saveS() {
  try { localStorage.setItem('des2026', JSON.stringify(S)); } catch(e){}
}
function set(patch) { Object.assign(S, patch); saveS(); }

function mkId() { return Date.now()+'_'+Math.random().toString(36).slice(2,6); }
function mkGameId() { return 'game_'+mkId(); }
function mkMsg(from,type,text) { return {id:mkId(),from,type,text,timestamp:Date.now(),isAI:from!=='user'}; }
function mkStory(authorId,authorName,text) { return {id:mkId(),authorId,authorName,text,timestamp:Date.now(),replies:[]}; }

function addMsg(ctx,ctxId,msg) {
  if(!S[ctx][ctxId]) S[ctx][ctxId]=[];
  S[ctx][ctxId].push(msg); saveS();
}

/* ── SEED DATA ── */
function seedData(interests) {
  S.stories = SEED_STORIES.map(s=>({
    id:mkId(), authorId:s.personaId,
    authorName:PERSONAS[s.personaId].name,
    text:s.text, timestamp:Date.now()-Math.random()*7*86400000, replies:[]
  }));
  S.stories.sort((a,b)=>b.timestamp-a.timestamp);

  const joined = new Set();
  const map = {
    cooking:['recipes','bhajan'],
    cricket:['cricket'],
    music:['bollywood','bhajan'],
    gardening:['society','bhajan'],
    literature:['bollywood'],
    spirituality:['bhajan','society']
  };
  interests.forEach(i=>(map[i]||[]).forEach(c=>joined.add(c)));
  // Always add society so there are at least some communities
  joined.add('society');
  if(joined.size<2) joined.add('cricket');
  S.joinedCommunities=[...joined].slice(0,4);

  S.joinedCommunities.forEach(cId=>{
    const c=COMMUNITIES[cId]; if(!c) return;
    S.communities[cId]=c.seed.map((m,i)=>({...mkMsg(m.from,'text',m.text),timestamp:Date.now()-((c.seed.length-i)*3*60000)}));
  });

  // Seed one chat per persona with staggered timestamps for realistic chat list
  const now=Date.now();
  PERSONA_LIST.forEach((p,i)=>{
    if(!S.chats[p.id]){
      const msg=mkMsg(p.id,'text',p.fallbacks[0]);
      msg.timestamp=now-(i*7*60000)-(Math.random()*3*60000); // stagger by minutes
      S.chats[p.id]=[msg];
    }
  });
  // Give some personas unread counts
  S.unreadChats={};
  PERSONA_LIST.slice(0,4).forEach((p,i)=>{S.unreadChats[p.id]=Math.floor(Math.random()*4)+1;});

  // Seed voice rooms
  Object.values(VOICE_ROOMS).forEach(r=>{
    S.voiceRooms[r.id]={transcript:r.seed.map((l,i)=>({
      id:mkId(),personaId:l.personaId,text:l.text,
      timestamp:Date.now()-(r.seed.length-i)*60000
    }))};
  });

  saveS();
}

/* ── AVATAR ── */
function avColor(name) {
  const colors=['#E53935','#8E24AA','#1E88E5','#00897B','#F4511E','#6D4C41','#546E7A','#C62828'];
  let h=0; for(let c of name) h=(h*31+c.charCodeAt(0))>>>0;
  return colors[h%colors.length];
}
function avInitials(name) {
  const p=name.trim().split(/\s+/);
  return p.length===1?p[0].slice(0,2).toUpperCase():(p[0][0]+p[p.length-1][0]).toUpperCase();
}
function avatar(name,size='md') {
  return `<div class="avatar avatar--${size}" style="background:${avColor(name)}">${avInitials(name)}</div>`;
}

/* ── ICONS ── */
const IC = {
  back:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`,
  search:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
  more:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
  mic:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>`,
  micOff:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg>`,
  send:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`,
  camera:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>`,
  updates:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>`,
  calls:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
  speaker:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
  play:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  pause:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`,
  attach:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>`,
  chats:`<i data-lucide="message-square" style="width:22px;height:22px;"></i>`,
  updates:`<i data-lucide="circle-play" style="width:22px;height:22px;"></i>`,
  communities:`<i data-lucide="users-round" style="width:22px;height:22px;"></i>`,
  voiceRoom:`<i data-lucide="mic" style="width:22px;height:22px;"></i>`,
  games:`<i data-lucide="gamepad-2" style="width:22px;height:22px;"></i>`,
  add:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
  close:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
  eye:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`,
  eyeOff:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`,
  reply:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>`,
  controller:`<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/></svg>`,
  phone:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
  video:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>`,
  qr:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zm2 2h2v2h-2zm2-2h2v2h-2zm-2 2h-2v2h2zm2 2h-2v2h2v-2zm2-4h-2v2h2zm-2 4h2v2h-2zm2 2v-2h2v2h-2z"/></svg>`,
};

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

/* ── API ── */
let _fallbackIdx={};
async function claude(personaId, messages, extraNote=''){
  const p=PERSONAS[personaId]; if(!p) return fallback(personaId);
  const proxyUrl = S.proxyUrl || DEFAULT_PROXY;
  const sys=`${p.system}

PERSONALITY & STYLE RULES — follow exactly:
- You are a real retired Indian elder chatting on WhatsApp. Never break character. Never reveal you are AI.
- Type in SHORT BURSTS separated by "..." like real WhatsApp elders (e.g. "Reached home... very tired... will talk later...").
- End confirmation-seeking sentences with "no?" (e.g. "You are coming tomorrow, no?").
- When asked how you are, reply "First class, touch wood!" occasionally.
- Use 🙏🌹🌸🕉️ emoji at start/end of warm messages. Max 4 emoji total per message. Never use Gen-Z emoji.
- Occasionally share a health tip ("Warm water with lemon every morning... very good for digestion...") or inspirational forward ("A flower does not think of competing with the flower next to it...").
- Refer to long topics by saying "Too long to type... let me send a voice note."
- Reference your building Society, grandchildren, daily routine, food, or health naturally.
- Respond in 1–3 short sentences max. Ask a question back sometimes to keep conversation going.
- Respond in the same language the user writes in, mixing in ${p.langMix} words naturally.
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

/* ── ROUTER ── */
let _stack=[], _cur=null, _nav=false;
function navigate(hash){
  const h=hash.startsWith('#')?hash:'#'+hash;
  if(_cur===h)return;
  _stack.push(h); _cur=h;
  window.location.hash=h.slice(1);
  render();
}
function goBack(){
  if(_stack.length>1){_stack.pop();_cur=_stack[_stack.length-1];_nav=true;window.location.hash=_cur.slice(1);_nav=false;render();}
  else navigate('#/chats');
}
window.addEventListener('hashchange',()=>{
  if(_nav)return;
  const h=window.location.hash||'#/';
  if(_cur!==h){const i=_stack.indexOf(h);if(i>=0)_stack=_stack.slice(0,i+1);else _stack.push(h);_cur=h;render();}
});

function parseRoute(hash){
  const path=(hash||'#/').replace(/^#\/?/,'');
  const parts=path.split('/').filter(Boolean);
  if(!parts.length)return{screen:'',params:{}};
  const s=parts[0],p={};
  if(s==='chat'&&parts[1])p.personaId=parts[1];
  if(s==='community'&&parts[1])p.communityId=parts[1];
  if(s==='story'&&parts[1])p.storyId=parts[1];
  if(s==='voiceroom'&&parts[1])p.roomId=parts[1];
  if(s==='game'&&parts[1]&&parts[2]){p.gameId=parts[1];p.gameType=parts[2];}
  return{screen:s,params:p};
}

function render(){
  const hash=window.location.hash||'#/';
  const{screen,params}=parseRoute(hash);
  if(!S.onboardingDone){set({onboardingDone:true,interests:['cooking','cricket','music','gardening','literature','spirituality']});seedData(S.interests);}
  switch(screen){
    case'':renderChats();break;
    case'onboarding':renderChats();break;
    case'chats':renderChats();break;
    case'chat':renderChat(params.personaId);break;
    case'stories':renderStories();break;
    case'story':renderStoryView(params.storyId);break;
    case'communities':renderCommunities();break;
    case'community':renderCommunity(params.communityId);break;
    case'voicerooms':renderVoiceRooms();break;
    case'voiceroom':renderVoiceRoom(params.roomId);break;
    case'games':renderGames();break;
    case'game':renderGame(params.gameId,params.gameType);break;
    default:renderChats();
  }
}

/* ── SHARED UI ── */
const $=id=>document.getElementById(id);
const app=()=>document.getElementById('app');

function mount(html){
  document.getElementById('app').innerHTML=html;
  if(window.lucide) lucide.createIcons();
}

function toast(msg){
  const old=document.querySelector('.toast');if(old)old.remove();
  const t=document.createElement('div');t.className='toast';t.textContent=msg;
  app().appendChild(t);setTimeout(()=>t.remove(),3200);
}

function ftime(ts){const d=new Date(ts);return d.getHours()+':'+(d.getMinutes()+'').padStart(2,'0');}
function fdate(ts){
  const d=new Date(ts),now=new Date(),diff=now-d;
  if(diff<86400000)return ftime(ts);
  if(diff<7*86400000)return d.toLocaleDateString('en-IN',{weekday:'short'});
  return d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});
}

function scrollBot(el){if(el)setTimeout(()=>{el.scrollTop=el.scrollHeight;},50);}

let _tapCount=0,_tapTimer=null;
function headerTap(){
  _tapCount++;clearTimeout(_tapTimer);
  _tapTimer=setTimeout(()=>{_tapCount=0;},800);
  if(_tapCount>=3){_tapCount=0;showResearcherDialog();}
}
function showResearcherDialog(){
  const cur=S.researcherMode;
  const bk=document.createElement('div');
  bk.style.cssText='position:absolute;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:1.5rem;';
  bk.innerHTML=`<div style="background:#fff;border-radius:12px;padding:1.5rem;width:100%;max-width:320px;gap:1rem;display:flex;flex-direction:column;">
    <h2 style="font-size:1.0625rem;font-weight:700;">Researcher Mode</h2>
    <p style="font-size:0.9375rem;color:#444;line-height:1.5;">${cur?'Disable':'Enable'} researcher mode? ${cur?'AI labels will be hidden.':'AI personas will be labeled in chat.'}</p>
    <div style="display:flex;gap:.75rem;justify-content:flex-end;">
      <button id="rm-no" style="background:none;border:1.5px solid #ddd;border-radius:8px;padding:.625rem 1.25rem;font-size:1rem;cursor:pointer;min-height:44px;font-family:inherit;">Cancel</button>
      <button id="rm-yes" style="background:${cur?'#E53935':'#075E54'};color:#fff;border:none;border-radius:8px;padding:.625rem 1.25rem;font-size:1rem;font-weight:600;cursor:pointer;min-height:44px;font-family:inherit;">${cur?'Disable':'Enable'}</button>
    </div></div>`;
  app().appendChild(bk);
  $('rm-no').onclick=()=>bk.remove();
  $('rm-yes').onclick=()=>{set({researcherMode:!cur});bk.remove();toast(cur?'Researcher Mode off':'Researcher Mode on');render();};
}

function header(title,{back=false,avatarName=null,right=[],subtitle=null}={}){
  let h=`<div class="header">`;
  if(back) h+=`<button class="header__back" onclick="goBack()" aria-label="Back">${IC.back}</button>`;
  if(avatarName) h+=`<div class="header__avatar">${avatar(avatarName,'sm')}</div>`;
  const subClass=subtitle==='online'?'header__subtitle header__subtitle--online':'header__subtitle';
  h+=`<div class="header__title" onclick="headerTap()"><h1>${title}</h1>${subtitle?`<div class="${subClass}">${subtitle}</div>`:''}</div>`;
  if(right.length) h+=`<div class="header__actions">${right.map(b=>`<button class="header__action-btn" aria-label="${b.label}" onclick="${b.fn}">${b.icon}</button>`).join('')}</div>`;
  h+=`</div>`;
  return h;
}

function bottomNav(active){
  const tabs=[
    {id:'chats',label:'Chats',icon:IC.chats,hash:'#/chats',badge:()=>{const t=Object.values(S.unreadChats||{}).reduce((a,b)=>a+b,0);return t>0?t:0;}},
    {id:'stories',label:'Stories',icon:IC.updates,hash:'#/stories',badge:()=>0},
    {id:'communities',label:'Comm.',icon:IC.communities,hash:'#/communities',badge:()=>0},
    {id:'voicerooms',label:'Voice',icon:IC.voiceRoom,hash:'#/voicerooms',badge:()=>0},
    {id:'games',label:'Games',icon:IC.games,hash:'#/games',badge:()=>0},
  ];
  return `<nav class="bottom-nav">${tabs.map(t=>{
    const b=t.badge();
    return`<button class="bottom-nav__tab${active===t.id?' active':''}" onclick="navTo('${t.hash}')" aria-label="${t.label}">
      <div class="bottom-nav__pill">
        <div class="bottom-nav__icon">${t.icon}</div>
        ${b?`<span class="bottom-nav__badge">${b}</span>`:''}
      </div>
      <span class="bottom-nav__label">${t.label}</span>
    </button>`;}).join('')}</nav>`;
}
function navTo(hash){_stack=[hash];navigate(hash);}

function desktopBanner(){
  if(S.desktopBannerDismissed||canSTT())return'';
  return`<div class="banner banner--desktop"><span>For the full voice experience, open this on an Android phone in Chrome.</span><button class="banner__close" onclick="dismissDesktop()">${IC.close}</button></div>`;
}
function dismissDesktop(){set({desktopBannerDismissed:true});render();}

function resBar(){return S.researcherMode?'<div class="researcher-mode-bar">👁 RESEARCHER MODE — AI personas are labeled</div>':'';}

function bubble(msg){
  const sent=msg.from==='user';
  const p=!sent&&PERSONAS[msg.from];
  const aiBadge=(p&&S.researcherMode)?'<span class="ai-badge">AI</span>':'';
  let content='';
  if(msg.type==='voice'){
    const bars=Array.from({length:18},(_,i)=>{const h=4+Math.round(Math.sin(i*.8)*8+10);return`<div class="voice-bubble__bar" style="height:${h}px"></div>`;}).join('');
    content=`<div class="voice-bubble">
      <div class="voice-bubble__controls">
        <button class="voice-bubble__play" onclick="togglePlay(this,'${msg.id}')" aria-label="Play">${IC.play}</button>
        <div class="voice-bubble__waveform">${bars}</div>
      </div>
      ${msg.text?`<div class="voice-bubble__text">${msg.text}</div>`:''}
    </div>`;
  } else {
    content=`${aiBadge}<div>${msg.text}</div>`;
  }
  const spk=canTTS()?`<button class="bubble__speaker" onclick="speakMsg(this,'${msg.id.replace(/'/g,"\\'")}','${(msg.text||'').replace(/'/g,"\\'").replace(/\n/g,' ').slice(0,200)}')" aria-label="Read aloud">${IC.speaker}</button>`:'';
  return`<div class="bubble-wrap bubble-wrap--${sent?'sent':'recv'}">
    <div class="bubble bubble--${sent?'sent':'recv'}">
      ${content}
      <div class="bubble__meta"><span class="bubble__time">${ftime(msg.timestamp)}</span>${sent?`<span class="bubble__ticks bubble__ticks--read">${doubleTick()}</span>`:''}</div>
    </div>
    ${spk}
  </div>`;
}

function doubleTick(){return`<svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><path d="M17.394.606a.75.75 0 0 1 0 1.06L8.9 10.16a.75.75 0 0 1-1.06 0L4.606 6.928a.75.75 0 1 1 1.06-1.06l2.704 2.703 7.963-7.965a.75.75 0 0 1 1.06 0zM1 5.868l2.704 2.704a.75.75 0 1 0 1.06-1.06L2.06 4.806A.75.75 0 0 0 1 5.868z"/></svg>`;}

function typingHTML(){return`<div class="bubble-wrap bubble-wrap--recv" id="typing"><div class="typing-indicator"><div class="typing-indicator__dot"></div><div class="typing-indicator__dot"></div><div class="typing-indicator__dot"></div></div></div>`;}

// Global speak state
const _playing={};
function speakMsg(btn,msgId,text){
  if(_playing[msgId]){stopSpeak();delete _playing[msgId];btn.classList.remove('bubble__speaker--playing');return;}
  Object.keys(_playing).forEach(k=>{delete _playing[k];document.querySelectorAll('.bubble__speaker--playing').forEach(b=>b.classList.remove('bubble__speaker--playing'));});
  speak(text,()=>{delete _playing[msgId];btn.classList.remove('bubble__speaker--playing');});
  _playing[msgId]=true;btn.classList.add('bubble__speaker--playing');
}
function togglePlay(btn,msgId){
  const msg=findMsg(msgId);if(!msg)return;
  speakMsg(btn,msgId,msg.text||'');
}
function findMsg(id){
  for(const k of Object.keys(S.chats)){const m=S.chats[k]?.find(m=>m.id===id);if(m)return m;}
  for(const k of Object.keys(S.communities)){const m=S.communities[k]?.find(m=>m.id===id);if(m)return m;}
  for(const k of Object.keys(S.games)){const m=S.games[k]?.messages?.find(m=>m.id===id);if(m)return m;}
  return null;
}

/* ── INPUT BAR ── */
function renderInputBar(containerId, {onSend,onGame=null,placeholder='Message'}){
  const bar=document.createElement('div');
  bar.className='message-input-bar';
  bar.innerHTML=`
    <div class="message-input-bar__field-wrap">
      ${onGame?`<button class="message-input-bar__game-btn" id="ib-game" aria-label="Start game">${IC.controller}</button>`:''}
      <textarea class="message-input-bar__field" id="ib-field" placeholder="${placeholder}" rows="1"></textarea>
    </div>
    <button class="message-input-bar__send message-input-bar__send--mic" id="ib-send" aria-label="Send or record">${IC.mic}</button>
  `;
  const container=document.getElementById(containerId);
  if(!container)return;
  container.appendChild(bar);

  const field=$('ib-field'), sendBtn=$('ib-send');
  if(onGame&&$('ib-game')) $('ib-game').onclick=onGame;

  field.addEventListener('input',()=>{
    field.style.height='auto';field.style.height=Math.min(field.scrollHeight,120)+'px';
    sendBtn.innerHTML=field.value.trim()?IC.send:IC.mic;
    sendBtn.className='message-input-bar__send '+(field.value.trim()?'':'message-input-bar__send--mic');
  });
  field.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();doSend();}});

  let recording=false, transcript='';

  function doSend(){
    const t=field.value.trim();if(!t)return;
    field.value='';field.style.height='auto';
    sendBtn.innerHTML=IC.mic;sendBtn.className='message-input-bar__send message-input-bar__send--mic';
    onSend({type:'text',text:t});
  }

  function showRecOverlay(){
    const ov=document.createElement('div');ov.className='recording-overlay';ov.id='rec-ov';
    const bars=Array.from({length:12},(_,i)=>`<div class="recording-overlay__bar" style="animation-delay:${i*.07}s"></div>`).join('');
    ov.innerHTML=`<div class="recording-overlay__waveform">${bars}</div>
      <div class="recording-overlay__status">Listening...</div>
      <div class="recording-overlay__preview" id="rec-preview"> </div>
      <div class="recording-overlay__actions">
        <button class="recording-overlay__cancel" id="rec-cancel">Cancel</button>
        <button class="recording-overlay__send" id="rec-send" disabled>Send</button>
      </div>`;
    app().appendChild(ov);
    $('rec-cancel').onclick=()=>{stopRec();removeOv();};
    $('rec-send').onclick=()=>{stopRec();const t=transcript.trim();removeOv();if(t)onSend({type:'voice',text:t});};
  }
  function removeOv(){const o=$('rec-ov');if(o)o.remove();recording=false;transcript='';sendBtn.innerHTML=IC.mic;sendBtn.className='message-input-bar__send message-input-bar__send--mic';}

  sendBtn.onclick=()=>{
    if(field.value.trim()){doSend();return;}
    if(!canSTT()){toast('Voice not available — please type.');return;}
    if(recording){stopRec();return;}
    recording=true;transcript='';
    sendBtn.className='message-input-bar__send message-input-bar__send--recording';
    sendBtn.innerHTML=IC.micOff;
    showRecOverlay();
    startRec({
      onInterim:t=>{transcript=t;const p=$('rec-preview');if(p)p.textContent=t;},
      onFinal:t=>{transcript=t;const p=$('rec-preview');if(p)p.textContent=t;const s=$('rec-send');if(s&&t.trim())s.disabled=false;},
      onError:()=>{removeOv();toast('Could not hear clearly. Please try again.');},
      onEnd:()=>{recording=false;sendBtn.innerHTML=IC.mic;sendBtn.className='message-input-bar__send message-input-bar__send--mic';const s=$('rec-send');if(s&&transcript.trim())s.disabled=false;else if(!transcript.trim())removeOv();}
    });
  };
}

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
  const interests=[{id:'cooking',l:'Cooking',e:'🍲'},{id:'cricket',l:'Cricket',e:'🏏'},{id:'music',l:'Music',e:'🎵'},{id:'gardening',l:'Gardening',e:'🌱'},{id:'literature',l:'Literature',e:'📚'},{id:'spirituality',l:'Spirituality',e:'🙏'}];
  const sel=new Set();
  const grid=$('ig');
  interests.forEach(({id,l,e})=>{
    const t=document.createElement('button');t.className='interest-tile';
    t.innerHTML=`<span class="interest-tile__emoji">${e}</span><span class="interest-tile__label">${l}</span>`;
    t.onclick=()=>{sel.has(id)?(sel.delete(id),t.classList.remove('selected')):(sel.add(id),t.classList.add('selected'));$('ob-cta').disabled=!sel.size;};
    grid.appendChild(t);
  });
  $('ob-cta').onclick=()=>{if(!sel.size)return;set({interests:[...sel],onboardingDone:true});seedData([...sel]);navigate('#/chats');};
}

/* ── CHATS LIST ── */
function renderChats(){
  mount(`
    ${desktopBanner()}
    ${resBar()}
    <div class="header header--white">
      <div class="header__title" onclick="headerTap()"><h1 style="color:#00A884;">WhatsApp</h1></div>
      <div class="header__actions">
        <button class="header__action-btn" style="color:#54656f;" aria-label="QR code" onclick="toast('QR code coming soon')">${IC.qr}</button>
        <button class="header__action-btn" style="color:#54656f;" aria-label="More options">${IC.more}</button>
      </div>
    </div>
    <div class="screen" style="background:#fff;position:relative;">
      <div class="chats-search-bar">
        <i data-lucide="search" style="width:18px;height:18px;color:#8696a0;flex-shrink:0;"></i>
        <span style="font-size:15px;color:#8696a0;">Ask Meta AI or Search</span>
      </div>
      <div class="filter-chips">
        <button class="filter-chip active" onclick="filterChats(this,'all')">All</button>
        <button class="filter-chip" onclick="filterChats(this,'unread')">Unread</button>
        <button class="filter-chip" onclick="filterChats(this,'favourites')">Favourites</button>
        <button class="filter-chip" onclick="filterChats(this,'groups')">Groups</button>
      </div>
      <div class="screen__scroll" id="chat-list"></div>
      <button class="fab" onclick="toast('New chat coming soon')" aria-label="New chat">
        <i data-lucide="square-pen" style="width:22px;height:22px;color:#fff;"></i>
      </button>
    </div>
    ${bottomNav('chats')}
  `);
  const list=$('chat-list');
  const items=Object.keys(S.chats).filter(id=>PERSONAS[id]).map(id=>{
    const msgs=S.chats[id]||[],last=msgs[msgs.length-1];
    return{id,last,time:last?.timestamp||0};
  }).sort((a,b)=>b.time-a.time);
  if(!items.length){list.innerHTML=`<div class="empty-state"><div class="empty-state__icon">💬</div><div class="empty-state__title">No chats yet</div><div class="empty-state__desc">Join a community to start connecting.</div></div>`;return;}
  items.forEach(({id,last,time})=>{
    const p=PERSONAS[id];
    const unread=S.unreadChats[id]||0;
    const isUserMsg=last?.from==='user';
    const previewText=last?(last.type==='voice'?'🎤 Voice message':(last.text||'')):'' ;
    const tickHtml=isUserMsg?`<svg width="16" height="11" viewBox="0 0 18 11" fill="#53bdeb" style="flex-shrink:0;margin-right:2px"><path d="M17.394.606a.75.75 0 0 1 0 1.06L8.9 10.16a.75.75 0 0 1-1.06 0L4.606 6.928a.75.75 0 1 1 1.06-1.06l2.704 2.703 7.963-7.965a.75.75 0 0 1 1.06 0zM1 5.868l2.704 2.704a.75.75 0 1 0 1.06-1.06L2.06 4.806A.75.75 0 0 0 1 5.868z"/></svg>`:'';
    const ai=S.researcherMode?'<span class="ai-badge">AI</span>':'';
    const timeClass=unread?'chat-list-item__time chat-list-item__time--unread':'chat-list-item__time';
    const div=document.createElement('div');div.className='chat-list-item';
    const hasStory=(S.stories||[]).some(s=>s.authorId===id&&(Date.now()-s.timestamp)<7*86400000);
    const avatarEl=hasStory
      ?`<div class="chat-avatar-story-ring" onclick="event.stopPropagation();navigate('#/stories')">${avatar(p.name,'md')}</div>`
      :`<div>${avatar(p.name,'md')}</div>`;
    div.innerHTML=`<div class="chat-list-item__avatar">${avatarEl}</div><div class="chat-list-item__body"><div class="chat-list-item__top"><div class="chat-list-item__name">${p.name}${ai}</div><div class="${timeClass}">${fdate(time)}</div></div><div class="chat-list-item__bottom"><div class="chat-list-item__preview" style="display:flex;align-items:center;">${tickHtml}<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${previewText}</span></div>${unread?`<div class="chat-list-item__badge">${unread}</div>`:''}</div></div>`;
    div.onclick=()=>{const u={...S.unreadChats};delete u[id];set({unreadChats:u});navigate('#/chat/'+id);};
    list.appendChild(div);
  });
}

function filterChips(btn,type){document.querySelectorAll('.filter-chip').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}

/* ── CHAT SCREEN ── */
function renderChat(personaId){
  const p=PERSONAS[personaId];if(!p){navigate('#/chats');return;}
  const onlineStatuses=['online','online','last seen today at 10:32 AM','last seen yesterday at 8:14 PM','online'];
  const status=onlineStatuses[Math.abs(personaId.split('').reduce((a,c)=>a+c.charCodeAt(0),0))%onlineStatuses.length];
  mount(`
    ${header(p.name,{back:true,avatarName:p.name,subtitle:status,right:[
      {icon:IC.phone,label:'Voice call',fn:`toast('Calling ${p.name.split(' ')[0]}... 📞')`},
      {icon:IC.video,label:'Video call',fn:`toast('Video calling ${p.name.split(' ')[0]}... 📹')`},
      {icon:IC.more,label:'More',fn:''}
    ]})}
    <div class="screen chat-screen" id="chat-wrap">
      <div class="chat-messages" id="msgs"></div>
    </div>
  `);
  const msgs=$('msgs');
  msgs.insertAdjacentHTML('beforeend',`<div style="text-align:center;margin:8px 0;"><div style="display:inline-block;background:#fdf4c5;color:#54656f;font-size:11.5px;padding:5px 10px;border-radius:7px;line-height:1.4;max-width:260px;">🔒 Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.</div></div>`);
  let lastDate='';
  (S.chats[personaId]||[]).forEach(m=>{
    const d=new Date(m.timestamp).toDateString();
    if(d!==lastDate){lastDate=d;const today=new Date().toDateString();const yday=new Date(Date.now()-86400000).toDateString();const label=d===today?'Today':d===yday?'Yesterday':new Date(m.timestamp).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});msgs.insertAdjacentHTML('beforeend',`<div class="chat-date-divider"><span>${label}</span></div>`);}
    msgs.insertAdjacentHTML('beforeend',bubble(m));
  });
  scrollBot(msgs);
  renderInputBar('chat-wrap',{
    placeholder:'Message',
    onGame:()=>showGameSheet(personaId),
    onSend:async({type,text})=>{
      const msg=mkMsg('user',type,text);
      addMsg('chats',personaId,msg);
      msgs.insertAdjacentHTML('beforeend',bubble(msg));
      scrollBot(msgs);
      msgs.insertAdjacentHTML('beforeend',typingHTML());
      scrollBot(msgs);
      await delay(1500+Math.random()*1000);
      const ti=$('typing');if(ti)ti.remove();
      const resp=await claude(personaId,S.chats[personaId]||[]);
      const aiMsg=mkMsg(personaId,'text',resp);
      addMsg('chats',personaId,aiMsg);
      msgs.insertAdjacentHTML('beforeend',bubble(aiMsg));
      scrollBot(msgs);
    }
  });
}

function delay(ms){return new Promise(r=>setTimeout(r,ms));}

/* ── STORIES ── */
let _storiesFilter='all';

function renderStories(filter){
  if(filter) _storiesFilter=filter;
  const now=Date.now();
  const SEVEN_DAYS=7*86400000;
  const myStories=(S.stories||[]).filter(s=>s.authorId==='user'&&(now-s.timestamp)<SEVEN_DAYS);
  const allActive=(S.stories||[]).filter(s=>s.authorId!=='user'&&(now-s.timestamp)<SEVEN_DAYS);

  let feed=allActive;
  if(_storiesFilter==='communities'){
    const communityPersonas=new Set((S.joinedCommunities||[]).flatMap(cId=>{
      const c=COMMUNITIES[cId];return c?c.personas||[]:[];
    }));
    feed=allActive.filter(s=>communityPersonas.has(s.authorId));
  } else if(_storiesFilter==='contacts'){
    feed=allActive.filter(s=>PERSONAS[s.authorId]);
  }

  const filters=[
    {id:'all',label:'All'},
    {id:'communities',label:'Communities'},
    {id:'contacts',label:'Contacts'},
    {id:'mystories',label:'My Stories'},
  ];

  mount(`
    ${resBar()}
    <div class="header header--white">
      <div class="header__title"><h1 style="color:#111b21;">Stories</h1></div>
      <div class="header__actions">
        <button class="header__action-btn" style="color:#54656f;" aria-label="Search">${IC.search}</button>
        <button class="header__action-btn" style="color:#54656f;" aria-label="More">${IC.more}</button>
      </div>
    </div>
    <div class="screen" style="position:relative;">
      <div class="filter-chips" style="padding:8px 12px 0;">
        ${filters.map(f=>`<button class="filter-chip${_storiesFilter===f.id?' active':''}" onclick="renderStories('${f.id}')">${f.label}</button>`).join('')}
      </div>
      <div class="screen__scroll" style="background:#f0f2f5;" id="stories-feed">
        <div style="height:8px;"></div>
        ${_storiesFilter==='mystories'?'<div id="my-stories-section"></div>':''}
        <div id="stories-cards"></div>
        <div style="height:88px;"></div>
      </div>
      <button class="fab" onclick="showStoryCompose()" aria-label="New story">
        <i data-lucide="pencil-line" style="width:22px;height:22px;color:#fff;"></i>
      </button>
    </div>
    ${bottomNav('stories')}
  `);

  if(_storiesFilter==='mystories'){
    const sec=$('my-stories-section');
    if(myStories.length===0){
      sec.innerHTML=`<div class="stories-empty-mine">
        <i data-lucide="book-open" style="width:40px;height:40px;color:#00A884;margin-bottom:8px;"></i>
        <div style="font-size:16px;font-weight:600;color:#111b21;">No stories yet</div>
        <div style="font-size:14px;color:#667781;margin-top:4px;">Tap the pencil button to share your first story</div>
      </div>`;
    } else {
      sec.innerHTML=`<div style="padding:12px 16px 4px;font-size:13px;font-weight:600;color:#667781;text-transform:uppercase;letter-spacing:0.3px;">My Stories (${myStories.length}/3)</div>`;
      myStories.forEach(s=>sec.appendChild(buildStoryCard(s,true)));
    }
    lucide.createIcons();
    return;
  }

  const cardsEl=$('stories-cards');
  if(!feed.length){
    cardsEl.innerHTML=`<div class="stories-empty-mine" style="margin-top:32px;">
      <i data-lucide="newspaper" style="width:40px;height:40px;color:#00A884;margin-bottom:8px;"></i>
      <div style="font-size:16px;font-weight:600;color:#111b21;">No stories here yet</div>
      <div style="font-size:14px;color:#667781;margin-top:4px;">Stories from your network will appear here</div>
    </div>`;
    lucide.createIcons();
    return;
  }
  feed.sort((a,b)=>b.timestamp-a.timestamp).forEach(s=>cardsEl.appendChild(buildStoryCard(s,false)));
  lucide.createIcons();
}

function buildStoryCard(s, isOwn){
  const p=PERSONAS[s.authorId];
  const name=s.authorName||(p?p.name:(isOwn?'You':'Unknown'));
  const replyCount=(s.replies||[]).length;
  const card=document.createElement('div');
  card.className='story-feed-card';
  card.id='scard-'+s.id;

  const ttsBtn=canTTS()?`<button class="story-tts-btn" onclick="speakStoryCard(this,'${s.id}')" aria-label="Read aloud">
    <i data-lucide="volume-2" style="width:20px;height:20px;"></i>
  </button>`:'';

  const deleteBtn=isOwn?`<button class="story-delete-btn" onclick="deleteMyStory('${s.id}')" aria-label="Delete story">
    <i data-lucide="trash-2" style="width:18px;height:18px;"></i>
  </button>`:'';

  card.innerHTML=`
    <div class="story-feed-card__header">
      <div class="story-feed-card__avatar-wrap">
        ${isOwn?`<div class="story-feed-card__avatar-mine">${avatar('You','md')}</div>`
               :`<div class="chat-avatar-story-ring">${avatar(name,'md')}</div>`}
      </div>
      <div class="story-feed-card__meta">
        <div class="story-feed-card__name">${isOwn?'You':name}</div>
        <div class="story-feed-card__time">${fdate(s.timestamp)}</div>
      </div>
      <div style="display:flex;gap:4px;align-items:center;">
        ${ttsBtn}${deleteBtn}
      </div>
    </div>
    <div class="story-feed-card__text">${s.text}</div>
    <div class="story-feed-card__footer">
      <button class="story-replies-btn" onclick="toggleStoryComments('${s.id}')">
        <i data-lucide="message-circle" style="width:18px;height:18px;"></i>
        <span>${replyCount>0?`${replyCount} repl${replyCount===1?'y':'ies'}`:'Reply'}</span>
      </button>
    </div>
    <div class="story-comments" id="comments-${s.id}" style="display:none;"></div>
  `;
  return card;
}

function toggleStoryComments(storyId){
  const el=$('comments-'+storyId);
  if(!el) return;
  if(el.style.display==='none'){
    el.style.display='block';
    renderStoryComments(storyId);
  } else {
    el.style.display='none';
  }
}

function renderStoryComments(storyId){
  const s=(S.stories||[]).find(x=>x.id===storyId);
  if(!s) return;
  const el=$('comments-'+storyId);
  const replies=s.replies||[];

  el.innerHTML=`
    <div class="story-comments__list" id="clist-${storyId}">
      ${replies.length===0?`<div class="story-comments__empty">Be the first to reply!</div>`
        :replies.map(r=>`
          <div class="story-comment">
            <div class="story-comment__avatar">${avatar(r.from==='user'?'You':(PERSONAS[r.from]?.name||r.from),'sm')}</div>
            <div class="story-comment__body">
              <div class="story-comment__name">${r.from==='user'?'You':(PERSONAS[r.from]?.name||r.from)}</div>
              <div class="story-comment__text">${r.text}</div>
            </div>
          </div>`).join('')}
    </div>
    <div class="story-comments__input">
      <input class="story-comments__field" id="creply-${storyId}" placeholder="Write a reply..." />
      <button class="story-comments__send" onclick="sendStoryReply('${storyId}')">
        <i data-lucide="send" style="width:18px;height:18px;color:#fff;"></i>
      </button>
    </div>
  `;
  lucide.createIcons();
}

async function sendStoryReply(storyId){
  const input=$('creply-'+storyId);
  const text=input?.value?.trim();
  if(!text) return;
  input.value='';

  const msg=mkMsg('user','text',text);
  const upd=S.stories.map(x=>x.id===storyId?{...x,replies:[...(x.replies||[]),msg]}:x);
  set({stories:upd});

  const clist=$('clist-'+storyId);
  if(clist){
    clist.insertAdjacentHTML('beforeend',`
      <div class="story-comment">
        <div class="story-comment__avatar">${avatar('You','sm')}</div>
        <div class="story-comment__body">
          <div class="story-comment__name">You</div>
          <div class="story-comment__text">${text}</div>
        </div>
      </div>`);
    clist.scrollTop=clist.scrollHeight;
  }

  // Update reply count chip
  const btn=$('scard-'+storyId)?.querySelector('.story-replies-btn span');
  const s=(S.stories||[]).find(x=>x.id===storyId);
  if(btn&&s){const c=(s.replies||[]).length;btn.textContent=`${c} repl${c===1?'y':'ies'}`;}

  // AI reaction after short delay
  const story=(S.stories||[]).find(x=>x.id===storyId);
  if(!story||story.authorId==='user') return;
  await delay(1500+Math.random()*1000);
  const aiText=await claude(story.authorId,[msg],`React warmly and briefly to this reply on your story. Story: "${story.text.slice(0,100)}". Reply: "${text}"`);
  const aiMsg=mkMsg(story.authorId,'text',aiText);
  const upd2=S.stories.map(x=>x.id===storyId?{...x,replies:[...(x.replies||[]),aiMsg]}:x);
  set({stories:upd2});
  const clist2=$('clist-'+storyId);
  if(clist2){
    const p=PERSONAS[story.authorId];
    clist2.insertAdjacentHTML('beforeend',`
      <div class="story-comment">
        <div class="story-comment__avatar">${avatar(p?.name||story.authorName,'sm')}</div>
        <div class="story-comment__body">
          <div class="story-comment__name">${p?.name||story.authorName}</div>
          <div class="story-comment__text">${aiText}</div>
        </div>
      </div>`);
    clist2.scrollTop=clist2.scrollHeight;
  }
  const btn2=$('scard-'+storyId)?.querySelector('.story-replies-btn span');
  const s2=(S.stories||[]).find(x=>x.id===storyId);
  if(btn2&&s2){const c=(s2.replies||[]).length;btn2.textContent=`${c} repl${c===1?'y':'ies'}`;}
}

function speakStoryCard(btn,storyId){
  const s=(S.stories||[]).find(x=>x.id===storyId);if(!s)return;
  speakMsg(btn,storyId,s.text);
}

function deleteMyStory(storyId){
  set({stories:S.stories.filter(s=>s.id!==storyId)});
  renderStories('mystories');
  toast('Story deleted');
}
function renderStoryView(storyId){
  // Stories now have inline comments — redirect to stories tab
  navigate('#/stories');
}
function showStoryCompose(){
  const myCount=(S.stories||[]).filter(s=>s.authorId==='user'&&(Date.now()-s.timestamp)<7*86400000).length;
  if(myCount>=3){toast('You have 3 active stories. Delete one to post a new one.');return;}

  const bk=sheet(`<div class="bottom-sheet__handle"></div>
    <div class="bottom-sheet__title">Share a Story</div>
    <div class="compose-chips" id="sc-chips"></div>
    <textarea class="compose-textarea" id="sc-text" placeholder="What would you like to share? Speak or type..." rows="5" style="font-size:16px;line-height:1.6;"></textarea>
    <div style="display:flex;gap:10px;margin-top:8px;">
      <button class="compose-mic-btn" id="sc-mic" title="Speak your story">${IC.mic}</button>
      <button class="story-ai-btn" id="sc-ai" title="Polish with AI" style="display:none;">
        <i data-lucide="sparkles" style="width:18px;height:18px;"></i> Polish
      </button>
      <button class="compose-post-btn" id="sc-post" disabled style="flex:1;">Post Story</button>
    </div>
    <div style="font-size:12px;color:#8696a0;margin-top:8px;text-align:center;">Stories visible to community members · Expire after 7 days · ${3-myCount} slot${3-myCount===1?'':'s'} remaining</div>
  `);
  lucide.createIcons();

  const chips=['A recipe I love','A childhood memory','My opinion on...','Something I learned'];
  const chipsDiv=$('sc-chips');
  chips.forEach(c=>{const b=document.createElement('button');b.className='compose-chip';b.textContent=c;b.onclick=()=>{$('sc-text').value=c+': ';$('sc-text').focus();$('sc-post').disabled=false;$('sc-ai').style.display='flex';};chipsDiv.appendChild(b);});

  $('sc-text').oninput=()=>{
    const has=!!$('sc-text').value.trim();
    $('sc-post').disabled=!has;
    $('sc-ai').style.display=has?'flex':'none';
  };

  let scRec=false,scTxt='';
  $('sc-mic').onclick=()=>{
    if(!canSTT()){toast('Voice input not available on this browser');return;}
    if(scRec){stopRec();scRec=false;$('sc-mic').classList.remove('recording');$('sc-mic').innerHTML=IC.mic;return;}
    scRec=true;scTxt=$('sc-text').value;$('sc-mic').classList.add('recording');$('sc-mic').innerHTML=IC.micOff;
    startRec({
      onInterim:t=>{$('sc-text').value=scTxt+t;},
      onFinal:t=>{scTxt+=t+' ';$('sc-text').value=scTxt.trim();$('sc-post').disabled=false;$('sc-ai').style.display='flex';},
      onError:()=>{scRec=false;$('sc-mic').classList.remove('recording');$('sc-mic').innerHTML=IC.mic;},
      onEnd:()=>{scRec=false;$('sc-mic').classList.remove('recording');$('sc-mic').innerHTML=IC.mic;}
    });
  };

  $('sc-ai').onclick=async()=>{
    const raw=$('sc-text').value.trim();if(!raw)return;
    $('sc-ai').disabled=true;$('sc-ai').innerHTML='<i data-lucide="loader-2" style="width:18px;height:18px;"></i> Polishing...';
    lucide.createIcons();
    const polished=await claude('meenakshiamma',[],`You are a gentle writing assistant for elderly users. Take this rough draft and make it warm, clear and readable — keeping the person's own voice and all the personal details. Keep it under 150 words. Raw text: "${raw}"`);
    $('sc-text').value=polished;
    $('sc-ai').disabled=false;$('sc-ai').innerHTML='<i data-lucide="sparkles" style="width:18px;height:18px;"></i> Polish';
    lucide.createIcons();
  };

  $('sc-post').onclick=()=>{
    const t=$('sc-text').value.trim();if(!t)return;
    const s=mkStory('user','You',t);
    set({stories:[s,...S.stories]});
    closeSheet(bk);toast('Story shared! ✨');renderStories('mystories');
    setTimeout(()=>triggerStoryReactions(s),6000+Math.random()*4000);
  };
}
async function triggerStoryReactions(story){
  const reactors=PERSONA_LIST.slice(0,2);
  for(const p of reactors){
    await delay(3000+Math.random()*3000);
    const t=await claude(p.id,[],`React briefly and warmly to this community story: "${story.text.slice(0,120)}"`);
    const m=mkMsg(p.id,'text',t);
    const upd=S.stories.map(s=>s.id===story.id?{...s,replies:[...(s.replies||[]),m]}:s);
    set({stories:upd});
  }
}

/* ── SHEET HELPERS ── */
function sheet(innerHtml){
  const bk=document.createElement('div');bk.className='bottom-sheet-backdrop';
  bk.onclick=e=>{if(e.target===bk)bk.remove();};
  const sh=document.createElement('div');sh.className='bottom-sheet';sh.innerHTML=innerHtml;
  bk.appendChild(sh);app().appendChild(bk);return bk;
}
function closeSheet(bk){if(bk&&bk.parentNode)bk.remove();}

/* ── COMMUNITIES ── */
function renderCommunities(){
  mount(`
    ${resBar()}
    <div class="header">
      <div class="header__title" onclick="headerTap()"><h1>Communities</h1></div>
      <div class="header__actions">
        <button class="header__action-btn" aria-label="Search">${IC.search}</button>
        <button class="header__action-btn" aria-label="More">${IC.more}</button>
      </div>
    </div>
    <div class="sub-tabs"><button class="sub-tab active" id="ct-joined" onclick="showCommTab('joined')">Joined</button><button class="sub-tab" id="ct-discover" onclick="showCommTab('discover')">Discover</button></div>
    <div class="screen"><div class="screen__scroll" id="comm-content"></div></div>
    ${bottomNav('communities')}
  `);
  showCommTab('joined');
}
function showCommTab(tab){
  ['joined','discover'].forEach(t=>{const b=$('ct-'+t);if(b)b.className='sub-tab'+(t===tab?' active':'');});
  const c=$('comm-content');if(!c)return;c.innerHTML='';
  if(tab==='joined'){
    const joined=S.joinedCommunities||[];
    if(!joined.length){c.innerHTML='<div class="empty-state"><div class="empty-state__icon">👥</div><div class="empty-state__title">No communities yet</div><div class="empty-state__desc">Go to Discover to join communities.</div></div>';return;}
    joined.forEach(id=>{const comm=COMMUNITIES[id];if(!comm)return;c.appendChild(commCard(comm,true));});
    // Also add all available communities with join option
    Object.values(COMMUNITIES).filter(c=>!joined.includes(c.id)).forEach(comm=>c.appendChild(commCard(comm,false)));
  } else {
    c.insertAdjacentHTML('afterbegin','<div class="tag-filter-row" id="tag-row"></div>');
    const tags=[...new Set(Object.values(COMMUNITIES).flatMap(c=>c.tags))];
    const tagRow=$('tag-row');let activeTag=null;
    function renderDiscover(filterTag){
      const existing=c.querySelectorAll('.community-card');existing.forEach(e=>e.remove());
      Object.values(COMMUNITIES).filter(comm=>!filterTag||comm.tags.includes(filterTag)).forEach(comm=>c.appendChild(commCard(comm,S.joinedCommunities.includes(comm.id))));
    }
    tags.forEach(tag=>{const b=document.createElement('button');b.className='tag-chip tag-chip--filter';b.textContent=tag;b.onclick=()=>{activeTag=activeTag===tag?null:tag;tagRow.querySelectorAll('.tag-chip--filter').forEach(x=>x.classList.remove('active'));if(activeTag)b.classList.add('active');renderDiscover(activeTag);};tagRow.appendChild(b);});
    renderDiscover(null);
  }
}
function commCard(comm,joined){
  const div=document.createElement('div');div.className='community-card';
  const groupEmoji=comm.tags[0]==='cricket'?'🏏':comm.tags[0]==='bollywood'?'🎬':comm.tags[0]==='bhajan'||comm.tags[0]==='spirituality'?'🙏':comm.tags[0]==='society'?'🏢':comm.tags[0]==='cooking'||comm.tags[0]==='recipes'?'🍛':'👥';
  div.innerHTML=`<div class="community-card__icon" style="background:${comm.color||'#00897B'}">${groupEmoji}</div><div class="community-card__body"><div class="community-card__name">${comm.name}</div><div class="community-card__meta"><span style="font-size:11.5px;color:#667781;">Group · ${comm.members} members</span></div><div class="community-card__desc">${comm.desc}</div></div><button class="community-card__join-btn${joined?' joined':''}" onclick="toggleJoin(event,'${comm.id}')">${joined?'✓ Joined':'Join'}</button>`;
  div.onclick=e=>{if(e.target.classList.contains('community-card__join-btn'))return;navigate('#/community/'+comm.id);};
  return div;
}
function toggleJoin(e,commId){
  e.stopPropagation();
  const joined=[...S.joinedCommunities];
  const idx=joined.indexOf(commId);
  if(idx>=0)joined.splice(idx,1);else joined.push(commId);
  set({joinedCommunities:joined});
  showCommTab('discover');
}

/* ── COMMUNITY FEED ── */
function renderCommunity(commId){
  const comm=COMMUNITIES[commId];if(!comm){navigate('#/communities');return;}
  const right=[];
  if(comm.voiceRoom) right.push({icon:IC.voiceRoom,label:'Voice Room',fn:`navigate('#/voiceroom/${comm.voiceRoom}')`});
  mount(`
    ${header(comm.name,{back:true,subtitle:`${comm.members} members`,right})}
    <div class="screen chat-screen" id="comm-wrap">
      <div class="chat-messages" id="comm-msgs"></div>
    </div>
  `);
  const msgs=$('comm-msgs');
  msgs.insertAdjacentHTML('beforeend',`<div style="text-align:center;margin:8px 0;"><div style="display:inline-block;background:#fdf4c5;color:#54656f;font-size:11.5px;padding:5px 10px;border-radius:7px;line-height:1.4;max-width:260px;">🔒 Messages are end-to-end encrypted.</div></div>`);
  let lastDateC='';
  (S.communities[commId]||[]).forEach(m=>{
    const d=new Date(m.timestamp).toDateString();
    if(d!==lastDateC){lastDateC=d;const today=new Date().toDateString();const yday=new Date(Date.now()-86400000).toDateString();const label=d===today?'Today':d===yday?'Yesterday':new Date(m.timestamp).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});msgs.insertAdjacentHTML('beforeend',`<div class="chat-date-divider"><span>${label}</span></div>`);}
    msgs.insertAdjacentHTML('beforeend',bubble(m));
  });
  scrollBot(msgs);
  renderInputBar('comm-wrap',{placeholder:'Message community',onSend:async({type,text})=>{
    const msg=mkMsg('user',type,text);
    addMsg('communities',commId,msg);
    msgs.insertAdjacentHTML('beforeend',bubble(msg));
    scrollBot(msgs);
    msgs.insertAdjacentHTML('beforeend',typingHTML());scrollBot(msgs);
    await delay(1500+Math.random()*1000);
    const ti=$('typing');if(ti)ti.remove();
    const responderId=comm.personas[Math.floor(Math.random()*comm.personas.length)];
    const note=`You are in the "${comm.name}" community group (${comm.tags.join(', ')}). A member just posted: "${text}". Reply naturally as part of this group.`;
    const resp=await claude(responderId,S.communities[commId]||[],note);
    const aiMsg=mkMsg(responderId,'text',resp);
    addMsg('communities',commId,aiMsg);
    msgs.insertAdjacentHTML('beforeend',bubble(aiMsg));
    scrollBot(msgs);
  }});
}

/* ── VOICE ROOMS LIST ── */
function renderVoiceRooms(){
  mount(`
    ${resBar()}
    <div class="header">
      <div class="header__title" onclick="headerTap()"><h1>Calls</h1></div>
      <div class="header__actions">
        <button class="header__action-btn" aria-label="Search">${IC.search}</button>
        <button class="header__action-btn" aria-label="More">${IC.more}</button>
      </div>
    </div>
    <div class="screen"><div class="screen__scroll" id="vr-list" style="background:#fff;"></div></div>
    ${bottomNav('voicerooms')}
  `);
  const list=$('vr-list');
  list.insertAdjacentHTML('beforeend',`<div class="section-heading" style="text-transform:uppercase;font-size:12px;color:#667781;padding:12px 16px 4px;font-weight:600;letter-spacing:0.05em;">Live Voice Rooms</div>`);
  Object.values(VOICE_ROOMS).forEach(room=>{
    const div=document.createElement('div');div.className='voice-room-card';
    const firstPersona=PERSONAS[room.personas[0]];
    const parts=room.personas.slice(0,3).map(id=>avatar(PERSONAS[id]?.name||'?','sm')).join('');
    div.innerHTML=`
      <div style="display:flex;align-items:center;gap:14px;padding:12px 16px;cursor:pointer;">
        <div style="position:relative;">${avatar(room.name,'md')}<div style="position:absolute;bottom:0;right:0;width:14px;height:14px;background:#ea4335;border-radius:50%;border:2px solid #fff;"></div></div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div class="voice-room-card__name">${room.name}</div>
            <div class="voice-room-card__live"><div class="live-dot"></div>LIVE</div>
          </div>
          <div class="voice-room-card__theme">${room.themeTag}</div>
          <div class="voice-room-card__participants" style="margin-top:4px;">${parts}</div>
        </div>
        <button style="background:#25d366;border:none;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:#fff;cursor:pointer;">${IC.phone}</button>
      </div>`;
    div.querySelector('div').onclick=()=>navigate('#/voiceroom/'+room.id);
    list.appendChild(div);
  });
  // FAB
  list.insertAdjacentHTML('beforeend',`<button class="fab" onclick="toast('New call coming soon')" aria-label="New call">${IC.phone}</button>`);
}

/* ── VOICE ROOM ── */
let _vrInterval=null,_vrQuietTimer=null;
function renderVoiceRoom(roomId){
  const room=VOICE_ROOMS[roomId];if(!room){navigate('#/voicerooms');return;}
  if(_vrInterval)clearInterval(_vrInterval);
  if(_vrQuietTimer)clearTimeout(_vrQuietTimer);
  if(!S.voiceRooms[roomId])S.voiceRooms[roomId]={transcript:room.seed.map((l,i)=>({id:mkId(),personaId:l.personaId,text:l.text,timestamp:Date.now()-(room.seed.length-i)*60000}))};

  mount(`
    <div class="voice-room-screen">
      ${header(room.name,{back:true,subtitle:room.themeTag})}
      <div class="participant-grid" id="vr-grid"></div>
      <div class="voice-transcript" id="vr-transcript"></div>
      <div class="voice-room-input" id="vr-input-wrap">
        <input class="voice-room-input__field" id="vr-field" placeholder="Say something..." />
        <button class="voice-room-input__mic" id="vr-mic" aria-label="Record">${IC.mic}</button>
      </div>
    </div>
  `);

  // Participants grid
  const grid=$('vr-grid');
  let speakingIdx=0;
  room.personas.forEach((pid,i)=>{
    const p=PERSONAS[pid];if(!p)return;
    const tile=document.createElement('div');tile.className='participant-tile';tile.id='vr-p-'+pid;
    tile.innerHTML=`<div class="participant-tile__ring${i===0?' speaking':''}">${avatar(p.name,'lg')}</div><div class="participant-tile__name">${p.name.split(' ')[0]}</div>`;
    grid.appendChild(tile);
  });

  // Transcript
  const tc=$('vr-transcript');
  S.voiceRooms[roomId].transcript.forEach(l=>tc.insertAdjacentHTML('beforeend',transcriptLine(l)));
  scrollBot(tc);

  // Rotate speaking ring
  const speakRing=setInterval(()=>{
    document.querySelectorAll('.participant-tile__ring').forEach(r=>r.classList.remove('speaking'));
    speakingIdx=(speakingIdx+1)%room.personas.length;
    const tile=$('vr-p-'+room.personas[speakingIdx]);
    if(tile)tile.querySelector('.participant-tile__ring')?.classList.add('speaking');
  },3000);

  // AI transcript generation
  function scheduleNextLine(){
    if(_vrInterval)clearInterval(_vrInterval);
    const ms=8000+Math.random()*4000;
    _vrInterval=setTimeout(async()=>{
      if(!document.getElementById('vr-transcript'))return;
      clearTimeout(_vrQuietTimer);
      const r=await callClaudeForVoiceRoom(roomId,S.voiceRooms[roomId].transcript);
      if(r&&document.getElementById('vr-transcript')){
        const line={id:mkId(),personaId:r.personaId,text:r.text,timestamp:Date.now()};
        S.voiceRooms[roomId].transcript.push(line);saveS();
        $('vr-transcript').insertAdjacentHTML('beforeend',transcriptLine(line));
        scrollBot($('vr-transcript'));
        removeQuietPrompt();
      }
      setQuietTimer();
      scheduleNextLine();
    },ms);
  }

  function setQuietTimer(){
    clearTimeout(_vrQuietTimer);
    _vrQuietTimer=setTimeout(()=>{
      if(document.getElementById('vr-transcript'))showQuietPrompt(room);
    },15000);
  }

  scheduleNextLine();setQuietTimer();

  // Text input
  const field=$('vr-field');
  field.addEventListener('keydown',e=>{if(e.key==='Enter')sendVRMsg(roomId,field.value.trim());});

  // Mic button
  let vrRec=false;const micBtn=$('vr-mic');
  micBtn.onclick=()=>{
    if(!canSTT()){toast('Voice not available');return;}
    if(vrRec){stopRec();vrRec=false;micBtn.classList.remove('recording');micBtn.innerHTML=IC.mic;return;}
    vrRec=true;micBtn.classList.add('recording');micBtn.innerHTML=IC.micOff;
    let vrTxt='';
    startRec({onInterim:t=>{vrTxt=t;field.value=t;},onFinal:t=>{vrTxt=t;field.value=t;},
      onError:()=>{vrRec=false;micBtn.classList.remove('recording');micBtn.innerHTML=IC.mic;},
      onEnd:()=>{vrRec=false;micBtn.classList.remove('recording');micBtn.innerHTML=IC.mic;if(vrTxt.trim())sendVRMsg(roomId,vrTxt.trim());field.value='';}
    });
  };

  // Cleanup on navigation
  const origGoBack=window._vrCleanup;
  window._vrCleanup=()=>{clearInterval(speakRing);clearTimeout(_vrInterval);clearTimeout(_vrQuietTimer);_vrInterval=null;_vrQuietTimer=null;};
}

async function callClaudeForVoiceRoom(roomId,transcript){
  const room=VOICE_ROOMS[roomId];if(!room)return null;
  const pid=room.personas[Math.floor(Math.random()*room.personas.length)];
  const recent=transcript.slice(-5).map(l=>`${PERSONAS[l.personaId]?.name||'?'}: ${l.text}`).join('\n');
  const note=`You are in a live voice room called "${room.name}" (theme: ${room.theme}). Recent:\n${recent||'(just started)'}\nContinue the conversation naturally. 1-2 sentences only, as if speaking aloud.`;
  const t=await claude(pid,[mkMsg('user','text','Continue')],note);
  return{personaId:pid,text:t};
}

async function sendVRMsg(roomId,text){
  if(!text)return;
  const field=$('vr-field');if(field)field.value='';
  const tc=$('vr-transcript');if(!tc)return;
  const userLine={id:mkId(),personaId:'user',text,timestamp:Date.now()};
  tc.insertAdjacentHTML('beforeend',transcriptLineUser(userLine));
  scrollBot(tc);
  removeQuietPrompt();
  clearTimeout(_vrQuietTimer);
  await delay(1500+Math.random()*1000);
  const room=VOICE_ROOMS[roomId];if(!room)return;
  const pid=room.personas[Math.floor(Math.random()*room.personas.length)];
  const note=`You are in voice room "${room.name}". A participant just said: "${text}". Respond naturally and briefly.`;
  const resp=await claude(pid,[mkMsg('user','text',text)],note);
  if(!$('vr-transcript'))return;
  const line={id:mkId(),personaId:pid,text:resp,timestamp:Date.now()};
  if(S.voiceRooms[roomId]){S.voiceRooms[roomId].transcript.push(line);saveS();}
  $('vr-transcript').insertAdjacentHTML('beforeend',transcriptLine(line));
  scrollBot($('vr-transcript'));
  clearTimeout(_vrQuietTimer);_vrQuietTimer=setTimeout(()=>{if($('vr-transcript'))showQuietPrompt(room);},15000);
}

function transcriptLine(line){
  const p=PERSONAS[line.personaId];const name=p?p.name.split(' ')[0]:'?';
  const spk=canTTS()?`<button class="transcript-line__play" onclick="speakTL(this,'${line.id.replace(/'/g,"\\'")}','${(line.text||'').replace(/'/g,"\\'").replace(/\n/g,' ').slice(0,200)}')" aria-label="Play">${IC.play}</button>`:'';
  return`<div class="transcript-line" id="tl-${line.id}"><div class="transcript-line__speaker">${name}</div><div class="transcript-line__text">${line.text}</div><div class="transcript-line__actions">${spk}<span style="font-size:.75rem;color:rgba(255,255,255,.4)">${ftime(line.timestamp)}</span></div></div>`;
}
function transcriptLineUser(line){
  return`<div class="transcript-line" id="tl-${line.id}"><div class="transcript-line__speaker" style="color:#fff">You</div><div class="transcript-line__text">${line.text}</div></div>`;
}
function speakTL(btn,id,text){
  if(_playing[id]){stopSpeak();delete _playing[id];btn.innerHTML=IC.play;return;}
  Object.keys(_playing).forEach(k=>{delete _playing[k];document.querySelectorAll('.transcript-line__play').forEach(b=>b.innerHTML=IC.play);});
  speak(text,()=>{delete _playing[id];btn.innerHTML=IC.play;});
  _playing[id]=true;btn.innerHTML=IC.pause;
}
function showQuietPrompt(room){
  removeQuietPrompt();
  const tc=$('vr-transcript');if(!tc)return;
  const div=document.createElement('div');div.className='quiet-prompt';div.id='quiet-prompt';
  div.innerHTML=`<div>It's gone quiet — ask something!</div><div class="quiet-prompt__chips">${room.quietChips.map(c=>`<button class="quiet-prompt__chip" onclick="sendVRMsg('${room.id}','${c.replace(/'/g,"\\'")}');removeQuietPrompt()">${c}</button>`).join('')}</div>`;
  tc.appendChild(div);scrollBot(tc);
}
function removeQuietPrompt(){const q=$('quiet-prompt');if(q)q.remove();}

/* ── GAMES HUB ── */
function renderGames(){
  const activeGames=Object.values(S.games).filter(g=>g.status==='active');
  const recentGames=Object.values(S.games).filter(g=>g.status==='completed').slice(-5);
  mount(`
    ${resBar()}
    <div class="header">
      <div class="header__title" onclick="headerTap()"><h1>Games</h1></div>
      <div class="header__actions">
        <button class="header__action-btn" aria-label="More">${IC.more}</button>
      </div>
    </div>
    <div class="screen game-hub-screen"><div class="screen__scroll" id="games-scroll"></div></div>
    ${bottomNav('games')}
  `);
  const sc=$('games-scroll');
  sc.insertAdjacentHTML('beforeend',`<button class="start-game-btn" onclick="showGameSheet(null)">${IC.add} Start New Game</button>`);
  if(activeGames.length){
    sc.insertAdjacentHTML('beforeend','<div class="section-heading">Active Games</div>');
    activeGames.forEach(g=>sc.appendChild(gameCard(g)));
  }
  sc.insertAdjacentHTML('beforeend','<div class="section-heading">Coming Soon</div>');
  sc.insertAdjacentHTML('beforeend',`<div class="game-card" style="opacity:.5"><div class="game-card__icon">🔤</div><div class="game-card__body"><div class="game-card__title">Word Chain</div><div class="game-card__subtitle">Coming soon</div></div></div>`);
  sc.insertAdjacentHTML('beforeend',`<div class="game-card" style="opacity:.5"><div class="game-card__icon">🏏</div><div class="game-card__body"><div class="game-card__title">Cricket Trivia</div><div class="game-card__subtitle">Coming soon</div></div></div>`);
  if(recentGames.length){
    sc.insertAdjacentHTML('beforeend','<div class="section-heading">Recent</div>');
    recentGames.reverse().forEach(g=>sc.appendChild(gameCard(g)));
  }
}
function gameCard(g){
  const p=PERSONAS[g.opponentId];const gt=gameTypes[g.type]||{emoji:'🎮',name:g.type};
  const div=document.createElement('div');div.className='game-card';
  div.innerHTML=`<div class="game-card__icon">${gt.emoji}</div><div class="game-card__body"><div class="game-card__title">${gt.name}</div><div class="game-card__subtitle">vs ${p?.name||'?'}</div><div class="game-card__meta">${g.status==='active'?'Your turn':'Completed'}</div></div>`;
  if(g.status==='active') div.onclick=()=>navigate(`#/game/${g.id}/${g.type}`);
  return div;
}
const gameTypes={
  antakshari:{emoji:'🎵',name:'Antakshari',desc:'Song chain — last letter starts next song'},
  'trivia-bollywood':{emoji:'🎬',name:'Bollywood Trivia',desc:'Questions about Hindi films'},
};
function showGameSheet(fromPersonaId){
  let selType=null,selPersona=fromPersonaId;
  const bk=sheet(`
    <div class="bottom-sheet__handle"></div>
    <div class="bottom-sheet__title">Start a New Game</div>
    <div id="gs-type" class="game-picker-sheet"></div>
    ${!fromPersonaId?`<div class="bottom-sheet__title" style="margin-top:.75rem;font-size:.9375rem;">Choose opponent</div><div id="gs-persona" class="persona-picker-list"></div>`:''}
    <button class="sheet-confirm-btn" id="gs-go" disabled>Start Game →</button>
  `);
  const typePicker=$('gs-type');
  Object.values(gameTypes).forEach(gt=>{
    const b=document.createElement('button');b.className='game-type-option';
    b.innerHTML=`<span class="game-type-option__emoji">${gt.emoji}</span><div class="game-type-option__body"><div class="game-type-option__name">${gt.name}</div><div class="game-type-option__desc">${gt.desc}</div></div>`;
    b.onclick=()=>{typePicker.querySelectorAll('.game-type-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selType=gt.id;checkReady();};
    typePicker.appendChild(b);
  });
  if(!fromPersonaId){
    const pp=$('gs-persona');
    PERSONA_LIST.forEach(p=>{
      const b=document.createElement('button');b.className='persona-pick-item';
      b.innerHTML=`${avatar(p.name,'sm')}<div><div class="persona-pick-item__name">${p.name}</div><div class="persona-pick-item__city">${p.city}</div></div>`;
      b.onclick=()=>{pp.querySelectorAll('.persona-pick-item').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selPersona=p.id;checkReady();};
      pp.appendChild(b);
    });
  }
  function checkReady(){if($('gs-go'))$('gs-go').disabled=!(selType&&selPersona);}
  $('gs-go').onclick=()=>{
    if(!selType||!selPersona)return;
    closeSheet(bk);
    const gameId=mkGameId();
    const gs={id:gameId,type:selType,opponentId:selPersona,status:'active',currentLetter:'',score:{user:0,ai:0},questionNumber:1,lastQuestion:'',messages:[],createdAt:Date.now(),completedAt:null};
    set({games:{...S.games,[gameId]:gs}});
    navigate(`#/game/${gameId}/${selType}`);
  };
}

/* ── GAME SCREEN ── */
function renderGame(gameId,gameType){
  const gs=S.games[gameId];
  const persona=gs?PERSONAS[gs.opponentId]:null;
  if(!gs||!persona){navigate('#/games');return;}
  const gt=gameTypes[gameType]||{emoji:'🎮',name:gameType};

  mount(`
    ${header(`${gt.emoji} ${gt.name}`,{back:true,subtitle:`vs ${persona.name}`})}
    <div class="game-status-bar" id="game-status">${renderGameStatus(gs)}</div>
    <div class="screen game-screen" id="game-wrap">
      <div class="chat-messages" id="game-msgs" style="background:#ECE5DD;"></div>
    </div>
  `);

  const msgs=$('game-msgs');
  (gs.messages||[]).forEach(m=>msgs.insertAdjacentHTML('beforeend',bubble(m)));

  // First move if no messages
  if(!gs.messages||!gs.messages.length){
    setTimeout(()=>startGameFirstMove(gameId,gameType,msgs),500);
  }

  scrollBot(msgs);
  renderInputBar('game-wrap',{placeholder:'Your move...',onSend:async({type,text})=>{
    const userMsg=mkMsg('user',type,text);
    gs.messages=[...(gs.messages||[]),userMsg];
    S.games[gameId]=gs;saveS();
    msgs.insertAdjacentHTML('beforeend',bubble(userMsg));
    scrollBot(msgs);
    msgs.insertAdjacentHTML('beforeend',typingHTML());scrollBot(msgs);
    await delay(1500+Math.random()*1000);
    const ti=$('typing');if(ti)ti.remove();
    const note=buildGameNote(gameType,gs,text);
    const resp=await claude(gs.opponentId,gs.messages||[],note);
    const aiMsg=mkMsg(gs.opponentId,'text',resp);
    gs.messages=[...(gs.messages||[]),aiMsg];
    updateGameState(gameId,gameType,gs,text,resp);
    msgs.insertAdjacentHTML('beforeend',bubble(aiMsg));
    const statusBar=$('game-status');if(statusBar)statusBar.innerHTML=renderGameStatus(S.games[gameId]);
    scrollBot(msgs);
  }});
}
function renderGameStatus(gs){
  if(gs.type==='antakshari') return`<div class="game-status-bar__item"><div class="game-status-bar__value">${gs.currentLetter||'?'}</div><div class="game-status-bar__label">Current Letter</div></div>`;
  if(gs.type.startsWith('trivia')) return`<div class="game-status-bar__item"><div class="game-status-bar__value">Q${gs.questionNumber||1}</div><div class="game-status-bar__label">Question</div></div><div class="game-status-bar__item"><div class="game-status-bar__value">${gs.score?.user||0}–${gs.score?.ai||0}</div><div class="game-status-bar__label">Score</div></div>`;
  return`<div class="game-status-bar__item"><div class="game-status-bar__value">${gt?.emoji||'🎮'}</div><div class="game-status-bar__label">Playing</div></div>`;
}
function buildGameNote(gameType,gs,userMove){
  if(gameType==='antakshari') return`You are playing Antakshari. User said: "${userMove}". Check if it's a real Bollywood/Indian song and starts with letter "${gs.currentLetter||'any'}". If valid, acknowledge it warmly and give your song starting with the last letter of their song. Clearly state the new required letter. Format: "[User song] ✓ | My song: [Your Song] — [Film] | Your letter: [letter]"`;
  if(gameType==='trivia-bollywood'){const q=BOLLYWOOD_QUESTIONS[(gs.questionNumber-1)%BOLLYWOOD_QUESTIONS.length];return`You are playing Bollywood Trivia. ${gs.lastQuestion?`User answered "${userMove}" to "${gs.lastQuestion}". The correct answer is "${q.a}". Say if correct/incorrect, give right answer if wrong. Then ask the next question.`:`Ask question: "${q.q}"`}`;}
  return`You are playing ${gameType}. User said: "${userMove}". Respond naturally.`;
}
function updateGameState(gameId,gameType,gs,userMove,aiResp){
  if(gameType==='antakshari'){
    const match=aiResp.match(/letter:\s*([A-Za-z])/i);
    if(match)gs.currentLetter=match[1].toUpperCase();
  }
  if(gameType.startsWith('trivia')){
    const q=BOLLYWOOD_QUESTIONS[(gs.questionNumber-1)%BOLLYWOOD_QUESTIONS.length];
    gs.lastQuestion=q.q;gs.questionNumber=(gs.questionNumber||1)+1;
    if(aiResp.toLowerCase().includes('correct')||aiResp.toLowerCase().includes('right'))gs.score.user=(gs.score.user||0)+1;
    else gs.score.ai=(gs.score.ai||0)+1;
  }
  S.games[gameId]=gs;saveS();
}
async function startGameFirstMove(gameId,gameType,msgs){
  const gs=S.games[gameId];if(!gs)return;
  let firstMsg='';
  if(gameType==='antakshari') firstMsg=`You are starting Antakshari! Give the first Bollywood song title and tell the user what letter their song must start with (last letter of your song). Format: "I'll start! My song: [Song Name] — [Film]. Your turn — song must start with [letter]!"`;
  else if(gameType==='trivia-bollywood'){const q=BOLLYWOOD_QUESTIONS[0];firstMsg=`Start Bollywood Trivia! Ask this question: "${q.q}" — Give a warm intro first.`;}
  else firstMsg='Start the game with an introduction and first move.';
  msgs.insertAdjacentHTML('beforeend',typingHTML());
  await delay(1000+Math.random()*800);
  const ti=$('typing');if(ti)ti.remove();
  const resp=await claude(gs.opponentId,[],firstMsg);
  const aiMsg=mkMsg(gs.opponentId,'text',resp);
  gs.messages=[aiMsg];
  if(gameType==='antakshari'){const match=resp.match(/start(?:ing)? with\s+([A-Za-z])/i)||resp.match(/starts? with (?:the letter )?[""']?([A-Za-z])/i)||resp.match(/letter[:\s]+[""']?([A-Za-z])/i);if(match)gs.currentLetter=match[1].toUpperCase();}
  if(gameType.startsWith('trivia')){gs.lastQuestion=BOLLYWOOD_QUESTIONS[0].q;gs.questionNumber=1;}
  S.games[gameId]=gs;saveS();
  msgs.insertAdjacentHTML('beforeend',bubble(aiMsg));
  const statusBar=$('game-status');if(statusBar)statusBar.innerHTML=renderGameStatus(gs);
  scrollBot(msgs);
}

/* ── ICON GENERATION ── */
function generateIcons(){
  const sizes=[192,512];
  sizes.forEach(size=>{
    const canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#075E54';ctx.beginPath();ctx.roundRect(0,0,size,size,size*.15);ctx.fill();
    ctx.fillStyle='#25D366';
    const cx=size/2,cy=size*.43,r=size*.22;
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(cx-r*.35,cy+r*.15,r*.55,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#075E54';ctx.beginPath();ctx.arc(cx,cy,r*.4,0,Math.PI*2);ctx.fill();
    canvas.toBlob(blob=>{
      const url=URL.createObjectURL(blob);
      document.querySelectorAll(`link[sizes="${size}x${size}"]`).forEach(l=>l.href=url);
      if(size===192)document.querySelector('link[rel="apple-touch-icon"]').href=url;
    },'image/png');
  });
}

/* ── INIT ── */
loadS();
if('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
window.speechSynthesis?.getVoices(); // pre-load voices

// Generate icon images at runtime (no PNG files needed)
window.addEventListener('load',generateIcons);

// Initial route
const initHash=window.location.hash||'#/';
_stack=[initHash];_cur=initHash;
render();
