'use strict';

var watermarkCircle = document.querySelector('.watermark-circle');
const svgElement = watermarkCircle.querySelector('svg');
const circle = svgElement.querySelector('circle');
const radius = circle.getAttribute('r');
const circumference = 2 * Math.PI * radius;

// Set initial stroke properties for animation
circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

let start = null;
let duration = 2000;
const circleAnim = (timestamp) => {
  if (!start) start = timestamp;
  const elapsed = timestamp - start;
  const progress = Math.min(elapsed / duration, 1);
  circle.style.strokeDashoffset = circumference * (1 - progress);
  //   svgElement.style.transform = `rotate(${360 * progress}deg)`;
  requestAnimationFrame(circleAnim);
};
requestAnimationFrame(circleAnim);

var watermarkLine = document.querySelector('.watermark-circle-line');
watermarkLine.style.width = '0';
const circleLine = (timestamp) => {
  if (!start) start = timestamp;
  const elapsed = timestamp - start;
  const progress = Math.min(elapsed / duration, 1);
  watermarkLine.style.width = `${100 * progress}vw`;
  requestAnimationFrame(circleLine);
};
requestAnimationFrame(circleLine);
