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

  let vector = createVector(mouse.x, mouse.y);
  stroke(255);
  strokeWeight(1);
  line(0, 0, vector.x, vector.y);

  //vector.setMag(150);
  vector.limit(100);
  let value = vector.magSq();

  stroke(255,0,0);
  strokeWeight(3);
  line(0, 0, vector.x, vector.y);
  fill(255);
  noStroke();
  text(int(value), vector.x+10, vector.y);

  pop();
}
