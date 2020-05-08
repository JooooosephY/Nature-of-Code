let angle;
let diffFirst;
let windAngle;

function setup() {
  createCanvas(600, 600);
  background(220);
  diffFirst = random(0, 5);
  angle = PI/6;
  windAngle = 0;
}

function draw() {
  background(220);
  //angle = map(mouseX, 0, width, PI/2, 0);
  windAngle = map(noise(frameCount * 0.01), 0, 1, -0.01, 0.01);

  for (let i = 0; i < 3; i++) {
    push();
    translate(width/2, height);
    branch( 150, diffFirst + i*10 );
    pop();
  }
}


function branch(len, diff) {
  let thickness = map(len, 0, 200, 1, 10);
  strokeWeight(thickness);
  line(0, 0, 0, -len);

  translate(0, -len);

  //noise(freq + offset)
  len = len * 2/3 * map(noise(diff), 0, 1, 0.70, 1.30);

  if (len > 8) {
    push();
    rotate(angle + map(noise(diff + 0.3) + windAngle, 0, 1, -0.7, 0.7));
    branch(len, diff+1);
    pop();

    push();
    rotate(-angle + map(noise(diff + 2) + windAngle, 0, 1, -0.7, 0.7));
    branch(len, diff+5);
    pop();
  }
}














// :D
