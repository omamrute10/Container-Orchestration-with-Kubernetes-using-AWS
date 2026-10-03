/*==========

Theme Name: Courseshub - Online Courses & Education HTML5 Template

==========*/

/*==========
----- JS INDEX -----
1.Whole Script Strict Mode Syntax
2.Loader JS
3.WoW Animation Js
4.header search button js
5.Sticky Header JS
6.Toogle Menu Mobile JS
7.Submenu Mobile JS
8.Animated Text Circle JS
9.Partners Slider JS
10.Top Course Tabbing JS
11.Testimonial Slider JS
12.Reverse Direction Testimonial Slider JS
13.Professional Instructor Slider Slider JS
14.Event Sponsor Slider JS
15.Pricing Switch JS
16.Dynamic date Js
17.FAQ Js

==========*/

jQuery(document).ready(function ($) {
    // Whole Script Strict Mode Syntax
    "use strict";

    // Loader JS Start
    $(window).ready(function () {
        $(".loader-box").fadeOut();
    });
    // Loader JS End
    $("body").removeClass("fixed");
    // Wow Animation JS Start
    new WOW().init();
    // Wow Animation JS End

    // header search button js Start
    $("body .search-icon-box a").on("click", function (e) {
        //open popup on click of search icon
        e.preventDefault(); // Prevent the default action of the anchor tag
        var $searchBox = $(".search-wp");

        if ($searchBox.hasClass("active")) {
            $(".search-wp").removeClass("active");
        } else {
            $(".search-wp").addClass("active");
        }
    });

    // Hide drop-down-search if clicked outside
    $(document).on("click", function (event) {
        var $searchBox = $(".search-wp");
        var $searchIcon = $(".search-icon-box");

        // Check if the click was outside the search box and icon
        if (!$searchBox.is(event.target) && $searchBox.has(event.target).length === 0 && !$searchIcon.is(event.target) && $searchIcon.has(event.target).length === 0) {
            if ($searchBox.hasClass("active")) {
                $searchBox.removeClass("active");
            }
        }
    });
    // header search button js End

    // Sticky Header JS Start
    $(window).on("scroll", function () {
        if ($(window).scrollTop() >= 100) {
            $(".site-header").addClass("sticky-header");
        } else {
            $(".site-header").removeClass("sticky-header");
        }
    });
    // Sticky Header JS End

    // Toogle Menu Mobile JS Start
    $(".toggle-button").on("click", function () {
        $(".main-navigation").toggleClass("toggle-menu");
        $(".header-menu .black-shadow").fadeToggle();
        $(".main-navigation ul li.sub-items").removeClass("active-sub-menu").find("ul").slideUp();
    });

    $(".main-navigation ul li a").on("click", function () {
        if (!$(this).parent().hasClass("sub-items")) {
            // Close the menu when non-submenu links are clicked
            $(".main-navigation").removeClass("toggle-menu");
            $(".header-menu .black-shadow").fadeOut();
        }
    });

    $(".header-menu .black-shadow").on("click", function () {
        $(this).fadeOut();
        $(".main-navigation").removeClass("toggle-menu");
    });

    // Toogle Menu Mobile JS End

    if ($(window).width() < 992) {
        // Submenu For Mobile JS Start
        $("body").on("click", ".main-navigation ul li.sub-items > a", function (e) {
            e.preventDefault(); // Prevent default action of the link

            const $clickedItem = $(this).parent(); // Get the clicked submenu item

            // Close other submenus and toggle the current submenu
            $(".main-navigation ul li.sub-items").not($clickedItem).removeClass("active-sub-menu").find("ul").slideUp();

            $clickedItem.toggleClass("active-sub-menu").find("ul").slideToggle();
        });
        // Submenu For Mobile JS End
    }

    // Animated Text Circle JS Start
    const $text = $(".certification-text");
    $text.html(
        $text
            .text()
            .split("")
            .map(function (char, i) {
                return `<span style="transform:rotate(${i * 13.5}deg)">${char}</span>`;
            })
            .join("")
    );
    // Animated Text Circle JS End

    //  Partners Slider JS Start
    var partners_slider = new Swiper(".partners-slider", {
        slidesPerView: 8,
        spaceBetween: 30,
        loop: true,
        speed: 1500,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 2,
            },
            576: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 5,
            },
            1400: {
                slidesPerView: 6,
            },
            1920: {
                slidesPerView: 8,
            },
        },
    });
    $(".partners-slider").hover(
        function () {
            partners_slider.autoplay.stop();
        },
        function () {
            partners_slider.autoplay.start();
        }
    );
    //  Partners Slider JS End

    //  Top Course Tabbing JS Start
    if ($("section").hasClass("top-course-sec")) {
        var $box = $(".grid").isotope({
            itemSelector: ".grid-item",
            layoutMode: "fitRows",
            onLayout: setEqualHeight,
        });
    }

    function setEqualHeight() {
        var $items = $(".grid-item");
        var rows = [];

        $items.css("height", "auto");

        $items.each(function (index, element) {
            var rowIndex = Math.floor(index / getColumnCount());
            if (!rows[rowIndex]) {
                rows[rowIndex] = [];
            }
            rows[rowIndex].push($(element));
        });

        $.each(rows, function (index, rowItems) {
            var maxHeight = 0;

            rowItems.forEach(function (item) {
                var thisHeight = item.outerHeight();
                if (thisHeight > maxHeight) {
                    maxHeight = thisHeight;
                }
            });

            rowItems.forEach(function (item) {
                item.css("height", maxHeight + "px");
            });
        });
    }

    function getColumnCount() {
        if ($(window).width() >= 1200) {
            return 3;
        } else if ($(window).width() >= 768) {
            return 2;
        } else {
            return 1;
        }
    }

    $(window).on("resize load", function () {
        setEqualHeight();
    });

    $(".top-course-list").on("click", "button", function () {
        var filterValue = $(this).attr("data-type");
        $(".list-btn").removeClass("active");
        $(this).addClass("active");
        if (filterValue !== "*") {
            filterValue = '[data-type="' + filterValue + '"]';
        }
        $box.isotope({ filter: filterValue });
    });
    //  Top Course Tabbing JS End

    //  Testimonial Slider JS Start
    var testimonials_slider = new Swiper(".testimonial-slider", {
        spaceBetween: 24,
        slidesPerView: 4,
        loop: true,
        allowTouchMove: false,
        speed: 10000,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 2,
            },
            1400: {
                slidesPerView: 3,
            },
            1920: {
                slidesPerView: 4,
            },
        },
    });
    //  Testimonial Slider JS End

    //  Reverse Direction Testimonial Slider JS Start
    var testimonials_slider_2 = new Swiper(".testimonial-slider-2", {
        spaceBetween: 24,
        slidesPerView: 4,
        loop: true,
        allowTouchMove: false,
        speed: 10000,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 2,
            },
            1400: {
                slidesPerView: 3,
            },
            1920: {
                slidesPerView: 4,
            },
        },
    });
    //  Reverse Direction Testimonial Slider JS End

    //  Professional Instructor Slider JS Start
    var professional_instructor_slider = new Swiper(".professional-instructor-slider", {
        slidesPerView: 3,
        spaceBetween: 24,
        direction: "horizontal",
        effect: "slide",
        loop: true,
        speed: 1500,
        parallax: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            type: "bullets",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 3,
            },
            1920: {
                slidesPerView: 3,
            },
        },
    });
    $(".professional-instructor-slider").hover(
        function () {
            professional_instructor_slider.autoplay.stop();
        },
        function () {
            professional_instructor_slider.autoplay.start();
        }
    );
    //  Professional Instructor Slider JS End

    //  Event Sponsor Slider JS Start
    var event_sponsor_slider = new Swiper(".event-sponsor-slider", {
        slidesPerView: 4,
        spaceBetween: 30,
        loop: true,
        speed: 1500,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 2,
            },
            480: {
                slidesPerView: 3,
            },
            576: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 4,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
            1400: {
                slidesPerView: 4,
            },
            1920: {
                slidesPerView: 4,
            },
        },
    });
    $(".event-sponsor-slider").hover(
        function () {
            event_sponsor_slider.autoplay.stop();
        },
        function () {
            event_sponsor_slider.autoplay.start();
        }
    );
    //  Event Sponsor Slider JS End

    // Pricing Switch JS Start
    $(document).on("change", "#price_check", function () {
        check();
    });

    function check() {
        var price_check = $("#price_check");
        var annually_text = $(".annually_text");
        var monthly_text = $(".monthly_text");
        var monthly_switch_text = $(".monthly-switch-text");
        var year_switch_text = $(".Yearly-switch-text");

        annually_text.each(function (index) {
            if (price_check.is(":checked")) {
                $(this).hide();
                monthly_text.eq(index).show();
                monthly_switch_text.eq(index).removeClass("active");
                year_switch_text.eq(index).addClass("active");
            } else {
                $(this).show();
                monthly_text.eq(index).hide();
                monthly_switch_text.eq(index).addClass("active");
                year_switch_text.eq(index).removeClass("active");
            }
        });
    }

    check();
    // Pricing Switch JS End

    // Dynamic date Js Start
    $("#copy-right-year").html(new Date().getFullYear());
    // Dynamic date Js End

    // FAQ Js Start
    $(".faq-accordian .faq-box-text").hide();
    $(".faq-accordian").each(function () {
        $(this).find("> div:eq(0)").addClass("active");
        $(this).find("> div:eq(0) .faq-box-text").slideDown();
    });
    $(".faq-accordian h3").click(function (j) {
        var dropDown = $(this).closest("div").find(".faq-box-text");

        $(this).closest(".faq-accordian").find(".faq-box-text").not(dropDown).slideUp();

        if ($(this).parent(".faq-box").hasClass("active")) {
            $(this).parent(".faq-box").removeClass("active");
        } else {
            $(this).closest(".faq-accordian").find(".faq-box.active").removeClass("active");
            $(this).parent(".faq-box").addClass("active");
        }
        dropDown.stop(false, true).slideToggle();
        j.preventDefault();
    });
    // FAQ Js End
});
