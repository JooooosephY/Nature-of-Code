let bubbles = [];
let bg;

function preload(){
  bg = loadImage("img/colaa.png");
}

function setup() {
  let cnv = createCanvas(700,600);
  cnv.position(350, 100);

  background(220);
  for (let i=0; i<600; i++) {
    bubbles.push( new bubble(random(width), height) );
  }
}

function draw() {
  background(50, 20, 0);

  bubbles.push( new bubble(random(width), height) );

  for (let i=0; i<bubbles.length; i++) {
    let b = bubbles[i];
    b.acc = createVector(0, random(-0.05));
    b.update();
    b.display();
    b.updateLifespan();
    b.stop();
  }

  for (let i = bubbles.length-1; i >= 0; i--) {
    if (bubbles[i].isDone) {
      bubbles.splice(i, 1);
    }
  }

  while (bubbles.length > 900) {
    bubbles.splice(0, 1);
  }

  image(bg, 0, 0);

}

function keyPressed() {
  for (let i=0; i<bubbles.length; i++) {
    let b = bubbles[i];
      b.explode();
    }
  }

class bubble {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector( 0, -0.4 );
    this.acc = createVector();
    this.size = random(5, 10);
    this.isExploded = false;
    this.isStopped = false;
    this.lifespan = 1.0;
    this.lifeReduction = random(0.002, 0.004);
    this.isDone = false;
  }

  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0.0) {
      this.isDone = true;
    }
  }

  stop(){
    if(this.pos.y <= 253){
      this.vel.y = 0;
      this.pos.y += random(-2,2);
      this.isStopped = true;
    }
  }

  update() {
    if (this.isExploded) {
      this.vel.mult(0.8);
    }

    if(this.isStopped == false){
      this.vel.add( this.acc );
      this.pos.add( this.vel );
      this.acc.mult(0);
      this.size +=0.01;
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(255, 150*this.lifespan);
    noStroke();
    ellipse(0, 0, this.size*this.lifespan, this.size*this.lifespan);
    pop();
  }

  explode() {
    let angle = random(PI);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(15);
    this.isExploded = true;
  }
}
