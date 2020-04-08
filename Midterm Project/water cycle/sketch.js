let snowflakes = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0);

  // push();
  // translate(width/2, height/2);
  // rotate(PI/6);
  //
  // let current = new Particle(30, 0);
  //
  // while (!current.finished && !current.intersects(particles)){
  //   current.update();
  // }
  // particles.push(current);
  //
  //
  // for (let i = 0; i < 6; i ++){
  //   rotate(PI/3);
  //
  //   for (let j = 0; j < particles.length; j ++){
  //     s = particles[j];
  //     s.show();
  //   }
  //
  //   push();
  //   scale(1, -1);
  //   current.show();
  //   for (let j = 0; j < particles.length; j ++){
  //     s = particles[j];
  //     s.show();
  //   }
  //   pop();
  // }
  //
  // pop();

  for (let i =0; i < snowflakes.length; i ++){
    snowflakes[i].display();
  }

}

function mouseClicked(){
  snowflakes.push( new Snowflake(mouseX, mouseY));
}

class Snowflake{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.particles = [];
  }

  // display the snow flake
  display(){

    push();
    translate(this.pos.x, this.pos.y);
    rotate(PI/6);

    for(let i = 0; i < 10; i ++){
      let current = new Particle(30, 0);

      while (!current.finished && !current.intersects(this.particles)){
        current.update();
      }

      this.particles.push(current);

      for (let i = 0; i < 6; i ++){
        rotate(PI/3);

        for (let j = 0; j < this.particles.length; j ++){
          let p = this.particles[j];
          p.show();
        }

        push();
        scale(1, -1);
        current.show();
        for (let j = 0; j < this.particles.length; j ++){
          let p = this.particles[j];
          p.show();
        }
        pop();
      }

    }
    pop();
  }
}

class Particle{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.rad = 2;
    this.finished = false;
  }

  // update the position
  update(){
    this.vel = createVector(-1, random(-3,3));
    this.pos.add(this.vel);

    // constrain the particle in the slice
    let angle = this.pos.heading();
    angle = constrain(angle, 0, PI/6);
    let mag = this.pos.mag();
    this.pos = p5.Vector.fromAngle(angle);
    this.pos.setMag(mag);

    if (this.pos.x < 1){
      this.finished = true;
    }
  }

  // check whether the particle intersects other particles
  intersects(array){
    let result = false;
    for (let i = 0; i < array.length; i ++){
      let s = array[i];
      let d = dist(s.pos.x, s.pos.y, this.pos.x, this.pos.y);
      if (d < this.rad * 2){
        result = true;
        break;
      }
    }

    return result;
  }

  // show the particles
  show(){
    push();
    translate(this.pos.x, this.pos.y);
    fill(255);
    stroke(255);
    ellipse(0, 0, this.rad * 2, this.rad * 2);
    pop();
  }


}
