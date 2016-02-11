HermesApp.Models.Customer = HermesApp.Model.extend({

  getEntities: function(entities) {
    return new HermesApp.Collections[_.capitalize(entities)](this.get(entities));
  },

  getCustomerId: function() {
    var identifier, params;
    identifier = HermesApp.randomStringGenerator(21);

    this.set({
      identifier: identifier
    });

    params = {
      data: {
        identifier: identifier
      }
    };

    return Backbone.$.ajax({
      headers: {
        "App-secret": localStorage.getItem("app_secret")
      },
      url:  HermesApp.Data.saltedgeBaseUrl + "/api/v3/customers",
      type: "POST",
      data: JSON.stringify(params)
    });
  },

  createToken: function() {
    var customerId, params, returnTo;
    customerId = this.get("secret");
    returnTo = "/dashboard";

    this.set({
      return_to: returnTo
    });

    if (!customerId) {
      return alert("Error! There is no customer id!");
    }

    params = {
      data: {
        secret: customerId,
        fetch_type: "recent",
        return_to: "" + HermesApp.Config.applicationUrl + returnTo,
        javascript_callback_type: "post_message"
      }
    };

    return Backbone.$.ajax({
      headers: {
        "App-secret": localStorage.getItem("app_secret")
      },
      url:  HermesApp.Data.saltedgeBaseUrl + "/api/v3/tokens/create",
      type: "POST",
      data: JSON.stringify(params)
    });
  },

  removeCustomer: function() {
    var params;
    params = {
      data: {
        secret: this.get("secret")
      }
    };

    return Backbone.$.ajax({
      headers: {
        "Service-secret": localStorage.getItem("service_secret")
      },
      url:  HermesApp.Data.saltedgeBaseUrl + "/api/v3/customers",
      type: "DELETE",
      data: JSON.stringify(params)
    });
  }
});
