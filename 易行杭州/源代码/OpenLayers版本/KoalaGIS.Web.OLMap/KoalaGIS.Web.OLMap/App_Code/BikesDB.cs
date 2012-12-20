using System;
using System.Collections.Generic;
using System.Web;
using System.Data.OleDb;

namespace KoalaGIS.Models
{
    public class QueryResultSet<T>
    {
        private int _totalcount;
        public int TotalCount { get { return _totalcount; } set { _totalcount = value; } }

        private List<T> _resultset;
        public List<T> ResultSet { get { return _resultset; } set { _resultset = value; } }
    }

    /// <summary>
    ///BicycleInfo 的摘要说明
    /// </summary>
    public class BicycleInfo
    {
        public BicycleInfo()
        {
            //
            //TODO: 在此处添加构造函数逻辑
            //
        }

        private string _stationName;
        /// <summary>
        /// 站点名称
        /// </summary>
        public string StationName { get { return _stationName; } set { _stationName = value; } }


        private string _stationID;
        /// <summary>
        /// 站点编号
        /// </summary>
        public string StationID { get { return _stationID; } set { _stationID = value; } }


        private int _borrowNum;
        /// <summary>
        /// 可借车辆
        /// </summary>
        public int BorrowNum { get { return _borrowNum; } set { _borrowNum = value; } }


        private int _returnNum;
        /// <summary>
        /// 可还车辆
        /// </summary>
        public int ReturnNum { get { return _returnNum; } set { _returnNum = value; } }


        private string _serviceTime;
        /// <summary>
        /// 服务时间
        /// </summary>
        public string ServiceTime { get { return _serviceTime; } set { _serviceTime = value; } }

        private string _serviceState;
        /// <summary>
        /// 值守状态
        /// </summary>
        public string ServiceState { get { return _serviceState; } set { _serviceState = value; } }

        private string _stationAddr;
        /// <summary>
        /// 站点地址
        /// </summary>
        public string StationAddr { get { return _stationAddr; } set { _stationAddr = value; } }

        private double _x;
        /// <summary>
        /// 站点X坐标
        /// </summary>
        public double X { get { return _x; } set { _x = value; } }

        private double _y;
        /// <summary>
        /// 站点X坐标
        /// </summary>
        public double Y { get { return _y; } set { _y = value; } }

        private string _servicePhone;
        /// <summary>
        /// 服务电话
        /// </summary>
        public string ServicePhone { get { return _servicePhone; } set { _servicePhone = value; } }

        private string _stationRemarks;
        /// <summary>
        /// 站点备注
        /// </summary>
        public string StationRemarks { get { return _stationRemarks; } set { _stationRemarks = value; } }

        /// <summary>
        /// 将自行车信息以json方式输出
        /// </summary>
        /// <returns></returns>
        public string ToJson()
        {
            return string.Format("{{StationName:'{0}', BorrowNum:'{1}',ReturnNum: '{2}', StationAddr:'{3}', X:{4}, Y:{5}}}", this.StationName, this.BorrowNum, this.ReturnNum, this.StationAddr, this.X, this.Y);
        }

    }
     
    public class BikesDB
    {
        private OleDbConnection _conn = null;
        public BikesDB()
        {
            string connStr = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=|DataDirectory|\bikes.mdb";
            this._conn = new OleDbConnection(connStr);
        }


        public QueryResultSet<BicycleInfo> QueryBikes(int start, int pagesize)
        {

            string sql = string.Format("select * from ( SELECT top {0} * from ( select *  from ( select top {1} * from bike_ghj order by CSVRID ) order by CSVRID desc ) ) order by CSVRID", pagesize, start + pagesize);
            
            //string sql = string.Format("SELECT TOP {0} * FROM BIKES_GHJ ORDER BY ID DESC ", top);

            if (this._conn.State != System.Data.ConnectionState.Open)
            {
                this._conn.Open();
            }

            string sql0 = "SELECT COUNT(*) FROM BIKE_GHJ";

            OleDbCommand cmdCount = this._conn.CreateCommand();
            cmdCount.CommandText = sql0;
            cmdCount.CommandType = System.Data.CommandType.Text;
            int nCount = (int) cmdCount.ExecuteScalar();


            OleDbCommand mycmd = new OleDbCommand(sql, this._conn);

            OleDbDataReader mydr = mycmd.ExecuteReader();

            List<BicycleInfo> lstDemos = new List<BicycleInfo>();
            while (mydr.Read())
            {
                BicycleInfo demo = this.CreateBikeByReader(mydr);
                lstDemos.Add(demo);
            }

            this._conn.Close();

            QueryResultSet<BicycleInfo> result = new QueryResultSet<BicycleInfo>();
            result.TotalCount = nCount;
            result.ResultSet = lstDemos;

            return result;
        }

        public QueryResultSet<BicycleInfo> QueryBikesByRect(int start, int pagesize, double xmin, double ymin, double xmax, double ymax)
        {
            string sql = string.Format("select * from ( SELECT top {0} * from ( select *  from ( select top {1} * from bike_ghj order by CSVRID where bd_x between {2} and {3} and bd_y between {4} and {5}  ) order by CSVRID desc ) ) order by CSVRID", pagesize, start + pagesize, xmin, xmax, ymin, ymax );

            //string sql = string.Format("SELECT TOP {0} * FROM BIKES_GHJ ORDER BY ID DESC ", top);

            if (this._conn.State != System.Data.ConnectionState.Open)
            {
                this._conn.Open();
            }

            string sql0 = string.Format("SELECT COUNT(*) FROM BIKE_GHJ where bd_x between {0} and {1} and bd_y between {2} and {3}", xmin, xmax, ymin, ymax);

            OleDbCommand cmdCount = this._conn.CreateCommand();
            cmdCount.CommandText = sql0;
            cmdCount.CommandType = System.Data.CommandType.Text;
            int nCount = (int)cmdCount.ExecuteScalar();


            OleDbCommand mycmd = new OleDbCommand(sql, this._conn);

            OleDbDataReader mydr = mycmd.ExecuteReader();

            List<BicycleInfo> lstDemos = new List<BicycleInfo>();
            while (mydr.Read())
            {
                BicycleInfo demo = this.CreateBikeByReader(mydr);
                lstDemos.Add(demo);
            }

            this._conn.Close();

            QueryResultSet<BicycleInfo> result = new QueryResultSet<BicycleInfo>();
            result.TotalCount = nCount;
            result.ResultSet = lstDemos;

            return result;
        }


        public QueryResultSet<BicycleInfo> SearchBikesByName(int start, int pagesize, string keyword )
        {
            string sql = string.Format("select * from ( SELECT top {0} * from ( select *  from ( select top {1} * from bike_ghj where  NAME like '%{2}%' or ADDR like '%{2}%' order by CSVRID   ) order by CSVRID desc ) ) order by CSVRID", pagesize, start + pagesize, keyword);

            //string sql = string.Format("SELECT TOP {0} * FROM BIKES_GHJ ORDER BY ID DESC ", top);

            if (this._conn.State != System.Data.ConnectionState.Open)
            {
                this._conn.Open();
            }

            string sql0 = string.Format("SELECT COUNT(*) FROM BIKE_GHJ where NAME like '%{0}%' or ADDR like '%{0}%'", keyword );

            OleDbCommand cmdCount = this._conn.CreateCommand();
            cmdCount.CommandText = sql0;
            cmdCount.CommandType = System.Data.CommandType.Text;
            int nCount = (int)cmdCount.ExecuteScalar();


            OleDbCommand mycmd = new OleDbCommand(sql, this._conn);

            OleDbDataReader mydr = mycmd.ExecuteReader();

            List<BicycleInfo> lstDemos = new List<BicycleInfo>();
            while (mydr.Read())
            {
                BicycleInfo demo = this.CreateBikeByReader(mydr);
                lstDemos.Add(demo);
            }

            this._conn.Close();

            QueryResultSet<BicycleInfo> result = new QueryResultSet<BicycleInfo>();
            result.TotalCount = nCount;
            result.ResultSet = lstDemos;

            return result;
        }

        public BicycleInfo CreateBikeByReader(OleDbDataReader rd)
        {
            BicycleInfo bike = new BicycleInfo();
            bike.StationID = (string)rd["CSVRID"].ToString();
            if (rd["CALL"] != DBNull.Value)
                bike.ServicePhone = (string)rd["CALL"];

            if (rd["SERVICE"] != DBNull.Value)
                bike.ServiceState = (string)rd["SERVICE"];

            if (rd["TIME_"] != DBNull.Value)
            bike.ServiceTime = (string)rd["TIME_"];

            if (rd["ADDR"] != DBNull.Value)
            bike.StationAddr = (string)rd["ADDR"];

            bike.StationName = (string)rd["NAME"];
            //bike.StationRemarks = (string)rd["CSVRID"];
            bike.X = (double)rd["BD_X"];
            bike.Y = (double)rd["BD_Y"];

            return bike;
        }
        
        

    }
}