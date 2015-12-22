HermesApp.Routers.Connect = HermesApp.Routers.Main.extend({
  routes: {
    "connect": "connect"
  },

  connect: function() {
    var view;
    this.title("Connect");

    view = new HermesApp.Views.Connect();
    return HermesApp.layout.content.show(view);
  }
});
