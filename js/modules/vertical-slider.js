let DesktopFunction = function () {
  if (jQuery(window).width() >= 1024) {
    let ftotHeight = 0;
    let ftotalSlides = document.querySelectorAll(
      '.feature-overview-list'
    ).length;
    let fslideIndex = 1;
    let slideCount = 1;

    jQuery('.feature-overview-list[data-count="1"]').addClass('current-list');
    jQuery('.feature-overview-image[data-slide="1"]').addClass('current-slide');

    jQuery('.feature-fade-down, .feature-arrows-down').on(
      'click',
      function (e) {
        e.preventDefault();
        jQuery('.feature-fade-up, .feature-arrows-up').removeClass('disabled');
        if (fslideIndex < ftotalSlides) {
          let fcurrentEle = jQuery('.feature-overview-lists').find(
            "[data-count='" + fslideIndex + "']"
          );

          let fnextslideHeight = fcurrentEle.height();
          ftotHeight += fnextslideHeight;
          let targetDiv = jQuery('.feature-overview-lists').css({
            marginTop: -ftotHeight + 'px',
          });
          fslideIndex++;
          if (fslideIndex === ftotalSlides) {
            jQuery(this).addClass('disabled');
          }
        }

        if (slideCount < ftotalSlides) {
          slideCount++;
          jQuery('.feature-overview-image').removeClass('current-slide');
          let targetSlide = jQuery(
            '.feature-overview-image[data-slide=' + slideCount + ']'
          ).addClass('current-slide');
          if (slideCount === ftotalSlides) {
            slideCount = 1;
          }
        }
      }
    );

    jQuery('.feature-fade-up, .feature-arrows-up').on('click', function (e) {
      e.preventDefault();
      jQuery('.feature-fade-down, .feature-arrows-down').removeClass(
        'disabled'
      );
      if (fslideIndex <= ftotalSlides) {
        fslideIndex--;

        jQuery('.feature-overview-image').removeClass('current-slide');
        let targetSlide = jQuery(
          '.feature-overview-image[data-slide=' + fslideIndex + ']'
        ).addClass('current-slide');

        if (fslideIndex > 0) {
          let fcurrentEle = jQuery('.feature-overview-lists').find(
            "[data-count='" + fslideIndex + "']"
          );
          let fnextslideHeight = fcurrentEle.height();
          ftotHeight -= fnextslideHeight;

          if (fslideIndex == 1) {
            ftotHeight = 0;
            jQuery(this).addClass('disabled');
          }
          let targetDiv = jQuery('.feature-overview-lists').css({
            marginTop: -ftotHeight + 'px',
          });
        } else if (fslideIndex <= 0) {
          fslideIndex = 1;
          ftotHeight = 0;
        }
      }
    });
  }
};
jQuery(document).ready(function () {
  DesktopFunction();
});
