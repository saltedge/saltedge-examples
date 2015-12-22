HermesApp.Views.AccountsIndex = HermesApp.CompositeView.extend({
  template:  "#accounts-index-template",
  childView: HermesApp.Views.Account,
  emptyView: HermesApp.Views.EmptyAccounts,

  events: function() {
    return _.extend(HermesApp.CompositeView.prototype.events.apply(this, arguments), {
      "click .js-to-transactions":         "redirectToTransactions",
      "click .js-to-pending-transactions": "redirectToPendingTransactions"
    });
  },

  initialize: function(options) {
    return this.listenTo(this.collection, "update", this.render);
  },

  redirectToTransactions: function(event) {
    event.preventDefault();
    return HermesApp.redirect("/transactions");
  },

  redirectToPendingTransactions: function(event) {
    event.preventDefault();
    return HermesApp.redirect("/transactions/pending");
  }
});
