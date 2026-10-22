const assert=require('node:assert/strict');
const {GAMES,GROUPS}=require('../dist/games.js');
const logic=require('../dist/engine.js');
const rng=()=>.37;
const game=id=>GAMES.find(g=>g.id===id);
const fresh=(id,round=0,opts={})=>logic.makeRound(game(id),{choices:2,memory:4,...opts},round,rng);
let tests=0;
function test(name,fn){fn();tests++;console.log('PASS '+name)}
test('60 unique games have concrete mediation and transfer instructions',()=>{
 assert.equal(GAMES.length,60);assert.equal(new Set(GAMES.map(g=>g.id)).size,60);
 for(const g of GAMES){assert.ok(GROUPS[g.cat]);for(const key of ['title','instruction','prepare','observe','transfer'])assert.ok(g[key]?.length>5,`${g.id}: ${key}`)}
});
test('one lamp changes state, and repeated clicks after completion are ignored',()=>{
 const s=fresh(1);assert.equal(s.on,false);const result=logic.act(game(1),s,0);assert.equal(s.on,true);assert.equal(result.kind,'complete');assert.match(result.message,/luminária acendeu/);assert.equal(logic.act(game(1),s,0).kind,'ignored');assert.equal(s.on,true);
});
test('the same lamp toggles on then off before completing',()=>{
 const s=fresh(5);assert.equal(logic.act(game(5),s,0).kind,'progress');assert.equal(s.on,true);assert.equal(s.solved,false);assert.equal(logic.act(game(5),s,0).kind,'complete');assert.equal(s.on,false);
});
test('two-choice matching always contains the target',()=>{
 for(let id=6;id<=10;id++)for(let r=0;r<3;r++){const s=fresh(id,r);assert.equal(s.options.length,2);assert.ok(s.options.includes(s.target));const wrong=s.options.findIndex(x=>x!==s.target);assert.equal(logic.act(game(id),s,wrong).valid,false);assert.equal(s.solved,false);assert.equal(logic.act(game(id),s,s.options.indexOf(s.target)).kind,'complete');}
});
test('memory has exactly two or three pairs, no same-card match, no timed hiding',()=>{
 for(const size of [4,6]){const s=fresh(11,0,{memory:size});assert.equal(s.deck.length,size);for(const v of new Set(s.deck))assert.equal(s.deck.filter(x=>x===v).length,2);logic.act(game(11),s,0);assert.equal(logic.act(game(11),s,0).kind,'ignored');const different=s.deck.findIndex(v=>v!==s.deck[0]);assert.equal(logic.act(game(11),s,different).kind,'memory-mismatch');assert.equal(s.lock,true);assert.equal(s.open.length,2);assert.equal(logic.act(game(11),s,2).kind,'ignored');}
});
test('categories are mutually exclusive animals and vehicles',()=>{
 assert.deepEqual(game(19).names,['Animais','Veículos']);const s=fresh(19,1);assert.deepEqual(s.item,['🚌',1]);assert.equal(logic.act(game(19),s,s.options.indexOf(0)).valid,false);assert.equal(logic.act(game(19),s,s.options.indexOf(1)).kind,'complete');
});
test('washing comes before serving; the final object does not replace an action',()=>{
 assert.deepEqual(game(23).order,['wash','serve']);const s=fresh(23);assert.equal(logic.act(game(23),s,s.options.indexOf('serve')).valid,false);logic.act(game(23),s,s.options.indexOf('wash'));assert.equal(s.step,1);logic.act(game(23),s,s.options.indexOf('serve'));assert.equal(s.step,2);assert.equal(s.solved,true);
});
test('patterns vary while keeping the correct next element',()=>{
 const a=fresh(26,0),b=fresh(26,1);assert.deepEqual(a.pattern,['🍉','🍌','🍉']);assert.equal(a.target,'🍌');assert.deepEqual(b.pattern,['🍌','🍉','🍌']);assert.equal(b.target,'🍉');
});
test('robot cannot wrap rows or cross stones',()=>{
 const s=fresh(33);assert.equal(s.pos,6);assert.equal(logic.act(game(33),s,0).valid,false);assert.equal(s.pos,6);assert.equal(logic.act(game(33),s,3).valid,false);assert.equal(s.pos,6);logic.act(game(33),s,1);assert.equal(s.pos,3);logic.act(game(33),s,3);assert.equal(s.pos,4);assert.equal(s.solved,true);
});
test('both weather conditions have an answer and a concrete displayed scene',()=>{
 const wet=fresh(41,0),sun=fresh(41,1);assert.equal(logic.targetFor(game(41),wet),'☂️');assert.equal(logic.targetFor(game(41),sun),'🧢');assert.ok(!game(45).scenes.some(s=>/[=≠]/.test(s)));
});
test('filter requires all targets and ignores selecting the same item twice',()=>{
 const s=fresh(48);const c=s.options.indexOf('🌵'),f=s.options.indexOf('🌻');assert.equal(logic.act(game(48),s,c).kind,'progress');assert.equal(logic.act(game(48),s,c).kind,'ignored');assert.equal(logic.act(game(48),s,f).kind,'complete');assert.deepEqual(new Set(s.selected),new Set(['🌵','🌻']));
});
test('pause really changes the same player from idle to playing to paused',()=>{
 const s=fresh(52);const play=s.options.indexOf('▶'),pause=s.options.indexOf('Ⅱ');assert.equal(logic.act(game(52),s,pause).valid,false);assert.equal(s.player,'idle');assert.equal(logic.act(game(52),s,play).kind,'progress');assert.equal(s.player,'playing');assert.equal(logic.act(game(52),s,pause).kind,'complete');assert.equal(s.player,'paused');
});
test('stop and continue are equally valid, unscored choices; stop is terminal',()=>{
 for(const v of ['✋','▶']){const s=fresh(60);const r=logic.act(game(60),s,s.options.indexOf(v));assert.equal(r.counted,false);assert.equal(r.valid,null);assert.equal(r.kind,v==='✋'?'stop':'complete');assert.equal(s.solved,true);assert.equal(logic.act(game(60),s,0).kind,'ignored');}
});
test('all 60 games can complete at every variant with 4 or 6 memory cards',()=>{
 for(const memory of [4,6])for(const g of GAMES)for(let r=0;r<3;r++){
  const s=logic.makeRound(g,{memory,choices:2},r,rng);let guard=0;
  while(!s.solved&&guard++<30){let index;if(g.freeChoice)index=s.options.indexOf('✋');else index=logic.hint(g,s);assert.ok(index>=0,`${g.id} has valid action`);logic.act(g,s,index)}
  assert.equal(s.solved,true,`${g.id} round ${r} completes`);
 }
});
console.log(`${tests} tests passed. 360 game variants completed.`);
