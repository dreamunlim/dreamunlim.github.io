'use strict'

class ShareScore {
    constructor() {
        this.input = document.createElement("input");
        this.input.setAttribute("type", "button");
        this.input.setAttribute("value", "Share");
        this.input.addEventListener("click", () => {this.processShare()}, false);
        document.body.insertBefore(this.input, canvas.nextElementSibling);

        // add FB JS SDK specific div
        this.div = document.createElement("div");
        this.div.setAttribute("id", "fb-root");
        document.body.insertBefore(this.div, canvas.nextElementSibling);

        // FB Open Graph meta tags to populate
        this.url = window.location.href;
        this.title = document.title;
        this.description = "";
        this.image = this.url + "img/fb-share.jpg";

        this.dataToShare = {};

        this.shareScoreButton = null;
    }

    processShare() {
        // don't proceed on connection error
        if (typeof FB === "undefined") {
            this.shareScoreButton.t1 = time;
            this.shareScoreButton.hintMessage = "SDK Not Loaded";
            return;
        }
        
        if (this.shareScoreButton.state.topScore[0][0] === 0) {
            this.shareScoreButton.hintMessage = "Zero Score";
            return;
        }

        // assemble description
        this.description = "I scored " + this.dataToShare.formattedScore + " points" +
        " in " + this.dataToShare.formattedMinutes + " min " + this.dataToShare.formattedSeconds +
        " sec!" + " Can you beat my achievement?";

        // populate FB meta tags
        // (has no effect on sharing since web page should be saved to server and get new URL)
        document.querySelector('meta[property="og:url"]').setAttribute("content", this.url);
        document.querySelector('meta[property="og:title"]').setAttribute("content", this.title);
        document.querySelector('meta[property="og:description"]').setAttribute("content", this.description);
        document.querySelector('meta[property="og:image"]').setAttribute("content", this.image);
        
        // trigger Share Dialog
        FB.ui({
            method: "share",
            href: this.url,
            hashtag: "#dream_unlim",
            quote: this.description
        }, (response) => { this.relayResponse(response) });
    }

    relayResponse(response) {
        if (response && !response.error_message) {
            this.shareScoreButton.t1 = time;
            this.shareScoreButton.hintMessage = "Success";

            // log event
            gtag("event", "share", {
                "method": "Facebook",
                "score": this.dataToShare.formattedScore,
                "minutes": this.dataToShare.formattedMinutes,
                "seconds": this.dataToShare.formattedSeconds
            });
        } else {
            // no message on Share Dialog closed either by cancellation or errors
        }
    }

}