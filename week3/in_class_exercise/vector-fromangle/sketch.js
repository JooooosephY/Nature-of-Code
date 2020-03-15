function setup() {
  createCanvas(400, 500);
  background(100);
}

function draw() {
  background(100);

  let center = createVector(width/2, height/2);
  let mouse = new p5.Vector(mouseX, mouseY);
  mouse.sub(center);

  push();
  translate(center.x, center.y);

  //let vector = createVector(mouse.x, mouse.y);
  //let vector = createVector(40, 30);
  let vector = p5.Vector.fromAngle(PI/2);
  stroke(255);
  strokeWeight(1);
  line(0, 0, vector.x, vector.y);

  //vector.normalize();
  vector.mult(100);

  let value = vector.mag(); //magSq();
  let angle = vector.heading(); // radians

  stroke(255,0,0);
  strokeWeight(3);
  line(0, 0, vector.x, vector.y);
  fill(255);
  noStroke();
  text(ceil(value), vector.x+10, vector.y);
  text(round( degrees(angle) ), vector.x+10, vector.y+20);

  pop();
}
