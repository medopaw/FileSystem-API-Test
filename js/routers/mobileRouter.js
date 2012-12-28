// Mobile Router
// =============

// Includes file dependencies
define(["jquery","backbone", "views/AppView"], function($, Backbone, AppView) {

    // Extends Backbone.Router
    var MobileRouter = Backbone.Router.extend( {

        // The Router constructor
        initialize: function() {
            console.log("Init MobileRouter");
/*
            // Instantiates a new Animal Category View
            this.animalsView = new CategoryView( { el: "#animals", collection: new CategoriesCollection( [] , { type: "animals" } ) } );

            // Instantiates a new Colors Category View
            this.colorsView = new CategoryView( { el: "#colors", collection: new CategoriesCollection( [] , { type: "colors" } ) } );

            // Instantiates a new Vehicles Category View
            this.vehiclesView = new CategoryView( { el: "#vehicles", collection: new CategoriesCollection( [] , { type: "vehicles" } ) } );
*/
            // Tells Backbone to start watching for hashchange events
            this.appView = new AppView();
            // this.appView.model.set("dirEntry", navigator.mozSDCard.root);
            Backbone.history.start();

        },

        // Backbone.js Routes
        routes: {

            // When there is no hash bang on the url, the home method is called
            "": "home",

            // When #category? is on the url, the category method is called
            "help": "help"

        },

        // Home method
        home: function() {
            // Programatically changes to the categories page
            $.mobile.changePage( "#home" , { reverse: false, changeHash: false } );

        },

        // Help method
        help: function() {
/*
            // Stores the current Category View  inside of the currentView variable
            var currentView = this[ type + "View" ];

            // If there are no collections in the current Category View
            if(!currentView.collection.length) {

                // Show's the jQuery Mobile loading icon
                $.mobile.loading( "show" );

                // Fetches the Collection of Category Models for the current Category View
                currentView.collection.fetch().done( function() {

                    // Programatically changes to the current categories page
                    $.mobile.changePage( "#" + type, { reverse: false, changeHash: false } );
    
                } );

            }

            // If there already collections in the current Category View
            else {

                // Programatically changes to the current categories page
                $.mobile.changePage( "#" + type, { reverse: false, changeHash: false } );

            }

        */}

    } );

    // Returns the Router class
    return MobileRouter;

} );
