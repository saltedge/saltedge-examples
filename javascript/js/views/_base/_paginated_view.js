HermesApp.PaginatedView = HermesApp.CompositeView.extend({
  events: function() {
    return _.extend(HermesApp.CompositeView.prototype.events.apply(this, arguments), {
      "click .page": "paginateCollection"
    });
  },

  initialize: function(options) {
    this.originalCollection      = options.collection;
    this.perPage                 = HermesApp.Config.perPage;
    this.totalPages              = Math.ceil(this.originalCollection.length / this.perPage);
    this.currentPage             = this.originalCollection._current_page;
    this.collection              = this.originalCollection.clone();
    return this.slicedCollection = this.sliceCollection(this.collection.models);
  },

  serializeData: function() {
    return {
      pagination: this.pagination(this.originalCollection, this.pageUrl())
    };
  },

  onShow: function() {
    return this.paginateCollection();
  },

  pagination: function(collection, path) {
    template = _.template(Backbone.$("#pagination-template").html());

    return template({
      adjacents: 3,
      totalPages: this.totalPages,
      currentPage: this.currentPage,
      firstPage: 1,
      path: path
    });
  },

  pageUrl: function() {
    var url;
    url = this.collection.url;

    if (url.substr(url.length - 1) === "/") {
      return url + "%PAGE%";
    } else {
      return url + "/%PAGE%";
    }
  },

  paginateCollection: function(event) {
    if (event != null) {
      event.preventDefault();
    }
    return this.collection.reset(this.slicedCollection[this.currentPage - 1]);
  },

  sliceCollection: function(models) {
    var result;
    result = [];

    while (models.length) {
      result.push(models.splice(0, this.perPage));
    }

    return result;
  }
});

