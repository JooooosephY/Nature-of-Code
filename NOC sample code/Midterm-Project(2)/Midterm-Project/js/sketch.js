const C_GRAVITY = 4;
let electrons = [];
let protrons = [];
let neutrons = [];
let particles1 = [];
let particles2 = [];
let core;
// let fade1, fade2;
let stage = 0;
let isDone = false;
let debugMode = false;


// JSON
let params = {
  attraction: 0.09,
  adj:10,
  debugMode:false,
  angle:1,
  range:0.2

}
const gui = new dat.GUI();
gui.add(params, 'attraction',0.09,0.4);
gui.add(params, 'adj',10,20);
gui.add(params, 'debugMode');
gui.add(params, 'angle',1,3);
gui.add(params, 'range',0.2,0.5);

function preload(){
  soundFormats('mp3', 'ogg');
  song1 = loadSound('assets/fade.mp3');
  song1.setVolume(0.2);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  song1.play();


  for (let i=0; i<80; i++) {
    particles1.push( new Particle(random(width), random(height), random(1,2)) ); // play with the mass value!
  }

  for (let i=0; i<400; i++) {
    particles2.push( new Particle(random(width), random(height), random(1,2)) ); // play with the mass value!
  }
}

function draw() {
  background(0,20)

  if(params.debugMode){
    fill(255);
    textSize(20);
    text(nf(frameRate(),2,0),100,100);
    text(stage,200,200);
  }

  if(isDone==false){
    push();

    let freq = frameCount * 0.05;
    let amp = 30;
    let sinValue = sin(freq) * amp;
    let r =70

    noFill();
    stroke(255);
    strokeWeight(4);
    ellipse(width/2,height/2,r+sinValue,r+sinValue);
    pop();

    if((mouseX>width/2-50&&mouseX<width/2+50)&&(mouseY>height/2-50&&mouseY<height/2+50)&&mousePressed){
      isDone = true;
    }
  }


  if(isDone==true){

    let offsetOpa = 255-frameCount*0.8;
    textSize(32);
    textFont("Helvetica");
    fill(255,offsetOpa);
    text("CLICK",width/2,height/2-300);



    core = new Particle(width/2,height/2,400);
    let centerPos = createVector(width/2,height/2)

    // ADD electrons
    for(let a=0; a<electrons.length; a++){
      let e = electrons[a];

      e.attractTo( core.pos );
      e.update();
      e.display();

    }

    // ADD Neutron
    for(let i = 0; i< 10; i++){
      neutrons.push(new Neutron(random(width/2-30,width/2+30),random(height/2-10,height/2+10),random(5,10)));
    }

    for(let i=0; i < 10; i++){
      let n = neutrons[i];

      n.vel = createVector(random(-1,1),random(-1,1));
      n.applySimpleAttraction(core);
      n.update();
      n.display();
    }

    // ADD protrons
    for(let i = 0; i< 10; i++){
      protrons.push(new Protron(random(width/2-20,width/2+20),random(height/2-20,height/2+20),random(20,30)));
    }

    for(let i=0; i < 10; i++){
      let p = protrons[i];

      p.vel = createVector(random(-1,1),random(-1,1));
      p.applySimpleAttraction(core);
      p.update();
      p.display();
    }

    //First layer particle sphere
    if (stage>6) {
      for(let a=0; a<particles1.length; a++) {
        let p1 = particles1[a];

        p1.applySimpleAttraction( core, 7 );
        p1.update();
        p1.display();
      }

      //Second layer particle sphere

      for(let a=0; a<particles2.length; a++) {
        let p2 = particles2[a];

        p2.applySimpleAttraction( core );
        p2.update();
        p2.display();
      }
    }
    // for(let a=0; a<particles1.length; a++) {
    //   let p1 = particles1[a];
    //
    //   p1.applySimpleAttraction( core, 7 );
    //   p1.update();
    //   p1.display();
    // }
    //
    // //Second layer particle sphere
    //
    // for(let a=0; a<particles2.length; a++) {
    //   let p2 = particles2[a];
    //
    //   p2.applySimpleAttraction( core );
    //   p2.update();
    //   p2.display();
    // }
    //
    //
    // // ADD electrons
    // for(let a=0; a<electrons.length; a++){
    //   let e = electrons[a];
    //
    //   e.attractTo( core.pos );
    //   e.update();
    //   e.display();
    //
    // }

  }
}

function mousePressed(){
  stage += 1;
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
    vector.mult( params.angle );
  } else {
    if(random(1)< 0.5){
      vector.rotate(PI/2);
    }else {
      vector.rotate(-PI/2);
    }
    vector.mult( params.angle );
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

  applyForce(f){
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }

  applySimpleAttraction(other) {
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag();
    f.normalize();
    f.mult(0.9); // play with this value!

    // *** check this out! ***
    // if (distance < other.rad) {
    //   let adj = 30.0; // play with this value!
    //   f.mult(-1 * adj);
    // }

    this.applyForce( f );
  }

  // applyGravitationalAttraction(other) {
  //   let f = p5.Vector.sub(other.pos, this.pos);
  //   let distance = f.mag(); // = this.pos.distance( other.pos );
  //   let gMag = (C_GRAVITY * this.mass * other.mass) / (distance * distance); // mag
  //   f.normalize(); // direction
  //   f.mult(gMag);
  //
  //   // *** check this out! ***
  //   if (distance < other.rad) {
  //     let adj = 10.0; // play with this value!
  //     f.mult(-1 * adj);
  //   }
  //
  //   this.applyForce( f );
  // }

  display(){
    push();
    let amp, freq;
    let strokeOpacity, centerOpacity;

    strokeOpacity = 100;
    centerOpacity = 20;

    amp = random(8,12);
    freq = frameCount * 0.08;
    let cosValue = cos(freq) * amp;
    // translate(this.pos.x, this.pos.y);
    // fill(100,220,100);
    // ellipse(0,0,10,10);
    let opa1 = 255;
    for(let r = 0; r<25; r+=1){
      let colorR = map(r,0,20,255,100);
      let colorG = map(r,0,20,255,180);
      let colorB = map(r,0,20,255,100);
      noFill();
      strokeWeight(1);
      stroke(colorR,colorG,colorB,opa1)
      ellipse(this.pos.x, this.pos.y, r+cosValue,r+cosValue);
      opa1 -= 9;
    }
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

  applySimpleAttraction(other) {
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag();
    f.normalize();
    f.mult(0.9); // play with this value!

    // *** check this out! ***
    // if (distance > other.rad) {
    //   let adj = 30.0; // play with this value!
    //   f.mult(-1 * adj);
    // }

    this.applyForce( f );
  }

  // applyGravitationalAttraction(other) {
  //   let f = p5.Vector.sub(other.pos, this.pos);
  //   let distance = f.mag(); // = this.pos.distance( other.pos );
  //   let gMag = (C_GRAVITY * this.mass * other.mass) / (distance * distance); // mag
  //   f.normalize(); // direction
  //   f.mult(gMag);
  //
  //   // *** check this out! ***
  //   if (distance > other.rad) {
  //     let adj = 10.0; // play with this value!
  //     f.mult(-1 * adj);
  //   }
  //
  //   this.applyForce( f );
  // }

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
    let amp, freq;
    let strokeOpacity, centerOpacity;

    strokeOpacity = 100;
    centerOpacity = 20;

    amp = random(5,10);
    freq = frameCount * 0.05;
    let sinValue = sin(freq) * amp;

    push();
    // translate(this.pos.x, this.pos.y);
    // strokeWeight(1);
    // stroke(140,100,100,strokeOpacity);
    // fill(240,100,100,centerOpacity);
    // ellipse(0,0,this.rad+sinValue,this.rad+sinValue);
    let opa1 = 255;
    for(let r = 0; r<25; r+=1){
      let colorR = map(r,0,20,255,102);
      let colorG = map(r,0,20,255,186);
      let colorB = map(r,0,20,255,183);
      noFill();
      strokeWeight(1);
      stroke(colorR,colorG,colorB,opa1)
      ellipse(this.pos.x, this.pos.y, r+sinValue,r+sinValue);
      opa1 -= 9;
    }

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

    this.vel.mult(1);
    this.vel.limit(25);
  }

  attractTo(target) {
  let f = p5.Vector.sub(target, this.pos);
  //f.normalize(); // get the direction
  //f.mult(1); // mag is now 5px.
  f.mult(params.attraction);
  this.applyForce( f );
}

// Simple Attraction testing: fail

// applySimpleAttraction(other) {
//   let f = p5.Vector.sub(other.pos, this.pos);
//   let distance = f.mag();
//   f.normalize();
//   f.mult(0.2); // play with this value!
//
//   // *** check this out! ***
//   if (distance < other.rad) {
//     // let adj = 30.0; // play with this value!
//     f.mult(-1 * params.eAdj);
//   }
//
//   this.applyForce( f );
// }

// GravitationalAttraction testing: fail

// applyGravitationalAttraction(other) {
//   let f = p5.Vector.sub(other.pos, this.pos);
//   let distance = f.mag(); // = this.pos.distance( other.pos );
//   let gMag = (params.k_value * this.mass * other.mass) / (distance * distance); // mag
//   f.normalize(); // direction
//   f.mult(gMag);
//
//   // *** check this out! ***
//   if (distance < other.rad/5) {
//     // let adj = 10.0; // play with this value!
//     f.mult(-1 * params.eAdj);
//   }
//
//   this.applyForce( f );
// }



  applyForce(f){
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }

  display(){
    push();
    let opa1 = 255;
    for(let r = 0; r<7; r+=1){
      let colorR = map(r,0,20,230,180);
      let colorG = map(r,0,20,150,100);
      let colorB = map(r,0,20,150,100);
      noFill();
      strokeWeight(1);
      stroke(colorR,colorG,colorB,opa1)
      ellipse(this.pos.x, this.pos.y, r,r);
      opa1 -= 9;
    }

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

  applySimpleAttraction(other, adj) {
    if (adj == undefined || adj < 1) {
      adj = 1;
    }
    let f = p5.Vector.sub(other.pos, this.pos);
    let distance = f.mag();
    f.normalize();
    f.mult(0.5); // play with this value!

    // *** check this out! ***

    if (distance < other.rad/adj) {

      let max = other.rad/adj;
      let range = params.range; //0.3 0.4 0.5
      let mag = map(distance, max, max * 0.6, -range/2, range);
      let value = random(mag - range, mag + range);

      //let range = 5;
      //let mag = map(distance, max, max * 0.6, -range/2, range);
      //let freqX = frameCount * 0.005 + this.pos.x * 0.01;
      //let freqY = frameCount * 0.005 + this.pos.y * 0.01;
      //let value = noise(freqX, freqY) * mag + random(-mag, mag)*0.5;

      f.mult(-1 * value * params.adj);
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
