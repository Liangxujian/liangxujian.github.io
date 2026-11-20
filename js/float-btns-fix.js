/* 回到顶部 + 夜间模式：不依赖 jQuery 动画（主题原实现用 fadeTo/animate，
   在动画引擎不跑、或被 CSS transition 干扰时会完全失效）。 */
(function () {
  var scroller = document.querySelector("main.content") || document.documentElement;
  var totop = document.getElementById("totop");
  var darkKey = "darkmode";

  function syncTotop() {
    if (!totop) return;
    var st = scroller === document.documentElement
      ? window.scrollY || document.documentElement.scrollTop
      : scroller.scrollTop;
    var shown = st > 300;
    totop.classList.toggle("is-shown", shown);
    // 用 important 内联值，压过主题里 jQuery fadeTo 写入的普通内联 opacity
    totop.style.setProperty("display", "block", "important");
    totop.style.setProperty("opacity", shown ? "0.6" : "0", "important");
    totop.style.setProperty("pointer-events", shown ? "auto" : "none", "important");
  }

  if (scroller) {
    scroller.addEventListener("scroll", syncTotop, { passive: true });
    syncTotop();
  }
  window.addEventListener("resize", syncTotop, { passive: true });

  function scrollTopNative() {
    if (!scroller) return;
    if (scroller === document.documentElement) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    try {
      scroller.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      scroller.scrollTop = 0;
    }
    // 平滑滚动被禁用时的兜底
    setTimeout(function () {
      if (scroller.scrollTop > 400) scroller.scrollTop = 0;
    }, 900);
  }

  function toggleDark(el) {
    var on = document.body.classList.toggle("darkmode");
    var icon = el.querySelector("i");
    if (icon) {
      icon.classList.toggle("ri-sun-line", on);
      icon.classList.toggle("ri-moon-line", !on);
    }
    if (on) sessionStorage.setItem(darkKey, 1);
    else sessionStorage.removeItem(darkKey);
  }

  // 捕获阶段接管，并阻止主题里基于 jQuery 的旧绑定重复触发（否则会互相抵消）
  document.addEventListener("click", function (e) {
    var top = e.target && e.target.closest ? e.target.closest("#totop") : null;
    if (top) {
      e.preventDefault();
      e.stopPropagation();
      scrollTopNative();
      return;
    }
    var dark = e.target && e.target.closest ? e.target.closest("#todark") : null;
    if (dark) {
      e.preventDefault();
      e.stopPropagation();
      toggleDark(dark);
    }
  }, true);
})();
