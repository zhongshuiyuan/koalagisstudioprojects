<%@ WebHandler Language="C#" Class="WeatherHandler" %>

using System;
using System.Web;

using System.Net;

public class WeatherHandler : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        //context.Response.ContentType = "text/html";
        //context.Response.ContentEncoding = System.Text.UTF8Encoding.UTF8;
        //context.Response.Write("Hello World");

            //下面这段代码是为了在内网中的测试数据，联网时需要注释掉，采用后面的代码
        string testInfo = "{'weatherinfo':{'city':'嘉兴','city_en':'hangzhou','date_y':'2010年11月26日',";
        testInfo += "'date':'庚寅年十月廿一','week':'星期五','fchh':'11','cityid':'101210101','temp1':'16℃~7℃',";
        testInfo += "'temp2':'17℃~8℃','temp3':'15℃~8℃','temp4':'14℃~8℃','temp5':'13℃~8℃','temp6':'15℃~9℃',";
        testInfo += "'tempF1':'60.8℉~44.6℉','tempF2':'62.6℉~46.4℉','tempF3':'59℉~46.4℉','tempF4':'57.2℉~46.4℉',";
        testInfo += "'tempF5':'55.4℉~46.4℉','tempF6':'59℉~48.2℉','weather1':'多云转晴','weather2':'晴转多云',";
        testInfo += "'weather3':'多云转阴','weather4':'阴转小雨','weather5':'阴转多云','weather6':'多云','img1':'1',";
        testInfo += "'img2':'0','img3':'0','img4':'1','img5':'1','img6':'2','img7':'2','img8':'7','img9':'2','img10':'1',";
        testInfo += "'img11':'1','img12':'99','img_single':'1','img_title1':' 多云','img_title2':'晴','img_title3':'晴',";
        testInfo += "'img_title4':'多云','img_title5':'多云','img_title6':'阴','img_title7':'阴','img_title8':'小雨',";
        testInfo += "'img_title9':'阴','img_title10':'多云','img_title11':'多云','img_title12':'多云',";
        testInfo += "'img_title_single':'多云','wind1':'北风小于3级','wind2':'东北风小于3级','wind3':'东北风小于3级',";
        testInfo += "'wind4':'东北风小于3级','wind5':'东北风转北风小于3级','wind6':'北风小于3级','fx1':'北风','fx2':'北风',";
        testInfo += "'fl1':'小于3级','fl2':'小于3级','fl3':'小于3级','fl4':'小于3级','fl5':'小于3级','fl6':'小于3级',";
        testInfo += "'index':'舒适','index_d':'建议着薄型套装或牛仔衫裤等春秋过渡装,年老体弱者宜着套装夹克衫等',";
        testInfo += "'index48':'舒适','index48_d':'建议着薄型套装或牛仔衫裤等春秋过渡装。年老体弱者宜着套装、夹克衫等。',";
        testInfo += "'index_uv':'弱','index48_uv':'中等','index_xc':'适宜','index_tr':'很适宜','index_co':'舒适','st1':'16',";
        testInfo += "'st2':'9','st3':'16','st4':'8','st5':'15','st6':'7','index_cl':'较适宜','index_ls':'适宜'}}";

        context.Response.Write(testInfo);
        return;

        WebClient webclient = new WebClient();
        webclient.Encoding = System.Text.UTF8Encoding.UTF8;
        webclient.Credentials = CredentialCache.DefaultCredentials;

            //该网站返回客户所在的IP和城市ID
        string dataIpInfo = webclient.DownloadString("http://61.4.185.48:81/g/");
        ////var ip = "122.224.160.66"; var id = 101210101; if (typeof (id_callback) != "undefined") { id_callback(); }
        string[] temp = dataIpInfo.Split(';');
        string ip = temp[0];
        string cityid = temp[1];
        cityid = cityid.Split('=')[1].Trim() ;

        //通过城市ID获取对应的天气信息
        //http://m.weather.com.cn/data/101210101.html
        string weatherInfo = webclient.DownloadString("http://m.weather.com.cn/data/" + cityid + ".html");

        context.Response.Write(weatherInfo);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}