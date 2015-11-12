HermesApp.Routers.Root = HermesApp.Routers.Main.extend({
  routes: {
    "(/)":             "start",
    "(/show*params)": "start"
  },

  start: function(params) {
    var path;
    if (window.location.hash.length === 0 || window.location.hash === "#") {
      return HermesApp.redirect("/dashboard", {
        replace: true,
        trigger: true
      });
    } else {
      path = window.location.hash.slice(2);
      return HermesApp.redirect(path, {
        replace: true,
        trigger: true
      });
    }
  }
});

