/* Общая навигация для всех страниц.
   Подключается так: <script src="../assets/notebook.js" data-home="../index.html"></script>
   data-home — ссылка на главную; если атрибут не указан (на самой главной), кнопка "Домой" не рисуется.
   Переключатель темы всегда добавляется. Выбор темы хранится в localStorage и общий для всех страниц. */
(function () {
  var THEME_KEY = "nb-theme";
  var thisScript = document.currentScript;

  function storedTheme() {
    try {
      var t = localStorage.getItem(THEME_KEY);
      return (t === "light" || t === "dark") ? t : null;
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function isDarkNow() {
    var t = storedTheme();
    if (t) return t === "dark";
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  // Применяем сохранённую тему сразу, синхронно, чтобы страница не мигала светлым перед тёмным.
  applyTheme(storedTheme());

  document.addEventListener("DOMContentLoaded", function () {
    var homeHref = thisScript && thisScript.getAttribute("data-home");

    var nav = document.createElement("div");
    nav.className = "nb-nav";

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "theme-toggle";

    function renderToggle() {
      var dark = isDarkNow();
      toggle.textContent = dark ? "☀" : "☾";
      toggle.setAttribute("aria-label", dark ? "Включить светлую тему" : "Включить тёмную тему");
      toggle.title = toggle.getAttribute("aria-label");
    }
    renderToggle();

    toggle.addEventListener("click", function () {
      var next = isDarkNow() ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
      renderToggle();
    });

    nav.appendChild(toggle);

    if (homeHref) {
      var home = document.createElement("a");
      home.className = "home-btn";
      home.href = homeHref;
      home.innerHTML = '<span class="arrow">←</span> Домой';
      nav.appendChild(home);
    }

    document.body.appendChild(nav);
  });
})();
