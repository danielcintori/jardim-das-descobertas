/* Game rules are independent of rendering: an effect must change the scene, not its identity. */
const GameLogic = (() => {
  function shuffle(items, random=Math.random) {
    const result=[...items];
    for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  }
  function makeRound(game, settings={}, round=0, random=Math.random) {
    const s={solved:false,step:0,on:false,count:0,pos:game.start,selected:[],open:[],matched:[],lock:false,trail:[],scene:round%2,options:[],hinted:false,player:'idle'};
    const limit=Number(settings.choices)===3?3:2;
    if(game.pool)s.options=shuffle(game.pool,random);
    if(game.cat==='memory'){
      const pairs=game.pool.slice(0,Number(settings.memory)===6?3:2);
      s.deck=shuffle([...pairs,...pairs],random);
    }
    if(game.cat==='match')s.target=game.pool[round%game.pool.length];
    if(game.cat==='classify'){s.item=game.items[round%game.items.length];s.options=[0,1];}
    if(game.cat==='condition')s.options=shuffle(game.answers,random);
    if(game.order)s.options=shuffle([...new Set(game.order)],random);
    if(game.cat==='pattern'){
      const swap=round%2===1;
      s.pattern=swap?game.seq.map(x=>x===game.answer?game.other:game.answer):[...game.seq];
      s.target=swap?game.other:game.answer;
      s.options=shuffle([game.answer,game.other],random);
    }
    if(game.cat==='match'||game.cat==='data'&&!game.targets&&!game.missing){
      const target=s.target||game.target;
      s.options=shuffle([target,...shuffle(game.pool.filter(x=>x!==target),random).slice(0,limit-1)],random);
    }
    if(game.cat==='route')s.trail=[game.start];
    return s;
  }
  function targetFor(game,s){
    if(game.cat==='classify')return s.item[1];
    if(game.cat==='condition')return game.answers[s.scene];
    if(game.cat==='match'||game.cat==='pattern')return s.target;
    if(game.order)return game.order[s.step];
    if(game.targets)return game.targets.find(x=>!s.selected.includes(x));
    if(game.id===52)return s.player==='idle'?'▶':'Ⅱ';
    return game.target;
  }
  function moveFrom(game,p,direction){
    const n=p+[-1,-3,3,1][direction];
    if(n<0||n>8||direction===0&&p%3===0||direction===3&&p%3===2||game.walls.includes(n))return null;
    return n;
  }
  function routePath(game,pos){
    const queue=[[pos,[]]],seen=new Set([pos]);
    while(queue.length){const[p,path]=queue.shift();if(p===game.end)return path;
      for(let d=0;d<4;d++){const n=moveFrom(game,p,d);if(n===null||seen.has(n))continue;seen.add(n);queue.push([n,[...path,d]]);}}
    return [];
  }
  function hint(game,s){
    if(s.solved||s.lock)return -1;
    if(game.cat==='start'||game.cat==='repeat'&&!game.order)return 0;
    if(game.cat==='route')return routePath(game,s.pos)[0]??-1;
    if(game.freeChoice)return -1;
    if(game.cat==='memory'){
      if(s.open.length)return s.deck.findIndex((x,i)=>i!==s.open[0]&&!s.matched.includes(i)&&x===s.deck[s.open[0]]);
      return s.deck.findIndex((_,i)=>!s.matched.includes(i));
    }
    return s.options.indexOf(targetFor(game,s));
  }
  function act(game,s,index){
    const ignored={kind:'ignored',counted:false};
    if(s.solved||s.lock)return ignored;
    const value=s.options[index];
    const good=(message,done=true)=>{s.solved=done;return {kind:done?'complete':'progress',counted:true,valid:true,message}};
    const bad=(message='Vamos olhar novamente. Você pode pedir ajuda.')=>({kind:'retry',counted:true,valid:false,message});
    if(game.freeChoice){
      if(!s.options.includes(value))return ignored;
      s.selected=[value];s.solved=true;
      return {kind:value==='✋'?'stop':'complete',counted:false,valid:null,message:value==='✋'?'Você escolheu parar. Vamos encerrar.':'Você escolheu continuar. Vamos escolher outro jogo.'};
    }
    if(game.cat==='start'){
      s.on=!s.on;s.step++;
      const messages={1:'A luminária acendeu.',2:'Você regou. A terra ficou molhada.',3:'O Caco levantou os braços.',4:'A melancia está dentro da cesta.',5:s.on?'A luz acendeu. Agora, desligue.':'A luz apagou.'};
      return good(messages[game.id],!game.toggle||s.step===2);
    }
    if(game.cat==='memory'){
      if(index<0||index>=s.deck.length||s.open.includes(index)||s.matched.includes(index))return ignored;
      s.open.push(index);
      if(s.open.length<2)return {kind:'reveal',counted:false};
      const[a,b]=s.open;
      if(s.deck[a]===s.deck[b]){s.matched.push(a,b);s.open=[];return good('Você encontrou um par.',s.matched.length===s.deck.length);}
      s.lock=true;return {kind:'memory-mismatch',counted:true,valid:false,message:'São diferentes. Olhe com calma e vire de volta quando quiser.'};
    }
    if(game.cat==='route'){
      if(index<0||index>3)return ignored;
      const next=moveFrom(game,s.pos,index);
      if(next===null)return bad('O robô ficou no mesmo lugar. Esse caminho está fechado.');
      s.pos=next;s.trail.push(next);
      return good(next===game.end?'O robô chegou!':'O robô andou uma casa.',next===game.end);
    }
    if(game.cat==='repeat'&&!game.order){s.count++;return good(s.count===game.times?'Todos os espaços foram preenchidos.':'Mais uma ação, no seu tempo.',s.count===game.times);}
    if(index<0||index>=s.options.length)return ignored;
    if(game.targets){
      if(s.selected.includes(value))return ignored;
      if(!game.targets.includes(value))return bad();
      s.selected.push(value);return good(s.selected.length===game.targets.length?'Você encontrou todos.':'Há mais um para encontrar.',s.selected.length===game.targets.length);
    }
    if(value!==targetFor(game,s))return bad();
    s.selected=[value];
    if(game.order){s.step++;return good(s.step===game.order.length?'Você seguiu a sequência.':'Agora, o próximo passo.',s.step===game.order.length);}
    if(game.id===52&&s.player==='idle'){s.player='playing';return good('O Caco está andando. Agora, toque em pausar.',false);}
    if(game.id===51)s.player='playing';
    if(game.id===52)s.player='paused';
    if(game.cat==='interface'||game.cat==='safety')return good(game.effect);
    if(game.cat==='condition')return good(game.id===45?'Você comparou as duas luminárias.':'A ação combinou com a situação.');
    return good(game.cat==='pattern'?'A figura completou a fila.':game.cat==='classify'?'O objeto foi para o seu grupo.':'Você encontrou o igual.');
  }
  return {shuffle,makeRound,targetFor,act,hint,moveFrom,routePath};
})();
if(typeof module!=='undefined')module.exports=GameLogic;
