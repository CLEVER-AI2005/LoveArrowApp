
const shootButton = document.getElementById("shootButton");
const arrow = document.getElementById("arrow");
const heart = document.getElementById("heart");
const particles = document.getElementById("particles");
const message = document.getElementById("message");

const startScreen = document.getElementById("startScreen");
const questionScreen = document.getElementById("questionScreen");
const dateScreen = document.getElementById("dateScreen");
const finalScreen = document.getElementById("finalScreen");

const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const buttonArea = document.getElementById("buttonArea");

const dateChoice = document.getElementById("dateChoice");
const timeChoice = document.getElementById("timeChoice");
const okButton = document.getElementById("okButton");

const finalDate = document.getElementById("finalDate");
const finalTime = document.getElementById("finalTime");
const rainHearts = document.getElementById("rainHearts");

let isShooting = false;
let noClicks = 0;

shootButton.addEventListener("click", function () {
    if (isShooting) return;

    isShooting = true;
    shootButton.disabled = true;
    arrow.classList.remove("shooting");
    heart.classList.remove("exploding");
    heart.style.display = "block";
    heart.style.animation = "";
    particles.innerHTML = "";

    void arrow.offsetWidth;

    message.textContent = "Here comes the love...";
    shootButton.textContent = "SHOOTING...";
    arrow.classList.add("shooting");

    setTimeout(function () {
        heart.classList.add("exploding");
        message.textContent = "BOOM!";

        for (let i = 0; i < 40; i++) {
            const smallHeart = document.createElement("span");
            smallHeart.className = "particle";
            smallHeart.textContent = Math.random() > 0.25 ? "♥" : "♡";

            const angle = Math.random() * Math.PI * 2;
            const distance = 70 + Math.random() * 170;

            smallHeart.style.setProperty("--x", Math.cos(angle) * distance + "px");
            smallHeart.style.setProperty("--y", Math.sin(angle) * distance + "px");
            smallHeart.style.setProperty("--size", 16 + Math.random() * 25 + "px");
            smallHeart.style.setProperty("--rotation", Math.random() * 360 + "deg");

            particles.appendChild(smallHeart);
        }

        setTimeout(function () {
            startScreen.classList.add("hidden");
            questionScreen.classList.remove("hidden");
        }, 1100);
    }, 750);
});

function moveNoButton() {
    noClicks++;

    if (noClicks >= 5) {
        noButton.style.display = "none";
        return;
    }

    noButton.classList.add("moving");

    const area = buttonArea.getBoundingClientRect();
    const button = noButton.getBoundingClientRect();

    const maxX = Math.max(0, area.width - button.width);
    const maxY = Math.max(0, area.height - button.height);

    const positions = [
        { x: maxX / 2, y: 0 },
        { x: maxX, y: maxY / 2 },
        { x: 0, y: maxY / 2 },
        { x: maxX / 2, y: maxY }
    ];

    const position = positions[(noClicks - 1) % positions.length];

    noButton.style.left = position.x + "px";
    noButton.style.top = position.y + "px";
}

noButton.addEventListener("click", moveNoButton);

yesButton.addEventListener("click", function () {
    questionScreen.classList.add("hidden");
    dateScreen.classList.remove("hidden");
});

function getDateFromToday(daysToAdd) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date;
}

okButton.addEventListener("click", function () {
    const daysToAdd = dateChoice.value === "tomorrow" ? 1 : 3;
    const chosenDate = getDateFromToday(daysToAdd);

    const formattedDate = chosenDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    finalDate.textContent = "Our date: " + formattedDate;
    finalTime.textContent = "Time: " + timeChoice.value;

    dateScreen.classList.add("hidden");
    finalScreen.classList.remove("hidden");

    createRainHearts();
});

function createRainHearts() {
    rainHearts.innerHTML = "";

    for (let i = 0; i < 55; i++) {
        const fallingHeart = document.createElement("span");

        fallingHeart.className = "rain-heart";
        fallingHeart.textContent = Math.random() > 0.3 ? "♥" : "♡";
        fallingHeart.style.left = Math.random() * 100 + "vw";
        fallingHeart.style.animationDuration = 3 + Math.random() * 4 + "s";
        fallingHeart.style.animationDelay = Math.random() * 3 + "s";
        fallingHeart.style.fontSize = 12 + Math.random() * 25 + "px";

        rainHearts.appendChild(fallingHeart);
    }
}
