using System;
using System.Collections.Generic;

using System.Web;

using System.Data.OleDb;
using System.Data.SqlClient;

namespace ZJGIS.Model.News
{

    public class News
    {
        public News()
        {
            this.POSTTIME = DateTime.Now;
        }

        private int _id;
        public int ID { 
            get{return _id;}
            set{_id=value;}
        }

        private string _title;
        public string TITLE { 
            get { return _title; } 
            set { _title = value; } 
        }

        private string _content;
        public string CONTENT { get { return _content; } set { _content = value; } }

        private string _people;
        public string PEOPLE { get { return _people; } set { _people = value; } }

        private DateTime _posttime;
        public DateTime POSTTIME { get { return _posttime; } set { _posttime = value; } }

        private int _readtimes;
        public int READTIMES { get { return _readtimes; } set { _readtimes = value; } }
    }


    public class QueryResultSet<T>
    {
        private int _totalcount;
        public int TotalCount { get { return _totalcount; } set { _totalcount = value; } }

        private List<T> _resultset;
        public List<T> ResultSet { get { return _resultset; } set { _resultset = value; } }
    }


    /// <summary>
    ///NewsDB 的摘要说明
    /// </summary>
    public class NewsDB
    {
        private OleDbConnection _conn = null;
        public NewsDB()
        {
            string connStr = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=|DataDirectory|\data.mdb";
            this._conn = new OleDbConnection(connStr);

            //this._conn.Open();
        }

        public News ReadNewsByID(int id)
        {
            string sql = string.Format( "SELECT * FROM NEWS WHERE ID='{}'", id );

            if (this._conn.State != System.Data.ConnectionState.Open)
            {
                this._conn.Open();
            }

            
            OleDbCommand mycmd = new OleDbCommand(sql, this._conn); 
 
            OleDbDataReader mydr = mycmd.ExecuteReader();
           
            
            mydr.Read();

            this._conn.Close();

            News news = this.CreateNewsByRecord(mydr);

            return news;
        }

        public void InsertNews(News news)
        {
            string sql = string.Format("INSERT INTO NEWS(TITLE,CONTENT,POSTTIME,PEOPLE,READTIMES) VALUES('{0}','{1}','{2}','{3}',{4})", news.TITLE,news.CONTENT,news.POSTTIME.ToString(), news.PEOPLE, 0);

            if (this._conn.State != System.Data.ConnectionState.Open)
            {
                this._conn.Open();
            }


            OleDbCommand mycmd = new OleDbCommand(sql, this._conn);

            //OleDbDataReader mydr = mycmd.ExecuteReader();

            int n = mycmd.ExecuteNonQuery();

            this._conn.Close();

           
        }

        public QueryResultSet<News> QueryTopNewsTitle(int top)
        {
            string sql = string.Format("SELECT TOP {0}  ID,TITLE,POSTTIME FROM NEWS ORDER BY ID DESC ", top);

            if (this._conn.State != System.Data.ConnectionState.Open)
            {
                this._conn.Open();
            }


            OleDbCommand mycmd = new OleDbCommand(sql, this._conn);

            OleDbDataReader mydr = mycmd.ExecuteReader();

            List<News> lstNews = new List<News>();
            while (mydr.Read())
            {
                News news = new News();
                news.ID = (int)mydr["ID"];
                news.TITLE = (string)mydr["TITLE"];
                news.POSTTIME = (DateTime)mydr["POSTTIME"];
                lstNews.Add(news);
            }

            this._conn.Close();

            QueryResultSet<News> result = new QueryResultSet<News>();
            result.TotalCount = top;
            result.ResultSet = lstNews;

            return result;

        }

        private News CreateNewsByRecord(OleDbDataReader rd)
        {
            News news = new News();
            news.ID = (int)rd["ID"];
            news.TITLE = (string)rd["ID"];
            news.CONTENT = (string)rd["ID"];
            news.PEOPLE = (string)rd["ID"];
            news.POSTTIME = (DateTime)rd["ID"];
            news.READTIMES = (int)rd["ID"];

            return news;
            
        }
    }
}