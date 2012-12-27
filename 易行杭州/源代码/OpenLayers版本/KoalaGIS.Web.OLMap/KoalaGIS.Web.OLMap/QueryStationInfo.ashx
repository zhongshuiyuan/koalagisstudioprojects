<%@ WebHandler Language="C#" Class="KoalaGIS.Web.Server.HZBike.QueryStationInfo" %>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;

using System.Text.RegularExpressions;
using KoalaGIS.Models;

namespace KoalaGIS.Web.Server.HZBike
{
    /// <summary>
    /// QueryStationInfo 的摘要说明
    /// </summary>
    public class QueryStationInfo : IHttpHandler
    {
        private DataQueryServiceClient _client = new DataQueryServiceClient();
        private System.Net.WebClient client = new System.Net.WebClient();
        
        
        public void ProcessRequest(HttpContext context)
        {
            this.QueryBikesInfoByHZBus(context);
        }

        private void QueryBikesInfoByGHJ(HttpContext context)
        {
            //context.Response.ContentType = "text/plain";
            //context.Response.Write("Hello World");

            //1:编号查询 2:名称
            string type = context.Request.QueryString["type"];

            string keyword = context.Request.QueryString["keyword"];
            if (keyword == null || keyword == "")
            {
                context.Response.Write("没有指定查询参数");
                return;
            }

            string searchField = "CSVRID";
            if (type == "1")
            {
                searchField = "CSVRID";
            }
            else if (type == "2")
            {
                searchField = "NAME";
            }

            string responseStr = this._client.Search(keyword, searchField, "NAME;STATE;CSVRID;CYCAVAIL;CYCBACK;TIME;ADDR;CALL;SERVICE;TYPE", "VW_BIKE", 10);
            byte[] bytes = FX.Security.AesCryptography.Decrypt(responseStr);
            byte[] results = Cellbi.SvZLib.Utils.Decompress(bytes);

            FX.Data.DataTable tbResult = FX.Serialization.DataContractSerialization.Deserialize<FX.Data.DataTable>(results) as FX.Data.DataTable;

            StringBuilder sb = new StringBuilder();
            int i = 0;

            string id;
            string name;
            string cycavail;
            string cycback;
            string time;
            string addr;
            string call;
            string service;
            string bktype;
            string state;

            sb.Append("[");
            foreach (var row in tbResult.Rows)
            {
                id = row.Cells["csvrid"].ToString();
                name = row.Cells["name"].ToString();
                cycavail = row.Cells["cycavail"].ToString();
                cycback = row.Cells["cycback"].ToString();
                time = row.Cells["time"].ToString();
                addr = row.Cells["addr"].ToString();
                state = row.Cells["state"].ToString();
                service = row.Cells["service"].ToString();
                call = row.Cells["call"].ToString();
                bktype = row.Cells["type"].ToString();

                string record = string.Format("{{CSVRID:'{0}', NAME:'{1}',STATE:'{2}',CYCAVAIL:'{3}',CYCBACK:'{4}',TIME:'{5}',ADDR:'{6}',SERVICE:'{7}',TYPE:'{8}'}}", id, name, state, cycavail, cycback, time, addr, service, type);

                if (i != 0)
                    sb.Append(",");
                sb.Append(record);

                i++;
            }

            sb.Append("]");

            context.Response.Write(sb.ToString());
        }

        private void QueryBikesInfoByHZBus(HttpContext context)
        {
            
            //client.BaseAddress = "http://www.hzbus.cn/Page/BicyleSquare.aspx";
            //client.QueryString["nm"] = "1003";
            //client.QueryString["area"] = "-1";

            string keyword = context.Request["keyword"];

            client.Encoding = System.Text.Encoding.UTF8;
            string response = client.DownloadString(string.Format("http://www.hzbus.cn/Page/BicyleSquare.aspx?nm={0}&area=-1&rnd=9", keyword));

            response = response.Replace("&nbsp;", " ");
            //提取ZXCClick
            string bicyclePattern = @"(?<=javascript:window.parent.ZXCClick\()[^(\);)]*";
            MatchCollection mc = Regex.Matches(response, bicyclePattern);

            int bNum = mc.Count;                                  //查询出来的自行车个数
            List<BicycleInfo> _biList = new List<BicycleInfo>();  //自行车具体信息

            StringBuilder sb = new StringBuilder();
            sb.Append("[");
            
            for (int i = 0; i < mc.Count; i++)
            {
                string v = mc[i].Value;
                v = v.Replace("'", "");
                //v = HttpUtility.UrlDecode(v);
                string[] b = v.Split(new Char[] { ',' });
                BicycleInfo bike = new BicycleInfo();
                bike.ServiceState = HttpUtility.UrlDecode(b[0]);  //服务状态
                bike.StationName = HttpUtility.UrlDecode(b[2]);   //自行车站点名称
                bike.StationAddr = HttpUtility.UrlDecode(b[3]);   //自行车站点位置
                bike.ServiceTime = b[4];   //服务时间
                bike.ServicePhone = b[5];  //服务电话
                if (b[7] != "*" && b[7] != "")          //可借车辆
                {
                    bike.BorrowNum = int.Parse(b[7]);
                }
                if (b[8] != "*" && b[8] != "")         //可还车辆
                {
                    bike.ReturnNum = int.Parse(b[8]);
                }

                string record = string.Format("{{CSVRID:'{0}', NAME:'{1}',STATE:'{2}',CYCAVAIL:'{3}',CYCBACK:'{4}',TIME:'{5}',ADDR:'{6}',SERVICE:'{7}',TYPE:'{8}'}}", "1003", bike.StationName, bike.ServiceState, bike.BorrowNum, bike.ReturnNum, bike.ServiceTime, bike.StationAddr, bike.ServicePhone, bike.StationRemarks);
                if (i != 0)
                    sb.Append(",");
                sb.Append(record);

            }

            sb.Append("]");

            context.Response.Write(sb.ToString() );
            
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}