function setup() {
  createCanvas(400, 400);
  background(220);
}

function draw() {
  background(200);

  let gridSize = 50;
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      //rect(x, y, gridSize, gridSize);
      spinningEllipse(x, y, gridSize, gridSize * 0.3, 0.0001 * x);
    }
  }
}

// module
function spinningEllipse(x, y, w, h, spd) {
  push();
  translate(x, y);
  rotate(frameCount * spd);
  ellipse(0, 0, w, h);
  pop();
}
