using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MemoryBattle.Models
{
    public class Image
    {
        public string title { get; set; }
        public string description { get; set; }
        public string link { get; set; }
        public Media media { get; set; }
        public DateTime date_taken { get; set; }
        public DateTime published { get; set; }
        public string author { get; set; }
        public string author_id { get; set; }
        public string tags { get; set; }
        public bool show { get; set; }
    }

    public class Media
    {
        public string m { get; set; }
    }
}