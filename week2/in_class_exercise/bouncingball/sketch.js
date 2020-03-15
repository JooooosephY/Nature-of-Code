let x = [];
let y = [];
let size = [];
let xSpd = [];
let ySpd = []; // empty array


function setup() {
  createCanvas(400, 500);
  background(220);


  for (let i=0; i<100; i++) {
    x[i] = width/2;
    y[i] = height/2;
    size[i] = 30;
    xSpd[i] = random(-5, 5);
    ySpd[i] = random(-5, 5);
  }
}


function draw() {
  background(220);

  for (let i=0; i<100; i++) {
    // update
    x[i] += xSpd[i];
    y[i] += ySpd[i];
    // check
    if (x[i] < 0 || x[i] > width) {
      xSpd[i] = -xSpd[i];
    }
    if (y[i] < 0 || y[i] > height) {
      ySpd[i] = -ySpd[i];
    }
    // display
    ellipse(x[i], y[i], size[i], size[i]);
  }

}







//
