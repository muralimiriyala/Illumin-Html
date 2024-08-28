var $ = jQuery.noConflict();

let notificationBar = $('.announcement-bar');
let notificationBarheight = $('.announcement-bar').outerHeight(true);

$(window).on('scroll load', function () {
  let scroll = $(this).scrollTop();
  if (scroll > 4) {
    $('.main-header').addClass('fixed_header');
    $('.main-header').css({
      'margin-top': 0 + 'px',
    });
  } else {
    $('.main-header').removeClass('fixed_header');
    $('.main-header').css({
      'margin-top': notificationBarheight + 'px',
    });
  }
});
$(document).ready(function () {
  if (notificationBar != 'undefined' && notificationBar.length > 0) {
    $('.main-header').css({
      'margin-top': notificationBarheight + 'px',
    });
  }
  $('.announcement-close').on('click', function (e) {
    e.preventDefault();
    $('.main-header').css({
      'margin-top': 0 + 'px',
    });
  });
  let headClass = $('.error404');
  if (headClass != 'undefined' && headClass.length > 0) {
    $('.main-header').addClass('sticky_header');
  }
  $('.toogle-btn').on('click', function (e) {
    e.preventDefault();
    $(this).toggleClass('on');
    $('.navigation').toggleClass('open');
  });
  $('.accordion-header').on('click', function (e) {
    e.preventDefault();
    $(this).parent().toggleClass('active');
    $(this).parent().siblings().removeClass('active');
    $(this).parent().siblings().find('.accordion-header').removeClass('open');
    $(this).toggleClass('open');
    $(this).siblings('.accordion-content').slideToggle(500);
    $(this).parent().siblings().find('.accordion-content').slideUp(500);
  });

  $('.product-overview-slide:first').addClass('current-slide');
  $('.product-overview-text:first').addClass('current-tab');
  $('.journey-list:first').addClass('active-tab');
  $('.journey-list').on('click', function (e) {
    e.preventDefault();
    $(this).siblings().removeClass('active-tab');
    $(this).addClass('active-tab');
    let attrName = $(this).attr('data-name');

    $('.product-overview-text').removeClass('current-tab').hide();
    $('.product-overview-text[data-target="' + attrName + '"]').fadeIn('slow');

    $('.product-overview-slide').removeClass('current-slide');
    $('.product-overview-slide[data-target="' + attrName + '"]').addClass(
      'current-slide'
    );
  });

  $('ul.financial-qlinks li:first a').addClass('active');
  $('.financial-row:first').addClass('current-q');
  $('ul.financial-qlinks li a').on('click', function (e) {
    e.preventDefault();
    $(this).parent().siblings().find('a').removeClass('active');
    $(this).addClass('active');
    var attrName = $(this).attr('data-name');
    $('.financial-row').removeClass('current-q').hide();
    $('.financial-row[data-target="' + attrName + '"]').fadeIn('normal');
  });

  $('.contact-title').on('click', function (e) {
    e.preventDefault();
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
    $(this).parent().siblings().find('.contact-title').removeClass('open');
    $(this).toggleClass('open');
    $(this).siblings('.contact-address').slideToggle(500);
    $(this).parent().siblings().find('.contact-address').slideUp(500);
  });

  $('ul.policies-links li a:first').addClass('active');
  $('.corporate-list-main:first').addClass('current-policie');

  $('ul.policies-links li a').on('click', function (e) {
    e.preventDefault();
    $(this).parent().siblings().find('a').removeClass('active');
    $(this).addClass('active');
    var attrName = $(this).attr('data-name');
    $('.corporate-list-main').removeClass('current-policie').hide();
    $('.corporate-list-main[data-target="' + attrName + '"]').fadeIn('normal');
  });
  $('.show_more_link').on('click', function (e) {
    e.preventDefault();
    $(this).toggleClass('show_less_link');
    let text = $(this).find('span').text() == 'less' ? 'more' : 'less';
    $(this).find('span').text(text);
    $('.corporate-list:nth-child(n+5)')
      .fadeToggle(500)
      .css({ display: 'flex' });
  });
  $('ul.scroll_links > li > a').on('click', function (e) {
    e.preventDefault();
    $(this).parent().siblings().find('a').removeClass('active');
    $(this).toggleClass('active');
  });

  $('ul.module-assets-links li a:first').addClass('active');
  $('.module-list-row:first').addClass('current');
  $('ul.module-assets-links li a').on('click', function (e) {
    e.preventDefault();
    $(this).parent().siblings().find('a').removeClass('active');
    $(this).addClass('active');
    let attrName1 = $(this).attr('data-value');
    $('.module-list-row').removeClass('current').hide();
    $('.module-list-row[data-target="' + attrName1 + '"]').fadeIn('normal');
  });

  $('ul.module-library-links li a:first').addClass('active');
  $('.library-list-row:first').addClass('current');
  $('ul.module-library-links li a').on('click', function (e) {
    e.preventDefault();
    $(this).parent().siblings().find('a').removeClass('active');
    $(this).addClass('active');
    let attrName2 = $(this).attr('data-value');
    $('.library-list-row').removeClass('current').hide();
    $('.library-list-row[data-target="' + attrName2 + '"]').fadeIn('normal');
  });

  $('ul.module-resource-links li a:first').addClass('active');
  $('.brochure-lists:first').addClass('current');
  $('ul.module-resource-links li a').on('click', function (e) {
    e.preventDefault();
    $(this).parent().siblings().find('a').removeClass('active');
    $(this).addClass('active');
    let attrName3 = $(this).attr('data-value');
    $('.brochure-lists').removeClass('current').hide();
    $('.brochure-lists[data-target="' + attrName3 + '"]').fadeIn('normal');
  });

  $('.leadership-role span').on('click', function (e) {
    e.preventDefault();
    $(this)
      .parents()
      .closest('.leadership-list-illumin')
      .siblings()
      .removeClass('expand');
    $(this).parents().closest('.leadership-list-illumin').toggleClass('expand');
    $(this)
      .parents()
      .closest('.leadership-list-illumin')
      .siblings()
      .find('.leadership-desc')
      .fadeOut();
    $(this).parent().siblings('.leadership-desc').fadeToggle();
  });
  $('.leadership_arrow').on('click', function (e) {
    e.preventDefault();
    $(this)
      .parents()
      .closest('.leadership-list-illumin')
      .siblings()
      .removeClass('expand');
    $(this).parents().closest('.leadership-list-illumin').toggleClass('expand');
    $(this)
      .parents()
      .closest('.leadership-list-illumin')
      .siblings()
      .find('.leadership-desc')
      .fadeOut();
    $(this).parent().siblings('.leadership-desc').fadeToggle();
  });
});

if ($(window).width() >= 1024) {
  $('li.menu-item-has-children.product-menu-item > ul.sub-menu').each(
    function () {
      if ($(this).children('li').length < 3) {
        $(this).addClass('nav_item_two');
      }
    }
  );
}

/*-- Ipad & Mobile jQuery --*/
let mobileIpad = function () {
  if ($(window).width() <= 1023) {
    $('ul.main_menu > li.menu-item-has-children > a').on(
      'click',
      function (event) {
        event.preventDefault();
        $('ul.main_menu > li.menu-item-has-children > a')
          .not($(this))
          .removeClass('active');
        $(this).toggleClass('active');
        $(this).parent().siblings().find('ul.sub-menu').slideUp();
        $(this).siblings('ul.sub-menu').slideToggle();
        $(this).parent().siblings().toggleClass('sib');
      }
    );
  }
};
$(document).on('ready', function () {
  mobileIpad();
});

/*-- only for mobile jQuery --*/
let mobileScreen = function () {
  if ($(window).width() <= 767) {
    $('.scroll_links_btn').on('click', function (e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $(this).parent('.scroll_links_mobile').toggleClass('active');
      $('ul.scroll_links').slideToggle();
    });
    $('ul.scroll_links li a').on('click', function (e) {
      e.preventDefault();
      $('.scroll_links_mobile').removeClass('active');
      $('.scroll_links_btn').removeClass('active');
      $('ul.scroll_links').fadeOut();
    });
    $('.downloads-mobile-btn').on('click', function (e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $(this).parent('.downloads-mobile').toggleClass('active');
      $('ul.module-links').slideToggle();
    });
    $('ul.module-links li a').on('click', function (e) {
      e.preventDefault();
      $('.downloads-mobile-btn').removeClass('active');
      $('ul.module-links').addClass('hide');
    });
  }
};
$(document).on('ready', function () {
  mobileScreen();
});

/*-- window load jQuery --*/
let headerHeight = $('.main-header').outerHeight(true);
$(window).on('load', function () {
  $('ul.scroll_links > li > a').click(function (e) {
    e.preventDefault();
    let myAttr = $(this).attr('data-name');
    let scrollAttr = $('.lever-department[data-department="' + myAttr + '"]');
    $('html, body').animate(
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
  $('body').addClass('mac_os');
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
  accordionShow(faqmain);
});
