let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0);

  // the way to display a snowflake
  push();
  translate(width/2, height/2);
  rotate(PI/6);

  let current = new Particle(height / 2, 0);

  while (!current.finished && !current.intersects(particles)){
    current.update();
  }
  particles.push(current);

  for (let i = 0; i < 6; i ++){
    rotate(PI/3);

    for (let j = 0; j < particles.length; j ++){
      s = particles[j];
      s.show();
    }

    push();
    scale(1, -1);
    for (let j = 0; j < particles.length; j ++){
      s = particles[j];
      s.show();
    }
    pop();
  }
  pop();

}

class Particle{
  constructor(x, y, cx, cy){
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.centerpos = createVector(cx, cy);
    this.mass = 2;
    this.rad = 2;
    // this.tem = params.temperature;
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

  updatecenterpos(cx, cy){
    this.centerpos.x = cx;
    this.centerpos.y = cy;
  }

  checkEdges() {
    if (this.pos.x < 0 - this.centerpos.x) {
      this.pos.x = 0 - this.centerpos.x;
      this.vel.x *= -0.5;
    }else if (this.pos.x > width - this.centerpos.x) {
      this.pos.x = width - this.centerpos.x;
      this.vel.x *= -0.5;
    }else if (this.pos.y > height - 50 - this.centerpos.y) {
      this.pos.y = height - 50 - this.centerpos.y;
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
  }

}











// :D
