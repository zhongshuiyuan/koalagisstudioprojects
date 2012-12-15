<%@ WebHandler Language="C#" Class="DemoHandler" %>

using System;
using System.Web;


using ZJGIS.Model.Demos;
using ZJGIS.Model.Common;

public class DemoHandler : IHttpHandler {

    private ZJGIS.Model.Demos.DemosDB db = new ZJGIS.Model.Demos.DemosDB();
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
       
        string type = context.Request["request"];
        if (type == null)
        {
            context.Response.Write("{success:false,description:'no request params!'}");

            return;
        }

        type = type.ToLower();
        
        if (type.ToLower() == "insert")
        {
            this.InsertDemos(context);
        }
        else if (type == "querytopdemos")
        {
            this.QueryTopDemos(context);
        }
        else if (type == "update")
        {
            this.UpdateDemos(context);
        }
        else if (type == "querybyid")
        {
            this.QueryDemoByID(context);
        }
        else if (type == "delete")
        {
        }
    }


    public void InsertDemos(HttpContext context)
    {
        string title = context.Request["title"];
        string author = context.Request["author"];
        string html = context.Request["html"];
        string url = context.Request["url"];
        string thumbnail = context.Request["thumbnail"];

        Demo news = new Demo();
        news.TITLE = title;
        news.CONTENT = html;
        news.AUTHOR = author;
        news.APPURL = url;
        news.THUMBNAIL = thumbnail;

        db.InsertDemo(news);

        string result = "{success:true}";
        context.Response.Write(result);
        
        
    }

    public void UpdateDemos(HttpContext context)
    {
        string title = context.Request["title"];
        string author = context.Request["author"];
        string html = context.Request["html"];
        string url = context.Request["url"];
        string thumbnail = context.Request["thumbnail"];
        
        string id = context.Request["id"];
        int nID = int.Parse(id);

        Demo news = new Demo();
        news.TITLE = title;
        news.CONTENT = html;
        news.AUTHOR = author;
        news.APPURL = url;
        news.THUMBNAIL = thumbnail;

        db.UpdateDemo( nID, news);

        string result = "{success:true}";
        context.Response.Write(result);


    }

    public void DeleteDemoByID(HttpContext context)
    {

        string id = context.Request["id"];
        int nID = int.Parse(id);

        db.DeleteDemoByID(nID);

        string result = "{success:true}";
        context.Response.Write(result);
    }


    public void QueryDemoByID(HttpContext context)
    {
        string idStr = context.Request["ID"];
        int id = int.Parse( idStr);
        
        Demo demo = this.db.ReadDemoByID(id);

        Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();


        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        System.IO.StringWriter sw = new System.IO.StringWriter(sb);

        using (Newtonsoft.Json.JsonWriter jsonWriter = new Newtonsoft.Json.JsonTextWriter(sw))
        {
            serializer.Serialize(jsonWriter, demo);
            string strResult = sb.ToString();
            context.Response.Write(strResult);
        }
    }
    
    public void QueryTopDemos(HttpContext context )
    {
        int top = 5;
        string topStr = context.Request["top"];
        if (!string.IsNullOrEmpty(topStr))
        {
            top = int.Parse(topStr);
        }
        QueryResultSet<Demo> news = db.QueryTopDemos(top);

        Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();


        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        System.IO.StringWriter sw = new System.IO.StringWriter(sb);

        using (Newtonsoft.Json.JsonWriter jsonWriter = new Newtonsoft.Json.JsonTextWriter(sw))
        {
            serializer.Serialize( jsonWriter, news);
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