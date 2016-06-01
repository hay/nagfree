function addPricePerKg() {
    const $el = $(this);
    const price = parseFloat($el.find(".product-price").text());
    const $weight = $el.find(".product-description__unit-size");
    const weightText = $weight.text();
    const weightParts = weightText.split(' ');
    const size = parseInt(weightParts[0]);
    const unit = weightParts[1];
    const weight = unit === 'kg' ? size : (size / 1000);
    const pricePerKg = ((price / weight)).toFixed(2);
    $weight.text(`${weightText} | € ${pricePerKg} per kg`);
}

function handleProductLane() {
    const $product = $(".product-lane");

    if ($product.length) {
        $product.find(".product-cardview").each(addPricePerKg);
    }
}

nagfree.waitForSelector('.product-lane .product-cardview .product-price').then(handleProductLane);