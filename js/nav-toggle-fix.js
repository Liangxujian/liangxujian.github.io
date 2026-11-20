/* 左上角三横按钮（侧边栏抽屉开关）确定性版本。
   主题原实现依赖 jQuery 的 click 绑定，一旦绑定丢失或同一事件被触发两次，
   就会出现“点了没反应/来回抵消”。这里在捕获阶段接管，只切换一次，并阻断主题旧绑定重复触发。 */
(function () {
  function toggle(btn) {
    var sidebar = document.querySelector("aside.sidebar");
    var content = document.querySelector("main.content");
    if (!sidebar) return;
    sidebar.classList.add("anim");
    if (content) content.classList.add("anim");

    // 以侧栏当前状态为准，保证一次点击只切换一次
    var open = sidebar.classList.contains("on");
    sidebar.classList.toggle("on", !open);
    if (content) content.classList.toggle("on", !open);

    btn.setAttribute("aria-expanded", String(!open));
  }

  document.addEventListener("click", function (e) {
    var btn = e.target && e.target.closest ? e.target.closest(".navbar-toggle") : null;
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    toggle(btn);
  }, true);
})();
