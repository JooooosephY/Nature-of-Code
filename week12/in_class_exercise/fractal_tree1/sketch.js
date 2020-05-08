let angle;

function setup() {
  createCanvas(600, 600);
  background(220);
  angle = PI/2;
}

function draw() {
  background(220);

  angle = map(mouseX, 0, width, PI/2, 0);

  translate(width/2, height);
  branch( 200 );
}


function branch(len) {
  let thickness = map(len, 0, 200, 1, 30);
  strokeWeight(thickness);
  line(0, 0, 0, -len);
  translate(0, -len);
  len = len * 2/3;

  if (len > 10) {
    push();
    rotate(angle);
    branch(len);
    pop();

    push();
    rotate(-angle);
    branch(len);
    pop();
  }
}














// :D
