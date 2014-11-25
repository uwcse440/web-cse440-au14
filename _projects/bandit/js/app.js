"use strict";

var ready = function() {
	$(".scrollto").click(function(event) {
        event.preventDefault(); 

        var defaultAnchorOffset = 0;

        var anchor = $(this).attr('data-scroll');

        var anchorOffset = $('#'+anchor).attr('data-scroll-offset');
        if (!anchorOffset)
            anchorOffset = defaultAnchorOffset; 

        $('html,body').animate({ 
            scrollTop: $('#'+anchor).offset().top - anchorOffset
        }, 1000);        
    });
};


$(document).ready(ready);
$(document).on('page:load', ready);