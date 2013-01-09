// Entry Model
// ==============

define(["jquery", "backbone"], function($, Backbone) {
    var EntryModel = Backbone.Model.extend({
        initialize: function() {
            console.log("Init EntryModel");
            console.log("entry="+this.get("entry").fullPath);
        }
    });

    return EntryModel;
});
