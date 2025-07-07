// Storage Helpers
function getData(key, fallback) {
  const d = localStorage.getItem(key);
  return d ? JSON.parse(d) : fallback;
}
function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Users & Auth --------------------------------------------------
const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };

function signupUser(username, password, name) {
  let users = getData("users", []);
  if (users.find(u => u.username === username)) {
    alert("Username already exists");
    return false;
  }
  const userObj = {
    id: Date.now(),
    username,
    password,
    name,
    points: 0,
    tasks: [] // { appId, screenshot, verified }
  };
  users.push(userObj);
  setData("users", users);
  alert("Signup successful. Please login.");
  window.location.href = "login.html";
  return true;
}

function login(username, password, role) {
  if (role === "admin") {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem("userType", "admin");
      window.location.href = "admin.html";
    } else {
      alert("Invalid admin credentials");
    }
    return;
  }
  const users = getData("users", []);
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    sessionStorage.setItem("userType", "user");
    sessionStorage.setItem("userId", user.id);
    window.location.href = "user.html";
  } else {
    alert("Invalid username or password");
  }
}

function currentUser() {
  const type = sessionStorage.getItem("userType");
  if (type === "user") {
    const id = parseInt(sessionStorage.getItem("userId"));
    return getData("users", []).find(u => u.id === id);
  }
  return null;
}

function updateUser(user) {
  let users = getData("users", []);
  users = users.map(u => (u.id === user.id ? user : u));
  setData("users", users);
}

function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}

// Apps (Managed by Admin) --------------------------------------
function addApp(app) {
  const apps = getData("apps", []);
  apps.push(app);
  setData("apps", apps);
}
function getApps() {
  return getData("apps", []);
}
function getAppById(id) {
  return getApps().find(a => a.id === id);
}

// Page Initialisers --------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname.split("/").pop();
  switch (page) {
    case "signup.html":
      initSignup();
      break;
    case "login.html":
      initLogin();
      break;
    case "admin.html":
      initAdminHome();
      break;
    case "addapp.html":
      initAddApp();
      break;
    case "user.html":
      initUserHome();
      break;
    case "profile.html":
      initProfile();
      break;
    case "points.html":
      initPoints();
      break;
    case "task.html":
      initTaskPage();
      break;
    case "logout.html":
      logout();
      break;
    default:
      break;
  }
});

// Signup Page ---------------------------------------------------
function initSignup() {
  const form = document.getElementById("signupForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const name = form.name.value.trim();
    if (!username || !password || !name) return alert("All fields required");
    signupUser(username, password, name);
  });
}

// Login Page ----------------------------------------------------
function initLogin() {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const role = form.role.value;
    login(username, password, role);
  });
}

// Admin Home ----------------------------------------------------
function initAdminHome() {
  // Guard
  if (sessionStorage.getItem("userType") !== "admin") return logout();
  const list = document.getElementById("appList");
  const apps = getApps();
  if (!apps.length) {
    list.innerHTML = "<p>No apps added yet.</p>";
    return;
  }
  apps.forEach(app => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="app-info">
        <img src="${app.icon || "https://placehold.co/48x48"}" alt="icon" />
        <div>
          <h3>${app.name}</h3>
          <small>${app.package}</small>
        </div>
      </div>
      <span class="btn">${app.points} pts</span>
    `;
    list.appendChild(div);
  });
}

// Add App Page --------------------------------------------------
function initAddApp() {
  if (sessionStorage.getItem("userType") !== "admin") return logout();
  const form = document.getElementById("addAppForm");
  const iconInput = document.getElementById("icon");
  let iconBase64 = "";
  iconInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => (iconBase64 = ev.target.result);
    reader.readAsDataURL(file);
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const app = {
      id: Date.now(),
      name: form.name.value.trim(),
      package: form.package.value.trim(),
      category: form.category.value.trim(),
      subcategory: form.subcategory.value.trim(),
      points: parseInt(form.points.value.trim()),
      icon: iconBase64
    };
    addApp(app);
    alert("App added successfully");
    window.location.href = "admin.html";
  });
}

// User Home -----------------------------------------------------
function initUserHome() {
  if (sessionStorage.getItem("userType") !== "user") return logout();
  const user = currentUser();
  document.getElementById("greet").textContent = `Hello, ${user.name}`;
  const container = document.getElementById("userApps");
  const apps = getApps();
  apps.forEach(app => {
    const already = user.tasks.find(t => t.appId === app.id && t.verified);
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="app-info">
        <img src="${app.icon || "https://placehold.co/48x48"}" alt="icon" />
        <div>
          <h3>${app.name}</h3>
          <small>${app.package}</small>
        </div>
      </div>
      <div>
        <span class="btn">${app.points} pts</span>
        <a class="btn btn-secondary" href="task.html?appId=${app.id}">${already ? "View" : "Do"} Task</a>
      </div>
    `;
    container.appendChild(div);
  });
}

// Profile -------------------------------------------------------
function initProfile() {
  if (sessionStorage.getItem("userType") !== "user") return logout();
  const user = currentUser();
  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileUsername").textContent = user.username;
  document.getElementById("profilePoints").textContent = user.points;
}

// Points --------------------------------------------------------
function initPoints() {
  if (sessionStorage.getItem("userType") !== "user") return logout();
  const user = currentUser();
  document.getElementById("totalPoints").textContent = user.points;
  const tableBody = document.getElementById("pointsTableBody");
  if (!user.tasks.length) {
    tableBody.innerHTML = `<tr><td colspan="3">No points yet.</td></tr>`;
    return;
  }
  user.tasks.filter(t => t.verified).forEach(t => {
    const app = getAppById(t.appId);
    const row = document.createElement("tr");
    row.innerHTML = `<td>${app.name}</td><td>${app.points}</td><td>✓</td>`;
    tableBody.appendChild(row);
  });
}

// Task Page (Drag & Drop) --------------------------------------
function initTaskPage() {
  if (sessionStorage.getItem("userType") !== "user") return logout();
  const params = new URLSearchParams(window.location.search);
  const appId = parseInt(params.get("appId"));
  const app = getAppById(appId);
  if (!app) return (window.location.href = "user.html");
  const user = currentUser();

  document.getElementById("taskAppName").textContent = app.name;
  document.getElementById("taskPoints").textContent = `${app.points} pts`;
  document.getElementById("taskIcon").src = app.icon || "https://placehold.co/48x48";

  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");

  function previewAndSave(file) {
    const reader = new FileReader();
    reader.onload = ev => {
      const imgSrc = ev.target.result;
      const img = document.createElement("img");
      img.src = imgSrc;
      dropZone.innerHTML = "";
      dropZone.appendChild(img);

      // update user task list
      const existing = user.tasks.find(t => t.appId === app.id);
      if (existing) {
        existing.screenshot = imgSrc;
        existing.verified = true;
      } else {
        user.tasks.push({ appId: app.id, screenshot: imgSrc, verified: true });
      }
      user.points += app.points;
      updateUser(user);
    };
    reader.readAsDataURL(file);
  }

  dropZone.addEventListener("dragover", e => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
  dropZone.addEventListener("drop", e => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file) previewAndSave(file);
  });

  fileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) previewAndSave(file);
  });
}