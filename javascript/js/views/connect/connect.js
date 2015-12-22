HermesApp.Views.Connect = HermesApp.ItemView.extend({
  template: "#connect-template",
  CANCEL: "cancel",

  ui: {
    frame: "#connect-iframe"
  },

  initialize: function(options) {
    this.model = HermesApp.Data.customer;
    this.source = this.model.get("_src");
    return Backbone.$(window).on("message", this.onMessageEvent.bind(this));
  },

  onShow: function() {
    if (this.source) {
      return this.ui.frame.attr("src", this.source);
    } else {
      this.ui.frame.remove();
      return HermesApp.redirect("/dashboard");
    }
  },

  onDestroy: function() {
    return Backbone.$(window).off("message");
  },

  onMessageEvent: function(event, data) {
    var message, view;

    if (event.data !== this.CANCEL) {
      this.login = new HermesApp.Models.Login();
      if (event.originalEvent.data === this.CANCEL) {
        return HermesApp.redirect("/dashboard");
      }
      data = JSON.parse(event.originalEvent.data).data;

      if (data.state === "error") {
        message = "Error! Duplicated login";
        view = new HermesApp.Views.Message({
          success: false,
          message: message
        });
        return HermesApp.layout.message.show(view);
      }

      this.login.set({
        customer_id:         HermesApp.Data.customer.get("customer_id"),
        id:                  data.login_id,
        secret:              data.secret,
        state:               data.state,
        customer_identifier: HermesApp.Data.customer.get("identifier")
      });

      if (!HermesApp.Data.logins.get(this.login.id)) {
        HermesApp.Data.logins.add(this.login);
      }

      HermesApp.Data.customer.set({
        logins_count: HermesApp.Data.logins.length,
        logins: this.setLogins(this.login),
        _src: ""
      });
      HermesApp.Data.customer.save();
    }

    HermesApp.redirect(HermesApp.Data.customer.get("return_to"));
    if (event.data !== this.CANCEL) {
      return HermesApp.Data.customer.trigger("login:fetched", this.login);
    }
  },

  setLogins: function(login) {
    var foundLogin, logins;
    logins = this.model.getEntities(HermesApp.Models.Customer.LOGINS).models;
    if (logins.length > 0) {
      foundLogin = _.find(logins, function(model) {
        return model.id === login.id;
      });
    }
    if (foundLogin) {
      return logins;
    }
    logins.push(login);
    HermesApp.Data.logins.reset(logins);
    return logins;
  }
});

