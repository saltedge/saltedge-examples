HermesApp.Collections.Customers = Backbone.Collection.extend({
  localStorage: new Backbone.LocalStorage("customers"),
  model:        HermesApp.Models.Customer
})
