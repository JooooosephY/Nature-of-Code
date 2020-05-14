const RESOLUTION = 30;
let rows, cols;
let angles = [];
let smokes = [];
let incenses = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  cols = ceil(width / RESOLUTION);
  rows = ceil(height / RESOLUTION);

  for (let i=0; i<1; i++) {
    incenses.push( new Incense(width/2, height) );
  }

  noCursor();
}

function draw() {
  //background(0);

  // flow field
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {

      let x = c * RESOLUTION;
      let y = r * RESOLUTION;

      let freqX = x * 0.001 + frameCount * 0.001;
      let freqY = y * 0.001 + frameCount * 0.001;
      let noiseValue = noise(freqX, freqY); // range 0 to 1
      let angleFlowField = map(noiseValue, 0, 1, 0, TWO_PI);

      let sinValue = sin(frameCount * 0.01) * PI/6;
      let vector = createVector(mouseX - x, mouseY - y);
      let angleMouse = vector.rotate(PI/2 + sinValue).heading();

      let index = c + r * cols; //let index = x + y * width;

      let angle = angleFlowField * 2.0 + angleMouse * 1.0;
      angles[index] = angle;


      // stroke(255);
      // fill(0);
      // rect(x, y, RESOLUTION, RESOLUTION);
      // push();
      // translate(x + RESOLUTION/2, y + RESOLUTION/2);
      // rotate(angle);
      // stroke(255);
      // line(0, 0, RESOLUTION/2, 0);
      // pop();

    }
  }

  //update incense
  for (let i = 0; i < incenses.length; i ++){
    let inc = incenses[i];

    inc.generateSmoke();
    // inc.display();
  }

  // update and display the vehicles
  for (let i=0; i<smokes.length; i++) {
    let s = smokes[i];

    let c = floor(s.pos.x / RESOLUTION);
    let r = floor(s.pos.y / RESOLUTION);
    let index = c + r * cols;

    s.flow( angles[index] );

    s.update();
    s.reappear();
    s.display();
  }
}


class Smoke {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.angle = 0;

    this.maxSpeed = 2;    // max desired vel
    this.maxForce = 0.05;  // max steering force

    this.detectRad = 80;

    this.foldingVel = random(0.03, 0.08);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.angle = this.vel.heading();
  }

  applyForce(f) {
    let force = f.copy();
    // no mass yet
    this.acc.add(force);
  }

  flow( angle ) {
    let desiredVel = p5.Vector.fromAngle( angle );
    desiredVel.mult(this.maxSpeed);

    let steerForce = p5.Vector.sub(desiredVel, this.vel);
    steerForce.limit(this.maxForce);
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

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(150, 50);
    ellipse(0, 0, 2, 2);
    pop();
  }
}

class Incense{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.length = 50;
    this.burning_spd = random(0.2, 0.5);
    this.isDone = false;
  }

  generateSmoke(){
    smokes.push(new Smoke(this.pos.x, this.pos.y - this.length));
  }

  display(){
    push();
    strokeWeight(3);
    stroke(255);
    line(this.pos.x, this.pos.y, this.pos.x, this.pos.y - this.length);
    noStroke();
    fill(200, 0, 0);
    ellipse(this.pos.x, this.pos.y - this.length, 4, 4);
    pop();
  }
}

















// :D
