const C_GRAVITY = 4;
let electrons = [];
let protrons = [];
let neutrons = [];
let particles1 = [];
let particles2 = [];
let core;

// JSON
let params = {
  k_value: 4,
  coulombian: 1,
  collision: 0,
  attraction: 0.09,
  adj:10,
  eAdj:0
}
const gui = new dat.GUI();
gui.add(params, 'k_value',4,10);
gui.add(params, 'coulombian',0.98,1);
gui.add(params, 'attraction',0.09,0.19);
gui.add(params, 'collision').max(0).min(1).step(1);
gui.add(params, 'adj',10,20);
gui.add(params, 'eAdj',0,30);


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  for (let i=0; i<80; i++) {
    particles1.push( new Particle(random(width), random(height), random(1,2)) ); // play with the mass value!
  }

  for (let i=0; i<600; i++) {
    particles2.push( new Particle(random(width), random(height), random(1,2)) ); // play with the mass value!
  }
}

function draw() {
  background(0,20)

  core = new Particle(width/2,height/2,400);

  let centerPos = createVector(width/2,height/2)

  //First layer particle sphere

  for(let a=0; a<particles1.length; a++) {
    let p1 = particles1[a];

    // p.applyGravitationalAttraction( core );
    p1.applySimpleAttraction1( core );
    p1.update();
    p1.display();
  }

  //Second layer particle sphere

  for(let a=0; a<particles2.length; a++) {
    let p2 = particles2[a];

    // p.applyGravitationalAttraction( core );
    p2.applySimpleAttraction2( core );
    p2.update();
    p2.display();
  }


  // ADD electrons
  for(let a=0; a<electrons.length; a++){
    let e = electrons[a];
    // for(let b=0; b<electrons.length; b++){
    //   let other = electrons[b];
    //   if (a!=b){
    //     e.applyRepulsion(other);
    //     // e.checkCollision(other);
    //   }
    // }
    e.attractTo( core.pos );
    // e.applyGravitationalAttraction(core);
    e.applyRepulsion(core);
    e.update();
    e.display();
  }

  // ADD Neutron
  for(let i = 0; i< 10; i++){
    neutrons.push(new Neutron(random(width/2-30,width/2+30),random(height/2-10,height/2+10),random(5,10)));
  }

  for(let i=0; i < 10; i++){
    let n = neutrons[i];
    for(let b=0; b < 10; b++){
      let other = neutrons[b]
      if (i!=b){
        // n.applyRepulsion(other);
      }
    }

    n.vel = createVector(random(-2,2),random(-2,2));
    n.attractTo(centerPos);
    // n.applySimpleAttraction(core);
    n.update();
    n.display();
  }

  // ADD protrons
  for(let i = 0; i< 10; i++){
    protrons.push(new Protron(random(width/2-20,width/2+20),random(height/2-20,height/2+20),random(20,30)));
  }

  for(let i=0; i < 10; i++){
    let p = protrons[i];
    for(let b=0; b < 10; b++){
      let other = protrons[b];
      if (i!=b){
        p.applyRepulsion(other);
      }
    }

    p.vel = createVector(random(-3,3),random(-3,3));
    p.attractTo(centerPos);
    p.applySimpleAttraction(core);
    p.update();
    p.display();
  }
}

function mousePressed(){
  let e = new Electron(mouseX,mouseY,random(5,10));
  //e.vel = createVector(random(-2,2),random(-2,2));

  let vector = p5.Vector.sub(core.pos, e.pos);
  // vector.rotate(PI/2); // 90 degree angle
  if (random(1) < 0.5) {
    if(random(1)< 0.5){
      vector.rotate(PI/2);
    }else {
      vector.rotate(-PI/2);
    }
    vector.mult( random(0.1, 1.5) );
  } else {
    if(random(1)< 0.5){
      vector.rotate(PI/2);
    }else {
      vector.rotate(-PI/2);
    }
    vector.mult( -random(0.1, 1.5) );
  }
  e.vel = vector.copy();

  electrons.push(e);
}


class Neutron {
  constructor(x,y,m){
    this.pos = createVector(x,y);
    this.vel = createVector();
    this.acc = createVector();
    this.mass = m;
  }
  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  attractTo(target){
    let f = p5.Vector.sub(target,this.pos);
    f.mult(0.09);
    this.applyForce(f);
  }

  applyForce(f){
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }

  applyRepulsion(other) {
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag();
    let gMag = (C_GRAVITY * this.mass * other.mass) / (distance * distance*distance);
    f.normalize();
    f.mult(-gMag);
    this.applyForce( f );
  }

  applySimpleAttraction(other) {
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag();
    f.normalize();
    f.mult(0.2); // play with this value!

    // *** check this out! ***
    // if (distance < other.rad) {
    //   let adj = 30.0; // play with this value!
    //   f.mult(-1 * adj);
    // }

    this.applyForce( f );
  }

  applyGravitationalAttraction(other) {
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag(); // = this.pos.distance( other.pos );
    let gMag = (C_GRAVITY * this.mass * other.mass) / (distance * distance); // mag
    f.normalize(); // direction
    f.mult(gMag);

    // *** check this out! ***
    if (distance < other.rad) {
      let adj = 10.0; // play with this value!
      f.mult(-1 * adj);
    }

    this.applyForce( f );
  }

  display(){
    push();
    translate(this.pos.x, this.pos.y);
    fill(100,220,100);
    ellipse(0,0,10,10);
    pop();
  }
}

class Protron {
  constructor(x,y,m){
    this.pos = createVector(x,y);
    this.vel = createVector();
    this.acc = createVector();
    this.mass = m;
    this.rad = m;
  }
  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  attractTo(target){
    let f = p5.Vector.sub(target,this.pos);
    f.mult(0.09);
    this.applyForce(f);
  }

  applySimpleAttraction(other) {
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag();
    f.normalize();
    f.mult(0.2); // play with this value!

    // *** check this out! ***
    // if (distance < other.rad) {
    //   let adj = 30.0; // play with this value!
    //   f.mult(-1 * adj);
    // }

    this.applyForce( f );
  }

  applyGravitationalAttraction(other) {
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag(); // = this.pos.distance( other.pos );
    let gMag = (C_GRAVITY * this.mass * other.mass) / (distance * distance); // mag
    f.normalize(); // direction
    f.mult(gMag);

    // *** check this out! ***
    if (distance < other.rad) {
      let adj = 10.0; // play with this value!
      f.mult(-1 * adj);
    }

    this.applyForce( f );
  }

  applyForce(f){
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }

  applyRepulsion(other) {
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag();
    let gMag = (C_GRAVITY * this.mass * other.mass) / (distance * distance*distance);
    f.normalize();
    f.mult(-gMag);
    this.applyForce( f );
  }

  display(){
    push();
    translate(this.pos.x, this.pos.y);
    // noStroke();
    fill(230,100,100,80);
    ellipse(0,0,this.rad,this.rad);
    pop();
  }
}



class Electron{
  constructor(x,y,m){
    this.pos = createVector(x,y)
    this.vel = createVector();
    this.acc = createVector();
    this.mass = m;
    this.rad = m;
    this.r = 255;
    this.g = 255;
    this.b = 255;
  }

  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    //

    this.vel.mult(params.coulombian);
    this.vel.limit(25);
  }

  attractTo(target) {
  let f = p5.Vector.sub(target, this.pos);
  //f.normalize(); // get the direction
  //f.mult(1); // mag is now 5px.
  f.mult(params.attraction);
  this.applyForce( f );
}

applySimpleAttraction(other) {
  let f = p5.Vector.sub(other.pos, this.pos);
  let distance = f.mag();
  f.normalize();
  f.mult(0.2); // play with this value!

  // *** check this out! ***
  if (distance < other.rad) {
    // let adj = 30.0; // play with this value!
    f.mult(-1 * params.eAdj);
  }

  this.applyForce( f );
}

applyGravitationalAttraction(other) {
  let f = p5.Vector.sub(other.pos, this.pos);
  let distance = f.mag(); // = this.pos.distance( other.pos );
  let gMag = (params.k_value * this.mass * other.mass) / (distance * distance); // mag
  f.normalize(); // direction
  f.mult(gMag);

  // *** check this out! ***
  if (distance < other.rad/5) {
    // let adj = 10.0; // play with this value!
    f.mult(-1 * params.eAdj);
  }

  this.applyForce( f );
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
    force.mult( other.vel.mag() * 3 * params.collision );
    //force.mult(0.1);
    this.applyForce( force );

    //other
    force = vector.copy();
    force.normalize();
    force.mult( this.vel.mag() * 3 * params.collision );
    other.applyForce( force );

  } else {
    this.r = 255;
    this.g = 255;
    this.b = 255;
  }
}

applyRepulsion(other) {
  let f = p5.Vector.sub(other.pos, this.pos);
  let distance = f.mag();
  let gMag = (params.k_value * this.mass * other.mass) / (distance * distance*distance);
  f.normalize();
  f.mult(-gMag);
  this.applyForce( f );
}

  applyForce(f){
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }

  display(){
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(random(100,150),random(100,150),random(200,255));
    ellipse(0,0,this.rad,this.rad);
    pop();
  }
}



class Particle {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.mass = m;
    this.rad = m;
  }

  // first(inner) layer particle sphere
  applySimpleAttraction1(other) {
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag();
    f.normalize();
    f.mult(0.5); // play with this value!

    // *** check this out! ***
    if (distance < other.rad/6) {
      // let adj = 10.0; // play with this value!
      f.mult(-1 * params.adj);
    }

    this.applyForce( f );
  }

  // Second(outer) layer particle sphere
  applySimpleAttraction2(other) {
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag();
    f.normalize();
    f.mult(0.5); // play with this value!

    // *** check this out! ***
    if (distance < other.rad) {
      // let adj = 10.0; // play with this value!
      f.mult(-1 * params.adj);
    }

    this.applyForce( f );
  }

  applyGravitationalAttraction(other) {
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag(); // = this.pos.distance( other.pos );
    let gMag = (C_GRAVITY * this.mass * other.mass) / (distance * distance); // mag
    f.normalize(); // direction
    f.mult(gMag);

    // *** check this out! ***
    if (distance < other.rad) {
      let adj = 0.5; // play with this value!
      f.mult(-1 * 10);
    }

    this.applyForce( f );
  }


  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    //
    this.vel.mult(0.97);
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add( force );
  }

  display() {
    let opacity = map(cos(frameCount*0.05),-1,1,30,100);

    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(180,opacity);
    ellipse(0, 0, this.rad*2, this.rad*2);
    pop();
  }
}
