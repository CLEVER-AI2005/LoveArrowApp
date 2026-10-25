
const shootButton = document.getElementById("shootButton");
const arrow = document.getElementById("arrow");
const heart = document.getElementById("heart");
const message = document.getElementById("message");
const particles = document.getElementById("particles");

let isShooting = false;

shootButton.addEventListener("click", function () {
    if (isShooting) return;

    isShooting = true;
    shootButton.disabled = true;

    // Reset the previous animation
    arrow.classList.remove("shooting");
    heart.classList.remove("exploding");
    heart.style.display = "block";
    heart.style.filter = "";
    particles.innerHTML = "";

    void arrow.offsetWidth;

    message.textContent = "Here comes the love...";
    shootButton.textContent = "SHOOTING...";

    // The arrow flies toward the heart
    arrow.classList.add("shooting");

    // The arrow hits the heart
    setTimeout(function () {
        heart.classList.remove("heartbeat");
        heart.style.animation = "none";
        heart.classList.add("exploding");

        message.textContent = "BOOM!";

        // Create lots of flying hearts
        for (let i = 0; i <  fortyHearts(); i++) {
            const smallHeart = document.createElement("span");

            smallHeart.className = "particle";
            smallHeart.textContent = Math.random() > 0.25 ? "♥" : "♡";

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
                (Math.random() * 360) + "deg"
            );

            particles.appendChild(smallHeart);
        }

        // Show the love message
        setTimeout(function () {
            message.textContent = "I LOVE YOU!";
            message.style.fontSize = "30px";
            message.style.fontWeight = "bold";
            message.style.color = "#e6004c";
            shootButton.textContent = "SHOOT AGAIN!";
            shootButton.disabled = false;
            isShooting = false;
        }, 350);

    }, 750);
});

function fortyHearts() {
    return 40;
}
