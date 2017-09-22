// Remove silly stress inducing UX from booking.com
// See < https://thenextweb.com/contributors/2017/09/21/booking-com-uses-stress-rush-decisions >
$("body").append(`<style>
    .js_sr_persuation_msg,
    .d-deal,
    .ribbon__extra,
    .bk-icon-wrapper,
    .preferred-program-icon,
    .sr-top-five-percent,
    .sr-property-expectations__row,
    .sr_price_estimate,
    .ufi-user-count-banner,
    .yellowfy_bestseller,
    .property-highlights,
    .fe_banner,
    .usp-hotelpage-main-col,
    .property_page_surroundings_block,
    .hp-social_proof,
    .hp_desc_important_facilities,
    .logo_subhead,
    .js-raf-center-bar-link,
    .reviews-carousel,
    .best-review-score,
    .dates_rec_sr,
    .ribbon,
    .free-cancel-persuasion,
    .sr-badges__row,
    .featuredRooms thead,
    .usp-hotelpage--chains,
    .sr__guest-favorite {
        display: none !important;
    }

    #logo_no_globe_new_logo {
        top: 13px !important;
    }

    .scarcity_color {
        color: black !important;
    }
</style>`);