const $ = selector => document.querySelector(selector);
const esc = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readStore(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function persist(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
let settings={voice:true,motion:false,mascot:true,memory:4,choices:2,rounds:1,companion:'cactus',...readStore('jardim-settings',{})};
let favorites=readStore('jardim-favorites',[]),records=readStore('jardim-records',[]);
if(!Array.isArray(favorites))favorites=[];
if(!Array.isArray(records))records=[];
let category='all',query='',level='all',page='catalog',limit=12,game=null,round=0,state={},session=null;
let playerFrame=0,playerPosition=8,playerLastTime=0,currentMessage='',speechVersion=0;
const LABELS={'🍉':'melancia','🍌':'banana','🍓':'morango','🌵':'cacto','🌻':'flor','🌳':'árvore','●':'círculo','▲':'triângulo','■':'quadrado','🖱️':'mouse','⌨️':'teclado','🖥️':'computador','⬆️':'para cima','➡️':'para a direita','⬇️':'para baixo','⬅️':'para a esquerda','🔵':'círculo azul','🔺':'triângulo vermelho','🟡':'círculo amarelo','🐈':'gato','🐕':'cachorro','🐦':'pássaro','🐜':'formiga','🚌':'ônibus','🚗':'carro','🌱':'broto','🔌':'carregar','✉️':'preparar mensagem','📤':'enviar','📥':'receber','🖼️':'imagem','🔘':'botão','💧':'regar','✋':'parar','☂️':'guarda-chuva','🧢':'boné','🚶':'andar','▶':'começar','Ⅱ':'pausar','↩':'voltar','＋':'adicionar','×':'fechar','💾':'salvar','🗑️':'excluir','🙋':'pedir ajuda','📂':'abrir','🔒':'proteger','👆':'tocar','💡':'luminária','wateringcan':'regador','power':'ligar','seed':'plantar a semente','wash':'lavar a fruta','serve':'servir a fruta','pairs-same':'iguais','pairs-different':'diferentes','○':'espaço vazio','basket':'cesta','?':'o que falta'};
const CATEGORY_ICONS={start:'💡',match:'🍉',memory:'pairs-same',classify:'basket',sequence:'➡️',pattern:'●',route:'🤖',repeat:'🌱',condition:'power',data:'🖥️',interface:'🔘',safety:'🔒'};
function label(x){return LABELS[x]||x}
function stopVoice(){speechVersion++;if('speechSynthesis' in window)window.speechSynthesis.cancel()}
function speak(text){
  if(!settings.voice){showToast('A voz está desligada. Você pode ativá-la em Ajustes.');return;}
  if(!('speechSynthesis' in window)){showToast('A voz não está disponível neste navegador. A cuidadora pode ler a frase.');return;}
  stopVoice();const version=speechVersion,u=new SpeechSynthesisUtterance(text);u.lang='pt-BR';u.rate=.82;
  const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang==='pt-BR')||voices.find(v=>v.lang.startsWith('pt'))||null;
  u.onerror=e=>{if(version!==speechVersion||['interrupted','canceled'].includes(e.error))return;showToast('Não foi possível ler. Confira o áudio e a voz em português do aparelho.')};window.speechSynthesis.speak(u);
}
function showToast(text){if($('#settings')?.open&&$('#voiceStatus'))$('#voiceStatus').textContent=text;const toast=$('#toast');toast.textContent=text;toast.hidden=false;clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.hidden=true,6500)}
function companion(){return `<div class="mascot-slot">${settings.mascot?`<div class="companion-mini">${settings.companion==='girl'?girl():cactus()}</div>`:''}</div>`}
function stopPlayer(){cancelAnimationFrame(playerFrame);playerFrame=0;playerLastTime=0}
function syncPlayer(){
  stopPlayer();if(!game||!state||state.player!=='playing'||$('#pause').open||session?.finished)return;
  const tick=time=>{
    if(!game||state.player!=='playing'||$('#pause').open||session?.finished)return;
    if(playerLastTime)playerPosition=(playerPosition+(time-playerLastTime)*.004)%72;
    playerLastTime=time;const actor=$('#playerActor');if(actor)actor.style.left=`${playerPosition+4}%`;
    playerFrame=requestAnimationFrame(tick);
  };playerFrame=requestAnimationFrame(tick);
}
function navigate(target){stopPlayer();stopVoice();document.body.classList.remove('focus-mode');game=null;page=target;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.page===target));if(target==='catalog')catalog();else if(target==='guide')guide();else progress();window.scrollTo(0,0)}
function hero(){return `<section class="hero"><div class="hero-copy"><span class="eyebrow"><span class="dot"></span>Aprender, um passo de cada vez</span><h1>Um toque.<br>Uma descoberta.</h1><p>Experiências de computação com imagens, voz e tempo para experimentar.</p><div class="hero-buttons"><button class="primary" id="startJourney"><span>▶</span> Começar pelo primeiro jogo</button><button class="round-button" id="heroListen" aria-label="Ouvir a apresentação">${speakerIcon()}</button></div><div class="micro"><span>Sem leitura</span><i></i><span>Sem pressa</span><i></i><span>Com companhia</span></div></div><div class="hero-art" aria-hidden="true"><div class="hero-disc"></div><div class="hero-leaf leaf-one"></div><div class="hero-leaf leaf-two"></div><div class="hero-mascot">${settings.mascot?(settings.companion==='girl'?girl():cactus()):icon('🌱')}</div><div class="hero-ticket"><span class="ticket-symbol">${icon('🌱')}</span><span>Pequenos passos.<br><b>Novas possibilidades.</b></span></div><div class="hero-stamp"><b>60</b><span>jogos para explorar</span></div></div></section>`}
function speakerIcon(){return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3zM16 8q4 4 0 8m3-11q7 7 0 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
function preview(g){
  if(g.id===1||g.id===5)return lampScene(g.id===1,{small:true});
  if(g.id===2)return plantScene(true);
  if(g.id===3)return cactusScene(true);
  if(g.id===4)return basketScene(true);
  const list=g.cat==='memory'?['?','🍉','?']:g.cat==='route'?['🤖','➡️',g.target||'🍉']:g.pool?.slice(0,3)||g.order?.slice(0,3)||g.seq?.slice(0,3)||g.bins||g.answers||[g.symbol||'🔘'];
  return `<div class="preview-pieces">${list.slice(0,3).map((x,i)=>`<span class="preview-piece piece-${i}">${icon(x)}</span>`).join('')}</div>`;
}
function catalog(){
  $('#main').innerHTML=`${hero()}<section class="starter-strip" aria-label="Sugestão de começo"><div><span class="eyebrow">Um bom começo</span><h2>Escolha uma pequena experiência.</h2></div>${[1,6,11].map((id,i)=>{const g=GAMES[id-1];return `<button class="starter-game" data-start="${id}"><span class="starter-number">0${i+1}</span><span><b>${g.title}</b><small>${['Tocar e observar','Encontrar o igual','Dois pares, quatro cartas'][i]}</small></span><span>↗</span></button>`}).join('')}</section><section class="catalog-section" id="catalog"><div class="catalog-heading"><div><span class="eyebrow">O catálogo</span><h2>O que vamos descobrir?</h2></div><span class="catalog-total">12 percursos <span>·</span> 60 jogos</span></div><div class="catalog-layout"><aside class="category-rail" aria-label="Percursos"><div class="rail-label">EXPLORAR POR CONCEITO</div>${CATEGORIES.map(([id,name])=>`<button class="category ${category===id?'active':''}" data-cat="${id}" aria-pressed="${category===id}"><span class="category-mark">${id==='all'?'◫':icon(CATEGORY_ICONS[id])}</span>${name}<small>${id==='all'?'60':'5'}</small></button>`).join('')}<button class="category ${category==='favorites'?'active':''}" data-cat="favorites" aria-pressed="${category==='favorites'}"><span class="category-mark">♡</span>Meus favoritos<small>${favorites.length}</small></button></aside><div class="catalog-content"><div class="catalog-tools"><div class="search-wrap"><span>⌕</span><input id="search" type="search" placeholder="Buscar uma descoberta…" aria-label="Buscar jogo ou conceito" value="${esc(query)}"></div><select id="level" aria-label="Filtrar por demanda da atividade"><option value="all">Todos os passos</option><option>Primeiros passos</option><option>Com uma regra</option><option>Mais apoio</option></select></div><p class="results-caption" id="count" role="status"></p><div class="cards" id="cards"></div><div class="load-row" id="loadRow"></div></div></div></section><section class="guide-banner"><span class="guide-symbol">${icon('🙋')}</span><div><h3>A companhia também ensina.</h3><p>Apresente, espere e ofereça só a ajuda necessária.</p></div><button class="secondary" id="openGuide">Guia de acompanhamento ↗</button></section>`;
  $('#level').value=level;
  $('#startJourney').onclick=()=>startGame(1);
  $('#heroListen').onclick=()=>speak('Bem-vinda ao Jardim das Descobertas. Escolha um jogo. Você pode tocar, ouvir e experimentar no seu tempo.');
  $('#openGuide').onclick=()=>navigate('guide');
  document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>startGame(Number(b.dataset.start)));
  document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{category=b.dataset.cat;limit=12;document.querySelectorAll('[data-cat]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});renderCards()});
  $('#search').oninput=e=>{query=e.target.value;limit=12;renderCards()};
  $('#level').onchange=e=>{level=e.target.value;limit=12;renderCards()};renderCards();
}
function normalized(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function renderCards(){
  const list=GAMES.filter(g=>(category==='all'||g.cat===category||category==='favorites'&&favorites.includes(g.id))&&(level==='all'||g.level===level)&&normalized(`${g.title} ${g.goal} ${GROUPS[g.cat].concept}`).includes(normalized(query)));
  $('#cards').innerHTML=list.slice(0,limit).map(g=>`<article class="card" style="--card-bg:${GROUPS[g.cat].color}"><div class="card-art">${preview(g)}<span class="card-number">${String(g.id).padStart(2,'0')}</span><button class="favorite ${favorites.includes(g.id)?'on':''}" data-fav="${g.id}" aria-label="${favorites.includes(g.id)?'Remover dos':'Adicionar aos'} favoritos: ${esc(g.title)}" aria-pressed="${favorites.includes(g.id)}">${favorites.includes(g.id)?'♥':'♡'}</button></div><div class="card-body"><span class="card-label">${GROUPS[g.cat].label}</span><h3>${g.title}</h3><p>${g.instruction}</p><div class="card-bottom"><span class="level-pill ${g.level==='Primeiros passos'?'entry':''}">${g.level}</span><button class="play-card" data-play="${g.id}" aria-label="Jogar ${esc(g.title)}">Jogar <span>↗</span></button></div></div></article>`).join('')||'<div class="empty"><h3>Nenhum jogo neste filtro.</h3><p>Tente outro conceito ou apague a busca.</p><button class="secondary" id="clearFilters">Limpar filtros</button></div>';
  $('#count').textContent=`${Math.min(limit,list.length)} de ${list.length} jogos${category==='favorites'?' favoritos':''} · escolha o apoio pelo que a aluna demonstra`;
  $('#loadRow').innerHTML=limit<list.length?'<button class="secondary" id="loadMore">Mostrar mais 12 jogos ↓</button>':'';
  $('#loadMore')?.addEventListener('click',()=>{limit+=12;renderCards()});
  $('#clearFilters')?.addEventListener('click',()=>{category='all';query='';level='all';limit=12;catalog()});
  document.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>startGame(Number(b.dataset.play)));
  document.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{const id=Number(b.dataset.fav);favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];persist('jardim-favorites',favorites);renderCards()});
}
function instruction(){
  if(!game)return '';
  if(game.id===5&&state.solved)return 'A mesma luz ligou e depois apagou.';
  if(game.id===5)return state.on?'Toque no interruptor para apagar.':'Toque no interruptor para acender.';
  if(game.id===41)return state.scene===0?'Está chovendo. Escolha o guarda-chuva.':'Está sol. Escolha o boné.';
  if(game.id===42)return state.scene===0?'A terra está seca. Escolha regar.':'A terra está molhada. Escolha parar.';
  if(game.id===43)return state.scene===0?'Sinal de seguir. Escolha andar.':'Sinal de parada. Escolha parar.';
  if(game.id===44)return state.scene===0?'Bateria quase vazia. Escolha carregar.':'Bateria cheia. Escolha usar o computador.';
  if(game.id===52)return state.player==='idle'?'Primeiro, toque em começar.':'Agora, toque em pausar.';
  return game.instruction;
}
function startGame(id){
  stopPlayer();stopVoice();game=GAMES.find(g=>g.id===id);if(!game)return;
  page='game';round=0;playerPosition=8;currentMessage='';
  session={started:Date.now(),attempts:0,correct:0,hints:0,finished:false,rounds:Math.max(1,Math.min(3,Number(settings.rounds)||1)),completed:0,pausedMs:0,events:[],variant:Math.floor(Math.random()*6)};
  state=GameLogic.makeRound(game,settings,round+session.variant);gameFrame();renderBoard();window.scrollTo(0,0);
}
function gameFrame(){
  $('#main').innerHTML=`<section class="game-shell"><div class="game-top"><button class="link-btn" id="back">← Catálogo</button><div><button class="link-btn" id="focusBtn" aria-pressed="${document.body.classList.contains('focus-mode')}">▣ ${document.body.classList.contains('focus-mode')?'Sair do foco':'Modo foco'}</button><button class="pause-button" id="pauseBtn">Ⅱ Pausa</button></div></div><div class="game-meta"><span class="eyebrow">${GROUPS[game.cat].label} <span> / </span> ${String(game.id).padStart(2,'0')}</span><h1>${game.title}</h1></div><div class="game-layout"><section class="play-area" aria-label="Área do jogo"><div class="game-instruction"><h2 id="instruction">${instruction()}</h2><button class="speak" id="listen" aria-label="Ouvir instrução">${speakerIcon()}<span>Ouvir</span></button></div><div id="board"></div><div class="feedback-row"><div class="feedback" role="status" aria-live="polite" id="status"></div><button class="feedback-audio" id="hearResult" aria-label="Ouvir o resultado" hidden>${speakerIcon()}</button></div><div class="game-controls" id="gameControls"></div><div class="game-bottom"><button class="link-btn" id="help">☝ Uma pista</button><span id="roundLabel">Rodada ${round+1} de ${session.rounds}</span><button class="link-btn" id="resetRound">↻ Recomeçar</button></div></section><aside class="care-panel"><span class="care-tag">PARA QUEM ACOMPANHA</span><h3>Um apoio de cada vez.</h3><ol class="care-steps"><li><b>Apresente</b><p>${game.prepare}</p></li><li><b>Diga só o necessário</b><p id="careInstruction">“${instruction()}”</p></li><li><b>Observe</b><p>${game.observe}</p></li></ol><details><summary>Objetivo e próximo passo</summary><p><b>Objetivo:</b> ${game.goal}</p><p><b>Fora da tela:</b> ${game.transfer}</p><p><b>Conceito:</b> ${GROUPS[game.cat].concept}.</p><p>Se o desenho não for reconhecido, apresente um objeto ou uma foto. Uma pista ou demonstração é apoio e deve ser registrada. Não force a mão nem exija fala.</p></details><button class="care-read" id="readCare">${speakerIcon()} Ouvir orientação</button></aside></div></section>`;
  $('#back').onclick=()=>navigate('catalog');
  $('#focusBtn').onclick=()=>{const on=document.body.classList.toggle('focus-mode');$('#focusBtn').setAttribute('aria-pressed',String(on));$('#focusBtn').textContent=on?'▣ Sair do foco':'▣ Modo foco'};
  $('#pauseBtn').onclick=pauseGame;$('#listen').onclick=()=>speak(instruction());$('#hearResult').onclick=()=>speak(currentMessage);
  $('#readCare').onclick=()=>speak(`${game.prepare} ${instruction()} ${game.observe}`);
  $('#help').onclick=showHint;$('#resetRound').onclick=()=>newRound();
}
function newRound(){$('#board').classList.remove('gentle-celebration');stopPlayer();stopVoice();playerPosition=8;state=GameLogic.makeRound(game,settings,round+session.variant);currentMessage='';$('#status').textContent='';$('#hearResult').hidden=true;$('#gameControls').innerHTML='';$('#help').disabled=false;$('#resetRound').disabled=false;$('#roundLabel').textContent=`Rodada ${round+1} de ${session.rounds}`;renderBoard()}
function symbol(value,extra=''){return `<span class="big-symbol ${extra}" role="img" aria-label="${esc(label(value))}">${icon(value)}</span>`}
function choice(value,index,extra='',caption=''){return `<button class="choice ${extra}" data-choice="${index}" aria-label="${esc(caption||label(value))}" ${state.solved?'disabled':''}>${icon(value)}${caption?`<small>${caption}</small>`:''}</button>`}
function optionRow(values,caption=false){return `<div class="choices">${values.map((v,i)=>choice(v,i,state.selected.includes(v)?'selected':'',caption?label(v):'')).join('')}</div>`}
function targetModel(value){return `<div class="model-wrap"><span class="model-caption">ENCONTRE O IGUAL</span>${symbol(value)}</div>`}
function startBoard(){
  const scenes={1:()=>lampScene(state.on),2:()=>plantScene(state.on),3:()=>cactusScene(state.on),4:()=>basketScene(state.on),5:()=>lampScene(state.on)};
  if(game.id===1||game.id===3||game.id===4){return `<div class="direct-scene"><button class="scene-button ${state.solved?'completed-scene':''}" data-choice="0" aria-label="${game.id===1?'Acender a luminária':game.id===3?'Levantar os braços do Caco':'Colocar a melancia na cesta'}" ${state.solved?'disabled':''}>${scenes[game.id]()}</button>${!state.solved?'<span class="touch-hint">Toque na imagem</span>':''}</div>`;}
  return `<div class="scene-container">${scenes[game.id]()}</div><div class="choices compact">${choice(game.id===2?'wateringcan':'power',0,state.on?'selected':'',game.id===2?'Regar':state.on?'Apagar':'Acender')}</div>`;
}
function sequenceBoard(){
  const stepIcons=game.order.map((v,i)=>`<div class="sequence-step ${i<state.step?'done':''} ${i===state.step?'current':''}">${symbol(v)}<span class="step-dot">${i<state.step?'✓':i+1}</span></div>${i<game.order.length-1?'<span class="sequence-arrow">→</span>':''}`).join('');
  let display=`<div class="model-caption">SIGA O MODELO, UM PASSO POR VEZ</div><div class="sequence-track">${stepIcons}</div>`;
  if(game.id===25)display+=`<div class="screen-build"><div class="mini-toolbar"><i></i><i></i><i></i></div><div class="build-content">${state.step>0?icon('🖼️'):'<span class="placeholder-box"></span>'}${state.step>1?'<span class="built-button">▶</span>':''}</div></div>`;
  return display+optionRow(state.options);
}
function patternBoard(){return `<div class="pattern-track" aria-label="Fila do padrão">${state.pattern.map(v=>symbol(v)).join('')}${symbol(state.solved?state.target:'?',state.solved?'filled':'missing')}</div>${optionRow(state.options)}`;}
function routeBoard(){
  return `<div class="route-grid" role="img" aria-label="Tabuleiro. Robô na casa ${state.pos+1}; destino na casa ${game.end+1}.">${Array.from({length:9},(_,i)=>`<div class="cell ${game.walls.includes(i)?'wall':''} ${i===game.end?'destination':''}">${i===state.pos?icon('🤖'):game.walls.includes(i)?'<span class="stone"></span>':i===game.end?icon(game.target||'🍉'):state.trail.includes(i)?'<span class="trail-dot"></span>':''}${i===state.pos&&i===game.end?'<span class="arrived-badge">✓</span>':''}</div>`).join('')}</div><div class="arrow-controls" aria-label="Comandos do robô">${['⬅️','⬆️','⬇️','➡️'].map((v,i)=>choice(v,i,`arrow-${i}`)).join('')}</div>`;
}
function repetitionBoard(){
  if(game.order)return sequenceBoard();
  if(game.id===38)return `<div class="repeat-path">${Array.from({length:game.times+1},(_,i)=>`<div class="repeat-place ${i<state.count?'walked':''}">${i===state.count?cactus():i<state.count?'✓':'<span class="trail-dot"></span>'}</div>`).join('<span class="sequence-arrow">→</span>')}</div><div class="choices compact">${choice('➡️',0,'','Um passo')}</div>`;
  if(game.id===39)return `<div class="lamp-row">${Array.from({length:game.times},(_,i)=>lampScene(i<state.count,{small:true})).join('')}</div><div class="choices compact">${choice('power',0,'','Acender uma')}</div>`;
  return `<div class="fill-tray ${game.id===37?'fruit-tray':''}">${Array.from({length:game.times},(_,i)=>`<div class="tray-slot ${i<state.count?'filled':''}">${icon(i<state.count?(game.id===36?'seed':'🍉'):'○')}</div>`).join('')}</div><div class="choices compact">${choice(game.id===36?'seed':'🍉',0,'','Colocar uma')}</div>`;
}
function conditionBoard(){
  let scene='';const answered=state.solved;
  if(game.id===41)scene=weatherScene(state.scene===0);
  if(game.id===42)scene=plantScene(answered||state.scene===1);
  if(game.id===43)scene=`<div class="traffic-scene"><div class="traffic-sign ${state.scene===0?'go':'stop'}">${state.scene===0?icon('➡️'):icon('✋')}</div><div class="traffic-robot ${answered&&state.scene===0?'moved':''}">${icon('🤖')}</div></div>`;
  if(game.id===44)scene=batteryScene(answered||state.scene===1);
  if(game.id===45)scene=`<div class="comparison"><div><span>Esperado</span>${lampScene(true,{small:true})}</div><div><span>Aconteceu</span>${lampScene(state.scene===0,{small:true})}</div></div>`;
  return `<div class="scene-container">${scene}</div>${optionRow(state.options,true)}`;
}
function interfaceBoard(){
  if(game.id===51||game.id===52)return `<div class="player-scene"><div class="player-sky"></div><div class="player-track"></div><div id="playerActor" class="player-actor" style="left:${playerPosition+4}%">${cactus()}</div><span class="player-state">${state.player==='playing'?'▶ Em movimento':state.player==='paused'?'Ⅱ Pausado':'Ⅱ Parado'}</span></div>${optionRow(state.options,true)}`;
  let content='';
  if(game.id===53)content=state.solved?`<div class="app-home">${icon('🖼️')}<span>Minhas imagens</span></div>`:`<div class="app-photo">${icon('🌻')}</div>`;
  if(game.id===54)content=state.solved?'<div class="desktop-icons"><span>▦</span><span>▢</span></div>':`<div class="floating-window"><div class="mini-toolbar"><i></i><i></i><i></i></div>${icon('🌻')}</div>`;
  if(game.id===55)content=`<div class="drawing-sheet">${icon('🌻')}</div><div class="saved-folder"><span class="folder-tab"></span>${state.solved?icon('🌻'):'<span class="folder-empty">○</span>'}<small>${state.solved?'Guardado':'Pasta vazia'}</small></div>`;
  return `<div class="demo-app"><div class="mini-toolbar"><i></i><i></i><i></i></div><div class="demo-content">${content}</div></div>${optionRow(state.options,true)}`;
}
function safetyBoard(){
  const picture={56:'✉️',57:'🔒',58:'🖼️',59:'🔗',60:'🙋'}[game.id];
  const scene=game.id===60?`<div class="choice-invitation">${companion()}<p>As duas escolhas são válidas.</p></div>`:`<div class="safety-scene"><div class="phone-frame"><div class="phone-speaker"></div><div class="phone-message">${icon(picture)}<span class="unknown-person">?</span></div></div>${state.solved?`<div class="help-person">${icon('🙋')}<small>Vamos ver juntas.</small></div>`:''}</div>`;
  return scene+optionRow(state.options,true);
}
function renderBoard(){
  const g=game;let html='';
  if(g.cat==='start')html=startBoard();
  if(g.cat==='match')html=targetModel(state.target)+optionRow(state.options);
  if(g.cat==='memory')html=`<div class="memory-grid ${state.deck.length===6?'six':''}">${state.deck.map((v,i)=>`<button class="memory-card ${state.matched.includes(i)?'matched':''} ${state.open.includes(i)?'open':''}" data-choice="${i}" aria-label="${state.matched.includes(i)||state.open.includes(i)?esc(label(v)):'Carta fechada '+(i+1)}" ${state.matched.includes(i)||state.solved?'disabled':''}>${state.matched.includes(i)||state.open.includes(i)?icon(v):'<span class="card-back-mark">✳</span>'}${state.matched.includes(i)?'<span class="match-tick">✓</span>':''}</button>`).join('')}</div>`;
  if(g.cat==='classify')html=`<div class="classify-object ${state.solved?'placed':''}">${state.solved?'':symbol(state.item[0])}</div><div class="group-bins">${state.options.map((n,i)=>`<button class="group-bin ${state.solved&&n===state.item[1]?'chosen':''}" data-choice="${i}" aria-label="${g.names[n]}" ${state.solved?'disabled':''}><span class="bin-example">${icon(g.bins[n])}</span><span class="bin-content">${state.solved&&n===state.item[1]?icon(state.item[0]):'<span class="bin-slot"></span>'}</span><span class="bin-name">${g.names[n]}</span></button>`).join('')}</div>`;
  if(g.cat==='sequence')html=sequenceBoard();
  if(g.cat==='pattern')html=patternBoard();
  if(g.cat==='route')html=routeBoard();
  if(g.cat==='repeat')html=repetitionBoard();
  if(g.cat==='condition')html=conditionBoard();
  if(g.cat==='data'){
    html=g.missing?`<div class="set-model"><span>Modelo</span><div>${g.pool.map(v=>symbol(v)).join('')}</div></div><div class="set-model"><span>Falta uma</span><div>${g.pool.filter(v=>v!==g.target).map(v=>symbol(v)).join('')}${symbol(state.solved?g.target:'?')}</div></div>`:g.targets?`<div class="filter-rule"><span>Procure todos deste grupo</span><div>${g.targets.map(v=>symbol(v)).join('')}</div></div>`:targetModel(g.target);
    html+=`<div class="choices data-choices">${state.options.map((v,i)=>choice(v,i,state.selected.includes(v)?'selected':'')).join('')}</div>`;
  }
  if(g.cat==='interface')html=interfaceBoard();
  if(g.cat==='safety')html=safetyBoard();
  $('#board').innerHTML=html;$('#instruction').textContent=instruction();$('#careInstruction').textContent=`“${instruction()}”`;
  document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>choose(Number(b.dataset.choice)));
  syncPlayer();
}
function notify(message){currentMessage=message;$('#status').textContent=message;$('#hearResult').hidden=!message}
function choose(index){
  if(session.finished)return;
  const result=GameLogic.act(game,state,index);if(result.kind==='ignored')return;
  if(result.counted){session.attempts++;if(result.valid)session.correct++;session.events.push({valid:result.valid,hinted:state.hinted,round:round+1});state.hinted=false;}
  renderBoard();if(result.message)notify(result.message);
  if(result.kind==='memory-mismatch'){
    $('#help').disabled=true;$('#gameControls').innerHTML='<button class="secondary" id="turnBack">↻ Virar de volta</button>';
    $('#turnBack').onclick=()=>{state.open=[];state.lock=false;state.hinted=false;$('#help').disabled=false;$('#gameControls').innerHTML='';renderBoard();notify('Você pode procurar outro par.');};
  }
  if(result.kind==='stop'){session.completed++;finish(true);return;}
  if(result.kind==='complete'){
    session.completed++;$('#help').disabled=true;
    const more=round+1<session.rounds&&!game.freeChoice;
    $('#gameControls').innerHTML=`<div class="completion-mark">${icon('✓')}<span>${game.freeChoice?'Sua escolha foi respeitada.':'Esta rodada está completa.'}</span></div><button class="primary" id="next">${more?'Outra rodada →':'Concluir ✓'}</button>`;
    $('#next').onclick=()=>{if(more){round++;newRound()}else finish()};
    if(settings.motion&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)$('#board').classList.add('gentle-celebration');
  }
}
function showHint(){
  if(game.freeChoice){notify('Você pode escolher qualquer uma. As duas escolhas serão respeitadas.');return;}
  const index=GameLogic.hint(game,state);if(index<0)return;
  state.hinted=true;session.hints++;
  document.querySelectorAll('[data-choice]').forEach(b=>b.classList.toggle('hint',Number(b.dataset.choice)===index));
  notify('A borda destaca uma opção. Essa resposta terá apoio de uma pista.');
}
function pauseGame(){stopVoice();stopPlayer();session.pauseStarted=Date.now();$('#pause').showModal();$('#endSession').hidden=session.finished;}
function resumeGame(){if(session.pauseStarted){session.pausedMs+=Date.now()-session.pauseStarted;delete session.pauseStarted;}$('#pause').close();syncPlayer()}
function finish(stopped=false){
  stopPlayer();stopVoice();if(session.pauseStarted){session.pausedMs+=Date.now()-session.pauseStarted;delete session.pauseStarted;}
  session.finished=true;session.stopped=stopped;session.ended=Date.now();
  $('#instruction').textContent=stopped?'Você escolheu parar.':'Uma descoberta de cada vez.';
  $('#listen').onclick=()=>speak(stopped?'Você escolheu parar. Tudo bem. A atividade terminou.':'A atividade terminou. Você pode descansar ou escolher outro jogo.');
  $('#board').innerHTML=`<div class="complete">${companion()}<span class="eyebrow">${stopped?'Sua escolha foi respeitada':'Fim desta experiência'}</span><h2>${stopped?'Vamos descansar.':'Um passo a mais no caminho.'}</h2><p>${stopped?'A atividade foi encerrada.':'Você explorou '+esc(game.title.toLowerCase())+'.'}</p><details class="record-form" open><summary>Registrar o acompanhamento</summary><label for="support">Qual apoio foi necessário?</label><select id="support"><option value="not_observed">Ainda não registrei</option><option value="independent">Sem ajuda</option><option value="visual">Pista visual</option><option value="gesture">Gesto</option><option value="verbal">Dica verbal</option><option value="model">Demonstração</option><option value="motor">Apoio motor consentido</option></select><label for="note">Observação breve</label><textarea id="note" rows="2" placeholder="O que funcionou? O que mudar na próxima vez?"></textarea><small>Sem nomes ou informações pessoais. Registrar a ajuda não é avaliar a capacidade da aluna.</small></details></div>`;
  notify('');$('#help').disabled=true;$('#resetRound').disabled=true;$('#roundLabel').textContent='';
  $('#gameControls').innerHTML='<button class="primary" id="saveSession">Guardar e voltar ao catálogo</button><button class="secondary" id="finishWithoutSaving">Voltar sem registrar</button>';
  $('#saveSession').onclick=()=>{saveSession();navigate('catalog')};$('#finishWithoutSaving').onclick=()=>navigate('catalog');
}
function saveSession(){
  if(session.saved)return;session.saved=true;
  records.unshift({date:new Date().toISOString(),id:game.id,title:game.title,concept:GROUPS[game.cat].concept,attempts:session.attempts,correct:session.correct,hints:session.hints,seconds:Math.max(0,Math.round(((session.ended||Date.now())-session.started-session.pausedMs)/1000)),support:$('#support').value,note:$('#note').value,status:session.stopped?'Encerrada por escolha':'Concluída',rounds:session.completed,events:session.events,version:2,metric:game.freeChoice?'Escolha livre':game.cat==='memory'?'Pares encontrados':game.cat==='route'?'Deslocamentos válidos':['start','repeat'].includes(game.cat)?'Ações realizadas':'Respostas correspondentes'});
  if(!persist('jardim-records',records))showToast('O navegador não permitiu guardar permanentemente. Exporte o caderno antes de fechar.');
}
const SUPPORT={not_observed:'Ajuda não registrada',independent:'Sem ajuda',visual:'Pista visual',gesture:'Gesto',verbal:'Dica verbal',model:'Demonstração',motor:'Apoio motor consentido'};
function progress(){
  const unique=new Set(records.map(r=>r.id)).size;
  $('#main').innerHTML=`<section class="page-head"><span class="eyebrow">Meu caderno</span><h1>Um registro do caminho.</h1><p>Observe o que aconteceu e qual apoio ajudou. Cada jogo propõe uma experiência diferente.</p></section><div class="progress-summary"><div class="stat"><b>${records.length}</b><span>Sessões guardadas</span></div><div class="stat"><b>${unique}<small> / 60</small></b><span>Jogos explorados</span></div><div class="stat"><b>${records.filter(r=>r.support==='independent').length}</b><span>Sessões registradas sem ajuda</span></div></div><div class="notice">O caderno descreve as ações, não mede inteligência nem comprova domínio. Nos caminhos, contam-se movimentos válidos; na memória, pares encontrados. Não compare os totais entre atividades.</div><div class="catalog-tools progress-tools"><button class="secondary" id="export" ${records.length?'':'disabled'}>↓ Exportar caderno (CSV)</button><button class="link-btn" id="clearRecords" ${records.length?'':'disabled'}>Apagar registros</button></div><div id="clearPrompt"></div><div class="record-list">${records.length?records.map(r=>`<article class="record"><div class="record-icon">${icon(CATEGORY_ICONS[GAMES.find(g=>g.id===r.id)?.cat]||'🌱')}</div><div><h3>${esc(r.title)}</h3><small>${new Date(r.date).toLocaleString('pt-BR')} · ${Math.floor(r.seconds/60)} min ${r.seconds%60} s</small>${r.note?`<p>${esc(r.note)}</p>`:''}</div><div class="record-detail"><b>${r.metric==='Escolha livre'?'Escolha livre, sem pontuação':`${r.correct} ${esc((r.metric||'respostas correspondentes').toLowerCase())}`}</b><small>${r.attempts} ${r.attempts===1?'tentativa':'tentativas'} · ${r.hints} ${r.hints===1?'pista':'pistas'}</small><span>${SUPPORT[r.support]||'Não registrado'}</span><small>${esc(r.status||'Concluída')}</small></div></article>`).join(''):'<div class="empty"><div class="empty-art">'+icon('🌱')+'</div><h3>A primeira descoberta fica por aqui.</h3><p>Depois de uma atividade, escolha “Guardar” para registrar o acompanhamento.</p><button class="primary" id="emptyStart">Explorar os jogos →</button></div>'}</div><p class="storage-note">Os registros ficam neste navegador. Exporte uma cópia antes de limpar seus dados ou mudar de aparelho.</p>`;
  $('#emptyStart')?.addEventListener('click',()=>navigate('catalog'));$('#export').onclick=exportCSV;
  $('#clearRecords').onclick=()=>{$('#clearPrompt').innerHTML='<div class="notice">Apagar todas as sessões deste navegador? Exporte uma cópia primeiro se precisar guardar. <div class="dialog-actions"><button class="secondary" id="confirmClear">Apagar registros</button><button class="link-btn" id="cancelClear">Cancelar</button></div></div>';$('#confirmClear').onclick=()=>{records=[];persist('jardim-records',records);progress()};$('#cancelClear').onclick=()=>$('#clearPrompt').innerHTML=''};
}
function exportCSV(){
  const rows=[['Data','Jogo','Conceito','Metrica','Acoes correspondentes','Tentativas','Pistas','Segundos ativos','Ajuda','Situacao','Observacao'],...records.map(r=>[r.date,r.title,r.concept,r.metric||'Respostas correspondentes',r.correct,r.attempts,r.hints,r.seconds,SUPPORT[r.support],r.status||'Concluída',r.note])];
  const csv='\ufeff'+rows.map(row=>row.map(v=>'"'+String(v??'').replace(/^(\s*[=+@-])/,'\'$1').replace(/"/g,'""')+'"').join(';')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='jardim-caderno.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function openSettings(){
  $('#voiceSetting').checked=settings.voice;$('#motionSetting').checked=settings.motion;$('#mascotSetting').checked=settings.mascot;$('#memorySetting').value=settings.memory;$('#choicesSetting').value=settings.choices;$('#roundsSetting').value=settings.rounds;$('#companionSetting').value=settings.companion;
  stopVoice();stopPlayer();$('#settings').showModal();
}
$('#settingsForm').onsubmit=e=>{
  e.preventDefault();settings={voice:$('#voiceSetting').checked,motion:$('#motionSetting').checked,mascot:$('#mascotSetting').checked,memory:Number($('#memorySetting').value),choices:Number($('#choicesSetting').value),rounds:Number($('#roundsSetting').value),companion:$('#companionSetting').value};
  persist('jardim-settings',settings);$('#settings').close();
  if(page==='catalog')catalog();else document.querySelectorAll('.mascot-slot').forEach(el=>el.outerHTML=companion());
  if(page==='game'&&!session.finished)showToast('Ajustes guardados. Quantidades de cartas e escolhas valem na próxima rodada.');
};
$('#settings').addEventListener('close',()=>syncPlayer());
$('#closeSettings').onclick=()=>$('#settings').close();
$('#testSettingsVoice').onclick=()=>{if(!$('#voiceSetting').checked){showToast('Ative a voz para testar.');return;}const before=settings.voice;settings.voice=true;speak('Toque na luminária para acender.');settings.voice=before};
$('#settingsBtn').onclick=openSettings;
$('#resume').onclick=resumeGame;
$('#leave').onclick=()=>{$('#pause').close();navigate('catalog')};
$('#endSession').onclick=()=>{$('#pause').close();finish(true)};
$('#pause').addEventListener('cancel',()=>{if(session?.pauseStarted){session.pausedMs+=Date.now()-session.pauseStarted;delete session.pauseStarted;}requestAnimationFrame(syncPlayer)});
$('.brand').onclick=e=>{e.preventDefault();navigate('catalog')};
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>navigate(b.dataset.page));
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopPlayer();stopVoice()}else syncPlayer()});
navigate('catalog');
