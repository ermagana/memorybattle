using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Mvc;
using MemoryBattle.Extensions;
using MemoryBattle.Hubs;
using MemoryBattle.Models;
using Newtonsoft.Json.Linq;

namespace MemoryBattle.Controllers
{
    public class GameController : ApiController
    {
        // GET api/game
        public Game Get()
        {
            var clientIP = Request.GetClientIpAddress();
            lock (Game.DB)
            {
                if (!Game.DB.ContainsKey(clientIP))
                {
                    Game.DB.Add(clientIP, new Game { Player = clientIP, Images = new Image[0], Tiles = 4 });
                }
                return Game.DB[clientIP];
            }
        }
    }
}
