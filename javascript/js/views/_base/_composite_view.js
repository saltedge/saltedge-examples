HermesApp.CompositeView = Marionette.CompositeView.extend({
  childViewContainer: "tbody",

  events: function() {
    return {
      "click .js-back":         "goBack",
      "click .js-to-dashboard": "redirectToDashboard"
    };
  },

  redirectToDashboard: function(event) {
    event.preventDefault();
    return HermesApp.redirect("/dashboard");
  },

  goBack: function() {
    return window.history.back();
  }
});
