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
    /// 公交路线类
    /// </summary>
    public class RouteInfo
    {
        private String Name;
        private String Node;
        private double Price;
        private String Id;
        private String Area;

        public String getNode()
        {
            return Node;
        }

        public void setNode(String node)
        {
            Node = node;
        }

        public double getPrice()
        {
            return Price;
        }

        public void setPrice(double price)
        {
            Price = price;
        }

        public String getId()
        {
            return Id;
        }

        public void setId(String id)
        {
            Id = id;
        }

        public String getArea()
        {
            return Area;
        }

        public void setArea(String area)
        {
            Area = area;
        }

        public String getName()
        {
            return Name;
        }

        public void setName(String name)
        {
            Name = name;
        }
    }
