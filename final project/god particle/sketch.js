const C_GRAVITY = 10;

var myCanvas = null;

// Declare kinectron
var kinectron = null;

// drawHand variables
var start = 30;
var target = 50;
var diameter = start;
var light = 255;
var dark = 100;
var hueValue = light;
var lerpAmt = 0.3;
var state = 'ascending';

var both_hands;

//field
let rows, cols;
let angles = [];

let x;
let adjFreq = 0.02;
let count = 0;
let transformed1 = false;
let transformed2 = false;
const RESOLUTION = 40;


let vehicles = [];

let vector1;
let vector2;

// JSON
let params = {
  debug_mode: false
}

const gui = new dat.GUI();
gui.add(params, 'debug_mode');

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);
  background(0);
  x = width / 2;

  noStroke();

  // Define and create an instance of kinectron
  var kinectronIpAddress = "10.209.30.11"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Connect with application over peer
  kinectron.makeConnection();

  // Request all tracked bodies and pass data to your callback
  kinectron.startTrackedBodies(bodyTracked);

}

function draw() {
  background(0, 10);

  if(x < width){
    vehicles.push(new Vehicle(x, sin(frameCount * adjFreq) * 100 + height / 2));
    vehicles.push(new Vehicle(width - x, sin(frameCount * adjFreq) * 100 + height / 2));
    x ++;
  }

  cols = ceil(width / RESOLUTION);
  rows = ceil(height / RESOLUTION);

  if(both_hands){
    if((both_hands.leftHandState == 'notTracked' || both_hands.leftHandState == 'unknown') && (both_hands.rightHandState == 'notTracked' || both_hands.rightHandState == 'unknown')){
      console.log("case 1");
      // vector1 = createVector(mouseX, mouseY);
      // update and display the vehicles
      for (let i=0; i<vehicles.length; i++) {
        let v = vehicles[i];
        // v.applyRepulsion(vector1);
        v.update();
        v.reappear();
        v.display();
      }
    }else if (both_hands.leftHandState == 'lasso' || both_hands.rightHandState == 'lasso'){
      console.log("case2");
      // flow field
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {

          let x = c * RESOLUTION;
          let y = r * RESOLUTION;

          let freqX = x * 0.001 ;
          let freqY = y * 0.001 ;
          let noiseValue = noise(freqX, freqY); // range 0 to 1
          let angleFlowField = map(noiseValue, 0, 1, 0, TWO_PI);

          let sinValue = sin(frameCount * 0.01);
          vector1 = createVector(both_hands.leftHand.depthX * myCanvas.width - x, both_hands.leftHand.depthY * myCanvas.height - y);
          vector2 = createVector(both_hands.rightHand.depthX * myCanvas.width - x, both_hands.rightHand.depthY * myCanvas.height - y);

          let angleHand1 = vector1.heading();
          let angleHand2 = vector2.heading();

          let index = c + r * cols; //let index = x + y * width;

          let angle = angleFlowField * 1.0 + angleHand1 * 1 + angleHand2 * 1;
          angles[index] = angle;

          if (params.debug_mode){
            stroke(255);
            fill(0);
            rect(x, y, RESOLUTION, RESOLUTION);
            push();
            translate(x + RESOLUTION/2, y + RESOLUTION/2);
            rotate(angle);
            stroke(255);
            line(0, 0, RESOLUTION/2, 0);
            pop();
          }


        }
      }

      // update and display the vehicles
      for (let i=0; i<vehicles.length; i++) {
        let v = vehicles[i];

        let c = floor(v.pos.x / RESOLUTION);
        let r = floor(v.pos.y / RESOLUTION);
        let index = c + r * cols;

        v.flow( angles[index] );

        v.update();
        v.reappear();
        v.display();
      }

    }else if (both_hands.leftHandState == 'clapping' && both_hands.rightHandState == 'clapping'){
      console.log("case3");
      for (let i=0; i<vehicles.length; i++) {
        let v = vehicles[i];
        v.explode();
        v.update();
        v.reappear();
        v.display();
      }
    }else if (both_hands.leftHandState == 'closed' && both_hands.rightHandState == 'closed'){
      console.log("case4");
      vector1 = createVector(both_hands.leftHand.depthX * myCanvas.width, both_hands.leftHand.depthY * myCanvas.height);
      vector2 = createVector(both_hands.rightHand.depthX * myCanvas.width, both_hands.rightHand.depthY * myCanvas.height);
      let vec_dis = p5.Vector.sub(vector1, vector2);
      if (vec_dis.mag() < 450){
        for (let i=0; i<vehicles.length; i++) {
          let v = vehicles[i];
          v.seek(vector1);
          v.seek(vector2);

          v.update();
          v.reappear();
          v.display();
        }
      }else{
        let vec_array = [vector1, vector2];
        for (let i=0; i<vehicles.length; i++) {
          let v = vehicles[i];
          v.seekArray(vec_array);

          v.update();
          v.reappear();
          v.display();
        }
      }
    }else{
      vector1 = createVector(both_hands.leftHand.depthX * myCanvas.width, both_hands.leftHand.depthY * myCanvas.height);
      vector2 = createVector(both_hands.rightHand.depthX * myCanvas.width, both_hands.rightHand.depthY * myCanvas.height);

      // update and display the vehicles
      for (let i=0; i<vehicles.length; i++) {
        let v = vehicles[i];
        if (both_hands.leftHandState == 'open'){
          v.applyRepulsion(vector1);
        }else if (both_hands.leftHandState == 'closed'){
          v.seek(vector1);
        }

        if (both_hands.rightHandState == 'open'){
          v.applyRepulsion(vector2);
        }else if (both_hands.rightHandState == 'closed'){
          v.seek(vector2);
        }

        v.update();
        v.reappear();
        v.display();
      }
    }
  }else{
    console.log("case6");
    // vector1 = createVector(mouseX, mouseY);
    // update and display the vehicles
    for (let i=0; i<vehicles.length; i++) {
      let v = vehicles[i];
      // v.applyRepulsion(vector1);
      v.update();
      v.reappear();
      v.display();
    }
  }

  if (params.debug_mode){
    fill(255);
    text("Framerate: " + floor(frameRate()), 20, 10);
    text("Number: " + vehicles.length, 20, 30);
  }


}

function bodyTracked(body) {
  // Get the hands off the tracked body and do somethign with them
  kinectron.getHands(drawHands);
}

// Draw hands
function drawHands(hands) {
  both_hands = hands;

  //check if hands are touching
  if ((Math.abs(hands.leftHand.depthX - hands.rightHand.depthX) < 0.01) && (Math.abs(hands.leftHand.depthY - hands.rightHand.depthY) < 0.01)) {
    hands.leftHandState = 'clapping';
    hands.rightHandState = 'clapping';
  }

  // draw hand states
  updateHandState(hands.leftHandState, hands.leftHand);
  updateHandState(hands.rightHandState, hands.rightHand);
}

// Find out state of hands
function updateHandState(handState, hand) {
  switch (handState) {
    case 'closed':
    drawHand(hand, 1, 255);
    break;

    case 'open':
    drawHand(hand, 0, 255);
    break;

    case 'lasso':
    drawHand(hand, 0, 255);
    break;

    // Created new state for clapping
    case 'clapping':
    drawHand(hand, 1, 'red');
  }
}

// Draw the hands based on their state
function drawHand(hand, handState, color) {
  fill(color);

  // Kinect location needs to be normalized to canvas size

  ellipse(hand.depthX * myCanvas.width, hand.depthY * myCanvas.height, 10, 10);

}

class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.mass = 5;
    this.rad = 2;
    this.angle = 0;

    this.r = map(this.pos.x, 0, width, 0, 360);
    this.g = map(this.pos.y, 0, height, 0, 100);
    this.b = map(this.pos.x + this.pos.y, 0, width + height, 40, 100);

    this.maxSpeed = 10;    // max desired vel
    this.maxForce = 0.05;  // max steering force

    this.detectRad = 100;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.angle = this.vel.heading();
    this.vel.mult(0.98);

    if (this.vel.mag() > 0){
      this.r = map(this.vel.mag(), 0, this.maxSpeed, 0, 360);
      this.g = map(this.vel.mag(), 0, this.maxSpeed, 50, 100);
      this.b = map(this.vel.mag(), 0, this.maxSpeed, 50, 100);
      this.rad = map(this.vel.mag(), this.maxSpeed, 0, 0.5, 2);
    }
  }

  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }

  flow( angle ) {
    let desiredVel = p5.Vector.fromAngle( angle );
    desiredVel.mult(this.maxSpeed);

    let steerForce = p5.Vector.sub(desiredVel, this.vel);
    steerForce.limit(this.maxForce);
    steerForce.mult(this.mass);
    this.applyForce( steerForce );
  }

  seek( target_vec ) {
    let desiredVel = p5.Vector.sub(target_vec, this.pos);
    let distance = desiredVel.mag();

    desiredVel.normalize();
    if(distance > this.detectRad) {
      desiredVel.mult(this.maxSpeed);
    } else {
      let speed = map(distance, 0, this.detectRad, 0, this.maxSpeed);
      desiredVel.mult(speed);
    }

    let steerForce = p5.Vector.sub(desiredVel, this.vel);
    steerForce.limit(this.maxForce);
    steerForce.mult(this.mass);
    this.applyForce( steerForce );
  }

  seekArray( target_array ) {
    let target_vec = target_array[0];
    // find the closest target vector
    for (let i = 0; i < target_array.length; i ++){
      let t = target_array[i];
      let d1 = p5.Vector.sub(target_vec, this.pos);
      let d2 = p5.Vector.sub(t, this.pos);
      if (d2.mag() < d1.mag()){
        target_vec = t;
      }
    }

    let desiredVel = p5.Vector.sub(target_vec, this.pos);
    let distance = desiredVel.mag();

    desiredVel.normalize();
    if(distance > this.detectRad) {
      desiredVel.mult(this.maxSpeed);
    } else {
      let speed = map(distance, 0, this.detectRad, 0, this.maxSpeed);
      desiredVel.mult(speed);
    }

    let steerForce = p5.Vector.sub(desiredVel, this.vel);
    steerForce.limit(this.maxForce);
    steerForce.mult(this.mass);
    this.applyForce( steerForce );
  }

  reappear() {
    if (this.pos.x < 0) {
      this.pos.x = width;
    }
    else if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    }
    else if (this.pos.y > height) {
      this.pos.y = 0;
    }
  }

  applyGAttraction(vec) {
    let f = p5.Vector.sub(vec, this.pos);
    let distance = f.mag(); // = this.pos.distance( other.pos );
    let gMag = (C_GRAVITY * this.mass * 10) / (distance * distance); // mag
    f.normalize(); // direction
    f.mult(gMag);
    this.applyForce( f );
  }

  applyRepulsion(vec) {
    let f = p5.Vector.sub(vec, this.pos);
    let distance = f.mag();
    let gMag = (C_GRAVITY * this.mass * 10) / (distance * distance);
    f.normalize();
    f.mult(-gMag * 2);
    this.applyForce( f );
  }

  explode(){
    let angle = random(TAU);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(random(5, this.maxSpeed));
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    colorMode(HSB);
    fill(this.r, this.g, this.b);
    ellipse(0, 0, this.rad * 2, this.rad * 2);
    pop();
  }

}
