const C_GRAVITY = 0.1;
let fSystems = [];
let center = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  fSystems.push(new FireworkSystem(width/5, height/5, 0, 80));
  fSystems.push(new FireworkSystem(width/5, height* 4/5, 0, 80));
  fSystems.push(new FireworkSystem(width * 4/5, height/5, 0, 80));
  fSystems.push(new FireworkSystem(width * 4/5, height * 4/5, 0, 80));
}

function draw() {
  background(0, 40);

  for (let i=0; i<fSystems.length; i++) {
    let fs = fSystems[i];
    fs.generate();
    fs.display();
    fs.limitParticles(500);
  }
}

function keyPressed(){
  if (key = ' '){
    if (center) {
      for (let i = fSystems.length - 1; i >= 0; i -- ){
        fSystems.splice(0,1);
      }
      fSystems.push(new FireworkSystem(width/5, height/5, 0, 80));
      fSystems.push(new FireworkSystem(width/5, height* 4/5, 0, 80));
      fSystems.push(new FireworkSystem(width * 4/5, height/5, 0, 80));
      fSystems.push(new FireworkSystem(width * 4/5, height * 4/5, 0, 80));
      center = false;
    }else{
      for (let i = fSystems.length - 1; i >= 0; i -- ){
        fSystems.splice(0,1);
      }
      fSystems.push(new FireworkSystem(width/2, height/2, 0, 30));
      fSystems.push(new FireworkSystem(width/2, height/2, PI, 30));
      center = true;
    }
  }
}



class Particle {
  constructor(_pos) {
    this.pos = _pos.copy();
    this.vel = createVector();
    this.acc = createVector();
    this.mass = random(3, 5);
    this.rad = this.mass;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.isExploded = false;

    this.lifespan = 1.0; // 100%
    this.lifeReduction = random(0.001, 0.007);
    this.isDone = false;
  }

  setVelocity( _vel ) {
    this.vel = _vel.copy();
    return this;
  }

  update() {
    // pos
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // size
    this.rad = this.mass;
  }

  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add( force );
  }

  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0.0) {
      this.lifespan = 0.0;
      this.isDone = true;
    }
  }

  slowDown() {
    this.vel.mult(0.98);
  }

  display() {}

  explode(){
    let angle = random(TAU);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(random(5, 10));
    this.isExploded = true;
  }

}

class Circle_Fire extends Particle{
  constructor(_pos){
    super(_pos);
  }

  updateRotation(){}

  display(){
    push();
    translate(this.pos.x, this.pos.y);
    scale(this.lifespan);
    // fill(255);
    fill(this.r, this.g, this.b, 255 * this.lifespan);
    noStroke();
    ellipse(0,0, this.rad * 2, this.rad * 2);
    pop();
  }

}

class Rect_Fire extends Particle{
  constructor(_pos, _anglev){
    super(_pos);
    this.mass = random(5, 8);
    this.rad = this.mass;
    this.lifeReduction = random(0.007, 0.01);
    this.angle = 0;
    this.angleVel = _anglev;
  }

  updateRotation() {
    this.angle += this.angleVel;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this.isExploded){
      rotate(this.angle);
    }
    fill(this.r, this.g, this.b, 255 * this.lifespan);
    scale(this.lifespan);
    noStroke();
    rect(0, 0, this.rad*2, this.rad*2);
    pop();
  }

  explode(){
    let ran = random(1);
    let angle;
    if (ran < 0.25){
      angle = TAU / 4 - PI / 4;
    }else if (ran >= 0.25 && ran < 0.5){
      angle = TAU / 2 - PI / 4;
    }else if (ran >= 0.5 && ran < 0.75){
      angle = TAU * 3 / 4 - PI / 4;
    }else{
      angle = TAU - PI / 4;
    }
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(random(5, 10));
    this.isExploded = true;
  }

}

class Tri_Fire extends Particle{
  constructor(_pos, _anglev){
    super(_pos);
    this.mass = random(5, 8);
    this.rad = this.mass;
    this.angle = 0;
    this.angleVel = _anglev;
  }

  updateRotation() {
    this.angle += this.angleVel;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this.isExploded){
      rotate(this.angle);
    }
    fill(this.r, this.g, this.b, 255 * this.lifespan);
    scale(this.lifespan);
    noStroke();
    triangle(10, 0, -10, 0, 0, 17.5);
    pop();
  }

  explode(){
    let ran = random(1);
    let angle;
    if (ran < 0.33){
      angle = TAU / 3 - PI / 6;
    }else if (ran > 0.66){
      angle = TAU * 2 / 3 - PI / 6;
    }else{
      angle = TAU - PI / 6;
    }
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(random(5, 10));
    this.isExploded = true;
  }

}

class FireworkSystem {
  constructor(x, y, angle_setoff, max) {
    this.pos = new p5.Vector(x, y);
    this.particles = [];
    this.count = 0;
    this.angle_setoff = angle_setoff;
    this.max = max;
  }

  generate() {
    if (this.count == 0){
      let ran = random(1);
      let angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x) + this.angle_setoff;
      let v = new p5.Vector.fromAngle(angle);
      let dis = dist(mouseX, mouseY, this.pos.x, this.pos.y);
      v.mult(random( dis / 2, dis) / 40);
      if (ran > 0.66){
        for (let i = 0; i < 20; i ++){
          let c = new Circle_Fire( new p5.Vector(0, 0) );
          c.setVelocity( v );
          this.particles.push( c );
        }
      }else if (ran < 0.33){
        let anglev = random(-0.25,0.25);
        for (let i = 0; i < 20; i ++){
          let r = new Rect_Fire( new p5.Vector(0, 0), anglev );
          r.setVelocity( v );
          this.particles.push( r );
        }
      }else{
        let anglev = random(-0.25,0.25);
        for (let i = 0; i < 20; i ++){
          let t = new Tri_Fire( new p5.Vector(0, 0), anglev );
          t.setVelocity( v );
          this.particles.push( t );
        }
      }
      this.count ++;
    }else{
      this.count ++;
      if (this.count > this.max){
        this.count = 0;
      }
    }
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

    // update and display
    noStroke();

    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      p.slowDown();
      p.update();
      p.updateRotation();
      p.display();

      if (p.vel.mag() < 0.5){
        if (p.isExploded == false){
          p.explode();
        }
      }

      if (p.isExploded){
        p.updateLifespan();
        // gravity
        let gravity = createVector(0, C_GRAVITY * p.mass);
        p.applyForce( gravity );
      }
    }
    pop();
  }

}
