// Include the HLS plugin
videojs.registerPlugin("videoJsHls", function () {
  var player = this;
  videojs.log("HLS plugin loaded!");

  // Set up HLS tech and options
  var hlsTech = new videojs.Hls();
  player.ready(function () {
    player.tech(hlsTech, player.options_);
  });
});

// Initialize Video.js with the HLS plugin
const videojsOptions = {
  autoplay: true,
  controls: false,
  plugins: {
    videoJsHls: true, // Enable the HLS plugin
  },
  sources: [
    {
      src: "https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
      type: "application/x-mpegURL",
    },
  ],
};

const player = videojs("my-video", videojsOptions, function () {
  this.on("error", handleVideoError);
  this.on("play", handlePlay);
});

// Variables for tracking stream health
let lastReceivedPackets = 0;
let checkInterval;

function handlePlay() {
  // Start checking stream health
  checkInterval = setInterval(checkStreamHealth, 5000); // Check every 5 seconds
}

function handleVideoError(error) {
  console.error("Video.js error:", error);

  // Attempt to reconnect
  player.src({
    src: "https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
    type: "application/x-mpegURL",
  });
}

function checkStreamHealth() {
  if (player.techName_ === "Html5" && player.tech_.hls) {
    const currentReceivedPackets = player.tech_.hls.stats.mediaBytesReceived;

    if (currentReceivedPackets === lastReceivedPackets) {
      // No new packets received, indicating a problem with the stream
      console.log("Stream health issue detected. Attempting to reconnect...");
      handleVideoError();
    }

    lastReceivedPackets = currentReceivedPackets;
  }
}
