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
