using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;

namespace MemoryBattle.Models
{
    public class Game
    {
        public int Tiles { get; set; }
        public string Player { get; set; }
        public JArray Images { get; set; }
    }
}