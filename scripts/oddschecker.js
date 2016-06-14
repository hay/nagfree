$(".match-on").each(function() {
    var $cells = $(this).find("[data-best-odds]");
    var total = 0;

    $cells.each(function() {
        total += parseFloat($(this).attr('data-best-odds'));
    });

    $cells.each(function() {
        var odds = parseFloat($(this).attr('data-best-odds'));
        const percentage = ((1 / odds) * 100).toFixed(2);
        $(this).find(".odds").text(`(${odds} / ${percentage}%)`);
    });
});