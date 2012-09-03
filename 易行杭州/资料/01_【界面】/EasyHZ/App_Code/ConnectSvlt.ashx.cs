using System;
using System.Collections;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Xml.Linq;
using System.Data.OleDb;
using Zjgis.LSGIS.Main.Model;

namespace Zjgis.LSGIS.Main.Controlller
{
    /// <summary>
    /// $codebehindclassname$ 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    public class ConnectSvlt : IHttpHandler
    {
        private HttpRequest Request;
        private HttpResponse Response;

        public void ProcessRequest(HttpContext context)
        {
            Request = context.Request;
            Response = context.Response;
            string rootPath = Request.MapPath("~");

            // 这里以站点名称匹配站点id是临时的，以后要用地名进行匹配
            String StartId = Request.QueryString["start"].Trim();
            String EndId = Request.QueryString["end"].Trim();
            String strQXName = Request.QueryString["QXName"].Trim();

            String retStr = "";

            try
            {
                Connect Cnt = new Connect();
                if (Cnt.ZDLJFun(StartId, EndId, strQXName))
                    retStr = Cnt.getMindistance().ToString() + "&" + Cnt.getRoadInfo() + "&" + Cnt.getCoordsStr();
            }
            catch (Exception ex)
            {
                retStr = "alert('" + ex.Message + "!');";
            }
            finally
            {
                Response.Write(retStr);
            }
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