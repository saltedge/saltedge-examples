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

    return $.ajax({
      beforeSend: (function(_this) {
        return function(xhrObj) {
          xhrObj.setRequestHeader("Accept", "application/json");
          xhrObj.setRequestHeader("Content-Type", "application/json");
          xhrObj.setRequestHeader("Client-id", localStorage.getItem("client_id"));
          return xhrObj.setRequestHeader("App-secret", localStorage.getItem("app_secret"));
        };
      })(this),
      url: HermesApp.Data.saltedgeBaseUrl + "/api/v2/customers",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(params)
    });
  },

  createToken: function() {
    var customerId, params, returnTo;
    customerId = this.get("customer_id");
    returnTo = "/dashboard";
    this.set({
      return_to: returnTo
    });

    if (!customerId) {
      return alert("Error! There is no customer id!");
    }

    params = {
      data: {
        customer_id: customerId,
        fetch_type: "recent",
        return_to: "" + HermesApp.Config.applicationUrl + returnTo,
        javascript_callback_type: "post_message"
      }
    };

    return $.ajax({
      beforeSend: (function(_this) {
        return function(xhrObj) {
          xhrObj.setRequestHeader("Accept", "application/json");
          xhrObj.setRequestHeader("Content-Type", "application/json");
          xhrObj.setRequestHeader("Client-id", localStorage.getItem("client_id"));
          return xhrObj.setRequestHeader("App-secret", localStorage.getItem("app_secret"));
        };
      })(this),
      url: HermesApp.Data.saltedgeBaseUrl + "/api/v2/tokens/create",
      type: "POST",
      dataType: "json",
      data: JSON.stringify(params)
    });
  },

  removeCustomer: function() {
    var params;
    params = {
      data: {
        customer_id: this.get("customer_id")
      }
    };

    return $.ajax({
      beforeSend: (function(_this) {
        return function(xhrObj) {
          xhrObj.setRequestHeader("Accept", "application/json");
          xhrObj.setRequestHeader("Content-Type", "application/json");
          xhrObj.setRequestHeader("Client-id", localStorage.getItem("client_id"));
          return xhrObj.setRequestHeader("Service-secret", localStorage.getItem("service_secret"));
        };
      })(this),
      url: HermesApp.Data.saltedgeBaseUrl + "/api/v2/customers",
      type: "DELETE",
      data: JSON.stringify(params)
    });
  }
});
