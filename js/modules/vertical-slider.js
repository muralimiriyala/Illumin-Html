let DesktopFunction = function () {
  if ($(window).width() >= 1024) {
    let ftotHeight = 0;
    let ftotalSlides = document.querySelectorAll(
      '.feature-overview-list'
    ).length;
    let fslideIndex = 1;
    let slideCount = 1;

    $('.feature-overview-list[data-count="1"]').addClass('current-list');
    $('.feature-overview-image[data-slide="1"]').addClass('current-slide');

    $('.feature-fade-down, .feature-arrows-down').on('click', function (e) {
      e.preventDefault();
      $('.feature-fade-up, .feature-arrows-up').removeClass('disabled');
      if (fslideIndex < ftotalSlides) {
        let fcurrentEle = $('.feature-overview-lists').find(
          "[data-count='" + fslideIndex + "']"
        );

        let fnextslideHeight = fcurrentEle.height();
        ftotHeight += fnextslideHeight;
        let targetDiv = $('.feature-overview-lists').css({
          marginTop: -ftotHeight + 'px',
        });
        fslideIndex++;
        if (fslideIndex === ftotalSlides) {
          $(this).addClass('disabled');
        }
      }

      if (slideCount < ftotalSlides) {
        slideCount++;
        $('.feature-overview-image').removeClass('current-slide');
        let targetSlide = $(
          '.feature-overview-image[data-slide=' + slideCount + ']'
        ).addClass('current-slide');
        if (slideCount === ftotalSlides) {
          slideCount = 1;
        }
      }
    });

    $('.feature-fade-up, .feature-arrows-up').on('click', function (e) {
      e.preventDefault();
      $('.feature-fade-down, .feature-arrows-down').removeClass('disabled');
      if (fslideIndex <= ftotalSlides) {
        fslideIndex--;

        $('.feature-overview-image').removeClass('current-slide');
        let targetSlide = $(
          '.feature-overview-image[data-slide=' + fslideIndex + ']'
        ).addClass('current-slide');

        if (fslideIndex > 0) {
          let fcurrentEle = $('.feature-overview-lists').find(
            "[data-count='" + fslideIndex + "']"
          );
          let fnextslideHeight = fcurrentEle.height();
          ftotHeight -= fnextslideHeight;

          if (fslideIndex == 1) {
            ftotHeight = 0;
            $(this).addClass('disabled');
          }
          let targetDiv = $('.feature-overview-lists').css({
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
$(document).ready(function () {
  DesktopFunction();
});
