/**
 * App.js — State Management & Orchestration
 * Project Nexus Analytics Hub
 * Central controller: owns state, wires events, coordinates API ↔ UI
 */

import fetchData           from "./API.js";
import { fetchMarketStats } from "./API.js";
import {
  renderCards,
  renderFavorites,
  showLoading,
  hideLoading,
  showError,
  updateTheme,
  updateStats,
  showToast,
} from "./UI.js";

/* ─────────────────────────────────────────────
   CENTRAL STATE
───────────────────────────────────────────── */

const state = {
  data:        [],   // all fetched assets
  favorites:   [],   // array of favorite IDs  (number[])
  searchQuery: "",   // current search string
  sortBy:      "marketCap", // 'name' | 'price' | 'change' | 'marketCap'
  sortDir:     "desc",      // 'asc' | 'desc'
  theme:       "light",     // 'light' | 'dark'
  activeView:  "dashboard", // 'dashboard' | 'favorites'
  isLoading:   false,
};

/* ─────────────────────────────────────────────
   PERSISTENCE — localStorage
───────────────────────────────────────────── */

const STORAGE_KEYS = {
  FAVORITES: "nexus_favorites",
  THEME:     "nexus_theme",
  SORT:      "nexus_sort",
};

export function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites));
    localStorage.setItem(STORAGE_KEYS.THEME,     state.theme);
    localStorage.setItem(STORAGE_KEYS.SORT,      state.sortBy);
  } catch (err) {
    console.warn("[App] localStorage write failed:", err.message);
  }
}

export function loadFromLocalStorage() {
  try {
    const favs  = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    const sort  = localStorage.getItem(STORAGE_KEYS.SORT);

    if (favs)  state.favorites = JSON.parse(favs);
    if (theme) state.theme     = theme;
    if (sort)  state.sortBy    = sort;
  } catch (err) {
    console.warn("[App] localStorage read failed:", err.message);
  }
}

/* ─────────────────────────────────────────────
   DERIVED DATA — functional transforms
───────────────────────────────────────────── */

/**
 * Returns filtered + sorted slice of state.data
 * Uses .filter(), .sort(), .map()
 */
function getProcessedData() {
  const query = state.searchQuery.toLowerCase().trim();

  // .filter() — search by name or symbol
  const filtered = state.data.filter((item) =>
    item.name.toLowerCase().includes(query) ||
    item.symbol.toLowerCase().includes(query) ||
    item.sector.toLowerCase().includes(query)
  );

  // .sort() — multi-key sorting
  const sorted = [...filtered].sort((a, b) => {
    let aVal, bVal;
    switch (state.sortBy) {
      case "name":      aVal = a.name;      bVal = b.name;      break;
      case "price":     aVal = a.price;     bVal = b.price;     break;
      case "change":    aVal = a.change;    bVal = b.change;    break;
      case "volume":    aVal = a.volume;    bVal = b.volume;    break;
      case "marketCap":
      default:          aVal = a.marketCap; bVal = b.marketCap; break;
    }

    if (typeof aVal === "string") {
      return state.sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return state.sortDir === "asc" ? aVal - bVal : bVal - aVal;
  });

  return sorted;
}

/**
 * Returns full asset objects for favorited IDs
 * Uses .filter() and .map()
 */
function getFavoriteAssets() {
  const favSet = new Set(state.favorites);
  return state.data.filter((item) => favSet.has(item.id));
}

/**
 * Computes total portfolio value of favorites
 * Uses .reduce()
 */
export function calculateFavoritesValue() {
  const favAssets = getFavoriteAssets();
  return favAssets.reduce((total, asset) => total + asset.price, 0);
}

/* ─────────────────────────────────────────────
   STATE MUTATORS & RENDERERS
───────────────────────────────────────────── */

function render() {
  const processed = getProcessedData();
  const favAssets = getFavoriteAssets();

  renderCards(processed, state.favorites);
  renderFavorites(favAssets);
  updateStats(processed, state.favorites, state.data);
  syncSortUI();
  updateFavoritesUI(favAssets);

  // Update assets count badge
  const countEl = document.getElementById("assets-count");
  if (countEl) countEl.textContent = processed.length;
}

function updateFavoritesUI(favAssets) {
  // .reduce() — total portfolio value of favorited assets
  const totalValue = favAssets.reduce((sum, a) => sum + a.price, 0);

  const el = document.getElementById("fav-total-value");
  if (el) {
    el.textContent = totalValue >= 1000
      ? `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `$${totalValue.toFixed(2)}`;
  }

  // Sync count badge in sidebar and favorites view header
  const countDisplay = document.getElementById("fav-count-display");
  if (countDisplay) countDisplay.textContent = favAssets.length;

  // Update nav badge
  const navBadge = document.getElementById("fav-count");
  if (navBadge) navBadge.textContent = favAssets.length;
}

function syncSortUI() {
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect && sortSelect.value !== state.sortBy) {
    sortSelect.value = state.sortBy;
  }
  // Update active sort button highlight
  document.querySelectorAll("[data-sort]").forEach((btn) => {
    btn.classList.toggle("sort-active", btn.dataset.sort === state.sortBy);
  });
}

/* ─────────────────────────────────────────────
   EVENT HANDLERS — exported for inline use
───────────────────────────────────────────── */

export function handleSearch(query) {
  state.searchQuery = query;
  render();
}

export function handleSort(sortKey, dir) {
  state.sortBy  = sortKey;
  if (dir) state.sortDir = dir;
  saveToLocalStorage();
  render();
}

export function handleFavoriteToggle(assetId) {
  const id  = Number(assetId);
  const idx = state.favorites.indexOf(id);

  if (idx === -1) {
    state.favorites.push(id);
    const asset = state.data.find((d) => d.id === id);
    showToast(`${asset?.name ?? "Asset"} added to favorites ♥`, "success");
  } else {
    state.favorites.splice(idx, 1);
    const asset = state.data.find((d) => d.id === id);
    showToast(`${asset?.name ?? "Asset"} removed from favorites`, "info");
  }

  saveToLocalStorage();
  render();
}

export function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  updateTheme(state.theme);
  saveToLocalStorage();
}

export function setActiveView(view) {
  state.activeView = view;

  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.view === view);
  });

  document.querySelectorAll(".view-section").forEach((el) => {
    el.classList.toggle("active", el.dataset.section === view);
  });
}

/* ─────────────────────────────────────────────
   EVENT WIRING
───────────────────────────────────────────── */

function wireEvents() {
  // Search
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => handleSearch(e.target.value));
  }

  // Sort dropdown
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => handleSort(e.target.value));
  }

  // Sort direction toggle
  const sortDirBtn = document.getElementById("sort-dir-btn");
  if (sortDirBtn) {
    sortDirBtn.addEventListener("click", () => {
      state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      sortDirBtn.textContent = state.sortDir === "asc" ? "↑" : "↓";
      render();
    });
  }

  // Theme toggle
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  // Sidebar navigation
  document.querySelectorAll(".nav-item[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => setActiveView(btn.dataset.view));
  });

  // Favorite buttons — delegated from document
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".fav-btn");
    if (btn) {
      e.stopPropagation();
      handleFavoriteToggle(btn.dataset.id);
    }
  });

  // Refresh button
  const refreshBtn = document.getElementById("refresh-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", async () => {
      refreshBtn.classList.add("spinning");
      await loadData();
      refreshBtn.classList.remove("spinning");
    });
  }

  // Sidebar collapse
  const collapseBtn = document.getElementById("sidebar-toggle");
  const sidebar     = document.querySelector(".sidebar");
  if (collapseBtn && sidebar) {
    collapseBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }
}

/* ─────────────────────────────────────────────
   DATA LOADING
───────────────────────────────────────────── */

async function loadData() {
  state.isLoading = true;
  showLoading(10);

  try {
    const result      = await fetchData();
    const statsResult = await fetchMarketStats();

    state.data      = result.data;
    state.isLoading = false;

    hideLoading();
    render();

    // Update market stats bar
    if (statsResult?.data) {
      const { btcDominance, fearGreedIndex } = statsResult.data;
      const el = (id) => document.getElementById(id);
      if (el("btc-dom"))   el("btc-dom").textContent   = `${btcDominance}%`;
      if (el("fear-greed")) el("fear-greed").textContent = fearGreedIndex;
      if (el("fg-label")) {
        const fg = fearGreedIndex;
        el("fg-label").textContent = fg >= 75 ? "Extreme Greed" : fg >= 55 ? "Greed" : fg >= 45 ? "Neutral" : "Fear";
      }
    }
  } catch (err) {
    state.isLoading = false;
    hideLoading();
    showError(`Failed to load market data: ${err.message}`);
    console.error("[App] loadData error:", err);
  }
}

/* ─────────────────────────────────────────────
   LIVE TICKER — fake live updates
───────────────────────────────────────────── */

function startLiveTicker() {
  setInterval(() => {
    if (state.data.length === 0 || state.isLoading) return;

    // Randomly update a few assets to simulate live feed
    const indices = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * state.data.length)
    );
    indices.forEach((i) => {
      const asset = state.data[i];
      if (!asset) return;
      asset.price  = +(asset.price  * (1 + (Math.random() - 0.5) * 0.001)).toFixed(asset.price > 10 ? 2 : 4);
      asset.change = +(asset.change +  (Math.random() - 0.5) * 0.1).toFixed(2);
    });

    render();

    // Pulse the live indicator
    const dot = document.getElementById("live-dot");
    if (dot) dot.classList.add("pulse");
    setTimeout(() => dot?.classList.remove("pulse"), 800);
  }, 5000);
}

/* ─────────────────────────────────────────────
   APP INIT
───────────────────────────────────────────── */

export async function initializeApp() {
  console.log("[Nexus] Initializing Project Nexus v1.0.0 …");

  // 1. Restore persisted state
  loadFromLocalStorage();

  // 2. Apply theme immediately (before paint)
  updateTheme(state.theme);

  // 3. Wire all event listeners
  wireEvents();

  // 4. Set default view
  setActiveView("dashboard");

  // 5. Fetch and render data
  await loadData();

  // 6. Start live price ticker
  startLiveTicker();

  // 7. Animate clock
  updateClock();
  setInterval(updateClock, 1000);

  console.log("[Nexus] Ready ✓");
}

function updateClock() {
  const el = document.getElementById("live-clock");
  if (el) {
    el.textContent = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  }
}

// Boot
initializeApp();