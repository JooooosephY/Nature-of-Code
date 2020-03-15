function setup() {
  createCanvas(400, 400);
  background(220);
}

function draw() {
  background(200);

  stroke(255);
  noFill();
  beginShape();
  curveVertex(168,25);
  curveVertex(168,97);
  curveVertex(73,77);
  curveVertex(116,142);
  curveVertex(32,217);
  curveVertex(134,217);
  curveVertex(74,335);
  curveVertex(159,314);
  curveVertex(150,399);
  curveVertex(224,296);
  curveVertex(304,368);
  curveVertex(277,239);
  curveVertex(362 + cos(frameCount * 0.05) * 30,284 + sin(frameCount * 0.05) * 30);
  curveVertex(295,164);
  curveVertex(381,142);
  curveVertex(303,100);
  curveVertex(354,19);
  curveVertex(235,84);
  curveVertex(204,15);
  endShape(CLOSE);
}

function mousePressed() {
  console.log(" curveVertex(" + mouseX - width/2 + "," + mouseY - height/2 + ");");
}
