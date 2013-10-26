define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    //Note: This module exports an object.
    //That means that every module that "requires" it will get the same object instance.
    //If you wish to be able to create multiple instances, instead export a function.
    //See the "welcome" module for an example of function export.

    return {
        images: [],
        activate: function () {
            //the router's activator calls this function and waits for it to complete before proceding
            if (this.images.length > 0) {
                return;
            }

            var that = this;
            return http.jsonp('http://api.flickr.com/services/feeds/photos_public.gne',
                    { /*tags: 'mount ranier', tagmode: 'any',*/ format: 'json' },'jsoncallback')
                .then(function(response) {
                    var inUse = $.map(response.items.slice(0,4),
                                            function(ele, idx){
                                                ele.show = false;
                                                return ele;
                                            });
                     that.images = inUse;
                });
        },
        select: function(item) {
            item.show = !item.show;
        },
        canDeactivate: function () {
            //the router's activator calls this function to see if it can leave the screen
            return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
        }
    };
});