HermesApp.Views.Login = HermesApp.ItemView.extend({
  template: "#login-template",
  tagName:  "tr",

  ui: {
    refresh: ".js-refresh",
    reconnect: ".js-reconnect",
    destroy: ".js-destroy"
  },

  events: {
    "click @ui.refresh": "onRefreshClick",
    "click @ui.reconnect": "onReconnectClick",
    "click @ui.destroy": "onDestroyClick"
  },

  initialize: function(options) {
    return this.collection = this.model.collection;
  },

  serializeData: function() {
    return this.modelAttributes({
      login_state:    this.getLoginState(),
      accounts_count: HermesApp.Data.accounts.where({login_id: this.model.id}).length
    });
  },

  onShow: function() {
    if (!this.model.get("automatic_fetch")) {
      return this.ui.refresh.addClass("disabled");
    }
  },

  getLoginState: function() {
    if (this.model.get("stage") === "success") {
      return "success";
    }
    return "danger";
  },

  onDestroyClick: function(event) {
    var that = this;
    event.preventDefault();
    return new HermesApp.Views.ConfirmModal({
      confirmation: "Are you sure you want to delete login " + (this.model.get('provider_name')) + "?",
      action: function() { that.destroyLogin(); }
    });
  },

  destroyLogin: function() {
    var customer;
    customer = HermesApp.Data.customer;
    return this.model.removeLogin().success((function(_this) {
      return function(data) {
        var accounts, logins, transactions, view;
        logins = _.reject(customer.get("logins"), function(model) {
          return model.id === _this.model.id;
        });
        accounts = _.reject(customer.get("accounts"), function(model) {
          return model.login_id === _this.model.id;
        });
        transactions = _.filter(customer.get("transactions"), (function(_this) {
          return function(model) {
            var ref, indexOf = [].indexOf || function(item) {
              for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item) return i;
              }
              return -1;
            };
            return ref = model.account_id, indexOf.call(_.pluck(accounts, "id"), ref) >= 0;
          };
        })(this));

        customer.set({
          logins: logins,
          accounts: accounts,
          transactions: transactions
        });
        customer.save();

        HermesApp.Data.logins.remove(_this.model);
        HermesApp.Data.accounts.reset(accounts);
        HermesApp.Data.transactions.reset(transactions);
        view = new HermesApp.Views.Message({
          success: true,
          message: "Login " + (_this.model.get('provider_name')) + " was removed successfully!"
        });
        HermesApp.layout.message.show(view);
      };
    })(this));
  },

  onRefreshClick: function(event) {
    event.preventDefault();
    if (!this.model.get("automatic_fetch")) {
      return;
    }
    return this.model.refresh().success((function(_this) {
      return function(data) {
        HermesApp.Data.customer.set({
          _src: data.data.connect_url
        });
        return HermesApp.redirect("/connect");
      };
    })(this)).error(function(data) {
      return console.warn("Refresh Error", data);
    });
  },

  onReconnectClick: function(event) {
    event.preventDefault();
    return this.model.reconnect().success((function(_this) {
      return function(data) {
        HermesApp.Data.customer.set({
          _src: data.data.connect_url
        });
        return HermesApp.redirect("/connect");
      };
    })(this)).error(function(data) {
      return console.warn("Reconnect Error", data);
    });
  }
});
