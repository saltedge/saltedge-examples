window.HermesApp = new Marionette.Application({
  Data:        {},
  Models:      {},
  Collections: {},
  Routers:     {},
  Views:       {},
  Config:      {},

  init: function(options) {
    HermesApp.Config = {
      applicationTitle: "Hermes",
      applicationUrl:   "http://localhost:5555",
      perPage:          20,
      dateTimeFormat:   "YYYY-MM-DD HH:mm:ss"
    };

    HermesApp.Data = {
      saltedgeBaseUrl:   "https://banksalt.com",
      saltedgeClientUrl: "https://banksalt.com/clients/profile/secrets",
      clientId:          "",
      appSecret:         "",
      customers:         new HermesApp.Collections.Customers(),
      logins:            new HermesApp.Collections.Logins(),
      accounts:          new HermesApp.Collections.Accounts(),
      transactions:      new HermesApp.Collections.Transactions()
    };

    HermesApp.Models.Customer.defineConstants("entities", ["logins", "accounts", "transactions"]);
    HermesApp.Models.Transaction.defineConstants("statuses", ["posted", "pending"]);

    initCustomer();

    return this.start();
  }
});

HermesApp.addInitializer(function() {
  HermesApp.layout = new HermesApp.Views.AppLayout();
  return HermesApp.layout.render();
});

HermesApp.addInitializer(function() {
  HermesApp.Routers.Main.add(HermesApp.Routers);
  return Backbone.history.start({pushState: true});
});

var initCustomer = function() {
  var customer, customers, now;
  customers = HermesApp.Data.customers;

  if (localStorage.getItem("customers")) {
    customers.fetch();
    return HermesApp.Data.customer = customers.first();
  }
  else {
    HermesApp.Data.customer = new HermesApp.Models.Customer();
    now                     = moment().format(HermesApp.Config.dateTimeFormat);
    customer                = HermesApp.Data.customer;

    customer.set({
      id:         HermesApp.randomStringGenerator(10, "1234567890"),
      name:       "Customer-" + (HermesApp.randomStringGenerator(7, "1234567890")),
      created_at: now,
      updated_at: now
    });

    customers.add(customer);
    return customer.save();
  }
};
