let DesktopFun = function () {
  if ($(window).width() >= 1024) {
    let totHeight = 0;
    let totalSlides = document.querySelectorAll('.journey-module-slide').length;
    let slideIndex = 1;
    $('.module-fade-down').on('click', function (e) {
      e.preventDefault();
      $('.module-fade-up').removeClass('disabled');
      if (slideIndex < totalSlides) {
        let currentEle = $('.journey-module-slides').find(
          "[data-index='" + slideIndex + "']"
        );
        let nextslideHeight = currentEle.height();
        totHeight += nextslideHeight;
        let targetDiv = $('.journey-module-slides').css({
          marginTop: -totHeight + 'px',
        });
        slideIndex++;
        if (slideIndex === totalSlides) {
          $(this).addClass('disabled');
        }
      }
    });

    $('.module-fade-up').on('click', function (e) {
      e.preventDefault();
      $('.module-fade-down').removeClass('disabled');
      if (slideIndex <= totalSlides) {
        slideIndex--;
        if (slideIndex > 0) {
          let currentEle = $('.journey-module-slides').find(
            "[data-index='" + slideIndex + "']"
          );
          let nextslideHeight = currentEle.height();
          totHeight -= nextslideHeight;

          if (slideIndex == 1) {
            totHeight = 0;
            $(this).addClass('disabled');
          }

          let targetDiv = $('.journey-module-slides').css({
            marginTop: -totHeight + 'px',
          });
        } else if (slideIndex <= 0) {
          slideIndex = 1;
          totHeight = 0;
        }
      }
    });
  }
};
$(document).ready(function () {
  DesktopFun();
});
