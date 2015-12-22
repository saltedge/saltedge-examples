HermesApp.Views.AccountShow = HermesApp.ItemView.extend({
  template: "#account-show-template",

  serializeData: function() {
    return this.modelAttributes({
      transactions_count: this.getTransactionsCount(),
      created_at:         HermesApp.dateTimeFormat(this.model.get("created_at")),
      updated_at:         HermesApp.dateTimeFormat(this.model.get("updated_at"))
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
