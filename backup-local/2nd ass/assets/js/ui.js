const menuBtn = document.querySelector(".mobile-menu-btn");
const closeBtn = document.querySelector(".sidebar-close-btn");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".sidebar-overlay");

menuBtn?.addEventListener("click", () => {
  sidebar.classList.add("sidebar-open");
  overlay.classList.add("overlay-show");
});

closeBtn?.addEventListener("click", () => {
  sidebar.classList.remove("sidebar-open");
  overlay.classList.remove("overlay-show");
});

overlay?.addEventListener("click", () => {
  sidebar.classList.remove("sidebar-open");
  overlay.classList.remove("overlay-show");
});
