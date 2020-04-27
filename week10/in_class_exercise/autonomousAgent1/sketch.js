let vehicles = [];

function setup() {
  createCanvas(400, 400);
  background(50);

  vehicles.push( new Vehicle(width/2, height/2) );
}

function draw() {
  background(50);
  for (let i=0; i<vehicles.length; i++) {
    let v = vehicles[i];
    let mouseVec = createVector(mouseX, mouseY);
    v.seek( mouseVec );
    //let centerVec = createVector(width/2, height/2);
    //let vec = p5.Vector.sub(mouseVec, centerVec);
    //v.flow( vec.heading() );


    v.update();
    v.display();
  }

  //stroke(255, 0, 0);
  //line(width/2, height/2, mouseX, mouseY);
}

class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.angle = 0;

    this.maxSpeed = 5;    // max desired vel
    this.maxForce = 0.1;  // max steering force

    this.detectRad = 80;
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.angle = this.vel.heading();
  }
  applyForce(f) {
    let force = f.copy();
    // no mass yet
    this.acc.add(force);
  }
  seek( target ) {
    let desiredVel = p5.Vector.sub(target, this.pos);
    let distance = desiredVel.mag();

    desiredVel.normalize();
    if(distance > this.detectRad) {
      desiredVel.mult(this.maxSpeed);
    } else {
      let speed = map(distance, 0, this.detectRad, 0, this.maxSpeed);
      desiredVel.mult(speed);
    }

    let steerForce = p5.Vector.sub(desiredVel, this.vel);
    steerForce.limit(this.maxForce);
    this.applyForce( steerForce );
  }
  flow( angle ) {
    let desiredVel = p5.Vector.fromAngle( angle );
    desiredVel.mult(this.maxSpeed);

    let steerForce = p5.Vector.sub(desiredVel, this.vel);
    steerForce.limit(this.maxForce);
    this.applyForce( steerForce );
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate( this.angle );
    noStroke();
    fill(255);
    triangle(0, 0, -15, 5, -15, -5);
    stroke(0, 0, 255);
    noFill();
    ellipse(0, 0, this.brakeRad*2, this.brakeRad*2);
    pop();
  }
}
