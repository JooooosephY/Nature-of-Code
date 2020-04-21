let v;

function setup() {
  createCanvas(500, 500);
  background(50);

  v = new Vehicle(width/2, height/2);
}

function draw() {
  background(50);

  let target = new p5.Vector(mouseX, mouseY);
  v.seek( target );
  v.update();
  v.display();
}


class Vehicle {
  constructor(x, y) {
    this.pos = new p5.Vector(x, y); // createVector();
    this.vel = new p5.Vector();
    this.acc = new p5.Vector();
    //
    this.angle = 0;

    this.maxDesiredVel = 5; // maxSpeed;
    this.maxSteerForce = 0.01; // maxForce;

    this.brakeRad = 100;
  }
  seek( target ) {
    let desiredVel = p5.Vector.sub(target, this.pos);
    let distance = desiredVel.mag();
    desiredVel.normalize();
    desiredVel.mult(this.maxDesiredVel);

    /*
    if (distance > this.brakeRad) {
      desiredVel.mult(this.maxDesiredVel);
    } else {
      let mappedVel = map(distance, 0, this.brakeRad, 0, this.maxDesiredVel);
      desiredVel.mult(mappedVel);
    }
    */

    let steerForce = p5.Vector.sub(desiredVel, this.vel);
    steerForce.limit(this.maxSteerForce);
    this.applyForce( steerForce );
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    //
    this.angle = this.vel.heading(); // ***
  }
  applyForce( f ) {
    let force = f.copy();
    this.acc.add( force );
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate( this.angle );
    noStroke();
    fill(255);
    triangle(0, 0, -30, 10, -30, -10);

    noFill();
    stroke(0, 0, 255);
    ellipse(0, 0, this.brakeRad*2, this.brakeRad*2);
    pop();
  }
}



































// :D
