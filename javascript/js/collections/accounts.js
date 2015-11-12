HermesApp.Collections.Accounts = Backbone.Collection.extend({
  model: HermesApp.Models.Account,

  comparator: function(model) {
    return model.get("name");
  }
});
