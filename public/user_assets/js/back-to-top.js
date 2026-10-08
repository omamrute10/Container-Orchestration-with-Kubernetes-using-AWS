/*==========

Theme Name: Courseshub - Online Courses & Education HTML5 Template

==========*/

/*==========
----- JS INDEX -----
1.Whole Script Strict Mode Syntax
2.Back To Top JS
==========*/

$(document).ready(function () {
    // Whole Script Strict Mode Syntax
    "use strict";
});

!(function (s) {
    "use strict";

    s(".switch").on("click", function () {
        s("body").hasClass("light") ? (s("body").removeClass("light"), s(".switch").removeClass("switched")) : (s("body").addClass("light"), s(".switch").addClass("switched"));
    });

    s(document).ready(function () {
        const e = document.querySelector(".scroll-to-top path");
        const t = e.getTotalLength(); // Declare t here
        e.style.transition = e.style.WebkitTransition = "none";
        e.style.strokeDasharray = t + " " + t;
        e.style.strokeDashoffset = t;
        e.getBoundingClientRect();
        e.style.transition = e.style.WebkitTransition = "stroke-dashoffset 10ms linear";

        const o = function () {
            const o = s(window).scrollTop();
            const r = s(document).height() - s(window).height();
            const i = t - (o * t) / r; // Use t safely here
            e.style.strokeDashoffset = i;
        };

        o();
        s(window).scroll(o);

        jQuery(window).on("scroll", function () {
            jQuery(this).scrollTop() > 50 ? jQuery(".scroll-to-top").addClass("active-progress") : jQuery(".scroll-to-top").removeClass("active-progress");
        });

        jQuery(".scroll-to-top").on("click", function (s) {
            s.preventDefault();
            jQuery("html, body").animate(
                {
                    scrollTop: 0,
                },
                550
            );
            return false;
        });
    });
})(jQuery);
