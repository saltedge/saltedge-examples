HermesApp.Views.Transaction = HermesApp.ItemView.extend({
  template: "#transaction-template",
  tagName:  "tr",

  serializeData: function() {
    return this.modelAttributes({
      amount: (this.model.get('amount')) + " " + (this.model.get('currency_code'))
    });
  },

  onShow: function() {
    if (this.model.get("status") === "pending") {
      return this.$el.addClass("pending");
    }
  }
});
