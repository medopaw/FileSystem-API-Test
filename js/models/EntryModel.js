// Entry Model
// ==============

define([ "jquery", "backbone" ], function( $, Backbone ) {
    var EntryModel = Backbone.Model.extend({
        entry: null
    });

    return EntryModel;
} );
