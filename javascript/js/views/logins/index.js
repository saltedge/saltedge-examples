HermesApp.Views.LoginsIndex = HermesApp.CompositeView.extend({
  template:  "#logins-index-template",
  childView: HermesApp.Views.Login,
  emptyView: HermesApp.Views.EmptyLogins,

  initialize: function(options) {
    this.listenTo(HermesApp.Data.logins, "add remove", this.render);
    this.listenTo(HermesApp.Data.accounts, "add", this.render);
    return this.listenTo(HermesApp.Data.customer, "fetch:completed", this.afterFetch);
  },

  afterFetch: function(name) {
    var message, view;
    if (this.isDestroyed) {
      return;
    }
    message = "Login " + name + " was updated successfully!";
    view = new HermesApp.Views.Message({
      success: true,
      message: message
    });
    return HermesApp.layout.message.show(view);
  }
});
