function setup() {
  createCanvas(400, 400);
  background(50);
}

function draw() {
  background(0, 40);
  push();
  blendMode(ADD);

  translate(width/2, height/2);

  let freq, amp;
  let x, y, dia;

  // debug
  //stroke(255, 0, 0);
  //noFill();

  // normal display
  noStroke();
  fill( 200, 30, 100, 10 );

  for (let i=0; i<30; i++) {
    freq = frameCount * (0.010 + i*0.01);
    amp = 10 + i*2;
    x = cos(freq) * amp;
    y = sin(freq) * amp;
    dia = sin(freq) * amp;

    circleDia = 100 + i * 2;
    ellipse(x, y, circleDia + dia, circleDia + dia);
  }

  pop();
}
