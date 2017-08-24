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
        var rooms = nr($s.find('.search-result-kenmerken li:last-child').text());
        var zip = nr($s.find(".search-result-subtitle").text());
        var $street = $s.find(".search-result-title");
        $street.find(".search-result-subtitle").remove();
        var street = $street.text().trim().replace(/\n|\t| {2,}/g, '').trim();
        var id = $s.find("a[data-search-result-item-anchor]").attr('data-search-result-item-anchor').trim();

        console.log(`${id} - ${street} - size ${size} price ${price} rooms ${rooms} zip ${zip}`);

        $s.find('.search-result-info').eq(1).append(`<span>• ${getPricePerSqm(size, price)}</span>`);

        // $.ajax({
        //     type : "POST",
        //     url : "http://localhost:5000/",
        //     contentType : "application/json; charset=UTF-8",
        //     data : JSON.stringify({ id, street, size, price, rooms, zip })
        // });
    });
}

if ($price.length) page();
if ($search.length) search();