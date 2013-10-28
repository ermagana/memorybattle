using System.Collections.Generic;
using System.Web.Http;
using System.Web.Mvc;
using MemoryBattle.Extensions;
using MemoryBattle.Models;
using Newtonsoft.Json.Linq;

namespace MemoryBattle.Controllers
{
    public class GameController : ApiController
    {
        private static Dictionary<string, Game> state = new Dictionary<string, Game>();
        // GET api/game
        public Game Get()
        {
            var clientIP = Request.GetClientIpAddress();
            if (!state.ContainsKey(clientIP))
            {
                state.Add(clientIP, new Game { Player = clientIP, Images = new JArray(), Tiles = 4 });
            }
            return state[clientIP];
        }

    }
}
