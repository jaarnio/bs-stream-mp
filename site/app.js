// Initialize Video.js
const videojsOptions = {
  autoplay: true, // Autoplay
  controls: false, // Remove controls
  sources: [
    {
      src: "https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
      type: "application/x-mpegURL",
    },
  ],
};

const player = videojs("my-video", videojsOptions, function () {
  // Video.js player setup complete
  this.on("error", handleVideoError);
  this.on("play", handlePlay);
});
var tech = player.getTech({ IWillNotUseThisInPlugins: true });

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
  const currentReceivedPackets = player.tech().hls.stats.mediaBytesReceived;

  if (currentReceivedPackets === lastReceivedPackets) {
    // No new packets received, indicating a problem with the stream
    console.log("Stream health issue detected. Attempting to reconnect...");
    handleVideoError();
  }

  lastReceivedPackets = currentReceivedPackets;
}

// Ensure stream health check starts when the player is ready
player.ready(function () {
  handlePlay();
});
