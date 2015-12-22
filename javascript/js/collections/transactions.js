HermesApp.Collections.Transactions = Backbone.Collection.extend({
  url:   "/transactions",
  model: HermesApp.Models.Customer,

  comparator: function(model) {
    return model.get("made_on");
  }
})
