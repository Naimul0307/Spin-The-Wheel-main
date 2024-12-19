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
        return Math.sin((x * Math.PI) / 2);
    }

    function getPercent(input, min, max) {
        return (((input - min) * 100) / (max - min)) / 100;
    }



function getBackgroundColor() {
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
    return bgColor.trim(); // Remove any extra spaces
}

// Function to handle background color selection
document.getElementById("bg-color").addEventListener("input", (event) => {
    const color = event.target.value;
    document.documentElement.style.setProperty('--background-color', color); // Update CSS variable
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

// Function to draw the wheel with the dynamic background and border
function draw() {
    ctx.clearRect(0, 0, width, height); // Clear the canvas

    // Draw the background (image or color)
    if (userBackgroundImage) {
        // Only draw the background image inside the circular wheel
        ctx.save(); // Save the current context state
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); // Define the wheel area
        ctx.clip(); // Clip the drawing to the circular area

        // Draw the image inside the wheel's clipped region
        ctx.drawImage(userBackgroundImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
        ctx.restore(); // Restore the context to its original state
    } else {
        // Draw the background color if no image is selected
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); // Define the wheel area
        ctx.fillStyle = getBackgroundColor(); // Get the background color from CSS
        ctx.lineTo(centerX, centerY);
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

        // If background image is used, set transparent color for the slices
        let colorStyle = "transparent";
        if (!userBackgroundImage) {
            // Assign color for the segment if no background image is set
            colorStyle = fixedColors[i % fixedColors.length];
        }

        // Draw Wheel Segment
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = colorStyle; // Use transparent if image is set
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Draw the border around each slice with the dynamic border color
        ctx.lineWidth = 3; // Set the slice border width
        ctx.strokeStyle = borderColor; // Use the dynamically set border color
        ctx.stroke();

        if (images[items[i]]) {
            const img = images[items[i]];

            // Calculate the slice angle
            const sliceAngle = toRad(endDeg - startDeg); // Slice angle in radians
            const sliceRadius = radius * 0.8; // Slight padding to fit within the slice
            const maxSliceWidth = sliceRadius * Math.sin(sliceAngle / 2); // Max width of the slice
            const maxSliceHeight = sliceRadius * 0.6; // Adjusted height to avoid overlapping

            // Scale the image to fit within the slice dimensions
            const scale = Math.min(maxSliceWidth / img.width, maxSliceHeight / img.height);
            const imgWidth = img.width * scale;
            const imgHeight = img.height * scale;

            // Calculate the position for centering the image within the slice
            const angleMid = toRad((startDeg + endDeg) / 2); // Midpoint angle
            const imgX = centerX + Math.cos(angleMid) * (sliceRadius - imgHeight / 2) - imgWidth / 2;
            const imgY = centerY + Math.sin(angleMid) * (sliceRadius - imgHeight / 2) - imgHeight / 2;

            // Draw the image
            ctx.save();
            ctx.translate(imgX + imgWidth / 2, imgY + imgHeight / 2); // Move to the center of the image
            ctx.rotate(angleMid); // Align image with the slice angle
            ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
            ctx.restore();
        } else {
            // Fallback to draw text (unchanged)
            const sliceAngle = endDeg - startDeg;
            const fontSize = Math.max(10, Math.min(30, sliceAngle * 0.5));

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(toRad((startDeg + endDeg) / 2));
            ctx.textAlign = "left";
            ctx.font = `bold ${fontSize}px serif`;
            ctx.fillStyle = "#fff";
            ctx.fillText(items[i], radius * 0.5, 5);
            ctx.restore();
        }

        itemDegs[items[i]] = {
            startDeg: startDeg,
            endDeg: endDeg,
        };

        // Only update the winner if the flag is set
        if (shouldUpdateWinner && startDeg % 360 < 360 && startDeg % 360 > 270 && endDeg % 360 > 0 && endDeg % 360 < 90) {
            updateWinnerDisplay(items[i]); // Update winner display with image or text
        }
    }
}

const spinSound = new Audio("../public/mp3/wheel-spin.mp3"); // Load the spin sound
spinSound.loop = true; // Make the sound loop while the wheel is spinning

// Spin Wheel
let isSpinning = false; 
let speed = 0;
let maxRotation = randomRange(360 * 3, 360 * 6);
let pause = true;
let winner = null;;

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

function animate() {
    if (pause) {
        spinSound.pause(); // Stop the sound when spinning ends
        spinSound.currentTime = 0; // Reset the sound to the start
        
        // After the spin ends, determine the winner
        determineWinner();
        
        // Reset the spinning flag after spin ends
        isSpinning = false;

        return;
    }

    speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
    if (speed < 0.01) {
        speed = 0;
        pause = true; // Pause the spin when it's close to the end
    }

    currentDeg += speed;
    draw();
    window.requestAnimationFrame(animate); // Keep animating
}

// Modify the spin function to set the flag
function spin() {
    if (speed !== 0) {
        return; // Prevent starting a new spin if one is already in progress
    }

    // Set the flag to indicate the spin has started
    isSpinning = true;

    // Reset the wheel for a new spin
    maxRotation = 0;
    currentDeg = 0;
    createWheel();
    draw();

    // Set a random rotation range for the spin
    maxRotation = randomRange(360 * 3, 360 * 6);
    pause = false;
    
    spinSound.play(); // Start the sound when the wheel starts spinning
    window.requestAnimationFrame(animate); // Start the animation
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

document.getElementById("imageUpload").addEventListener("change", handleImageUpload);

// Initial Draw
draw();
