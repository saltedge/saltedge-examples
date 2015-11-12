HermesApp.ItemView = Marionette.ItemView.extend({
  events: function() {
    return {
      "click .js-back": "goBack"
    };
  },

  modelAttributes: function(ext) {
    if (ext == null) {
      ext = {};
    }
    if (this.model != null) {
      return _.extend({}, this.model.attributes, ext);
    } else {
      return ext;
    }
  },

  serializeData: function() {
    return this.modelAttributes();
  },

  goBack: function() {
    return window.history.back();
  }
});
