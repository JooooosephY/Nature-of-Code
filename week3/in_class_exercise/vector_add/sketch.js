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
  strokeWeight(3);

  let vector1 = createVector(100, 0);
  stroke(255, 0, 0);
  line(0, 0, vector1.x, vector1.y);

  let vector2 = createVector(0, 100);
  stroke(255, 255, 0);
  line(0, 0, vector2.x, vector2.y);

  // non-static
  //vector1.add(vector2); // v1 += v2
  // static
  //let vector3 = p5.Vector.add(vector1, vector2); // v3 = v1 + v2

  line(0, 0, vector1.x, vector1.y);

  vector1.mult(2);
  stroke(0, 0, 255);
  strokeWeight(2);
  line(0, 0, vector1.x, vector1.y);

  pop();
}
