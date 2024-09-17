let fireworks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a new fireworks object every second
  setInterval(() => {
    fireworks.push(new Firework());
  }, 1000);

  // Show the popup after 3 seconds
  setTimeout(() => {
    createPopup();
  }, 3000);
}



function draw() {
  background(0, 25); // Fade the background slightly to create trails
  // Update and display each firework
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    // Remove the firework if it has finished exploding
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}

class Firework {
  constructor() {
    this.x = random(width);
    this.y = height;
    this.exploded = false; // Flag to track if the firework has exploded
    this.explosionTimer = 0; // Timer to control the explosion duration

    // Initial velocity for the missile phase
    this.vx = random(-1, 1);
    this.vy = random(-20, -15); // Higher initial velocity for missile effect
    this.explosionRadius = random(50, 150);
    this.explosionColor = color(random(255), random(255), random(255));

    // Arrays to store points for the missile and explosion trails
    this.missileTrail = [];
    this.explosionTrail = [];
  }

  update() {
    if (!this.exploded) {
      // Update missile position
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.5; // Add gravity to make the missile curve down
      this.missileTrail.push(createVector(this.x, this.y));

      // Once the missile reaches its peak, explode
      if (this.vy >= 0) {
        this.explode();
      }
    } else {
      // Update explosion particles
      for (let particle of this.explosionTrail) {
        particle.update();
      }
      this.explosionTimer++;
    }
  }

  show() {
    if (!this.exploded) {
      // Draw missile trail
      noFill();
      strokeWeight(3);
      stroke(255, 150); // Semi-transparent trail
      beginShape();
      for (let pt of this.missileTrail) {
        vertex(pt.x, pt.y);
      }
      endShape();
    } else {
      // Draw explosion particles
      for (let particle of this.explosionTrail) {
        particle.show();
      }
    }
  }

  explode() {
    // Create explosion particles
    for (let i = 0; i < 100; i++) {
      let angle = random(TWO_PI);
      let speed = random(2, 10);
      this.explosionTrail.push(new Particle(this.x, this.y, angle, speed, this.explosionRadius, this.explosionColor));
    }
    this.exploded = true;
  }

  done() {
    // Remove the firework if explosion duration exceeds a certain threshold
    return this.exploded && this.explosionTimer > 60; // Adjust the threshold as needed
  }
}

class Particle {
  constructor(x, y, angle, speed, explosionRadius, explosionColor) {
    this.x = x;
    this.y = y;
    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;
    this.explosionRadius = explosionRadius;
    this.explosionColor = explosionColor;
    this.alpha = 255;
    this.size = random(2, 8);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }

  show() {
    noStroke();
    fill(this.explosionColor.levels[0], this.explosionColor.levels[1], this.explosionColor.levels[2], this.alpha);
    ellipse(this.x, this.y, this.size, this.size); // Using ellipses for simplicity, you can use custom shapes here
  }
}
