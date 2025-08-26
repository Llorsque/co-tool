async function loadCompare() {
  const clubRes = await fetch('data/clubs.json');
  const clubs = await clubRes.json();
  const sel1 = document.getElementById('club1');
  const sel2 = document.getElementById('club2');
  clubs.forEach(c => {
    const opt1 = document.createElement('option');
    opt1.value = c.name;
    opt1.textContent = c.name;
    sel1.appendChild(opt1);
    const opt2 = document.createElement('option');
    opt2.value = c.name;
    opt2.textContent = c.name;
    sel2.appendChild(opt2);
  });

  const res = await fetch('data/compare.json');
  window.compareData = await res.json();

  document.getElementById('compareBtn').addEventListener('click', compareClubs);
}

function compareClubs() {
  const c1 = document.getElementById('club1').value;
  const c2 = document.getElementById('club2').value;
  if(!c1 || !c2 || c1 === c2) {
    alert('Kies twee verschillende clubs.');
    return;
  }
  const d1 = window.compareData.find(c => c.club === c1);
  const d2 = window.compareData.find(c => c.club === c2);
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <h2>${c1} vs ${c2}</h2>
    <table class="compare-table">
      <tr><th>Kenmerk</th><th>${c1}</th><th>${c2}</th></tr>
      <tr><td>Aantal leden</td><td>${d1.leden}</td><td>${d2.leden}</td></tr>
      <tr><td>Vrijwilligers</td><td>${d1.vrijwilligers}</td><td>${d2.vrijwilligers}</td></tr>
      <tr><td>Contributie (€)</td><td>${d1.contributie}</td><td>${d2.contributie}</td></tr>
      <tr><td>Trajecten actief</td><td>${d1.trajecten}</td><td>${d2.trajecten}</td></tr>
    </table>
  `;
}

window.onload = loadCompare;
