// Entry Collection
// ===================

define(["jquery", "backbone", "models/EntryModel"], function($, Backbone, EntryModel) {

    var EntriesCollection = Backbone.Collection.extend({

        initialize: function() {
            console.log("Init EntriesCollection");
        },

        model: EntryModel,

        setEntries: function(entries) {
            var modelList = [];
            $.each(entries, function(i, e) {
                var entryModel = new EntryModel({entry: e});
                // console.log(entryModel.get("entry"));
                modelList.push(entryModel);
            });
            this.reset(modelList);
        }
    });

    return EntriesCollection;

});
