let particles = [];

function setup() {
  createCanvas(500, 600);
  background(0);
  for (let i=0; i<100; i++) {
    particles.push( new Particle(width/2, height) );
  }
}

function draw() {
  background(0, 30);

  for (let i=0; i<particles.length; i++) {
    let p = particles[i];

    // bad example!
    if (mouseIsPressed) {
      //p.acc = createVector(1, 0);
    }

    // gravity
    p.acc = createVector(0, 0.1);

    p.update();
    p.display();
  }
}

function keyPressed() {
  for (let i=0; i<particles.length; i++) {
    let p = particles[i];
    p.explode();
  }
}


class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector( 0, -10 );
    this.acc = createVector();
    this.size = random(3, 10);
    this.isExploded = false;
  }
  update() {
    // acc -> vel -> pos
    this.vel.add( this.acc );
    this.pos.add( this.vel ); // this.x += this.xSpd;
    this.acc.mult(0); // release

    if (this.isExploded) {
      this.vel.mult(0.80);
    }
  }
  explode() {
    let angle = random(TAU);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(15);
    this.isExploded = true;
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(255);
    noStroke();
    ellipse(0, 0, this.size, this.size);
    pop();
  }
}





















//
