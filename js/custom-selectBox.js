
var $ = jQuery.noConflict();
$(document).ready(function(){
    $('select').selectBox({
        keepInViewport: false,
        menuSpeed: 'slow',
        mobile:  true,
    });
    $(".selectBox, .selectBox-dropdown .selectBox-label").removeAttr('style');
});