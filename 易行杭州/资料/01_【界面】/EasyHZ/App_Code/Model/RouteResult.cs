using System;
using System.Data;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.Text;

    /// <summary>
    /// 公交路线查询结果类
    /// </summary>
    public class RouteResult
    {
        private double Price;
        //这里包括交点、起始点和终止点的id号
        private String NodesJiao;
        //这里包括交点、起始点和终止点的站点名称
        private String AllNodesName;
        //这里包括交点、起始点和终止点的坐标串
        private String NodesCoords;
        //所有节点的坐标信息
        private String AllCoords;
        //所有经过路线的id的集合
        private String RoutesStr;
        //所有经过路线的名称的集合
        private String AllRtName;
        private String Area;
        private double Length;

        public double getLength()
        {
            return Length;
        }
        public void setLength(double length)
        {
            Length = length;
        }
        public double getPrice()
        {
            return Price;
        }
        public void setPrice(double price)
        {
            Price = price;
        }
        public String getNodesJiao()
        {
            return NodesJiao;
        }
        public void setNodesJiao(String nodesJiao)
        {
            NodesJiao = nodesJiao;
        }
        public String getRoutesStr()
        {
            return RoutesStr;
        }
        public void setRoutesStr(String routesStr)
        {
            RoutesStr = routesStr;
        }
        public String getArea()
        {
            return Area;
        }
        public void setArea(String area)
        {
            Area = area;
        }
        public String getNodesCoords()
        {
            return NodesCoords;
        }
        public void setNodesCoords(String nodesCoords)
        {
            NodesCoords = nodesCoords;
        }
        public String getAllCoords()
        {
            return AllCoords;
        }
        public void setAllCoords(String allCoords)
        {
            AllCoords = allCoords;
        }
        public String getAllRtName()
        {
            return AllRtName;
        }
        public void setAllRtName(String allRtName)
        {
            AllRtName = allRtName;
        }
        public String getAllNodesName()
        {
            return AllNodesName;
        }
        public void setAllNodesName(String allNodesName)
        {
            AllNodesName = allNodesName;
        }
    }
