const RESOLUTION = 40;
let rows, cols;
let angles = [];
let vehicles = [];


function setup() {
  createCanvas(380, 500);
  background(50);

  cols = ceil(width / RESOLUTION);
  rows = ceil(height / RESOLUTION);

  for (let i=0; i<100; i++) {
    vehicles.push( new Vehicle(random(width), random(height)) );
  }
}

function draw() {
  //background(50);

  // flow field
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {

      let x = c * RESOLUTION;
      let y = r * RESOLUTION;

      let freqX = x * 0.001 + frameCount * 0.001;
      let freqY = y * 0.001 + frameCount * 0.001;
      let noiseValue = noise(freqX, freqY); // range 0 to 1
      let angleFlowField = map(noiseValue, 0, 1, 0, TWO_PI);

      let sinValue = sin(frameCount * 0.01) * PI/6;
      let vector = createVector(mouseX - x, mouseY - y);
      let angleMouse = vector.rotate(PI/2 + sinValue).heading();

      let index = c + r * cols;
      //let index = x + y * width;
      let angle = angleFlowField * 0.0 + angleMouse * 1.0;
      angles[index] = angle;

      /*
      stroke(255);
      fill(0);
      rect(x, y, RESOLUTION, RESOLUTION);
      push();
      translate(x + RESOLUTION/2, y + RESOLUTION/2);
      rotate(angle);
      stroke(255);
      line(0, 0, RESOLUTION/2, 0);
      pop();
      */
    }
  }

  // update and display the vehicles
  for (let i=0; i<vehicles.length; i++) {
    let v = vehicles[i];
    /*
    let mouseVec = createVector(mouseX, mouseY);
    let centerVec = createVector(width/2, height/2);
    let vec = p5.Vector.sub(mouseVec, centerVec);
    v.flow( vec.heading() );
    */

    let c = floor(v.pos.x / RESOLUTION);
    let r = floor(v.pos.y / RESOLUTION);
    let index = c + r * cols;

    v.flow( angles[index] );
    /*
    for (let j=0; j<vehicles.length; j++) {
      let otherV = vehicles[j];
      if (i != j) {
        v.avoid( otherV );
      }
    }
    */
    v.update();
    v.reappear();
    v.display();
  }
}


class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.angle = 0;

    this.maxSpeed = 1;    // max desired vel
    this.maxForce = 0.05;  // max steering force

    this.detectRad = 80;

    this.foldingVel = random(0.03, 0.08);
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
  avoid( targetObj ) {
    let desiredVel = p5.Vector.sub(targetObj.pos, this.pos);
    let distance = desiredVel.mag();
    desiredVel.normalize();
    if(distance < this.detectRad) {
      let speed = map(distance, 0, this.detectRad, this.maxSpeed, 0);
      desiredVel.mult(speed * -1); // flip the vel
      let steerForce = p5.Vector.sub(desiredVel, this.vel);
      steerForce.limit(this.maxForce * 0.7); //***
      this.applyForce( steerForce );
    }
  }
  seek( targetObj ) {
    let desiredVel = p5.Vector.sub(targetObj.pos, this.pos);
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
  seekVec( target ) {
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
  reappear() {
    if (this.pos.x < 0) {
      this.pos.x = width;
    }
    else if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    }
    else if (this.pos.y > height) {
      this.pos.y = 0;
    }
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate( this.angle );
    noStroke();
    fill(255);

    let freq = frameCount * this.foldingVel;
    let amp = 5;
    let sinValue = sin(freq) * amp;

    //triangle(0, 0, -15, sinValue, -15, -sinValue);
    ellipse(0, 0, 1, 1);
    //stroke(0, 0, 255);
    //noFill();
    //ellipse(0, 0, this.brakeRad*2, this.brakeRad*2);
    pop();
  }
}

















// :D
