HermesApp.Routers.Transactions = HermesApp.Routers.Main.extend({
  routes: {
    "transactions/pending(/:page)":                "pending",
    "transactions(/:page)":                        "index",
    "transactions/:id/show":                       "show",
    "transactions/account_id/:account_id(/:page)": "by_accounts"
  },

  index: function(page) {
    var collection, view;
    if (page == null) {
      page = 1;
    }
    this.title("All transactions");
    collection = this.getCollection(HermesApp.Models.Customer.TRANSACTIONS).clone();

    collection._current_page = parseInt(page);
    view = new HermesApp.Views.TransactionsIndex({
      collection: collection
    });
    return HermesApp.layout.content.show(view);
  },

  pending: function(page) {
    var collection, pendings, view;

    if (page == null) {
      page = 1;
    }
    this.title("Pending transactions");

    collection = this.getCollection(HermesApp.Models.Customer.TRANSACTIONS).clone();
    collection._current_page = parseInt(page);

    pendings = collection.filter(function(model) {
      return model.get("status") === HermesApp.Models.Transaction.PENDING;
    });
    collection.reset(pendings);
    collection._pending = true;
    collection.url = "/transactions/pending";

    view = new HermesApp.Views.TransactionsIndex({
      collection: collection
    });
    return HermesApp.layout.content.show(view);
  },

  show: function(id) {
    var view;
    this.title("Transaction #" + id);

    this.getCollection(HermesApp.Models.Customer.TRANSACTIONS).clone();
    view = new HermesApp.Views.TransactionShow({
      model: HermesApp.Data.transactions.get(id)
    });
    return HermesApp.layout.content.show(view);
  },

  by_accounts: function(account_id, page) {
    var accountName, byAccount, collection, view;
    if (page == null) {
      page = 1;
    }

    collection = this.getCollection(HermesApp.Models.Customer.TRANSACTIONS).clone();
    accountName = HermesApp.Data.accounts.get(account_id).get("name");
    this.title("Transactions of account " + accountName);

    byAccount = collection.filter(function(model) {
      return model.get("account_id") === parseInt(account_id);
    });
    collection.reset(byAccount);
    collection._current_page = parseInt(page);
    collection._account_id = parseInt(account_id);
    collection.url = "/transactions/account_id/" + account_id;

    view = new HermesApp.Views.TransactionsIndex({
      collection: collection
    });
    return HermesApp.layout.content.show(view);
  },

  getTransactionsCollection: function() {
    if (HermesApp.Data.transactions.length === 0) {
      this.getAllData();
    }
    return HermesApp.Data.transactions;
  }
});
