const C_GRAVITY = 5;
let particles = [];
let origin;
let count = 0;
let mode = 0;
let st;
let ct;

// JSON
let params = {
  colorR: 255,
  colorG: 255,
  colorB: 255,
  mass: 100,
  vecReduce: 0.98,
  collision:1
}

const gui = new dat.GUI();
//gui.remember(params);
gui.add(params, 'colorR').max(255).min(0).step(5);
gui.add(params, 'colorG').max(255).min(0).step(5);
gui.add(params, 'colorB').max(255).min(0).step(5);
gui.add(params, 'mass').min(50).max(300).step(10);
gui.add(params, 'vecReduce');
gui.add(params, 'collision').min(1).max(10).step(0.1);


function preload(){
  st = loadImage("Shinra tensei.png");
  ct = loadImage("Chibaku_Tensei.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(50);
}

function draw() {
  // display the skill name
  textSize(40);
  if (mode == 0){
    background(ct);
    fill(255);
    text("Skill: Chibaku Tensei", 20, 40);
  }else{
    background(st);
    fill(0);
    text("Skill: Shinra tensei", 20, 40);
  }

  origin = new Core(mouseX, mouseY, params.mass);

  origin.display();

  // generate one particle per 20 frames
  if (count == 0){
    particles.push(new Particle(random(width), random(height), random(3,8)));
    count ++;
  }else if (count < 20){
    count ++;
  }else if (count == 20){
    count = 0;
  }

  for(let a=0; a<particles.length; a++) {
    let p = particles[a];

    for (let b=0; b<particles.length; b++) {
      let other = particles[b];
      if (a != b) {
        p.checkCollision( other );
      }
    }

    if (mode == 0){ // Chibaku Tensei
      p.applyGAttraction(origin);
    }else{ //Shinra Tensei
      p.applyRepulsion(origin);
    }
    p.checkCollision(origin);
    origin.checkCollision(p);

    p.checkEdges();
    p.update();
    p.display();

  }

  while (particles.length > 300){
    particles.splice(length - 1,1);
  }

}

// change the skill
function keyPressed(){
  if (key == ' '){
    if (mode == 0){
      mode = 1;
    }else{
      mode = 0;
    }
  }
}

// generate more particles
function mouseClicked() {
  let p = new Particle(random(width), random(height), random(3, 8) );
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
  }

  checkCollision(other) {
    let vector = p5.Vector.sub(other.pos, this.pos);
    let distance = vector.mag();

    if (distance < this.rad + other.rad) {
      let force = createVector();
      if (other == origin){

        let gMag = (C_GRAVITY * this.mass * other.mass) / (distance * distance);
        force = vector.copy();
        force.mult(-1);
        force.normalize();
        force.mult( gMag);
        this.applyForce( force );

      }else{
        // this
        force = vector.copy();
        force.mult(-1);
        force.normalize();
        force.mult(params.collision);
        this.applyForce( force );

        //other
        force = vector.copy();
        force.normalize();
        force.mult(params.collision);
        other.applyForce( force );
      }

    }
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
    f.mult(-gMag * 3);
    this.applyForce( f );
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

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
    fill(params.colorR, params.colorG, params.colorB);
    ellipse(0, 0, this.rad*2, this.rad*2);
    pop();
  }
}

// class Core
class Core {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.mass = m;
    this.rad = m/10;
    this.r = 0;
    this.g = 0;
    this.b = 0;
  }

  checkCollision(other) {
    let vector = p5.Vector.sub(other.pos, this.pos);
    let distance = vector.mag();
    if (distance < this.rad + other.rad) {
      let force = createVector();

      //other
      force = vector.copy();
      force.normalize();
      force.mult( other.vel.mag() * 3);
      other.applyForce( force );

    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    stroke(255);
    fill(this.r, this.g, this.b, 150);
    ellipse(0, 0, this.rad*2, this.rad*2);
    pop();
  }
}
