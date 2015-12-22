HermesApp.Views.Modal = HermesApp.ItemView.extend({
  template:   "#modal-template",
  ESCAPE_KEY: 27,
  ENTER_KEY:  13,

  ui: function() {
    return {
      dialog: ".modal",
      cancel: ".js-cancel"
    };
  },

  events: function() {
    return {
      "click a.js-dismiss": "dismiss"
    };
  },

  initialize: function(options) {
    var bind = function(fn, context) {
      return function(){
        return fn.apply(context, arguments);
      };
    };
    this.dispatchKeypress = bind(this.dispatchKeypress, this);

    return Backbone.$(document).keyup(this.dispatchKeypress);
  },

  serializeData: function() {
    return {
      title: this.getOption("title"),
      body:  this.getOption("body")
    };
  },

  onBeforeRender: function() {
    var ref;
    return (ref = document.activeElement) != null ? ref.blur() : void 0;
  },

  onRender: function() {
    this.ui.dialog.modal("show");
    return this.ui.dialog.on("hide.bs.modal", (function(_this) {
      return function() {
        return _this.destroy();
      };
    })(this));
  },

  onBeforeDestroy: function() {
    return Backbone.$(document).unbind("keyup", this.wrapperFunction);
  },

  onDestroy: function() {
    return this.ui.dialog.off("hide.bs.modal");
  },

  dismiss: function() {
    var ref;
    return (ref = this.ui.cancel) != null ? ref.click() : void 0;
  },

  dispatchKeypress: function(event) {
    event.preventDefault();

    if (event.keyCode === this.ESCAPE_KEY) {
      return this.dismiss();
    }
    if (event.keyCode === this.ENTER_KEY) {
      return this.dismiss();
    }
    return true;
  }
});
