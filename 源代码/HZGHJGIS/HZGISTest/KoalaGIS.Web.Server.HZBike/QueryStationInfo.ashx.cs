using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;

namespace KoalaGIS.Web.Server.HZBike
{
    /// <summary>
    /// QueryStationInfo 的摘要说明
    /// </summary>
    public class QueryStationInfo : IHttpHandler
    {
        private DataQueryServiceClient _client = new DataQueryServiceClient();

        public void ProcessRequest(HttpContext context)
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

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}