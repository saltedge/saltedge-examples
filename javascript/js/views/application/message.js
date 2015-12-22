HermesApp.Views.Message = HermesApp.ItemView.extend({
  template: "#message-template",

  initialize: function(options) {
    this.message = options.message;
    if (options.success) {
      return this.success = options.success;
    }
  },

  serializeData: function() {
    return {
      message:     this.message,
      success:     this.success,
      alert_class: this.success ? "alert-success" : "alert-danger"
    };
  },

  onShow: function() {
    return this.timeout = setTimeout(((function(_this) {
      return function() {
        return _this.destroy();
      };
    })(this)), 2000);
  },

  onDestroy: function() {
    return clearTimeout(this.timeout);
  }
});
