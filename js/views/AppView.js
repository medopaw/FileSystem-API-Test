// App View
// =============

define(["jquery", "backbone", "utils", "models/AppModel", "models/EntryModel", "views/EntriesView"], function($, Backbone, Utils, AppModel, EntryModel, EntriesView) {

    var AppView = Backbone.View.extend( {

        templates: {
            header: function(dir) {
                return _.template($("script#header-template").html(), {dir: dir})
            },
            footer: _.template($("script#footer-template").html())
        },

        events: {
            "tap #up-button": "onTapUpButton",
            "tap #edit-button": "onTapEditButton",
            "tap #copy-button": "onTapCopyButton",
            "tap #cut-button": "onTapCutButton",
            "tap #paste-button": "onTapPasteButton",
            "tap #delete-button": "onTapDeleteButton",
            "taphold": "onTaphold"
        },

        initialize: function() {
            console.log("Init AppView");
            this.entriesView = new EntriesView({
                el: "#entries",
                owner: this
            });
            this.model = new AppModel({mode: "Browse"});
            // dirEntry must be set after event binding
            this.model.on("change:dirEntry", this.setupPage, this);
            this.model.on("change:mode", this.changeMode, this);
            // this.model.set("dirEntry", navigator.mozSDCard.root);
        },

        render: function() {
            console.log("Render Appview");
            this.$el.find("#header").html(this.templates.header(this.model.get("dirEntry"))).trigger("create");
            // console.log(this.templates.edit.toString());
            this.$el.find("#footer").html(this.templates.footer()).trigger("create");
            // this.$el.find("#footer").html(_.template($("script#edit-template").html())).trigger("create");
            /* var $div = $("div");
            $div.html($("script#edit-template").html());
            this.$el.find("#edit").append($div); */
            return this;
        },

        onTapUpButton: function() {
            console.log("In goUpDir()");
            if (this.model.get("mode") == "Edit") {
                return;
            }
            var dirEntry = this.model.get("dirEntry"), that = this;
            dirEntry.getParent(function(result) {
                that.model.set("dirEntry", result);
            }, Utils.errorHandler);
        },

        onTapEditButton: function(e) {
            this.onTaphold(e);
        },

        onTapCopyButton: function() {
            Utils.refreshClipboard(this.entriesView.collection);
            Utils.clipboard.action = "Copy";
            this.model.set("mode", "Browse");
        },

        onTapCutButton: function() {
            Utils.refreshClipboard(this.entriesView.collection);
            Utils.clipboard.action = "Move";
            this.model.set("mode", "Browse");
        },

        onTapPasteButton: function() {
            var entriesCollection = this.entriesView.collection, clipboard = Utils.clipboard;
            var that = this, parentDirEntry = this.model.get("dirEntry");
            console.log(clipboard.length + " entries in clipboard");
            var successHandler = function(result) {
                // current dir may have changed
                if (that.model.get("dirEntry").fullPath == parentDirEntry.fullPath) {
                    var entryModel = new EntryModel({entry: result});
                    entriesCollection.add(entryModel);
                }
            };
            for (var i = 0; i < clipboard.length; i++) {
                console.log(clipboard.action);
                switch (clipboard.action) {
                    case "Copy": {
                        clipboard[i].copyTo(parentDirEntry, undefined, successHandler, Utils.errorHandler);
                        break;
                    }
                    case "Move": {
                        clipboard[i].moveTo(parentDirEntry, undefined, successHandler, Utils.errorHandler);
                        break;
                    }
                    default: {
                    }
                }
            }
            clipboard = [];
            clipboard.action = null;
            this.model.set("mode", "Browse");
        },

        onTapDeleteButton: function() {
           // var trash = [];
           var entriesCollection = this.entriesView.collection;
           entriesCollection.each(function(entryModel) {
               if (entryModel.get("selected")) {
                   var entry = entryModel.get("entry");
                   if (entry.isDirectory) {
                       entry.removeRecursively(function() {
                           console.log("Dir removed");
                           // entryModel.destroy();
                           // trash.push(entryModel);
                           entriesCollection.remove(entryModel);
                       }, Utils.errorHandler);
                   } else {
                       entry.remove(function() {
                           console.log("File removed");
                           // entryModel.destroy();
                           // trash.push(entryModel);
                           entriesCollection.remove(entryModel);
                       }, Utils.errorHandler);
                   }
               }
           }, this);
           this.model.set("mode", "Browse");
        },

        onTaphold: function(e) {
            console.log('Trigger taphold event');
            e.stopPropagation();
            switch (this.model.get("mode")) {
                case "Edit": {
                    this.model.set("mode", "Browse");
                    break;
                }
                case "Browse":
                default: {
                    this.model.set("mode", "Edit");
                    break;
                }
            }
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
                var entries = [];
                for (var i = 0; i < results.length; i++) {
                    entries.push(results.item(i));
                }
                that.entriesView.collection.setEntries(entries);
            }, Utils.errorHandler);
        },

        changeMode: function() {
            switch (this.model.get("mode")) {
                case "Edit": {
                    this.$el.find("#footer").slideToggle();
                    break;
                }
                case "Browse": {
                    this.$el.find("#footer").slideToggle();
                    this.entriesView.collection.each(function(entryModel) {
                        if (entryModel.get("selected")) {
                            entryModel.set("selected", false);
                            Utils.switchTheme(entryModel.view.$el, "b", "c");
                        }
                    }, this);
                    break;
                }
                default: {
                }
            }
        }
    });

    return AppView;

});
