HermesApp.Routers.Main = Backbone.Router.extend({
  initialize: function(options) {
    Backbone.Router.prototype.initialize.apply(this, arguments);
    return this.customer = HermesApp.Data.customer;
  },

  title: function(name) {
    return document.title = name + " | " + HermesApp.Config.applicationTitle;
  },

  getAllData: function() {
    HermesApp.Data.logins = this.customer.getEntities(HermesApp.Models.Customer.LOGINS);
    HermesApp.Data.accounts = this.customer.getEntities(HermesApp.Models.Customer.ACCOUNTS);
    return HermesApp.Data.transactions = this.customer.getEntities(HermesApp.Models.Customer.TRANSACTIONS);
  },

  getCollection: function(entities) {
    var originalLength, entitiesLength;
    originalLength = this.customer.get(entities).length;
    entitiesLength = HermesApp.Data[entities].length;

    if (entitiesLength === 0 || entitiesLength < originalLength) {
      this.getAllData();
      return HermesApp.Data[entities];
    }
    else {
      return HermesApp.Data[entities];
    }
  }
});

HermesApp.Routers.Main.add = function(routers) {
  var klass, name, results;
  results = [];

  for (name in routers) {
    klass = routers[name];
    if (name === "Main") {
      continue;
    }
    results.push(new klass());
  }

  return results;
};
