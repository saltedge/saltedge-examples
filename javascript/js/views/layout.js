HermesApp.Views.AppLayout = Marionette.LayoutView.extend({
  el:       "#app",
  template: "#layout-template",

  regions: {
    message: "#view-message",
    content: "#view-content",
    dialog:  "#view-dialog"
  },

  initialize: function() {
    return Backbone.$("body").on("click", "a", this.pushStateClick);
  },

  pushStateClick: function(event) {
    var ctrlPressed, href;
    ctrlPressed = event.ctrlKey || event.metaKey;
    href = $(this).attr("href");
    if ($(this).attr("rel")) {
      return;
    }
    if (!href) {
      return;
    }
    if (href.charAt(0) === "#") {
      return;
    }
    if (ctrlPressed) {
      return;
    }
    HermesApp.redirect(href);
    return false;
  }
});
