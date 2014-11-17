$(function() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top,
                    scrollLeft: target.offset().left,
                }, 250);
                return false;
            }
        }
    });
});

function goto(target) {
    $('html,body').animate({
        scrollTop: $("#"+target).offset().top,
        scrollLeft: $("#"+target).offset().left
    }, 250);
}

$('.ui.checkbox')
    .checkbox()
;