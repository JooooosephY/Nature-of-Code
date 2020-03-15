let numbers = [1, 3, 5, 10];

function setup() {
  createCanvas(400, 400);
  background(220);

  numbers.push( 100 );
  console.log( numbers );

  numbers.splice(2, 1); // index, how many?
  console.log( numbers );
}

function draw() {
  //
}
