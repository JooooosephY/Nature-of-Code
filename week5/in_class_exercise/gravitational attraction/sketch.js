let p1, p2;

function setup() {
  createCanvas(400, 400);
  background(50);

  p1 = new Particle(100, 100, 5);
  p1.vel = createVector(-5, 15);
}

function draw() {
  background(50);

  let mousePos = createVector(mouseX, mouseY);
  let centerPos = createVector(width/2, height/2);

  p1.attractTo( centerPos );
  p1.update();
  p1.display();
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

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    //
    //this.vel.mult(0.70);
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add( force );
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(255);
    ellipse(0, 0, this.rad*2, this.rad*2);
    pop();
  }
}










// :D :P
