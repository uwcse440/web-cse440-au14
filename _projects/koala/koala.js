$(document).ready(function(e) {
	var menuTop1pos = $('#menu').offset().top;
	var stickToTop = function(){
        var winScrollTop = $(window).scrollTop();
        if (winScrollTop >= menuTop1pos) {
            $('#menu').addClass('stickTop');
        } else {
            $('#menu').removeClass('stickTop');  
        }
   };
	
	$(window).scroll(function() {
		stickToTop();
	});


});
