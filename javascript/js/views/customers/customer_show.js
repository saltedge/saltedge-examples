HermesApp.Views.CustomerShow = HermesApp.ItemView.extend({
  template: "#customer-show-template",

  serializeData: function() {
    logins = this.model.get("logins");

    return this.modelAttributes({
      logins_count: logins ? logins.length : 0
    });
  }
});
