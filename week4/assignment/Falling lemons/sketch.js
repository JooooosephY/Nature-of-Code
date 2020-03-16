const C_GRAVITY = 0.1;
let H_WATER;
let lemons = [];
let tree;
let ground;
let count = 0;

function preload(){
  tree = loadImage("lemon-tree.png");
  ground = loadImage("ground.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0);

  // water
  H_WATER = height - 400
  push();
  fill(80, 80, 255, 150);
  rect(0, height-H_WATER, width, H_WATER);
  pop();

  // ground
  push();
  fill(237, 189, 101);
  noStroke();
  translate(width/2 - 320, 400);
  rect(0, 0, 640, H_WATER);
  pop();

  // generate one lemon per 50 frames
  if (count == 0){
    lemons.push(new Lemon(random(width/2 - 280, width/2 + 280), random(90, 240), random(5,8)));
    count ++;
  }else if (count < 50){
    count ++;
  }else if (count == 50){
    count = 0;
  }

  for (let i=0; i<lemons.length; i++) {
    let p = lemons[i];

    // gravity
    let gravity = createVector(0, C_GRAVITY * p.mass);
    p.applyForce( gravity );

    // support force
    let support = p5.Vector.mult(gravity, -1);

    // wind force
    let wind = createVector(map(mouseX, 0, width, -1, 1), map(mouseY, 0, height, -0.4, 1));

    // friction or resistance-like effect
    let force = p5.Vector.mult(p.vel, -1);

    if (p.pos.y < height-H_WATER) {
      p.applyForce( wind );
      // air
      force.mult(0.10);
      p.applyForce( force );
    } else {
      if (p.pos.x < width/2 - 320 || p.pos.x > width/2 + 320){
        p.applyForce( wind );
        force.mult(2);
        p.applyForce( force );
      }else{
        force.mult(0.5);
        p.applyForce( force );
        p.applyForce( support );
        p.applyForce( wind );
      }
    }

    if (p.is_done){
      lemons.splice(i, 1);
    }

    p.update();
    p.display();
  }


  image(tree, width/2 - 320, 0);

}



class Lemon {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector();
    if (m < 1 ) m = 1;

    this.mass = m; // this cannot be 0 !!
    this.rad = m * 2;

    this.lifespan = 1.0;
    this.reduction = 0.001;
    this.is_done = false;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= this.reduction;

    if (this.lifespan <= 0){
      this.is_done = true;
    }
  }

  applyForce( f ) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add( force );
  }

  // display the lemon
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(255, 255, 0);
    strokeWeight(2);
    ellipse(0, 0, this.rad*3, this.rad*2);
    rectMode(CENTER);
    rect(this.rad * 1.5, 0, this.rad/ 6, this.rad / 3, 30);
    arc(- this.rad * 1.5, 0, this.rad/6, this.rad/6, PI/ 2, -PI/2, OPEN);
    pop();
  }
}
