const C_GRAVITY = 5;

let particles = [];

function setup() {
  createCanvas(700, 600);
  background(50);
}

function draw() {
  background(50);

  for(let a=0; a<particles.length; a++) {
    let p = particles[a];
    for (let b=0; b<particles.length; b++) {
      let other = particles[b];
      if (a != b) {
        //p.applyGAttraction( other );
        p.applyRepulsion( other );
      }
    }
    p.checkEdges();
    p.update();
    p.display();
  }
}

function mousePressed() {
  particles.push( new Particle(random(width), random(height), random(3, 30)) );
}

class Particle {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.mass = m;
    this.rad = m;
  }

  attractTo(target) {
    let f = p5.Vector.sub(target, this.pos);
    //f.normalize(); // get the direction
    //f.mult(1); // mag is now 5px.
    f.mult(0.05);
    this.applyForce( f );
  }

  applyGAttraction(other) {
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag(); // = this.pos.distance( other.pos );
    let gMag = (C_GRAVITY * this.mass * other.mass) / (distance * distance); // mag
    f.normalize(); // direction
    f.mult(gMag);
    this.applyForce( f );
  }
  applyRepulsion(other) {
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag();
    let gMag = (C_GRAVITY * this.mass * other.mass) / (distance * distance);
    f.normalize();
    f.mult(-gMag);
    this.applyForce( f );
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    //
    //this.vel.mult(0.97);
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add( force );
  }
  checkEdges() {
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x *= -1;
    }
    else if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x *= -1;
    }
    if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y *= -1;
    }
    else if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.y *= -1;
    }
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    stroke(255);
    fill(255, 150);
    ellipse(0, 0, this.rad*2, this.rad*2);
    pop();
  }
}










// :D :P
