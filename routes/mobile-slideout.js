$('.menu-trigger').on('click', function() {
    $('.menu').addClass('slide-in');
    $('.overlay').removeClass('hide');
});

$('.menu-close, .overlay, .menu-page-link').on('click', function() {
    $('.menu').removeClass('slide-in');
    $('.overlay').addClass('hide');
});