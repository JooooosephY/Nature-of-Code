let fireworks1 = [];
let fireworks2 = [];
let mix = [];
let booms = [];
let count = 0;
let model = ["normal", "circle", "mixed"];
let idx = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}


function draw() {
  background(0,40);

  let px = random(width);
  let py = random(height, height + 100);
  let v = random(-11, -9);


  if (idx == 0){
    // generate 20 fireworks1 per 10 frame
    if (count == 0){
      for (let i = 0; i < 20; i ++){
        fireworks1.push( new Firework(px, py, v) );
      }
      count ++;
    }else{
      count ++;
      if (count > 10){
        count = 0;
      }
    }
  }else if (idx == 1){
    // generate 60 fireworks2 per 50 frame
    if (count == 0){
      for (let i = 0; i < 60; i ++){
        fireworks2.push( new Firework(px, py, v) );
      }
      count ++;
    }else{
      count ++;
      if (count > 40){
        count = 0;
      }
    }
  }else if (idx == 2){
    if (count == 0){
      let ran = random(0,1)
      if (ran > 0.5){
        for (let i = 0; i < 20; i ++){
          fireworks1.push( new Firework(px, py, v) );
        }
        for (let i = fireworks1.length - 1; i > fireworks1.length - 21; i --){
          fireworks1[i].model = model[0];
        }
      }else{
        for (let i = 0; i < 60; i ++){
          fireworks2.push( new Firework(px, py, v) );
        }
        for (let i = fireworks2.length - 1; i > fireworks2.length - 61; i --){
          fireworks2[i].model = model[1];
        }
      }
      count ++;
    }else{
      count ++;
      if (count > 30){
        count = 0;
      }
    }
  }


  // update and display the fireworks1
  for (let i=0; i<fireworks1.length; i++) {
    let f = fireworks1[i];
    f.acc = createVector(0, 0.1);
    f.updatePosition();
    f.display();

    // If the firework is not exploded and the velocity on y-axis is 0, explode
    if (f.vel.y > 0){
      if (f.isExploded == false){
        f.explode();
      }
    }

    // After explosion, update the lifespan
    if (f.isExploded){
      f.updateLifespan();
    }

    // remove fireworks1 which are done!
    if (fireworks1[i].isDone) {
      fireworks1.splice(i, 1);
    }
  }

  // update and display the fireworks2
  for (let i=0; i<fireworks2.length; i++) {
    let f = fireworks2[i];
    f.acc = createVector(0, 0.1);
    f.updatePosition();
    f.display();

    // If the firework is not exploded and the velocity on y-axis is 0, explode
    if (f.vel.y > 0){
      if (f.isExploded == false){
        f.explode();
      }
    }

    // After explosion, update the lifespan
    if (f.isExploded){
      f.updateLifespan();
    }

    // remove fireworks1 which are done!
    if (f.isDone) {
      f.boom();
      fireworks2.splice(i, 1);
    }
  }

  // update and display the booms
  for (let i=0; i<booms.length; i++) {
    let f = booms[i];
    f.acc = createVector(0, 0.1);
    f.move();
    f.display();
    f.updateLifespan();

    // remove fireworks1 which are done!
    if (f.isDone) {
      booms.splice(i, 1);
    }
  }

  // limit the number of particles
  while (fireworks1.length > 2000) {
    fireworks1.splice(0,1);
  }

  // limit the number of particles
  while (fireworks2.length > 2000) {
    fireworks1.splice(0,1);
  }

  // limit the number of particles
  while (booms.length > 3000) {
    booms.splice(0,1);
  }

  // display the model of the fireworks
  textSize(20);
  fill(255);
  text("Model of the firework: " + model[idx], 10, 20);
}

// click the mouse to shoot the firework
function mouseClicked() {
  let mouse = createVector(mouseX, mouseY);
  if (idx == 0){
    for (let i = 0; i < 20; i ++){
      fireworks1.push( new Firework(mouse.x, mouse.y, 0) );
    }
  }else if (idx == 1){
    for (let i = 0; i < 60; i ++){
      fireworks2.push( new Firework(mouse.x, mouse.y, 0) );
    }
  }else if (idx == 2){
    let ran = random(0,1)
    if (ran > 0.5){
      for (let i = 0; i < 20; i ++){
        fireworks1.push( new Firework(mouse.x, mouse.y, 0) );
      }
      for (let i = fireworks1.length - 1; i > fireworks1.length - 21; i --){
        fireworks1[i].model = model[0];
      }
    }else{
      for (let i = 0; i < 60; i ++){
        fireworks2.push( new Firework(mouse.x, mouse.y, 0) );
      }
      for (let i = fireworks2.length - 1; i > fireworks2.length - 61; i --){
        fireworks2[i].model = model[1];
      }
    }
  }
}

// Press the space to change the mode
function keyPressed(){
  if (key == ' '){
    idx ++;
    if (idx > 2){
      idx = 0;
    }
  }
}



// Firework class
class Firework {
  constructor(x, y, v) {
    // properties
    this.pos = createVector(x, y);
    this.vel = createVector( 0, v );
    this.acc = createVector();
    this.isExploded = false;
    this.size = random(10, 15);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.model = model[idx];

    // Lifespan of the firework
    this.lifespan = 1.0; // 100%
    this.lifeReduction = random(0.005, 0.01);
    this.isDone = false;
  }
  // methods

  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0.0) {
      this.isDone = true;
    }
  }

  updatePosition() {
    // acc -> vel -> pos
    this.vel.add( this.acc );
    this.pos.add( this.vel ); // this.x += this.xSpd;
    this.acc.mult(0); // release

    if (this.isExploded) {
      if (this.model == "normal"){
        this.vel.mult(0.965);
      }else if (this.model == "circle"){
        this.vel.mult(0.8);
      }
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(this.r, this.g, this.b, 255 * this.lifespan);
    noStroke();
    ellipse(0, 0, this.size * this.lifespan, this.size * this.lifespan);
    pop();
  }

  explode(){
    // console.log(this.model);
    if (this.model == "normal"){
      this.vel = createVector(random(-6,6), random(-7,7));
      this.isExploded = true;
    }else if (this.model == "circle"){
      let angle = random(TAU);
      this.vel = p5.Vector.fromAngle(angle);
      this.vel.mult(random(0.1, 30));
      this.isExploded = true;
    }
  }

  boom(){
    for (let i = 0; i < 10; i++){
      booms.push( new Explosion(this.pos.x, this.pos.y) );
    }
  }
}

class Explosion {
  constructor(x, y){
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(random(TAU));
    this.acc = createVector();
    this.size = random(5, 10);
    this.r = random(0,255);
    this.g = random(0,255);
    this.b = random(0,255);
    this.lifespan = 0.4; // 40%
    this.lifeReduction = random(0.005, 0.01);
    this.isDone = false;
  }

  move() {
    // this.vel.mult(random(0.1, 3));

    this.vel.add( this.acc );
    this.pos.add( this.vel ); // this.x += this.xSpd;
    this.acc.mult(0); // release
  }

  display(){
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(this.r, this.g, this.b, 500 * this.lifespan);
    ellipse(0, 0, this.size * this.lifespan, this.size * this.lifespan);
    pop();
  }

  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0.0) {
      this.isDone = true;
    }
  }
}
