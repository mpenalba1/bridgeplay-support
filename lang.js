// Idioma de las páginas: ?lang=es|en|ja manda; si no, lo que el visitante eligió
// antes; si no, el idioma del teléfono (ja → japonés, es → español, resto → inglés).
// Se carga en <head> (sin defer) para que la página no parpadee en otro idioma.
(function () {
  var LANGS = ["es", "en", "ja"];
  function pick() {
    var q = new URLSearchParams(location.search).get("lang");
    if (LANGS.indexOf(q) >= 0) return q;
    var hash = location.hash.replace("#", "");  // enlaces viejos: guía#en
    if (LANGS.indexOf(hash) >= 0) return hash;
    try {
      var saved = localStorage.getItem("bp-lang");
      if (LANGS.indexOf(saved) >= 0) return saved;
    } catch (e) {}
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "es";
    nav = nav.toLowerCase();
    return nav.indexOf("ja") === 0 ? "ja" : nav.indexOf("es") === 0 ? "es" : "en";
  }
  function apply(lang) {
    var root = document.documentElement;
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    var t = root.getAttribute("data-title-" + lang);
    if (t) document.title = t;
    var buttons = document.querySelectorAll(".langs button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-pressed", buttons[i].getAttribute("data-set") === lang ? "true" : "false");
    }
  }
  apply(pick());
  document.addEventListener("DOMContentLoaded", function () {
    apply(document.documentElement.getAttribute("data-lang"));
    var buttons = document.querySelectorAll(".langs button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        var lang = this.getAttribute("data-set");
        try { localStorage.setItem("bp-lang", lang); } catch (e) {}
        apply(lang);
      });
    }
  });
})();
