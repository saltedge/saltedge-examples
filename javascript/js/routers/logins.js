HermesApp.Routers.Logins = HermesApp.Routers.Main.extend({
  routes: {
    "logins":          "index",
    "logins/:id/show": "show"
  },

  index: function() {
    var view;
    this.title("Logins");

    view = new HermesApp.Views.LoginsIndex({
      collection: this.getCollection(HermesApp.Models.Customer.LOGINS)
    });
    return HermesApp.layout.content.show(view);
  },

  show: function(id) {
    var view;
    this.title("Login #" + id);

    view = new HermesApp.Views.LoginShow({
      model: this.getCollection(HermesApp.Models.Customer.LOGINS).get(id)
    });
    return HermesApp.layout.content.show(view);
  }
});
