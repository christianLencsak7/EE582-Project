const {test}=require('node:test');const assert=require('node:assert/strict');const M=require('../public/model.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const cases=[['empty',[],[0,0,0],[1,6,11]],['one',[{channel:1,rssi:-50}],[1,0,0],[6,11]],['adjacent',[{channel:3,rssi:-50}],[.6,.4,0],[11]],['strength',M.presets.strength.networks,[10,1,.1],[11]],['balanced',M.presets.balanced.networks,[1,1,1],[1,6,11]]];
for(const [label,inputs,expected,minima] of cases)test(label,()=>{const a=M.analyze(inputs);a.scores.forEach((s,i)=>near(s.score,expected[i]));assert.deepEqual(a.minima,minima);});
test('ties retain current, otherwise pick smallest minimum',()=>{assert.equal(M.analyze([],11).selected,11);assert.equal(M.analyze([{channel:1,rssi:-50}],1).selected,6);assert.equal(M.analyze([{channel:1,rssi:-50}],11).selected,11);});
test('power uses linear units and scales by ten for +10 dB',()=>{near(M.power(-50),1);near(M.power(-40)/M.power(-50),10);});
test('neighbor order leaves scores unchanged',()=>{const n=M.presets.dorm.networks;const a=M.analyze(n),b=M.analyze([...n].reverse());a.scores.forEach((s,i)=>near(s.score,b.scores[i].score));});
test('invalid numeric inputs and limits rejected',()=>{for(const channel of [0,12,1.2,NaN,Infinity,'',null,'6'])assert.throws(()=>M.analyze([{channel,rssi:-50}]));for(const rssi of [-91,-29,NaN,Infinity,'',null,'-50'])assert.throws(()=>M.analyze([{channel:1,rssi}]));assert.throws(()=>M.analyze([],3));assert.throws(()=>M.analyze(Array(11).fill({channel:1,rssi:-50})));assert.doesNotThrow(()=>M.analyze(Array(10).fill({channel:1,rssi:-50})));});
test('recommendations attain minima across all channels and levels',()=>{for(let c=1;c<=11;c++)for(let r=-90;r<=-30;r+=5){const a=M.analyze([{channel:c,rssi:r},{channel:6,rssi:-60}],6);assert.ok(M.candidates.includes(a.selected));near(a.selectedScore,a.best);assert.ok(a.scores.every(s=>Number.isFinite(s.score)&&s.score>=0));}});
test('zero baseline has no percent and strength reduction is 99%',()=>{assert.equal(M.analyze([]).reduction,null);near(M.analyze(M.presets.strength.networks).reduction,99);});
test('CSV includes exact candidate scores and escapes names',()=>{const n=[{name:'A "quoted", AP',channel:3,rssi:-50}];const csv=M.csv(n,1);assert.ok(csv.includes('"A ""quoted"", AP"'));assert.ok(csv.includes('"candidate","","1","","0.6"'));assert.ok(csv.includes('"recommended","","11","","0"'));assert.ok(M.csv([{name:'=1+1',channel:1,rssi:-50}],1).includes("'=1+1"));});

test('comparisons capture exact before/after values and reductions',()=>{
 const c=M.createComparison(M.presets.strength.networks,1);
 assert.equal(c.beforeChannel,1);assert.equal(c.afterChannel,11);
 near(c.beforeScore,10);near(c.afterScore,.1);near(c.absoluteReduction,9.9);near(c.percentReduction,99);
 const example=M.createComparison(M.presets.adjacent.networks,1);
 near(example.beforeScore,.6);near(example.afterScore,0);near(example.absoluteReduction,.6);near(example.percentReduction,100);
});
test('zero comparison baseline is not applicable; balanced baseline has zero reduction',()=>{
 const c=M.createComparison([],6);
 assert.equal(c.percentReduction,null);assert.equal(c.absoluteReduction,0);assert.equal(c.afterChannel,6);
 const b=M.createComparison(M.presets.balanced.networks,6);
 assert.equal(b.percentReduction,0);assert.equal(b.afterChannel,6);
});
test('snapshot inputs and results are independent after live edits and deletion',()=>{
 let s=M.applyRecommendation(M.presetState('strength'));
 const saved=JSON.parse(JSON.stringify(s.comparison));
 assert.equal(M.snapshotMatches(s.comparison,s.networks),true);
 s.networks[0].name='Changed';s.networks[0].channel=11;s.networks[0].rssi=-90;
 s.networks.splice(1,1);s.current=6;
 assert.deepEqual(s.comparison,saved);
 assert.equal(M.snapshotMatches(s.comparison,s.networks),false);
});
test('applying a recommendation retains live inputs and original state',()=>{
 const s=M.presetState('adjacent'),next=M.applyRecommendation(s);
 assert.equal(s.current,1);assert.equal(s.comparison,null);assert.equal(next.current,11);
 assert.deepEqual(next.networks,s.networks);
 assert.notEqual(next.comparison.networks,s.networks);
 assert.notEqual(next.comparison.networks[0],s.networks[0]);
});
test('repeated apply and already-minimum apply never overwrite a snapshot',()=>{
 const applied=M.applyRecommendation(M.presetState('strength'));
 assert.equal(M.applyRecommendation(applied),applied);
 assert.equal(M.applyRecommendation({...applied,networks:[]}).comparison,applied.comparison);
 for(const key of ['balanced','empty']){
  const state=M.presetState(key);assert.equal(M.applyRecommendation(state),state);assert.equal(state.comparison,null);
 }
});
test('a later meaningful application replaces the single saved comparison',()=>{
 const s=M.applyRecommendation(M.presetState('adjacent'));
 s.networks[0].channel=11;
 const next=M.applyRecommendation(s);
 assert.equal(next.current,1);assert.equal(next.comparison.beforeChannel,11);
 assert.equal(next.comparison.networks[0].channel,11);assert.deepEqual(next.comparison.minima,[1,6]);
});
test('reset and switching presets clear comparisons and restore independent inputs',()=>{
 const dirty=M.applyRecommendation(M.presetState('dorm'));
 dirty.networks[0].rssi=-90;
 for(const key of Object.keys(M.presets)){
  const fresh=M.presetState(key);
  assert.equal(fresh.comparison,null);assert.equal(fresh.current,M.presets[key].current);
  assert.deepEqual(fresh.networks,M.presets[key].networks);assert.notEqual(fresh.networks,M.presets[key].networks);
 }
 assert.notEqual(M.presetState('dorm').networks[0].rssi,-90);
 assert.throws(()=>M.presetState('missing'));assert.throws(()=>M.presetState('toString'));
});
test('clear comparison keeps live inputs and current channel',()=>{
 const s=M.applyRecommendation(M.presetState('strength')),cleared=M.clearComparison(s);
 assert.equal(cleared.comparison,null);assert.equal(cleared.current,11);assert.deepEqual(cleared.networks,s.networks);
 assert.notEqual(s.comparison,null);
});
test('floating point tolerance identifies ties without hiding meaningful differences',()=>{
 const make=delta=>[{channel:1,rssi:-50},{channel:6,rssi:-50+delta},{channel:11,rssi:-50}];
 assert.deepEqual(M.analyze(make(1e-12),6).minima,[1,6,11]);
 assert.equal(M.analyze(make(1e-12),6).selected,6);
 assert.deepEqual(M.analyze(make(1e-6),6).minima,[1,11]);
 assert.equal(M.analyze(make(1e-6),6).selected,1);
});
test('power scaling holds for weighted contributions and input endpoints',()=>{
 for(let c=1;c<=11;c++)for(const candidate of M.candidates)
  near(M.power(-40)*M.overlap(candidate,c),10*M.power(-50)*M.overlap(candidate,c));
 near(M.analyze([{channel:1,rssi:-90}]).currentScore,.0001);
 near(M.analyze([{channel:11,rssi:-30}],11).currentScore,100);
 for(const invalid of [null,{},'networks',[null],[{}]])assert.throws(()=>M.analyze(invalid));
});
test('one strong overlapping network outweighs several weak ones',()=>{
 const strong=M.analyze([{channel:1,rssi:-40}]).currentScore;
 const weak=M.analyze(Array(3).fill({channel:1,rssi:-60})).currentScore;
 near(strong,10);near(weak,.3);assert.ok(strong>weak);
});
// Independent CSV reader checks the structure, not just matching output substrings.
function readCsv(text){
 const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==='"'){
   if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;
  }else if(c===','&&!quoted){row.push(cell);cell='';}
  else if(c==='\r'&&text[i+1]==='\n'&&!quoted){row.push(cell);rows.push(row);row=[];cell='';i++;}
  else cell+=c;
 }
 row.push(cell);rows.push(row);assert.equal(quoted,false);return rows;
}
test('CSV round trips commas, quotes, newlines, Unicode and blank names',()=>{
 const names=['A "quoted", AP','', 'Café 📶','line one\nline two'];
 const rows=readCsv(M.csv(names.map(name=>({name,channel:3,rssi:-50})),1));
 assert.deepEqual(rows.filter(r=>r[0]==='neighbor').map(r=>r[1]),names);
 assert.ok(rows.every(r=>r.length===5));
});
test('CSV protects formula-like names even after leading whitespace',()=>{
 for(const name of ['=1+1','+SUM(1,2)','-1','@SUM(1)',' =1','\t=1','\r=1','\n=1','\tplain']){
  const rows=readCsv(M.csv([{name,channel:1,rssi:-50}],1));
  assert.equal(rows.find(r=>r[0]==='neighbor')[1],"'"+name);
 }
});
test('CSV separates live results from saved inputs and uses full numeric precision',()=>{
 const state=M.applyRecommendation(M.presetState('dorm'));
 const snapshot=state.comparison;
 state.networks[0].name='Live only';state.networks[0].channel=11;state.networks[0].rssi=-63;
 const rows=readCsv(M.csv(state.networks,state.current,snapshot));
 const analysis=M.analyze(state.networks,state.current);
 assert.equal(rows.filter(r=>r[0]==='section').length,2);
 for(const score of analysis.scores)assert.equal(Number(rows.find(r=>r[0]==='candidate'&&Number(r[2])===score.channel)[4]),score.score);
 for(const score of snapshot.scores)assert.equal(Number(rows.find(r=>r[0]==='saved_candidate'&&Number(r[2])===score.channel)[4]),score.score);
 assert.equal(rows.find(r=>r[0]==='neighbor')[1],'Live only');
 assert.equal(rows.find(r=>r[0]==='saved_neighbor')[1],'Hallway AP');
 assert.equal(Number(rows.find(r=>r[0]==='saved_before')[4]),snapshot.beforeScore);
 assert.equal(Number(rows.find(r=>r[0]==='saved_applied')[4]),snapshot.afterScore);
 assert.equal(Number(rows.find(r=>r[0]==='saved_absolute_reduction')[4]),snapshot.absoluteReduction);
 assert.equal(Number(rows.find(r=>r[0]==='saved_percent_reduction')[4]),snapshot.percentReduction);
 assert.equal(Number(rows.find(r=>r[0]==='current')[2]),state.current);
 assert.equal(Number(rows.find(r=>r[0]==='recommended')[2]),analysis.selected);
 assert.ok(rows.some(r=>r[0]==='metadata'&&r[1].includes('relative units')));
});
test('CSV empty scenarios still contain candidates/current/recommendation and null percent',()=>{
 const rows=readCsv(M.csv([],6,M.createComparison([],6)));
 assert.equal(rows.filter(r=>r[0]==='neighbor').length,0);
 assert.deepEqual(rows.filter(r=>r[0]==='candidate').map(r=>Number(r[4])),[0,0,0]);
 assert.equal(rows.find(r=>r[0]==='current')[2],'6');assert.equal(rows.find(r=>r[0]==='recommended')[2],'6');
 assert.equal(rows.find(r=>r[0]==='saved_percent_reduction')[4],'not applicable');
 assert.equal(readCsv(M.csv([],1)).some(r=>r[0].startsWith('saved_')),false);
});
