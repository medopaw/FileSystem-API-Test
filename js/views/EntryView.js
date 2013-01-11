// Entry View
// =============

// Includes file dependencies
define(["jquery", "backbone", "utils", "models/EntryModel"], function($, Backbone, Utils, EntryModel) {

    var EntryView = Backbone.View.extend( {

        tagName: "li",

        template: function(entry) {
            return _.template($("script#entry-template").html(), {entry: entry});
        },

        events: {
            "tap": "onTap" // not "click"
        },

        onTap: function(e) {
            // console.log('Trigger tap event on '+this.model.get("entry").name);
            var appView = this.owner.owner, entry = this.model.get("entry");
            switch (appView.model.get("mode")) {
                case "Edit": {
                    console.log("In edit mode");
                    // this.$el.jqmData("theme", "e");
                    // this.$el.attr("data-theme", "b").removeClass("ui-btn-hover-c").addClass("ui-btn-hover-b").removeClass("ui-btn-up-c").addClass("ui-btn-up-b");//.trigger("create");
                    this.model.set("selected", !this.model.get("selected"));
                    Utils.switchTheme(this.$el, "b", "c");
                    break;
                }
                case "Browse":
                default: {
                    if (entry.isDirectory) {
                        var appView = this.owner.owner;
                        appView.model.set("dirEntry", this.model.get("entry"));
                    }
                }
            }
       },

       initialize: function(options) {
            console.log("Init EntryView");
            this.owner = options.owner;
            this.model.on("change:entry", this.render, this);
            var that = this; // weird. can't use this.remove directly
            this.model.on("remove", function() {
                that.remove();
            });
            this.model.view = this;
        },

        render: function() {
            console.log("Render EntryView");
            var $el = this.$el, entry = this.model.get("entry");
            $el.html(this.template(entry));//.data("kind", entry.isDirectory ? "Directory" : "File");
            if (!entry.isDirectory) {
                $el.jqmData("icon", false);
            }
            // console.log(this.$el.data("kind"));
            entry.getMetadata(function(metadata) {
                console.log(entry.fullPath+" metadata:"+metadata.size+", "+metadata.modificationTime);
                // console.log(isNaN(metadata.size));
                $el.find("p").html(metadata.modificationTime.formatString("YYYY-0MM-0DD 0hh:0mm") + (entry.isDirectory ? "" : "<span>%0</span>".format(Utils.prettifySize(metadata.size))));
            }, Utils.errorHandler);
            return this;
        },
    });

    return EntryView;

});
