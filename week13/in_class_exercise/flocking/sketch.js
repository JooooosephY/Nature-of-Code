let boids = [];

function setup() {
  createCanvas(500, 500);
  background(0);

  for (let i=0; i<100; i++) {
    boids.push( new Boid(width/2 + random(-20, 20), height/2 + random(-20, 20)) );
  }
}

function draw() {
  background(0);
  for (let i=0; i<boids.length; i++) {
    let b = boids[i];

    // b.separate( boids );
    // b.cohesion( boids );
    // b.align( boids );
    b.flock( boids );
    //b.seekPos( createVector(mouseX, mouseY) );

    b.update();
    b.reappear();
    b.display();
  }
}


class Flock {

}

class Boid {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.angle = 0;

    this.maxSpeed = 5;    // max desired vel
    this.maxForce = 0.02;  // max steering force

    this.separateDistance = 30;
    this.neighborDistance = 50;
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
  flock( others ) {
    let sepaForce = this.separate( others );
    let coheForce = this.cohesion( others );
    let alignForce = this.align( others );

    sepaForce.mult(1.5);
    coheForce.mult(0.5);
    alignForce.mult(1.0);

    this.applyForce(sepaForce);
    this.applyForce(coheForce);
    this.applyForce(alignForce);
  }
  separate( others ) {
    let vector = createVector(); // empty for now
    let count = 0;

    for (let i=0; i<others.length; i++) {
      let other = others[i];
      let distance = this.pos.dist( other.pos );
      if (distance > 0 && distance < this.separateDistance) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(distance);
        // let's get the sum first!
        vector.add(diff); // sum
        count++;
      }
    }
    // let's get the average then!
    if (count > 0) {
      vector.div(count); // avg
    }

    if (vector.mag() > 0) {
      // vector.mult(this.maxSpeed * 10); // try this!
      vector.setMag(this.maxSpeed); // desiredVel
      vector.sub(this.vel); // steerForce
      vector.limit(this.maxForce);
    }
    //this.applyForce(vector);
    return vector;
  }
  cohesion( others ) {
    let position = createVector(); // empty
    let count = 0;
    for (let i=0; i<others.length; i++) {
      let other = others[i];
      let distance = this.pos.dist( other.pos );
      if (distance > 0 && distance < this.neighborDistance) {
        position.add( other.pos ); // sum
        count++;
      }
    }
    if (count > 0) {
      position.div(count); // avg
      return this.seek(position);
    }
    return position;
  }
  align( others ) {
    let velocity = createVector(); // empty
    let count = 0;
    for (let i=0; i<others.length; i++) {
      let other = others[i];
      let distance = this.pos.dist( other.pos );
      if (distance > 0 && distance < this.neighborDistance) {
        velocity.add(other.vel); // sum
        count++;
      }
    }
    if( count > 0 ) {
      velocity.div(count); // avg
      velocity.setMag(this.maxSpeed);

      let steerForce = p5.Vector.sub(velocity, this.vel);
      steerForce.limit(this.maxForce);
      return steerForce;
      //this.applyForce( steerForce );
    }
    return velocity;
  }
  seek( targetPos ) {
    let desiredVel = p5.Vector.sub(targetPos, this.pos);
    desiredVel.setMag(this.maxSpeed);

    let steerForce = p5.Vector.sub(desiredVel, this.vel);
    steerForce.limit(this.maxForce);
    return steerForce;
    // this.applyForce( steerForce );
  }
  seekObj( targetObj ) {
    let desiredVel = p5.Vector.sub(targetObj.pos, this.pos);
    desiredVel.setMag(this.maxSpeed);

    let steerForce = p5.Vector.sub(desiredVel, this.vel);
    steerForce.limit(this.maxForce);
    this.applyForce( steerForce );
  }
  seekPos( targetPos ) {
    let desiredVel = p5.Vector.sub(targetPos, this.pos);
    desiredVel.setMag(this.maxSpeed);

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
    triangle(0, 0, -15, 5, -15, -5);
    pop();
  }
}















//
