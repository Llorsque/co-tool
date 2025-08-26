function login(e) {
  e.preventDefault();
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if(user && pass) {
    window.location.href = 'main.html';
  } else {
    alert('Vul gebruikersnaam en wachtwoord in.');
  }
  return false;
}
