/*==========

Theme Name: Courseshub - Online Courses & Education HTML5 Template

==========*/

/*==========
----- JS INDEX -----
1.Whole Script Strict Mode Syntax
2.Pricing Range JS
==========*/

$(document).ready(function ($) {
    // Whole Script Strict Mode Syntax
    "use strict";

    // Pricing Range Filter Js Start
    $(function () {
        const minPriceElement = $("#min-price");
        const maxPriceElement = $("#max-price");

        // Get min and max values from data attributes
        const minPrice = parseInt(minPriceElement.data("min-price"));
        const maxPrice = parseInt(maxPriceElement.data("max-price"));

        $("#price-range").slider({
            step: 10,
            range: true,
            min: minPrice,
            max: maxPrice,
            values: [minPrice, maxPrice],
            slide: function (event, ui) {
                // Update the text content of the span elements
                minPriceElement.text(`$${ui.values[0]}`);
                maxPriceElement.text(`$${ui.values[1]}`);
            },
        });

        // Initialize span elements with slider values
        minPriceElement.text(`$${$("#price-range").slider("values", 0)}`);
        maxPriceElement.text(`$${$("#price-range").slider("values", 1)}`);
    });
    // Pricing Range Filter Js End
});
