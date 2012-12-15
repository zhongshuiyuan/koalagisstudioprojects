using System;
using System.Collections.Generic;

using System.Web;

using System.Data.OleDb;
using System.Data.SqlClient;
using ZJGIS.Model.Common;

namespace ZJGIS.Model.Demos
{

    public class Demo
    {
        public Demo()
        {
            this.CREATETIME = DateTime.Now;
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

        private string _author;
        public string AUTHOR { get { return _author; } set { _author = value; } }

        private DateTime _posttime;
        public DateTime CREATETIME { get { return _posttime; } set { _posttime = value; } }

        private int _readtimes;
        public int READTIMES { get { return _readtimes; } set { _readtimes = value; } }

        private string _appurl;
        public string APPURL { get { return _appurl; } set { _appurl = value; } }

        private string _thumbnail;
        public string THUMBNAIL { get { return _thumbnail; } set { _thumbnail = value; } }
    }


    /// <summary>
    ///DemosDB 的摘要说明
    /// </summary>
    public class DemosDB
    {
        private OleDbConnection _conn = null;
        public DemosDB()
        {
            string connStr = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=|DataDirectory|\data.mdb";
            this._conn = new OleDbConnection(connStr);

            //this._conn.Open();
        }

        public Demo ReadDemoByID(int id)
        {
            string sql = string.Format( "SELECT * FROM APPS WHERE ID={0}", id );

            if (this._conn.State != System.Data.ConnectionState.Open)
            {
                this._conn.Open();
            }

            
            OleDbCommand mycmd = new OleDbCommand(sql, this._conn); 
 
            OleDbDataReader mydr = mycmd.ExecuteReader();
           
            
            mydr.Read();

            Demo news = this.CreateDemoByRecord(mydr);

            this._conn.Close();

            

            return news;
        }

        public void InsertDemo(Demo demo)
        {
            string sql = string.Format("INSERT INTO APPS(TITLE,CONTENT,CREATETIME,AUTHOR,APPURL,THUMBNAIL) VALUES('{0}','{1}','{2}','{3}','{4}','{5}')", demo.TITLE, demo.CONTENT, demo.CREATETIME.ToString(), demo.AUTHOR, demo.APPURL, demo.THUMBNAIL);

            if (this._conn.State != System.Data.ConnectionState.Open)
            {
                this._conn.Open();
            }


            OleDbCommand mycmd = new OleDbCommand(sql, this._conn);

            //OleDbDataReader mydr = mycmd.ExecuteReader();

            int n = mycmd.ExecuteNonQuery();

            this._conn.Close();

           
        }

        public void UpdateDemo(int id, Demo demo)
        {
            string sql = string.Format("UPDATE APPS SET TITLE='{0}',CONTENT='{1}',AUTHOR='{2}',APPURL='{3}',THUMBNAIL='{4}' WHERE ID={5}", demo.TITLE, demo.CONTENT, demo.AUTHOR, demo.APPURL, demo.THUMBNAIL, id);

            if (this._conn.State != System.Data.ConnectionState.Open)
            {
                this._conn.Open();
            }

            OleDbCommand mycmd = new OleDbCommand(sql, this._conn);

            int n = mycmd.ExecuteNonQuery();

            this._conn.Close();
        }

        public void DeleteDemoByID(int id)
        {
            string sql = string.Format("DELETE FROM APPS  WHERE ID={5})",  id);

            if (this._conn.State != System.Data.ConnectionState.Open)
            {
                this._conn.Open();
            }

            OleDbCommand mycmd = new OleDbCommand(sql, this._conn);

            int n = mycmd.ExecuteNonQuery();

            this._conn.Close();
        }

        public QueryResultSet<Demo> QueryTopDemos(int top)
        {
            string sql = string.Format("SELECT TOP * FROM NEWS ORDER BY ID DESC ", top);

            if (this._conn.State != System.Data.ConnectionState.Open)
            {
                this._conn.Open();
            }


            OleDbCommand mycmd = new OleDbCommand(sql, this._conn);

            OleDbDataReader mydr = mycmd.ExecuteReader();

            List<Demo> lstDemos = new List<Demo>();
            while (mydr.Read())
            {
                Demo demo = this.CreateDemoByRecord(mydr);
                lstDemos.Add(demo);
            }

            this._conn.Close();

            QueryResultSet<Demo> result = new QueryResultSet<Demo>();
            result.TotalCount = top;
            result.ResultSet = lstDemos;

            return result;

        }

        private Demo CreateDemoByRecord(OleDbDataReader rd)
        {
            Demo demo = new Demo();
            demo.ID = (int)rd["ID"];
            demo.TITLE = (string)rd["TITLE"];
            demo.CONTENT = (string)rd["CONTENT"];
            demo.AUTHOR = (string)rd["AUTHOR"];
            demo.CREATETIME = (DateTime)rd["CREATETIME"];
            demo.APPURL = (string)rd["APPURL"];
            if (rd["THUMBNAIL"] != DBNull.Value)
            {
                demo.THUMBNAIL = (string)rd["THUMBNAIL"];
            }

            return demo;
            
        }
    }
}