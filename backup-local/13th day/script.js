// ========================================
// DAY 13: MAGIC 8-BALL & CALCULATOR FOUNDATION
// ========================================

console.log("=".repeat(50));
console.log("🚀 DAY 13: MAGIC 8-BALL & CALCULATOR FOUNDATION");
console.log("=".repeat(50));
console.log("");

// ========================================
// 1️⃣ CALCULATOR FOUNDATION
// ========================================

console.log("📊 CALCULATOR FOUNDATION");
console.log("-".repeat(50));

// Declare two numbers using let
let num1 = 42;
let num2 = 7;

// Display the numbers
console.log(`Number 1: ${num1}`);
console.log(`Number 2: ${num2}`);
console.log("");

// Calculate Sum
const sum = num1 + num2;
console.log(`Sum: ${sum}`);

// Calculate Product
const product = num1 * num2;
console.log(`Product: ${product}`);

// Calculate Remainder
const remainder = num1 % num2;
console.log(`Remainder: ${remainder}`);

console.log("");

// ========================================
// 2️⃣ USER WELCOME MESSAGE
// ========================================

console.log("👋 WELCOME MESSAGE");
console.log("-".repeat(50));

// Create a const variable for user name
const userName = "Anoop";

// Concatenate welcome message
const welcomeMessage = `Welcome, ${userName}! 🚀`;
console.log(welcomeMessage);

console.log("");

// ========================================
// 3️⃣ DATA TYPE DEBUGGING
// ========================================

console.log("🔍 DATA TYPE DEBUGGING");
console.log("-".repeat(50));

// Use typeof to check data types
console.log(`Type of num1: ${typeof num1}`);
console.log(`Type of num2: ${typeof num2}`);
console.log(`Type of userName: ${typeof userName}`);
console.log(`Type of sum: ${typeof sum}`);
console.log(`Type of product: ${typeof product}`);

console.log("");

// ========================================
// 4️⃣ MAGIC 8-BALL FEATURE
// ========================================

console.log("🎱 MAGIC 8-BALL");
console.log("-".repeat(50));

// Array of Magic 8-Ball responses
const magic8BallResponses = [
    "Yes, definitely!",
    "It is certain.",
    "Without a doubt.",
    "Ask again later.",
    "Cannot predict now.",
    "Don't count on it.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful.",
    "Signs point to yes."
];

// Generate random index
const randomIndex = Math.floor(Math.random() * magic8BallResponses.length);

// Select random response
const randomResponse = magic8BallResponses[randomIndex];

// Display the Magic 8-Ball response
console.log(`🎱 Magic 8-Ball says: ${randomResponse}`);

console.log("");
console.log("=".repeat(50));
console.log("✅ All operations completed successfully!");
console.log("=".repeat(50));
