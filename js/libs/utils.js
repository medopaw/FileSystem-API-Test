// Utils
// =============

define([], function() {

   var Utils = {
       errorHandler: function() {
           var msg = 'whatever';
           alert('Error: ' + msg);
       },

       switchTheme: function($el, x, y) {
           // console.log($el.jqmData("theme")+$el.attr("data-theme"));
           // switch($el.jqmData("theme")) {
           switch($el.attr("data-theme")) {
               case x: {
                   $el.attr("data-theme", y).removeClass("ui-btn-hover-" + x).addClass("ui-btn-hover-" + y).removeClass("ui-btn-up-" + x).addClass("ui-btn-up-" + y);
                   break;
               }
               case y: {
                   $el.attr("data-theme", x).removeClass("ui-btn-hover-" + y).addClass("ui-btn-hover-" + x).removeClass("ui-btn-up-" + y).addClass("ui-btn-up-" + x);
                   break;
               }
               default: {
               }
           }
       },

       refreshClipboard: function(collection) {
           this.clipboard = [];
           collection.each(function(entryModel) {
               if (entryModel.get("selected")) {
                   this.clipboard.push(entryModel.get("entry"));
               }
           }, this);
       }
   };

   return Utils;

});
