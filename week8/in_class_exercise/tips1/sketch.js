let particles = [];


function setup() {
  createCanvas(400, 400);
  background(50);
}

function draw() {
  background(50);

  let p = new Particle(width/2, height/2, 10);
  p.position( 100, 100 )
   .velocity( random(-2,2), random(-2,2) )
   .setMass(5);
  particles.push( p );

  for (let i=0; i<particles.length; i++) {
    let p = particles[i];
    p.update();
    p.display();
  }
}


class Particle {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.mass = m;
    this.rad = this.mass * 1.0;
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
    return this;
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    //this.rad = this.mass * 1.0;
  }
  display() {
    push();
    stroke(255);
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.rad*2, this.rad*2);
    pop();
  }
}
