HermesApp.Views.MainInfo = HermesApp.Views.ConfirmModal.extend({
  template: "#main-info-template",

  ui: function() {
    return _.extend(HermesApp.Views.ConfirmModal.prototype.ui.apply(this, arguments), {
      client_id: "#client-id",
      app_secret: "#app-secret",
      service_secret: "#service-secret"
    });
  },

  onDomRefresh: function() {
    return this.ui.client_id.focus();
  },

  onRender: function() {
    this.ui.dialog.modal({
      keyboard: false
    });
    return this.ui.dialog.on("hide.bs.modal", (function(_this) {
      return function() {
        return _this.destroy();
      };
    })(this));
  },

  onConfirmClick: function(event) {
    if (event != null) {
      event.preventDefault();
    }
    localStorage.setItem("client_id", this.ui.client_id.val());
    localStorage.setItem("app_secret", this.ui.app_secret.val());
    localStorage.setItem("service_secret", this.ui.service_secret.val());
    this.ui.dialog.modal("hide");
    this.action();
    return this.destroy();
  }
});
