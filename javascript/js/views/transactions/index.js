HermesApp.Views.TransactionsIndex = HermesApp.PaginatedView.extend({
  template:  "#transactions-index-template",
  childView: HermesApp.Views.Transaction,
  emptyView: HermesApp.Views.EmptyTransactions,

  serializeData: function() {
    return _.extend(HermesApp.PaginatedView.prototype.serializeData.apply(this, arguments), {
      text_class: this.getClassName()
    });
  },

  pageUrl: function() {
    var accountId, pending;
    accountId = this.originalCollection._account_id;
    pending = this.originalCollection._pending;
    if (accountId) {
      return "/transactions/account_id/" + accountId + "/%PAGE%";
    } else if (pending) {
      return "/transactions/pending/%PAGE%";
    } else {
      return "/transactions/%PAGE%";
    }
  },

  getClassName: function() {
    if (this.originalCollection._account_id) {
      return "";
    }
    if (this.originalCollection._pending) {
      return "text-warning";
    }
    return "text-info";
  }
});
