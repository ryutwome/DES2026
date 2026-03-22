/* ============================================================
   DES2026 — Hash-based router: navigate, goBack, render
   ============================================================ */

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
  if(window._vrCleanup){window._vrCleanup();window._vrCleanup=null;}
  const hash=window.location.hash||'#/';
  const{screen,params}=parseRoute(hash);
  if(!S.onboardingDone){set({onboardingDone:true,interests:['cooking','cricket','music','gardening','literature','spirituality']});seedData(S.interests);}
  if(!S.userName){renderNamePrompt();return;}
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
