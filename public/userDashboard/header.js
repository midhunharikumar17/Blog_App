const avatarBtn = document.getElementById("avatarBtn");
const avatarMenu = document.getElementById("avatarMenu");
const logoutBtn = document.getElementById("logoutBtn");

avatarBtn.addEventListener("click", () => {
  avatarMenu.classList.toggle("hidden");
});

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href= "/index.html"
});