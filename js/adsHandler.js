'use strict'

class AdsHandler {
    constructor() {
        this.mainContainer = document.getElementById("main-container");
        this.videoElement = document.getElementById("video-element");
        this.adContainer = document.getElementById("ad-container");
        this.adDisplayContainerInitialized = false;
        this.adDisplayContainer;
        this.adsLoader; // only maintain one instance for the entire lifecycle of a page
        this.adsManager;

        // On window load
        window.addEventListener("load", function (event) {
            adsHandler.initializeIMA();
            
            adsHandler.videoElement.addEventListener("play", function (event) {
                adsHandler.loadAds(event);
            });
        });
    }

    initializeIMA() {
        console.log("initializing IMA");

        this.adContainer.addEventListener("click", adsHandler.adContainerClick);
        
        this.adDisplayContainer = new google.ima.AdDisplayContainer(this.adContainer, this.videoElement);
        
        this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);
       
        this.adsLoader.addEventListener(
            google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            adsHandler.onAdsManagerLoaded,
            false);

        this.adsLoader.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            adsHandler.onAdError,
            false);

        // Let the AdsLoader know when the video has ended
        this.videoElement.addEventListener("ended", function () {
            adsHandler.adsLoader.contentComplete();
        });

        // to make additional ad requests, create a new ima.AdsRequest object,
        // but re-use the same ima.AdsLoader
        this.requestAd();
    }

    requestAd() {
        var adsRequest = new google.ima.AdsRequest();
        adsRequest.adTagUrl = "https://googleads.g.doubleclick.net/pagead/ads?" +
        "ad_type=image_text&client=ca-games-pub-4968145218643279&" +
        "description_url=https%3A%2F%2Fdreamunlim.github.io&adtest=on";

        // Specify the linear and nonlinear slot sizes. This helps the SDK to
        // select the correct creative if multiple are returned.
        // linear - video ad
        adsRequest.linearAdSlotWidth = this.videoElement.clientWidth;
        adsRequest.linearAdSlotHeight = this.videoElement.clientHeight;
        // nonlinear - image/text ad
        adsRequest.nonLinearAdSlotWidth = this.videoElement.clientWidth;
        adsRequest.nonLinearAdSlotHeight = this.videoElement.clientHeight;

        // Pass the request to the adsLoader to request ads
        this.adsLoader.requestAds(adsRequest);
    }

    loadAds(event) {
        // Initialize the container once
        // Must be done via a user action on mobile devices
        if (! this.adDisplayContainerInitialized) {
            this.adDisplayContainer.initialize();
            this.adDisplayContainerInitialized = true;
        }

        this.videoElement.load();
        this.startAdsManager();
    }

    startAdsManager() {
        var width = this.videoElement.clientWidth;
        var height = this.videoElement.clientHeight;
        
        try {
            this.adsManager.init(width, height, google.ima.ViewMode.NORMAL);
            this.adsManager.start();
        } catch (adError) {
            // Play the video without ads, if an error occurs
            console.log("AdsManager could not be started");
            this.videoElement.play();
        }
    }

    onAdsManagerLoaded(adsManagerLoadedEvent) {
        var adsRenderingSettings = new google.ima.AdsRenderingSettings();
        adsRenderingSettings.useStyledLinearAds = true;
        adsRenderingSettings.useStyledNonLinearAds = true;
        
        // Instantiate the AdsManager from the adsLoader response and pass it the video element
        adsHandler.adsManager = adsManagerLoadedEvent.getAdsManager(
            adsHandler.videoElement, adsRenderingSettings);

        adsHandler.adsManager.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            adsHandler.onAdError);

        adsHandler.adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
            adsHandler.onContentPauseRequested);

        adsHandler.adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
            adsHandler.onContentResumeRequested);

        adsHandler.adsManager.addEventListener(
            google.ima.AdEvent.Type.LOADED,
            adsHandler.onAdLoaded);

        adsHandler.adsManager.addEventListener(
            google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
            adsHandler.onAllAdsCompleted);
    }

    onAdError(adErrorEvent) {
        // Handle the error logging
        console.log(adErrorEvent.getError().toString());

        if (adsHandler.adsManager) {
            adsHandler.adsManager.destroy();
        }
    }

    onContentPauseRequested() {
        adsHandler.videoElement.pause();
    }

    onContentResumeRequested() {
        adsHandler.videoElement.play();
    }

    onAdLoaded(adEvent) {
        var ad = adEvent.getAd();
        
        if (! ad.isLinear()) {
            adsHandler.videoElement.play();
        }
    }

    onAllAdsCompleted() {
        console.log("all ads completed");
        adsHandler.adsManager.destroy();
        adsHandler.adsLoader.contentComplete();
        adsHandler.requestAd();
    }

    adContainerClick() {
        if (adsHandler.videoElement.paused) {
            adsHandler.videoElement.play();
        } else {
            adsHandler.videoElement.pause();
        }
    }

}

// Google Ads SDK
(() => {
    var script = document.createElement("script");
    script.src = "//imasdk.googleapis.com/js/sdkloader/ima3.js";
    document.body.insertBefore(script, document.querySelector('script[src="js/adsHandler.js"]'));
})();

var adsHandler = new AdsHandler();