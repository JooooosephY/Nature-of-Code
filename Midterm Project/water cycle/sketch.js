const C_GRAVITY = 0.1;
let snowflakes = [];
let particles = [];
let snows = [];
let rains = [];
let sinArray = [];
let sinResolution = 360 * 4;
let waves = [];
let max = 10;
let count = 0;
let cracked = false;

let wind;
let rain;
let generating_ice;
let cracking_ice;
let water;


// JSON
let params = {
  temperature: -10,
  wind: 0.05,
  size: 40,
  amp: 0.4,
  freq: 0.017,
  debug_mode: false
}

const gui = new dat.GUI();
const f1 = gui.addFolder('General');
const f2 = gui.addFolder('Snowflake');
const f3 = gui.addFolder('Wave');

f1.add(params, 'temperature').max(35).min(-20).step(0.1);
f1.add(params, 'wind').max(0.5).min(-0.5).step(0.05);

f2.add(params, 'size').max(100).min(20).step(5);

f3.add(params, 'amp', 0.1, 0.8);
f3.add(params, 'freq', 0.015, 0.02);

gui.add(params, 'debug_mode');

function preload() {
  wind = loadSound("sound/wind.mp3");
  rain = loadSound("sound/rain.mp3");
  generating_ice = loadSound("sound/g_ice.mp3");
  cracking_ice = loadSound("sound/c_ice.mp3");
  water = loadSound("sound/water.mp3");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  for (let i=0; i<sinResolution; i++) {
    let angle = map(i, 0, sinResolution, 0, TWO_PI);
    sinArray.push( sin(angle) );
  }

  for (let x = 0; x < width; x++){
    waves.push(new Wave(x, height - 50, height - 50, params.freq, params.amp));
  }

  wind.playMode('restart');
  rain.playMode('restart');
  generating_ice.playMode('restart');
  cracking_ice.playMode('restart');
  water.playMode('restart');

}

function draw() {
  background(0);

  // play the sound effect of the wind
  if (params.wind != 0){
    wind.setVolume(map(abs(params.wind), 0, 0.5, 0.05, 0.8));
    if(!wind.isPlaying()){
      wind.play();
    }
  }else{
    if ( wind.isPlaying()){
      wind.stop();
    }
  }

  // play the sound effect of the rain and water
  if (params.temperature > 0){
    // water sound
    if(!water.isPlaying()){
      water.setVolume(0.2);
      water.play();
    }
    // rain sound
    rain.setVolume(map(rains.length, 0, 800, 0.05, 0.6));
    if (!rain.isPlaying()){
      rain.play();
    }
  }else{
    if (rain.isPlaying()){
      rain.stop();
    }
    if (water.isPlaying()){
      water.stop();
    }
  }



  if (params.temperature <= 0){
    let m = max + params.temperature;
    if (m < 0){
      for ( let i = 0; i < (-m) / 3; i ++){
        snows.push(new Snow(random(width), random(-50, 0), random(2,4)));
      }
    }else{
      if (count == 0){
        snows.push(new Snow(random(width), random(-50, 0), random(2,4)));
        count ++;
      }else{
        count ++;
        if (count > m){
          count = 0;
        }
      }
    }
  }else{
    let m = max - params.temperature;
    if (m < 0){
      for ( let i = 0; i < (-m) / 8; i ++){
        rains.push(new Rain(random(width), random(-50, 0), random(5,8)))
      }
    }else{
      if (count == 0){
        rains.push(new Rain(random(width), random(-50, 0), random(5,8)))
        count ++;
      }else{
        count ++;
        if (count > m){
          count = 0;
        }
      }
    }
  }

  // display waves
  for (let i = 0; i < waves.length; i ++){
    let w = waves[i];

    w.update();
    w.display();
  }

  // display rains
  for (let i = 0; i < rains.length; i ++){
    let r = rains[i];

    // gravity
    let gravity = createVector(0, C_GRAVITY * r.mass);
    r.applyForce( gravity );

    // resistance
    let resistance = p5.Vector.mult(r.vel, -1);
    resistance.mult(0.1);
    r.applyForce( resistance );

    // wind force
    let wind = createVector(params.wind, 0);
    r.applyForce( wind );

    r.update();
    r.checkEdges( waves );
    r.display();
  }

  // remove the snows which are done
  for (let i = rains.length - 1; i >= 0; i --){
    let r = rains[i];
    if(r.isDone){
      rains.splice(i, 1);
    }
  }

  // display snows
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

    s.update();
    s.checkEdges( waves );
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
    if (params.temperature <= 0){
      cracked = false;
      if (f.updating){
        f.update();
      }
      if (f.moving){
        f.move();
        if (f.particles.length == 0){
          snowflakes.splice(i,1);
        }
      }else{
        f.display();
      }
    }else{
      if (!cracked && !cracking_ice.isPlaying()){
        cracking_ice.setVolume(0.2);
        cracking_ice.play();
      }
      cracked = true;
      f.moving = true;
      f.move();
      if (f.particles.length == 0){
        snowflakes.splice(i,1);
      }
    }
  }



  // limit the number of the snows
  while(snows.length > 800){
    snows.splice(0, 1);
  }

  // limit the number of the rainss
  while(rains.length > 800){
    rains.splice(0, 1);
  }

  // debug mode
  if(params.debug_mode){
    fill(255);
    text("Snow number: " + snows.length, 10, 20);
    text("Rain number: " + rains.length, 10, 40);
    text("FrameRate: " + Math.floor(frameRate()), 10, 60);
  }

}

function mouseClicked(){
  if (params.temperature <= 0){
    let generated = true;
    for (let i = 0; i < snowflakes.length; i ++){
      let s = snowflakes[i];
      if(dist(mouseX, mouseY, s.pos.x, s.pos.y) < s.size){
        s.moving = true;
        generated = false;
        cracking_ice.setVolume(0.2);
        cracking_ice.play();
      }
    }
    if (generated){
      snowflakes.push( new Snowflake(mouseX, mouseY));
      generating_ice.setVolume(0.2);
      generating_ice.play();
    }
  }
}

function mSin( angle ) {
  // won't work with negative angle values!
  let index = parseInt( map(angle % TWO_PI, 0, TWO_PI, 0, sinResolution) );
  return sinArray[index];
}

class Wave{
  constructor(x, y, yOffset, adjFreq, adjAmp){
    this.pos = createVector(x, y);
    this.adjFreq = adjFreq;
    this.adjAmp = adjFreq;
    this.yOffset = yOffset;
  }

  update(){
    let freq; // time, angle (+ position)
    let amp; // radDistance

    this.adjFreq = params.freq;
    this.adjAmp = params.amp;

    if (params.temperature > 0){
      freq = this.pos.x * 0.005 + frameCount * 0.01;
      amp = 20;
      let sinForAmp = mSin(freq) * amp;

      freq = this.pos.x * this.adjFreq;
      amp = sinForAmp * this.adjAmp;
      let sinValue = mSin(freq) * amp;

      this.pos.y = this.yOffset + sinValue;
    }
  }

  display(){
    if (params.temperature > 0){
      push();
      stroke(151, 171, 232);
      strokeWeight(2);
      line(this.pos.x, height, this.pos.x, this.pos.y);
      pop();
    }else{
      push();
      stroke(0, 238, 255);
      strokeWeight(2);
      line(this.pos.x, height, this.pos.x, this.pos.y);
      pop();
    }
  }
}



// Snowflake class
class Snowflake{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.vel = createVector(0, -0.1);
    this.particles = [];
    this.size = params.size;
    this.count = 0;
    this.max = params.size / 4;
    this.moving = false;
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
    let current = new Particle(this.size, 0, this.pos.x, this.pos.y);

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
    if (this.moving){
      this.pos.add(this.vel);

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
        p.checkEdges();
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

}

class Particle{
  constructor(x, y, cx, cy){
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.centerpos = createVector(cx, cy);
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

  checkEdges() {
    if (this.pos.x < 0 - this.centerpos.x) {
      this.pos.x = 0 - this.centerpos.x;
      this.vel.x *= -0.5;
    }else if (this.pos.x > width - this.centerpos.x) {
      this.pos.x = width - this.centerpos.x;
      this.vel.x *= -0.5;
    }else if (this.pos.y > height - 40 - this.centerpos.y) {
      this.pos.y = height - 40 - this.centerpos.y;
    }

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
    fill(255, 500 * this.lifespan);
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

  checkEdges( a ) {
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x *= -0.5;
    }else if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x *= -0.5;
    }else if (this.pos.y > a[int(this.pos.x)].pos.y) {
      this.pos.y = a[int(this.pos.x)].pos.y;
      this.vel.y *= -0.1;
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
    fill(255, 1000 * this.lifespan);
    noStroke();
    ellipse(0, 0, this.rad, this.rad);
    pop();

    if (params.debug_mode){
      fill(255);
      text( int(this.lifeReduction * 1000), this.pos. x+10, this.pos. y);
    }
  }

}

class Rain{
  constructor(x, y, m) {
    // properties
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector();
    this.mass = m;
    this.len = m * 3;
    this.tem = params.temperature;
    this.edge = false;
    this.frozen = false;

    // Lifespan of the snow
    this.lifespan = 1.0; // 100%
    this.lifeReduction = random(0.001, 0.004) + this.tem / 10000;
    this.isDone = false;
  }

  update() {

    this.vel.add( this.acc );
    this.pos.add( this.vel );
    this.acc.mult(0);

    // update lifeReduction
    if (params.temperature > 0){
      this.frozen = false;
      if (this.tem != params.temperature){
        this.lifeReduction += (params.temperature - this.tem) / 10000;
        this.tem = params.temperature;
      }
    }else{
      this.frozen = true;
    }

    // update lifespan
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0.0) {
      this.isDone = true;
    }

  }

  checkEdges( a ) {
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x *= -0.3;
      this.edge = true;
    }else if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x *= -0.3;
      this.edge = true;
    }else if (this.pos.y > a[int(this.pos.x)].pos.y) {
      this.pos.y = a[int(this.pos.x)].pos.y;
      this.vel.y *= -0.1;
      this.edge = true;
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
    if (this.edge){
      if (this.frozen){
        fill(255, 500 * this.lifespan);
      }else{
        fill(135,105,160, 500 * this.lifespan);
      }
      noStroke();
      ellipse(0, 0, this.len * this.lifespan, this.len * this.lifespan);
    }else{
      rotate(-params.wind);
      stroke(135,105,160, 500 * this.lifespan);
      line(0, -this.len, 0, 0);
    }

    pop();

    if (params.debug_mode){
      fill(255);
      text( int(this.lifeReduction * 1000), this.pos. x+10, this.pos. y);
    }
  }

}

// the way to display a snowflake
// push();
// translate(width/2, height/2);
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

// wave function
// function wave(yOffset, adjFreq, adjAmp, r, g, b) {
//   let freq; // time, angle (+ position)
//   let amp; // radDistance
//
//   for (let x = 0; x < width; x++) {
//     let y = yOffset;
//     if (params.temperature > 0){
//       freq = x * 0.005 + frameCount * 0.01;
//       amp = 20;
//       sinForAmp = mSin(freq) * amp;
//
//       freq = x * adjFreq;
//       amp = sinForAmp * adjAmp;
//       let sinValue = mSin(freq) * amp;
//
//       y += sinValue;
//     }
//
//     push();
//     stroke(r, g, b);
//     strokeWeight(2);
//     line(x, height,x,y);
//     pop();
//   }
// }
