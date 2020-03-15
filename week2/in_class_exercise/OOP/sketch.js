let balls = [];

function setup() {
  createCanvas(400, 500);
  background(0);

  // generate 50 balls;
  for (let i=0; i<50; i++) {
    //balls[i] = new Ball();
    //balls.push( new Ball() );
  }
}


function draw() {
  background(0);

  // generate 1 ball per frame
  balls.push( new Ball(mouseX, mouseY) );

  // update and display the balls
  for (let i=0; i<balls.length; i++) {
    let b = balls[i];
    b.move();
    //b.bounce();
    b.updateLifespan();
    b.display();
  }

  // remove particles which are done!
  for (let i = balls.length-1; i >= 0; i--) {
    // flip the direction of for-loop!!
    if (balls[i].isDone) {
      balls.splice(i, 1);
    }
  }

  // limit the number of particles
  while (balls.length > 500) {
    balls.splice(0, 1); // index, how many?
  }

  fill(255);
  text( frameRate(), 10, 20 );
  text( balls.length, 10, 40 );
}

function mouseDragged() {
  balls.push( new Ball(mouseX, mouseY) );
}






// ES6 model
class Ball {
  constructor(x, y) {
    // properties
    this.x = x;
    this.y = y;
    this.size = random(3, 30);
    this.xSpd = random(-1, 1);
    this.ySpd = random(-1, 1);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);

    this.lifespan = 1.0; // 100%
    this.lifeReduction = random(0.002, 0.008);
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
    this.x += this.xSpd;
    this.y += this.ySpd;
  }
  bounce() {
    if (this.x < 0 || this.x > width) {
      this.xSpd *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.ySpd *= -1;
    }
  }
  display() {
    stroke(this.r, this.g, this.b, 255 * this.lifespan);
    fill(this.r, this.g, this.b, 120 * this.lifespan);
    ellipse(this.x, this.y, this.size * this.lifespan, this.size * this.lifespan);

    //fill(255);
    //text( int(this.lifespan * 100), this.x+10, this.y);
  }
}

















//




//
