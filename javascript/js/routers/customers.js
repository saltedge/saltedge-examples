HermesApp.Routers.Customers = HermesApp.Routers.Main.extend({
  routes: {
    "customers/:id": "show"
  },

  show: function(id) {
    var model, view;
    model = HermesApp.Data.customer;
    this.title(model.get('name'));

    view = new HermesApp.Views.CustomerShow({
      model: model
    });
    return HermesApp.layout.content.show(view);
  }
});
