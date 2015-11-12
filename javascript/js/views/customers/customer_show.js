HermesApp.Views.CustomerShow = HermesApp.ItemView.extend({
  template: "#customer-show-template",

  serializeData: function() {
    return this.modelAttributes({
      logins_count: this.model.get("logins").length || 0
    });
  }
});
