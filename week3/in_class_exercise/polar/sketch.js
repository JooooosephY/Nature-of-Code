function setup() {
  createCanvas(400, 500);
  background(100);
}

function draw() {
  //background(100);

  let center = createVector(width/2, height/2);
  let mouse = new p5.Vector(mouseX, mouseY);
  mouse.sub(center);

  push();
  translate(center.x, center.y);

  /*
  let x = random(-50, 50);
  let y = random(-50, 50);
  let vec = createVector(x, y);
  */

  let dist = random(0, 100);
  let angle = random(TAU); // TWO_PI
  let vec = p5.Vector.fromAngle( angle );
  vec.mult( dist );

  ellipse(vec.x, vec.y, 10, 10);

  pop();
}
