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
    public class TrafficLine
    {
        private String Name;
        private int Id;
        private String Nodestr;

        public String Getname()
        {
            return Name;
        }

        public int Getid()
        {
            return Id;
        }

        public String Getnodestr()
        {
            return Nodestr;
        }

        public void Setname(String pName)
        {
            Name = pName;
        }

        public void Setid(int pid)
        {
            Id = pid;
        }

        public void Setnodestr(String pNodestr)
        {
            Nodestr = pNodestr;
        }
    }
