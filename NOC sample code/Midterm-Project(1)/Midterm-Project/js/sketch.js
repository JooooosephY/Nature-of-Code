let particles = [];
let pSystems = [];
let belts1 = [];
let belts2 = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  // draw galaxy background
  for (let i = 0; i < 500; i++) {
    push();
    let size = random(1,3);
    fill(random(255),random(255),random(255),random(20,60));
    ellipse(random(windowWidth),random(windowHeight),size * 2, size * 2);
    pop();
  }

  pSystems.push( new ParticleSystem(0,0) );


  for (let i = 0; i < pSystems.length; i++) {
    let ps = pSystems[i];
    ps.generateBelt();
    ps.generate();
  }

}

function draw() {
  background(0);

  for (let i = 0; i < pSystems.length; i++) {
    let ps = pSystems[i];
    ps.displayBelt();

    ps.display();
  }


  //generate Orbitals
  // let o1 = new Orbitals(width/2,height/2,70);
  // o1.display();
  // let o2 = new Orbitals(width/2,height/2,100);
  // o2.display();
  // let o3 = new Orbitals(width/2,height/2,130);
  // o3.display();
  // let o4 = new Orbitals(width/2,height/2,160);
  // o4.display();
  // let o5 = new Orbitals(width/2,height/2,250);
  // o5.display();
  // let o6 = new Orbitals(width/2,height/2,340);
  // o6.display();
  // let o7 = new Orbitals(width/2,height/2,420);
  // o7.display();
  // let o8 = new Orbitals(width/2,height/2,450);
  // o8.display();


  // let p;
  // if (random(1) < 0.5) {
  //   p = new RectShape( new p5.Vector(width/2, height/2), color(200, 255, 10) );
  // } else {
  //   p = new TriShape( new p5.Vector(width/2, height/2), color(200, 0, 100) );
  // }
  //
  //
  // p.setVelocity( new p5.Vector(random(-3,3),random(-3,3)) );
  // particles.push( p );
  //
  // // update and display
  // for (let i = 0; i < particles.length; i++) {
  //   let p = particles[i];
  //   p.update();
  //   p.updateRotation();
  //   p.display();
  // }
  //

}

class Orbitals {
  constructor(x,y,r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  display(){
    push();
    noFill();
    stroke(255,30);
    strokeWeight(2);
    ellipse(this.x,this.y,this.r * 2,this.r * 2);
    pop();
  }
}


class Particle {
  constructor(_pos) {
    this.pos = _pos.copy();
    this.vel = new p5.Vector();
    this.acc = new p5.Vector();
    this.mass = random(1, 3);
    this.rad = this.mass;
  }
  setVelocity( _vel ) {
    this.vel = _vel.copy();
    return this; // ***
  }
  updateRotation() {}
  update() {
    // pos
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    // this.acc.mult(0);

    // size
    this.rad = this.mass;
  }
  display() {
    push();
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.rad*2, this.rad*2);
    pop();
  }
}

class Sun extends Particle {
  constructor(_pos) {
    super(_pos);
  }

  display(){
    push();
    translate(this.pos.x,this.pos.y);
    fill(255,100,100);
    noStroke();
    ellipse(0,0,80,80)
    pop();
  }
}


class Mercury extends Particle {
  constructor(_pos) {
    super(_pos);
  }

  display(){
    push();
    translate(this.pos.x,this.pos.y);
    fill(219,206,202);
    noStroke();
    ellipse(0,0,5,5)
    pop();
  }
}

class Venus extends Particle {
  constructor(_pos) {
    super(_pos);
  }

  display(){
    push();
    translate(this.pos.x,this.pos.y);
    fill(187,183,171);
    noStroke();
    ellipse(0,0,10,10)
    pop();
  }
}

class Earth extends Particle {
  constructor(_pos) {
    super(_pos);
  }

  display(){
    push();
    translate(this.pos.x,this.pos.y);
    fill(107,147,214);
    noStroke();
    ellipse(0,0,12,12)
    pop();
  }
}

class Mars extends Particle {
  constructor(_pos) {
    super(_pos);
  }

  display(){
    push();
    translate(this.pos.x,this.pos.y);
    fill(193,68,14);
    noStroke();
    ellipse(0,0,7,7)
    pop();
  }
}

class Jupiter extends Particle {
  constructor(_pos) {
    super(_pos);
  }

  display(){
    push();
    translate(this.pos.x,this.pos.y);
    fill(200,139,58);
    noStroke();
    ellipse(0,0,35,35)
    pop();
  }
}

class Saturn extends Particle {
  constructor(_pos) {
    super(_pos);
  }

  display(){
    push();
    translate(this.pos.x,this.pos.y);
    fill(164,155,14);
    noStroke();
    ellipse(0,0,30,30)
    fill(197,171,110);
    ellipse(0,0,60,15);
    pop();
  }
}

class Uranus extends Particle {
  constructor(_pos) {
    super(_pos);
  }

  display(){
    push();
    translate(this.pos.x,this.pos.y);
    fill(213,251,252);
    noStroke();
    ellipse(0,0,20,20)
    pop();
  }
}

class Neptune extends Particle {
  constructor(_pos) {
    super(_pos);
  }

  display(){
    push();
    translate(this.pos.x,this.pos.y);
    fill(63,84,186);
    noStroke();
    ellipse(0,0,20,20)
    pop();
  }
}

class Belt {
  constructor(x,y,r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  display(){
    push();
    translate(width/2,height/2);
    fill(255);
    noStroke();
    ellipse(this.x,this.y,this.r,this.r);
    pop();
  }
}

class ParticleSystem {
  constructor(x, y) {
    this.pos = new p5.Vector(x, y);
    this.particles = [];
    this.belts = [];
    // this.clr = color(random(255),random(255),random(255));
    // this.scl = random(0.8, 1.5);
  }
  // updatePosition(x, y) {
  //   this.pos = new p5.Vector(x, y);
  // }
  generateBelt(){
    for (let i = 0; i < 300; i++) {
      let x = sin(i)*random(180,220);
      let y = cos(i)*random(180,220);
      let r = random(1,3)
      this.belts.push(new Belt(x,y,r) ) ;
    }

    for (let i = 0; i < 600; i++) {
      let x = sin(i)*random(470,500);
      let y = cos(i)*random(470,500);
      let r = random(1,3)
      this.belts.push(new Belt(x,y,r) ) ;
    }
  }

  displayBelt(){
    for (let i = 0; i < this.belts.length; i++) {
      let b = this.belts[i];
      b.display();
    }

    for (let i = 0; i < this.belts.length; i++) {
      let b = this.belts[i];
      b.display();
    }
  }

  generate() {
    // let p = new Particle( new p5.Vector(0, 0) );
    //generate Orbitals
    this.particles.push( new Orbitals(width/2,height/2,70) );
    this.particles.push( new Orbitals(width/2,height/2,100) );
    this.particles.push( new Orbitals(width/2,height/2,130) );
    this.particles.push( new Orbitals(width/2,height/2,160) );
    this.particles.push( new Orbitals(width/2,height/2,250) );
    this.particles.push( new Orbitals(width/2,height/2,340) );
    this.particles.push( new Orbitals(width/2,height/2,420) );
    this.particles.push( new Orbitals(width/2,height/2,450) );

    // genetate planet
    //SUN
    this.particles.push( new Sun( new p5.Vector(width/2, height/2) ) );

    //Mercury
    this.particles.push( new Mercury( new p5.Vector(width/2+70, height/2) ) );

    //VENUS
    this.particles.push( new Venus( new p5.Vector(width/2+130, height/2) ) );

    //EARTH
    this.particles.push( new Earth( new p5.Vector(width/2+130, height/2) ) );

    //MARS
    this.particles.push( new Mars( new p5.Vector(width/2+160, height/2) ) );

    //JUPITER
    this.particles.push( new Jupiter( new p5.Vector(width/2+250, height/2) ) );

    //SATURN
    this.particles.push( new Saturn( new p5.Vector(width/2+340, height/2) ) );

    // URANUS
    this.particles.push( new Uranus( new p5.Vector(width/2+420, height/2) ) );

    // NEPTUNE
    this.particles.push( new Neptune( new p5.Vector(width/2+450, height/2) ) );





    // p.setVelocity( new p5.Vector(random(-4,4),random(-4,4)) );

  }
  // limitParticles( num ) {
  //   // reduce the number of particles if it's done
  //   for (let i = this.particles.length-1; i >= 0; i--) {
  //     let p = this.particles[i];
  //     if (p.isDone) {
  //       this.particles.splice(i, 1);
  //     }
  //   }
    // // limit the number of the particles
    // while (this.particles.length > num) {
    //   this.particles.splice(0, 1);
    // }
  // }

  display() {
    push();
    //translate(this.pos.x, this.pos.y);
    //rotate(frameCount * 0.01);

    // update and display
    // noStroke();
    // fill(this.clr);
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      // p.slowDown();
      // p.update();
      // p.live();
      p.display();
    }
    pop();
  }
}

// class TriShape extends Particle {
//   constructor(_pos, _color) {
//     super(_pos); // call the superclass' constructor!
//     this.clr = _color;
//     this.angle = 0;
//     this.angleVel = random(-0.05, 0.05);
//   }
//   updateRotation() {
//     this.angle += this.angleVel;
//   }
//   // this overrides the superclass display function - polymorphism!
//   display() {
//     push();
//     translate(this.pos.x, this.pos.y);
//     rotate(this.angle);
//     fill(this.clr);
//     noStroke();
//     triangle(10, 0, -10, 7, -10, -7);
//     pop();
//   }
// }
//
// class RectShape extends Particle {
//   constructor(_pos, _color) {
//     super(_pos); // call the superclass' constructor!
//     this.clr = _color;
//     this.angle = 0;
//     this.angleVel = random(-0.05, 0.05);
//   }
//   updateRotation() {
//     this.angle += this.angleVel;
//   }
//   // this overrides the superclass display function - polymorphism!
//   display() {
//     push();
//     translate(this.pos.x, this.pos.y);
//     rotate(this.angle);
//     fill(this.clr);
//     noStroke();
//     rect(0, 0, this.rad*2, this.rad*2);
//     pop();
//   }
// }





























// :D
