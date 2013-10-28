define(['plugins/http', 'durandal/app', 'extensions/arrays', 'knockout'], function (http, app, ko) {
    //Note: This module exports an object.
    //That means that every module that "requires" it will get the same object instance.
    //If you wish to be able to create multiple instances, instead export a function.
    //See the "welcome" module for an example of function export.

    var ctx = function(){
        var that = this;
        that.game = {};
        that.previousMatch = undefined;

        that.activate = function () {
            //the router's activator calls this function and waits for it to complete before proceding
            return $.getJSON('/api/Game')
                .then(startGame);
        };

        function startGame (game){
            var tiles = game.Tiles;
            var options = { tags: '', tagmode: 'any', format: 'json' };
            return http.jsonp('http://api.flickr.com/services/feeds/photos_public.gne', options ,'jsoncallback')
                .then(function(response) {
                var inUse = $.map(response.items.slice(0, tiles),
                    function(ele, idx){
                        ele.show = false;
                        return [ele, $.extend({}, ele)];
                    });
                game.Images = game.Images.concat(inUse).shuffle();
                that.game = game;
            });
        }

        that.select = function(item) {
            item.show = !item.show;
            if(that.previousMatch && that.previousMatch !== item){
                setTimeout(function()
                {
                    MatchAndUpdate.call(that, item);
                }, 250);
            }else if(item.show){
                that.previousMatch = item;
            }else{
                that.previousMatch = undefined;
            }
        };

        function MatchAndUpdate(item){
            if(this.previousMatch.media.m === item.media.m){
                this.game.Images = $.map(this.game.Images, function(ele, idx){
                    if(ele.media.m !== item.media.m)
                        return ele;
                });
            }else{
                item.show = false;
                this.previousMatch.show = false;
            }
            this.previousMatch = undefined;
        }

        that.canDeactivate = function () {
            //the router's activator calls this function to see if it can leave the screen
            return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
        };
    };

    return ctx;
});