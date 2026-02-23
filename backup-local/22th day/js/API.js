/**
 * API.js — Data Layer
 * Project Nexus Analytics Hub
 * Handles all data fetching and transformation
 */

const API_BASE = "https://api.nexus-analytics.io/v1"; // Simulated endpoint

const MOCK_DATA = [
  { id: 1,  symbol: "BTC",  name: "Bitcoin",        price: 67420.50, change: 3.42,  volume: 28500000000, marketCap: 1320000000000, sector: "Layer 1",  logo: "₿",  color: "#f7931a" },
  { id: 2,  symbol: "ETH",  name: "Ethereum",       price: 3891.20,  change: 1.87,  volume: 14200000000, marketCap: 467000000000,  sector: "Layer 1",  logo: "Ξ",  color: "#627eea" },
  { id: 3,  symbol: "SOL",  name: "Solana",         price: 189.44,   change: 5.61,  volume: 4100000000,  marketCap: 82000000000,   sector: "Layer 1",  logo: "◎",  color: "#9945ff" },
  { id: 4,  symbol: "BNB",  name: "BNB Chain",      price: 412.80,   change: -0.93, volume: 1800000000,  marketCap: 63000000000,   sector: "Exchange", logo: "B",  color: "#f3ba2f" },
  { id: 5,  symbol: "XRP",  name: "XRP",            price: 0.6241,   change: 2.15,  volume: 1600000000,  marketCap: 34000000000,   sector: "Payment",  logo: "✕",  color: "#00aae4" },
  { id: 6,  symbol: "ADA",  name: "Cardano",        price: 0.5873,   change: -1.44, volume: 980000000,   marketCap: 20700000000,   sector: "Layer 1",  logo: "₳",  color: "#0033ad" },
  { id: 7,  symbol: "AVAX", name: "Avalanche",      price: 42.67,    change: 7.22,  volume: 820000000,   marketCap: 17500000000,   sector: "Layer 1",  logo: "A",  color: "#e84142" },
  { id: 8,  symbol: "DOGE", name: "Dogecoin",       price: 0.1841,   change: 4.11,  volume: 1200000000,  marketCap: 26000000000,   sector: "Meme",     logo: "Ð",  color: "#c2a633" },
  { id: 9,  symbol: "DOT",  name: "Polkadot",       price: 9.84,     change: -2.08, volume: 420000000,   marketCap: 12800000000,   sector: "Layer 0",  logo: "●",  color: "#e6007a" },
  { id: 10, symbol: "MATIC",name: "Polygon",        price: 1.024,    change: 3.88,  volume: 610000000,   marketCap: 9400000000,    sector: "Layer 2",  logo: "⬡",  color: "#8247e5" },
  { id: 11, symbol: "LINK", name: "Chainlink",      price: 17.42,    change: 6.33,  volume: 740000000,   marketCap: 10200000000,   sector: "Oracle",   logo: "⬡",  color: "#375bd2" },
  { id: 12, symbol: "UNI",  name: "Uniswap",        price: 11.29,    change: -3.17, volume: 290000000,   marketCap: 6700000000,    sector: "DeFi",     logo: "🦄", color: "#ff007a" },
  { id: 13, symbol: "ATOM", name: "Cosmos",         price: 10.67,    change: 1.54,  volume: 310000000,   marketCap: 3800000000,    sector: "Layer 0",  logo: "⚛",  color: "#2e3148" },
  { id: 14, symbol: "LTC",  name: "Litecoin",       price: 87.33,    change: 0.72,  volume: 560000000,   marketCap: 6400000000,    sector: "Payment",  logo: "Ł",  color: "#bfbbbb" },
  { id: 15, symbol: "NEAR", name: "NEAR Protocol",  price: 7.91,     change: 9.14,  volume: 480000000,   marketCap: 7900000000,    sector: "Layer 1",  logo: "Ⓝ",  color: "#00c08b" },
  { id: 16, symbol: "ARB",  name: "Arbitrum",       price: 1.842,    change: 4.67,  volume: 370000000,   marketCap: 5200000000,    sector: "Layer 2",  logo: "A",  color: "#28a0f0" },
  { id: 17, symbol: "OP",   name: "Optimism",       price: 3.174,    change: -0.41, volume: 290000000,   marketCap: 3400000000,    sector: "Layer 2",  logo: "⬆",  color: "#ff0420" },
  { id: 18, symbol: "FTM",  name: "Fantom",         price: 0.8421,   change: 11.82, volume: 680000000,   marketCap: 2800000000,    sector: "Layer 1",  logo: "F",  color: "#13b5ec" },
  { id: 19, symbol: "MKR",  name: "Maker",          price: 2841.0,   change: 2.33,  volume: 145000000,   marketCap: 2620000000,    sector: "DeFi",     logo: "M",  color: "#4fa89b" },
  { id: 20, symbol: "INJ",  name: "Injective",      price: 38.72,    change: 14.91, volume: 820000000,   marketCap: 3300000000,    sector: "DeFi",     logo: "I",  color: "#00b4d8" },
];

/**
 * Simulates network latency for realistic UX
 */
const simulateDelay = (ms = 1400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Adds live-feeling micro-variance to prices
 */
const addLiveVariance = (items) =>
  items.map((item) => ({
    ...item,
    price: +(item.price * (1 + (Math.random() - 0.5) * 0.002)).toFixed(
      item.price > 10 ? 2 : 4
    ),
    change: +(item.change + (Math.random() - 0.5) * 0.3).toFixed(2),
    lastUpdated: new Date().toISOString(),
  }));

/**
 * Primary data fetch function
 * In production: replaces mock with real HTTP call
 */
async function fetchData() {
  try {
    await simulateDelay();
    // --- Production swap-in: ---
    // const response = await fetch(`${API_BASE}/assets?limit=20&vs_currency=usd`);
    // if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    // const json = await response.json();
    // return json.data;

    const liveData = addLiveVariance(MOCK_DATA);
    return { success: true, data: liveData, timestamp: Date.now() };
  } catch (error) {
    console.error("[API] fetchData failed:", error.message);
    throw new Error(`Data fetch failed: ${error.message}`);
  }
}

/**
 * Fetches a single asset by symbol
 */
export async function fetchAsset(symbol) {
  try {
    await simulateDelay(400);
    const asset = MOCK_DATA.find(
      (d) => d.symbol.toLowerCase() === symbol.toLowerCase()
    );
    if (!asset) throw new Error(`Asset not found: ${symbol}`);
    return { success: true, data: addLiveVariance([asset])[0] };
  } catch (error) {
    throw new Error(`Asset fetch failed: ${error.message}`);
  }
}

/**
 * Fetches summary market stats
 */
export async function fetchMarketStats() {
  try {
    await simulateDelay(300);
    const totalMarketCap = MOCK_DATA.reduce((sum, d) => sum + d.marketCap, 0);
    const totalVolume    = MOCK_DATA.reduce((sum, d) => sum + d.volume, 0);
    return {
      success: true,
      data: {
        totalMarketCap,
        totalVolume,
        btcDominance: 47.3,
        fearGreedIndex: 72,
        activeAssets: MOCK_DATA.length,
      },
    };
  } catch (error) {
    throw new Error(`Market stats fetch failed: ${error.message}`);
  }
}

export default fetchData;