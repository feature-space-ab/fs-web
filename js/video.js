document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("bgVideo");
  if (!video) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    video.pause();
    return;
  }

  const SPEED = 0.28;

  video.muted = true;
  video.loop = true;
  video.playbackRate = SPEED;

  const syncRate = () => {
    video.playbackRate = SPEED;
  };

  video.addEventListener("play", syncRate);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      video.pause();
      return;
    }

    video.play().catch(() => {
      // Some browsers block autoplay after tab switches.
    });
  });
});
