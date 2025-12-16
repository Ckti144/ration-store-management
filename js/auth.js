// Simple frontend auth using localStorage
const USERS_KEY = 'users';
const LOGGED_IN_USER_KEY = 'loggedInUser';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function setLoggedInUser(username) {
  localStorage.setItem(LOGGED_IN_USER_KEY, username);
}
function getLoggedInUser() {
  return localStorage.getItem(LOGGED_IN_USER_KEY);
}
function logout() {
  localStorage.removeItem(LOGGED_IN_USER_KEY);
  window.location.href = 'login.html';
}

function enforceAuth() {
  const path = window.location.pathname.toLowerCase();
  if (!path.endsWith('login.html') && !getLoggedInUser()) {
    window.location.href = 'login.html';
  }
}

// Attach login/register logic only on login.html
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.toLowerCase();
  if (!path.endsWith('login.html')) {
    enforceAuth();
    return;
  }

  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const confirmGroup = document.getElementById('confirmGroup');
  const authForm = document.getElementById('authForm');
  const errorDiv = document.getElementById('authError');
  const submitBtn = document.getElementById('authSubmitBtn');

  let mode = 'login';
  function setMode(newMode) {
    mode = newMode;
    if (mode === 'login') {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      confirmGroup.style.display = 'none';
      submitBtn.textContent = 'Login';
    } else {
      loginTab.classList.remove('active');
      registerTab.classList.add('active');
      confirmGroup.style.display = 'block';
      submitBtn.textContent = 'Create Account';
    }
    errorDiv.style.display = 'none';
  }

  loginTab.addEventListener('click', () => setMode('login'));
  registerTab.addEventListener('click', () => setMode('register'));

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('authUsername').value.trim();
    const password = document.getElementById('authPassword').value;
    const confirmPassword = document.getElementById('authConfirmPassword').value;
    const users = getUsers();

    if (mode === 'register') {
      if (password.length < 4) {
        errorDiv.textContent = 'Password must be at least 4 characters.';
        errorDiv.style.display = 'block';
        return;
      }
      if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.style.display = 'block';
        return;
      }
      if (users.find(u => u.username === username)) {
        errorDiv.textContent = 'Username already exists.';
        errorDiv.style.display = 'block';
        return;
      }
      users.push({ username, password });
      saveUsers(users);
      setLoggedInUser(username);
      window.location.href = 'index.html';
    } else {
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) {
        errorDiv.textContent = 'Invalid username or password.';
        errorDiv.style.display = 'block';
        return;
      }
      setLoggedInUser(username);
      window.location.href = 'index.html';
    }
  });
});







