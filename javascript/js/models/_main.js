HermesApp.Model = Backbone.Model.extend({});

HermesApp.Model.defineConstants = function (name, values) {
  var i, len, results, value;
  this[name.toUpperCase()] = values;
  results = [];

  for (i = 0, len = values.length; i < len; i++) {
    value = values[i];
    results.push(this[value.toUpperCase()] = value);
  }
  return results;
};
