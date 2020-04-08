let particles = [];

let debugMode = false; // to GUI

function setup() {
  createCanvas(400, 400);
  background(50);
}

function draw() {
  background(50);

  translate(width/2, height/2);
  //rotate(frameCount * 0.02);

  // generate particles
  let p = new Particle(0, 0, 10);
  p.velocity( random(-2,2), random(-2,2) );
  particles.push( p );

  // update & display
  for (let i=0; i<particles.length; i++) {
    let p = particles[i];
    p.update();
    p.live();
    if (debugMode) {
      p.displayDebug();
    } else {
      p.display();
    }


  }

  // limit
  while (particles.length > 300) {
    particles.splice(0, 1); //(index, howMany)
  }

  // remove if it's done!
  for (let i=particles.length-1; i >= 0; i--) {
    let p = particles[i];
    if (p.isDone) {
      particles.splice(i, 1);
    }
  }

  // display the number of partiicles
  fill(255);
  text(particles.length, 10, 20);
}

function keyPressed() {
  debugMode = !debugMode;
}

class Particle {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    //
    this.mass = m;
    this.rad = this.mass * 1.0;
    //
    this.lifespan = 1.0; // 100%
    this.lifeReduction = random(0.005, 0.010);
    this.isDone = false;
  }
  position(x, y) {
    this.pos = createVector(x, y);
    return this;
  }
  velocity(x, y) {
    this.vel = createVector(x, y);
    return this;
  }
  setMass( m ) {
    this.mass = m;
    this.rad = this.mass * 1.0;
    return this;
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    //this.rad = this.mass * 1.0;
  }
  live() {
    this.lifespan -= this.lifeReduction;
    this.lifespan = constrain(this.lifespan, 0.0, 1.0);
    if (this.lifespan <= 0.0) {
      this.isDone = true;
    }
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    scale(this.lifespan);
    stroke(255);
    fill(255);
    ellipse(0, 0, this.rad*2, this.rad*2);
    pop();
  }
  displayDebug() {
    push();
    translate(this.pos.x, this.pos.y);
    scale(this.lifespan);

    //
    stroke(255, 150);
    noFill();
    ellipse(0, 0, this.rad*2, this.rad*2);
    // vector of vel
    let adj = 10;
    stroke(255, 0, 0);
    line(0, 0, this.vel.x * adj, this.vel.y * adj);

    noStroke();
    fill(255);
    text(nf(this.lifespan, 1, 2), 10, 0);
    pop();
  }
}













// :D
