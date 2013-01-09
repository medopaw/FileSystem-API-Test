// App Model
// ==============

define(["jquery", "backbone"], function($, Backbone) {

    var AppModel = Backbone.Model.extend({
        initialize: function() {
            console.log("Init AppModel");
        }
    });

    return AppModel;

});
