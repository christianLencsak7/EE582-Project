'use strict';
const M = window.WifiModel;
const $ = id => document.getElementById(id);
const colors = ['#3f8d79','#c59252','#6c84ad','#ab7493','#81964d','#6976a6','#b9795e','#5b9fa4','#a58f4f','#797b85'];
let state, selectedPreset = 'dorm', custom = false;
const fmt = x => x === 0 ? '0' : x < .001 ? x.toExponential(2) : Number(x.toPrecision(4)).toString();
const percent = x => x === null ? 'Not applicable' : x > 99.999 && x < 100 ? '>99.999%' : `${Number(x.toPrecision(6))}%`;
function notify(text) {
  $('toast').textContent = text;
  $('toast').classList.add('show');
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => $('toast').classList.remove('show'), 4500);
}
function loadPreset(key, announce = true) {
  selectedPreset = key;
  custom = false;
  state = M.presetState(key);
  $('current').value = state.current;
  renderInputs();
  renderResults();
  if (announce) notify(`${M.presets[key].label} loaded. Saved comparison cleared.`);
}
function markCustom() { custom = true; }
for (const [key, p] of Object.entries(M.presets)) {
  const button = document.createElement('button');
  button.className = 'preset';
  button.textContent = p.label;
  button.dataset.key = key;
  button.onclick = () => loadPreset(key);
  $('presets').append(button);
}
function renderInputs() {
  const list = $('networks');
  list.replaceChildren();
  state.networks.forEach((n, i) => {
    const el = document.createElement('div');
    el.className = 'network';
    el.innerHTML = `<div class="network-top"><span class="dot" style="background:${colors[i]}"></span><span class="network-number">${i+1}</span><input class="name" maxlength="40" aria-label="Network ${i+1} name"><button class="remove" aria-label="Remove network ${i+1}">×</button></div><div class="network-fields"><label>Channel<select aria-label="Network ${i+1} channel">${Array.from({length:11},(_,j)=>`<option>${j+1}</option>`).join('')}</select></label><div class="signal"><div class="signal-line"><label for="signal-${i}">RSSI</label><output id="output-${i}" for="signal-${i}"></output></div><input id="signal-${i}" type="range" min="-90" max="-30" step="1" aria-label="Network ${i+1} signal strength in dBm"></div></div>`;
    const name = el.querySelector('.name');
    name.value = n.name;
    name.oninput = () => { n.name = name.value; markCustom(); renderResults(); };
    const select = el.querySelector('select');
    select.value = n.channel;
    select.onchange = () => { n.channel = Number(select.value); markCustom(); renderResults(); };
    const slider = el.querySelector('[type=range]'), out = el.querySelector('output');
    slider.value = n.rssi;
    out.textContent = `${n.rssi} dBm`;
    slider.oninput = () => {
      n.rssi = Number(slider.value);
      out.textContent = `${n.rssi} dBm`;
      slider.setAttribute('aria-valuetext', `${n.rssi} dBm`);
      markCustom(); renderResults();
    };
    slider.setAttribute('aria-valuetext', `${n.rssi} dBm`);
    el.querySelector('.remove').onclick = () => {
      state.networks.splice(i, 1);
      markCustom(); renderInputs(); renderResults();
      const target = $('networks').children[Math.min(i, state.networks.length-1)];
      (target?.querySelector('.remove') || $('add')).focus();
      notify(`Network removed. ${state.networks.length} neighbors remain.`);
    };
    list.append(el);
  });
  if (!state.networks.length) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No neighbors yet. Add one to explore how overlap changes.';
    list.append(p);
  }
  $('count').textContent = `${state.networks.length} / 10`;
  $('add').disabled = state.networks.length >= 10;
}
function drawSpectrum() {
  const W=760, H=220, left=32, right=730, base=184;
  const x = c => left + (c+4)/20 * (right-left);
  const scale = Math.max(...state.networks.map(n=>M.power(n.rssi)), 1e-6);
  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;
  for (const c of M.candidates) svg += `<rect x="${x(c)-13}" y="12" width="26" height="${base-12}" fill="#edf5ef"/><line x1="${x(c)}" y1="12" x2="${x(c)}" y2="${base}" stroke="#aac8b5" stroke-dasharray="3 5"/>`;
  for (let y=34; y<=base; y+=50) svg += `<line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="#eaf0eb"/>`;
  state.networks.forEach((n,i) => {
    const peak = base - 150*M.power(n.rssi)/scale;
    svg += `<path d="M ${x(n.channel-5)} ${base} L ${x(n.channel)} ${peak} L ${x(n.channel+5)} ${base} Z" fill="${colors[i]}" fill-opacity=".13" stroke="${colors[i]}" stroke-width="2" stroke-linejoin="round"/>`;
  });
  svg += `<line x1="${left}" y1="${base}" x2="${right}" y2="${base}" stroke="#c9d6cc"/>`;
  for (let c=1;c<=11;c++) svg += `<text x="${x(c)}" y="207" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#315d4c" font-weight="${M.candidates.includes(c)?'700':'400'}">${c}</text>`;
  if (!state.networks.length) svg += '<text x="380" y="100" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#52665d">No modeled signals. All candidates tie.</text>';
  $('spectrum').innerHTML = svg + '</svg>';
  $('spectrum').setAttribute('aria-label', `Overlap footprints for ${state.networks.length} synthetic networks. Height is relative power times overlap, automatically scaled. Numeric values follow.`);
  $('scale-note').textContent = state.networks.length
    ? `Auto-scaled: the tallest peak = ${fmt(scale)} relative power units. Even a weak signal fills the chart when it is the strongest input; compare the numbers below.`
    : 'No power to plot. All three candidate scores are zero.';
  $('chart-key').replaceChildren();
  state.networks.forEach((n,i) => {
    const item = document.createElement('li');
    const dot = document.createElement('span');
    dot.className = 'dot'; dot.style.background = colors[i];
    item.append(dot, document.createTextNode(`${i+1}. ${n.name || 'Unnamed network'} · ch ${n.channel} · ${n.rssi} dBm · power ${fmt(M.power(n.rssi))}`));
    $('chart-key').append(item);
  });
}
function renderComparison(a) {
  const s = state.comparison;
  $('saved-details').hidden = !s;
  $('comparison-empty').hidden = !!s;
  $('clear-comparison').disabled = !s;
  if (!s) {
    $('comparison-empty').textContent = a.selected === state.current
      ? `No change needed: channel ${state.current} already has a minimum score. ${a.currentScore === 0 ? 'Percentage model score reduction: not applicable (zero baseline).' : 'Applying would give no score reduction.'} No comparison saved.`
      : 'Apply the recommendation to save the original and applied scores together with a copy of these inputs.';
    return;
  }
  $('before-channel').textContent = `Channel ${s.beforeChannel}`;
  $('after-channel').textContent = `Channel ${s.afterChannel}`;
  $('before-score').textContent = fmt(s.beforeScore);
  $('after-score').textContent = fmt(s.afterScore);
  $('absolute-reduction').textContent = fmt(s.absoluteReduction);
  $('percent-reduction').textContent = percent(s.percentReduction);
  $('comparison-explanation').textContent = `With the saved inputs, moving from channel ${s.beforeChannel} to ${s.afterChannel} reduced the model score by ${fmt(s.absoluteReduction)} relative units. ${s.minima.length>1 ? `Channels ${s.minima.join(', ')} tied; the lowest-numbered minimum was applied. ` : ''}This is not a measured Wi-Fi speed improvement.`;
  $('snapshot-status').textContent = M.snapshotMatches(s, state.networks)
    ? `Saved inputs match the live neighbors. Current simulated channel: ${state.current}.`
    : `Live neighbors have changed. These saved scores still use the inputs below; they have not been recalculated. Current simulated channel: ${state.current}.`;
  $('saved-inputs').replaceChildren();
  s.networks.forEach((n,i) => {
    const li = document.createElement('li');
    li.textContent = `${i+1}. ${n.name || 'Unnamed network'} · channel ${n.channel} · ${n.rssi} dBm`;
    $('saved-inputs').append(li);
  });
}
function renderResults() {
  const a = M.analyze(state.networks,state.current);
  $('scenario-state').textContent = custom ? 'CUSTOM' : 'PRESET';
  $('scenario-description').textContent = custom ? 'Custom environment. Adjust the inputs to explore the tradeoffs.' : M.presets[selectedPreset].description;
  for (const b of $('presets').children) b.setAttribute('aria-pressed', String(!custom && b.dataset.key===selectedPreset));
  drawSpectrum();
  const max = Math.max(...a.scores.map(s=>s.score),1e-12);
  $('scores').innerHTML = a.scores.map(s=>`<div class="score ${a.minima.includes(s.channel)?'best':''} ${s.channel===state.current?'is-current':''}"><div class="score-title">Channel ${s.channel}</div><div class="score-tags">${s.channel===state.current?'<span>Current</span>':''}${a.minima.includes(s.channel)?'<span>Minimum</span>':''}</div><div class="value">${fmt(s.score)}</div><div class="units">relative model units</div><div class="bar"><span style="width:${100*s.score/max}%"></span></div></div>`).join('');
  let title, explanation;
  if (!state.networks.length) {
    title='No reason to switch'; explanation='All channels score 0 with no modeled neighbors. Your current channel is retained. Percentage model score reduction: not applicable (zero baseline).';
  } else if (a.selected===state.current) {
    title=`Keep channel ${state.current}`;
    explanation=a.minima.length>1 ? `Channels ${a.minima.join(', ')} tie for the minimum. We keep your current channel; no change is needed.` : 'Your current channel has the lowest score for these inputs. No change is needed.';
    if (a.currentScore===0) explanation+=' Percentage model score reduction: not applicable (zero baseline).';
  } else {
    title=`Try channel ${a.selected}`;
    explanation=`Model score changes from ${fmt(a.currentScore)} to ${fmt(a.selectedScore)} (${percent(a.reduction)} model score reduction).`;
    if (a.minima.length>1) explanation+=` Channels ${a.minima.join(', ')} tie; the lowest number breaks the tie.`;
  }
  $('recommendation').replaceChildren();
  const strong=document.createElement('strong'), p=document.createElement('p');
  strong.textContent=title; p.textContent=explanation;
  $('recommendation').append(strong,p);
  $('apply').disabled=a.selected===state.current;
  $('apply').textContent=a.selected===state.current ? 'Current channel is already a minimum' : `Apply channel ${a.selected} & save comparison →`;
  $('contributions').replaceChildren();
  state.networks.forEach((n,i)=>{
    const tr=document.createElement('tr');
    for (const val of [n.name||`Network ${i+1}`,n.channel,n.rssi,...M.candidates.map(c=>fmt(M.power(n.rssi)*M.overlap(c,n.channel)))]) {
      const td=document.createElement('td'); td.textContent=val; tr.append(td);
    }
    $('contributions').append(tr);
  });
  renderComparison(a);
}
$('current').onchange=()=>{state.current=Number($('current').value);markCustom();renderResults();notify(`Current simulated channel set to ${state.current}.${state.comparison?' Saved comparison retained.':''}`);};
$('add').onclick=()=>{
  if(state.networks.length>=10)return;
  state.networks.push({name:`Network ${state.networks.length+1}`,channel:6,rssi:-60});
  markCustom();renderInputs();renderResults();
  $('networks').lastElementChild.querySelector('.name').focus();
  notify(`Network added. ${state.networks.length} of 10 neighbors.`);
};
$('reset').onclick=()=>loadPreset(selectedPreset);
$('apply').onclick=()=>{
  const next=M.applyRecommendation(state);
  if(next===state){notify('Current channel is already a minimum. Saved comparison unchanged.');return;}
  state=next;
  $('current').value=state.current;
  markCustom();renderResults();
  notify(`Channel ${state.current} applied in the simulation. Before-and-after comparison saved.`);
};
$('clear-comparison').onclick=()=>{
  state=M.clearComparison(state);renderResults();
  $('saved-heading').focus();
  notify('Saved comparison cleared. Live inputs and current channel retained.');
};
$('export').onclick=()=>{
  const blob=new Blob(['\uFEFF',M.csv(state.networks,state.current,state.comparison)],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob), a=document.createElement('a');
  a.href=url;
  a.download=`channel-lab-${selectedPreset}${custom?'-custom':''}-${new Date().toISOString().replace(/[:.]/g,'-')}.csv`;
  document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  notify('CSV download requested, including live inputs and any saved comparison.');
};
loadPreset('dorm',false);
