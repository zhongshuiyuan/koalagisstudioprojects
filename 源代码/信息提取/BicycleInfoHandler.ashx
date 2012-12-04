<%@ WebHandler Language="C#" Class="BicycleInfoHandler" %>

using System;
using System.Web;
using System.Net;
using System.Text;
using System.Web.UI;
using System.Text.RegularExpressions;
using System.Collections.Generic;

using BicycleInfoParser;

public class BicycleInfoHandler : IHttpHandler {    
    public void ProcessRequest (HttpContext context) {
        //请求参数
        string x = (context.Request.Params["x"] != "") ? context.Request.Params["x"] : "";   //坐标X
        string y = (context.Request.Params["y"] != "") ? context.Request.Params["y"] : "";   //坐标Y
        string w = (context.Request.Params["w"] != "") ? context.Request.Params["w"] : "500";   //范围W
        
        //获取自行车数据
        string targetUrl = "http://www.hzbus.cn/Page/NearbyBicyle.aspx?w=500&x=120.19879038464029&y=30.28017029916467";
        //if(x =="" || y== "" || w==""){            
        //}
        //else{
        //    targetUrl = targetUrl + "?w=" + w + "&x=" + x + "&y=" + y;        
        //}
        HttpWebRequest request = WebRequest.Create(targetUrl) as HttpWebRequest;
        request.Method = "GET";
        request.KeepAlive = false;

        HttpWebResponse response = request.GetResponse() as HttpWebResponse;
        System.IO.Stream responseStream = response.GetResponseStream();
        System.IO.StreamReader reader = new System.IO.StreamReader(responseStream, Encoding.UTF8);
        string srcString = reader.ReadToEnd();
        srcString = srcString.Replace("&nbsp;", " ");

        //提取ZXCClick
        string bicyclePattern = @"(?<=javascript:window.parent.ZXCClick\()[^(\);)]*";
        MatchCollection mc = Regex.Matches(srcString, bicyclePattern);

        int bNum = mc.Count;                                  //查询出来的自行车个数
        List<BicycleInfo> _biList = new List<BicycleInfo>();  //自行车具体信息
        for (int i = 0; i < mc.Count; i++)
        {
            string v = mc[i].Value;
            v = v.Replace("'", "");
            string[] b = HttpUtility.UrlDecode(v).Split(new Char[] { ',' });
            BicycleInfo _bi = new BicycleInfo();
            _bi.ServiceState = b[0];  //服务状态
            _bi.StationName = b[2];   //自行车站点名称
            _bi.StationAddr = b[3];   //自行车站点位置
            _bi.ServiceTime = b[4];   //服务时间
            _bi.ServicePhone = b[5];  //服务电话
            if (b[7] != "*")          //可借车辆
            {
                _bi.BorrowNum = int.Parse(b[7]);
            }
            if (b[8] != "*")         //可还车辆
            {
                _bi.ReturnNum = int.Parse(b[8]);
            }

            _bi.X = double.Parse(b[9]);  //自行车站点X坐标
            _bi.Y = double.Parse(b[10]); //自行车站点Y坐标
            for (int k = 0; k < b.Length; k++)
            {
                Console.WriteLine(HttpUtility.UrlDecode(b[k]));
            }

            _biList.Add(_bi);
        }    
        
        //向前台发送查询结果
        string result = "";
        result +="{NUM:" + bNum.ToString() + ";";
        result +="BicycleInfos:{";
        for(int j=0; j<bNum; j++)
        {
            result += _biList[j].ToJson();
            if(j!=(bNum-1))
            {
                result += ",";
            }
        }
        result += "}}";

        context.Response.Write(result);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}