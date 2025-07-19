// Toggle visibility of the input area when the button is clicked
document.getElementById("showInputButton").addEventListener("click", () => {
    const inputArea = document.querySelector(".inputArea");
    const currentDisplay = inputArea.style.display;
    
    // Toggle between showing and hiding the input area
    if (currentDisplay === "none" || currentDisplay === "") {
        inputArea.style.display = "block";
        document.getElementById("showInputButton").textContent = "Hide Input Area";
    } else {
        inputArea.style.display = "none";
        document.getElementById("showInputButton").textContent = "Show Input Area";
    }
});

//this use for chare bakcground color
let userBackgroundImage = null; // Store the selected background image
const fixedColors = ["#FF5733", "#33FF57", "#3357FF", "#FFD700", "#FF69B4"]; // Default colors


// Variables to store the selected colors
let centerCircleColor = "#FFFFFF"; // Default color
let triangleColor = "#D89898"; // Default color
let centerCircleImage = null;

document.getElementById("center-circle-image").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => {
            centerCircleImage = img; // Store the uploaded image
            updateWheelAppearance(); // Redraw the wheel with the new image
        };
        img.src = URL.createObjectURL(file); // Load the image
    }
});

// Event listener for center-circle color change
document.getElementById("center-circle-color").addEventListener("input", (event) => {
    centerCircleColor = event.target.value; // Update the center-circle color
    updateWheelAppearance(); // Update the appearance of the wheel
});

// Event listener for triangle color change
document.getElementById("triangle-color").addEventListener("input", (event) => {
    triangleColor = event.target.value; // Update the triangle color
    updateWheelAppearance(); // Update the appearance of the wheel
});


    // Update fixedColors array dynamically
    document.getElementById("color1").addEventListener("input", (event) => {
        fixedColors[0] = event.target.value;
        draw(); // Redraw the wheel
    });

    document.getElementById("color2").addEventListener("input", (event) => {
        fixedColors[1] = event.target.value;
        draw(); // Redraw the wheel
    });

    document.getElementById("color3").addEventListener("input", (event) => {
        fixedColors[2] = event.target.value;
        draw(); // Redraw the wheel
    });

    document.getElementById("color4").addEventListener("input", (event) => {
        fixedColors[3] = event.target.value;
        draw(); // Redraw the wheel
    });

    document.getElementById("color5").addEventListener("input", (event) => {
        fixedColors[4] = event.target.value;
        draw(); // Redraw the wheel
    });

    function toRad(deg) {
        return deg * (Math.PI / 180.0);
    }

    function randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function easeOutSine(x) {
        return Math.sin((x * Math.PI) / 2) * 2;
    }
    function getPercent(input, min, max) {
        return (((input - min) * 100) / (max - min)) / 100;
    }

    function normalizeDegrees(deg) {
        return ((deg % 360) + 360) % 360; // Ensures the value is within 0-360
    }

function getBackgroundColor() {
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
    return bgColor.trim(); // Remove any extra spaces
}

// Function to handle background color selection
document.getElementById("bg-color").addEventListener("input", (event) => {
    const color = event.target.value;
    document.documentElement.style.setProperty('--background-color', color);
    userBackgroundImage = null; // Reset background image if color is selected
    draw(); // Redraw the wheel with the new color
});

// Function to handle background image upload
document.getElementById("bg-image").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => {
            userBackgroundImage = img; // Set the image as the background
            draw(); // Redraw the wheel with the image
        };
        img.src = URL.createObjectURL(file); // Set the image source
    }
});

let borderColor = "#000000"; // Default border color (black)

function updateWheelAppearance() {
    const centerCircle = document.querySelector(".center-circle");

    if (centerCircleImage) {
        // Clear background color and set image
        centerCircle.style.backgroundColor = "transparent";
        centerCircle.style.backgroundImage = `url('${centerCircleImage.src}')`;
        centerCircle.style.backgroundSize = "cover";
        centerCircle.style.backgroundPosition = "center";
    } else {
        // Use the selected color if no image is uploaded
        centerCircle.style.backgroundImage = "none";
        centerCircle.style.backgroundColor = centerCircleColor;
    }

    const triangle = document.querySelector(".triangle");
    triangle.style.borderRightColor = triangleColor;

    draw(); // Redraw the wheel
}

// Event listener for border color change
document.getElementById("border-color").addEventListener("input", (event) => {
    borderColor = event.target.value; // Update the border color
    draw(); // Redraw the wheel with the new border color
});

// Global Variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2.01;

let items = document.getElementById("itemTextarea").value.split("\n");
let images = {}; // Store uploaded images
let currentDeg = 0;
let step = 360 / items.length;
let itemDegs = {};
let shouldUpdateWinner = true; 

// Event Listener for Text Input Updates
document.getElementById("itemTextarea").addEventListener("input", () => {
    shouldUpdateWinner = false; // Disable winner update when updating the items
    createWheel();
    shouldUpdateWinner = true; // Re-enable winner update after creating the wheel
});

// Create Wheel
function createWheel() {
    items = document.getElementById("itemTextarea").value.split("\n").filter((item) => item.trim() !== "");
    step = 360 / items.length;
    draw();
}

function draw() {
    ctx.clearRect(0, 0, width, height); // Clear the canvas

    // Draw the background (image or color)
    if (userBackgroundImage) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); // Define the wheel area
        ctx.clip();
        ctx.drawImage(userBackgroundImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
        ctx.restore();
    } else {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); // Define the wheel area
        ctx.fillStyle = getBackgroundColor(); // Get the background color from CSS
        ctx.fill();
    }

    // Draw the wheel border with dynamic border color
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.lineWidth = 5; // Set the border width
    ctx.strokeStyle = borderColor; // Use the dynamically set border color
    ctx.stroke();

    if (items.length === 0 || items[0].trim() === "") {
        return; // Exit if no items
    }

    let startDeg = currentDeg; // Start angle for segments
    for (let i = 0; i < items.length; i++, startDeg += step) {
        const endDeg = startDeg + step;

        // Begin slice path
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
        ctx.closePath();

        // Draw slice background (image or color)
        if (images[items[i]]) {
            ctx.save();

            // Create slice path
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
            ctx.closePath();
            ctx.clip(); // Clip to the slice

            // Move origin to center
            ctx.translate(centerX, centerY);

            // Rotate to align image to slice angle
            const midAngle = (startDeg + endDeg) / 2;
            ctx.rotate(toRad(midAngle));

            // Draw the image to cover the full slice (adjust size to fill)
            const img = images[items[i]];
            const imgWidth = radius;
            const imgHeight = radius;

            ctx.drawImage(img, 0, -imgHeight / 2, imgWidth, imgHeight);

            ctx.restore();
        }else {
            ctx.fillStyle = fixedColors[i % fixedColors.length];
            ctx.fill();
        }

        // Clip to the slice for text drawing
        if (!images[items[i]]) {
            ctx.save();
            ctx.clip();

            // Draw text inside the slice
            const sliceAngle = (startDeg + endDeg) / 2; 
            const text = items[i];
            const sliceArc = toRad(endDeg - startDeg);
            const fontSize = Math.min(30, radius / 10, sliceArc * radius * 0.5)
            ctx.font = `bold ${fontSize}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.translate(centerX, centerY);
            ctx.rotate(toRad(sliceAngle));
            ctx.fillStyle = "#fff";

            // Calculate position and ensure text stays within the slice
            const textRadius = radius * 0.7;
            ctx.fillText(text, textRadius, 0);

            ctx.restore();
        }

        // Draw the border around each slice
        ctx.lineWidth = 3; // Set the slice border width
        ctx.strokeStyle = borderColor; // Use the dynamically set border color
        ctx.stroke();

        itemDegs[items[i]] = {
            startDeg: startDeg,
            endDeg: endDeg,
        };

        // Update winner display if the flag is set
        if (
            shouldUpdateWinner &&
            startDeg % 360 < 360 &&
            startDeg % 360 > 270 &&
            endDeg % 360 > 0 &&
            endDeg % 360 < 90
        ) {
            updateWinnerDisplay(items[i]); // Update winner display with image or text
        }
    }
}

// function draw() {
//     ctx.clearRect(0, 0, width, height);

//     // Draw the wheel background (global)
//     if (userBackgroundImage) {
//         ctx.save();
//         ctx.beginPath();
//         ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
//         ctx.clip();
//         ctx.drawImage(userBackgroundImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
//         ctx.restore();
//     } else {
//         ctx.beginPath();
//         ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
//         ctx.fillStyle = getBackgroundColor();
//         ctx.fill();
//     }

//     // Wheel border
//     ctx.beginPath();
//     ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
//     ctx.lineWidth = 5;
//     ctx.strokeStyle = borderColor;
//     ctx.stroke();

//     if (items.length === 0 || items[0].trim() === "") return;

//     let startDeg = currentDeg;

//     for (let i = 0; i < items.length; i++, startDeg += step) {
//         const endDeg = startDeg + step;
//         const midDeg = (startDeg + endDeg) / 2;
//         const sliceAngleRad = toRad(endDeg - startDeg);
//         const item = items[i];
//         const img = images[item];

//         // === Slice Background Color ===
//         ctx.beginPath();
//         ctx.moveTo(centerX, centerY);
//         ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
//         ctx.closePath();

//         ctx.fillStyle = fixedColors[i % fixedColors.length]; // Always draw background color
//         ctx.fill();

//         // === Slice Image (smaller, centered in wedge) ===
//         if (img) {
//             ctx.save();
//             ctx.clip();
//             ctx.translate(centerX, centerY);
//             ctx.rotate(toRad(midDeg));

//             // Smaller image dimensions
//             const imgWidth = radius * 0.6;
//             const imgHeight = radius * 0.25;

//             ctx.drawImage(img, radius * 0.2, -imgHeight / 2, imgWidth, imgHeight);

//             ctx.restore();
//         } else {
//             // === Text Only if No Image ===
//             ctx.save();
//             ctx.clip();
//             ctx.translate(centerX, centerY);
//             ctx.rotate(toRad(midDeg));

//             const fontSize = Math.min(30, radius / 10, sliceAngleRad * radius * 0.5);
//             ctx.font = `bold ${fontSize}px serif`;
//             ctx.textAlign = "center";
//             ctx.textBaseline = "middle";
//             ctx.fillStyle = "#fff";

//             ctx.fillText(item, radius * 0.7, 0);
//             ctx.restore();
//         }

//         // === Slice Border ===
//         ctx.beginPath();
//         ctx.moveTo(centerX, centerY);
//         ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
//         ctx.closePath();
//         ctx.lineWidth = 3;
//         ctx.strokeStyle = borderColor;
//         ctx.stroke();

//         itemDegs[item] = { startDeg, endDeg };

//         if (
//             shouldUpdateWinner &&
//             startDeg % 360 < 360 &&
//             startDeg % 360 > 270 &&
//             endDeg % 360 > 0 &&
//             endDeg % 360 < 90
//         ) {
//             updateWinnerDisplay(item);
//         }
//     }
// }

const spinSound = new Audio("public/mp3/wheel-spin.mp3"); // Load the spin sound
spinSound.loop = true; // Make the sound loop while the wheel is spinning

// Spin Wheel
let isSpinning = false; 
let speed = randomRange(200, 300); 
let maxRotation = randomRange(360 * 12, 360 * 15); 
let pause = true;
let winner = null;;

// Listen for keyboard key press to start spinning
document.addEventListener("keydown", function(event) {
    if (event.key === 'Enter' || event.key === 'Space') { // Spacebar or Enter key
        spin();
    }
});

//Update the winner text/image display
function updateWinnerDisplay(winner) {
    const winnerText = document.getElementById("winner-text");
    const winnerImage = document.getElementById("winner-image");

    if (images[winner]) {
        // Display the image if the winner has an image
        winnerText.style.display = "none";
        winnerImage.style.display = "block";
        winnerImage.src = images[winner].src;
    } else {
        // Display the text if the winner has no image
        winnerText.style.display = "block";
        winnerImage.style.display = "none";
        winnerText.textContent = winner;
    }
}

function spin() {
    if (isSpinning) {
        return; // Prevent starting a new spin if one is already in progress
    }

    // Reset states for a new spin
    isSpinning = true;
    currentDeg = 0; // Reset the current rotation to start fresh
    // speed = randomRange(100, 200); 
    speed = randomRange(50, 100); // Increased speed range (from 50-100 to 100-200)
    maxRotation = randomRange(360 * 15, 360 * 20);
    // maxRotation = randomRange(360 * 8, 360 * 12); // Increased duration (from 360*3-360*6 to 360*5-360*8)
    pause = false;

    spinSound.play(); // Play the spinning sound
    window.requestAnimationFrame(animate); // Start the animation loop
}

function animate() {
    if (pause) {
        if (isSpinning) {
            spinSound.pause(); // Stop the sound when spinning ends
            spinSound.currentTime = 0; // Reset the sound to the start
            isSpinning = false;
            determineWinner(); // Determine the winner after the spin stops
        }
        return;
    }

    // Calculate the speed based on easing
    const percentComplete = getPercent(currentDeg, maxRotation, 0);
    speed = easeOutSine(percentComplete) * 50; // Increased easing factor to make it faster

    if (speed < 0.01) {
        speed = 0; // Stop the wheel when speed is negligible
        pause = true; // End the animation
    }

    currentDeg += speed; // Increment the rotation degree
    draw(); // Redraw the wheel

    if (speed <= 0) {
        spinSound.pause(); // Pause the sound when the animation is done
    }

    window.requestAnimationFrame(animate); // Continue the animation loop
}


//Function to open the winner popup modal and display the winner
function openWinnerModal(winner) {
    const modal = document.getElementById("winnerModal");
    const winnerText = document.getElementById("winner-popup-text");
    const winnerImage = document.getElementById("winner-popup-image");

    // Hide both text and image initially
    winnerText.style.display = "none";
    winnerImage.style.display = "none";

    // If there is an image for the winner, show the image
    if (images[winner]) {
        winnerImage.src = images[winner].src; // Set image source
        winnerImage.style.display = "block"; // Show image
    } else {
        // If no image, show the winner's name without "Winner:" text
        winnerText.textContent = winner; // Just set the winner's name
        winnerText.style.display = "block"; // Show text
    }

    modal.style.display = "block"; // Show the modal
}


function closeWinnerModal() {
    const modal = document.getElementById("winnerModal");
    modal.style.display = "none"; // Hide the modal
}

//
function determineWinner() {
    const normalizedDeg = normalizeDegrees(currentDeg);
    const winnerIndex = Math.floor((360 - normalizedDeg) / step) % items.length; // Use (360 - normalizedDeg) to account for clockwise rotation
    winner = items[winnerIndex]; // Get the winner's name
    updateWinnerDisplay(winner); // Update the winner display on the wheel
    openWinnerModal(winner); // Optionally, open a modal to display the winner
}


// Handle Image Upload
function handleImageUpload() {
    const files = document.getElementById("imageUpload").files;
    Array.from(files).forEach((file) => {
        const img = new Image();
        const itemName = file.name.split(".")[0]; // Extract item name from file name
        img.onload = () => {
            images[itemName] = img;
            updateTextareaWithImages(); // Update the textarea with image names
            createWheel(); // Redraw the wheel with updated images
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

document.getElementById("imageUpload").addEventListener("change", handleImageUpload);

// Initial Draw
draw();