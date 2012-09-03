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
using System.Collections.Generic;

namespace Zjgis.LSGIS.Main.Controlller
{
    /// <summary>
    /// $codebehindclassname$ 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    public class ChangeSvlt : IHttpHandler
    {
        private HttpRequest Request;
        private HttpResponse Response;

        public void ProcessRequest(HttpContext context)
        {
            Request = context.Request;
            Response = context.Response;
            string rootPath = Request.MapPath("~");

            String StartIds = Request.QueryString["start"];
            String EndIds = Request.QueryString["end"];

            String[] StartArr = StartIds.Split(',');
            String[] EndArr = EndIds.Split(',');
            String retStr = "";
            ArrayList retArr = new ArrayList();
            try
            {

                for (int i = 0; i < StartArr.Length; i++) {
                    for (int j = 0; j < EndArr.Length; j++)
                    {
                        List<RouteResult> RouteRs = GetAllRouteRs(StartArr[i], EndArr[j]);
                        for (int k = 0; k < RouteRs.Count; k++)
                        {
                            RouteResult RtRs = RouteRs[k];
                            retArr.Add(TranslateRtRs(RtRs));
                        }
                    }
                }
                string formater = "{{'NUM':'{0}','RESULTSET':[{1}]}}";
                if(retArr.Count==0) retStr=string.Format(formater,"0","");
                else{
                    string[] tmp=new string[retArr.Count]; 
                    retArr.CopyTo(tmp);
                    retStr = string.Format(formater, retArr.Count.ToString(), string.Join(",", tmp));
                }
                
            }
            catch (Exception ex)
            {
                retStr = "alert('" + ex.Message + "!');";
            }
            finally
            {
                retStr = retStr.Trim();
                //if (retStr.Length > 0)
                //{
                //    retStr = retStr.Substring(0, retStr.Length - 1);
                //}
                Response.Write(retStr);
            }
        }

        private List<RouteResult> GetAllRouteRs(String Startid, String Endid)
        {
            List<RouteResult> pAllVector = new List<RouteResult>();
            TrafficChange TC = new TrafficChange();
            List<RouteInfo> RtInfoColl = TC.GetRtInfoColl();
            List<RouteResult> ZhidaVec = TC.ZhiDa(Startid, Endid, RtInfoColl);
            if (ZhidaVec.Count > 0)
            {
                pAllVector.AddRange(ZhidaVec);
                return pAllVector;
            }
            List<RouteResult> OneChangeVec = TC.Onechange(Startid, Endid, RtInfoColl);
            if (OneChangeVec.Count > 0)
            {
                pAllVector.AddRange(OneChangeVec);
                return pAllVector;
            }
            List<RouteResult> TwoChangeVec = TC.Twochange(Startid, Endid, RtInfoColl);
            if (TwoChangeVec.Count > 0)
            {
                pAllVector.AddRange(TwoChangeVec);
                return pAllVector;
            }

            return pAllVector;
        }

        private String TranslateRtRs(RouteResult RtRs)
        {
            String price = RtRs.getPrice().ToString();
            String Len = RtRs.getLength().ToString();
            String NodesCoords = RtRs.getNodesCoords();
            String AllCoords = RtRs.getAllCoords();
            String NodesId = RtRs.getNodesJiao();
            String AllRtName = RtRs.getAllRtName();
            String AllStaName = RtRs.getAllNodesName();
            string AllRtId = RtRs.getRoutesStr();

            string[] stationscoords=NodesCoords.Split(";".ToCharArray());
            string[] stationsids = NodesId.Split(";".ToCharArray());
            string[] stationsnames = AllStaName.Split(";".ToCharArray());
            string[] stations = new string[stationsids.Length];
            string stationsFormater="{{'NAME':'{0}','ID':'{1}','COORDS':'Point({2})'}}";
            for (int i = 0; i < stations.Length; i++) {
                stations[i] = string.Format(stationsFormater,stationsnames[i],stationsids[i],stationscoords[i].Replace(","," "));
            }

            string[] linesids = AllRtId.Split(";".ToCharArray());
            string[] linesnames = AllRtName.Split(";".ToCharArray());
            string[] lines = new string[linesids.Length];
            string linesFormater = "{{'NAME':'{0}','ID':'{1}'}}";
            for (int i = 0; i < lines.Length; i++)
            {
                lines[i] = string.Format(linesFormater, linesnames[i], linesids[i]);
            }

            AllCoords = AllCoords.Replace(",", " ");
            AllCoords = AllCoords.Replace(";",",");
            

            string formater = "{{'PRICE':'{0}','LENGTH':'{1}','STATIONS':[{2}],'ALLCOORDS':'LINESTRING({3})','LINES':[{4}]}}";
            string result = string.Format(formater, price, Len, string.Join(",", stations), AllCoords, string.Join(",", lines));
            return result;
            //return price + ":" + Len + ":" + NodesCoords + ":" + AllCoords + ":"
            //        + NodesId + ":" + AllRtName + ":" + AllStaName;
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