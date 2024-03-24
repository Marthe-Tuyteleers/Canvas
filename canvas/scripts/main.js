
    // // Initialize canvas
    // const canvas = document.getElementById('canvas');
    // const ctx = canvas.getContext('2d');
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    // // Create stars
    // const stars = [];
    // const numStars = 100;
    // for (let i = 0; i < numStars; i++) {
    //     stars.push({
    //         x: Math.random() * canvas.width,
    //         y: Math.random() * canvas.height,
    //         radius: Math.random() * 2 + 1,
    //         vx: Math.random() * 0.5 - 0.25, // Adjusted velocity
    //         vy: Math.random() * 0.5 - 0.25, // Adjusted velocity
    //         color: randomColor() // Random initial color
    //     });
    // }

    // // Update function
    // function update() {
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);

    //     for (let i = 0; i < stars.length; i++) {
    //         const star = stars[i];

    //         // Move stars
    //         star.x += star.vx;
    //         star.y += star.vy;

    //         // Bounce off edges
    //         if (star.x < 0 || star.x > canvas.width) {
    //             star.vx *= -1;
    //         }
    //         if (star.y < 0 || star.y > canvas.height) {
    //             star.vy *= -1;
    //         }

    //         // Twinkle effect: Change color randomly
    //         if (Math.random() < 0.01) { // Adjust the probability for more or less twinkling
    //             star.color = randomColor();
    //         }

    //         // Draw star
    //         ctx.beginPath();
    //         ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    //         ctx.fillStyle = star.color;
    //         ctx.fill();
    //     }
    // }

    // // Function to generate random color
    // function randomColor() {
    //     const r = Math.floor(Math.random() * 256);
    //     const g = Math.floor(Math.random() * 256);
    //     const b = Math.floor(Math.random() * 256);
    //     return `rgb(${r},${g},${b})`;
    // }

    // // Mouse move event listener
    // canvas.addEventListener('mousemove', function(event) {
    //     const mouseX = event.clientX;
    //     const mouseY = event.clientY;

    //     for (let i = 0; i < stars.length; i++) {
    //         const star = stars[i];

    //         const dx = mouseX - star.x;
    //         const dy = mouseY - star.y;
    //         const distance = Math.sqrt(dx * dx + dy * dy);

    //         // Move stars away from mouse
    //         if (distance < 100) {
    //             star.vx = dx / distance * 0.5; // Adjusted velocity
    //             star.vy = dy / distance * 0.5; // Adjusted velocity
    //         }
    //     }
    // });

    // // Animation loop
    // function animate() {
    //     update();
    //     requestAnimationFrame(animate);
    // }
    // animate();
    
      // Initialize canvas
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  
      // Array to store shapes
      const shapes = [];
  
      // Mouse tracking variables
      let isMouseDown = false;
      let mouseX = 0;
      let mouseY = 0;
      let grabbedShape = null;
  
      // Gravity variables
      const gravity = 0.1; // Acceleration due to gravity
      const friction = 0.99; // Friction to slow down shapes
  
      // Event listeners for mouse interactions
      canvas.addEventListener('mousedown', (event) => {
          isMouseDown = true;
          mouseX = event.clientX;
          mouseY = event.clientY;
          
          // Check if mouse is over any shape
          for (let i = 0; i < shapes.length; i++) {
              const shape = shapes[i];
              const dx = shape.x - mouseX;
              const dy = shape.y - mouseY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance <= shape.radius) {
                  grabbedShape = shape;
                  grabbedShape.isPickedUp = true;
                  break;
              }
          }
      });
  
      canvas.addEventListener('mouseup', () => {
          isMouseDown = false;
          if (grabbedShape) {
              grabbedShape.isPickedUp = false;
              grabbedShape = null;
          }
      });
  
      canvas.addEventListener('mousemove', (event) => {
          if (isMouseDown && grabbedShape) {
              mouseX = event.clientX;
              mouseY = event.clientY;
          }
      });
  
      // Shape class
      class Shape {
          constructor(x, y, radius, color) {
              this.x = x;
              this.y = y;
              this.radius = radius;
              this.color = color;
              this.velocityX = 0;
              this.velocityY = 0;
              this.isPickedUp = false;
          }
  
          draw() {
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
              ctx.fillStyle = this.color;
              ctx.fill();
          }
  
          update() {
              if (this.isPickedUp) {
                  this.x = mouseX;
                  this.y = mouseY;
              } else {
                  this.velocityY += gravity;
                  this.velocityX *= friction;
                  this.velocityY *= friction;
                  
                  // Resolve collisions with other shapes
                  for (let i = 0; i < shapes.length; i++) {
                      const otherShape = shapes[i];
                      if (otherShape !== this) {
                          const dx = otherShape.x - this.x;
                          const dy = otherShape.y - this.y;
                          const distance = Math.sqrt(dx * dx + dy * dy);
                          const minDistance = this.radius + otherShape.radius;
                          
                          if (distance < minDistance) {
                              const angle = Math.atan2(dy, dx);
                              const targetX = this.x + Math.cos(angle) * minDistance;
                              const targetY = this.y + Math.sin(angle) * minDistance;
                              const ax = (targetX - otherShape.x) * 0.1;
                              const ay = (targetY - otherShape.y) * 0.1;
                              this.velocityX -= ax;
                              this.velocityY -= ay;
                              otherShape.velocityX += ax;
                              otherShape.velocityY += ay;
                          }
                      }
                  }
              }
              this.x += this.velocityX;
              this.y += this.velocityY;
  
              // Bounce off floor
              if (this.y + this.radius > canvas.height) {
                  this.y = canvas.height - this.radius;
                  this.velocityY *= -0.9; // Bounce back with some loss of energy
              }
  
              // Bounce off walls
              if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                  this.velocityX *= -1;
              }
  
              this.draw();
          }
      }
  
      // Function to generate pastel colors
      function generatePastelColor() {
          const r = Math.floor(Math.random() * 200 + 55);
          const g = Math.floor(Math.random() * 200 + 55);
          const b = Math.floor(Math.random() * 200 + 55);
          return `rgb(${r},${g},${b})`;
      }
  
      // Create random shapes
      for (let i = 0; i < 10; i++) {
          const radius = Math.random() * 30 + 10;
          const x = Math.random() * (canvas.width - radius * 2) + radius;
          const y = Math.random() * (canvas.height - radius * 2) + radius;
          const color = generatePastelColor();
          const shape = new Shape(x, y, radius, color);
          let overlapping = false;
          for (let j = 0; j < shapes.length; j++) {
              const otherShape = shapes[j];
              const dx = shape.x - otherShape.x;
              const dy = shape.y - otherShape.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < shape.radius + otherShape.radius) {
                  overlapping = true;
                  break;
              }
          }
          if (!overlapping) {
              shapes.push(shape);
          }
      }
  
      // Animation loop
      function animate() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
  
          shapes.forEach(shape => {
              shape.update();
          });
  
          requestAnimationFrame(animate);
      }
      animate();