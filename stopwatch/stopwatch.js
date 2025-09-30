// --- DOM Element References ---
const mainTimeDisplay = document.getElementById('main-time');
const millisecondsDisplay = document.getElementById('milliseconds');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');
const themeToggleButton = document.getElementById('theme-toggle');

// --- Stopwatch State Variables ---
let startTime;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;

// --- Core Functions ---

/**
 * Formats the time from milliseconds into HH:MM:SS and .ms parts.
 * @param {number} time - The elapsed time in milliseconds.
 */
function formatTime(time) {
    const date = new Date(time);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

    mainTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    millisecondsDisplay.textContent = `.${milliseconds}`;
}

/**
 * Updates button states based on whether the timer is running.
 */
function updateButtonState() {
    startButton.disabled = isRunning;
    stopButton.disabled = !isRunning;
}

/**
 * Starts the stopwatch.
 */
function startTimer() {
    if (isRunning) return;

    isRunning = true;
    startTime = Date.now() - elapsedTime;

    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        formatTime(elapsedTime);
    }, 10);

    updateButtonState();
}

/**
 * Stops the stopwatch.
 */
function stopTimer() {
    if (!isRunning) return;

    isRunning = false;
    clearInterval(timerInterval);
    updateButtonState();
}

/**
 * Resets the stopwatch to zero.
 */
function resetTimer() {
    stopTimer(); // Also clears interval if running
    elapsedTime = 0;
    formatTime(0);
}


// --- Theme Toggle ---

/**
 * Toggles the theme between light and dark and saves the preference.
 */
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// --- Event Listeners ---
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
themeToggleButton.addEventListener('click', toggleTheme);


// --- Initial State on Page Load ---
updateButtonState(); // Set initial button disabled state