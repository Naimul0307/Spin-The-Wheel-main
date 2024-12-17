
        const fixedColors = ["#FF5733", "#33FF57", "#3357FF", "#FFD700", "#FF69B4"];

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
        // Update the winner text/image display
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

// In the draw function, check if the wheel's slice has the winning item
function draw() {
    ctx.clearRect(0, 0, width, height); // Clear the canvas

    // Draw the background (light color)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
    ctx.fillStyle = `rgb(240, 202, 202)`; // Default background color
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    if (items.length === 0 || items[0].trim() === "") {
        return; // Exit if no items
    }

    let startDeg = currentDeg; // Start angle for segments
    for (let i = 0; i < items.length; i++, startDeg += step) {
        const endDeg = startDeg + step;

        // Assign color for the segment
        const colorStyle = fixedColors[i % fixedColors.length];

        // Draw Wheel Segment
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = colorStyle; // Use the color from fixedColors array
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        ctx.textAlign = "center";

        if (images[items[i]]) {
            const img = images[items[i]];
        
            // Save the context and clip to the slice
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, toRad(startDeg), toRad(endDeg));
            ctx.closePath();
            ctx.clip();
        
            // Calculate slice angle and image size dynamically
            const sliceAngle = endDeg - startDeg; // Slice angle in degrees
            const sliceRadius = radius * 0.9; // Padding to prevent overflow
            const imgSize = sliceRadius * Math.sin(toRad(sliceAngle / 2)) * 0.7; // Adjust size based on angle
        
            // Calculate the position for centering the image in the slice
            const angleMid = toRad((startDeg + endDeg) / 2); // Midpoint of the slice
            const imgX = centerX + Math.cos(angleMid) * sliceRadius * 0.6 - imgSize / 2;
            const imgY = centerY + Math.sin(angleMid) * sliceRadius * 0.6 - imgSize / 2;
        
            // Draw the image
            ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
        
            ctx.restore(); // Restore clipping
        } else {
            // Draw Text if no image
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(toRad((startDeg + endDeg) / 2));

            ctx.font = `bold 25px serif`;
            ctx.fillStyle = "#fff";
            ctx.fillText(items[i], radius * 0.7, 5);
            ctx.restore();
        } 

        itemDegs[items[i]] = {
            startDeg: startDeg,
            endDeg: endDeg,
        };                

        // Check Winner and Update the Display
        if (
            startDeg % 360 < 360 &&
            startDeg % 360 > 270 &&
            endDeg % 360 > 0 &&
            endDeg % 360 < 90
        ) {
            updateWinnerDisplay(items[i]); // Update winner display with image or text
        }
    }
}

// Spin Wheel
let speed = 0;
let maxRotation = randomRange(360 * 5, 360 * 10);  // Increased max rotation to spin for a longer time
let pause = false;
const spinSound = new Audio("../public/mp3/wheel-spin1.mp3");
spinSound.loop = true;

function animate() {
    if (pause) {
        spinSound.pause(); // Stop the sound when spinning is paused
        spinSound.currentTime = 0; // Reset sound to the beginning
        return;
    }

    speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 30;  // Increased speed multiplier
    if (speed < 0.1) {
        speed = 0;
        pause = true; // Stop the animation loop
        spinSound.pause(); // Stop the sound
        spinSound.currentTime = 0; // Reset sound to the beginning
    }

    currentDeg += speed;
    draw();
    window.requestAnimationFrame(animate);
}

function spin() {
    if (speed !== 0) {
        return; // Prevent spinning if already spinning
    }

    maxRotation = 0;
    currentDeg = 0;
    createWheel();
    draw();

    maxRotation = randomRange(360 * 5, 360 * 10); // Increase spin time by adjusting maxRotation
    pause = false;

    spinSound.play(); // Start playing the sound
    spinSound.loop = true; // Ensure the sound loops while spinning

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

        document.getElementById("imageUpload").addEventListener("change", handleImageUpload);

        // Initial Draw
        draw();