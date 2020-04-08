let balls = [];
let centerball;
let springs = [];

// JSON
let params = {
  k: 0.2,
  C_gravity: 0.5,
  len: 100,
  m: 10,
  gravity: false
}

const gui = new dat.GUI();

gui.add(params, 'k').max(5).min(0).step(0.1);
gui.add(params, 'len').max(300).min(1).step(1);
gui.add(params, 'm').max(40).min(1).step(1);
gui.add(params, 'gravity');


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  centerball = new Ball(width/2, height/2, 30, 255, 0, 0);
}

function draw() {
  background(0);

  for (let i = 0; i < springs.length; i ++){
    springs[i].update();
    springs[i].display();
  }

  for (let i = 0; i < balls.length; i ++){
    b = balls[i];

    if(params.gravity){
      let gravity = createVector(0, params.C_gravity * b.mass);
      b.applyForce( gravity );
    }

    for (let j=0; j<balls.length; j++) {
      let other = balls[j];
      if (i != j) {
        b.checkCollision( other );
      }
    }

    b.checkEdges();
    b.drag();
    b.update();
    b.display();
  }

  centerball.drag();
  centerball.update();
  centerball.display();
}

function mouseClicked(){
  if (balls.length == 0){
    balls.push(new Ball(mouseX, mouseY, params.m, 255, 255, 255));
    springs.push(new Spring(centerball, balls[balls.length - 1], params.len));
  }else if(balls.length == 1){
    balls.push(new Ball(mouseX, mouseY, params.m, 255, 255, 255));
    springs.push(new Spring(centerball, balls[balls.length - 1], params.len));
    let vector = p5.Vector.sub(balls[balls.length - 1].pos, balls[balls.length - 2].pos);
    let distance = vector.mag();
    springs.push(new Spring(balls[balls.length - 1], balls[balls.length - 2], distance));
  }else{

    balls.push(new Ball(mouseX, mouseY, params.m, 255, 255, 255));
    springs.push(new Spring(centerball, balls[balls.length - 1], params.len));
    let ball = balls[balls.length - 1];
    let balla = balls[0];
    let ballb = balls[1];

    for (let i = 0; i < balls.length; i ++){
      b1 = balls[i];
      let dis = dist(ball.pos.x, ball.pos.y, b1.pos.x, b1.pos.y);
      let vector1 = p5.Vector.sub(ball.pos, balla.pos);
      let distance1 = vector1.mag();
      if (distance1 > dis && b1 != ballb && b1 != ball){
        balla = b1;
      }
    }

    for (let i = 0; i < balls.length; i ++){
      b2 = balls[i];
      let dis = dist(ball.pos.x, ball.pos.y, b2.pos.x, b2.pos.y);
      let vector2 = p5.Vector.sub(ball.pos, ballb.pos);
      let distance2 = vector2.mag();
      if (distance2 > dis && b2 != balla && b2 != ball){
        ballb = b2;
      }
    }

    for (let i = 0; i < springs.length; i ++){
      s = springs[i];
      if (s.ballA == balla && s.ballB == ballb || s.ballA == ballb && s.ballB == balla){
        springs.splice(i, 1);
      }
    }

    let vector = p5.Vector.sub(ball.pos, balla.pos);
    let distance = vector.mag();
    springs.push(new Spring(ball, balla, distance));
    vector = p5.Vector.sub(ball.pos, ballb.pos);
    distance = vector.mag();
    springs.push(new Spring(ball, ballb, distance));

  }
}

class Ball {
  constructor(x, y, m, r, g, b) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.mass = m;
    this.rad = m;
    this.r = r;
    this.g = g;
    this.b = b;

    // ***
    this.damping = 0.90; // 0.90 ~ 0.98
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    // **
    this.vel.mult(this.damping);
  }

  checkCollision(other) {
    let vector = p5.Vector.sub(other.pos, this.pos);
    let distance = vector.mag();
    if (distance < this.rad + other.rad) {
      let force = createVector();

      // this
      force = vector.copy();
      force.mult(-1);
      force.normalize();
      force.mult( other.vel.mag() * 3 );
      //force.mult(0.1);
      this.applyForce( force );

      //other
      force = vector.copy();
      force.normalize();
      force.mult( this.vel.mag() * 3 );
      other.applyForce( force );

    }
  }

  checkEdges() {
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x *= -1;
    }
    else if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x *= -1;
    }
    if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y *= -1;
    }
    else if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.y *= -1;
    }
  }

  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add( force );
  }

  display() {
    push();
    fill(this.r, this.g, this.b, 150);
    stroke(255);
    ellipse(this.pos.x, this.pos.y, this.rad*2, this.rad*2);
    pop();
  }

  drag() {
    let distance = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    if (mouseIsPressed && distance < this.rad) {
      this.pos.x = mouseX;
      this.pos.y = mouseY;
    }
  }
}


class Spring {
  constructor(a, b, len) {
    this.ballA = a;
    this.ballB = b; // passing reference of the object!
    this.len = len;
    this.k = params.k;
  }

  update() {
    let vector = p5.Vector.sub(this.ballA.pos, this.ballB.pos);
    let distance = vector.mag();
    let direction = vector.copy().normalize();
    let stretch = distance - this.len;

    // hooke's law
    let mag = -1 * this.k * stretch;
    let force = direction.copy();
    force.mult(mag);
    this.ballA.applyForce( force );
    force.mult(-1);
    this.ballB.applyForce( force );
  }

  display() {
    push();
    stroke(255, 0, 0);
    strokeWeight(2);
    line(this.ballA.pos.x, this.ballA.pos.y, this.ballB.pos.x, this.ballB.pos.y);
    pop();
  }
}






//:D
