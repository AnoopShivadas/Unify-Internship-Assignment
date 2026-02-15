// ===============================
// AURORA-X :: QUANTUM GRID OS
// Enhanced Production Version
// ===============================

// ===== SYSTEM STATE =====
let systemMode = "boot";
let authAttempts = 3;
const masterCode = "12345";

// ===== FINANCE CORE =====
let wallet = 1200;
let ledger = [];

// ===== COMMERCE HUB =====
const unitPrice = 75;

// ===== VAULT NODE =====
const secretWord = "cipher";
const vaultHint = "A secret encoded message.";
let vaultUsed = false;

// ===== COMMAND HISTORY =====
let commandHistory = [];
let historyIndex = -1;

// ===== DOM =====
const output = document.getElementById("output");
const input = document.getElementById("input");
const terminal = document.getElementById("terminal");
const loader = document.getElementById("loader");
const clock = document.getElementById("clock");

// ===============================
// INITIALIZE
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000);
  input.addEventListener("keydown", handleInput);
  startBootSequence();
});

// ===============================
// CLOCK
// ===============================
function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString();
}

// ===============================
// BOOT
// ===============================
async function startBootSequence() {
  loader.classList.add("active");

  const bootMessages = [
    "Quantum Kernel Initializing...",
    "Encrypting Memory Blocks...",
    "Deploying Finance Core...",
    "Activating Secure Vault...",
    "System Online."
  ];

  for (let msg of bootMessages) {
    await delay(800);
    addLine(msg, "boot");
  }

  await delay(1000);
  loader.classList.remove("active");

  systemMode = "authentication";
  startAuthentication();
}

function startAuthentication() {
  addLine("");
  addLine(">> AUTHORIZATION REQUIRED", "info");
  addLine("Enter Master Access Code:", "info");
  enableInput();
}

// ===============================
// INPUT CONTROL
// ===============================
function enableInput() {
  input.disabled = false;
  input.focus();
}

function disableInput() {
  input.disabled = true;
}

// ===============================
// INPUT HANDLER
// ===============================
function handleInput(e) {
  if (input.disabled) return;

  if (e.key === "Enter") {
    const command = input.value.trim();
    if (!command) return;

    addLine(`>> ${command}`);
    commandHistory.push(command);
    historyIndex = commandHistory.length;

    input.value = "";
    processInput(command);
  }

  // Arrow Up
  if (e.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = commandHistory[historyIndex];
    }
  }

  // Arrow Down
  if (e.key === "ArrowDown") {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      input.value = commandHistory[historyIndex];
    } else {
      input.value = "";
    }
  }

  // Escape clears
  if (e.key === "Escape") {
    input.value = "";
  }
}

// ===============================
// ROUTER
// ===============================
function processInput(command) {
  switch (systemMode) {
    case "authentication":
      handleAuthentication(command);
      break;
    case "mainframe":
      handleMainframe(command);
      break;
    case "financeCore":
      handleFinanceCore(command);
      break;
    case "commerceHub":
      handleCommerceHub(command);
      break;
    case "vaultNode":
      handleVaultNode(command);
      break;
  }
}

// ===============================
// AUTHENTICATION
// ===============================
async function handleAuthentication(code) {
  if (code === masterCode) {
    disableInput();
    addLine("");
    addLine("╔══════════════════════╗", "banner");
    addLine("   ACCESS VERIFIED", "banner");
    addLine("   WELCOME TO AURORA-X", "banner");
    addLine("╚══════════════════════╝", "banner");
    addLine("");
    await delay(1500);
    systemMode = "mainframe";
    showMainframe();
    enableInput();
  } else {
    authAttempts--;
    terminal.classList.add("shake");
    addLine(`ACCESS DENIED. ${authAttempts} attempt(s) remaining.`, "error");
    setTimeout(() => terminal.classList.remove("shake"), 500);

    if (authAttempts <= 0) {
      disableInput();
      addLine("SYSTEM LOCKED.", "error");
    }
  }
}

// ===============================
// MAINFRAME
// ===============================
function showMainframe() {
  addLine("Available Nodes:", "info");
  addLine("finance | commerce | vault | records | help | terminate", "success");
  addLine("");
}

function handleMainframe(cmd) {
  cmd = cmd.toLowerCase();

  if (cmd === "finance") {
    systemMode = "financeCore";
    showFinanceCore();
  } else if (cmd === "commerce") {
    systemMode = "commerceHub";
    showCommerceHub();
  } else if (cmd === "vault") {
    systemMode = "vaultNode";
    showVaultNode();
  } else if (cmd === "records") {
    showRecords();
  } else if (cmd === "help") {
    showHelp();
  } else if (cmd === "terminate") {
    initiateShutdown();
  } else {
    addLine("Unknown node.", "warning");
  }
}

// ===============================
// FINANCE CORE
// ===============================
function showFinanceCore() {
  addLine("");
  addLine("FINANCE CORE ACTIVE", "info");
  addLine("credit <amount> | debit <amount> | status | exit", "info");
}

function handleFinanceCore(command) {
  const parts = command.split(" ");
  const action = parts[0];
  const amount = parseFloat(parts[1]);

  if (action === "exit") {
    systemMode = "mainframe";
    showMainframe();
    return;
  }

  if (action === "status") {
    addLine(`Wallet Balance: ₹${wallet.toFixed(2)}`, "success");
    return;
  }

  if (action === "credit") {
    if (isNaN(amount) || amount <= 0) {
      addLine("Invalid amount.", "error");
      return;
    }
    wallet += amount;
    ledger.push({ time: getCurrentTime(), type: "CREDIT", amount });
    addLine(`Credited ₹${amount.toFixed(2)}`, "success");
    return;
  }

  if (action === "debit") {
    if (isNaN(amount) || amount <= 0) {
      addLine("Invalid amount.", "error");
      return;
    }
    if (amount > wallet) {
      addLine("Insufficient funds.", "error");
      return;
    }
    wallet -= amount;
    ledger.push({ time: getCurrentTime(), type: "DEBIT", amount });
    addLine(`Debited ₹${amount.toFixed(2)}`, "success");
    return;
  }

  addLine("Unknown finance command.", "warning");
}

// ===============================
// COMMERCE HUB
// ===============================
function showCommerceHub() {
  addLine("");
  addLine("COMMERCE HUB ACTIVE", "info");
  addLine("purchase <quantity> | exit", "info");
}

function handleCommerceHub(command) {
  const parts = command.split(" ");
  const action = parts[0];
  const quantity = parseInt(parts[1]);

  if (action === "exit") {
    systemMode = "mainframe";
    showMainframe();
    return;
  }

  if (action !== "purchase") {
    addLine("Unknown commerce command.", "warning");
    return;
  }

  if (isNaN(quantity) || quantity <= 0) {
    addLine("Invalid quantity.", "error");
    return;
  }

  let discount = 0;
  if (quantity >= 4 && quantity <= 8) discount = 0.12;
  if (quantity >= 9) discount = 0.25;

  let subtotal = quantity * unitPrice;
  let total = subtotal - subtotal * discount;
  total = parseFloat(total.toFixed(2));

  if (total > wallet) {
    addLine("Insufficient funds.", "error");
    return;
  }

  wallet -= total;
  ledger.push({ time: getCurrentTime(), type: "PURCHASE", amount: total });

  addLine(`Purchased ${quantity} units`, "success");
  addLine(`Total Paid: ₹${total.toFixed(2)}`, "success");
  addLine(`Remaining Balance: ₹${wallet.toFixed(2)}`, "success");
}

// ===============================
// VAULT NODE
// ===============================
async function showVaultNode() {
  if (vaultUsed) {
    addLine("Vault already accessed.", "warning");
    systemMode = "mainframe";
    return;
  }
  addLine("");
  addLine("VAULT NODE ACTIVE", "info");
  addLine(`Hint: ${vaultHint}`, "info");
  addLine("Enter decryption key:", "info");
}

async function handleVaultNode(command) {
  if (vaultUsed) return;

  if (command.toLowerCase() === secretWord) {
    vaultUsed = true;
    disableInput();

    addLine("Decrypting...", "info");
    await delay(1500);

    addLine("ACCESS GRANTED", "success");
    addLine('"The future belongs to those who decode it."', "vault-message");

    await delay(2000);
    systemMode = "mainframe";
    enableInput();
  } else {
    addLine("Incorrect key. Vault locked.", "error");
    vaultUsed = true;
    systemMode = "mainframe";
  }
}

// ===============================
// RECORDS
// ===============================
function showRecords() {
  addLine("");
  if (ledger.length === 0) {
    addLine("No transactions recorded.", "warning");
    return;
  }
  ledger.forEach(entry => {
    addLine(`[${entry.time}] ${entry.type} ₹${entry.amount.toFixed(2)}`, "info");
  });
}

// ===============================
// HELP
// ===============================
function showHelp() {
  addLine("finance | commerce | vault | records | help | terminate", "info");
}

// ===============================
// SHUTDOWN
// ===============================
async function initiateShutdown() {
  disableInput();
  systemMode = "shutdown";

  const steps = [
    "Syncing ledger...",
    "Disconnecting nodes...",
    "Sealing Quantum Grid...",
    "SYSTEM OFFLINE"
  ];

  for (let step of steps) {
    await delay(800);
    addLine(step, "warning");
  }

  terminal.classList.add("fade-out");
}

// ===============================
// UTIL
// ===============================
function addLine(text, className = "") {
  const line = document.createElement("div");
  line.className = `line ${className}`;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function getCurrentTime() {
  return new Date().toLocaleTimeString();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
