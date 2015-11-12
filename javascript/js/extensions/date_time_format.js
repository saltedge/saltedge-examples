HermesApp.dateTimeFormat = function(date) {
  if (!date) {
    return;
  }
  return moment(date).format(HermesApp.Config.dateTimeFormat);
};
