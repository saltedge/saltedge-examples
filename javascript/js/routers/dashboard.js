HermesApp.Routers.Dashboard = HermesApp.Routers.Main.extend({
  routes: {
    "dashboard": "show"
  },

  show: function() {
    var view;
    this.title("Dashboard");

    view = new HermesApp.Views.Dashboard();
    return HermesApp.layout.content.show(view);
  }
});
