﻿<%@ WebHandler Language="C#" Class="NewsHandler" %>

using System;
using System.Web;


using ZJGIS.Model.News;
using ZJGIS.Model.Common;

public class NewsHandler : IHttpHandler {

    private ZJGIS.Model.News.NewsDB db = new ZJGIS.Model.News.NewsDB();
    
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
            this.InsertNews(context);
        }
        else if (type == "querytopnews")
        {
            this.QueryTopNews(context);
        }
        else if (type == "querybyid")
        {
            this.QueryNewsByID(context);
        }
        else if (type == "update")
        {
            this.UpdateNews(context);
        }
    }


    public void InsertNews(HttpContext context)
    {
        string title = context.Request["title"];
        string author = context.Request["author"];
        string html = context.Request["html"];

        News news = new News();
        news.TITLE = title;
        news.CONTENT = html;
        news.PEOPLE = author;

        db.InsertNews(news);

        string result = "{success:true}";
        context.Response.Write(result);
        
        
    }

    public void UpdateNews(HttpContext context)
    {
        string title = context.Request["title"];
        string author = context.Request["author"];
        string html = context.Request["html"];

        string id = context.Request["id"];
        int nID = int.Parse(id); 

        News news = new News();
        news.TITLE = title;
        news.CONTENT = html;
        news.PEOPLE = author;

        db.UpdateNews(nID,news);

        string result = "{success:true}";
        context.Response.Write(result);


    }

    public void QueryNewsByID(HttpContext context)
    {
        string idStr = context.Request["ID"];
        int id = int.Parse(idStr);

        News news = this.db.ReadNewsByID(id);

        Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();


        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        System.IO.StringWriter sw = new System.IO.StringWriter(sb);

        using (Newtonsoft.Json.JsonWriter jsonWriter = new Newtonsoft.Json.JsonTextWriter(sw))
        {
            serializer.Serialize(jsonWriter, news);
            string strResult = sb.ToString();
            context.Response.Write(strResult);
        }
    }

    public void QueryTopNews(HttpContext context )
    {
        int top = 5;
        string topStr = context.Request["top"];
        if (!string.IsNullOrEmpty(topStr))
        {
            top = int.Parse(topStr);
        }
        QueryResultSet<News> news = db.QueryTopNewsTitle(top);

        Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();


        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        System.IO.StringWriter sw = new System.IO.StringWriter(sb);

        using (Newtonsoft.Json.JsonWriter jsonWriter = new Newtonsoft.Json.JsonTextWriter(sw))
        {
            serializer.Serialize( jsonWriter, news);
            string strResult = sb.ToString();
            context.Response.Write(strResult);
        }

        
      
        
        
        //return news;
    }
    
    

    
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}