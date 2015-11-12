HermesApp.Views.ConfirmModal = HermesApp.Views.Modal.extend({
  template: "#confirm-modal-template",

  ui: function() {
    return _.extend(HermesApp.Views.Modal.prototype.ui.apply(this, arguments), {
      confirm: ".js-confirm"
    });
  },

  events: function() {
    return _.extend(HermesApp.Views.Modal.prototype.events.apply(this, arguments), {
      "click .js-confirm": "onConfirmClick"
    });
  },

  initialize: function(options) {
    HermesApp.Views.Modal.prototype.initialize.apply(this, arguments);
    this.action       = options.action;
    this.title        = options.title || "";
    this.confirmation = options.confirmation || "";
    return HermesApp.layout.dialog.show(this);
  },

  serializeData: function() {
    return {
      title: this.title,
      confirmation: this.confirmation
    };
  },

  onConfirmClick: function(event) {
    if (event != null) {
      event.preventDefault();
    }
    this.ui.dialog.modal("hide");
    this.action();
    return this.destroy();
  },

  dispatchKeypress: function(event) {
    event.preventDefault();

    if (event.keyCode === this.ENTER_KEY) {
      return this.ui.confirm.click();
    }
    if (event.keyCode === this.ESCAPE_KEY) {
      return this.ui.cancel.click();
    }
    return true;
  }
});

