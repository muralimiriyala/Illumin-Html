
var $ = jQuery.noConflict();
$(document).ready(function(){


   
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
                }
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
                    }
                },
            ],
            customPaging : function(slick, slider) {
            let totalValue = slick.slideCount;
            let currentSlide = slider + 1;
            return '<a>0'+ currentSlide +' <span class="slick-slash"></span> 0'+totalValue+'</a>';
        },
    });
    
    var totalSlides = $('.people-slider-nav .slick-slide').length,      
    randomSlides = Math.floor( Math.random() * totalSlides );
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
    const $defaultDots = $(".default-content-slider ul.slick-dots");
    if (typeof $defaultDots !== "undefined" && $defaultDots.length > 0){
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
                    }
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
                }
            },
            {
            breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    variableWidth: true,
                    centerMode: true,
                    centerpadding: '20px'
                }
            }
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
                }
            },
            {
            breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                }
            }
        ]
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
                }
            },
            {
            breakpoint: 1023,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
            breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    });

    /*-- Ipad & Mobile jQuery --*/
    
    // $('.platform-for').slick({
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     arrows: false,
    //     variableWidth: true,
    //     fade: true,
    //     asNavFor: '.platform-nav'
    //   });
    //   $('.platform-nav').slick({
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     asNavFor: '.platform-for',
    //     dots: false,
    //     arrows: false,
    //     variableWidth: true,
    //     focusOnSelect: true
    //   });

    $('.single-testimonial-main').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        infinite: false,
        dots: false,
        arrows: true,
        prevArrow: '<span class="slick-arrow slick-prev"></span>',
        nextArrow: '<span class="slick-arrow slick-next"></span>',   
    });




   /*-- Ipad & Mobile jQuery --*/
   let $ipad_window = $(window);
   if($ipad_window.width()<=1023){
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