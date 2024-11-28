document.addEventListener('DOMContentLoaded', () => {
  const watermark = document.querySelector('.watermark-circle');
  let watermarkCss = `visibility: visible; opacity: 1`;
  if (watermark) {
    watermark.style = watermarkCss;
  const svgElement = watermark.querySelector('svg');
  const circle = svgElement.querySelector('circle');
  const radius = circle.getAttribute('r');
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  let start = null;
  const duration = 3000; 
  function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    const progress = Math.min(elapsed / duration, 1);

    circle.style.strokeDashoffset = circumference * (1 - progress);

    if (elapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      start = null;
      setTimeout(startLineAnimation, 100);
    }
  }

  requestAnimationFrame(animate);
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