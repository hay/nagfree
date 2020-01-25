// @description Open open.spotify.com links in the desktop app instead of with the web client

// Based on < https://greasyfork.org/en/scripts/38920-spotify-open-in-app/code >

export default {
    host : 'spotify.com',

    js() {
        const data = document.URL.match(/[\/\&](track|playlist|album|artist)\/([^\&\#\/\?]+)/i);
        const type = data[0];
        const id = data[1];
        window.location.replace(`spotify:${type}:${id}`);
    }
};