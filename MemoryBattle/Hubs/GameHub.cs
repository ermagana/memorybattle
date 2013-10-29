using MemoryBattle.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using MemoryBattle.Extensions;

namespace MemoryBattle.Hubs
{
    [HubName("game")]
    public class GameHub : Hub {
        public void GameUpdate(Game game)
        {
            var clientIP = Context.Request.GetClientIpAddress();
            lock (Game.DB)
            {
                Game.DB[clientIP] = game;
                if (game.Tiles == 0)
                    Game.DB.Remove(clientIP);
            }
            Clients.Others.challengersUpdate(game);
        }

        public void UpStack(int increment)
        {
            Clients.Others.increaseStack(increment);
        }
    }
}