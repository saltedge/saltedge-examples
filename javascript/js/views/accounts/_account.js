HermesApp.Views.Account = HermesApp.ItemView.extend({
  template: "#account-template",
  tagName:  "tr",

  events: function() {
    return _.extend(HermesApp.CompositeView.prototype.events.apply(this, arguments), {
      "click .js-to-transactions":         "redirectToTransactions",
      "click .js-to-pending-transactions": "redirectToPendingTransactions"
    });
  },

  initialize: function(options) {
    return this.listenTo(HermesApp.Data.transactions, "update", this.render);
  },

  serializeData: function() {
    return this.modelAttributes({
      transactions_path:  "/transactions/account_id/" + this.model.id,
      transactions_count: this.getTransactionsCount()
    });
  },

  getTransactionsCount: function() {
    var transactions;
    transactions = HermesApp.Data.transactions.clone();
    transactions = transactions.filter((function(_this) {
      return function(model) {
        return model.get("account_id") === _this.model.id;
      };
    })(this));
    return transactions.length;
  }
});
