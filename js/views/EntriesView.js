// Entries View
// =============

define(["jquery", "backbone", "collections/EntriesCollection", "views/EntryView"], function($, Backbone, EntriesCollection, EntryView) {

    var EntriesView = Backbone.View.extend( {

        initialize: function(options) {
            console.log("Init EntriesView");
            this.owner = options.owner;
            this.collection = new EntriesCollection();
            this.collection.on("reset", this.render, this);
            this.collection.on("add", this.addOne, this);
            /* this.$el.listview({
                autodividers: true,
                autodividersSelector: function (li) {
                    return $(li).data("kind");
                }
            });*/
        },

        render: function() {
            console.log("Render EntriesView");
            this.$el.empty();
            this.collection.each(this.addOne, this);
            // this.$el.trigger("create");
            this.$el.listview("refresh"); // otherwise no jqm style for newly added item
            return this;
        },

        addOne: function(entryModel) {
            var view = new EntryView({
                model: entryModel,
                owner: this
            });
            this.$el.append(view.render().$el).listview("refresh");
        }
    });

    return EntriesView;

});
