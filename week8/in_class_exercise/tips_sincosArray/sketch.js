let sinArray = [];
let cosArray = [];
let sinResolution = 360 * 4;

function setup() {
  createCanvas(400, 400);
  background(50);

  for (let i=0; i<sinResolution; i++) {
    let angle = map(i, 0, sinResolution, 0, TWO_PI);
    sinArray.push( sin(angle) );
    cosArray.push( cos(angle) );
  }
}

function draw() {
  background(0);

  push();

  translate(width/2, height/2);

  let freq, amp;
  let x, y, dia;

  noStroke();
  fill( 200, 30, 100);

  freq = frameCount * 0.010;
  amp = 100;
  x = mCos(freq) * amp;
  y = mSin(freq) * amp;

  circleDia = 200;
  ellipse(x, y, circleDia, circleDia);

  pop();
}

function mSin( angle ) {
  // won't work with negative angle values!
  let index = parseInt( map(angle % TWO_PI, 0, TWO_PI, 0, sinResolution) );
  return sinArray[index];
}

function mCos( angle ) {
  // won't work with negative angle values!
  let index = parseInt( map(angle % TWO_PI, 0, TWO_PI, 0, sinResolution) );
  return cosArray[index];
}












// :D
