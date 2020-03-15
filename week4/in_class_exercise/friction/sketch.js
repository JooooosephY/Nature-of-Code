const C_GRAVITY = 1;
const C_FRICTION = 10;
const C_RESISTANCE = 0.05;

let particles = [];


function setup() {
  createCanvas(600, 600);
  background(0);
  particles.push( new Particle(width/2 - 150, height/2, random(1,25)) );
  particles.push( new Particle(width/2, height/2, random(1,25)) );
  particles.push( new Particle(width/2 + 150, height/2, random(1,25)) );
}

function draw() {
  background(0);

  for (let i=0; i<particles.length; i++) {
    let p = particles[i];

    let gravity = createVector(0, C_GRAVITY * p.mass);
    let wind = createVector(random(0.1, 1), 0);
    p.applyForce( gravity );
    //p.applyForce( wind );

    // friction
    let friction = p5.Vector.mult(p.vel, -1); // flip!
    friction.normalize(); // we only have the direction of the vector!
    friction.mult( C_FRICTION );
    friction.limit( p.vel.mag() ); // ***
    //p.applyForce( friction );

    // resistance
    let resistance = p5.Vector.mult(p.vel, -1); // flip!
    resistance.normalize(); // direction
    let speed = p.vel.mag();
    let magnitude = speed * speed * C_RESISTANCE;
    resistance.mult(magnitude);
    p.applyForce( resistance );

    p.update();
    p.checkEdges();
    p.display();
  }
}



class Particle {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector();
    if (m < 1 ) m = 1;

    this.mass = m; // this cannot be 0 !!
    this.rad = m * 2;
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  applyForce( f ) {
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
    if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.y *= -1;
    }
    /*
    else if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y *= -1;
    }
    */
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    ellipse(0, 0, this.rad*2, this.rad*2);
    pop();
  }
}
