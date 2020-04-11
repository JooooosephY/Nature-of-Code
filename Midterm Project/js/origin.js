// the way to display a snowflake
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
//   for (let j = 0; j < particles.length; j ++){
//     s = particles[j];
//     s.show();
//   }
//   pop();
// }
// pop();
//

// wave function
// function wave(yOffset, adjFreq, adjAmp, r, g, b) {
//   let freq; // time, angle (+ position)
//   let amp; // radDistance
//
//   for (let x = 0; x < width; x++) {
//     let y = yOffset;
//     if (params.temperature > 0){
//       freq = x * 0.005 + frameCount * 0.01;
//       amp = 20;
//       sinForAmp = mSin(freq) * amp;
//
//       freq = x * adjFreq;
//       amp = sinForAmp * adjAmp;
//       let sinValue = mSin(freq) * amp;
//
//       y += sinValue;
//     }
//
//     push();
//     stroke(r, g, b);
//     strokeWeight(2);
//     line(x, height,x,y);
//     pop();
//   }
// }
