using Owin;
using Microsoft.Owin;

namespace MemoryBattle
{
    public class StartUp
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }
    }
}