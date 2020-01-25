// @description Add price per kilogram to product listings on ah.nl

const PRODUCT_LANE_SELECTOR = '.product-lane .product-cardview .product-price';
const PAGE_SELECTOR = '.canvas-page';

function addPricePerKg() {
    const $el = $(this);
    const price = parseFloat($el.find(".product-price").text());
    const $weight = $el.find(".product-description__unit-size");
    const weightText = $weight.text();
    const weightParts = weightText.split(' ');
    const size = parseInt(weightParts[0]);
    const unit = weightParts[1];

    if (['kg', 'g'].indexOf(unit) === -1) {
        // No valid unit
        return;
    }

    const weight = unit === 'kg' ? size : (size / 1000);
    const pricePerKg = ((price / weight)).toFixed(2);
    $weight.text(`${weightText} | € ${pricePerKg} per kg`);
}

function addPricesToProductlanes() {
    const $product = $(".product-lane");

    if ($product.length) {
        $product.find(".product-cardview").each(addPricePerKg);
    }
}

export default {
    host : 'ah.nl',

    js : {
        run : addPricesToProductlanes,
        runOnUrlChange : true,
        waitForSelector : PRODUCT_LANE_SELECTOR
    }
};