const C_GRAVITY = 0.1;
let faceapi;
let video;
let detections;
let particles = [];
let snows = [];

// by default all options are set to true
const detection_options = {
  withLandmarks: true,
  withDescriptors: false,
}


function setup() {
  // createCanvas(1080, 810);
  createCanvas(windowWidth, windowHeight);

  // load up your video
  video = createCapture(VIDEO);
  video.size(width, height);
  // video.hide(); // Hide the video element, and just show the canvas
  faceapi = ml5.faceApi(video, detection_options, modelReady);
  textAlign(RIGHT);

  video.hide();

  for(let i = 0; i < 68; i ++){
    particles.push(new Particle(0,0));
  }
}


function modelReady() {
  console.log('ready!');
  console.log(faceapi);
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.log(err);
    return
  }
  // console.log(result)
  detections = result;
  faceapi.detect(gotResults);
}

function draw(){
  background(0);

  fill(255);
  text("Snow number: " + snows.length, 100, 20);
  text("FrameRate: " + Math.floor(frameRate()), 100, 60);

  snows.push(new Snow(random(width), random(-50, 0), random(2,4)));

  push();
  translate(width,0);
  scale(-0.7,1);
  image(video, 0,0, width, height);

  if (detections){
    if (detections.length > 0) {
      console.log(detections);
      let points = detections[0].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        let p = particles[i];
        p.update(points[i]._x, points[i]._y);
        p.display();
      }
    }
  }
  pop();

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
    let wind = createVector(0.1, 0);
    s.applyForce( wind );

    s.update();
    // s.checkEdges( waves );
    s.display();
  }

  // remove the snows which are done
  for (let i = snows.length - 1; i >= 0; i --){
    let s = snows[i];
    if(s.isDone){
      snows.splice(i, 1);
    }
  }


}

class Particle{
  constructor(x, y){
    this.pos = createVector(x, y);
  }

  display(){
    push();
    translate(this.pos.x, this.pos.y);
    // scale(-0.7,1);
    stroke(161, 95, 251);
    strokeWeight(4);
    point(0, 0);
    pop();
  }

  update(x, y){
    this.pos.x = x;
    this.pos.y = y;
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

    // Lifespan of the snow
    this.lifespan = 1.0; // 100%
    this.lifeReduction = random(0.003, 0.007);
    this.isDone = false;
  }

  update() {

    this.vel.add( this.acc );
    this.pos.add( this.vel );
    this.acc.mult(0);

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

  //   // debug_mode
  //   if (params.debug_mode){
  //     fill(255);
  //     text( int(this.lifeReduction * 1000), this.pos. x+10, this.pos. y);
  //   }
  }

}
