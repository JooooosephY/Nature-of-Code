function setup() {
  createCanvas(400, 400);
  // background(220);
}

function draw() {
  background(255);
  push();
  translate(width/2, height/2);
  fill(110,0,0);
  ellipse(0,0,10,10);
  fill(10,10,2200);
  ellipse(0,20,10,30);
  strokeWeight(2);
  fill(20,30,200);
  arc(40,20,70,70,PI*0.5,PI*-0.5);
  arc(-40,20,70,70,PI*-0.5,PI*0.5);
  pop();

}
