let pSystems = [];

function setup() {
  createCanvas(500, 500);
  background(50);

  pSystems.push( new ParticleSystem(width/2, height/2) );
  pSystems.push( new ParticleSystem(width/2, height/2) );
  pSystems.push( new ParticleSystem(width/2, height/2) );
  pSystems.push( new ParticleSystem(width/2, height/2) );
  pSystems.push( new ParticleSystem(width/2, height/2) );
}

function draw() {
  background(50);

  for (let i=0; i<pSystems.length; i++) {
    let ps = pSystems[i];
    ps.generate();
    ps.display();
    ps.limitParticles(200);
    ps.updatePosition(mouseX, mouseY);
  }
}



class Particle {
  constructor(_pos) {
    this.pos = _pos.copy();
    this.vel = new p5.Vector();
    this.acc = new p5.Vector();
    this.mass = random(2, 5);
    this.rad = this.mass;
    this.lifespan = 1.0; // 100%
    this.lifeReduction = random(0.001, 0.007);
    this.isDone = false;
  }
  setVelocity( _vel ) {
    this.vel = _vel.copy();
    return this; // ***
  }
  update() {
    // pos
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    // rotate the vel vector
    this.vel.rotate(0.05);
    // size
    this.rad = this.mass;
  }
  live() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0.0) {
      this.lifespan = 0.0;
      this.isDone = true;
    }
  }
  slowDown() {
    this.vel.mult(0.98);
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    scale(this.lifespan);
    //fill(255);
    //noStroke();
    ellipse(0,0, this.rad*2, this.rad*2);
    pop();
  }
  run() {
    this.update();
    this.display();
  }
}


class ParticleSystem {
  constructor(x, y) {
    this.pos = new p5.Vector(x, y);
    this.particles = [];
    this.clr = color(random(255),random(255),random(255));
    this.scl = random(0.5, 2.5);
  }
  updatePosition(x, y) {
    this.pos = new p5.Vector(x, y);
  }
  generate() {
    let p = new Particle( new p5.Vector(0, 0) );
    p.setVelocity( new p5.Vector(random(-4,4),random(-4,4)) );
    this.particles.push( p );
  }
  limitParticles( num ) {
    // reduce the number of particles if it's done
    for (let i = this.particles.length-1; i >= 0; i--) {
      let p = this.particles[i];
      if (p.isDone) {
        this.particles.splice(i, 1);
      }
    }
    // limit the number of the particles
    while (this.particles.length > num) {
      this.particles.splice(0, 1);
    }
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    scale(this.scl);
    //rotate(frameCount * 0.01);

    // update and display
    noStroke();
    fill(this.clr);
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      p.slowDown();
      p.update();
      p.live();
      p.display();
    }
    pop();
  }
}

















// :D
