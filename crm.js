async function loadCRM() {
  const res = await fetch('data/crm.json');
  let clubs = await res.json();
  window.crmData = clubs;
  renderTable(clubs);
  fillFilters(clubs);

  document.getElementById('searchInput').addEventListener('input', () => filterData());
  document.getElementById('gemeenteFilter').addEventListener('change', () => filterData());
  document.getElementById('sportFilter').addEventListener('change', () => filterData());
}

function renderTable(data) {
  const tbody = document.querySelector('#crmTable tbody');
  tbody.innerHTML = '';
  data.forEach(club => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${club.clubnaam}</td>
      <td>${club.sport}</td>
      <td>${club.gemeente}</td>
      <td>${club.contactpersoon}</td>
      <td>${club.email}</td>
      <td><button>Bekijk</button> <button>Bewerken</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function fillFilters(clubs) {
  const gemeenten = [...new Set(clubs.map(c => c.gemeente))];
  const sporten = [...new Set(clubs.map(c => c.sport))];

  const gSelect = document.getElementById('gemeenteFilter');
  gemeenten.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    gSelect.appendChild(opt);
  });

  const sSelect = document.getElementById('sportFilter');
  sporten.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    sSelect.appendChild(opt);
  });
}

function filterData() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const gemeente = document.getElementById('gemeenteFilter').value;
  const sport = document.getElementById('sportFilter').value;

  let filtered = window.crmData.filter(c =>
    (c.clubnaam.toLowerCase().includes(search) ||
     c.sport.toLowerCase().includes(search) ||
     c.gemeente.toLowerCase().includes(search)) &&
    (gemeente === '' || c.gemeente === gemeente) &&
    (sport === '' || c.sport === sport)
  );
  renderTable(filtered);
}

window.onload = loadCRM;
