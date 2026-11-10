(function(root){
'use strict';
const candidates=[1,6,11];
const presets={
 dorm:{label:'Busy dorm',description:'Several nearby networks crowd the lower channels. Compare the quieter alternatives.',current:1,networks:[{name:'Hallway AP',channel:1,rssi:-42},{name:'Room 402',channel:3,rssi:-55},{name:'Study lounge',channel:6,rssi:-57},{name:'Next building',channel:11,rssi:-76}]},
 adjacent:{label:'Channel overlap',description:'A single neighbor on channel 3 affects candidates 1 and 6 differently.',current:1,networks:[{name:'Neighbor on channel 3',channel:3,rssi:-50}]},
 strength:{label:'Signal strength',description:'One neighbor per candidate channel, but their received powers differ by factors of ten.',current:1,networks:[{name:'Strong neighbor',channel:1,rssi:-40},{name:'Medium neighbor',channel:6,rssi:-50},{name:'Weak neighbor',channel:11,rssi:-60}]},
 balanced:{label:'Balanced channels',description:'Equal neighbors produce a tie. Keeping the current channel avoids an unnecessary switch.',current:6,networks:[{name:'Network A',channel:1,rssi:-50},{name:'Network B',channel:6,rssi:-50},{name:'Network C',channel:11,rssi:-50}]},
 empty:{label:'Empty spectrum',description:'With no modeled neighbors, all candidates tie. There is no demonstrated reason to switch.',current:1,networks:[]}
};
function validate(networks,current=1){
 if(!Array.isArray(networks)||networks.length>10)throw new Error('Use between 0 and 10 neighboring networks.');
 if(!candidates.includes(current))throw new Error('Choose current channel 1, 6 or 11.');
 for(const n of networks){if(!n||!Number.isInteger(n.channel)||n.channel<1||n.channel>11)throw new Error('Neighbor channels must be whole numbers from 1 to 11.');if(typeof n.rssi!=='number'||!Number.isFinite(n.rssi)||n.rssi< -90||n.rssi> -30)throw new Error('Signal levels must be between −90 and −30 dBm.');}
}
const overlap=(c,n)=>Math.max(0,1-Math.abs(c-n)/5);
const power=rssi=>10**((rssi+50)/10);
const close=(a,b)=>Math.abs(a-b)<=1e-12*Math.max(1,Math.abs(a),Math.abs(b));
function analyze(networks,current=1){validate(networks,current);const scores=candidates.map(channel=>({channel,score:networks.reduce((s,n)=>s+power(n.rssi)*overlap(channel,n.channel),0)}));const best=Math.min(...scores.map(s=>s.score));const minima=scores.filter(s=>close(s.score,best)).map(s=>s.channel);const selected=minima.includes(current)?current:minima[0];const currentScore=scores.find(s=>s.channel===current).score;const selectedScore=scores.find(s=>s.channel===selected).score;return{scores,minima,selected,currentScore,best,selectedScore,reduction:currentScore>0?Math.max(0,100*(currentScore-selectedScore)/currentScore):null};}
function csv(networks,current){const a=analyze(networks,current);const cell=v=>'"'+String(v).replaceAll('"','""')+'"';const safeName=s=>/^[=+@\-\t\r]/.test(s)?"'"+s:s;return [['type','name','channel','rssi_dBm','model_score'],...networks.map((n,i)=>['neighbor',safeName(String(n.name||`Network ${i+1}`)),n.channel,n.rssi,'']),...a.scores.map(s=>['candidate','',s.channel,'',s.score]),['current','',current,'',a.currentScore],['recommended','',a.selected,'',a.selectedScore]].map(row=>row.map(cell).join(',')).join('\r\n');}
const api={candidates,presets,validate,overlap,power,analyze,csv};root.WifiModel=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
