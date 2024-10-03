function stickyResize() {
    if(window.matchMedia('(min-width: 1024px)').matches) {
        jQuery('.cross-channel-lt').stickySidebar({
            topSpacing: 96,
            bottomSpacing: 0,
            resizeSensor: true,
            containerSelector: false,
            innerWrapperSelector: '.sticky-sidebar-inner',
        });
    }
    else{
        var stickySidebar = jQuery('.cross-channel-lt').data('stickySidebar');
        if (stickySidebar){
            stickySidebar.destroy();
        }
    }
}
jQuery(document).ready(function() { stickyResize(); });
jQuery(window).on('load', function() { stickyResize(); });
jQuery(window).on('resize', function() { stickyResize(); });