// Mobile Router
// =============

define(["jquery","backbone", "utils", "views/AppView"], function($, Backbone, Utils, AppView) {
    var MobileRouter = Backbone.Router.extend( {

        initialize: function() {
            console.log("Init MobileRouter");
            // Tells Backbone to start watching for hashchange events
            this.appView = new AppView({el: "#home"});
            Backbone.history.start();

        },

        // Backbone.js Routes
        routes: {
            "": "home", // When there is no hash bang on the url, the home method is called
           "help": "help"
        },

        // Home method
        home: function() {
            console.log("Route to home");
            var appModel = this.appView.model;
            if (!appModel.get("dirEntry")) {
                appModel.set("dirEntry", navigator.mozSDCard.root);
            }
            $.mobile.changePage("#home", {
                reverse: false,
                changeHash: false
            });
        },

        // Help method
        help: function() {
        }
    });

    // Returns the Router class
    return MobileRouter;
});
