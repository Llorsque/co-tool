async function loadDashboard() {
  const res = await fetch('data/dashboard.json');
  let data = await res.json();
  window.dashboardData = data;
  window.activeFilters = { gemeente:'', plaats:'', sport:'', aanbod:'' };
  renderFilters(data);
  renderTiles(data);
  document.getElementById('gemeenteFilter').addEventListener('change', () => applyFilters());
  document.getElementById('plaatsFilter').addEventListener('change', () => applyFilters());
  document.getElementById('sportFilter').addEventListener('change', () => applyFilters());
  document.getElementById('aanbodFilter').addEventListener('change', () => applyFilters());
  document.getElementById('resetFilters').addEventListener('click', resetFilters);
  document.getElementById('exportData').addEventListener('click', exportData);
}

function renderFilters(data) {
  const gSet = [...new Set(data.map(d => d.gemeente))];
  const pSet = [...new Set(data.map(d => d.plaats))];
  const sSet = [...new Set(data.map(d => d.sport))];
  const aSet = [...new Set(data.map(d => d.aanbod))];

  fillSelect('gemeenteFilter', gSet);
  fillSelect('plaatsFilter', pSet);
  fillSelect('sportFilter', sSet);
  fillSelect('aanbodFilter', aSet);
}

function fillSelect(id, values) {
  const sel = document.getElementById(id);
  values.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    sel.appendChild(opt);
  });
}

function applyFilters() {
  const g = document.getElementById('gemeenteFilter').value;
  const p = document.getElementById('plaatsFilter').value;
  const s = document.getElementById('sportFilter').value;
  const a = document.getElementById('aanbodFilter').value;
  window.activeFilters = { gemeente:g, plaats:p, sport:s, aanbod:a };
  let filtered = window.dashboardData.filter(d =>
    (g==='' || d.gemeente===g) &&
    (p==='' || d.plaats===p) &&
    (s==='' || d.sport===s) &&
    (a==='' || d.aanbod===a)
  );
  renderTiles(filtered);
  renderActiveFilters();
}

function renderTiles(data) {
  const grid = document.getElementById('tilesGrid');
  grid.innerHTML = '';
  for(let i=0;i<12;i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    const val = data.length ? Math.floor(Math.random()*100) : 0;
    tile.innerHTML = `<div class="tile-content"><h2>${val}</h2><p>Kengetal ${i+1}</p></div>`;
    grid.appendChild(tile);
  }
}

function renderActiveFilters() {
  const af = document.getElementById('activeFilters');
  const {gemeente,plaats,sport,aanbod} = window.activeFilters;
  let parts = [];
  if(gemeente) parts.push('Gemeente: '+gemeente);
  if(plaats) parts.push('Plaats: '+plaats);
  if(sport) parts.push('Sport: '+sport);
  if(aanbod) parts.push('Aanbod: '+aanbod);
  af.textContent = parts.length ? 'Filters actief: ' + parts.join(' | ') : '';
}

function resetFilters() {
  ['gemeenteFilter','plaatsFilter','sportFilter','aanbodFilter'].forEach(id=>{
    document.getElementById(id).value='';
  });
  applyFilters();
}

function exportData() {
  const rows = [['Gemeente','Plaats','Sport','Aanbod']];
  const g = window.activeFilters.gemeente;
  const p = window.activeFilters.plaats;
  const s = window.activeFilters.sport;
  const a = window.activeFilters.aanbod;
  let filtered = window.dashboardData.filter(d =>
    (g==='' || d.gemeente===g) &&
    (p==='' || d.plaats===p) &&
    (s==='' || d.sport===s) &&
    (a==='' || d.aanbod===a)
  );
  filtered.forEach(d=>rows.push([d.gemeente,d.plaats,d.sport,d.aanbod]));
  let csvContent = rows.map(r=>r.join(",")).join("\n");
  let blob = new Blob([csvContent],{type:"text/csv"});
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href=url;
  a.download="export.csv";
  a.click();
}

window.onload = loadDashboard;
