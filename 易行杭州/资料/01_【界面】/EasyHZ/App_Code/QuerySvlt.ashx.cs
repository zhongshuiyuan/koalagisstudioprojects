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
    public class QuerySvlt : IHttpHandler
    {
        private HttpRequest Request;
        private HttpResponse Response;

        public void ProcessRequest(HttpContext context)
        {
            Request = context.Request;
            Response = context.Response;
            string rootPath = Request.MapPath("~");

            string retStr = string.Empty;
            String type =  Request.QueryString["type"];
            QueryTrffLn QTL = new QueryTrffLn();

            int fromnum, tonum, PageIndex, PageSize;
            if (context.Request.Params["fromnum"] != null)
            {
                fromnum = int.Parse(context.Request.Params["fromnum"]);
                tonum = int.Parse(context.Request.Params["tonum"]);
            }
            else
            {
                PageIndex = int.Parse(context.Request.Params["pageIndex"]);
                PageSize = int.Parse(context.Request.Params["pageSize"]);
                fromnum = (PageIndex - 1) * PageSize;
                tonum = fromnum + PageSize-1;
            }

            try
            {
                switch (type.ToLower())
                {
                    //查找公交站点
                    case "querystation":
                        {
                            //站点的名字
                            String StaName = Request.QueryString["para"].ToString();
                            retStr = QTL.QueryStation(StaName,fromnum,tonum);
                        }
                        break;
                    //查询站点经过的路线
                    case "routefromstation":
                        {
                            //站点的名字
                            String id = Request.QueryString["para"].ToString();
                            retStr = QTL.QueryLnOnSta(id);
                        }
                        break;
                    //查询公交线路，并返回其名字和id
                    case "queryroute":
                        {
                            String RouteName = Request.QueryString["para"].ToString();
                            retStr = QTL.QueryTrffId(RouteName, fromnum, tonum);
                        }
                        break;
                    //已知公交线路唯一id，得到公交线路站点
                    case "routecoords":
                        {
                            String Routeid = Request.QueryString["para"].ToString();
                            retStr = QTL.QueryTrff(Routeid);
                        }
                        break;
                    case "getstationbyid":
                        {
                            String Staid = Request.QueryString["para"].ToString();
                            retStr = QTL.QueryStationByid(Staid);
                        }
                        break;
                    case "allnameid":
                        {
                            //站点的名字
                            String pName = Request.QueryString["para"].ToString();
                            retStr = QTL.GetAllStaId(pName);
                        }
                        break;
                    case "allsta":  //
                        {
                            String pName = Request.QueryString["para"].ToString();
                            retStr = QTL.QueryStaNameIdCoods(pName);
                        }
                        break;
                    case "conncectpn":
                        {
                            String pName = Request.QueryString["para"];
                            String QXName = Request.QueryString["qx"];

                            retStr = QTL.QueryPnNameId(pName, QXName);
                        }
                        break;
                    case "conncect2pn":
                        {
                            String pName = Request.QueryString["para"];
                            String pName2 = Request.QueryString["para2"];
                            String QXName = Request.QueryString["qx"];
                            retStr = QTL.QueryPnNameId2(pName, QXName) + "&" + QTL.QueryPnNameId2(pName2, QXName);
                        }
                        break;
                    
                }
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