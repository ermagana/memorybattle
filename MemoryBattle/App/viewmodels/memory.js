define(['plugins/http', 'durandal/app', 'knockout', 'extensions/arrays', '/signalr/hubs'],
    function (http, app, ko) {
    //Note: This module exports an object.
    //That means that every module that "requires" it will get the same object instance.
    //If you wish to be able to create multiple instances, instead export a function.
    //See the "welcome" module for an example of function export.

    var ctx = function(){
        var that = this;
        that.game = {};
        that.challengers = [];
        that.previousMatch = undefined;
        var gameHubProxy = $.connection.game;

        // SignalR listener for push changes from competitors
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

        // SignalR listener for push increases to our tile stack
        gameHubProxy.client.increaseStack = function(increment){
            if(that.game.Tiles <= 0)
                return;
            that.game.Tiles += increment;
            updateTiles(increment);
        };

        that.activate = function () {
            // make a call to the server to start the game
            return $.getJSON('/api/Game')
                .then(startGame);
        };

        that.select = function(item) {
            var pm = that.previousMatch;
            item.show = !item.show;
            if(pm && pm !== item){
                setTimeout(function()
                {
                    matchAndUpdate.call(that, item, pm);
                }, 1000);
                that.previousMatch = undefined;
            }else if(item.show){
                that.previousMatch = item;
            }else{
                that.previousMatch = undefined;
            }
            that.updateState();
        };

        that.updateState = function(){
            return gameHubProxy.server.gameUpdate(that.game);
        };

        function startGame (game){
            var tiles = game.Tiles - (game.Images.length > 0 ? game.Images.length / 2 : 0);
            that.game = game;
            // $.connection.hub.logging = true;
            $.connection.hub.start();
            return updateTiles(tiles);
        }

        function updateTiles(tiles){
            var flickr = 'http://api.flickr.com/services/feeds/photos_public.gne';
            var options = { tags: '', tagmode: 'any', format: 'json' };
            return http.jsonp(flickr, options ,'jsoncallback')
                .then(function(response) {
                    var usefulTiles = response.items.slice(0, tiles);
                    var tileSet = $.map(usefulTiles, makeDuplicate);
                    that.game.Images = that.game.Images.concat(tileSet).shuffle();
                    // this forces a full update otherwise there's jank
                    that.game = that.game;
                    that.previousMatch = $.map(that.game.Images, mapGetPreviousMatch)[0];
                    return that.updateState();
                });
        }

        function mapGetPreviousMatch(ele, idx){
           if(ele.show)
            return ele;
        }

        function makeDuplicate(ele, idx){
            ele.show = false;
            return [ele, $.extend({}, ele)];
        }

        function matchAndUpdate(item, previousMatch){
            if(previousMatch.media.m === item.media.m){
                this.game.Tiles--;
                // SignalR push to increase everyone else's stack by 1
                gameHubProxy.server.upStack(1);

                this.game.Images = $.map(this.game.Images, function(ele, idx){
                    if(ele.media.m !== item.media.m)
                        return ele;
                });
            }else{
                item.show = false;
                previousMatch.show = false;
            }
            this.updateState();
        }
    };

    return ctx;
});