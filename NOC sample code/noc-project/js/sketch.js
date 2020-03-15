function setup() {
  // once
  createCanvas(400, 500);
  background(0);
}

function draw() {
  //loop forever
  // background(100); // clear
  for (let angle=0; angle<360; angle+=72) {
    push();
    translate(width/2, height/2);
    rotate( radians(angle) );
    rectMode(CENTER);
    noFill();
    strokeWeight(1);
    stroke(255,0,0,50);
    rect(0,0, frameCount, 80);
    pop();
  }

  // if (frameCount == 100) {
  //   noLoop();
  // }
}

// color
// 0 - 255
// (w)
// (w, a) alpha: opacity
// (r, g, b)
// (r, g, b, a) alpha: opacity

// console.log( frameCount );
// console.log( frameRate() );
// frameRate: 60 frames(images) per second
// 60 FPS
// frameRate(5);

// Angles
// radians: PI TWO_PI
// degrees: 90 180 360, ...
// radians( deg ) // covert degrees to radians
// degrees( rad ) // covert radians to degress
