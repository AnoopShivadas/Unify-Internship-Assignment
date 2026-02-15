// ===========================
// DOM Elements
// ===========================
const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');
const formatBtn = document.getElementById('formatBtn');
const vowelBtn = document.getElementById('vowelBtn');
const secretBtn = document.getElementById('secretBtn');
const statsBtn = document.getElementById('statsBtn');
const clearBtn = document.getElementById('clearBtn');
const outputSection = document.getElementById('outputSection');
const outputTitle = document.getElementById('outputTitle');
const outputContent = document.getElementById('outputContent');
const statsPanel = document.getElementById('statsPanel');
const themeToggle = document.getElementById('themeToggle');

// ===========================
// Core Arrow Functions
// ===========================

// Title Case Formatter
const formatTitleCase = (text) => {
    return text
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
};

// Vowel Counter
const countVowels = (text) =>
    (text.match(/[aeiou]/gi) || []).length;

// Secret Message Generator
const generateSecretMessage = (text) => {
    const sensitiveWords = ['password', 'secret', 'hack', 'attack', 'confidential', 'private'];
    const pattern = new RegExp(`\\b(${sensitiveWords.join('|')})\\b`, 'gi');

    let replacedCount = 0;

    const sanitized = text.replace(pattern, () => {
        replacedCount++;
        return '***';
    });

    return {
        text: sanitized,
        count: replacedCount
    };
};

// Character Count
const getCharacterCount = (text) => text.length;

// Word Count
const getWordCount = (text) =>
    text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

// Average Word Length (Improved)
const getAverageWordLength = (text) => {
    const words = text
        .trim()
        .split(/\s+/)
        .map(word => word.replace(/[^\w]/g, ''))
        .filter(word => word.length > 0);

    if (words.length === 0) return 0;

    const totalLength = words.reduce((sum, word) => sum + word.length, 0);
    return Math.round(totalLength / words.length);
};

const getTextStatistics = (text) => ({
    totalChars: getCharacterCount(text),
    totalWords: getWordCount(text),
    totalVowels: countVowels(text),
    avgWordLength: getAverageWordLength(text)
});

// ===========================
// UI Functions
// ===========================

const updateOutput = (title, content) => {
    outputTitle.textContent = title;
    outputContent.textContent = content; // Secure (no innerHTML)
    outputSection.classList.add('active');

    setTimeout(() => outputSection.classList.remove('active'), 800);
};

const updateStatistics = (stats) => {
    document.getElementById('totalChars').textContent = stats.totalChars;
    document.getElementById('totalWords').textContent = stats.totalWords;
    document.getElementById('totalVowels').textContent = stats.totalVowels;
    document.getElementById('avgWordLength').textContent = stats.avgWordLength;

    statsPanel.classList.add('active');
};

const hideStatistics = () => statsPanel.classList.remove('active');

const updateCharCounter = () => {
    const count = textInput.value.length;
    charCount.textContent = count;

    if (count >= 900) {
        charCount.parentElement.classList.add('warning');
    } else {
        charCount.parentElement.classList.remove('warning');
    }
};

const clearAll = () => {
    textInput.value = '';
    outputTitle.textContent = 'Result';
    outputContent.textContent = 'Your formatted text will appear here...';
    hideStatistics();
    updateCharCounter();
};

// ===========================
// Event Handlers
// ===========================

const handleFormatText = () => {
    hideStatistics();
    const inputText = textInput.value;

    if (!inputText.trim()) {
        updateOutput('Error', 'Please enter some text to format.');
        return;
    }

    updateOutput('Formatted Text (Title Case)', formatTitleCase(inputText));
};

const handleCountVowels = () => {
    hideStatistics();
    const inputText = textInput.value;

    if (!inputText.trim()) {
        updateOutput('Error', 'Please enter some text to analyze.');
        return;
    }

    const count = countVowels(inputText);
    updateOutput('Vowel Count', `Found ${count} vowel(s) in your text.`);
};

const handleGenerateSecret = () => {
    hideStatistics();
    const inputText = textInput.value;

    if (!inputText.trim()) {
        updateOutput('Error', 'Please enter some text to sanitize.');
        return;
    }

    const result = generateSecretMessage(inputText);

    if (result.count === 0) {
        updateOutput('Secret Message', 'No sensitive words found.');
    } else {
        updateOutput(
            'Secret Message Generated',
            `${result.text} (Replaced ${result.count} word(s))`
        );
    }
};

const handleShowStatistics = () => {
    const inputText = textInput.value;

    if (!inputText.trim()) {
        updateOutput('Error', 'Please enter some text to analyze.');
        hideStatistics();
        return;
    }

    const stats = getTextStatistics(inputText);
    updateStatistics(stats);
    updateOutput('Statistics Generated', 'Statistics panel updated below.');
};

const handleThemeToggle = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
};

// ===========================
// Event Listeners
// ===========================

formatBtn.addEventListener('click', handleFormatText);
vowelBtn.addEventListener('click', handleCountVowels);
secretBtn.addEventListener('click', handleGenerateSecret);
statsBtn.addEventListener('click', handleShowStatistics);
clearBtn.addEventListener('click', clearAll);
themeToggle.addEventListener('click', handleThemeToggle);
textInput.addEventListener('input', updateCharCounter);

textInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleFormatText();
    }
});

// ===========================
// Initialization
// ===========================

const initApp = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateCharCounter();
    console.log('🚀 Smart Text Formatter Ready!');
};

document.addEventListener('DOMContentLoaded', initApp);
