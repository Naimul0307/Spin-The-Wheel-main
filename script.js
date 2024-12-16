const fixedColors = ["#FF5733", "#33FF57", "#3357FF"]; // Add your desired colors here

function toRad(deg) {
    return deg * (Math.PI / 180.0);
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

function getPercent(input, min, max) {
    return (((input - min) * 100) / (max - min)) / 100;
}

// Global Variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2;

let items = document.getElementById("itemTextarea").value.split("\n");
let images = {}; // Store uploaded images
let currentDeg = 0;
let step = 360 / items.length;
let itemDegs = {};

// Event Listener for Text Input Updates
document.getElementById("itemTextarea").addEventListener("input", () => {
    createWheel();
});

// Create Wheel
function createWheel() {
    items = document.getElementById("itemTextarea").value.split("\n").filter((item) => item.trim() !== "");
    step = 360 / items.length;
    draw();
}

// Draw Wheel
function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
    ctx.fillStyle = `rgb(33, 33, 33)`; // Background color of wheel
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    let startDeg = currentDeg;
    for (let i = 0; i < items.length; i++, startDeg += step) {
        const endDeg = startDeg + step;

        const colorStyle = fixedColors[i % fixedColors.length]; // Cycle through fixed colors

        // Draw Wheel Segment
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = colorStyle;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Draw Text or Image
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(toRad((startDeg + endDeg) / 2));
        ctx.textAlign = "center";

        // Calculate the available space for text based on the segment's angle
        const segmentAngle = endDeg - startDeg; // Angle of the segment
        const maxFontSize = Math.min(segmentAngle / 4, 30); // Limit font size based on angle (dividing by 2 for padding)

        // Set the font size based on the available space
        ctx.font = `bold ${maxFontSize}px serif`;

        if (images[items[i]]) {
            // Draw Image
            const img = images[items[i]];
            ctx.drawImage(img, 110, -30, 40, 40); // Adjust position and size of the image
        } else {
            // Draw Text
            ctx.fillStyle = "#fff"; // Text color
            ctx.fillText(items[i], 130, 10); // Position the text inside the segment
        }
        ctx.restore();

        itemDegs[items[i]] = {
            startDeg: startDeg,
            endDeg: endDeg,
        };

        // Check Winner
        if (
            startDeg % 360 < 360 &&
            startDeg % 360 > 270 &&
            endDeg % 360 > 0 &&
            endDeg % 360 < 90
        ) {
            document.getElementById("winner").innerHTML = items[i];
        }
    }
}


// Spin Wheel
let speed = 0;
let maxRotation = randomRange(360 * 3, 360 * 6);
let pause = false;

function animate() {
    if (pause) {
        return;
    }
    speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
    if (speed < 0.01) {
        speed = 0;
        pause = true;
    }
    currentDeg += speed;
    draw();
    window.requestAnimationFrame(animate);
}

function spin() {
    if (speed !== 0) {
        return;
    }
    maxRotation = 0;
    currentDeg = 0;
    createWheel();
    draw();

    maxRotation = randomRange(360 * 3, 360 * 6);
    pause = false;
    window.requestAnimationFrame(animate);
}

// Handle Image Upload
function handleImageUpload() {
    const files = document.getElementById("imageUpload").files;

    Array.from(files).forEach((file) => {
        const img = new Image();
        const itemName = file.name.split(".")[0];
        img.onload = () => {
            images[itemName] = img;
            updateTextareaWithImages();
            createWheel();
        };
        img.src = URL.createObjectURL(file);
    });
}

function updateTextareaWithImages() {
    const textarea = document.getElementById("itemTextarea");
    let currentText = textarea.value.split("\n");
    const imageNames = Object.keys(images);
    imageNames.forEach((name) => {
        if (!currentText.includes(name)) {
            currentText.push(name);
        }
    });
    textarea.value = currentText.join("\n");
    createWheel();
}

// Initial Draw
draw();
