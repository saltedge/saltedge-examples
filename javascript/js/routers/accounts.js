HermesApp.Routers.Accounts = HermesApp.Routers.Main.extend({
  routes: {
    "accounts":                    "index",
    "accounts/by_login/:login_id": "byLogin",
    "accounts/:id/show":           "show"
  },

  index: function() {
    this.title("All Accounts");
    return this.showCollection(this.getCollection(HermesApp.Models.Customer.ACCOUNTS));
  },

  byLogin: function(login_id) {
    var collection;
    this.title("Login #" + login_id + " Accounts");

    collection = new HermesApp.Collections.Accounts(this.getCollection(HermesApp.Models.Customer.ACCOUNTS).where({
      login_id: Number(login_id)
    }));
    return this.showCollection(collection);
  },

  show: function(id) {
    var model, view;
    this.getCollection(HermesApp.Models.Customer.ACCOUNTS);
    model = HermesApp.Data.accounts.get(id);
    this.title("Account " + (model.get('name')));

    view = new HermesApp.Views.AccountShow({
      model: model
    });
    return HermesApp.layout.content.show(view);
  },

  showCollection: function(collection) {
    var view;
    view = new HermesApp.Views.AccountsIndex({
      collection: collection
    });
    return HermesApp.layout.content.show(view);
  }
});
