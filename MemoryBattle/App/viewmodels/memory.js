define(['plugins/http', 'durandal/app', 'extensions/arrays', 'knockout', '/signalr/hubs'], function (http, app, ko) {
    //Note: This module exports an object.
    //That means that every module that "requires" it will get the same object instance.
    //If you wish to be able to create multiple instances, instead export a function.
    //See the "welcome" module for an example of function export.

    var ctx = function(){
        var that = this;
        that.game = {};
        that.challengers = [];
        var previousMatch;
        var gameHubProxy = $.connection.game;
        var gameID = $.connection.hub.id;

        gameHubProxy.client.challengersUpdate = function(game){
            var other = $.map(that.challengers, function(ele, idx){
                    if(game.Player === ele.Player){
                       return ele;
                   }
               })[0];
            if(other){
                $.extend(that.challengers[that.challengers.indexOf(other)], game);
             }else{
                that.challengers.push(game);
             }
        };

        gameHubProxy.client.increaseStack = function(increment){
            if(that.game.Tiles <= 0)
                return;
            that.game.Tiles += increment;
            updateTiles(increment);
        };

        that.activate = function () {
            //the router's activator calls this function and waits for it to complete before proceding
            return $.getJSON('/api/Game')
                .then(startGame);
        };

        function startGame (game){
            var tiles = game.Tiles - (game.Images.length > 0 ? game.Images.length / 2 : 0);
            that.game = game;

            $.connection.hub.logging = true;
            $.connection.hub.start();
            return updateTiles(tiles);
        }

        function updateTiles(tiles){
            var options = { tags: '', tagmode: 'any', format: 'json' };
            return http.jsonp('http://api.flickr.com/services/feeds/photos_public.gne', options ,'jsoncallback')
                .then(function(response) {
                var inUse = $.map(response.items.slice(0, tiles),
                    function(ele, idx){
                        ele.show = false;
                        return [ele, $.extend({}, ele)];
                    });
                that.game.Images = that.game.Images.concat(inUse).shuffle();
                previousMatch = $.map(that.game.Images, function(ele, idx){ if(ele.show) return ele;})[0];
                return updateState();
            });
        }

        that.select = function(item) {
            item.show = !item.show;
            if(previousMatch && previousMatch !== item){
                setTimeout(function()
                {
                    MatchAndUpdate.call(that, item);
                }, 250);
            }else if(item.show){
                previousMatch = item;
            }else{
                previousMatch = undefined;
            }
            updateState();
        };

        function updateState(){
            return gameHubProxy.server.gameUpdate(that.game);
        }

        function MatchAndUpdate(item){
            if(previousMatch.media.m === item.media.m){
                this.game.Tiles--;
                gameHubProxy.server.upStack(1);
                this.game.Images = $.map(this.game.Images, function(ele, idx){
                    if(ele.media.m !== item.media.m)
                        return ele;
                });
            }else{
                item.show = false;
               previousMatch.show = false;
            }
            previousMatch = undefined;
            updateState();
        }

        that.canDeactivate = function () {
            //the router's activator calls this function to see if it can leave the screen
            return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
        };
    };

    return ctx;
});