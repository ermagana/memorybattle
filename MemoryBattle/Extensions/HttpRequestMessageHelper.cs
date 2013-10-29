using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.ServiceModel.Channels;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace MemoryBattle.Extensions
{
    /// <summary>
    /// helper provided by https://gist.github.com/MikeJansen/2653453
    /// </summary>
    public static class HttpRequestMessageHelper
    {
        public static string GetClientIpAddress(this IRequest request)
        {
            return request.GetHttpContext().Request.UserHostAddress;
        }

        public static string GetClientIpAddress(this HttpRequestMessage request)
        {
            if (request.Properties.ContainsKey("MS_HttpContext"))
            {
                return ((HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserHostAddress;
            }
            else if (request.Properties.ContainsKey(RemoteEndpointMessageProperty.Name))
            {
                RemoteEndpointMessageProperty prop;
                prop = (RemoteEndpointMessageProperty)request.Properties[RemoteEndpointMessageProperty.Name];
                return prop.Address;
            }
            else
            {
                return null;
            }
        }
    }
}