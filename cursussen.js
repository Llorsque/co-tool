async function loadCourses() {
  let stored = JSON.parse(localStorage.getItem('courses') || 'null');
  if(!stored) {
    const res = await fetch('data/courses.json');
    stored = await res.json();
    localStorage.setItem('courses', JSON.stringify(stored));
  }
  window.courses = stored;

  const clubRes = await fetch('data/clubs.json');
  window.clubs = await clubRes.json();

  renderCourses();
  document.getElementById('adminToggle').addEventListener('click', toggleAdmin);
  document.getElementById('resetCourses').addEventListener('click', resetCourses);
}

function renderCourses() {
  const grid = document.getElementById('coursesGrid');
  grid.innerHTML = '';
  window.courses.forEach((c, i) => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.innerHTML = `
      <img src="${c.image}" alt="${c.title}">
      <div class="tile-content">
        <h3>${c.title}</h3>
        <p>${c.organizer}</p>
        <p><strong>${c.date}</strong> | ${c.time} | ${c.duration}</p>
        <button onclick="openModal(${i})">Details</button>
        ${window.adminMode ? `<button onclick="openEdit(${i})">Bewerk</button>` : ''}
      </div>
    `;
    grid.appendChild(tile);
  });
}

function openModal(index) {
  const c = window.courses[index];
  document.getElementById('modalTitle').textContent = c.title;
  document.getElementById('modalImage').src = c.image;
  document.getElementById('modalDescription').textContent = c.description;
  document.getElementById('modalDate').textContent = c.date;
  document.getElementById('modalTime').textContent = c.time;
  const sel = document.getElementById('clubSelect');
  sel.innerHTML = '';
  window.clubs.forEach(club => {
    const opt = document.createElement('option');
    opt.value = club.name;
    opt.textContent = club.name;
    sel.appendChild(opt);
  });
  document.getElementById('bookCourse').onclick = () => bookCourse(c);
  document.getElementById('courseModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('courseModal').classList.add('hidden');
}
document.getElementById('closeModal').onclick = closeModal;

function bookCourse(course) {
  const club = document.getElementById('clubSelect').value;
  let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  bookings.push({
    course: course.title,
    club: club,
    date: new Date().toLocaleString()
  });
  localStorage.setItem('bookings', JSON.stringify(bookings));
  alert(`Cursus '${course.title}' geboekt namens ${club}`);
  closeModal();
}

function toggleAdmin() {
  window.adminMode = !window.adminMode;
  renderCourses();
}

function openEdit(index) {
  const c = window.courses[index];
  document.getElementById('editIndex').value = index;
  document.getElementById('editTitle').value = c.title;
  document.getElementById('editOrganizer').value = c.organizer;
  document.getElementById('editDate').value = c.date;
  document.getElementById('editTime').value = c.time;
  document.getElementById('editDuration').value = c.duration;
  document.getElementById('editImage').value = c.image;
  document.getElementById('editDescription').value = c.description;
  document.getElementById('editModal').classList.remove('hidden');
}

document.getElementById('closeEditModal').onclick = () => {
  document.getElementById('editModal').classList.add('hidden');
};

document.getElementById('editForm').onsubmit = e => {
  e.preventDefault();
  const index = document.getElementById('editIndex').value;
  window.courses[index] = {
    title: document.getElementById('editTitle').value,
    organizer: document.getElementById('editOrganizer').value,
    date: document.getElementById('editDate').value,
    time: document.getElementById('editTime').value,
    duration: document.getElementById('editDuration').value,
    image: document.getElementById('editImage').value,
    description: document.getElementById('editDescription').value
  };
  localStorage.setItem('courses', JSON.stringify(window.courses));
  renderCourses();
  document.getElementById('editModal').classList.add('hidden');
};

function resetCourses() {
  localStorage.removeItem('courses');
  loadCourses();
}

window.onload = loadCourses;
