const map = L.map('map').setView([27.8, -81.7], 6);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19, attribution: 'Tiles © Esri'
}).addTo(map);
let all = [], markers = L.layerGroup().addTo(map);
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function normalize(r) {
  const get = (...keys) => { for (const k of keys) if (r[k] != null && r[k] !== '') return String(r[k]).trim(); return ''; };
  return {name:get('name','Name'),callsign:get('callsign','Callsign','call'),city:get('city','City'),county:get('county','County'),
    output_frequency:get('output_frequency','output frequency','Output Frequency','frequency','Frequency'),
    input_frequency:get('input_frequency','input frequency','Input Frequency'),tone:get('tone','Tone','PL'),
    mode:get('mode','Mode'),latitude:get('latitude','Latitude','lat'),longitude:get('longitude','Longitude','lon','lng'),
    notes:get('notes','Notes'),source:get('source','Source'),verified_date:get('verified_date','verified date','Verified Date')};
}
function parseCSV(text) {
  const rows=[]; let row=[], field='', quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&quoted&&n==='"'){field+='"';i++}else if(c==='"'){quoted=!quoted}else if(c===','&&!quoted){row.push(field);field=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&n==='\n')i++;row.push(field);if(row.some(x=>x.trim()))rows.push(row);row=[];field=''}else field+=c;}
  row.push(field);if(row.some(x=>x.trim()))rows.push(row);if(rows.length<2)return [];
  const headers=rows.shift().map(x=>x.trim());
  return rows.map(cols=>Object.fromEntries(headers.map((h,i)=>[h,cols[i]??''])));
}
function filtered(){const q=$('search').value.toLowerCase(),county=$('county').value,mode=$('mode').value;return all.filter(r=>
  (!county||r.county===county)&&(!mode||r.mode===mode)&&(!q||Object.values(r).join(' ').toLowerCase().includes(q)));}
function render(){
  const data=filtered();markers.clearLayers();
  data.forEach(r=>{const lat=Number(r.latitude),lon=Number(r.longitude);if(Number.isFinite(lat)&&Number.isFinite(lon)&&lat>=24&&lat<=32&&lon>=-88&&lon<=-79){
    L.marker([lat,lon]).bindPopup(`<div class="popup-title">${esc(r.callsign||r.name||'Repeater')}</div><div class="popup-meta">${esc(r.city)}${r.county?' · '+esc(r.county)+' County':''}</div><b>Output:</b> ${esc(r.output_frequency)} MHz<br><b>Mode:</b> ${esc(r.mode)}<br><b>Tone:</b> ${esc(r.tone||'Not listed')}<br>${esc(r.notes)}`).addTo(markers);
  }});
  $('rows').innerHTML=data.length?data.map(r=>`<tr><td><span class="call">${esc(r.callsign||'—')}</span><br>${esc(r.name)}</td><td>${esc(r.city)}</td><td>${esc(r.county)}</td><td>${esc(r.output_frequency)}</td><td>${esc(r.mode)}</td><td>${esc([r.input_frequency,r.tone].filter(Boolean).join(' · ')||'—')}</td></tr>`).join(''):'<tr><td colspan="6" class="empty">No matching records. Import a CSV exported from HAMCORE.</td></tr>';
  $('result-count').textContent=`${data.length} listing${data.length===1?'':'s'}`;
  $('stat-total').textContent=all.length;$('stat-counties').textContent=new Set(all.map(r=>r.county).filter(Boolean)).size;$('stat-modes').textContent=new Set(all.map(r=>r.mode).filter(Boolean)).size;
}
function setData(rows){all=rows.map(normalize);const counties=[...new Set(all.map(r=>r.county).filter(Boolean))].sort(),modes=[...new Set(all.map(r=>r.mode).filter(Boolean))].sort();
  $('county').innerHTML='<option value="">All counties</option>'+counties.map(x=>`<option>${esc(x)}</option>`).join('');
  $('mode').innerHTML='<option value="">All modes</option>'+modes.map(x=>`<option>${esc(x)}</option>`).join('');render();}
['search','county','mode'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',render));
$('csv-file').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{setData(parseCSV(await f.text()));}catch(err){alert('Could not read that CSV. Please export it from HAMCORE and try again.');}e.target.value='';});
$('export').addEventListener('click',()=>{const cols=['name','callsign','city','county','output_frequency','input_frequency','tone','mode','latitude','longitude','notes','source','verified_date'];const csv=[cols.join(','),...filtered().map(r=>cols.map(k=>'"'+String(r[k]??'').replace(/"/g,'""')+'"').join(','))].join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='hamcore-repeaters.csv';a.click();URL.revokeObjectURL(a.href);});
fetch('repeaters.json').then(r=>r.ok?r.json():[]).then(rows=>setData(Array.isArray(rows)?rows:[])).catch(()=>setData([]));
