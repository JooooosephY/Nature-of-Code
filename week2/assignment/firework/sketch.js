let fireworks = [];
let explosions = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}


function draw() {
  background(0);

  // generate 1 ball per frame
  fireworks.push( new Firework(random(width), random(height, height + 200)) );

  // update and display the fireworks
  for (let i=0; i<fireworks.length; i++) {
    let f = fireworks[i];
    f.move();
    f.updateLifespan();
    f.display();
  }

  // remove fireworks which are done!
  for (let i = fireworks.length-1; i >= 0; i--) {
    if (fireworks[i].isDone) {
      fireworks[i].explode();
      fireworks.splice(i, 1);
    }
  }

  // update and display the explosions
  for (let i=0; i<explosions.length; i++) {
    let e = explosions[i];
    e.move();
    e.updateLifespan();
    e.display();
  }

  // remove explosions which are done!
  for (let i = explosions.length-1; i >= 0; i--) {
    if (explosions[i].isDone) {
      explosions.splice(i, 1);
    }
  }

  // limit the number of particles
  while (fireworks.length > 500) {
    fireworks[0].explode();
  }

  // limit the number of explosions
  while (explosions.length > 1700){
    explosions.splice(0,1);
  }

  // Test the frameRate
  fill(255);
  text( frameRate(), 10, 20 );
}

function mouseClicked() {
  fireworks.push( new Firework(mouseX, mouseY) );
}



// Firework class
class Firework {
  constructor(x, y) {
    // properties
    this.x = x;
    this.y = y;
    this.size = random(10, 20);
    this.xSpd = 0; //random(-1, 1);
    this.ySpd = random(3, 6);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    // Lifespan of the firework
    this.lifespan = 1.0; // 100%
    this.lifeReduction = random(0.008, 0.015);
    this.isDone = false;
  }
  // methods

  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0.0) {
      this.isDone = true;
    }
  }

  move() {
    this.x -= this.xSpd;
    this.y -= this.ySpd;
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, 255 * this.lifespan);
    ellipse(this.x, this.y, this.size * this.lifespan, this.size * this.lifespan);
    fill(this.r, this.g, this.b, 120 * this.lifespan);
    ellipse(this.x, this.y + (this.size * this.lifespan)*1.5, this.size * this.lifespan * 0.5, this.size * this.lifespan * 3);

    // fill(255);
    // text( int(this.lifespan * 100), this.x+10, this.y);
  }

  explode(){
    for (let i = 0; i < 20; i++){
      explosions.push( new Explosion(this.x, this.y) );
    }
  }
}

// Explosion class
class Explosion {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.size = random(5, 20);
    this.xSpd = random(-2, 2);
    this.ySpd = random(-2, 2);
    this.r = random(0,255);
    this.g = random(0,255);
    this.b = random(0,255);
    this.lifespan = 0.5; // 50%
    this.lifeReduction = random(0.002, 0.008);
    this.isDone = false;
  }

  move() {
    this.x -= this.xSpd;
    this.y -= this.ySpd;
  }

  display(){
    noStroke();
    fill(this.r, this.g, this.b, 500 * this.lifespan);
    ellipse(this.x, this.y, this.size * this.lifespan, this.size * this.lifespan);

    // fill(255);
    // text( int(this.lifespan * 100), this.x+10, this.y);
  }

  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0.0) {
      this.isDone = true;
    }
  }
}
