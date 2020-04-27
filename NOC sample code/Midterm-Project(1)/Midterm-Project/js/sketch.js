let particles = [];
let pSystems = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);


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
    // ps.update();
  }

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
  constructor(x,y,rad,r,g,b) {
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.r = r;
    this.g = g;
    this.b = b;
  }

  update(){}

  display(){
    push();
    noFill();
    stroke(this.r,this.g,this.b,40);
    strokeWeight(3.5);
    ellipse(this.x,this.y,this.rad * 2,this.rad * 2);
    pop();
  }
}

class Galaxy{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.rad = random(3,5);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }

  display(){
    fill(this.r,this.g,this.b,random(80,100));
    ellipse(this.x,this.y,this.rad,this.rad);
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
    this.angle+=this.speed;
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
    this.orbitR = 70;
    this.angle = 0;
    this.speed = 0.05;
  }

  update(){
    this.angle += this.speed;
  }

  display(){
    push();
    translate(width/2,height/2);
    fill(219,206,202);
    noStroke();
    ellipse(this.orbitR*cos(this.angle),this.orbitR*sin(this.angle),5,5)
    pop();
  }
}

class Venus extends Particle {
  constructor(_pos) {
    super(_pos);
    this.orbitR = 100;
    this.angle = 0;
    this.speed = 0.05;
  }

  update(){
    this.angle += this.speed;
  }

  display(){
    push();
    translate(width/2,height/2);
    fill(187,183,171);
    noStroke();
    ellipse(this.orbitR*cos(this.angle),this.orbitR*sin(this.angle),10,10)
    pop();
  }
}

class Earth extends Particle {
  constructor(_pos) {
    super(_pos);
    this.orbitR = 130;
    this.angle = 0;
    this.speed = 0.05;
  }

  update(){
    this.angle += this.speed;
  }

  display(){
    push();
    translate(width/2,height/2);
    fill(107,147,214);
    noStroke();
    ellipse(this.orbitR*cos(this.angle),this.orbitR*sin(this.angle),12,12)
    pop();
  }
}

class Mars extends Particle {
  constructor(_pos) {
    super(_pos);
    this.orbitR = 160;
    this.angle = 0;
    this.speed = 0.05;
  }

  update(){
    this.angle += this.speed;
  }

  display(){
    push();
    translate(width/2,height/2);
    fill(193,68,14);
    noStroke();
    ellipse(this.orbitR*cos(this.angle),this.orbitR*sin(this.angle),7,7)
    pop();
  }
}

class Jupiter extends Particle {
  constructor(_pos) {
    super(_pos);
    this.orbitR = 250;
    this.angle = 0;
    this.speed = 0.05;
  }

  update(){
    this.angle += this.speed;
  }

  display(){
    push();
    translate(width/2,height/2);
    fill(200,139,58);
    noStroke();
    ellipse(this.orbitR*cos(this.angle),this.orbitR*sin(this.angle),35,35)
    pop();
  }
}

class Saturn extends Particle {
  constructor(_pos) {
    super(_pos);
    this.orbitR = 340;
    this.angle = 0;
    this.speed = 0.05;
  }

  update(){
    this.angle += this.speed;
  }

  display(){
    push();
    translate(width/2,height/2);
    fill(164,155,14);
    noStroke();
    ellipse(this.orbitR*cos(this.angle),this.orbitR*sin(this.angle),30,30)
    fill(197,171,110);
    ellipse(this.orbitR*cos(this.angle),this.orbitR*sin(this.angle),60,15);
    pop();
  }
}

class Uranus extends Particle {
  constructor(_pos) {
    super(_pos);
    this.orbitR = 420;
    this.angle = 0;
    this.speed = 0.05;
  }

  update(){
    this.angle += this.speed;
  }

  display(){
    push();
    translate(width/2,height/2);
    fill(213,251,252);
    noStroke();
    ellipse(this.orbitR*cos(this.angle),this.orbitR*sin(this.angle),20,20)
    pop();
  }
}

class Neptune extends Particle {
  constructor(_pos) {
    super(_pos);
    this.orbitR = 450;
    this.angle = 0;
    this.speed = 0.05;
  }

  update(){
    this.angle += this.speed;
  }

  display(){
    push();
    translate(width/2,height/2);
    fill(63,84,186);
    noStroke();
    ellipse(this.orbitR*cos(this.angle),this.orbitR*sin(this.angle),20,20)
    pop();
  }
}

class Belt {
  constructor(x,y,r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.angle = 0;
    this.speed = 0.05;
  }

  update(){
    this.angle += this.speed;
  }

  display(){
    push();
    //translate(width/2,height/2);
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
    push();
    translate(width/2,height/2);
    rotate(frameCount/500);
    for (let i = 0; i < this.belts.length; i++) {
      let b = this.belts[i];

      b.display();
    }
    pop();

    push();
    translate(width/2,height/2);
    rotate(frameCount/500);
    for (let i = 0; i < this.belts.length; i++) {
      let b = this.belts[i];

      b.display();
    }
    pop();
  }

  generate() {
    // let p = new Particle( new p5.Vector(0, 0) );
    //draw Galaxy
    for (let i = 0; i < 300; i++) {
      this.particles.push(new Galaxy(random(windowWidth),random(windowHeight)));
    }

    //generate Orbitals
    this.particles.push( new Orbitals(width/2,height/2,70,219,206,202));
    this.particles.push( new Orbitals(width/2,height/2,100,219,206,202));
    this.particles.push( new Orbitals(width/2,height/2,130,219,206,202));
    this.particles.push( new Orbitals(width/2,height/2,160,193,68,14));
    this.particles.push( new Orbitals(width/2,height/2,250,193,68,14));
    this.particles.push( new Orbitals(width/2,height/2,340,197,171,110));
    this.particles.push( new Orbitals(width/2,height/2,420,213,251,252));
    this.particles.push( new Orbitals(width/2,height/2,450,63,84,186));

    // genetate planet
    //SUN
    this.particles.push( new Sun( new p5.Vector(width/2, height/2) ) );

    //Mercury
    this.particles.push( new Mercury( new p5.Vector(width/2+70, height/2) ) );

    //VENUS
    this.particles.push( new Venus( new p5.Vector(width/2+100, height/2) ) );

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
    translate(this.pos.x, this.pos.y);
    //rotate(frameCount * 0.01);

    // update and display
    // noStroke();
    // fill(this.clr);
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      // p.slowDown();
      p.update();
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
