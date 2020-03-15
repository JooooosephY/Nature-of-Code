let size = 500;
function setup() {
  createCanvas(displayWidth,displayHeight);
  background(0);
}


function draw() {
  push();
  translate(width/2, height/2)
  noStroke();
  fill(255,255,0);
  ellipse(0, 0, size);
  fill(0);
  ellipse(0-size*0.3, 0-size*0.1, 0.15*size, 0.15*size);
  ellipse(0+size*0.3, 0-size*0.1, 0.15*size, 0.15*size);
  fill(0,255,255);
  rect(0-size*0.35, 0-size*0.05, 0.1*size, 0.5*size);
  rect(0+size*0.25, 0-size*0.05, 0.1*size, 0.5*size);
  fill(255);
  arc(0, 0 + size * 0.25, size*0.55, size*0.55, PI, PI * 2);
  pop();
}
