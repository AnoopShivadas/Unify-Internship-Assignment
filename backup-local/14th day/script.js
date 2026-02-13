let randomNumber = 0;
let attemptsLeft = 7;
let previousGuesses = [];
let gameActive = true;

const guessInput = document.getElementById('guessInput');
const submitBtn = document.getElementById('submitBtn');
const restartBtn = document.getElementById('restartBtn');
const attemptsCount = document.getElementById('attemptsCount');
const progressFill = document.getElementById('progressFill');
const hintMessage = document.getElementById('hintMessage');
const guessesList = document.getElementById('guessesList');
const confettiContainer = document.getElementById('confettiContainer');

function initGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attemptsLeft = 7;
    previousGuesses = [];
    gameActive = true;

    guessInput.value = '';
    guessInput.disabled = false;
    submitBtn.disabled = false;

    updateAttemptsDisplay();
    updateProgressBar();
    resetHintMessage();
    clearGuessesList();
}

function updateAttemptsDisplay() {
    attemptsCount.textContent = attemptsLeft;
}

function updateProgressBar() {
    const progressPercentage = (attemptsLeft / 7) * 100;
    progressFill.style.width = `${progressPercentage}%`;

    if (attemptsLeft <= 2) {
        progressFill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
    } else if (attemptsLeft <= 4) {
        progressFill.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #3b82f6, #8b5cf6)';
    }
}

function resetHintMessage() {
    hintMessage.className = 'hint-message';
    hintMessage.innerHTML = `
        <span class="hint-icon">🎯</span>
        <span class="hint-text">Make your first guess!</span>
    `;
}

function updateHintMessage(type, text, icon) {
    hintMessage.className = `hint-message ${type}`;
    hintMessage.innerHTML = `
        <span class="hint-icon">${icon}</span>
        <span class="hint-text">${text}</span>
    `;
}

function clearGuessesList() {
    guessesList.innerHTML = '<span class="empty-state">No guesses yet</span>';
}

function addGuessToList(guess) {
    if (previousGuesses.length === 1) {
        guessesList.innerHTML = '';
    }

    const badge = document.createElement('span');
    badge.className = 'guess-badge';
    badge.textContent = guess;
    guessesList.appendChild(badge);
}

function validateInput(value) {
    if (value === '' || value === null) {
        showError('Please enter a number!');
        return false;
    }

    const numValue = parseInt(value);

    if (isNaN(numValue)) {
        showError('Please enter a valid number!');
        return false;
    }

    if (numValue < 1 || numValue > 100) {
        showError('Number must be between 1 and 100!');
        return false;
    }

    if (previousGuesses.includes(numValue)) {
        showError('You already guessed this number!');
        return false;
    }

    return true;
}

function showError(message) {
    updateHintMessage('', message, '⚠️');
    guessInput.classList.add('shake');
    setTimeout(() => {
        guessInput.classList.remove('shake');
    }, 400);
}

function handleGuess() {
    if (!gameActive) return;

    const userGuess = guessInput.value.trim();

    if (!validateInput(userGuess)) {
        return;
    }

    const numGuess = parseInt(userGuess);
    previousGuesses.push(numGuess);
    addGuessToList(numGuess);

    attemptsLeft--;
    updateAttemptsDisplay();
    updateProgressBar();

    if (numGuess === randomNumber) {
        handleWin();
    } else if (attemptsLeft === 0) {
        handleGameOver();
    } else {
        if (numGuess > randomNumber) {
            updateHintMessage('too-high', 'Too high! Try a lower number.', '🔥');
        } else {
            updateHintMessage('too-low', 'Too low! Try a higher number.', '❄️');
        }
    }

    guessInput.value = '';
    guessInput.focus();
}

function handleWin() {
    gameActive = false;
    guessInput.disabled = true;
    submitBtn.disabled = true;

    const attempts = 7 - attemptsLeft;
    updateHintMessage(
        'correct',
        `Congratulations! You guessed it in ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}!`,
        '🎉'
    );

    createConfetti();
}

function handleGameOver() {
    gameActive = false;
    guessInput.disabled = true;
    submitBtn.disabled = true;

    updateHintMessage(
        'game-over',
        `Game Over! The correct number was ${randomNumber}.`,
        '😔'
    );
}

function createConfetti() {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

            confettiContainer.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 30);
    }
}

function handleRestart() {
    confettiContainer.innerHTML = '';
    initGame();
}

submitBtn.addEventListener('click', handleGuess);

guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleGuess();
    }
});

restartBtn.addEventListener('click', handleRestart);

initGame();
