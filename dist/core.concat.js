(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(require('jquery'))
    : typeof define === 'function' && define.amd
      ? define(['jquery'], factory)
      : factory(global.jQuery);
})(this, function ($) {
  'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  /**
   * @author  Mudit Ameta
   * @license https://github.com/zeusdeux/isInViewport/blob/master/license.md MIT
   */

  // expose isInViewport as a custom pseudo-selector
  $.extend($.expr.pseudos || $.expr[':'], {
    // if $.expr.createPseudo is available, use it
    'in-viewport': $.expr.createPseudo
      ? $.expr.createPseudo(function (argsString) {
          return function (currElement) {
            return isInViewport(currElement, getSelectorArgs(argsString));
          };
        })
      : function (currObj, index, meta) {
          return isInViewport(currObj, getSelectorArgs(meta[3]));
        },
  });

  // expose isInViewport as a function too
  // this lets folks pass around actual objects as options (like custom viewport)
  // and doesn't tie 'em down to strings. It also prevents isInViewport from
  // having to look up and wrap the dom element corresponding to the viewport selector
  $.fn.isInViewport = function (options) {
    return this.filter(function (i, el) {
      return isInViewport(el, options);
    });
  };

  $.fn.run = run;

  // lets you chain any arbitrary function or an array of functions and returns a jquery object
  function run(args) {
    var this$1 = this;

    if (arguments.length === 1 && typeof args === 'function') {
      args = [args];
    }

    if (!(args instanceof Array)) {
      throw new SyntaxError(
        'isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions'
      );
    }

    args.forEach(function (arg) {
      if (typeof arg !== 'function') {
        console.warn(
          'isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions'
        );
        console.warn(
          'isInViewport: Ignoring non-function values in array and moving on'
        );
      } else {
        [].slice.call(this$1).forEach(function (t) {
          return arg.call($(t));
        });
      }
    });

    return this;
  }

  // gets the width of the scrollbar
  function getScrollbarWidth(viewport) {
    // append a div that has 100% width to get true width of viewport
    var el = $('<div></div>').css({
      width: '100%',
    });
    viewport.append(el);

    // subtract true width from the viewport width which is inclusive
    // of scrollbar by default
    var scrollBarWidth = viewport.width() - el.width();

    // remove our element from DOM
    el.remove();
    return scrollBarWidth;
  }

  // Returns true if DOM element `element` is in viewport
  function isInViewport(element, options) {
    var ref = element.getBoundingClientRect();
    var top = ref.top;
    var bottom = ref.bottom;
    var left = ref.left;
    var right = ref.right;

    var settings = $.extend(
      {
        tolerance: 0,
        viewport: window,
      },
      options
    );
    var isVisibleFlag = false;
    var $viewport = settings.viewport.jquery
      ? settings.viewport
      : $(settings.viewport);

    if (!$viewport.length) {
      console.warn(
        'isInViewport: The viewport selector you have provided matches no element on page.'
      );
      console.warn('isInViewport: Defaulting to viewport as window');
      $viewport = $(window);
    }

    var $viewportHeight = $viewport.height();
    var $viewportWidth = $viewport.width();
    var typeofViewport = $viewport[0].toString();

    // if the viewport is other than window recalculate the top,
    // bottom,left and right wrt the new viewport
    // the [object DOMWindow] check is for window object type in PhantomJS
    if (
      $viewport[0] !== window &&
      typeofViewport !== '[object Window]' &&
      typeofViewport !== '[object DOMWindow]'
    ) {
      // use getBoundingClientRect() instead of $.Offset()
      // since the original top/bottom positions are calculated relative to browser viewport and not document
      var viewportRect = $viewport[0].getBoundingClientRect();

      // recalculate these relative to viewport
      top = top - viewportRect.top;
      bottom = bottom - viewportRect.top;
      left = left - viewportRect.left;
      right = right - viewportRect.left;

      // get the scrollbar width from cache or calculate it
      isInViewport.scrollBarWidth =
        isInViewport.scrollBarWidth || getScrollbarWidth($viewport);

      // remove the width of the scrollbar from the viewport width
      $viewportWidth -= isInViewport.scrollBarWidth;
    }

    // handle falsy, non-number and non-integer tolerance value
    // same as checking using isNaN and then setting to 0
    // bitwise operators deserve some love too you know
    settings.tolerance = ~~Math.round(parseFloat(settings.tolerance));

    if (settings.tolerance < 0) {
      settings.tolerance = $viewportHeight + settings.tolerance; // viewport height - tol
    }

    // the element is NOT in viewport iff it is completely out of
    // viewport laterally or if it is completely out of the tolerance
    // region. Therefore, if it is partially in view then it is considered
    // to be in the viewport and hence true is returned. Because we have adjusted
    // the left/right positions relative to the viewport, we should check the
    // element's right against the viewport's 0 (left side), and the element's
    // left against the viewport's width to see if it is outside of the viewport.

    if (right <= 0 || left >= $viewportWidth) {
      return isVisibleFlag;
    }

    // if the element is bound to some tolerance
    isVisibleFlag = settings.tolerance
      ? top <= settings.tolerance && bottom >= settings.tolerance
      : bottom > 0 && top <= $viewportHeight;

    return isVisibleFlag;
  }

  // get the selector args from the args string proved by Sizzle
  function getSelectorArgs(argsString) {
    if (argsString) {
      var args = argsString.split(',');

      // when user only gives viewport and no tolerance
      if (args.length === 1 && isNaN(args[0])) {
        args[1] = args[0];
        args[0] = void 0;
      }

      return {
        tolerance: args[0] ? args[0].trim() : void 0,
        viewport: args[1] ? $(args[1].trim()) : void 0,
      };
    }
    return {};
  }
});

//# sourceMappingURL=isInViewport.js.map

var $animation_elements = jQuery('[data-animation]');
var $window = jQuery(window);
function check_if_in_view() {
  $animation_elements.each(function () {
    const $self = jQuery(this);
    const animation = $self.data('animation');
    const animateType = $self.data('animate');
    const delay = Number($self.data('animation-delay') || 0);
    const timeline = $self[0].tl;
    const counter = $self[0].counter;
    if ($self.is(':in-viewport')) {
      setTimeout(() => {
        if (animateType) _.animateRun($self, animateType);
        else $self.addClass('visible ' + animation);
        if (timeline) {
          timeline.play();
        }
      }, delay);
    } else {
      if (timeline && timeline.progress() > 0) {
        timeline.progress(0);
      }
      if (counter) {
        counter.reset();
      }
    }
  });
}
$window.on('scroll load', check_if_in_view);
$window.trigger('scroll load');

'use strict';
// document.addEventListener('DOMContentLoaded', () => {
var watermarkCircle = document.querySelector('.watermark-circle');
if (watermarkCircle) {
  const svgElement = watermarkCircle.querySelector('svg');
  const circle = svgElement.querySelector('circle');
  const radius = circle.getAttribute('r');
  const circumference = 2 * Math.PI * radius;

  // Set initial stroke properties for animation
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
// });

jQuery(document).ready(function ($) {
  jQuery(".popup-youtube").magnificPopup({
    /* disableOn: 700,*/
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });
});

jQuery(document).ready(function () {
  jQuery('select').selectBox({
    keepInViewport: false,
    menuSpeed: 'slow',
    mobile: true,
  });
  jQuery('.selectBox, .selectBox-dropdown .selectBox-label').removeAttr(
    'style'
  );
});

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
    adaptiveHeight: true,
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
  var pslidelength = $('.platform-slider').children(' .platform-slide').length;

  const $platformAppend = $('.platform-append-arrows');
  const $platforLink = $('ul.platform-nav li');
  $platformSlider.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 1500,
    dots: true,
    arrows: true,
    adaptiveHeight: true,
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
    if (number === pslidelength) {
      $('ul.platform-nav').addClass('last-slide');
    } else {
      $('ul.platform-nav').removeClass('last-slide');
    }
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
        $(this).siblings('li').removeClass('slick-current');
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

!(function (e) {
  var t = (window.SelectBox = function (e, t) {
    if (e instanceof jQuery) {
      if (!(e.length > 0)) return;
      e = e[0];
    }
    return (
      (this.typeTimer = null),
      (this.typeSearch = ""),
      (this.isMac = navigator.platform.match(/mac/i)),
      (t = "object" == typeof t ? t : {}),
      (this.selectElement = e),
      !(
        !t.mobile &&
        navigator.userAgent.match(/iPad|iPhone|Android|IEMobile|BlackBerry/i)
      ) &&
        "select" === e.tagName.toLowerCase() &&
        void this.init(t)
    );
  });
  (t.prototype.version = "1.2.0"),
    (t.prototype.init = function (t) {
      var s = e(this.selectElement);
      if (s.data("selectBox-control")) return !1;
      var o = e('<a class="selectBox" />'),
        a = s.attr("multiple") || parseInt(s.attr("size")) > 1,
        n = t || {},
        l = parseInt(s.prop("tabindex")) || 0,
        i = this;
      if (
        (o
          .width(s.outerWidth())
          .addClass(s.attr("class"))
          .attr("title", s.attr("title") || "")
          .attr("tabindex", l)
          .css("display", "inline-block")
          .bind("focus.selectBox", function () {
            this !== document.activeElement &&
              document.body !== document.activeElement &&
              e(document.activeElement).blur(),
              o.hasClass("selectBox-active") ||
                (o.addClass("selectBox-active"), s.trigger("focus"));
          })
          .bind("blur.selectBox", function () {
            o.hasClass("selectBox-active") &&
              (o.removeClass("selectBox-active"), s.trigger("blur"));
          }),
        e(window).data("selectBox-bindings") ||
          e(window)
            .data("selectBox-bindings", !0)
            .bind(
              "scroll.selectBox",
              n.hideOnWindowScroll ? this.hideMenus : e.noop,
            )
            .bind("resize.selectBox", this.hideMenus),
        s.attr("disabled") && o.addClass("selectBox-disabled"),
        s.bind("click.selectBox", function (e) {
          o.focus(), e.preventDefault();
        }),
        a)
      ) {
        if (
          ((t = this.getOptions("inline")),
          o
            .append(t)
            .data("selectBox-options", t)
            .addClass("selectBox-inline selectBox-menuShowing")
            .bind("keydown.selectBox", function (e) {
              i.handleKeyDown(e);
            })
            .bind("keypress.selectBox", function (e) {
              i.handleKeyPress(e);
            })
            .bind("mousedown.selectBox", function (t) {
              1 === t.which &&
                (e(t.target).is("A.selectBox-inline") && t.preventDefault(),
                o.hasClass("selectBox-focus") || o.focus());
            })
            .insertAfter(s),
          !s[0].style.height)
        ) {
          var c = s.attr("size") ? parseInt(s.attr("size")) : 5,
            r = o
              .clone()
              .removeAttr("id")
              .css({ position: "absolute", top: "-9999em" })
              .show()
              .appendTo("body");
          r.find(".selectBox-options").html("<li><a> </a></li>");
          var d = parseInt(
            r.find(".selectBox-options A:first").html("&nbsp;").outerHeight(),
          );
          r.remove(), o.height(d * c);
        }
        this.disableSelection(o);
      } else {
        var h = e('<span class="selectBox-label" />'),
          p = e('<span class="selectBox-arrow" />');
        h.attr("class", this.getLabelClass()).html(this.getLabelHtml()),
          (t = this.getOptions("dropdown")).appendTo("BODY"),
          o
            .data("selectBox-options", t)
            .addClass("selectBox-dropdown")
            .append(h)
            .append(p)
            .bind("mousedown.selectBox", function (e) {
              1 === e.which &&
                (o.hasClass("selectBox-menuShowing")
                  ? i.hideMenus()
                  : (e.stopPropagation(),
                    t
                      .data("selectBox-down-at-x", e.screenX)
                      .data("selectBox-down-at-y", e.screenY),
                    i.showMenu()));
            })
            .bind("keydown.selectBox", function (e) {
              i.handleKeyDown(e);
            })
            .bind("keypress.selectBox", function (e) {
              i.handleKeyPress(e);
            })
            .bind("open.selectBox", function (e, t) {
              (t && !0 === t._selectBox) || i.showMenu();
            })
            .bind("close.selectBox", function (e, t) {
              (t && !0 === t._selectBox) || i.hideMenus();
            })
            .insertAfter(s);
        var x =
          o.width() -
          p.outerWidth() -
          (parseInt(h.css("paddingLeft")) || 0) -
          (parseInt(h.css("paddingRight")) || 0);
        h.width(x), this.disableSelection(o);
      }
      s.addClass("selectBox")
        .data("selectBox-control", o)
        .data("selectBox-settings", n)
        .hide();
    }),
    (t.prototype.getOptions = function (t) {
      var s,
        o = e(this.selectElement),
        a = this,
        n = function (t, s) {
          return (
            t.children("OPTION, OPTGROUP").each(function () {
              if (e(this).is("OPTION"))
                e(this).length > 0
                  ? a.generateOptions(e(this), s)
                  : s.append("<li> </li>");
              else {
                var t = e('<li class="selectBox-optgroup" />');
                t.text(e(this).attr("label")), s.append(t), (s = n(e(this), s));
              }
            }),
            s
          );
        };
      switch (t) {
        case "inline":
          return (
            (s = e('<ul class="selectBox-options" />')),
            (s = n(o, s))
              .find("A")
              .bind("mouseover.selectBox", function (t) {
                a.addHover(e(this).parent());
              })
              .bind("mouseout.selectBox", function (t) {
                a.removeHover(e(this).parent());
              })
              .bind("mousedown.selectBox", function (e) {
                1 === e.which &&
                  (e.preventDefault(),
                  o.selectBox("control").hasClass("selectBox-active") ||
                    o.selectBox("control").focus());
              })
              .bind("mouseup.selectBox", function (t) {
                1 === t.which &&
                  (a.hideMenus(), a.selectOption(e(this).parent(), t));
              }),
            this.disableSelection(s),
            s
          );
        case "dropdown":
          (s = e('<ul class="selectBox-dropdown-menu selectBox-options" />')),
            (s = n(o, s))
              .data("selectBox-select", o)
              .css("display", "none")
              .appendTo("BODY")
              .find("A")
              .bind("mousedown.selectBox", function (t) {
                1 === t.which &&
                  (t.preventDefault(),
                  t.screenX === s.data("selectBox-down-at-x") &&
                    t.screenY === s.data("selectBox-down-at-y") &&
                    (s
                      .removeData("selectBox-down-at-x")
                      .removeData("selectBox-down-at-y"),
                    /android/i.test(navigator.userAgent.toLowerCase()) &&
                      /chrome/i.test(navigator.userAgent.toLowerCase()) &&
                      a.selectOption(e(this).parent()),
                    a.hideMenus()));
              })
              .bind("mouseup.selectBox", function (t) {
                1 === t.which &&
                  ((t.screenX === s.data("selectBox-down-at-x") &&
                    t.screenY === s.data("selectBox-down-at-y")) ||
                    (s
                      .removeData("selectBox-down-at-x")
                      .removeData("selectBox-down-at-y"),
                    a.selectOption(e(this).parent()),
                    a.hideMenus()));
              })
              .bind("mouseover.selectBox", function (t) {
                a.addHover(e(this).parent());
              })
              .bind("mouseout.selectBox", function (t) {
                a.removeHover(e(this).parent());
              });
          var l = o.attr("class") || "";
          if ("" !== l) {
            l = l.split(" ");
            for (var i = 0; i < l.length; i++)
              s.addClass(l[i] + "-selectBox-dropdown-menu");
          }
          return this.disableSelection(s), s;
      }
    }),
    (t.prototype.getLabelClass = function () {
      return (
        "selectBox-label " +
        (e(this.selectElement).find("OPTION:selected").attr("class") || "")
      ).replace(/\s+$/, "");
    }),
    (t.prototype.getLabelHtml = function () {
      var t = e(this.selectElement).find("OPTION:selected");
      return (
        (t.data("icon")
          ? '<i class="fa fa-' +
            t.data("icon") +
            ' fa-fw fa-lg"></i> ' +
            t.text()
          : t.text()) || " "
      );
    }),
    (t.prototype.setLabel = function () {
      var t = e(this.selectElement).data("selectBox-control");
      t &&
        t
          .find(".selectBox-label")
          .attr("class", this.getLabelClass())
          .html(this.getLabelHtml());
    }),
    (t.prototype.destroy = function () {
      var t = e(this.selectElement),
        s = t.data("selectBox-control");
      s &&
        (s.data("selectBox-options").remove(),
        s.remove(),
        t
          .removeClass("selectBox")
          .removeData("selectBox-control")
          .data("selectBox-control", null)
          .removeData("selectBox-settings")
          .data("selectBox-settings", null)
          .show());
    }),
    (t.prototype.refresh = function () {
      var t,
        s = e(this.selectElement).data("selectBox-control"),
        o = s.hasClass("selectBox-dropdown") ? "dropdown" : "inline";
      switch (
        (s.data("selectBox-options").remove(),
        (t = this.getOptions(o)),
        s.data("selectBox-options", t),
        o)
      ) {
        case "inline":
          s.append(t);
          break;
        case "dropdown":
          this.setLabel(), e("BODY").append(t);
      }
      "dropdown" === o &&
        s.hasClass("selectBox-menuShowing") &&
        this.showMenu();
    }),
    (t.prototype.showMenu = function () {
      var t = this,
        s = e(this.selectElement),
        o = s.data("selectBox-control"),
        a = s.data("selectBox-settings"),
        n = o.data("selectBox-options");
      if (o.hasClass("selectBox-disabled")) return !1;
      this.hideMenus();
      var l = parseInt(o.css("borderBottomWidth")) || 0,
        i = parseInt(o.css("borderTopWidth")) || 0,
        c = o.offset(),
        r = a.topPositionCorrelation ? a.topPositionCorrelation : 0,
        d = a.bottomPositionCorrelation ? a.bottomPositionCorrelation : 0,
        h = n.outerHeight(),
        p = o.outerHeight(),
        x = parseInt(n.css("max-height")),
        u = e(window).scrollTop(),
        f = c.top - u,
        B = e(window).height() - (f + p),
        m = f > B && (null == a.keepInViewport || a.keepInViewport),
        v = o.innerWidth() >= n.innerWidth() ? o.innerWidth() + "px" : "auto",
        g = m ? c.top - h + i + r : c.top + p - l - d;
      if (f < x && B < x)
        if (m) {
          var b = x - (f - 5);
          n.css({ "max-height": x - b + "px" }), (g += b);
        } else {
          b = x - (B - 5);
          n.css({ "max-height": x - b + "px" });
        }
      if (
        (n.data("posTop", m),
        n
          .width(v)
          .css({ top: g, left: o.offset().left })
          .addClass(
            "selectBox-options selectBox-options-" + (m ? "top" : "bottom"),
          ),
        a.styleClass && n.addClass(a.styleClass),
        s.triggerHandler("beforeopen"))
      )
        return !1;
      var w = function () {
        s.triggerHandler("open", { _selectBox: !0 });
      };
      switch (a.menuTransition) {
        case "fade":
          n.fadeIn(a.menuSpeed, w);
          break;
        case "slide":
          n.slideDown(a.menuSpeed, w);
          break;
        default:
          n.show(a.menuSpeed, w);
      }
      a.menuSpeed || w();
      var C = n.find(".selectBox-selected:first");
      this.keepOptionInView(C, !0),
        this.addHover(C),
        o.addClass(
          "selectBox-menuShowing selectBox-menuShowing-" +
            (m ? "top" : "bottom"),
        ),
        e(document).bind("mousedown.selectBox", function (s) {
          if (1 === s.which) {
            if (e(s.target).parents().andSelf().hasClass("selectBox-options"))
              return;
            t.hideMenus();
          }
        });
    }),
    (t.prototype.hideMenus = function () {
      0 !== e(".selectBox-dropdown-menu:visible").length &&
        (e(document).unbind("mousedown.selectBox"),
        e(".selectBox-dropdown-menu").each(function () {
          var t = e(this),
            s = t.data("selectBox-select"),
            o = s.data("selectBox-control"),
            a = s.data("selectBox-settings"),
            n = t.data("posTop");
          if (s.triggerHandler("beforeclose")) return !1;
          var l = function () {
            s.triggerHandler("close", { _selectBox: !0 });
          };
          if (a) {
            switch (a.menuTransition) {
              case "fade":
                t.fadeOut(a.menuSpeed, l);
                break;
              case "slide":
                t.slideUp(a.menuSpeed, l);
                break;
              default:
                t.hide(a.menuSpeed, l);
            }
            a.menuSpeed || l(),
              o.removeClass(
                "selectBox-menuShowing selectBox-menuShowing-" +
                  (n ? "top" : "bottom"),
              );
          } else
            e(this).hide(),
              e(this).triggerHandler("close", { _selectBox: !0 }),
              e(this).removeClass(
                "selectBox-menuShowing selectBox-menuShowing-" +
                  (n ? "top" : "bottom"),
              );
          t.css("max-height", ""),
            t.removeClass("selectBox-options-" + (n ? "top" : "bottom")),
            t.data("posTop", !1);
        }));
    }),
    (t.prototype.selectOption = function (t, s) {
      var o = e(this.selectElement);
      t = e(t);
      var a,
        n = o.data("selectBox-control");
      o.data("selectBox-settings");
      if (n.hasClass("selectBox-disabled")) return !1;
      if (0 === t.length || t.hasClass("selectBox-disabled")) return !1;
      o.attr("multiple")
        ? s.shiftKey && n.data("selectBox-last-selected")
          ? (t.toggleClass("selectBox-selected"),
            (a = (a =
              t.index() > n.data("selectBox-last-selected").index()
                ? t
                    .siblings()
                    .slice(n.data("selectBox-last-selected").index(), t.index())
                : t
                    .siblings()
                    .slice(
                      t.index(),
                      n.data("selectBox-last-selected").index(),
                    )).not(".selectBox-optgroup, .selectBox-disabled")),
            t.hasClass("selectBox-selected")
              ? a.addClass("selectBox-selected")
              : a.removeClass("selectBox-selected"))
          : (this.isMac && s.metaKey) || (!this.isMac && s.ctrlKey)
            ? t.toggleClass("selectBox-selected")
            : (t.siblings().removeClass("selectBox-selected"),
              t.addClass("selectBox-selected"))
        : (t.siblings().removeClass("selectBox-selected"),
          t.addClass("selectBox-selected"));
      n.hasClass("selectBox-dropdown") &&
        n.find(".selectBox-label").html(t.html());
      var l = 0,
        i = [];
      return (
        o.attr("multiple")
          ? n.find(".selectBox-selected A").each(function () {
              i[l++] = e(this).attr("rel");
            })
          : (i = t.find("A").attr("rel")),
        n.data("selectBox-last-selected", t),
        o.val() !== i && (o.val(i), this.setLabel(), o.trigger("change")),
        !0
      );
    }),
    (t.prototype.addHover = function (t) {
      (t = e(t)),
        e(this.selectElement)
          .data("selectBox-control")
          .data("selectBox-options")
          .find(".selectBox-hover")
          .removeClass("selectBox-hover"),
        t.addClass("selectBox-hover");
    }),
    (t.prototype.getSelectElement = function () {
      return this.selectElement;
    }),
    (t.prototype.removeHover = function (t) {
      (t = e(t)),
        e(this.selectElement)
          .data("selectBox-control")
          .data("selectBox-options")
          .find(".selectBox-hover")
          .removeClass("selectBox-hover");
    }),
    (t.prototype.keepOptionInView = function (t, s) {
      if (t && 0 !== t.length) {
        var o = e(this.selectElement).data("selectBox-control"),
          a = o.data("selectBox-options"),
          n = o.hasClass("selectBox-dropdown") ? a : a.parent(),
          l = parseInt(t.offset().top - n.position().top),
          i = parseInt(l + t.outerHeight());
        s
          ? n.scrollTop(
              t.offset().top - n.offset().top + n.scrollTop() - n.height() / 2,
            )
          : (l < 0 &&
              n.scrollTop(t.offset().top - n.offset().top + n.scrollTop()),
            i > n.height() &&
              n.scrollTop(
                t.offset().top +
                  t.outerHeight() -
                  n.offset().top +
                  n.scrollTop() -
                  n.height(),
              ));
      }
    }),
    (t.prototype.handleKeyDown = function (t) {
      var s = e(this.selectElement),
        o = s.data("selectBox-control"),
        a = o.data("selectBox-options"),
        n = s.data("selectBox-settings"),
        l = 0,
        i = 0;
      if (!o.hasClass("selectBox-disabled"))
        switch (t.keyCode) {
          case 8:
            t.preventDefault(), (this.typeSearch = "");
            break;
          case 9:
          case 27:
            this.hideMenus(), this.removeHover();
            break;
          case 13:
            o.hasClass("selectBox-menuShowing")
              ? (this.selectOption(a.find("LI.selectBox-hover:first"), t),
                o.hasClass("selectBox-dropdown") && this.hideMenus())
              : this.showMenu();
            break;
          case 38:
          case 37:
            if ((t.preventDefault(), o.hasClass("selectBox-menuShowing"))) {
              var c = a.find(".selectBox-hover").prev("LI");
              for (
                l = a.find("LI:not(.selectBox-optgroup)").length, i = 0;
                (0 === c.length ||
                  c.hasClass("selectBox-disabled") ||
                  c.hasClass("selectBox-optgroup")) &&
                (0 === (c = c.prev("LI")).length &&
                  (c = n.loopOptions ? a.find("LI:last") : a.find("LI:first")),
                !(++i >= l));

              );
              this.addHover(c),
                this.selectOption(c, t),
                this.keepOptionInView(c);
            } else this.showMenu();
            break;
          case 40:
          case 39:
            if ((t.preventDefault(), o.hasClass("selectBox-menuShowing"))) {
              var r = a.find(".selectBox-hover").next("LI");
              for (
                l = a.find("LI:not(.selectBox-optgroup)").length, i = 0;
                (0 === r.length ||
                  r.hasClass("selectBox-disabled") ||
                  r.hasClass("selectBox-optgroup")) &&
                (0 === (r = r.next("LI")).length &&
                  (r = n.loopOptions ? a.find("LI:first") : a.find("LI:last")),
                !(++i >= l));

              );
              this.addHover(r),
                this.selectOption(r, t),
                this.keepOptionInView(r);
            } else this.showMenu();
        }
    }),
    (t.prototype.handleKeyPress = function (t) {
      var s = e(this.selectElement).data("selectBox-control"),
        o = s.data("selectBox-options"),
        a = this;
      if (!s.hasClass("selectBox-disabled"))
        switch (t.keyCode) {
          case 9:
          case 27:
          case 13:
          case 38:
          case 37:
          case 40:
          case 39:
            break;
          default:
            s.hasClass("selectBox-menuShowing") || this.showMenu(),
              t.preventDefault(),
              clearTimeout(this.typeTimer),
              (this.typeSearch += String.fromCharCode(t.charCode || t.keyCode)),
              o.find("A").each(function () {
                if (
                  e(this)
                    .text()
                    .substr(0, a.typeSearch.length)
                    .toLowerCase() === a.typeSearch.toLowerCase()
                )
                  return (
                    a.addHover(e(this).parent()),
                    a.selectOption(e(this).parent(), t),
                    a.keepOptionInView(e(this).parent()),
                    !1
                  );
              }),
              (this.typeTimer = setTimeout(function () {
                a.typeSearch = "";
              }, 1e3));
        }
    }),
    (t.prototype.enable = function () {
      var t = e(this.selectElement);
      t.prop("disabled", !1);
      var s = t.data("selectBox-control");
      s && s.removeClass("selectBox-disabled");
    }),
    (t.prototype.disable = function () {
      var t = e(this.selectElement);
      t.prop("disabled", !0);
      var s = t.data("selectBox-control");
      s && s.addClass("selectBox-disabled");
    }),
    (t.prototype.setValue = function (t) {
      var s = e(this.selectElement);
      s.val(t),
        null === (t = s.val()) && ((t = s.children().first().val()), s.val(t));
      var o = s.data("selectBox-control");
      if (o) {
        var a = s.data("selectBox-settings"),
          n = o.data("selectBox-options");
        this.setLabel(),
          n.find(".selectBox-selected").removeClass("selectBox-selected"),
          n.find("A").each(function () {
            if ("object" == typeof t)
              for (var s = 0; s < t.length; s++)
                e(this).attr("rel") == t[s] &&
                  e(this).parent().addClass("selectBox-selected");
            else
              e(this).attr("rel") == t &&
                e(this).parent().addClass("selectBox-selected");
          }),
          a.change && a.change.call(s);
      }
    }),
    (t.prototype.disableSelection = function (t) {
      e(t)
        .css("MozUserSelect", "none")
        .bind("selectstart", function (e) {
          e.preventDefault();
        });
    }),
    (t.prototype.generateOptions = function (t, s) {
      var o = e("<li />"),
        a = e("<a />");
      o.addClass(t.attr("class")),
        o.data(t.data()),
        t.data("icon")
          ? a
              .attr("rel", t.val())
              .html(
                '<i class="fa fa-' +
                  t.data("icon") +
                  ' fa-fw fa-lg"></i> ' +
                  t.text(),
              )
          : a.attr("rel", t.val()).text(t.text()),
        o.append(a),
        t.attr("disabled") && o.addClass("selectBox-disabled"),
        t.attr("selected") && o.addClass("selectBox-selected"),
        s.append(o);
    }),
    e.extend(e.fn, {
      setOptions: function (t) {
        var s = e(this),
          o = s.data("selectBox-control");
        switch (typeof t) {
          case "string":
            s.html(t);
            break;
          case "object":
            for (var a in (s.html(""), t))
              if (null !== t[a])
                if ("object" == typeof t[a]) {
                  var n = e('<optgroup label="' + a + '" />');
                  for (var l in t[a])
                    n.append(
                      '<option value="' + l + '">' + t[a][l] + "</option>",
                    );
                  s.append(n);
                } else {
                  var i = e('<option value="' + a + '">' + t[a] + "</option>");
                  s.append(i);
                }
        }
        o && e(this).selectBox("refresh");
      },
      selectBox: function (s, o) {
        var a;
        switch (s) {
          case "control":
            return e(this).data("selectBox-control");
          case "settings":
            if (!o) return e(this).data("selectBox-settings");
            e(this).each(function () {
              e(this).data(
                "selectBox-settings",
                e.extend(!0, e(this).data("selectBox-settings"), o),
              );
            });
            break;
          case "options":
            if (void 0 === o)
              return e(this)
                .data("selectBox-control")
                .data("selectBox-options");
            e(this).each(function () {
              e(this).setOptions(o);
            });
            break;
          case "value":
            if (void 0 === o) return e(this).val();
            e(this).each(function () {
              (a = e(this).data("selectBox")) && a.setValue(o);
            });
            break;
          case "refresh":
            e(this).each(function () {
              (a = e(this).data("selectBox")) && a.refresh();
            });
            break;
          case "enable":
            e(this).each(function () {
              (a = e(this).data("selectBox")) && a.enable(this);
            });
            break;
          case "disable":
            e(this).each(function () {
              (a = e(this).data("selectBox")) && a.disable();
            });
            break;
          case "destroy":
            e(this).each(function () {
              (a = e(this).data("selectBox")) &&
                (a.destroy(), e(this).data("selectBox", null));
            });
            break;
          case "instance":
            return e(this).data("selectBox");
          default:
            e(this).each(function (o, a) {
              e(a).data("selectBox") || e(a).data("selectBox", new t(a, s));
            });
        }
        return e(this);
      },
    });
})(jQuery);

/*! Magnific Popup - v1.1.0 - 2016-02-20
 * http://dimsemenov.com/plugins/magnific-popup/
 * Copyright (c) 2016 Dmitry Semenov; */
!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery"], a)
    : a(
        "object" == typeof exports
          ? require("jquery")
          : window.jQuery || window.Zepto,
      );
})(function (a) {
  var b,
    c,
    d,
    e,
    f,
    g,
    h = "Close",
    i = "BeforeClose",
    j = "AfterClose",
    k = "BeforeAppend",
    l = "MarkupParse",
    m = "Open",
    n = "Change",
    o = "mfp",
    p = "." + o,
    q = "mfp-ready",
    r = "mfp-removing",
    s = "mfp-prevent-close",
    t = function () {},
    u = !!window.jQuery,
    v = a(window),
    w = function (a, c) {
      b.ev.on(o + a + p, c);
    },
    x = function (b, c, d, e) {
      var f = document.createElement("div");
      return (
        (f.className = "mfp-" + b),
        d && (f.innerHTML = d),
        e ? c && c.appendChild(f) : ((f = a(f)), c && f.appendTo(c)),
        f
      );
    },
    y = function (c, d) {
      b.ev.triggerHandler(o + c, d),
        b.st.callbacks &&
          ((c = c.charAt(0).toLowerCase() + c.slice(1)),
          b.st.callbacks[c] &&
            b.st.callbacks[c].apply(b, a.isArray(d) ? d : [d]));
    },
    z = function (c) {
      return (
        (c === g && b.currTemplate.closeBtn) ||
          ((b.currTemplate.closeBtn = a(
            b.st.closeMarkup.replace("%title%", b.st.tClose),
          )),
          (g = c)),
        b.currTemplate.closeBtn
      );
    },
    A = function () {
      a.magnificPopup.instance ||
        ((b = new t()), b.init(), (a.magnificPopup.instance = b));
    },
    B = function () {
      var a = document.createElement("p").style,
        b = ["ms", "O", "Moz", "Webkit"];
      if (void 0 !== a.transition) return !0;
      for (; b.length; ) if (b.pop() + "Transition" in a) return !0;
      return !1;
    };
  (t.prototype = {
    constructor: t,
    init: function () {
      var c = navigator.appVersion;
      (b.isLowIE = b.isIE8 = document.all && !document.addEventListener),
        (b.isAndroid = /android/gi.test(c)),
        (b.isIOS = /iphone|ipad|ipod/gi.test(c)),
        (b.supportsTransition = B()),
        (b.probablyMobile =
          b.isAndroid ||
          b.isIOS ||
          /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(
            navigator.userAgent,
          )),
        (d = a(document)),
        (b.popupsCache = {});
    },
    open: function (c) {
      var e;
      if (c.isObj === !1) {
        (b.items = c.items.toArray()), (b.index = 0);
        var g,
          h = c.items;
        for (e = 0; e < h.length; e++)
          if (((g = h[e]), g.parsed && (g = g.el[0]), g === c.el[0])) {
            b.index = e;
            break;
          }
      } else
        (b.items = a.isArray(c.items) ? c.items : [c.items]),
          (b.index = c.index || 0);
      if (b.isOpen) return void b.updateItemHTML();
      (b.types = []),
        (f = ""),
        c.mainEl && c.mainEl.length ? (b.ev = c.mainEl.eq(0)) : (b.ev = d),
        c.key
          ? (b.popupsCache[c.key] || (b.popupsCache[c.key] = {}),
            (b.currTemplate = b.popupsCache[c.key]))
          : (b.currTemplate = {}),
        (b.st = a.extend(!0, {}, a.magnificPopup.defaults, c)),
        (b.fixedContentPos =
          "auto" === b.st.fixedContentPos
            ? !b.probablyMobile
            : b.st.fixedContentPos),
        b.st.modal &&
          ((b.st.closeOnContentClick = !1),
          (b.st.closeOnBgClick = !1),
          (b.st.showCloseBtn = !1),
          (b.st.enableEscapeKey = !1)),
        b.bgOverlay ||
          ((b.bgOverlay = x("bg").on("click" + p, function () {
            b.close();
          })),
          (b.wrap = x("wrap")
            .attr("tabindex", -1)
            .on("click" + p, function (a) {
              b._checkIfClose(a.target) && b.close();
            })),
          (b.container = x("container", b.wrap))),
        (b.contentContainer = x("content")),
        b.st.preloader &&
          (b.preloader = x("preloader", b.container, b.st.tLoading));
      var i = a.magnificPopup.modules;
      for (e = 0; e < i.length; e++) {
        var j = i[e];
        (j = j.charAt(0).toUpperCase() + j.slice(1)), b["init" + j].call(b);
      }
      y("BeforeOpen"),
        b.st.showCloseBtn &&
          (b.st.closeBtnInside
            ? (w(l, function (a, b, c, d) {
                c.close_replaceWith = z(d.type);
              }),
              (f += " mfp-close-btn-in"))
            : b.wrap.append(z())),
        b.st.alignTop && (f += " mfp-align-top"),
        b.fixedContentPos
          ? b.wrap.css({
              overflow: b.st.overflowY,
              overflowX: "hidden",
              overflowY: b.st.overflowY,
            })
          : b.wrap.css({ top: v.scrollTop(), position: "absolute" }),
        (b.st.fixedBgPos === !1 ||
          ("auto" === b.st.fixedBgPos && !b.fixedContentPos)) &&
          b.bgOverlay.css({ height: d.height(), position: "absolute" }),
        b.st.enableEscapeKey &&
          d.on("keyup" + p, function (a) {
            27 === a.keyCode && b.close();
          }),
        v.on("resize" + p, function () {
          b.updateSize();
        }),
        b.st.closeOnContentClick || (f += " mfp-auto-cursor"),
        f && b.wrap.addClass(f);
      var k = (b.wH = v.height()),
        n = {};
      if (b.fixedContentPos && b._hasScrollBar(k)) {
        var o = b._getScrollbarSize();
        o && (n.marginRight = o);
      }
      b.fixedContentPos &&
        (b.isIE7
          ? a("body, html").css("overflow", "hidden")
          : (n.overflow = "hidden"));
      var r = b.st.mainClass;
      return (
        b.isIE7 && (r += " mfp-ie7"),
        r && b._addClassToMFP(r),
        b.updateItemHTML(),
        y("BuildControls"),
        a("html").css(n),
        b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo || a(document.body)),
        (b._lastFocusedEl = document.activeElement),
        setTimeout(function () {
          b.content
            ? (b._addClassToMFP(q), b._setFocus())
            : b.bgOverlay.addClass(q),
            d.on("focusin" + p, b._onFocusIn);
        }, 16),
        (b.isOpen = !0),
        b.updateSize(k),
        y(m),
        c
      );
    },
    close: function () {
      b.isOpen &&
        (y(i),
        (b.isOpen = !1),
        b.st.removalDelay && !b.isLowIE && b.supportsTransition
          ? (b._addClassToMFP(r),
            setTimeout(function () {
              b._close();
            }, b.st.removalDelay))
          : b._close());
    },
    _close: function () {
      y(h);
      var c = r + " " + q + " ";
      if (
        (b.bgOverlay.detach(),
        b.wrap.detach(),
        b.container.empty(),
        b.st.mainClass && (c += b.st.mainClass + " "),
        b._removeClassFromMFP(c),
        b.fixedContentPos)
      ) {
        var e = { marginRight: "" };
        b.isIE7 ? a("body, html").css("overflow", "") : (e.overflow = ""),
          a("html").css(e);
      }
      d.off("keyup" + p + " focusin" + p),
        b.ev.off(p),
        b.wrap.attr("class", "mfp-wrap").removeAttr("style"),
        b.bgOverlay.attr("class", "mfp-bg"),
        b.container.attr("class", "mfp-container"),
        !b.st.showCloseBtn ||
          (b.st.closeBtnInside && b.currTemplate[b.currItem.type] !== !0) ||
          (b.currTemplate.closeBtn && b.currTemplate.closeBtn.detach()),
        b.st.autoFocusLast && b._lastFocusedEl && a(b._lastFocusedEl).focus(),
        (b.currItem = null),
        (b.content = null),
        (b.currTemplate = null),
        (b.prevHeight = 0),
        y(j);
    },
    updateSize: function (a) {
      if (b.isIOS) {
        var c = document.documentElement.clientWidth / window.innerWidth,
          d = window.innerHeight * c;
        b.wrap.css("height", d), (b.wH = d);
      } else b.wH = a || v.height();
      b.fixedContentPos || b.wrap.css("height", b.wH), y("Resize");
    },
    updateItemHTML: function () {
      var c = b.items[b.index];
      b.contentContainer.detach(),
        b.content && b.content.detach(),
        c.parsed || (c = b.parseEl(b.index));
      var d = c.type;
      if (
        (y("BeforeChange", [b.currItem ? b.currItem.type : "", d]),
        (b.currItem = c),
        !b.currTemplate[d])
      ) {
        var f = b.st[d] ? b.st[d].markup : !1;
        y("FirstMarkupParse", f),
          f ? (b.currTemplate[d] = a(f)) : (b.currTemplate[d] = !0);
      }
      e && e !== c.type && b.container.removeClass("mfp-" + e + "-holder");
      var g = b["get" + d.charAt(0).toUpperCase() + d.slice(1)](
        c,
        b.currTemplate[d],
      );
      b.appendContent(g, d),
        (c.preloaded = !0),
        y(n, c),
        (e = c.type),
        b.container.prepend(b.contentContainer),
        y("AfterChange");
    },
    appendContent: function (a, c) {
      (b.content = a),
        a
          ? b.st.showCloseBtn && b.st.closeBtnInside && b.currTemplate[c] === !0
            ? b.content.find(".mfp-close").length || b.content.append(z())
            : (b.content = a)
          : (b.content = ""),
        y(k),
        b.container.addClass("mfp-" + c + "-holder"),
        b.contentContainer.append(b.content);
    },
    parseEl: function (c) {
      var d,
        e = b.items[c];
      if (
        (e.tagName
          ? (e = { el: a(e) })
          : ((d = e.type), (e = { data: e, src: e.src })),
        e.el)
      ) {
        for (var f = b.types, g = 0; g < f.length; g++)
          if (e.el.hasClass("mfp-" + f[g])) {
            d = f[g];
            break;
          }
        (e.src = e.el.attr("data-mfp-src")),
          e.src || (e.src = e.el.attr("href"));
      }
      return (
        (e.type = d || b.st.type || "inline"),
        (e.index = c),
        (e.parsed = !0),
        (b.items[c] = e),
        y("ElementParse", e),
        b.items[c]
      );
    },
    addGroup: function (a, c) {
      var d = function (d) {
        (d.mfpEl = this), b._openClick(d, a, c);
      };
      c || (c = {});
      var e = "click.magnificPopup";
      (c.mainEl = a),
        c.items
          ? ((c.isObj = !0), a.off(e).on(e, d))
          : ((c.isObj = !1),
            c.delegate
              ? a.off(e).on(e, c.delegate, d)
              : ((c.items = a), a.off(e).on(e, d)));
    },
    _openClick: function (c, d, e) {
      var f =
        void 0 !== e.midClick ? e.midClick : a.magnificPopup.defaults.midClick;
      if (
        f ||
        !(2 === c.which || c.ctrlKey || c.metaKey || c.altKey || c.shiftKey)
      ) {
        var g =
          void 0 !== e.disableOn
            ? e.disableOn
            : a.magnificPopup.defaults.disableOn;
        if (g)
          if (a.isFunction(g)) {
            if (!g.call(b)) return !0;
          } else if (v.width() < g) return !0;
        c.type && (c.preventDefault(), b.isOpen && c.stopPropagation()),
          (e.el = a(c.mfpEl)),
          e.delegate && (e.items = d.find(e.delegate)),
          b.open(e);
      }
    },
    updateStatus: function (a, d) {
      if (b.preloader) {
        c !== a && b.container.removeClass("mfp-s-" + c),
          d || "loading" !== a || (d = b.st.tLoading);
        var e = { status: a, text: d };
        y("UpdateStatus", e),
          (a = e.status),
          (d = e.text),
          b.preloader.html(d),
          b.preloader.find("a").on("click", function (a) {
            a.stopImmediatePropagation();
          }),
          b.container.addClass("mfp-s-" + a),
          (c = a);
      }
    },
    _checkIfClose: function (c) {
      if (!a(c).hasClass(s)) {
        var d = b.st.closeOnContentClick,
          e = b.st.closeOnBgClick;
        if (d && e) return !0;
        if (
          !b.content ||
          a(c).hasClass("mfp-close") ||
          (b.preloader && c === b.preloader[0])
        )
          return !0;
        if (c === b.content[0] || a.contains(b.content[0], c)) {
          if (d) return !0;
        } else if (e && a.contains(document, c)) return !0;
        return !1;
      }
    },
    _addClassToMFP: function (a) {
      b.bgOverlay.addClass(a), b.wrap.addClass(a);
    },
    _removeClassFromMFP: function (a) {
      this.bgOverlay.removeClass(a), b.wrap.removeClass(a);
    },
    _hasScrollBar: function (a) {
      return (
        (b.isIE7 ? d.height() : document.body.scrollHeight) > (a || v.height())
      );
    },
    _setFocus: function () {
      (b.st.focus ? b.content.find(b.st.focus).eq(0) : b.wrap).focus();
    },
    _onFocusIn: function (c) {
      return c.target === b.wrap[0] || a.contains(b.wrap[0], c.target)
        ? void 0
        : (b._setFocus(), !1);
    },
    _parseMarkup: function (b, c, d) {
      var e;
      d.data && (c = a.extend(d.data, c)),
        y(l, [b, c, d]),
        a.each(c, function (c, d) {
          if (void 0 === d || d === !1) return !0;
          if (((e = c.split("_")), e.length > 1)) {
            var f = b.find(p + "-" + e[0]);
            if (f.length > 0) {
              var g = e[1];
              "replaceWith" === g
                ? f[0] !== d[0] && f.replaceWith(d)
                : "img" === g
                  ? f.is("img")
                    ? f.attr("src", d)
                    : f.replaceWith(
                        a("<img>")
                          .attr("src", d)
                          .attr("class", f.attr("class")),
                      )
                  : f.attr(e[1], d);
            }
          } else b.find(p + "-" + c).html(d);
        });
    },
    _getScrollbarSize: function () {
      if (void 0 === b.scrollbarSize) {
        var a = document.createElement("div");
        (a.style.cssText =
          "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;"),
          document.body.appendChild(a),
          (b.scrollbarSize = a.offsetWidth - a.clientWidth),
          document.body.removeChild(a);
      }
      return b.scrollbarSize;
    },
  }),
    (a.magnificPopup = {
      instance: null,
      proto: t.prototype,
      modules: [],
      open: function (b, c) {
        return (
          A(),
          (b = b ? a.extend(!0, {}, b) : {}),
          (b.isObj = !0),
          (b.index = c || 0),
          this.instance.open(b)
        );
      },
      close: function () {
        return a.magnificPopup.instance && a.magnificPopup.instance.close();
      },
      registerModule: function (b, c) {
        c.options && (a.magnificPopup.defaults[b] = c.options),
          a.extend(this.proto, c.proto),
          this.modules.push(b);
      },
      defaults: {
        disableOn: 0,
        key: null,
        midClick: !1,
        mainClass: "",
        preloader: !0,
        focus: "",
        closeOnContentClick: !1,
        closeOnBgClick: !0,
        closeBtnInside: !0,
        showCloseBtn: !0,
        enableEscapeKey: !0,
        modal: !1,
        alignTop: !1,
        removalDelay: 0,
        prependTo: null,
        fixedContentPos: "auto",
        fixedBgPos: "auto",
        overflowY: "auto",
        closeMarkup:
          '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
        tClose: "Close (Esc)",
        tLoading: "Loading...",
        autoFocusLast: !0,
      },
    }),
    (a.fn.magnificPopup = function (c) {
      A();
      var d = a(this);
      if ("string" == typeof c)
        if ("open" === c) {
          var e,
            f = u ? d.data("magnificPopup") : d[0].magnificPopup,
            g = parseInt(arguments[1], 10) || 0;
          f.items
            ? (e = f.items[g])
            : ((e = d), f.delegate && (e = e.find(f.delegate)), (e = e.eq(g))),
            b._openClick({ mfpEl: e }, d, f);
        } else
          b.isOpen && b[c].apply(b, Array.prototype.slice.call(arguments, 1));
      else
        (c = a.extend(!0, {}, c)),
          u ? d.data("magnificPopup", c) : (d[0].magnificPopup = c),
          b.addGroup(d, c);
      return d;
    });
  var C,
    D,
    E,
    F = "inline",
    G = function () {
      E && (D.after(E.addClass(C)).detach(), (E = null));
    };
  a.magnificPopup.registerModule(F, {
    options: {
      hiddenClass: "hide",
      markup: "",
      tNotFound: "Content not found",
    },
    proto: {
      initInline: function () {
        b.types.push(F),
          w(h + "." + F, function () {
            G();
          });
      },
      getInline: function (c, d) {
        if ((G(), c.src)) {
          var e = b.st.inline,
            f = a(c.src);
          if (f.length) {
            var g = f[0].parentNode;
            g &&
              g.tagName &&
              (D || ((C = e.hiddenClass), (D = x(C)), (C = "mfp-" + C)),
              (E = f.after(D).detach().removeClass(C))),
              b.updateStatus("ready");
          } else b.updateStatus("error", e.tNotFound), (f = a("<div>"));
          return (c.inlineElement = f), f;
        }
        return b.updateStatus("ready"), b._parseMarkup(d, {}, c), d;
      },
    },
  });
  var H,
    I = "ajax",
    J = function () {
      H && a(document.body).removeClass(H);
    },
    K = function () {
      J(), b.req && b.req.abort();
    };
  a.magnificPopup.registerModule(I, {
    options: {
      settings: null,
      cursor: "mfp-ajax-cur",
      tError: '<a href="%url%">The content</a> could not be loaded.',
    },
    proto: {
      initAjax: function () {
        b.types.push(I),
          (H = b.st.ajax.cursor),
          w(h + "." + I, K),
          w("BeforeChange." + I, K);
      },
      getAjax: function (c) {
        H && a(document.body).addClass(H), b.updateStatus("loading");
        var d = a.extend(
          {
            url: c.src,
            success: function (d, e, f) {
              var g = { data: d, xhr: f };
              y("ParseAjax", g),
                b.appendContent(a(g.data), I),
                (c.finished = !0),
                J(),
                b._setFocus(),
                setTimeout(function () {
                  b.wrap.addClass(q);
                }, 16),
                b.updateStatus("ready"),
                y("AjaxContentAdded");
            },
            error: function () {
              J(),
                (c.finished = c.loadError = !0),
                b.updateStatus(
                  "error",
                  b.st.ajax.tError.replace("%url%", c.src),
                );
            },
          },
          b.st.ajax.settings,
        );
        return (b.req = a.ajax(d)), "";
      },
    },
  });
  var L,
    M = function (c) {
      if (c.data && void 0 !== c.data.title) return c.data.title;
      var d = b.st.image.titleSrc;
      if (d) {
        if (a.isFunction(d)) return d.call(b, c);
        if (c.el) return c.el.attr(d) || "";
      }
      return "";
    };
  a.magnificPopup.registerModule("image", {
    options: {
      markup:
        '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
      cursor: "mfp-zoom-out-cur",
      titleSrc: "title",
      verticalFit: !0,
      tError: '<a href="%url%">The image</a> could not be loaded.',
    },
    proto: {
      initImage: function () {
        var c = b.st.image,
          d = ".image";
        b.types.push("image"),
          w(m + d, function () {
            "image" === b.currItem.type &&
              c.cursor &&
              a(document.body).addClass(c.cursor);
          }),
          w(h + d, function () {
            c.cursor && a(document.body).removeClass(c.cursor),
              v.off("resize" + p);
          }),
          w("Resize" + d, b.resizeImage),
          b.isLowIE && w("AfterChange", b.resizeImage);
      },
      resizeImage: function () {
        var a = b.currItem;
        if (a && a.img && b.st.image.verticalFit) {
          var c = 0;
          b.isLowIE &&
            (c =
              parseInt(a.img.css("padding-top"), 10) +
              parseInt(a.img.css("padding-bottom"), 10)),
            a.img.css("max-height", b.wH - c);
        }
      },
      _onImageHasSize: function (a) {
        a.img &&
          ((a.hasSize = !0),
          L && clearInterval(L),
          (a.isCheckingImgSize = !1),
          y("ImageHasSize", a),
          a.imgHidden &&
            (b.content && b.content.removeClass("mfp-loading"),
            (a.imgHidden = !1)));
      },
      findImageSize: function (a) {
        var c = 0,
          d = a.img[0],
          e = function (f) {
            L && clearInterval(L),
              (L = setInterval(function () {
                return d.naturalWidth > 0
                  ? void b._onImageHasSize(a)
                  : (c > 200 && clearInterval(L),
                    c++,
                    void (3 === c
                      ? e(10)
                      : 40 === c
                        ? e(50)
                        : 100 === c && e(500)));
              }, f));
          };
        e(1);
      },
      getImage: function (c, d) {
        var e = 0,
          f = function () {
            c &&
              (c.img[0].complete
                ? (c.img.off(".mfploader"),
                  c === b.currItem &&
                    (b._onImageHasSize(c), b.updateStatus("ready")),
                  (c.hasSize = !0),
                  (c.loaded = !0),
                  y("ImageLoadComplete"))
                : (e++, 200 > e ? setTimeout(f, 100) : g()));
          },
          g = function () {
            c &&
              (c.img.off(".mfploader"),
              c === b.currItem &&
                (b._onImageHasSize(c),
                b.updateStatus("error", h.tError.replace("%url%", c.src))),
              (c.hasSize = !0),
              (c.loaded = !0),
              (c.loadError = !0));
          },
          h = b.st.image,
          i = d.find(".mfp-img");
        if (i.length) {
          var j = document.createElement("img");
          (j.className = "mfp-img"),
            c.el &&
              c.el.find("img").length &&
              (j.alt = c.el.find("img").attr("alt")),
            (c.img = a(j).on("load.mfploader", f).on("error.mfploader", g)),
            (j.src = c.src),
            i.is("img") && (c.img = c.img.clone()),
            (j = c.img[0]),
            j.naturalWidth > 0 ? (c.hasSize = !0) : j.width || (c.hasSize = !1);
        }
        return (
          b._parseMarkup(d, { title: M(c), img_replaceWith: c.img }, c),
          b.resizeImage(),
          c.hasSize
            ? (L && clearInterval(L),
              c.loadError
                ? (d.addClass("mfp-loading"),
                  b.updateStatus("error", h.tError.replace("%url%", c.src)))
                : (d.removeClass("mfp-loading"), b.updateStatus("ready")),
              d)
            : (b.updateStatus("loading"),
              (c.loading = !0),
              c.hasSize ||
                ((c.imgHidden = !0),
                d.addClass("mfp-loading"),
                b.findImageSize(c)),
              d)
        );
      },
    },
  });
  var N,
    O = function () {
      return (
        void 0 === N &&
          (N = void 0 !== document.createElement("p").style.MozTransform),
        N
      );
    };
  a.magnificPopup.registerModule("zoom", {
    options: {
      enabled: !1,
      easing: "ease-in-out",
      duration: 300,
      opener: function (a) {
        return a.is("img") ? a : a.find("img");
      },
    },
    proto: {
      initZoom: function () {
        var a,
          c = b.st.zoom,
          d = ".zoom";
        if (c.enabled && b.supportsTransition) {
          var e,
            f,
            g = c.duration,
            j = function (a) {
              var b = a
                  .clone()
                  .removeAttr("style")
                  .removeAttr("class")
                  .addClass("mfp-animated-image"),
                d = "all " + c.duration / 1e3 + "s " + c.easing,
                e = {
                  position: "fixed",
                  zIndex: 9999,
                  left: 0,
                  top: 0,
                  "-webkit-backface-visibility": "hidden",
                },
                f = "transition";
              return (
                (e["-webkit-" + f] = e["-moz-" + f] = e["-o-" + f] = e[f] = d),
                b.css(e),
                b
              );
            },
            k = function () {
              b.content.css("visibility", "visible");
            };
          w("BuildControls" + d, function () {
            if (b._allowZoom()) {
              if (
                (clearTimeout(e),
                b.content.css("visibility", "hidden"),
                (a = b._getItemToZoom()),
                !a)
              )
                return void k();
              (f = j(a)),
                f.css(b._getOffset()),
                b.wrap.append(f),
                (e = setTimeout(function () {
                  f.css(b._getOffset(!0)),
                    (e = setTimeout(function () {
                      k(),
                        setTimeout(function () {
                          f.remove(), (a = f = null), y("ZoomAnimationEnded");
                        }, 16);
                    }, g));
                }, 16));
            }
          }),
            w(i + d, function () {
              if (b._allowZoom()) {
                if ((clearTimeout(e), (b.st.removalDelay = g), !a)) {
                  if (((a = b._getItemToZoom()), !a)) return;
                  f = j(a);
                }
                f.css(b._getOffset(!0)),
                  b.wrap.append(f),
                  b.content.css("visibility", "hidden"),
                  setTimeout(function () {
                    f.css(b._getOffset());
                  }, 16);
              }
            }),
            w(h + d, function () {
              b._allowZoom() && (k(), f && f.remove(), (a = null));
            });
        }
      },
      _allowZoom: function () {
        return "image" === b.currItem.type;
      },
      _getItemToZoom: function () {
        return b.currItem.hasSize ? b.currItem.img : !1;
      },
      _getOffset: function (c) {
        var d;
        d = c ? b.currItem.img : b.st.zoom.opener(b.currItem.el || b.currItem);
        var e = d.offset(),
          f = parseInt(d.css("padding-top"), 10),
          g = parseInt(d.css("padding-bottom"), 10);
        e.top -= a(window).scrollTop() - f;
        var h = {
          width: d.width(),
          height: (u ? d.innerHeight() : d[0].offsetHeight) - g - f,
        };
        return (
          O()
            ? (h["-moz-transform"] = h.transform =
                "translate(" + e.left + "px," + e.top + "px)")
            : ((h.left = e.left), (h.top = e.top)),
          h
        );
      },
    },
  });
  var P = "iframe",
    Q = "//about:blank",
    R = function (a) {
      if (b.currTemplate[P]) {
        var c = b.currTemplate[P].find("iframe");
        c.length &&
          (a || (c[0].src = Q),
          b.isIE8 && c.css("display", a ? "block" : "none"));
      }
    };
  a.magnificPopup.registerModule(P, {
    options: {
      markup:
        '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
      srcAction: "iframe_src",
      patterns: {
        youtube: {
          index: "youtube.com",
          id: "v=",
          src: "//www.youtube.com/embed/%id%?autoplay=1",
        },
        vimeo: {
          index: "vimeo.com/",
          id: "/",
          src: "//player.vimeo.com/video/%id%?autoplay=1",
        },
        gmaps: { index: "//maps.google.", src: "%id%&output=embed" },
      },
    },
    proto: {
      initIframe: function () {
        b.types.push(P),
          w("BeforeChange", function (a, b, c) {
            b !== c && (b === P ? R() : c === P && R(!0));
          }),
          w(h + "." + P, function () {
            R();
          });
      },
      getIframe: function (c, d) {
        var e = c.src,
          f = b.st.iframe;
        a.each(f.patterns, function () {
          return e.indexOf(this.index) > -1
            ? (this.id &&
                (e =
                  "string" == typeof this.id
                    ? e.substr(
                        e.lastIndexOf(this.id) + this.id.length,
                        e.length,
                      )
                    : this.id.call(this, e)),
              (e = this.src.replace("%id%", e)),
              !1)
            : void 0;
        });
        var g = {};
        return (
          f.srcAction && (g[f.srcAction] = e),
          b._parseMarkup(d, g, c),
          b.updateStatus("ready"),
          d
        );
      },
    },
  });
  var S = function (a) {
      var c = b.items.length;
      return a > c - 1 ? a - c : 0 > a ? c + a : a;
    },
    T = function (a, b, c) {
      return a.replace(/%curr%/gi, b + 1).replace(/%total%/gi, c);
    };
  a.magnificPopup.registerModule("gallery", {
    options: {
      enabled: !1,
      arrowMarkup:
        '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
      preload: [0, 2],
      navigateByImgClick: !0,
      arrows: !0,
      tPrev: "Previous (Left arrow key)",
      tNext: "Next (Right arrow key)",
      tCounter: "%curr% of %total%",
    },
    proto: {
      initGallery: function () {
        var c = b.st.gallery,
          e = ".mfp-gallery";
        return (
          (b.direction = !0),
          c && c.enabled
            ? ((f += " mfp-gallery"),
              w(m + e, function () {
                c.navigateByImgClick &&
                  b.wrap.on("click" + e, ".mfp-img", function () {
                    return b.items.length > 1 ? (b.next(), !1) : void 0;
                  }),
                  d.on("keydown" + e, function (a) {
                    37 === a.keyCode ? b.prev() : 39 === a.keyCode && b.next();
                  });
              }),
              w("UpdateStatus" + e, function (a, c) {
                c.text &&
                  (c.text = T(c.text, b.currItem.index, b.items.length));
              }),
              w(l + e, function (a, d, e, f) {
                var g = b.items.length;
                e.counter = g > 1 ? T(c.tCounter, f.index, g) : "";
              }),
              w("BuildControls" + e, function () {
                if (b.items.length > 1 && c.arrows && !b.arrowLeft) {
                  var d = c.arrowMarkup,
                    e = (b.arrowLeft = a(
                      d
                        .replace(/%title%/gi, c.tPrev)
                        .replace(/%dir%/gi, "left"),
                    ).addClass(s)),
                    f = (b.arrowRight = a(
                      d
                        .replace(/%title%/gi, c.tNext)
                        .replace(/%dir%/gi, "right"),
                    ).addClass(s));
                  e.click(function () {
                    b.prev();
                  }),
                    f.click(function () {
                      b.next();
                    }),
                    b.container.append(e.add(f));
                }
              }),
              w(n + e, function () {
                b._preloadTimeout && clearTimeout(b._preloadTimeout),
                  (b._preloadTimeout = setTimeout(function () {
                    b.preloadNearbyImages(), (b._preloadTimeout = null);
                  }, 16));
              }),
              void w(h + e, function () {
                d.off(e),
                  b.wrap.off("click" + e),
                  (b.arrowRight = b.arrowLeft = null);
              }))
            : !1
        );
      },
      next: function () {
        (b.direction = !0), (b.index = S(b.index + 1)), b.updateItemHTML();
      },
      prev: function () {
        (b.direction = !1), (b.index = S(b.index - 1)), b.updateItemHTML();
      },
      goTo: function (a) {
        (b.direction = a >= b.index), (b.index = a), b.updateItemHTML();
      },
      preloadNearbyImages: function () {
        var a,
          c = b.st.gallery.preload,
          d = Math.min(c[0], b.items.length),
          e = Math.min(c[1], b.items.length);
        for (a = 1; a <= (b.direction ? e : d); a++)
          b._preloadItem(b.index + a);
        for (a = 1; a <= (b.direction ? d : e); a++)
          b._preloadItem(b.index - a);
      },
      _preloadItem: function (c) {
        if (((c = S(c)), !b.items[c].preloaded)) {
          var d = b.items[c];
          d.parsed || (d = b.parseEl(c)),
            y("LazyLoad", d),
            "image" === d.type &&
              (d.img = a('<img class="mfp-img" />')
                .on("load.mfploader", function () {
                  d.hasSize = !0;
                })
                .on("error.mfploader", function () {
                  (d.hasSize = !0), (d.loadError = !0), y("LazyLoadError", d);
                })
                .attr("src", d.src)),
            (d.preloaded = !0);
        }
      },
    },
  });
  var U = "retina";
  a.magnificPopup.registerModule(U, {
    options: {
      replaceSrc: function (a) {
        return a.src.replace(/\.\w+$/, function (a) {
          return "@2x" + a;
        });
      },
      ratio: 1,
    },
    proto: {
      initRetina: function () {
        if (window.devicePixelRatio > 1) {
          var a = b.st.retina,
            c = a.ratio;
          (c = isNaN(c) ? c() : c),
            c > 1 &&
              (w("ImageHasSize." + U, function (a, b) {
                b.img.css({
                  "max-width": b.img[0].naturalWidth / c,
                  width: "100%",
                });
              }),
              w("ElementParse." + U, function (b, d) {
                d.src = a.replaceSrc(d, c);
              }));
        }
      },
    },
  }),
    A();
});

var jQuery = jQuery.noConflict();

let notificationBar = jQuery('.announcement-bar');
let notificationBarheight = jQuery('.announcement-bar').outerHeight(true);

jQuery(window).on('scroll load', function () {
  let scroll = jQuery(this).scrollTop();
  if (scroll > 4) {
    jQuery('.main-header').addClass('fixed_header');
    jQuery('.main-header').css({
      'margin-top': 0 + 'px',
    });
  } else {
    jQuery('.main-header').removeClass('fixed_header');
    jQuery('.main-header').css({
      'margin-top': notificationBarheight + 'px',
    });
  }
});
jQuery(document).ready(function () {
  if (notificationBar != 'undefined' && notificationBar.length > 0) {
    jQuery('.main-header').css({
      'margin-top': notificationBarheight + 'px',
    });
  }
  jQuery('.announcement-close').on('click', function (e) {
    e.preventDefault();
    jQuery('.main-header').css({
      'margin-top': 0 + 'px',
    });
  });
  let headClass = jQuery('.error404');
  if (headClass != 'undefined' && headClass.length > 0) {
    jQuery('.main-header').addClass('sticky_header');
  }
  jQuery('.toogle-btn').on('click', function (e) {
    e.preventDefault();
    jQuery(this).toggleClass('on');
    jQuery('.navigation').toggleClass('open');
  });
  jQuery('.accordion-header').on('click', function (e) {
    e.preventDefault();
    jQuery(this).parent().toggleClass('active');
    jQuery(this).parent().siblings().removeClass('active');
    jQuery(this)
      .parent()
      .siblings()
      .find('.accordion-header')
      .removeClass('open');
    jQuery(this).toggleClass('open');
    jQuery(this).siblings('.accordion-content').slideToggle(500);
    jQuery(this).parent().siblings().find('.accordion-content').slideUp(500);
  });

  jQuery('.product-overview-slide:first').addClass('current-slide');
  jQuery('.product-overview-text:first').addClass('current-tab');
  jQuery('.journey-list:first').addClass('active-tab');
  jQuery('.journey-list').on('click', function (e) {
    e.preventDefault();
    jQuery(this).siblings().removeClass('active-tab');
    jQuery(this).addClass('active-tab');
    let attrName = jQuery(this).attr('data-name');

    jQuery('.product-overview-text').removeClass('current-tab').hide();
    jQuery('.product-overview-text[data-target="' + attrName + '"]').fadeIn(
      'slow'
    );

    jQuery('.product-overview-slide').removeClass('current-slide');
    jQuery('.product-overview-slide[data-target="' + attrName + '"]').addClass(
      'current-slide'
    );
  });

  jQuery('ul.financial-qlinks li:first a').addClass('active');
  jQuery('.financial-row:first').addClass('current-q');
  jQuery('ul.financial-qlinks li a').on('click', function (e) {
    e.preventDefault();
    jQuery(this).parent().siblings().find('a').removeClass('active');
    jQuery(this).addClass('active');
    var attrName = jQuery(this).attr('data-name');
    jQuery('.financial-row').removeClass('current-q').hide();
    jQuery('.financial-row[data-target="' + attrName + '"]').fadeIn('normal');
  });

  jQuery('.contact-title').on('click', function (e) {
    e.preventDefault();
    jQuery(this).parent().addClass('active');
    jQuery(this).parent().siblings().removeClass('active');
    jQuery(this).parent().siblings().find('.contact-title').removeClass('open');
    jQuery(this).toggleClass('open');
    jQuery(this).siblings('.contact-address').slideToggle(500);
    jQuery(this).parent().siblings().find('.contact-address').slideUp(500);
  });

  jQuery('ul.policies-links li a:first').addClass('active');
  jQuery('.corporate-list-main:first').addClass('current-policie');

  jQuery('ul.policies-links li a').on('click', function (e) {
    e.preventDefault();
    jQuery(this).parent().siblings().find('a').removeClass('active');
    jQuery(this).addClass('active');
    var attrName = jQuery(this).attr('data-name');
    jQuery('.corporate-list-main').removeClass('current-policie').hide();
    jQuery('.corporate-list-main[data-target="' + attrName + '"]').fadeIn(
      'normal'
    );
  });
  jQuery('.show_more_link').on('click', function (e) {
    e.preventDefault();
    jQuery(this).toggleClass('show_less_link');
    let text = jQuery(this).find('span').text() == 'less' ? 'more' : 'less';
    jQuery(this).find('span').text(text);
    jQuery('.corporate-list:nth-child(n+5)')
      .fadeToggle(500)
      .css({ display: 'flex' });
  });
  jQuery('ul.scroll_links > li > a').on('click', function (e) {
    e.preventDefault();
    jQuery(this).parent().siblings().find('a').removeClass('active');
    jQuery(this).toggleClass('active');
  });

  jQuery('ul.module-assets-links li a:first').addClass('active');
  jQuery('.module-list-row:first').addClass('current');
  jQuery('ul.module-assets-links li a').on('click', function (e) {
    e.preventDefault();
    jQuery(this).parent().siblings().find('a').removeClass('active');
    jQuery(this).addClass('active');
    let attrName1 = jQuery(this).attr('data-value');
    jQuery('.module-list-row').removeClass('current').hide();
    jQuery('.module-list-row[data-target="' + attrName1 + '"]').fadeIn(
      'normal'
    );
  });

  jQuery('ul.module-library-links li a:first').addClass('active');
  jQuery('.library-list-row:first').addClass('current');
  jQuery('ul.module-library-links li a').on('click', function (e) {
    e.preventDefault();
    jQuery(this).parent().siblings().find('a').removeClass('active');
    jQuery(this).addClass('active');
    let attrName2 = jQuery(this).attr('data-value');
    jQuery('.library-list-row').removeClass('current').hide();
    jQuery('.library-list-row[data-target="' + attrName2 + '"]').fadeIn(
      'normal'
    );
  });

  jQuery('ul.module-resource-links li a:first').addClass('active');
  jQuery('.brochure-lists:first').addClass('current');
  jQuery('ul.module-resource-links li a').on('click', function (e) {
    e.preventDefault();
    jQuery(this).parent().siblings().find('a').removeClass('active');
    jQuery(this).addClass('active');
    let attrName3 = jQuery(this).attr('data-value');
    jQuery('.brochure-lists').removeClass('current').hide();
    jQuery('.brochure-lists[data-target="' + attrName3 + '"]').fadeIn('normal');
  });

  jQuery('.leadership-role span').on('click', function (e) {
    e.preventDefault();
    jQuery(this)
      .parents()
      .closest('.leadership-list-illumin')
      .siblings()
      .removeClass('expand');
    jQuery(this)
      .parents()
      .closest('.leadership-list-illumin')
      .toggleClass('expand');
    jQuery(this)
      .parents()
      .closest('.leadership-list-illumin')
      .siblings()
      .find('.leadership-desc')
      .fadeOut();
    jQuery(this).parent().siblings('.leadership-desc').fadeToggle();
  });
  jQuery('.leadership_arrow').on('click', function (e) {
    e.preventDefault();
    jQuery(this)
      .parents()
      .closest('.leadership-list-illumin')
      .siblings()
      .removeClass('expand');
    jQuery(this)
      .parents()
      .closest('.leadership-list-illumin')
      .toggleClass('expand');
    jQuery(this)
      .parents()
      .closest('.leadership-list-illumin')
      .siblings()
      .find('.leadership-desc')
      .fadeOut();
    jQuery(this).parent().siblings('.leadership-desc').fadeToggle();
  });
});

if (jQuery(window).width() >= 1024) {
  jQuery('li.menu-item-has-children.product-menu-item > ul.sub-menu').each(
    function () {
      if (jQuery(this).children('li').length < 3) {
        jQuery(this).addClass('nav_item_two');
      }
    }
  );
}

/*-- Ipad & Mobile jQuery --*/
let mobileIpad = function () {
  if (jQuery(window).width() <= 1023) {
    jQuery('ul.main_menu > li.menu-item-has-children > a').on(
      'click',
      function (event) {
        event.preventDefault();
        jQuery('ul.main_menu > li.menu-item-has-children > a')
          .not(jQuery(this))
          .removeClass('active');
        jQuery(this).toggleClass('active');
        jQuery(this).parent().siblings().find('ul.sub-menu').slideUp();
        jQuery(this).siblings('ul.sub-menu').slideToggle();
        jQuery(this).parent().siblings().toggleClass('sib');
      }
    );
  }
};
jQuery(document).on('ready', function () {
  mobileIpad();
});

/*-- only for mobile jQuery --*/
let mobileScreen = function () {
  if (jQuery(window).width() <= 767) {
    jQuery('.scroll_links_btn').on('click', function (e) {
      e.preventDefault();
      jQuery(this).toggleClass('active');
      jQuery(this).parent('.scroll_links_mobile').toggleClass('active');
      jQuery('ul.scroll_links').slideToggle();
    });
    jQuery('ul.scroll_links li a').on('click', function (e) {
      e.preventDefault();
      jQuery('.scroll_links_mobile').removeClass('active');
      jQuery('.scroll_links_btn').removeClass('active');
      jQuery('ul.scroll_links').fadeOut();
    });
    jQuery('.downloads-mobile-btn').on('click', function (e) {
      e.preventDefault();
      jQuery(this).toggleClass('active');
      jQuery(this).parent('.downloads-mobile').toggleClass('active');
      jQuery('ul.module-links').slideToggle();
    });
    jQuery('ul.module-links li a').on('click', function (e) {
      e.preventDefault();
      jQuery('.downloads-mobile-btn').removeClass('active');
      jQuery('ul.module-links').addClass('hide');
    });
  }
};
jQuery(document).on('ready', function () {
  mobileScreen();
});

/*-- window load jQuery --*/
let headerHeight = jQuery('.main-header').outerHeight(true);
jQuery(window).on('load', function () {
  jQuery('ul.scroll_links > li > a').click(function (e) {
    e.preventDefault();
    let myAttr = jQuery(this).attr('data-name');
    let scrollAttr = jQuery(
      '.lever-department[data-department="' + myAttr + '"]'
    );
    jQuery('html, body').animate(
      {
        scrollTop: scrollAttr.offset().top - headerHeight,
      },
      1000
    );
  });
});

if (
  navigator.userAgent.indexOf('Mac OS X') != -1 &&
  navigator.userAgent.indexOf('Safari') != -1 &&
  navigator.userAgent.indexOf('Chrome') == -1
) {
  jQuery('body').addClass('mac_os');
}

('use strict');
document.addEventListener('DOMContentLoaded', () => {
  const faqmain = document.querySelector('.faq-main');
  const accordionShow = (main) => {
    const link = main.querySelector('.faq-btn-link');
    const list = Array.from(main.querySelectorAll('.accordion-list'));
    const totallist = list.length;
    if (!link) return;
    let currentIndex = 5;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      this.classList.toggle('open');
      let nextIndex = Math.min(currentIndex + 5, totallist);
      for (let i = currentIndex; i < nextIndex; i++) {
        list[i].style.display = 'block';
      }
      currentIndex = nextIndex;
      if (currentIndex >= totallist) {
        link.style.display = 'none';
        return false;
      }
    });
  };
  if (faqmain) {
    accordionShow(faqmain);
  }
});

!(function (i) {
  "use strict";
  "function" == typeof define && define.amd
    ? define(["jquery"], i)
    : "undefined" != typeof exports
      ? (module.exports = i(require("jquery")))
      : i(jQuery);
})(function (i) {
  "use strict";
  var e = window.Slick || {};
  ((e = (function () {
    var e = 0;
    return function (t, o) {
      var s,
        n = this;
      (n.defaults = {
        accessibility: !0,
        adaptiveHeight: !1,
        appendArrows: i(t),
        appendDots: i(t),
        arrows: !0,
        asNavFor: null,
        prevArrow:
          '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow:
          '<button class="slick-next" aria-label="Next" type="button">Next</button>',
        autoplay: !1,
        autoplaySpeed: 3e3,
        centerMode: !1,
        centerPadding: "50px",
        cssEase: "ease",
        customPaging: function (e, t) {
          return i('<button type="button" />').text(t + 1);
        },
        dots: !1,
        dotsClass: "slick-dots",
        draggable: !0,
        easing: "linear",
        edgeFriction: 0.35,
        fade: !1,
        focusOnSelect: !1,
        focusOnChange: !1,
        infinite: !0,
        initialSlide: 0,
        lazyLoad: "ondemand",
        mobileFirst: !1,
        pauseOnHover: !0,
        pauseOnFocus: !0,
        pauseOnDotsHover: !1,
        respondTo: "window",
        responsive: null,
        rows: 1,
        rtl: !1,
        slide: "",
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: !0,
        swipeToSlide: !1,
        touchMove: !0,
        touchThreshold: 5,
        useCSS: !0,
        useTransform: !0,
        variableWidth: !1,
        vertical: !1,
        verticalSwiping: !1,
        waitForAnimate: !0,
        zIndex: 1e3,
      }),
        (n.initials = {
          animating: !1,
          dragging: !1,
          autoPlayTimer: null,
          currentDirection: 0,
          currentLeft: null,
          currentSlide: 0,
          direction: 1,
          $dots: null,
          listWidth: null,
          listHeight: null,
          loadIndex: 0,
          $nextArrow: null,
          $prevArrow: null,
          scrolling: !1,
          slideCount: null,
          slideWidth: null,
          $slideTrack: null,
          $slides: null,
          sliding: !1,
          slideOffset: 0,
          swipeLeft: null,
          swiping: !1,
          $list: null,
          touchObject: {},
          transformsEnabled: !1,
          unslicked: !1,
        }),
        i.extend(n, n.initials),
        (n.activeBreakpoint = null),
        (n.animType = null),
        (n.animProp = null),
        (n.breakpoints = []),
        (n.breakpointSettings = []),
        (n.cssTransitions = !1),
        (n.focussed = !1),
        (n.interrupted = !1),
        (n.hidden = "hidden"),
        (n.paused = !0),
        (n.positionProp = null),
        (n.respondTo = null),
        (n.rowCount = 1),
        (n.shouldClick = !0),
        (n.$slider = i(t)),
        (n.$slidesCache = null),
        (n.transformType = null),
        (n.transitionType = null),
        (n.visibilityChange = "visibilitychange"),
        (n.windowWidth = 0),
        (n.windowTimer = null),
        (s = i(t).data("slick") || {}),
        (n.options = i.extend({}, n.defaults, o, s)),
        (n.currentSlide = n.options.initialSlide),
        (n.originalSettings = n.options),
        void 0 !== document.mozHidden
          ? ((n.hidden = "mozHidden"),
            (n.visibilityChange = "mozvisibilitychange"))
          : void 0 !== document.webkitHidden &&
            ((n.hidden = "webkitHidden"),
            (n.visibilityChange = "webkitvisibilitychange")),
        (n.autoPlay = i.proxy(n.autoPlay, n)),
        (n.autoPlayClear = i.proxy(n.autoPlayClear, n)),
        (n.autoPlayIterator = i.proxy(n.autoPlayIterator, n)),
        (n.changeSlide = i.proxy(n.changeSlide, n)),
        (n.clickHandler = i.proxy(n.clickHandler, n)),
        (n.selectHandler = i.proxy(n.selectHandler, n)),
        (n.setPosition = i.proxy(n.setPosition, n)),
        (n.swipeHandler = i.proxy(n.swipeHandler, n)),
        (n.dragHandler = i.proxy(n.dragHandler, n)),
        (n.keyHandler = i.proxy(n.keyHandler, n)),
        (n.instanceUid = e++),
        (n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/),
        n.registerBreakpoints(),
        n.init(!0);
    };
  })()).prototype.activateADA = function () {
    this.$slideTrack
      .find(".slick-active")
      .attr({ "aria-hidden": "false" })
      .find("a, input, button, select")
      .attr({ tabindex: "0" });
  }),
    (e.prototype.addSlide = e.prototype.slickAdd =
      function (e, t, o) {
        var s = this;
        if ("boolean" == typeof t) (o = t), (t = null);
        else if (t < 0 || t >= s.slideCount) return !1;
        s.unload(),
          "number" == typeof t
            ? 0 === t && 0 === s.$slides.length
              ? i(e).appendTo(s.$slideTrack)
              : o
                ? i(e).insertBefore(s.$slides.eq(t))
                : i(e).insertAfter(s.$slides.eq(t))
            : !0 === o
              ? i(e).prependTo(s.$slideTrack)
              : i(e).appendTo(s.$slideTrack),
          (s.$slides = s.$slideTrack.children(this.options.slide)),
          s.$slideTrack.children(this.options.slide).detach(),
          s.$slideTrack.append(s.$slides),
          s.$slides.each(function (e, t) {
            i(t).attr("data-slick-index", e);
          }),
          (s.$slidesCache = s.$slides),
          s.reinit();
      }),
    (e.prototype.animateHeight = function () {
      var i = this;
      if (
        1 === i.options.slidesToShow &&
        !0 === i.options.adaptiveHeight &&
        !1 === i.options.vertical
      ) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.animate({ height: e }, i.options.speed);
      }
    }),
    (e.prototype.animateSlide = function (e, t) {
      var o = {},
        s = this;
      s.animateHeight(),
        !0 === s.options.rtl && !1 === s.options.vertical && (e = -e),
        !1 === s.transformsEnabled
          ? !1 === s.options.vertical
            ? s.$slideTrack.animate(
                { left: e },
                s.options.speed,
                s.options.easing,
                t,
              )
            : s.$slideTrack.animate(
                { top: e },
                s.options.speed,
                s.options.easing,
                t,
              )
          : !1 === s.cssTransitions
            ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft),
              i({ animStart: s.currentLeft }).animate(
                { animStart: e },
                {
                  duration: s.options.speed,
                  easing: s.options.easing,
                  step: function (i) {
                    (i = Math.ceil(i)),
                      !1 === s.options.vertical
                        ? ((o[s.animType] = "translate(" + i + "px, 0px)"),
                          s.$slideTrack.css(o))
                        : ((o[s.animType] = "translate(0px," + i + "px)"),
                          s.$slideTrack.css(o));
                  },
                  complete: function () {
                    t && t.call();
                  },
                },
              ))
            : (s.applyTransition(),
              (e = Math.ceil(e)),
              !1 === s.options.vertical
                ? (o[s.animType] = "translate3d(" + e + "px, 0px, 0px)")
                : (o[s.animType] = "translate3d(0px," + e + "px, 0px)"),
              s.$slideTrack.css(o),
              t &&
                setTimeout(function () {
                  s.disableTransition(), t.call();
                }, s.options.speed));
    }),
    (e.prototype.getNavTarget = function () {
      var e = this,
        t = e.options.asNavFor;
      return t && null !== t && (t = i(t).not(e.$slider)), t;
    }),
    (e.prototype.asNavFor = function (e) {
      var t = this.getNavTarget();
      null !== t &&
        "object" == typeof t &&
        t.each(function () {
          var t = i(this).slick("getSlick");
          t.unslicked || t.slideHandler(e, !0);
        });
    }),
    (e.prototype.applyTransition = function (i) {
      var e = this,
        t = {};
      !1 === e.options.fade
        ? (t[e.transitionType] =
            e.transformType + " " + e.options.speed + "ms " + e.options.cssEase)
        : (t[e.transitionType] =
            "opacity " + e.options.speed + "ms " + e.options.cssEase),
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }),
    (e.prototype.autoPlay = function () {
      var i = this;
      i.autoPlayClear(),
        i.slideCount > i.options.slidesToShow &&
          (i.autoPlayTimer = setInterval(
            i.autoPlayIterator,
            i.options.autoplaySpeed,
          ));
    }),
    (e.prototype.autoPlayClear = function () {
      var i = this;
      i.autoPlayTimer && clearInterval(i.autoPlayTimer);
    }),
    (e.prototype.autoPlayIterator = function () {
      var i = this,
        e = i.currentSlide + i.options.slidesToScroll;
      i.paused ||
        i.interrupted ||
        i.focussed ||
        (!1 === i.options.infinite &&
          (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1
            ? (i.direction = 0)
            : 0 === i.direction &&
              ((e = i.currentSlide - i.options.slidesToScroll),
              i.currentSlide - 1 == 0 && (i.direction = 1))),
        i.slideHandler(e));
    }),
    (e.prototype.buildArrows = function () {
      var e = this;
      !0 === e.options.arrows &&
        ((e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow")),
        (e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow")),
        e.slideCount > e.options.slidesToShow
          ? (e.$prevArrow
              .removeClass("slick-hidden")
              .removeAttr("aria-hidden tabindex"),
            e.$nextArrow
              .removeClass("slick-hidden")
              .removeAttr("aria-hidden tabindex"),
            e.htmlExpr.test(e.options.prevArrow) &&
              e.$prevArrow.prependTo(e.options.appendArrows),
            e.htmlExpr.test(e.options.nextArrow) &&
              e.$nextArrow.appendTo(e.options.appendArrows),
            !0 !== e.options.infinite &&
              e.$prevArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true"))
          : e.$prevArrow
              .add(e.$nextArrow)
              .addClass("slick-hidden")
              .attr({ "aria-disabled": "true", tabindex: "-1" }));
    }),
    (e.prototype.buildDots = function () {
      var e,
        t,
        o = this;
      if (!0 === o.options.dots) {
        for (
          o.$slider.addClass("slick-dotted"),
            t = i("<ul />").addClass(o.options.dotsClass),
            e = 0;
          e <= o.getDotCount();
          e += 1
        )
          t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
        (o.$dots = t.appendTo(o.options.appendDots)),
          o.$dots.find("li").first().addClass("slick-active");
      }
    }),
    (e.prototype.buildOut = function () {
      var e = this;
      (e.$slides = e.$slider
        .children(e.options.slide + ":not(.slick-cloned)")
        .addClass("slick-slide")),
        (e.slideCount = e.$slides.length),
        e.$slides.each(function (e, t) {
          i(t)
            .attr("data-slick-index", e)
            .data("originalStyling", i(t).attr("style") || "");
        }),
        e.$slider.addClass("slick-slider"),
        (e.$slideTrack =
          0 === e.slideCount
            ? i('<div class="slick-track"/>').appendTo(e.$slider)
            : e.$slides.wrapAll('<div class="slick-track"/>').parent()),
        (e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent()),
        e.$slideTrack.css("opacity", 0),
        (!0 !== e.options.centerMode && !0 !== e.options.swipeToSlide) ||
          (e.options.slidesToScroll = 1),
        i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"),
        e.setupInfinite(),
        e.buildArrows(),
        e.buildDots(),
        e.updateDots(),
        e.setSlideClasses(
          "number" == typeof e.currentSlide ? e.currentSlide : 0,
        ),
        !0 === e.options.draggable && e.$list.addClass("draggable");
    }),
    (e.prototype.buildRows = function () {
      var i,
        e,
        t,
        o,
        s,
        n,
        r,
        l = this;
      if (
        ((o = document.createDocumentFragment()),
        (n = l.$slider.children()),
        l.options.rows > 1)
      ) {
        for (
          r = l.options.slidesPerRow * l.options.rows,
            s = Math.ceil(n.length / r),
            i = 0;
          i < s;
          i++
        ) {
          var d = document.createElement("div");
          for (e = 0; e < l.options.rows; e++) {
            var a = document.createElement("div");
            for (t = 0; t < l.options.slidesPerRow; t++) {
              var c = i * r + (e * l.options.slidesPerRow + t);
              n.get(c) && a.appendChild(n.get(c));
            }
            d.appendChild(a);
          }
          o.appendChild(d);
        }
        l.$slider.empty().append(o),
          l.$slider
            .children()
            .children()
            .children()
            .css({
              width: 100 / l.options.slidesPerRow + "%",
              display: "inline-block",
            });
      }
    }),
    (e.prototype.checkResponsive = function (e, t) {
      var o,
        s,
        n,
        r = this,
        l = !1,
        d = r.$slider.width(),
        a = window.innerWidth || i(window).width();
      if (
        ("window" === r.respondTo
          ? (n = a)
          : "slider" === r.respondTo
            ? (n = d)
            : "min" === r.respondTo && (n = Math.min(a, d)),
        r.options.responsive &&
          r.options.responsive.length &&
          null !== r.options.responsive)
      ) {
        s = null;
        for (o in r.breakpoints)
          r.breakpoints.hasOwnProperty(o) &&
            (!1 === r.originalSettings.mobileFirst
              ? n < r.breakpoints[o] && (s = r.breakpoints[o])
              : n > r.breakpoints[o] && (s = r.breakpoints[o]));
        null !== s
          ? null !== r.activeBreakpoint
            ? (s !== r.activeBreakpoint || t) &&
              ((r.activeBreakpoint = s),
              "unslick" === r.breakpointSettings[s]
                ? r.unslick(s)
                : ((r.options = i.extend(
                    {},
                    r.originalSettings,
                    r.breakpointSettings[s],
                  )),
                  !0 === e && (r.currentSlide = r.options.initialSlide),
                  r.refresh(e)),
              (l = s))
            : ((r.activeBreakpoint = s),
              "unslick" === r.breakpointSettings[s]
                ? r.unslick(s)
                : ((r.options = i.extend(
                    {},
                    r.originalSettings,
                    r.breakpointSettings[s],
                  )),
                  !0 === e && (r.currentSlide = r.options.initialSlide),
                  r.refresh(e)),
              (l = s))
          : null !== r.activeBreakpoint &&
            ((r.activeBreakpoint = null),
            (r.options = r.originalSettings),
            !0 === e && (r.currentSlide = r.options.initialSlide),
            r.refresh(e),
            (l = s)),
          e || !1 === l || r.$slider.trigger("breakpoint", [r, l]);
      }
    }),
    (e.prototype.changeSlide = function (e, t) {
      var o,
        s,
        n,
        r = this,
        l = i(e.currentTarget);
      switch (
        (l.is("a") && e.preventDefault(),
        l.is("li") || (l = l.closest("li")),
        (n = r.slideCount % r.options.slidesToScroll != 0),
        (o = n
          ? 0
          : (r.slideCount - r.currentSlide) % r.options.slidesToScroll),
        e.data.message)
      ) {
        case "previous":
          (s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o),
            r.slideCount > r.options.slidesToShow &&
              r.slideHandler(r.currentSlide - s, !1, t);
          break;
        case "next":
          (s = 0 === o ? r.options.slidesToScroll : o),
            r.slideCount > r.options.slidesToShow &&
              r.slideHandler(r.currentSlide + s, !1, t);
          break;
        case "index":
          var d =
            0 === e.data.index
              ? 0
              : e.data.index || l.index() * r.options.slidesToScroll;
          r.slideHandler(r.checkNavigable(d), !1, t),
            l.children().trigger("focus");
          break;
        default:
          return;
      }
    }),
    (e.prototype.checkNavigable = function (i) {
      var e, t;
      if (((e = this.getNavigableIndexes()), (t = 0), i > e[e.length - 1]))
        i = e[e.length - 1];
      else
        for (var o in e) {
          if (i < e[o]) {
            i = t;
            break;
          }
          t = e[o];
        }
      return i;
    }),
    (e.prototype.cleanUpEvents = function () {
      var e = this;
      e.options.dots &&
        null !== e.$dots &&
        (i("li", e.$dots)
          .off("click.slick", e.changeSlide)
          .off("mouseenter.slick", i.proxy(e.interrupt, e, !0))
          .off("mouseleave.slick", i.proxy(e.interrupt, e, !1)),
        !0 === e.options.accessibility &&
          e.$dots.off("keydown.slick", e.keyHandler)),
        e.$slider.off("focus.slick blur.slick"),
        !0 === e.options.arrows &&
          e.slideCount > e.options.slidesToShow &&
          (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide),
          e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide),
          !0 === e.options.accessibility &&
            (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler),
            e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))),
        e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler),
        e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler),
        e.$list.off("touchend.slick mouseup.slick", e.swipeHandler),
        e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler),
        e.$list.off("click.slick", e.clickHandler),
        i(document).off(e.visibilityChange, e.visibility),
        e.cleanUpSlideEvents(),
        !0 === e.options.accessibility &&
          e.$list.off("keydown.slick", e.keyHandler),
        !0 === e.options.focusOnSelect &&
          i(e.$slideTrack).children().off("click.slick", e.selectHandler),
        i(window).off(
          "orientationchange.slick.slick-" + e.instanceUid,
          e.orientationChange,
        ),
        i(window).off("resize.slick.slick-" + e.instanceUid, e.resize),
        i("[draggable!=true]", e.$slideTrack).off(
          "dragstart",
          e.preventDefault,
        ),
        i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition);
    }),
    (e.prototype.cleanUpSlideEvents = function () {
      var e = this;
      e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1));
    }),
    (e.prototype.cleanUpRows = function () {
      var i,
        e = this;
      e.options.rows > 1 &&
        ((i = e.$slides.children().children()).removeAttr("style"),
        e.$slider.empty().append(i));
    }),
    (e.prototype.clickHandler = function (i) {
      !1 === this.shouldClick &&
        (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault());
    }),
    (e.prototype.destroy = function (e) {
      var t = this;
      t.autoPlayClear(),
        (t.touchObject = {}),
        t.cleanUpEvents(),
        i(".slick-cloned", t.$slider).detach(),
        t.$dots && t.$dots.remove(),
        t.$prevArrow &&
          t.$prevArrow.length &&
          (t.$prevArrow
            .removeClass("slick-disabled slick-arrow slick-hidden")
            .removeAttr("aria-hidden aria-disabled tabindex")
            .css("display", ""),
          t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()),
        t.$nextArrow &&
          t.$nextArrow.length &&
          (t.$nextArrow
            .removeClass("slick-disabled slick-arrow slick-hidden")
            .removeAttr("aria-hidden aria-disabled tabindex")
            .css("display", ""),
          t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()),
        t.$slides &&
          (t.$slides
            .removeClass(
              "slick-slide slick-active slick-center slick-visible slick-current",
            )
            .removeAttr("aria-hidden")
            .removeAttr("data-slick-index")
            .each(function () {
              i(this).attr("style", i(this).data("originalStyling"));
            }),
          t.$slideTrack.children(this.options.slide).detach(),
          t.$slideTrack.detach(),
          t.$list.detach(),
          t.$slider.append(t.$slides)),
        t.cleanUpRows(),
        t.$slider.removeClass("slick-slider"),
        t.$slider.removeClass("slick-initialized"),
        t.$slider.removeClass("slick-dotted"),
        (t.unslicked = !0),
        e || t.$slider.trigger("destroy", [t]);
    }),
    (e.prototype.disableTransition = function (i) {
      var e = this,
        t = {};
      (t[e.transitionType] = ""),
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }),
    (e.prototype.fadeSlide = function (i, e) {
      var t = this;
      !1 === t.cssTransitions
        ? (t.$slides.eq(i).css({ zIndex: t.options.zIndex }),
          t.$slides
            .eq(i)
            .animate({ opacity: 1 }, t.options.speed, t.options.easing, e))
        : (t.applyTransition(i),
          t.$slides.eq(i).css({ opacity: 1, zIndex: t.options.zIndex }),
          e &&
            setTimeout(function () {
              t.disableTransition(i), e.call();
            }, t.options.speed));
    }),
    (e.prototype.fadeSlideOut = function (i) {
      var e = this;
      !1 === e.cssTransitions
        ? e.$slides
            .eq(i)
            .animate(
              { opacity: 0, zIndex: e.options.zIndex - 2 },
              e.options.speed,
              e.options.easing,
            )
        : (e.applyTransition(i),
          e.$slides.eq(i).css({ opacity: 0, zIndex: e.options.zIndex - 2 }));
    }),
    (e.prototype.filterSlides = e.prototype.slickFilter =
      function (i) {
        var e = this;
        null !== i &&
          ((e.$slidesCache = e.$slides),
          e.unload(),
          e.$slideTrack.children(this.options.slide).detach(),
          e.$slidesCache.filter(i).appendTo(e.$slideTrack),
          e.reinit());
      }),
    (e.prototype.focusHandler = function () {
      var e = this;
      e.$slider
        .off("focus.slick blur.slick")
        .on("focus.slick blur.slick", "*", function (t) {
          t.stopImmediatePropagation();
          var o = i(this);
          setTimeout(function () {
            e.options.pauseOnFocus &&
              ((e.focussed = o.is(":focus")), e.autoPlay());
          }, 0);
        });
    }),
    (e.prototype.getCurrent = e.prototype.slickCurrentSlide =
      function () {
        return this.currentSlide;
      }),
    (e.prototype.getDotCount = function () {
      var i = this,
        e = 0,
        t = 0,
        o = 0;
      if (!0 === i.options.infinite)
        if (i.slideCount <= i.options.slidesToShow) ++o;
        else
          for (; e < i.slideCount; )
            ++o,
              (e = t + i.options.slidesToScroll),
              (t +=
                i.options.slidesToScroll <= i.options.slidesToShow
                  ? i.options.slidesToScroll
                  : i.options.slidesToShow);
      else if (!0 === i.options.centerMode) o = i.slideCount;
      else if (i.options.asNavFor)
        for (; e < i.slideCount; )
          ++o,
            (e = t + i.options.slidesToScroll),
            (t +=
              i.options.slidesToScroll <= i.options.slidesToShow
                ? i.options.slidesToScroll
                : i.options.slidesToShow);
      else
        o =
          1 +
          Math.ceil(
            (i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll,
          );
      return o - 1;
    }),
    (e.prototype.getLeft = function (i) {
      var e,
        t,
        o,
        s,
        n = this,
        r = 0;
      return (
        (n.slideOffset = 0),
        (t = n.$slides.first().outerHeight(!0)),
        !0 === n.options.infinite
          ? (n.slideCount > n.options.slidesToShow &&
              ((n.slideOffset = n.slideWidth * n.options.slidesToShow * -1),
              (s = -1),
              !0 === n.options.vertical &&
                !0 === n.options.centerMode &&
                (2 === n.options.slidesToShow
                  ? (s = -1.5)
                  : 1 === n.options.slidesToShow && (s = -2)),
              (r = t * n.options.slidesToShow * s)),
            n.slideCount % n.options.slidesToScroll != 0 &&
              i + n.options.slidesToScroll > n.slideCount &&
              n.slideCount > n.options.slidesToShow &&
              (i > n.slideCount
                ? ((n.slideOffset =
                    (n.options.slidesToShow - (i - n.slideCount)) *
                    n.slideWidth *
                    -1),
                  (r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1))
                : ((n.slideOffset =
                    (n.slideCount % n.options.slidesToScroll) *
                    n.slideWidth *
                    -1),
                  (r = (n.slideCount % n.options.slidesToScroll) * t * -1))))
          : i + n.options.slidesToShow > n.slideCount &&
            ((n.slideOffset =
              (i + n.options.slidesToShow - n.slideCount) * n.slideWidth),
            (r = (i + n.options.slidesToShow - n.slideCount) * t)),
        n.slideCount <= n.options.slidesToShow &&
          ((n.slideOffset = 0), (r = 0)),
        !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow
          ? (n.slideOffset =
              (n.slideWidth * Math.floor(n.options.slidesToShow)) / 2 -
              (n.slideWidth * n.slideCount) / 2)
          : !0 === n.options.centerMode && !0 === n.options.infinite
            ? (n.slideOffset +=
                n.slideWidth * Math.floor(n.options.slidesToShow / 2) -
                n.slideWidth)
            : !0 === n.options.centerMode &&
              ((n.slideOffset = 0),
              (n.slideOffset +=
                n.slideWidth * Math.floor(n.options.slidesToShow / 2))),
        (e =
          !1 === n.options.vertical
            ? i * n.slideWidth * -1 + n.slideOffset
            : i * t * -1 + r),
        !0 === n.options.variableWidth &&
          ((o =
            n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite
              ? n.$slideTrack.children(".slick-slide").eq(i)
              : n.$slideTrack
                  .children(".slick-slide")
                  .eq(i + n.options.slidesToShow)),
          (e =
            !0 === n.options.rtl
              ? o[0]
                ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width())
                : 0
              : o[0]
                ? -1 * o[0].offsetLeft
                : 0),
          !0 === n.options.centerMode &&
            ((o =
              n.slideCount <= n.options.slidesToShow ||
              !1 === n.options.infinite
                ? n.$slideTrack.children(".slick-slide").eq(i)
                : n.$slideTrack
                    .children(".slick-slide")
                    .eq(i + n.options.slidesToShow + 1)),
            (e =
              !0 === n.options.rtl
                ? o[0]
                  ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width())
                  : 0
                : o[0]
                  ? -1 * o[0].offsetLeft
                  : 0),
            (e += (n.$list.width() - o.outerWidth()) / 2))),
        e
      );
    }),
    (e.prototype.getOption = e.prototype.slickGetOption =
      function (i) {
        return this.options[i];
      }),
    (e.prototype.getNavigableIndexes = function () {
      var i,
        e = this,
        t = 0,
        o = 0,
        s = [];
      for (
        !1 === e.options.infinite
          ? (i = e.slideCount)
          : ((t = -1 * e.options.slidesToScroll),
            (o = -1 * e.options.slidesToScroll),
            (i = 2 * e.slideCount));
        t < i;

      )
        s.push(t),
          (t = o + e.options.slidesToScroll),
          (o +=
            e.options.slidesToScroll <= e.options.slidesToShow
              ? e.options.slidesToScroll
              : e.options.slidesToShow);
      return s;
    }),
    (e.prototype.getSlick = function () {
      return this;
    }),
    (e.prototype.getSlideCount = function () {
      var e,
        t,
        o = this;
      return (
        (t =
          !0 === o.options.centerMode
            ? o.slideWidth * Math.floor(o.options.slidesToShow / 2)
            : 0),
        !0 === o.options.swipeToSlide
          ? (o.$slideTrack.find(".slick-slide").each(function (s, n) {
              if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft)
                return (e = n), !1;
            }),
            Math.abs(i(e).attr("data-slick-index") - o.currentSlide) || 1)
          : o.options.slidesToScroll
      );
    }),
    (e.prototype.goTo = e.prototype.slickGoTo =
      function (i, e) {
        this.changeSlide({ data: { message: "index", index: parseInt(i) } }, e);
      }),
    (e.prototype.init = function (e) {
      var t = this;
      i(t.$slider).hasClass("slick-initialized") ||
        (i(t.$slider).addClass("slick-initialized"),
        t.buildRows(),
        t.buildOut(),
        t.setProps(),
        t.startLoad(),
        t.loadSlider(),
        t.initializeEvents(),
        t.updateArrows(),
        t.updateDots(),
        t.checkResponsive(!0),
        t.focusHandler()),
        e && t.$slider.trigger("init", [t]),
        !0 === t.options.accessibility && t.initADA(),
        t.options.autoplay && ((t.paused = !1), t.autoPlay());
    }),
    (e.prototype.initADA = function () {
      var e = this,
        t = Math.ceil(e.slideCount / e.options.slidesToShow),
        o = e.getNavigableIndexes().filter(function (i) {
          return i >= 0 && i < e.slideCount;
        });
      e.$slides
        .add(e.$slideTrack.find(".slick-cloned"))
        .attr({ "aria-hidden": "true", tabindex: "-1" })
        .find("a, input, button, select")
        .attr({ tabindex: "-1" }),
        null !== e.$dots &&
          (e.$slides
            .not(e.$slideTrack.find(".slick-cloned"))
            .each(function (t) {
              var s = o.indexOf(t);
              i(this).attr({
                role: "tabpanel",
                id: "slick-slide" + e.instanceUid + t,
                tabindex: -1,
              }),
                -1 !== s &&
                  i(this).attr({
                    "aria-describedby":
                      "slick-slide-control" + e.instanceUid + s,
                  });
            }),
          e.$dots
            .attr("role", "tablist")
            .find("li")
            .each(function (s) {
              var n = o[s];
              i(this).attr({ role: "presentation" }),
                i(this)
                  .find("button")
                  .first()
                  .attr({
                    role: "tab",
                    id: "slick-slide-control" + e.instanceUid + s,
                    "aria-controls": "slick-slide" + e.instanceUid + n,
                    "aria-label": s + 1 + " of " + t,
                    "aria-selected": null,
                    tabindex: "-1",
                  });
            })
            .eq(e.currentSlide)
            .find("button")
            .attr({ "aria-selected": "true", tabindex: "0" })
            .end());
      for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++)
        e.$slides.eq(s).attr("tabindex", 0);
      e.activateADA();
    }),
    (e.prototype.initArrowEvents = function () {
      var i = this;
      !0 === i.options.arrows &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow
          .off("click.slick")
          .on("click.slick", { message: "previous" }, i.changeSlide),
        i.$nextArrow
          .off("click.slick")
          .on("click.slick", { message: "next" }, i.changeSlide),
        !0 === i.options.accessibility &&
          (i.$prevArrow.on("keydown.slick", i.keyHandler),
          i.$nextArrow.on("keydown.slick", i.keyHandler)));
    }),
    (e.prototype.initDotEvents = function () {
      var e = this;
      !0 === e.options.dots &&
        (i("li", e.$dots).on(
          "click.slick",
          { message: "index" },
          e.changeSlide,
        ),
        !0 === e.options.accessibility &&
          e.$dots.on("keydown.slick", e.keyHandler)),
        !0 === e.options.dots &&
          !0 === e.options.pauseOnDotsHover &&
          i("li", e.$dots)
            .on("mouseenter.slick", i.proxy(e.interrupt, e, !0))
            .on("mouseleave.slick", i.proxy(e.interrupt, e, !1));
    }),
    (e.prototype.initSlideEvents = function () {
      var e = this;
      e.options.pauseOnHover &&
        (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)));
    }),
    (e.prototype.initializeEvents = function () {
      var e = this;
      e.initArrowEvents(),
        e.initDotEvents(),
        e.initSlideEvents(),
        e.$list.on(
          "touchstart.slick mousedown.slick",
          { action: "start" },
          e.swipeHandler,
        ),
        e.$list.on(
          "touchmove.slick mousemove.slick",
          { action: "move" },
          e.swipeHandler,
        ),
        e.$list.on(
          "touchend.slick mouseup.slick",
          { action: "end" },
          e.swipeHandler,
        ),
        e.$list.on(
          "touchcancel.slick mouseleave.slick",
          { action: "end" },
          e.swipeHandler,
        ),
        e.$list.on("click.slick", e.clickHandler),
        i(document).on(e.visibilityChange, i.proxy(e.visibility, e)),
        !0 === e.options.accessibility &&
          e.$list.on("keydown.slick", e.keyHandler),
        !0 === e.options.focusOnSelect &&
          i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        i(window).on(
          "orientationchange.slick.slick-" + e.instanceUid,
          i.proxy(e.orientationChange, e),
        ),
        i(window).on(
          "resize.slick.slick-" + e.instanceUid,
          i.proxy(e.resize, e),
        ),
        i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault),
        i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition),
        i(e.setPosition);
    }),
    (e.prototype.initUI = function () {
      var i = this;
      !0 === i.options.arrows &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow.show(), i.$nextArrow.show()),
        !0 === i.options.dots &&
          i.slideCount > i.options.slidesToShow &&
          i.$dots.show();
    }),
    (e.prototype.keyHandler = function (i) {
      var e = this;
      i.target.tagName.match("TEXTAREA|INPUT|SELECT") ||
        (37 === i.keyCode && !0 === e.options.accessibility
          ? e.changeSlide({
              data: { message: !0 === e.options.rtl ? "next" : "previous" },
            })
          : 39 === i.keyCode &&
            !0 === e.options.accessibility &&
            e.changeSlide({
              data: { message: !0 === e.options.rtl ? "previous" : "next" },
            }));
    }),
    (e.prototype.lazyLoad = function () {
      function e(e) {
        i("img[data-lazy]", e).each(function () {
          var e = i(this),
            t = i(this).attr("data-lazy"),
            o = i(this).attr("data-srcset"),
            s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes"),
            r = document.createElement("img");
          (r.onload = function () {
            e.animate({ opacity: 0 }, 100, function () {
              o && (e.attr("srcset", o), s && e.attr("sizes", s)),
                e.attr("src", t).animate({ opacity: 1 }, 200, function () {
                  e.removeAttr("data-lazy data-srcset data-sizes").removeClass(
                    "slick-loading",
                  );
                }),
                n.$slider.trigger("lazyLoaded", [n, e, t]);
            });
          }),
            (r.onerror = function () {
              e
                .removeAttr("data-lazy")
                .removeClass("slick-loading")
                .addClass("slick-lazyload-error"),
                n.$slider.trigger("lazyLoadError", [n, e, t]);
            }),
            (r.src = t);
        });
      }
      var t,
        o,
        s,
        n = this;
      if (
        (!0 === n.options.centerMode
          ? !0 === n.options.infinite
            ? (s =
                (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) +
                n.options.slidesToShow +
                2)
            : ((o = Math.max(
                0,
                n.currentSlide - (n.options.slidesToShow / 2 + 1),
              )),
              (s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide))
          : ((o = n.options.infinite
              ? n.options.slidesToShow + n.currentSlide
              : n.currentSlide),
            (s = Math.ceil(o + n.options.slidesToShow)),
            !0 === n.options.fade && (o > 0 && o--, s <= n.slideCount && s++)),
        (t = n.$slider.find(".slick-slide").slice(o, s)),
        "anticipated" === n.options.lazyLoad)
      )
        for (
          var r = o - 1, l = s, d = n.$slider.find(".slick-slide"), a = 0;
          a < n.options.slidesToScroll;
          a++
        )
          r < 0 && (r = n.slideCount - 1),
            (t = (t = t.add(d.eq(r))).add(d.eq(l))),
            r--,
            l++;
      e(t),
        n.slideCount <= n.options.slidesToShow
          ? e(n.$slider.find(".slick-slide"))
          : n.currentSlide >= n.slideCount - n.options.slidesToShow
            ? e(
                n.$slider
                  .find(".slick-cloned")
                  .slice(0, n.options.slidesToShow),
              )
            : 0 === n.currentSlide &&
              e(
                n.$slider
                  .find(".slick-cloned")
                  .slice(-1 * n.options.slidesToShow),
              );
    }),
    (e.prototype.loadSlider = function () {
      var i = this;
      i.setPosition(),
        i.$slideTrack.css({ opacity: 1 }),
        i.$slider.removeClass("slick-loading"),
        i.initUI(),
        "progressive" === i.options.lazyLoad && i.progressiveLazyLoad();
    }),
    (e.prototype.next = e.prototype.slickNext =
      function () {
        this.changeSlide({ data: { message: "next" } });
      }),
    (e.prototype.orientationChange = function () {
      var i = this;
      i.checkResponsive(), i.setPosition();
    }),
    (e.prototype.pause = e.prototype.slickPause =
      function () {
        var i = this;
        i.autoPlayClear(), (i.paused = !0);
      }),
    (e.prototype.play = e.prototype.slickPlay =
      function () {
        var i = this;
        i.autoPlay(),
          (i.options.autoplay = !0),
          (i.paused = !1),
          (i.focussed = !1),
          (i.interrupted = !1);
      }),
    (e.prototype.postSlide = function (e) {
      var t = this;
      t.unslicked ||
        (t.$slider.trigger("afterChange", [t, e]),
        (t.animating = !1),
        t.slideCount > t.options.slidesToShow && t.setPosition(),
        (t.swipeLeft = null),
        t.options.autoplay && t.autoPlay(),
        !0 === t.options.accessibility &&
          (t.initADA(),
          t.options.focusOnChange &&
            i(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()));
    }),
    (e.prototype.prev = e.prototype.slickPrev =
      function () {
        this.changeSlide({ data: { message: "previous" } });
      }),
    (e.prototype.preventDefault = function (i) {
      i.preventDefault();
    }),
    (e.prototype.progressiveLazyLoad = function (e) {
      e = e || 1;
      var t,
        o,
        s,
        n,
        r,
        l = this,
        d = i("img[data-lazy]", l.$slider);
      d.length
        ? ((t = d.first()),
          (o = t.attr("data-lazy")),
          (s = t.attr("data-srcset")),
          (n = t.attr("data-sizes") || l.$slider.attr("data-sizes")),
          ((r = document.createElement("img")).onload = function () {
            s && (t.attr("srcset", s), n && t.attr("sizes", n)),
              t
                .attr("src", o)
                .removeAttr("data-lazy data-srcset data-sizes")
                .removeClass("slick-loading"),
              !0 === l.options.adaptiveHeight && l.setPosition(),
              l.$slider.trigger("lazyLoaded", [l, t, o]),
              l.progressiveLazyLoad();
          }),
          (r.onerror = function () {
            e < 3
              ? setTimeout(function () {
                  l.progressiveLazyLoad(e + 1);
                }, 500)
              : (t
                  .removeAttr("data-lazy")
                  .removeClass("slick-loading")
                  .addClass("slick-lazyload-error"),
                l.$slider.trigger("lazyLoadError", [l, t, o]),
                l.progressiveLazyLoad());
          }),
          (r.src = o))
        : l.$slider.trigger("allImagesLoaded", [l]);
    }),
    (e.prototype.refresh = function (e) {
      var t,
        o,
        s = this;
      (o = s.slideCount - s.options.slidesToShow),
        !s.options.infinite && s.currentSlide > o && (s.currentSlide = o),
        s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0),
        (t = s.currentSlide),
        s.destroy(!0),
        i.extend(s, s.initials, { currentSlide: t }),
        s.init(),
        e || s.changeSlide({ data: { message: "index", index: t } }, !1);
    }),
    (e.prototype.registerBreakpoints = function () {
      var e,
        t,
        o,
        s = this,
        n = s.options.responsive || null;
      if ("array" === i.type(n) && n.length) {
        s.respondTo = s.options.respondTo || "window";
        for (e in n)
          if (((o = s.breakpoints.length - 1), n.hasOwnProperty(e))) {
            for (t = n[e].breakpoint; o >= 0; )
              s.breakpoints[o] &&
                s.breakpoints[o] === t &&
                s.breakpoints.splice(o, 1),
                o--;
            s.breakpoints.push(t), (s.breakpointSettings[t] = n[e].settings);
          }
        s.breakpoints.sort(function (i, e) {
          return s.options.mobileFirst ? i - e : e - i;
        });
      }
    }),
    (e.prototype.reinit = function () {
      var e = this;
      (e.$slides = e.$slideTrack
        .children(e.options.slide)
        .addClass("slick-slide")),
        (e.slideCount = e.$slides.length),
        e.currentSlide >= e.slideCount &&
          0 !== e.currentSlide &&
          (e.currentSlide = e.currentSlide - e.options.slidesToScroll),
        e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0),
        e.registerBreakpoints(),
        e.setProps(),
        e.setupInfinite(),
        e.buildArrows(),
        e.updateArrows(),
        e.initArrowEvents(),
        e.buildDots(),
        e.updateDots(),
        e.initDotEvents(),
        e.cleanUpSlideEvents(),
        e.initSlideEvents(),
        e.checkResponsive(!1, !0),
        !0 === e.options.focusOnSelect &&
          i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        e.setSlideClasses(
          "number" == typeof e.currentSlide ? e.currentSlide : 0,
        ),
        e.setPosition(),
        e.focusHandler(),
        (e.paused = !e.options.autoplay),
        e.autoPlay(),
        e.$slider.trigger("reInit", [e]);
    }),
    (e.prototype.resize = function () {
      var e = this;
      i(window).width() !== e.windowWidth &&
        (clearTimeout(e.windowDelay),
        (e.windowDelay = window.setTimeout(function () {
          (e.windowWidth = i(window).width()),
            e.checkResponsive(),
            e.unslicked || e.setPosition();
        }, 50)));
    }),
    (e.prototype.removeSlide = e.prototype.slickRemove =
      function (i, e, t) {
        var o = this;
        if (
          ((i =
            "boolean" == typeof i
              ? !0 === (e = i)
                ? 0
                : o.slideCount - 1
              : !0 === e
                ? --i
                : i),
          o.slideCount < 1 || i < 0 || i > o.slideCount - 1)
        )
          return !1;
        o.unload(),
          !0 === t
            ? o.$slideTrack.children().remove()
            : o.$slideTrack.children(this.options.slide).eq(i).remove(),
          (o.$slides = o.$slideTrack.children(this.options.slide)),
          o.$slideTrack.children(this.options.slide).detach(),
          o.$slideTrack.append(o.$slides),
          (o.$slidesCache = o.$slides),
          o.reinit();
      }),
    (e.prototype.setCSS = function (i) {
      var e,
        t,
        o = this,
        s = {};
      !0 === o.options.rtl && (i = -i),
        (e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px"),
        (t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px"),
        (s[o.positionProp] = i),
        !1 === o.transformsEnabled
          ? o.$slideTrack.css(s)
          : ((s = {}),
            !1 === o.cssTransitions
              ? ((s[o.animType] = "translate(" + e + ", " + t + ")"),
                o.$slideTrack.css(s))
              : ((s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)"),
                o.$slideTrack.css(s)));
    }),
    (e.prototype.setDimensions = function () {
      var i = this;
      !1 === i.options.vertical
        ? !0 === i.options.centerMode &&
          i.$list.css({ padding: "0px " + i.options.centerPadding })
        : (i.$list.height(
            i.$slides.first().outerHeight(!0) * i.options.slidesToShow,
          ),
          !0 === i.options.centerMode &&
            i.$list.css({ padding: i.options.centerPadding + " 0px" })),
        (i.listWidth = i.$list.width()),
        (i.listHeight = i.$list.height()),
        !1 === i.options.vertical && !1 === i.options.variableWidth
          ? ((i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow)),
            i.$slideTrack.width(
              Math.ceil(
                i.slideWidth * i.$slideTrack.children(".slick-slide").length,
              ),
            ))
          : !0 === i.options.variableWidth
            ? i.$slideTrack.width(5e3 * i.slideCount)
            : ((i.slideWidth = Math.ceil(i.listWidth)),
              i.$slideTrack.height(
                Math.ceil(
                  i.$slides.first().outerHeight(!0) *
                    i.$slideTrack.children(".slick-slide").length,
                ),
              ));
      var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
      !1 === i.options.variableWidth &&
        i.$slideTrack.children(".slick-slide").width(i.slideWidth - e);
    }),
    (e.prototype.setFade = function () {
      var e,
        t = this;
      t.$slides.each(function (o, s) {
        (e = t.slideWidth * o * -1),
          !0 === t.options.rtl
            ? i(s).css({
                position: "relative",
                right: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0,
              })
            : i(s).css({
                position: "relative",
                left: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0,
              });
      }),
        t.$slides
          .eq(t.currentSlide)
          .css({ zIndex: t.options.zIndex - 1, opacity: 1 });
    }),
    (e.prototype.setHeight = function () {
      var i = this;
      if (
        1 === i.options.slidesToShow &&
        !0 === i.options.adaptiveHeight &&
        !1 === i.options.vertical
      ) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.css("height", e);
      }
    }),
    (e.prototype.setOption = e.prototype.slickSetOption =
      function () {
        var e,
          t,
          o,
          s,
          n,
          r = this,
          l = !1;
        if (
          ("object" === i.type(arguments[0])
            ? ((o = arguments[0]), (l = arguments[1]), (n = "multiple"))
            : "string" === i.type(arguments[0]) &&
              ((o = arguments[0]),
              (s = arguments[1]),
              (l = arguments[2]),
              "responsive" === arguments[0] && "array" === i.type(arguments[1])
                ? (n = "responsive")
                : void 0 !== arguments[1] && (n = "single")),
          "single" === n)
        )
          r.options[o] = s;
        else if ("multiple" === n)
          i.each(o, function (i, e) {
            r.options[i] = e;
          });
        else if ("responsive" === n)
          for (t in s)
            if ("array" !== i.type(r.options.responsive))
              r.options.responsive = [s[t]];
            else {
              for (e = r.options.responsive.length - 1; e >= 0; )
                r.options.responsive[e].breakpoint === s[t].breakpoint &&
                  r.options.responsive.splice(e, 1),
                  e--;
              r.options.responsive.push(s[t]);
            }
        l && (r.unload(), r.reinit());
      }),
    (e.prototype.setPosition = function () {
      var i = this;
      i.setDimensions(),
        i.setHeight(),
        !1 === i.options.fade
          ? i.setCSS(i.getLeft(i.currentSlide))
          : i.setFade(),
        i.$slider.trigger("setPosition", [i]);
    }),
    (e.prototype.setProps = function () {
      var i = this,
        e = document.body.style;
      (i.positionProp = !0 === i.options.vertical ? "top" : "left"),
        "top" === i.positionProp
          ? i.$slider.addClass("slick-vertical")
          : i.$slider.removeClass("slick-vertical"),
        (void 0 === e.WebkitTransition &&
          void 0 === e.MozTransition &&
          void 0 === e.msTransition) ||
          (!0 === i.options.useCSS && (i.cssTransitions = !0)),
        i.options.fade &&
          ("number" == typeof i.options.zIndex
            ? i.options.zIndex < 3 && (i.options.zIndex = 3)
            : (i.options.zIndex = i.defaults.zIndex)),
        void 0 !== e.OTransform &&
          ((i.animType = "OTransform"),
          (i.transformType = "-o-transform"),
          (i.transitionType = "OTransition"),
          void 0 === e.perspectiveProperty &&
            void 0 === e.webkitPerspective &&
            (i.animType = !1)),
        void 0 !== e.MozTransform &&
          ((i.animType = "MozTransform"),
          (i.transformType = "-moz-transform"),
          (i.transitionType = "MozTransition"),
          void 0 === e.perspectiveProperty &&
            void 0 === e.MozPerspective &&
            (i.animType = !1)),
        void 0 !== e.webkitTransform &&
          ((i.animType = "webkitTransform"),
          (i.transformType = "-webkit-transform"),
          (i.transitionType = "webkitTransition"),
          void 0 === e.perspectiveProperty &&
            void 0 === e.webkitPerspective &&
            (i.animType = !1)),
        void 0 !== e.msTransform &&
          ((i.animType = "msTransform"),
          (i.transformType = "-ms-transform"),
          (i.transitionType = "msTransition"),
          void 0 === e.msTransform && (i.animType = !1)),
        void 0 !== e.transform &&
          !1 !== i.animType &&
          ((i.animType = "transform"),
          (i.transformType = "transform"),
          (i.transitionType = "transition")),
        (i.transformsEnabled =
          i.options.useTransform && null !== i.animType && !1 !== i.animType);
    }),
    (e.prototype.setSlideClasses = function (i) {
      var e,
        t,
        o,
        s,
        n = this;
      if (
        ((t = n.$slider
          .find(".slick-slide")
          .removeClass("slick-active slick-center slick-current")
          .attr("aria-hidden", "true")),
        n.$slides.eq(i).addClass("slick-current"),
        !0 === n.options.centerMode)
      ) {
        var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
        (e = Math.floor(n.options.slidesToShow / 2)),
          !0 === n.options.infinite &&
            (i >= e && i <= n.slideCount - 1 - e
              ? n.$slides
                  .slice(i - e + r, i + e + 1)
                  .addClass("slick-active")
                  .attr("aria-hidden", "false")
              : ((o = n.options.slidesToShow + i),
                t
                  .slice(o - e + 1 + r, o + e + 2)
                  .addClass("slick-active")
                  .attr("aria-hidden", "false")),
            0 === i
              ? t
                  .eq(t.length - 1 - n.options.slidesToShow)
                  .addClass("slick-center")
              : i === n.slideCount - 1 &&
                t.eq(n.options.slidesToShow).addClass("slick-center")),
          n.$slides.eq(i).addClass("slick-center");
      } else
        i >= 0 && i <= n.slideCount - n.options.slidesToShow
          ? n.$slides
              .slice(i, i + n.options.slidesToShow)
              .addClass("slick-active")
              .attr("aria-hidden", "false")
          : t.length <= n.options.slidesToShow
            ? t.addClass("slick-active").attr("aria-hidden", "false")
            : ((s = n.slideCount % n.options.slidesToShow),
              (o = !0 === n.options.infinite ? n.options.slidesToShow + i : i),
              n.options.slidesToShow == n.options.slidesToScroll &&
              n.slideCount - i < n.options.slidesToShow
                ? t
                    .slice(o - (n.options.slidesToShow - s), o + s)
                    .addClass("slick-active")
                    .attr("aria-hidden", "false")
                : t
                    .slice(o, o + n.options.slidesToShow)
                    .addClass("slick-active")
                    .attr("aria-hidden", "false"));
      ("ondemand" !== n.options.lazyLoad &&
        "anticipated" !== n.options.lazyLoad) ||
        n.lazyLoad();
    }),
    (e.prototype.setupInfinite = function () {
      var e,
        t,
        o,
        s = this;
      if (
        (!0 === s.options.fade && (s.options.centerMode = !1),
        !0 === s.options.infinite &&
          !1 === s.options.fade &&
          ((t = null), s.slideCount > s.options.slidesToShow))
      ) {
        for (
          o =
            !0 === s.options.centerMode
              ? s.options.slidesToShow + 1
              : s.options.slidesToShow,
            e = s.slideCount;
          e > s.slideCount - o;
          e -= 1
        )
          (t = e - 1),
            i(s.$slides[t])
              .clone(!0)
              .attr("id", "")
              .attr("data-slick-index", t - s.slideCount)
              .prependTo(s.$slideTrack)
              .addClass("slick-cloned");
        for (e = 0; e < o + s.slideCount; e += 1)
          (t = e),
            i(s.$slides[t])
              .clone(!0)
              .attr("id", "")
              .attr("data-slick-index", t + s.slideCount)
              .appendTo(s.$slideTrack)
              .addClass("slick-cloned");
        s.$slideTrack
          .find(".slick-cloned")
          .find("[id]")
          .each(function () {
            i(this).attr("id", "");
          });
      }
    }),
    (e.prototype.interrupt = function (i) {
      var e = this;
      i || e.autoPlay(), (e.interrupted = i);
    }),
    (e.prototype.selectHandler = function (e) {
      var t = this,
        o = i(e.target).is(".slick-slide")
          ? i(e.target)
          : i(e.target).parents(".slick-slide"),
        s = parseInt(o.attr("data-slick-index"));
      s || (s = 0),
        t.slideCount <= t.options.slidesToShow
          ? t.slideHandler(s, !1, !0)
          : t.slideHandler(s);
    }),
    (e.prototype.slideHandler = function (i, e, t) {
      var o,
        s,
        n,
        r,
        l,
        d = null,
        a = this;
      if (
        ((e = e || !1),
        !(
          (!0 === a.animating && !0 === a.options.waitForAnimate) ||
          (!0 === a.options.fade && a.currentSlide === i)
        ))
      )
        if (
          (!1 === e && a.asNavFor(i),
          (o = i),
          (d = a.getLeft(o)),
          (r = a.getLeft(a.currentSlide)),
          (a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft),
          !1 === a.options.infinite &&
            !1 === a.options.centerMode &&
            (i < 0 || i > a.getDotCount() * a.options.slidesToScroll))
        )
          !1 === a.options.fade &&
            ((o = a.currentSlide),
            !0 !== t
              ? a.animateSlide(r, function () {
                  a.postSlide(o);
                })
              : a.postSlide(o));
        else if (
          !1 === a.options.infinite &&
          !0 === a.options.centerMode &&
          (i < 0 || i > a.slideCount - a.options.slidesToScroll)
        )
          !1 === a.options.fade &&
            ((o = a.currentSlide),
            !0 !== t
              ? a.animateSlide(r, function () {
                  a.postSlide(o);
                })
              : a.postSlide(o));
        else {
          if (
            (a.options.autoplay && clearInterval(a.autoPlayTimer),
            (s =
              o < 0
                ? a.slideCount % a.options.slidesToScroll != 0
                  ? a.slideCount - (a.slideCount % a.options.slidesToScroll)
                  : a.slideCount + o
                : o >= a.slideCount
                  ? a.slideCount % a.options.slidesToScroll != 0
                    ? 0
                    : o - a.slideCount
                  : o),
            (a.animating = !0),
            a.$slider.trigger("beforeChange", [a, a.currentSlide, s]),
            (n = a.currentSlide),
            (a.currentSlide = s),
            a.setSlideClasses(a.currentSlide),
            a.options.asNavFor &&
              (l = (l = a.getNavTarget()).slick("getSlick")).slideCount <=
                l.options.slidesToShow &&
              l.setSlideClasses(a.currentSlide),
            a.updateDots(),
            a.updateArrows(),
            !0 === a.options.fade)
          )
            return (
              !0 !== t
                ? (a.fadeSlideOut(n),
                  a.fadeSlide(s, function () {
                    a.postSlide(s);
                  }))
                : a.postSlide(s),
              void a.animateHeight()
            );
          !0 !== t
            ? a.animateSlide(d, function () {
                a.postSlide(s);
              })
            : a.postSlide(s);
        }
    }),
    (e.prototype.startLoad = function () {
      var i = this;
      !0 === i.options.arrows &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow.hide(), i.$nextArrow.hide()),
        !0 === i.options.dots &&
          i.slideCount > i.options.slidesToShow &&
          i.$dots.hide(),
        i.$slider.addClass("slick-loading");
    }),
    (e.prototype.swipeDirection = function () {
      var i,
        e,
        t,
        o,
        s = this;
      return (
        (i = s.touchObject.startX - s.touchObject.curX),
        (e = s.touchObject.startY - s.touchObject.curY),
        (t = Math.atan2(e, i)),
        (o = Math.round((180 * t) / Math.PI)) < 0 && (o = 360 - Math.abs(o)),
        o <= 45 && o >= 0
          ? !1 === s.options.rtl
            ? "left"
            : "right"
          : o <= 360 && o >= 315
            ? !1 === s.options.rtl
              ? "left"
              : "right"
            : o >= 135 && o <= 225
              ? !1 === s.options.rtl
                ? "right"
                : "left"
              : !0 === s.options.verticalSwiping
                ? o >= 35 && o <= 135
                  ? "down"
                  : "up"
                : "vertical"
      );
    }),
    (e.prototype.swipeEnd = function (i) {
      var e,
        t,
        o = this;
      if (((o.dragging = !1), (o.swiping = !1), o.scrolling))
        return (o.scrolling = !1), !1;
      if (
        ((o.interrupted = !1),
        (o.shouldClick = !(o.touchObject.swipeLength > 10)),
        void 0 === o.touchObject.curX)
      )
        return !1;
      if (
        (!0 === o.touchObject.edgeHit &&
          o.$slider.trigger("edge", [o, o.swipeDirection()]),
        o.touchObject.swipeLength >= o.touchObject.minSwipe)
      ) {
        switch ((t = o.swipeDirection())) {
          case "left":
          case "down":
            (e = o.options.swipeToSlide
              ? o.checkNavigable(o.currentSlide + o.getSlideCount())
              : o.currentSlide + o.getSlideCount()),
              (o.currentDirection = 0);
            break;
          case "right":
          case "up":
            (e = o.options.swipeToSlide
              ? o.checkNavigable(o.currentSlide - o.getSlideCount())
              : o.currentSlide - o.getSlideCount()),
              (o.currentDirection = 1);
        }
        "vertical" != t &&
          (o.slideHandler(e),
          (o.touchObject = {}),
          o.$slider.trigger("swipe", [o, t]));
      } else
        o.touchObject.startX !== o.touchObject.curX &&
          (o.slideHandler(o.currentSlide), (o.touchObject = {}));
    }),
    (e.prototype.swipeHandler = function (i) {
      var e = this;
      if (
        !(
          !1 === e.options.swipe ||
          ("ontouchend" in document && !1 === e.options.swipe) ||
          (!1 === e.options.draggable && -1 !== i.type.indexOf("mouse"))
        )
      )
        switch (
          ((e.touchObject.fingerCount =
            i.originalEvent && void 0 !== i.originalEvent.touches
              ? i.originalEvent.touches.length
              : 1),
          (e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold),
          !0 === e.options.verticalSwiping &&
            (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold),
          i.data.action)
        ) {
          case "start":
            e.swipeStart(i);
            break;
          case "move":
            e.swipeMove(i);
            break;
          case "end":
            e.swipeEnd(i);
        }
    }),
    (e.prototype.swipeMove = function (i) {
      var e,
        t,
        o,
        s,
        n,
        r,
        l = this;
      return (
        (n = void 0 !== i.originalEvent ? i.originalEvent.touches : null),
        !(!l.dragging || l.scrolling || (n && 1 !== n.length)) &&
          ((e = l.getLeft(l.currentSlide)),
          (l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX),
          (l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY),
          (l.touchObject.swipeLength = Math.round(
            Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2)),
          )),
          (r = Math.round(
            Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2)),
          )),
          !l.options.verticalSwiping && !l.swiping && r > 4
            ? ((l.scrolling = !0), !1)
            : (!0 === l.options.verticalSwiping &&
                (l.touchObject.swipeLength = r),
              (t = l.swipeDirection()),
              void 0 !== i.originalEvent &&
                l.touchObject.swipeLength > 4 &&
                ((l.swiping = !0), i.preventDefault()),
              (s =
                (!1 === l.options.rtl ? 1 : -1) *
                (l.touchObject.curX > l.touchObject.startX ? 1 : -1)),
              !0 === l.options.verticalSwiping &&
                (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1),
              (o = l.touchObject.swipeLength),
              (l.touchObject.edgeHit = !1),
              !1 === l.options.infinite &&
                ((0 === l.currentSlide && "right" === t) ||
                  (l.currentSlide >= l.getDotCount() && "left" === t)) &&
                ((o = l.touchObject.swipeLength * l.options.edgeFriction),
                (l.touchObject.edgeHit = !0)),
              !1 === l.options.vertical
                ? (l.swipeLeft = e + o * s)
                : (l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s),
              !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s),
              !0 !== l.options.fade &&
                !1 !== l.options.touchMove &&
                (!0 === l.animating
                  ? ((l.swipeLeft = null), !1)
                  : void l.setCSS(l.swipeLeft))))
      );
    }),
    (e.prototype.swipeStart = function (i) {
      var e,
        t = this;
      if (
        ((t.interrupted = !0),
        1 !== t.touchObject.fingerCount ||
          t.slideCount <= t.options.slidesToShow)
      )
        return (t.touchObject = {}), !1;
      void 0 !== i.originalEvent &&
        void 0 !== i.originalEvent.touches &&
        (e = i.originalEvent.touches[0]),
        (t.touchObject.startX = t.touchObject.curX =
          void 0 !== e ? e.pageX : i.clientX),
        (t.touchObject.startY = t.touchObject.curY =
          void 0 !== e ? e.pageY : i.clientY),
        (t.dragging = !0);
    }),
    (e.prototype.unfilterSlides = e.prototype.slickUnfilter =
      function () {
        var i = this;
        null !== i.$slidesCache &&
          (i.unload(),
          i.$slideTrack.children(this.options.slide).detach(),
          i.$slidesCache.appendTo(i.$slideTrack),
          i.reinit());
      }),
    (e.prototype.unload = function () {
      var e = this;
      i(".slick-cloned", e.$slider).remove(),
        e.$dots && e.$dots.remove(),
        e.$prevArrow &&
          e.htmlExpr.test(e.options.prevArrow) &&
          e.$prevArrow.remove(),
        e.$nextArrow &&
          e.htmlExpr.test(e.options.nextArrow) &&
          e.$nextArrow.remove(),
        e.$slides
          .removeClass("slick-slide slick-active slick-visible slick-current")
          .attr("aria-hidden", "true")
          .css("width", "");
    }),
    (e.prototype.unslick = function (i) {
      var e = this;
      e.$slider.trigger("unslick", [e, i]), e.destroy();
    }),
    (e.prototype.updateArrows = function () {
      var i = this;
      Math.floor(i.options.slidesToShow / 2),
        !0 === i.options.arrows &&
          i.slideCount > i.options.slidesToShow &&
          !i.options.infinite &&
          (i.$prevArrow
            .removeClass("slick-disabled")
            .attr("aria-disabled", "false"),
          i.$nextArrow
            .removeClass("slick-disabled")
            .attr("aria-disabled", "false"),
          0 === i.currentSlide
            ? (i.$prevArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true"),
              i.$nextArrow
                .removeClass("slick-disabled")
                .attr("aria-disabled", "false"))
            : i.currentSlide >= i.slideCount - i.options.slidesToShow &&
                !1 === i.options.centerMode
              ? (i.$nextArrow
                  .addClass("slick-disabled")
                  .attr("aria-disabled", "true"),
                i.$prevArrow
                  .removeClass("slick-disabled")
                  .attr("aria-disabled", "false"))
              : i.currentSlide >= i.slideCount - 1 &&
                !0 === i.options.centerMode &&
                (i.$nextArrow
                  .addClass("slick-disabled")
                  .attr("aria-disabled", "true"),
                i.$prevArrow
                  .removeClass("slick-disabled")
                  .attr("aria-disabled", "false")));
    }),
    (e.prototype.updateDots = function () {
      var i = this;
      null !== i.$dots &&
        (i.$dots.find("li").removeClass("slick-active").end(),
        i.$dots
          .find("li")
          .eq(Math.floor(i.currentSlide / i.options.slidesToScroll))
          .addClass("slick-active"));
    }),
    (e.prototype.visibility = function () {
      var i = this;
      i.options.autoplay &&
        (document[i.hidden] ? (i.interrupted = !0) : (i.interrupted = !1));
    }),
    (i.fn.slick = function () {
      var i,
        t,
        o = this,
        s = arguments[0],
        n = Array.prototype.slice.call(arguments, 1),
        r = o.length;
      for (i = 0; i < r; i++)
        if (
          ("object" == typeof s || void 0 === s
            ? (o[i].slick = new e(o[i], s))
            : (t = o[i].slick[s].apply(o[i].slick, n)),
          void 0 !== t)
        )
          return t;
      return o;
    });
});

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
