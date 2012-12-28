// Entries View
// =============

define(["jquery", "backbone", "collections/EntriesCollection", "views/EntryView"], function($, Backbone, EntriesCollection, EntryView) {
    var EntriesView = Backbone.View.extend( {

        el:$("#entries"),

        initialize: function() {
            console.log("Init EntriesView");
            this.collection = new EntriesCollection();
            this.collection.on("reset", this.render, this);
            this.collection.on("add", this.addOne, this);

        },

        render: function() {
            this.$el.empty();
            this.collection.each(this.addOne, this);
            return this;
        },

        addOne: function(entryModel) {
            var view = new EntryView({model: entryModel});
            view.owner = this;
            this.$el.append(view.render().$el);
        }
    });

    return EntriesView;
});
