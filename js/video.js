document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("bgVideo");
  if (!video) return;

  const SPEED = 0.25; // try 0.25–0.5

  video.muted = true;
  video.loop = true;
  video.playbackRate = SPEED;

  // iOS Safari may reset playbackRate when playback starts
  video.addEventListener("play", () => {
    video.playbackRate = SPEED;
  });
});