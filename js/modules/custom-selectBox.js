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
