let DesktopFun = function () {
  if (jQuery(window).width() >= 1024) {
    let totHeight = 0;
    let totalSlides = document.querySelectorAll('.journey-module-slide').length;
    let slideIndex = 1;
    jQuery('.module-fade-down').on('click', function (e) {
      e.preventDefault();
      jQuery('.module-fade-up').removeClass('disabled');
      if (slideIndex < totalSlides) {
        let currentEle = jQuery('.journey-module-slides').find(
          "[data-index='" + slideIndex + "']"
        );
        let nextslideHeight = currentEle.height();
        totHeight += nextslideHeight;
        let targetDiv = jQuery('.journey-module-slides').css({
          marginTop: -totHeight + 'px',
        });
        slideIndex++;
        if (slideIndex === totalSlides) {
          jQuery(this).addClass('disabled');
        }
      }
    });

    jQuery('.module-fade-up').on('click', function (e) {
      e.preventDefault();
      jQuery('.module-fade-down').removeClass('disabled');
      if (slideIndex <= totalSlides) {
        slideIndex--;
        if (slideIndex > 0) {
          let currentEle = jQuery('.journey-module-slides').find(
            "[data-index='" + slideIndex + "']"
          );
          let nextslideHeight = currentEle.height();
          totHeight -= nextslideHeight;

          if (slideIndex == 1) {
            totHeight = 0;
            jQuery(this).addClass('disabled');
          }

          let targetDiv = jQuery('.journey-module-slides').css({
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
jQuery(document).ready(function () {
  DesktopFun();
});
