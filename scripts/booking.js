// Remove silly stress inducing UX from booking.com
// See < https://thenextweb.com/contributors/2017/09/21/booking-com-uses-stress-rush-decisions >
export default {
    host : 'booking.com',

    css : `
        .js_sr_persuation_msg,
        .d-deal,
        .lastbooking,
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
        .pub_trans,
        .scroll-indicator,
        .sr-just-booked,
        .free-cancel-persuasion,
        .sr-badges__row,
        .featuredRooms thead,
        .usp-hotelpage--chains,
        .smaller-low-av-msg_wrapper,
        .soldout_property,
        .gs-discount-tag,
        .sr_hotel_expectation__wrapper,
        .genius_badge--by-stars,
        .scarcity_color,
        .sr-booked-x-times,
        .strike-it-red_anim,
        .review-score-widget__text,
        .sr__guest-favorite {
            display: none !important;
        }

        #logo_no_globe_new_logo {
            top: 13px !important;
        }

        .scarcity_color,
        .site_discount_price {
            color: black !important;
        }
    `
};