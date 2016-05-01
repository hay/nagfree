window.__nagfree_script__ = (() => {
const $product = $(".product-lane");

function addPricePerKg() {
    const $el = $(this);
    const price = parseFloat($el.find(".product-price").text());
    const $weight = $el.find(".product-description__unit-size");
    const weightText = $weight.text();
    const weight = parseInt(weightText.replace('g', '').trim());
    const pricePerKg = ((price / weight) * 1000).toFixed(2);
    $weight.text(`${weightText} | € ${pricePerKg} per kg`);
}

if ($product.length) {
    $product.find(".product-cardview").each(addPricePerKg);
}
})();