$( document ).ready(function() {
    preloader();//Fade preloader when page loaded

});


// functions -------------------------------------------

function preloader () {
    $(window).on('load', function () {
        $('.loader-outer').fadeOut();
    });
}
