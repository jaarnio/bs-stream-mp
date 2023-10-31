document.addEventListener("DOMContentLoaded", function () {
  // Initialize Video.js
  // What are Video.js options? https://docs.videojs.com/tutorial-options.html

  const videoSource = "https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8";
  const options = {
    controls: false,
    autoplay: true,
    preload: "auto",
    fluid: true,
    liveUI: true,
    sources: [{ src: videoSource, type: "application/x-mpegURL" }],
  };

  var player = videojs("my-video", options, function onPlayerReady() {
    videojs.log("Your player is ready!");

    //this.errors();
    //this.errors.timeout(1000);

    this.play();
    this.on("playing", function () {
      console.log("Video is playing");
      monitorStream(this);
    });

    function monitorStream(player) {
      console.log("Monitoring stream...");

      player.reloadSourceOnError({
        // getSource allows you to override the source object used when an error occurs
        getSource: function (reload) {
          console.log("Reloading because of an error");
          reload({
            src: videoSource,
            type: "application/x-mpegURL",
          });
        },
        errorInterval: 5,
      });
      player.on("timeupdate", function () {
        //console.log("Time update");
      });
      player.on("ratechange", function () {
        console.log("Rate change");
      });
      player.on("waiting", function () {
        console.log("Video is waiting.");
      });
      player.on("stalled", function () {
        console.log("Video playback stalled. Reloading...");
      });
      player.on("suspend", function () {
        console.log("Video playback suspended. Reloading...");
      });
      player.on("ended", function () {
        console.log("Video ended. Reloading...");
        reloadVideo(player);
      });
    }
  });

  // Function to reload the video stream
  function reloadVideo(player) {
    console.log("Reloading video...");
    player.src(videoSource);
    player.load();
    //player.play();
  }
});
