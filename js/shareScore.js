import { canvas } from "./canvas.js";
import { frameStartTime } from "./main.js";

class ShareScore {
    constructor() {
        this.input = document.createElement("input");
        this.input.setAttribute("type", "button");
        this.input.setAttribute("value", "Share");
        this.input.addEventListener("click", () => { this.processShare() }, false);
        document.body.insertBefore(this.input, canvas.nextElementSibling);

        // add FB JS SDK specific div
        this.div = document.createElement("div");
        this.div.setAttribute("id", "fb-root");
        document.body.insertBefore(this.div, canvas.nextElementSibling);

        //
        this.dataToShare = {};
        this.shareScoreButton = null;
        this.androidBrowser = (navigator.userAgent.indexOf("Android") != -1) ? true : false;
        this.shareInProcess = false;

        // post params
        this.pageID = "106658495514253";
        this.albumID = "112951878233608";
        this.message = "";
        this.webLink = window.location.href;
        this.playStoreLink = "https://play.google.com/store/apps/details?id=io.github.dreamunlim.twa";
        this.postLink = this.androidBrowser ? this.playStoreLink : this.webLink;
        this.callToActionType = this.androidBrowser ? "INSTALL_APP" : "USE_APP";
        this.openGraphActions = { FEELS: "383634835006146" };
        this.openGraphFeelings = {
            AWESOME: "212888755520954",
            CHALLENGED: "315111361928320",
            EXCITED: "308167675961412",
            HAPPY: "528297480516636",
            JOYFUL: "477906418922117",
            WONDERFUL: "502842009736003"
        };
    }

    selectOpenGraphFeeling() {
        let values = Object.values(this.openGraphFeelings);
        let length = Object.values(this.openGraphFeelings).length;
        return values[frameStartTime % length | 0];
    }

    assembleMessage(userID) {
        let playerID = userID.slice(-4);
        this.message = `🎈 ⎧Player-${playerID}⎭ scored 🏆 ${this.dataToShare.formattedScore} points in ` +
            `⏱ ${this.dataToShare.formattedMinutes} min ${this.dataToShare.formattedSeconds} sec! ` +
            "Can you beat their achievement?";
    }

    processShare() {
        // don't proceed on connection error
        if (typeof FB === "undefined") {
            this.shareScoreButton.setHintMessage("SDK Not Loaded");
            return;
        }
        if (this.shareScoreButton.state.topScore[0][0] === 0) {
            this.shareScoreButton.setHintMessage("Zero Score");
            return;
        }
        if (this.shareInProcess) {
            this.shareScoreButton.setHintMessage("In Process");
            return;
        }
        if (this.dataToShare.alreadyPosted) {
            this.shareScoreButton.setHintMessage("Already Posted");
            return;
        }

        this.checkUserLoginStatus();
    }

    checkUserLoginStatus() {
        this.shareInProcess = true;

        FB.getLoginStatus((response) => {
            if (response.status !== "connected") {
                this.loginUser();
            } else {
                this.assembleMessage(response.authResponse.userID);
                this.getPageAcessToken(response.authResponse.accessToken);
            }
        });
    }

    loginUser() {
        FB.login((response) => {
            if (response.status === "connected") {
                this.assembleMessage(response.authResponse.userID);
                this.getPageAcessToken(response.authResponse.accessToken);
            } else {
                this.shareInProcess = false;
                this.shareScoreButton.setHintMessage("Login Error");
            }
        }, { scope: "pages_manage_posts, pages_read_engagement, pages_show_list" });
    }

    getPageAcessToken(userAccessToken) {
        let endpoint = `/${this.pageID}`;
        let method = "GET";
        let params = {
            fields: "access_token",
            access_token: userAccessToken
        };
        let callback = (response) => {
            if (response && !response.error) {
                this.uploadPicture(response.access_token);
            } else {
                this.shareInProcess = false;
                this.shareScoreButton.setHintMessage("Token Error");
            }
        };

        FB.api(endpoint, method, params, callback);
    }

    async uploadPicture(pageAcessToken) {
        let picResponse = await fetch(this.dataToShare.canvasScreenshot);
        let picBlob = await picResponse.blob();

        let formData = new FormData();
        formData.append("published", false);
        formData.append("picture", picBlob);
        formData.append("access_token", pageAcessToken);

        let endpoint = `https://graph.facebook.com/v15.0/${this.albumID}/photos`;
        let callback = (response) => {
            if (response && !response.error) {
                this.postToPage(pageAcessToken, response.id);
            } else {
                this.shareInProcess = false;
                this.shareScoreButton.setHintMessage("Pic Upload Error");
            }
        };

        this.shareScoreButton.setHintMessage("Uploading Pic");
        fetch(endpoint, { method: "POST", body: formData })
            .then(res => res.json())
            .then(json => callback(json));
    }

    postToPage(pageAcessToken, photoID) {
        let endpoint = `/${this.pageID}/feed`;
        let method = "POST";
        let params = {
            og_action_type_id: this.openGraphActions.FEELS,
            og_object_id: this.selectOpenGraphFeeling(),
            message: this.message,
            attached_media: [{ media_fbid: photoID }],
            // call_to_action: { type: this.callToActionType, value: { link: this.postLink } }, // requires link ownership verification
            access_token: pageAcessToken
        };
        let callback = (response) => {
            if (response && !response.error) {
                this.dataToShare.alreadyPosted = true;
                this.shareScoreButton.state.cacheDataToLocalStorage();
                this.shareScoreButton.setHintMessage("Success");

                this.logAnalyticsEvent();
            } else {
                this.shareScoreButton.setHintMessage("Post Error");
            }

            this.shareInProcess = false;
        };

        this.shareScoreButton.setHintMessage("Posting");
        FB.api(endpoint, method, params, callback);
    }

    logAnalyticsEvent() {
        gtag("event", "share", {
            "method": "Facebook",
            "top_score": this.shareScoreButton.state.topScore[0][0],
            "seconds_played": Math.floor(this.shareScoreButton.state.topScore[0][1] / 1000)
        });
    }
}

export { ShareScore };