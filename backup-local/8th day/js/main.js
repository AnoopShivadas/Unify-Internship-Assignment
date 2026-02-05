/* ===============================
   THEME TOGGLE — FINAL FIX
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  if (!themeToggle) {
    console.error("Theme toggle button not found");
    return;
  }

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem("theme") || "dark";
  root.setAttribute("data-theme", savedTheme);
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  // Toggle theme on click
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
  });
});
