using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;

namespace MemoryBattle.Models
{
    public class Game
    {
        public static Dictionary<string, Game> DB = new Dictionary<string, Game>();

        public int Tiles { get; set; }
        public string Ip { get; set; }
        public string Player { get; set; }
        public Image[] Images { get; set; }
    }
}