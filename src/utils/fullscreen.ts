// 全屏工具方法
export const enterFullScreen = () => {
  const el = document.documentElement as any;
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
};

export const exitFullScreen = () => {
  const d: any = document;
  if (d.exitFullscreen) {
    d.exitFullscreen();
  } else if (d.webkitExitFullscreen) {
    d.webkitExitFullscreen();
  } else if (d.mozCancelFullScreen) {
    d.mozCancelFullScreen();
  } else if (d.msExitFullscreen) {
    d.msExitFullscreen();
  }
};

export const isFullScreenNow = () => {
  return Boolean(
    document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
  );
};
