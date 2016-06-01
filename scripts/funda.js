var $ = jQuery;
var $list = $(".object-kenmerken");
var $price = $(".object-header-price");
var $search = $(".search-result-content");

function nr(str) {
    return parseFloat(str.match(/\d/g).join(''));
}

function getPricePerSqm(size, price) {
    var pricePerSqm = Math.round(price / size).toLocaleString().replace(',', '.');
    return `€${pricePerSqm} p/m²`;
}

function page() {
    var size = nr($list.find("dt:contains('Woonoppervlakte')").next().text());
    var price = nr($price.text());

    var header = $price.text();
    header += ` / ${size}m² / ${getPricePerSqm(size, price)}`;
    $price.text(header);
}

function search() {
    $search.each(function() {
        var $s = $(this);
        var size = nr($s.find('[title="Woonoppervlakte"]').text());
        var price = nr($s.find('.search-result-price').text());
        $s.find('.search-result-info').eq(1).append(`<span>• ${getPricePerSqm(size, price)}</span>`);
    });
}

if ($price.length) page();
if ($search.length) search();