Backbone.$.ajaxSetup({
  dataType:    "json",
  contentType: "application/json",
  beforeSend:  function(jqXHR) {
    jqXHR.setRequestHeader("Accept", "application/json");
    jqXHR.setRequestHeader("Content-Type", "application/json");
    jqXHR.setRequestHeader("Customer-Secret", HermesApp.Data.customer.get("secret"));
    return jqXHR.setRequestHeader("Client-id", localStorage.getItem("client_id"));
  }
});
