
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

        // Draw Wheel
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
                // Draw Image inside the segment
                if (images[items[i]]) {
                    const img = images[items[i]];

                    // Save the context and clip to the slice
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.arc(centerX, centerY, radius, toRad(startDeg), toRad(endDeg));
                    ctx.closePath();
                    ctx.clip();

                    // Draw the image stretched across the slice
                    const imgWidth = radius * 1.5;
                    const imgHeight = radius * 1.5;
                    const sliceCenterX = Math.cos(toRad((startDeg + endDeg) / 2)) * radius * 0.5;
                    const sliceCenterY = Math.sin(toRad((startDeg + endDeg) / 2)) * radius * 0.5;

                    ctx.drawImage(
                        img,
                        centerX - imgWidth / 2 + sliceCenterX,
                        centerY - imgHeight / 2 + sliceCenterY,
                        imgWidth,
                        imgHeight
                    );

                    ctx.restore(); // Restore clipping
                } else {
                    // Draw Text if no image
                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate(toRad((startDeg + endDeg) / 2));

                    ctx.font = `bold 10PX serif`;
                    ctx.fillStyle = "#fff";
                    ctx.fillText(items[i], radius * 0.7, 5);
                    ctx.restore();
                } 
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

        document.getElementById("imageUpload").addEventListener("change", handleImageUpload);

        // Initial Draw
        draw();