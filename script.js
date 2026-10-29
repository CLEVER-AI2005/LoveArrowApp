
// ==========================================
// LOVE ARROW APP
// ==========================================

// SCREEN ELEMENTS
const startScreen = document.getElementById("startScreen");
const nameScreen = document.getElementById("nameScreen");
const questionScreen = document.getElementById("questionScreen");
const dateScreen = document.getElementById("dateScreen");
const finalScreen = document.getElementById("finalScreen");

// ARROW ANIMATION ELEMENTS
const shootButton = document.getElementById("shootButton");
const arrow = document.getElementById("arrow");
const heart = document.getElementById("heart");
const particles = document.getElementById("particles");
const message = document.getElementById("message");

// BUTTONS
const continueButton = document.getElementById("continueButton");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const okButton = document.getElementById("okButton");

// INPUTS
const nameInput = document.getElementById("nameInput");
const dateChoice = document.getElementById("dateChoice");
const timeChoice = document.getElementById("timeChoice");

// OTHER ELEMENTS
const buttonArea = document.getElementById("buttonArea");
const greeting = document.getElementById("greeting");
const finalDate = document.getElementById("finalDate");
const finalTime = document.getElementById("finalTime");
const rainHearts = document.getElementById("rainHearts");

// VARIABLES
let isShooting = false;
let noClicks = 0;
let visitorName = "";


// ==========================================
// SHOW SCREEN
// ==========================================

function showScreen(screenToShow) {
    [
        startScreen,
        nameScreen,
        questionScreen,
        dateScreen,
        finalScreen
    ].forEach(function (screen) {
        screen.classList.add("hidden");
    });

    screenToShow.classList.remove("hidden");
}


// ==========================================
// ARROW SHOOTING ANIMATION
// ==========================================

shootButton.addEventListener("click", function () {

    if (isShooting) return;

    isShooting = true;
    shootButton.disabled = true;

    // Reset arrow and heart animation
    arrow.classList.remove("shooting");
    heart.classList.remove("exploding");

    heart.style.display = "block";
    heart.style.filter = "";
    heart.style.animation = "";

    particles.innerHTML = "";

    void arrow.offsetWidth;

    message.textContent = "Here comes the love...";
    shootButton.textContent = "SHOOTING...";

    // Arrow starts flying
    arrow.classList.add("shooting");

    // Arrow hits the heart
    setTimeout(function () {

        heart.classList.remove("heartbeat");
        heart.style.animation = "none";
        heart.classList.add("exploding");

        message.textContent = "BOOM!";

        // Create 40 small hearts
        for (let i = 0; i < 40; i++) {

            const smallHeart = document.createElement("span");

            smallHeart.className = "particle";
            smallHeart.textContent =
                Math.random() > 0.25 ? "♥" : "♡";

            const angle = Math.random() * Math.PI * 2;
            const distance = 70 + Math.random() * 170;

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            smallHeart.style.setProperty("--x", x + "px");
            smallHeart.style.setProperty("--y", y + "px");

            smallHeart.style.setProperty(
                "--size",
                (16 + Math.random() * 25) + "px"
            );

            smallHeart.style.setProperty(
                "--rotation",
                Math.random() * 360 + "deg"
            );

            particles.appendChild(smallHeart);
        }

        // Show next screen after animation
        setTimeout(function () {

            message.textContent = "I LOVE YOU!";

            startScreen.classList.add("hidden");
            nameScreen.classList.remove("hidden");

            nameInput.focus();

            shootButton.disabled = false;
            isShooting = false;

        }, 1100);

    }, 750);

});


// ==========================================
// NAME INPUT
// ==========================================

continueButton.addEventListener("click", function () {

    visitorName = nameInput.value.trim();

    if (visitorName === "") {
        alert("Please enter your name first.");
        nameInput.focus();
        return;
    }

    greeting.textContent = "Hey, " + visitorName + "!";

    showScreen(questionScreen);

});

// Press Enter to continue
nameInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        continueButton.click();
    }

});


// ==========================================
// NO BUTTON MOVEMENT
// ==========================================

function moveNoButton() {

    noClicks++;

    // Hide NO button after 5 clicks
    if (noClicks >= 5) {
        noButton.style.display = "none";
        return;
    }

    noButton.classList.add("moving");

    const area = buttonArea.getBoundingClientRect();
    const button = noButton.getBoundingClientRect();

    const maxX = Math.max(0, area.width - button.width);
    const maxY = Math.max(0, area.height - button.height);

    // Move to different positions
    const positions = [
        { x: maxX / 2, y: 0 },          // Top
        { x: maxX, y: maxY / 2 },       // Right
        { x: 0, y: maxY / 2 },          // Left
        { x: maxX / 2, y: maxY }       // Bottom
    ];

    const position = positions[(noClicks - 1) % positions.length];

    noButton.style.left = position.x + "px";
    noButton.style.top = position.y + "px";

}

noButton.addEventListener("click", moveNoButton);


// ==========================================
// YES BUTTON
// ==========================================

yesButton.addEventListener("click", function () {

    setMinimumDate();

    showScreen(dateScreen);

});


// ==========================================
// CALENDAR: SET TODAY AS MINIMUM DATE
// ==========================================

function setMinimumDate() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateChoice.min = year + "-" + month + "-" + day;

}


// ==========================================
// FORMAT SELECTED DATE
// ==========================================

function formatDate(dateString) {

    const [year, month, day] = dateString.split("-").map(Number);

    const selectedDate = new Date(year, month - 1, day);

    return selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

}


// ==========================================
// FORMAT SELECTED TIME
// ==========================================

function formatTime(timeString) {

    const [hours, minutes] = timeString.split(":").map(Number);

    const selectedTime = new Date();

    selectedTime.setHours(hours, minutes, 0, 0);

    return selectedTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });

}


// ==========================================
// SAVE DATE AND TIME
// ==========================================

okButton.addEventListener("click", async function () {

    const selectedDate = dateChoice.value;
    const selectedTime = timeChoice.value;

    if (!visitorName) {
        alert("Please enter your name first.");
        showScreen(nameScreen);
        return;
    }

    if (!selectedDate || !selectedTime) {
        alert("Please choose both a date and a time.");
        return;
    }

    // Prevent selecting a past date
    setMinimumDate();

    if (selectedDate < dateChoice.min) {
        alert("Please choose today or a future date.");
        return;
    }

    const readableDate = formatDate(selectedDate);
    const readableTime = formatTime(selectedTime);

    // Prepare information for PHP backend
    const formData = new URLSearchParams();

    formData.append("visitor_name", visitorName);
    formData.append("selected_date", readableDate);
    formData.append("selected_time", readableTime);

    okButton.disabled = true;
    okButton.textContent = "Saving...";

    try {

        const response = await fetch("save_submission.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Unable to save submission.");
        }

        // Display selected date and time
        finalDate.textContent = "Our date: " + readableDate;
        finalTime.textContent = "Time: " + readableTime;

        showScreen(finalScreen);

        createRainHearts();

    } catch (error) {

        console.error("Submission error:", error);

        alert(
            "Sorry, your submission could not be saved. " +
            "Please check your internet connection and try again."
        );

    } finally {

        okButton.disabled = false;
        okButton.textContent = "OK";

    }

});


// ==========================================
// FINAL SCREEN: FALLING HEARTS
// ==========================================

function createRainHearts() {

    rainHearts.innerHTML = "";

    for (let i = 0; i < 55; i++) {

        const fallingHeart = document.createElement("span");

        fallingHeart.className = "rain-heart";

        fallingHeart.textContent =
            Math.random() > 0.3 ? "♥" : "♡";

        fallingHeart.style.left =
            Math.random() * 100 + "vw";

        fallingHeart.style.animationDuration =
            3 + Math.random() * 4 + "s";

        fallingHeart.style.animationDelay =
            Math.random() * 3 + "s";

        fallingHeart.style.fontSize =
            12 + Math.random() * 25 + "px";

        rainHearts.appendChild(fallingHeart);

    }

}


// ==========================================
// INITIAL SETUP
// ==========================================

setMinimumDate();
