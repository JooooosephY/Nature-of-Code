let angle;

function setup() {
  createCanvas(600, 600);
  background(220);

  angle = PI/4;
  for (let i = 0; i < 3; i++) {
    push();
    translate(width/2, height);
    branch( random(140, 150) );
    pop();
  }
}

function draw() {
  //background(220);
  //angle = map(mouseX, 0, width, PI/2, 0);
  noLoop();
}


function branch(len) {
  let thickness = map(len, 0, 200, 1, 10);
  strokeWeight(thickness);
  line(0, 0, 0, -len);

  translate(0, -len);
  len = len * 2/3 * random(0.70, 1.20);

  if (len > 8) {
    push();
    rotate(angle + random(-0.3, 0.3));
    branch(len);
    pop();

    push();
    rotate(-angle + random(-0.3, 0.3));
    branch(len);
    pop();

    push();
    rotate(random(-0.4, 0.4));
    branch(len);
    pop();
  }
}














// :D
