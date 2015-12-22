HermesApp.Models.Login = HermesApp.Model.extend({
  initialize: function(attributes, options) {
    HermesApp.Models.Login.__super__.initialize.apply(this, arguments);
    this.customer = HermesApp.Data.customer;
    this.internalPath = "/logins";
    return this.urlToReturn = "" + HermesApp.Config.applicationUrl + this.internalPath;
  },

  fetchAssociatedData: function() {
    return this.fetchData("login").success((function(_this) {
      return function(data) {
        var collection, model, modelAttributes, params;
        params     = data.data;
        collection = HermesApp.Data.logins;
        model      = collection.get(params.id);
        logins     = collection.length ? collection.models : []

        if (model) {
          modelAttributes = model.attributes || {};
          _.defaults(modelAttributes, params);
        }

        _this.customer.set({
          logins:     logins,
          updated_at: moment().format(HermesApp.Config.dateTimeFormat)
        });

        _this.customer.save();
        _this.fetchAccounts();
        return _this.fetchTransactions();
      };
    })(this));
  },

  fetchAccounts: function() {
    var accounts;
    accounts = this.customer.get("accounts") || [];

    return this.fetchData(HermesApp.Models.Customer.ACCOUNTS).success((function(_this) {
      return function(data) {
        HermesApp.Data.accounts.add(data.data);
        accounts = accounts.concat(data.data)
        _this.customer.set({accounts: accounts})
        return _this.set({accounts_count: accounts.length});
      };
    })(this));
  },

  fetchTransactions: function() {
    var transactions;
    transactions = this.customer.get("transactions") || [];

    this.fetchData(HermesApp.Models.Customer.TRANSACTIONS).success((function(_this) {
      return function(data) {
        HermesApp.Data.transactions.add(data.data);
        transactions = transactions.concat(data.data);

        return _this.fetchData(HermesApp.Models.Customer.TRANSACTIONS, HermesApp.Models.Transaction.PENDING).success(function(data) {
          HermesApp.Data.transactions.add(data.data);
          transactions = transactions.concat(data.data);

          _this.customer.set({transactions: transactions});
          _this.customer.save();
          return _this.customer.trigger("fetch:completed", _this.get("provider_name"));
        });
      };
    })(this));
  },

  setHeaders: function() {
    return {
      "App-secret":   localStorage.getItem("app_secret"),
      "Login-secret": this.get("secret")
    };
  },

  fetchData: function(kind, type) {
    var params;

    if (kind == null) {
      kind = "login";
    }

    if (type == null) {
      type = "";
    }

    params = {
      data: {
        return_to: this.urlToReturn,
        javascript_callback_type: "post_message"
      }
    };

    return Backbone.$.ajax({
      headers: this.setHeaders(),
      url:     HermesApp.Data.saltedgeBaseUrl + "/api/v2/" + kind + "/" + type,
      type:    "GET",
      data:    JSON.stringify(params)
    });
  },

  removeLogin: function() {
    return Backbone.$.ajax({
      headers: this.setHeaders(),
      url:     HermesApp.Data.saltedgeBaseUrl + "/api/v2/login",
      type:    "DELETE"
    });
  },

  refresh: function() {
    var params;
    this.customer.set({
      return_to: this.internalPath
    });

    params = {
      data: {
        return_to: this.urlToReturn,
        fetch_type: "recent",
        javascript_callback_type: "post_message"
      }
    };

    return Backbone.$.ajax({
      headers: this.setHeaders(),
      url:     HermesApp.Data.saltedgeBaseUrl + "/api/v2/tokens/refresh",
      type:    "POST",
      data:    JSON.stringify(params)
    });
  },

  reconnect: function() {
    var params;
    this.customer.set({
      return_to: this.internalPath
    });

    params = {
      data: {
        return_to: this.urlToReturn,
        fetch_type: "recent",
        javascript_callback_type: "post_message"
      }
    };

    return Backbone.$.ajax({
      headers: this.setHeaders(),
      url:     HermesApp.Data.saltedgeBaseUrl + "/api/v2/tokens/reconnect",
      type:    "POST",
      data:    JSON.stringify(params)
    });
  }

});
