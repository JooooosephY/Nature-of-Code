const C_GRAVITY = 5;
let particles = [];



// JSON
let params = {
  colorR: 255,
  colorG: 0,
  colorB: 0,
  vecReduce: 0.98
}
const gui = new dat.GUI();
//gui.remember(params);
gui.add(params, 'colorR', 0, 255);
gui.add(params, 'colorG').max(0).min(255).step(5);
gui.add(params, 'colorB').listen();
gui.add(params, 'vecReduce');




function setup() {
  createCanvas(700, 600);
  background(50);
}

function draw() {
  background(50);
  params.colorR = 100;
  params.colorB = 100;

  for(let a=0; a<particles.length; a++) {
    let p = particles[a];
    for (let b=0; b<particles.length; b++) {
      let other = particles[b];
      if (a != b) {
        p.checkCollision( other );
        //p.applyGAttraction( other );

        //p.applyRepulsion( other );
      }
    }
    p.checkEdges();
    p.update();
    p.display();
  }

}


function mousePressed() {
  let p = new Particle(random(width), random(height), random(3, 30) );
  p.vel = createVector(random(-3, 3), random(-3, 3));
  particles.push( p );
}


class Particle {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.mass = m;
    this.rad = m;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    // this.color = color(255, 0, 0);
  }

  checkCollision(other) {
    let vector = p5.Vector.sub(other.pos, this.pos);
    let distance = vector.mag();
    if (distance < this.rad + other.rad) {
      //true
      this.r = 255;
      this.g = 0;
      this.b = 0;

      let force = createVector();

      // this
      force = vector.copy();
      force.mult(-1);
      force.normalize();
      force.mult( other.vel.mag() * 3 );
      //force.mult(0.1);
      this.applyForce( force );

      //other
      force = vector.copy();
      force.normalize();
      force.mult( this.vel.mag() * 3 );
      other.applyForce( force );

    } else {
      this.r = 255;
      this.g = 255;
      this.b = 255;
    }
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
    this.vel.mult(params.vecReduce);
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
    //fill(this.r, this.g, this.b, 150);
    fill(params.colorR, params.colorG, params.colorB);
    ellipse(0, 0, this.rad*2, this.rad*2);
    pop();
  }
}










// :D :P
