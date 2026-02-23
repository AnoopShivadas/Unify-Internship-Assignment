/**
 * UI.js — Rendering Layer
 * Project Nexus Analytics Hub
 * Pure rendering functions — no state management here
 */

/* ─────────────────────────────────────────────
   DOM ELEMENT REFERENCES
───────────────────────────────────────────── */
const $grid        = () => document.getElementById("cards-grid");
const $favGrid     = () => document.getElementById("fav-cards-grid");
const $loading     = () => document.getElementById("loading-overlay");
const $errorBanner = () => document.getElementById("error-banner");
const $statItems   = () => document.getElementById("stat-items");
const $statFavs    = () => document.getElementById("stat-favs");
const $statAvg     = () => document.getElementById("stat-avg");
const $statTotal   = () => document.getElementById("stat-total");
const $favCount    = () => document.getElementById("fav-count");
const $favEmpty    = () => document.getElementById("fav-empty");
const $toast       = () => document.getElementById("toast");

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

const formatPrice = (price) => {
  if (price >= 1000) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1)    return `$${price.toFixed(2)}`;
  return `$${price.toFixed(4)}`;
};

const formatVolume = (vol) => {
  if (vol >= 1e12) return `$${(vol / 1e12).toFixed(2)}T`;
  if (vol >= 1e9)  return `$${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6)  return `$${(vol / 1e6).toFixed(2)}M`;
  return `$${vol.toLocaleString()}`;
};

const formatMarketCap = (mc) => formatVolume(mc);

const changeClass   = (change) => (change >= 0 ? "positive" : "negative");
const changeArrow   = (change) => (change >= 0 ? "▲" : "▼");
const changeAbs     = (change) => `${changeArrow(change)} ${Math.abs(change).toFixed(2)}%`;

/* ─────────────────────────────────────────────
   SKELETON LOADER TEMPLATES
───────────────────────────────────────────── */

const skeletonCard = () => `
  <div class="card skeleton-card" aria-hidden="true">
    <div class="skeleton-logo"></div>
    <div class="skeleton-line w-60"></div>
    <div class="skeleton-line w-40"></div>
    <div class="skeleton-line w-80"></div>
    <div class="skeleton-line w-50"></div>
  </div>`;

/* ─────────────────────────────────────────────
   CARD TEMPLATE
───────────────────────────────────────────── */

const cardTemplate = (item, isFavorite) => `
  <article class="card" data-id="${item.id}" data-symbol="${item.symbol}">
    <div class="card-glow"></div>

    <header class="card-header">
      <div class="card-logo" style="--logo-color: ${item.color}">
        <span>${item.logo}</span>
      </div>
      <div class="card-identity">
        <h3 class="card-name">${item.name}</h3>
        <span class="card-symbol">${item.symbol}</span>
      </div>
      <button
        class="fav-btn ${isFavorite ? "active" : ""}"
        data-id="${item.id}"
        aria-label="${isFavorite ? "Remove from favorites" : "Add to favorites"}"
        title="${isFavorite ? "Remove from favorites" : "Add to favorites"}"
      >
        <svg viewBox="0 0 24 24" fill="${isFavorite ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </header>

    <div class="card-price-block">
      <span class="card-price">${formatPrice(item.price)}</span>
      <span class="card-change ${changeClass(item.change)}">${changeAbs(item.change)}</span>
    </div>

    <div class="card-metrics">
      <div class="metric">
        <span class="metric-label">Volume 24h</span>
        <span class="metric-value">${formatVolume(item.volume)}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Market Cap</span>
        <span class="metric-value">${formatMarketCap(item.marketCap)}</span>
      </div>
    </div>

    <div class="card-footer">
      <span class="sector-tag" style="--tag-color: ${item.color}">${item.sector}</span>
      <span class="card-updated">Live</span>
    </div>

    <div class="card-sparkline">
      <svg viewBox="0 0 100 30" preserveAspectRatio="none">
        <polyline
          points="${generateSparkline(item.change)}"
          fill="none"
          stroke="${item.change >= 0 ? "#ff8c42" : "#ff4d6d"}"
          stroke-width="2"
        />
      </svg>
    </div>
  </article>`;

/* Generates a plausible-looking sparkline SVG path */
function generateSparkline(trend) {
  const points = [];
  let y = 15;
  for (let x = 0; x <= 100; x += 10) {
    y = Math.max(2, Math.min(28, y + (Math.random() - 0.45 + trend * 0.02) * 5));
    points.push(`${x},${y}`);
  }
  return points.join(" ");
}

/* ─────────────────────────────────────────────
   PUBLIC RENDER FUNCTIONS
───────────────────────────────────────────── */

/**
 * Renders asset cards into the main grid
 * @param {Array} data - filtered + sorted data
 * @param {Array} favorites - array of favorite IDs
 */
export function renderCards(data, favorites = []) {
  const grid = $grid();
  if (!grid) return;

  if (data.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No assets found</h3>
        <p>Try adjusting your search or filters</p>
      </div>`;
    return;
  }

  const favSet = new Set(favorites);
  grid.innerHTML = data
    .map((item) => cardTemplate(item, favSet.has(item.id)))
    .join("");

  // Stagger card entrance animations
  const cards = grid.querySelectorAll(".card:not(.skeleton-card)");
  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.05}s`;
    card.classList.add("card-enter");
  });
}

/**
 * Renders favorites panel
 * @param {Array} favData - full asset objects for each favorite
 */
export function renderFavorites(favData) {
  const grid    = $favGrid();
  const empty   = $favEmpty();
  const count   = $favCount();

  if (!grid) return;

  if (count) count.textContent = favData.length;

  if (favData.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }

  if (empty) empty.style.display = "none";

  grid.innerHTML = favData
    .map((item) => cardTemplate(item, true))
    .join("");
}

/**
 * Shows animated loading skeletons
 * @param {number} count - number of skeleton cards
 */
export function showLoading(count = 8) {
  const grid    = $grid();
  const overlay = $loading();

  if (grid) grid.innerHTML = Array(count).fill(skeletonCard()).join("");
  if (overlay) overlay.classList.add("active");
}

/**
 * Hides loading state
 */
export function hideLoading() {
  const overlay = $loading();
  if (overlay) overlay.classList.remove("active");
}

/**
 * Displays a dismissible error banner
 * @param {string} message
 */
export function showError(message) {
  const banner = $errorBanner();
  if (!banner) return;

  banner.innerHTML = `
    <span class="error-icon">⚠</span>
    <span>${message}</span>
    <button class="error-dismiss" onclick="this.parentElement.classList.remove('active')">✕</button>`;
  banner.classList.add("active");

  setTimeout(() => banner.classList.remove("active"), 8000);
}

/**
 * Applies or removes dark theme
 * @param {string} theme - 'dark' | 'light'
 */
export function updateTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = theme === "dark" ? "☀" : "🌙";
}

/**
 * Updates the top stats strip
 * @param {Array}  data      - current (filtered) data
 * @param {Array}  favorites - favorite IDs
 * @param {Array}  allData   - full unfiltered dataset
 */
export function updateStats(data, favorites, allData) {
  const totalItems = allData.length;
  const favCount   = favorites.length;

  // .reduce() to compute aggregates
  const totalValue = allData.reduce((sum, d) => sum + d.price, 0);
  const avgPrice   = totalItems > 0 ? totalValue / totalItems : 0;
  const totalMCap  = allData.reduce((sum, d) => sum + d.marketCap, 0);

  const el = (id) => document.getElementById(id);
  if (el("stat-items"))  el("stat-items").textContent  = totalItems;
  if (el("stat-favs"))   el("stat-favs").textContent   = favCount;
  if (el("stat-avg"))    el("stat-avg").textContent    = formatPrice(avgPrice);
  if (el("stat-total"))  el("stat-total").textContent  = formatMarketCap(totalMCap);
}

/**
 * Shows a toast notification
 * @param {string} message
 * @param {string} type - 'success' | 'info' | 'warning'
 */
export function showToast(message, type = "success") {
  const toast = $toast();
  if (!toast) return;

  toast.textContent = message;
  toast.className   = `toast active ${type}`;

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("active"), 2800);
}

export default {
  renderCards,
  renderFavorites,
  showLoading,
  hideLoading,
  showError,
  updateTheme,
  updateStats,
  showToast,
};