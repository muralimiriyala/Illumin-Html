jQuery(document).ready(function ($) {
  $('.people-slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    dots: false,
    infinite: true,
    arrows: false,
    focusOnSelect: true,
    asNavFor: '.people-slider-nav',
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          arrows: false,
        },
      },
    ],
  });
  $('.people-slider-nav').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    infinite: false,
    fade: true,
    asNavFor: '.people-slider-for',
    cssEase: 'ease-out',
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          infinite: true,
          arrows: true,
        },
      },
    ],
    customPaging: function (slick, slider) {
      let totalValue = slick.slideCount;
      let currentSlide = slider + 1;
      return (
        '<a>0' +
        currentSlide +
        ' <span class="slick-slash"></span> 0' +
        totalValue +
        '</a>'
      );
    },
  });

  var totalSlides = $('.people-slider-nav .slick-slide').length,
    randomSlides = Math.floor(Math.random() * totalSlides);
  $('.people-slider-for, .people-slider-nav').slick('slickGoTo', randomSlides);

  $('.default-content-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    arrows: true,
    prevArrow: '<span class="slick-arrow slick-prev"></span>',
    nextArrow: '<span class="slick-arrow slick-next"></span>',
  });
  const $defaultDots = $('.default-content-slider ul.slick-dots');
  if (typeof $defaultDots !== 'undefined' && $defaultDots.length > 0) {
    $('span.slick-next').insertBefore('.slick-dots-container');
    $defaultDots.wrap("<div class='default-dots-container aligncenter'></div>");
    $('.default-dots-container ul.slick-dots').before($('span.slick-arrow'));
  }

  $('.related-slider-main').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    speed: 500,
    variableWidth: true,
    infinite: true,
    dots: false,
    arrows: true,
    prevArrow: '<span class="slick-arrow slick-prev"></span>',
    nextArrow: '<span class="slick-arrow slick-next"></span>',
    responsive: [
      {
        breakpoint: 1299,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          variableWidth: false,
          centerMode: true,
          centerpadding: '40px',
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          variableWidth: true,
          centerMode: true,
          centerpadding: '20px',
        },
      },
    ],
  });

  $('.our-story-slider').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    variableWidth: true,
    speed: 500,
    infinite: true,
    dots: false,
    arrows: true,
    prevArrow: '<span class="slick-arrow slick-prev"></span>',
    nextArrow: '<span class="slick-arrow slick-next"></span>',
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  });

  $('.recruiting-counter').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    variableWidth: true,
    speed: 500,
    infinite: false,
    dots: false,
    arrows: true,
    prevArrow: '<span class="slick-arrow slick-prev"></span>',
    nextArrow: '<span class="slick-arrow slick-next"></span>',
    responsive: [
      {
        breakpoint: 1299,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  /*-- Ipad & Mobile jQuery --*/
  let $window = $(window);
  let $most_view_slider = $('.most-viewed-slider');
  most_view_settings = {
    slidesToShow: 2,
    slidesToScroll: 1,
    variableWidth: true,
    infinite: true,
    dots: false,
    arrows: true,
    prevArrow: '<span class="slick-arrow slick-prev"></span>',
    nextArrow: '<span class="slick-arrow slick-next"></span>',
    draggable: true,
    touchThreshold: 200,
    swipeToSlide: true,
    mobileFirst: true,
    centerMode: true,
    centerpadding: '20px',
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          variableWidth: false,
        },
      },
      {
        breakpoint: 1023,
        settings: 'unslick',
      },
    ],
  };
  $most_view_slider.slick(most_view_settings);
  $window.on('resize', function () {
    if ($window.width() >= 1024) {
      if ($most_view_slider.hasClass('slick-initialized')) {
        $most_view_slider.slick('unslick');
        return false;
      }
    }
    if (!$most_view_slider.hasClass('slick-initialized')) {
      return $most_view_slider.slick(most_view_settings);
    }
  });

  const $platformSlider = $('.platform-slider');
  const $platformAppend = $('.platform-append-arrows');
  const $platforLink = $('ul.platform-nav li');
  $platformSlider.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 1500,
    dots: true,
    arrows: true,

    prevArrow:
      '<span class="slick-arrow slick-prev flex flex-center"><svg width="16" height="25" viewBox="0 0 16 25" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M7.40804 12.4375L15.8027 4.04281L12.1974 0.4375L0.197429 12.4375L12.1974 24.4375L15.8027 20.8322L7.40804 12.4375Z" fill="url(#paint0_linear_2666_14828)"/> <defs> <linearGradient id="paint0_linear_2666_14828" x1="15.8027" y1="12.4375" x2="0.197428" y2="12.4375" gradientUnits="userSpaceOnUse"> <stop stop-color="#342FE7"/> <stop offset="1" stop-color="#8200F0"/> </linearGradient> </defs> </svg></span>',
    nextArrow:
      '<span class="slick-arrow slick-next flex flex-center"><svg  width="16" height="25" viewBox="0 0 16 25" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M8.59196 12.4375L0.197266 4.04281L3.80257 0.4375L15.8026 12.4375L3.80257 24.4375L0.197266 20.8322L8.59196 12.4375Z" fill="url(#paint0_linear_2666_14826)"/> <defs> <linearGradient id="paint0_linear_2666_14826" x1="0.197266" y1="12.4375" x2="15.8026" y2="12.4375" gradientUnits="userSpaceOnUse"> <stop stop-color="#342FE7"/> <stop offset="1" stop-color="#8200F0"/> </linearGradient> </defs> </svg></span>',
    appendDots: $platformAppend,
    appendArrows: $platformAppend,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          dots: false,
          adaptiveHeight: true,
        },
      },
      {
        breakpoint: 767,
        settings: {
          dots: true,
          adaptiveHeight: true,
        },
      },
    ],
  });
  function textChange() {
    let number = Number($platformSlider.slick('slickCurrentSlide')) + 1;
    $(`ul.platform-nav li`).removeClass('slick-current');
    $(`ul.platform-nav li[data-platform-nav=${number}]`).addClass(
      'slick-current'
    );
  }
  $(document).on(
    'click',
    '.platform-append-arrows span.slick-next',
    function (e) {
      e.preventDefault();
      textChange();
    }
  );
  $(document).on(
    'click',
    '.platform-append-arrows span.slick-prev',
    function (e) {
      e.preventDefault();
      textChange();
    }
  );
  $(document).on('click', 'ul.slick-dots li', function (e) {
    e.preventDefault();
    textChange();
  });
  $platformSlider.on(
    'init, setPosition, beforeChange, afterChange',
    function () {
      textChange();
    }
  );
  let $platMql = window.matchMedia('(min-width: 768px)');
  function platMqlFun() {
    if ($platMql.matches) {
      $platforLink.on('click', function (e) {
        e.preventDefault();
        $(this).addClass('slick-current');
        let slideIndex = $(this).data('platform-nav') - 1;
        $platformSlider.slick('slickGoTo', slideIndex);
      });
    } else {
      $platforLink.off('click');
    }
  }
  platMqlFun();
  $platMql.addEventListener('change', platMqlFun);
  $platMql.addEventListener('load', platMqlFun);
  $platMql.addEventListener('resize', platMqlFun);

  const $singleSlider = $('.single-testimonial-slider');
  const $singleNext = $('.single-slick-next');
  $singleSlider.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    infinite: true,
    dots: false,
    arrows: false,
    adaptiveHeight: true,
  });
  $singleNext.on('click', () => {
    $singleSlider.slick(
      'slickGoTo',
      parseInt($singleSlider.slick('slickCurrentSlide')) + 1
    );
  });

  /*-- Ipad & Mobile jQuery --*/
  let $ipad_window = $(window);
  if ($ipad_window.width() <= 1023) {
    $('.feature-slider-nav').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: false,
      dots: true,
      arrows: false,
      focusOnSelect: true,
      fade: true,
      cssEase: 'linear',
      asNavFor: '.feature-slider-for',
    });
    // const $imgDots = $(".feature-slider-nav ul.slick-dots li button");
    // $imgDots.each(function() {
    //     var img = $('<img />', {
    //         'src': 'path/to/image',
    //         'role': $(this).attr('role'),
    //         'id': $(this).attr('id'),
    //         'aria-controls': $(this).attr('aria-controls'),
    //         'aria-label': $(this).attr('aria-label'),
    //         'tabindex': $(this).attr('tabindex'),
    //         'aria-selected': $(this).attr('aria-selected')
    //     });
    //     $(this).replaceWith(img);
    // });

    $('.feature-slider-for').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: false,
      asNavFor: '.feature-slider-nav',
    });
  }
});
