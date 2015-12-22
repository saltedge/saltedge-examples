HermesApp.redirect = function(url, options) {
  if (options == null) {
    options = {
      trigger: true
    };
  }

  return Backbone.history.navigate(url, options);
};
