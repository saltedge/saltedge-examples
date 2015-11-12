HermesApp.Views.TransactionShow = HermesApp.ItemView.extend({
  template: "#transaction-show-template",

  serializeData: function() {
    return this.modelAttributes({
      created_at: HermesApp.dateTimeFormat(this.model.get("created_at")),
      updated_at: HermesApp.dateTimeFormat(this.model.get("updated_at"))
    });
  }
});
