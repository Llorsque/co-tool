async function loadTrajecten() {
  const clubRes = await fetch('data/clubs.json');
  const clubs = await clubRes.json();
  const select = document.getElementById('clubSelect');
  clubs.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    select.appendChild(opt);
  });

  let stored = JSON.parse(localStorage.getItem('trajecten') || 'null');
  if(!stored) {
    const res = await fetch('data/trajecten.json');
    stored = await res.json();
    localStorage.setItem('trajecten', JSON.stringify(stored));
  }
  window.trajecten = stored;
  renderTable();

  document.getElementById('trajectForm').addEventListener('submit', e => {
    e.preventDefault();
    addTraject();
  });
}

function renderTable() {
  const tbody = document.querySelector('#trajectTable tbody');
  tbody.innerHTML = '';
  window.trajecten.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.club}</td>
      <td>${t.traject}</td>
      <td>${t.datum}</td>
    `;
    tbody.appendChild(tr);
  });
}

function addTraject() {
  const club = document.getElementById('clubSelect').value;
  const type = document.getElementById('trajectType').value;
  if(!club || !type) {
    alert('Selecteer een club en vul een trajecttype in.');
    return;
  }
  const nieuw = {
    club: club,
    traject: type,
    datum: new Date().toLocaleDateString()
  };
  window.trajecten.push(nieuw);
  localStorage.setItem('trajecten', JSON.stringify(window.trajecten));
  renderTable();
  document.getElementById('trajectForm').reset();
}

window.onload = loadTrajecten;
