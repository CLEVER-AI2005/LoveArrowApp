// LOVE ARROW APP

// SCREEN ELEMENTS
const startScreen = document.getElementById("startScreen");
const nameScreen = document.getElementById("nameScreen");
const questionScreen = document.getElementById("questionScreen");
const dateScreen = document.getElementById("dateScreen");
const finalScreen = document.getElementById("finalScreen");

// BUTTONS AND INPUTS
const shootButton = document.getElementById("shootButton");
const continueButton = document.getElementById("continueButton");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const okButton = document.getElementById("okButton");

const nameInput = document.getElementById("nameInput");
const dateChoice = document.getElementById("dateChoice");
const timeChoice = document.getElementById("timeChoice");

const greeting = document.getElementById("greeting");
const finalDate = document.getElementById("finalDate");
const finalTime = document.getElementById("finalTime");

let visitorName = "";

// SHOW ONE SCREEN AND HIDE THE OTHERS
function showScreen(screenToShow) {
    [startScreen, nameScreen, questionScreen, dateScreen, finalScreen]
        .forEach(screen => screen.classList.add("hidden"));

    screenToShow.classList.remove("hidden");
}

// SET TODAY AS THE EARLIEST AVAILABLE DATE
function setMinimumDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateChoice.min = `${year}-${month}-${day}`;
}

// FORMAT DATE FOR DISPLAY
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

// FORMAT TIME FOR DISPLAY
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);

    const selectedTime = new Date();
    selectedTime.setHours(hours, minutes, 0, 0);

    return selectedTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
}

// START BUTTON
shootButton.addEventListener("click", function () {
    showScreen(nameScreen);
});

// CONTINUE BUTTON
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

// YES BUTTON
yesButton.addEventListener("click", function () {
    setMinimumDate();
    showScreen(dateScreen);
});

// NO BUTTON
noButton.addEventListener("click", function () {
    alert("That's okay. Thank you for answering!");
});

// OK BUTTON: SAVE DATE AND TIME
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

    // Prevent selecting a past date.
    setMinimumDate();

    if (selectedDate < dateChoice.min) {
        alert("Please choose today or a future date.");
        return;
    }

    // Convert the chosen date to a readable format.
    const readableDate = formatDate(selectedDate);
    const readableTime = formatTime(selectedTime);

    // Prepare the information for the PHP backend.
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

        // Show the visitor's selected date and time.
        finalDate.textContent = "Our date: " + readableDate;
        finalTime.textContent = "Time: " + readableTime;

        showScreen(finalScreen);

        // Start the existing heart animation, if available.
        if (typeof createRainHearts === "function") {
            createRainHearts();
        }

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

// SET INITIAL DATE RESTRICTION
setMinimumDate();
