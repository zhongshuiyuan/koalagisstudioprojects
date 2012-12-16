<%@ WebHandler Language="C#" Class="BikesHandler" %>

using System;
using System.Web;

using KoalaGIS.Models;

public class BikesHandler : IHttpHandler {

    private KoalaGIS.Models.BikesDB _db = new KoalaGIS.Models.BikesDB();
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        //context.Response.Write("Hello World");
        
        string request = context.Request["request"];
        if (string.IsNullOrEmpty(request))
        {
            context.Response.Write("{success:false,description:'没有请求参数'}");
            return;
        }

        request = request.ToLower().Trim();

        if (request == "querybikes")
        {
            this.QueryBikes(context);
        }
    }

    /// <summary>
    /// 分页查询全部自行车信息
    /// </summary>
    /// <param name="context"></param>
    public void QueryBikes(HttpContext context)
    {
        string strStart = context.Request["start"];
        string strPageSize = context.Request["pagesize"];

        int nStart = 0;
        int nPageSize = 25;

        if (!string.IsNullOrEmpty(strStart))
        {
            nStart = int.Parse(strStart);
        }

        if (!string.IsNullOrEmpty(strPageSize))
        {
            nPageSize = int.Parse(strPageSize);
        }

        QueryResultSet<BicycleInfo> results = this._db.QueryBikes(nStart, nPageSize);

        Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();


        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        System.IO.StringWriter sw = new System.IO.StringWriter(sb);

        using (Newtonsoft.Json.JsonWriter jsonWriter = new Newtonsoft.Json.JsonTextWriter(sw))
        {
            serializer.Serialize(jsonWriter, results);
            string strResult = sb.ToString();
            context.Response.Write(strResult);
        }
     
        
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}