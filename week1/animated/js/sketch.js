let radius = 15;
let dif = 0.3;


function setup() {
  createCanvas(displayWidth,displayHeight);
}


function draw() {
  background(0);

  push(); //joker

  translate(width/3, height/8);

  fill(255,250,225); //head
  noStroke();
  rect(180,90,140,90,40);
  ellipse(250,170,140);

  fill(205,170,125); //ears
  triangle(183,142,171,146,181,164);
  triangle(317,137,329,146,319,164);

  fill(34 ,139, 34); //hair
  arc(250, 120, 140, 100, PI, PI*2 ,OPEN);

  fill(255,51,26); //mouth
  ellipse(250,210,radius,25);
  radius += dif;
  if (radius > 45){
    dif = -dif;
  }else if (radius < 15){
    dif = -dif;
  }


  fill(0); //eyebrow
  triangle(200,124,230,128,230,134);
  triangle(300,124,270,128,270,134);

  fill(0,0,128); //eyes
  quad(210,133,190,145,210,160,235,148);
  quad(290,133,310,145,290,160,265,148);

  fill(190,5,5);   //nose
  ellipse(250,175,20);

  fill(255,50,41); //clothes
  quad(250,240,140,260,140,420,250,420);
  quad(250,240,360,260,360,420,250,420);
  fill(0);
  for (let i = 260; i < 400; i += 18){
    ellipse(250,i,10);
  }

  stroke(255); //hands
  fill(255,50,41);
  triangle(140,260,120,310,258,420);
  triangle(360,260,380,310,258,420);

  pop();

  push(); //stick

  translate(width/2, height/2);
  strokeWeight(3);
  stroke(255,100,100);
  beginShape(LINES);
  vertex(0,0);
  vertex(0,200);
  endShape();

  pop();

  //pinwheel
  for (let angle = 0; angle<360; angle += 90){
    push();

    translate(width/2, height/2);
    rotate(-frameCount/40);
    rotate( radians(angle) );
    fill(150);
    beginShape(TRIANGLES);
    vertex(0,0);
    vertex(-60,0);
    vertex(-60,-80);
    endShape();

    fill(255);
    scale(1.25);
    rotate( radians(53) );
    beginShape(TRIANGLES);
    vertex(0,0);
    vertex(-80,0);
    vertex(-80,-60);
    endShape();

    pop();
  }

}
