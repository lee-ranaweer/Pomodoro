const display = document.getElementById("display");
const icon = document.getElementById("play").firstElementChild;
const count = document.getElementById("round");

let timer = null;
let startTime = 0;
let elapsedTime = 0;
let running = false;
let ringging = true;
let countval = 0;

let iteration = {
    work: true,
    short: false,
    long: false,
};

const ring = new Audio("ring.mp3");

let workTime = 1500000; // 25 minutes
let shortTime = 300000; // 5 minutes
let longTime = 900000; // 15 minutes

// Initialization -------------------------------------------------------------------------------------!

let currentTime = workTime;

let hours = String(Math.floor(currentTime / (1000 * 60 * 60))).padStart(2, "0");
let minutes = String(Math.floor((currentTime / (1000 * 60)) % 60)).padStart(2, "0");
let seconds = String(Math.floor((currentTime / 1000) % 60)).padStart(2, "0");

display.textContent = `${hours}:${minutes}:${seconds}`;

// Setters --------------------------------------------------------------------------------------------!

const setTheme = (theme) => (document.documentElement.className = theme);

function setIteration(state) {
    for (let key in iteration) {
        iteration[key] = key === state;
    }
}

// Controls -------------------------------------------------------------------------------------------!

function play() {
    if (!running) {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(update, 10);
        running = true;

        icon.textContent = "pause";
    } else {
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
        running = false;

        icon.textContent = "play_arrow";
    }
}

function reset() {
    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    running = false;

    ringging = true;

    let hours = String(Math.floor(currentTime / (1000 * 60 * 60))).padStart(2, "0");
    let minutes = String(Math.floor((currentTime / (1000 * 60)) % 60)).padStart(2, "0");
    let seconds = String(Math.floor((currentTime / 1000) % 60)).padStart(2, "0");

    icon.textContent = "play_arrow";

    display.textContent = `${hours}:${minutes}:${seconds}`;
}

function skip() {
    clearInterval(timer);

    if (iteration["work"]) {
        countval++;
        count.textContent = `#${countval}`;
        if (countval % 5 == 0) {
            long();
        } else {
            short();
        }
    } else if (iteration["short"]) {
        work();
    } else if (iteration["long"]) {
        work();
    }
}

// Iterations -----------------------------------------------------------------------------------------!

function setIteration(state) {
    for (let key in iteration) {
        iteration[key] = key === state;
    }
}

function work() {
    ring.pause();
    ring.currentTime = 0;
    setIteration("work");
    currentTime = workTime;
    setTheme("red");

    reset();
}

function short() {
    ring.pause();
    ring.currentTime = 0;
    setIteration("short");
    currentTime = shortTime;
    setTheme("blue");

    reset();
}

function long() {
    ring.pause();
    ring.currentTime = 0;
    setIteration("long");
    currentTime = longTime;
    setTheme("green");

    reset();
}

// Update ---------------------------------------------------------------------------------------------!

function update() {
    const current = Date.now();
    elapsedTime = current - startTime;

    let displayTime = currentTime - elapsedTime;

    let hours = String(Math.floor(displayTime / (1000 * 60 * 60))).padStart(2, "0");
    let minutes = String(Math.floor((displayTime / (1000 * 60)) % 60)).padStart(2, "0");
    let seconds = String(Math.floor((displayTime / 1000) % 60)).padStart(2, "0");

    if (ringging && displayTime <= 4000) {
        ring.play();
        ringging = false;
    }

    if (displayTime <= 0) {
        ring.play();
        skip();
        return;
    }

    display.textContent = `${hours}:${minutes}:${seconds}`;
}

document.addEventListener("keydown", event => {
    event.preventDefault();

    if(event.key == " ") {
        play();
    } 
});