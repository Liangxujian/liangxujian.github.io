/* 目录树：让当前激活项自动留在面板可视区内（面板本身是 70vh 固定高度，内部有滚动条） */
(function () {
  var toc = document.querySelector(".tocbot");
  if (!toc) return;
  var list = toc.querySelector(".toc-list");
  if (!list) return;

  var pending = false;

  function keepActiveVisible() {
    pending = false;
    if (list.scrollHeight <= list.clientHeight + 2) return;
    var act = toc.querySelector(".is-active-link");
    if (!act) return;
    var lr = list.getBoundingClientRect();
    var ar = act.getBoundingClientRect();
    var pad = 12;
    if (ar.top < lr.top + pad) {
      list.scrollTop -= lr.top + pad - ar.top;
    } else if (ar.bottom > lr.bottom - pad) {
      list.scrollTop += ar.bottom - (lr.bottom - pad);
    }
  }

  function schedule() {
    if (pending) return;
    pending = true;
    if (window.requestAnimationFrame) window.requestAnimationFrame(keepActiveVisible);
    else setTimeout(keepActiveVisible, 16);
  }

  var obs = new MutationObserver(schedule);
  obs.observe(toc, { subtree: true, attributes: true, attributeFilter: ["class"] });
})();
