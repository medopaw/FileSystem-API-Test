// App View
// =============

// Includes file dependencies
define([ "jquery", "backbone", "utils", "models/AppModel", "views/EntriesView" ], function($, Backbone, Utils, AppModel, EntriesView) {

    // Extends Backbone.View
    var AppView = Backbone.View.extend( {

        el:$("#home"),

        templates: {
            header: function(dir) {
                return _.template($("script#header-template").html(), {dir: dir})
            }
        },

        events: {
            "click #up-button": "goUpDir"
        },

        initialize: function() {
            console.log("Init AppView");
            this.entriesView = new EntriesView();
            this.entriesView.owner = this;
            this.model = new AppModel();
            // dirEntry must be set after event binding
            this.model.on("change:dirEntry", this.setupPage, this);
            this.model.set("dirEntry", navigator.mozSDCard.root);
        },

        render: function() {
            this.$el.find("#header").html(this.templates.header(this.model.get("dirEntry")));
            return this;
        },

        goUpDir: function() {
            console.log("In goUpDir()");
            var dirEntry = this.model.get("dirEntry"), that = this;
            dirEntry.getParent(function(result) {
                that.model.set("dirEntry", result);
            });
        },

        setupPage: function() {
            console.log("In setupPage()");
            var dirEntry = this.model.get("dirEntry");
            if (!dirEntry) return;

            console.log("Setup page to "+dirEntry.fullPath);
            this.render();
            // console.log(this.entriesView);
            var that = this;
            dirEntry.createReader().readEntries(function(results) {
                that.entriesView.collection.setEntries(results);
            });
        }
    });

    return AppView;
});
