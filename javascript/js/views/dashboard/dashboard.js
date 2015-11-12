HermesApp.Views.Dashboard = HermesApp.ItemView.extend({
  template: "#dashboard-template",
  id:       "js-tester-dashboard",

  ui: {
    customerLink: ".js-customer-link",
    destroy: ".js-reset"
  },

  events: {
    "click @ui.customerLink": "showCustomer",
    "click .js-connect": "createConnect",
    "click .js-reset": "destroyCustomer"
  },

  initialize: function(options) {
    this.model = HermesApp.Data.customer;

    if (!this.model.get("customer_id")) {
      this.getCustomerId();
    }
    this.listenTo(this.model, "fetch:completed", this.afterFetch);
    this.listenTo(this.model, "login:fetched", this.fetchData);
    this.listenTo(this.model, "change", this.render);
    return this.listenTo(HermesApp.Data.logins, "update remove", this.render);
  },

  serializeData: function() {
    logins       = this.model.get("logins");
    accounts     = this.model.get("accounts");
    transactions = this.model.get("transactions");

    return this.modelAttributes({
      identifier:         this.model.get("identifier") || "",
      active_class:       this.model.get("status") == "active" ? "text-success" : "text-warning",
      logins_count:       logins ? logins.length : 0,
      accounts_count:     accounts ? accounts.length: 0,
      transactions_count: transactions ? transactions.length : 0
    });
  },

  getCustomerId: function() {
    if (!(localStorage.getItem("client_id") || localStorage.getItem("app_secret"))) {
      var that = this;
      new HermesApp.Views.MainInfo({
        action: function() { that.requestForCustomerId; }
      });
      return;
    }
    return this.requestForCustomerId();
  },

  requestForCustomerId: function() {
    return this.model.getCustomerId().success((function(_this) {
      return function(data) {
        _this.model.set({
          customer_id: data.data.customer_id,
          status: "active"
        });
        return _this.model.save();
      };
    })(this)).error(function(data) {
      return console.warn("Error get customer id", data);
    });
  },

  createConnect: function(event) {
    event.preventDefault();
    if (!this.model.get("customer_id")) {
      return this.getCustomerId();
    }
    return this.model.createToken().success((function(_this) {
      return function(data) {
        _this.model.set({
          _src: data.data.connect_url
        });
        return HermesApp.redirect("/connect");
      };
    })(this)).error(function(data) {
      return console.warn("Error create connect", data);
    });
  },

  fetchData: function(login) {
    return login.fetchAssociatedData();
  },

  showCustomer: function(event) {
    event.preventDefault();
    return HermesApp.redirect("/customers/" + this.model.id);
  },

  destroyCustomer: function(event) {
    var that = this;
    event.preventDefault();
    return new HermesApp.Views.ConfirmModal({
      title: "Are you sure you want to <b>RESET</b> all data?",
      confirmation: "If you click <b>'Confirm'</b>, ALL DATA will be reseted and create new Customer.",
      action: function() { that.resetAllData(); }
    });
  },

  resetAllData: function() {
    if (!this.model.get("customer_id")) {
      return this.getCustomerId();
    }
    return this.model.removeCustomer().success((function(_this) {
      return function() {
        var view;
        localStorage.removeItem("customers");
        localStorage.removeItem("customers-" + HermesApp.Data.customer.id);
        location.reload();
        view = new HermesApp.Views.Message({
          success: true,
          message: "All data was reseted successfully!"
        });
        return HermesApp.layout.message.show(view);
      };
    })(this));
  },

  afterFetch: function(name) {
    var message, view;
    if (this.isDestroyed) {
      return;
    }
    message = "Login " + name + " was connected successfully!";
    view = new HermesApp.Views.Message({
      success: true,
      message: message
    });
    HermesApp.layout.message.show(view);
    return this.render();
  }
});
