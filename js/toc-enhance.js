/* 目录树：让当前激活项自动留在面板可视区内（面板本身是 70vh 固定高度，内部有滚动条） */
(function () {
  var toc = document.querySelector(".tocbot");
  if (!toc) return;
  var list = toc.querySelector(".toc-list");
  if (!list) return;

  var pending = false;

  // 目录内容的真实底边（末项底边），用来把滚动量卡在“末项贴底”处，避免滚出空白
  function maxScrollTop() {
    var items = toc.querySelectorAll(".toc-list-item");
    var bottom = 0;
    for (var i = 0; i < items.length; i++) {
      var b = items[i].offsetTop + items[i].offsetHeight;
      if (b > bottom) bottom = b;
    }
    return Math.max(0, bottom - list.clientHeight);
  }

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
    var limit = maxScrollTop();
    if (list.scrollTop > limit) list.scrollTop = limit;
    if (list.scrollTop < 0) list.scrollTop = 0;
  }

  function schedule() {
    if (pending) return;
    pending = true;
    setTimeout(keepActiveVisible, 60);
  }

  var obs = new MutationObserver(schedule);
  obs.observe(toc, { subtree: true, attributes: true, attributeFilter: ["class"] });

  // 激活项变化之外，也跟随文章滚动（tocbot 只改 class，但滚动事件更可靠）
  var scroller = document.querySelector("main.content");
  if (scroller) scroller.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
})();
