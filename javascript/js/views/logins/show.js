HermesApp.Views.LoginShow = HermesApp.ItemView.extend({
  template: "#login-show-template",

  serializeData: function() {
    return this.modelAttributes({
      accounts_count:           HermesApp.Data.accounts.where({login_id: this.model.id}).length || 0,
      last_fail_message:        this.model.get("last_fail_message") || "-",
      last_fail_at:             HermesApp.dateTimeFormat(this.model.get("last_fail_at")) || "-",
      last_request_at:          HermesApp.dateTimeFormat(this.model.get("last_request_at")) || "-",
      last_success_at:          HermesApp.dateTimeFormat(this.model.get("last_success_at")) || "-",
      next_refresh_possible_at: HermesApp.dateTimeFormat(this.model.get("next_refresh_possible_at")) || "-",
      created_at:               HermesApp.dateTimeFormat(this.model.get("created_at")),
      updated_at:               HermesApp.dateTimeFormat(this.model.get("updated_at"))
    });
  }
});
