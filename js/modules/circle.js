'use strict';
document.addEventListener('DOMContentLoaded', () => {
  var watermarkCircle = document.querySelector('.watermark-circle');
  let watermarkCss = `visibility: visible; opacity: 1`;
  if (watermarkCircle) {
    watermarkCircle.style = watermarkCss;
    const svgElement = watermarkCircle.querySelector('svg');
    const circle = svgElement.querySelector('circle');
    const radius = circle.getAttribute('r');
    const circumference = 2 * Math.PI * radius;

    // Set initial stroke properties for anim ation
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    let start = null;
    let duration = 3000;
    const circleAnim = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      circle.style.strokeDashoffset = circumference * (1 - progress);
      //  svgElement.style.transform = `rotate(${360 * progress}deg)`;
      if (progress < 1) {
        requestAnimationFrame(circleAnim);
      } else {
        // Once the circle animation is complete, start the line animation
        setTimeout(startLineAnimation, 100);
      }
    };
    requestAnimationFrame(circleAnim);

    var watermarkLine = document.querySelector('.watermark-circle-line');
    watermarkLine.style.width = '0';
    function startLineAnimation() {
      let lineStart = null;

      const circleLine = (timestamp) => {
        if (!lineStart) lineStart = timestamp;
        const elapsed = timestamp - lineStart;
        const progress = Math.min(elapsed / duration, 1);
        watermarkLine.style.width = `${100 * progress}vw`;
        if (progress < 1) {
          requestAnimationFrame(circleLine);
        }
      };

      requestAnimationFrame(circleLine);
    }
  }
});
