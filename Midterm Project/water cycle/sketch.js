const C_GRAVITY = 0.1;
let snowflakes = [];
let particles = [];
let snows = [];
let moving = false;

// JSON
let params = {
  temperature: -10,
  wind: 0,
  size: 40,
  debug_mode: false
}

const gui = new dat.GUI();
const f1 = gui.addFolder('General');
const f2 = gui.addFolder('Snowflake');

f1.add(params, 'temperature').max(35).min(-20).step(0.1);
f1.add(params, 'wind').max(0.5).min(-0.5).step(0.005);

f2.add(params, 'size').max(100).min(20).step(5);

gui.add(params, 'debug_mode');


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0);

  if (params.temperature <= 0){
    for (let i = 0; i < (-params.temperature) / 5; i ++){
      snows.push(new Snow(random(width), random(-50, 0), random(2,4)));
    }
  }


  for (let i = 0; i < snows.length; i ++){
    let s = snows[i];

    // gravity
    let gravity = createVector(0, C_GRAVITY * s.mass);
    s.applyForce( gravity );

    // resistance
    let resistance = p5.Vector.mult(s.vel, -1);
    resistance.mult(0.1);
    s.applyForce( resistance );

    // wind force
    let wind = createVector(params.wind, 0);
    s.applyForce( wind );

    // update the lifeReduction based on the terperature
    //s.lifeReduction += (params.temperature / 10000);

    s.update();
    s.checkEdges();
    s.display();
  }

  // remove the snows which are done
  for (let i = snows.length - 1; i >= 0; i --){
    let s = snows[i];
    if(s.isDone){
      snows.splice(i, 1);
    }
  }

  // update and display snowflakes
  for (let i =0; i < snowflakes.length; i ++){
    let f = snowflakes[i];
    if (f.updating){
      f.update();
    }
    f.display();
    if (moving){
      f.move();
    }

  }



  // limit the number of the snows
  while(snows.length > 800){
    snows.splice(0, 1);
  }

  // debug mode
  if(params.debug_mode){
    fill(255);
    text("Snow number: " + snows.length, 10, 20);
    text("FrameRate: " + Math.floor(frameRate()), 10, 40);
  }

}

function mouseClicked(){
  if (params.temperature <= 0){
    snowflakes.push( new Snowflake(mouseX, mouseY));
  }
}

function keyPressed(){
  if (key == ' '){
    moving = !moving;
  }
}



// Snowflake class
class Snowflake{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.particles = [];
    this.count = 0;
    this.max = params.size / 4;
    this.updating = true;
  }

  // display the snowflake
  display(){

    push();
    translate(this.pos.x, this.pos.y);
    rotate(PI/6);

    for (let i = 0; i < 6; i ++){
      rotate(PI/3);

      for (let j = 0; j < this.particles.length; j ++){
        let p = this.particles[j];
        p.show();
      }

      push();
      scale(1, -1);

      for (let j = 0; j < this.particles.length; j ++){
        let p = this.particles[j];
        p.show();
      }
      pop();
    }

    pop();
  }

  update(){
    let current = new Particle(params.size, 0);

    while (!current.finished && !current.intersects(this.particles)){
      current.update();
    }

    this.particles.push(current);
    this.count ++;

    if (this.count > this.max){
      this.updating = false;
    }
  }

  move(){
    for (let i = 0; i < this.particles.length; i ++){
      let p = this.particles[i];

      // gravity
      let gravity = createVector(0, C_GRAVITY * p.mass);
      p.applyForce( gravity );

      // resistance
      let resistance = p5.Vector.mult(p.vel, -1);
      resistance.mult(0.1);
      p.applyForce( resistance );

      // wind force
      let wind = createVector(params.wind, 0);
      p.applyForce( wind );

      push();
      translate(this.pos.x, this.pos.y);
      p.updateLifespan();
      p.move();
      p.show();
      pop();
    }

    // remove the snows which are done
    for (let i = this.particles.length - 1; i >= 0; i --){
      let p = this.particles[i];
      if(p.isDone){
        this.particles.splice(i, 1);
      }
    }
  }

}

class Particle{
  constructor(x, y, cx, cy){
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.mass = 2;
    this.rad = 2;
    this.tem = params.temperature;
    this.finished = false;

    // Lifespan of the snow
    this.lifespan = 1.0; // 100%
    this.lifeReduction = random(0.003, 0.007) + this.tem / 10000;
    this.isDone = false;
  }

  // update the position
  update(){
    this.vel = createVector(-1, random(-2,2));
    this.pos.add(this.vel);

    // constrain the particle in the slice
    let angle = this.pos.heading();
    angle = constrain(angle, 0, PI/6);
    let mag = this.pos.mag();
    this.pos = p5.Vector.fromAngle(angle);
    this.pos.setMag(mag);

    if (this.pos.x < 1){
      this.finished = true;
    }
  }

  updateLifespan(){
    // update lifeReduction
    if (this.tem != params.temperature){
      this.lifeReduction += (params.temperature - this.tem) / 10000;
      this.tem = params.temperature;
    }

    // update lifespan
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0.0) {
      this.isDone = true;
    }
  }

  move(){
    this.vel.add( this.acc );
    this.pos.add( this.vel );
    this.acc.mult(0);
  }

  applyForce( f ) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add( force );
  }

  // check whether the particle intersects other particles
  intersects(array){
    let result = false;
    for (let i = 0; i < array.length; i ++){
      let a = array[i];
      let d = dist(a.pos.x, a.pos.y, this.pos.x, this.pos.y);
      if (d < this.rad * 2){
        result = true;
        break;
      }
    }

    return result;
  }

  // show the particles
  show(){
    push();
    translate(this.pos.x, this.pos.y);
    fill(255);
    // stroke(255);
    noStroke();
    ellipse(0, 0, this.rad * 2, this.rad * 2);
    pop();

    if (params.debug_mode){
      fill(255);
      text( int(this.lifeReduction * 1000), this.pos. x+10, this.pos. y);
    }
  }

}

// Snow class
class Snow {
  constructor(x, y, m) {
    // properties
    this.pos = createVector(x, y);
    this.vel = createVector(random(-3, 3), 0);
    this.acc = createVector();
    this.mass = m;
    this.rad = m;
    this.tem = params.temperature;

    // Lifespan of the snow
    this.lifespan = 1.0; // 100%
    this.lifeReduction = random(0.003, 0.007) + this.tem / 10000;
    this.isDone = false;
  }

  update() {

    this.vel.add( this.acc );
    this.pos.add( this.vel );
    this.acc.mult(0);

    // update lifeReduction
    if (this.tem != params.temperature){
      this.lifeReduction += (params.temperature - this.tem) / 10000;
      this.tem = params.temperature;
    }

    // update lifespan
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0.0) {
      this.isDone = true;
    }

  }

  checkEdges() {
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x *= -0.5;
    }else if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x *= -0.5;
    }else if (this.pos.y > height- 20) {
      this.pos.y = height - 20;
    }
  }

  applyForce( f ) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add( force );
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(255, 500 * this.lifespan);
    ellipse(0, 0, this.rad, this.rad);
    pop();

    if (params.debug_mode){
      fill(255);
      text( int(this.lifeReduction * 1000), this.pos. x+10, this.pos. y);
    }
  }

}

// the way to display a snowflake
// push();
// translate(mouseX, mouseY);
// rotate(PI/6);
//
// let current = new Particle(30, 0);
//
// while (!current.finished && !current.intersects(particles)){
//   current.update();
// }
// particles.push(current);
//
// for (let i = 0; i < 6; i ++){
//   rotate(PI/3);
//
//   for (let j = 0; j < particles.length; j ++){
//     s = particles[j];
//     s.show();
//   }
//
//   push();
//   scale(1, -1);
//   for (let j = 0; j < particles.length; j ++){
//     s = particles[j];
//     s.show();
//   }
//   pop();
// }
// pop();
//
