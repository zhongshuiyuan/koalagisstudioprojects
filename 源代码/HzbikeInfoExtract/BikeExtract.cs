using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using KoalaGIS.EasyHz.Model;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using Microsoft.Office.Interop.Excel;

namespace KoalaGIS.EasyHz.Utils
{
    public delegate void PageInfoHandler( int total, int cur );

    /// <summary>
    /// 从Hzbus.com.cn提取自行车数据的类
    /// </summary>
    public class BikeExtract
    {
        private string _bikeUrl = "";

        /// <summary>
        /// 获取分页内容类
        /// </summary>
        private AspNetPageGrap _grasp = new AspNetPageGrap();

        public event PageInfoHandler PageInfoEvent;

        public BikeExtract()
        {
            this._bikeUrl = "http://www.hzbus.cn/Page/BicyleNearby.aspx?w=50&rnd=2";
            this.LoadViewStateInfo();
        }

        public void LoadViewStateInfo()
        {
            _grasp.LoadViewStateInfo(this._bikeUrl);
        }

        public List<BicycleInfo> GetBikesByPage(int page)
        {
            HttpWebRequest request = WebRequest.Create(this._bikeUrl) as HttpWebRequest;
            request.Method = "GET";
            request.KeepAlive = false;

            string srcString = this._grasp.GetPageInfo(this._bikeUrl, page);
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
                v = HttpUtility.UrlDecode(v);
                string[] b =  v.Split(new Char[] { ',' });
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
                
                _biList.Add(_bi);
            }

            return _biList;
        }

        /// <summary>
        /// 导出数据
        /// </summary>
        /// <param name="folder"></param>
        public void ExportData(string folder)
        {

            Microsoft.Office.Interop.Excel.Application app = new Application();
            app.Visible = false;
            Workbook book = app.Workbooks.Add(Type.Missing);
            //Worksheet sheet = (Worksheet)(book.Sheets[1]);


            string[] fields = new string[] { "站点名称", "站点编号", "可借车辆", "可还车辆", "服务时间", "值守状态", "站点地址", "X", "Y", "服务电话", "站点备注" };

            //生成Excel字段
            for (int i = 0; i < fields.Length; i++)
            {
                app.Cells[1, i + 1] = fields[i];
            }


            //逐页抓取网页数据
            //232页 
            int nPageCount = 232;
            int nStartRow = 0;
            for (int i = 1; i <= nPageCount; i++)
            {
                List<BicycleInfo> bikes = this.GetBikesByPage(i);

                if (this.PageInfoEvent != null)
                {
                    this.PageInfoEvent(nPageCount, i);
                }

                //填充到Excel中去
                this.FillExcelRecord(app, bikes, nStartRow );

                nStartRow += bikes.Count;
            }

            string path = folder + "\\Bike.xls" ;

            book.SaveAs(path);

            app.Quit();
        }

        private void FillExcelRecord( Microsoft.Office.Interop.Excel.Application excel , List<BicycleInfo> bikes, int startRow  )
        {
            
            //填充数据
            for (int i = 0; i < bikes.Count; i++)
            {
                int row = startRow + i + 2;
                BicycleInfo bike = bikes[i];
                
                excel.Cells[row, 1] = bike.StationName;
                excel.Cells[row, 2] = bike.StationID;
                excel.Cells[row, 3] = bike.BorrowNum;
                excel.Cells[row, 4] = bike.ReturnNum;
                excel.Cells[row, 5] = bike.ServiceTime;
                excel.Cells[row, 6] = bike.ServiceState;
                excel.Cells[row, 7] = bike.StationAddr;
                excel.Cells[row, 8] = bike.X;
                excel.Cells[row, 9] = bike.Y;
                excel.Cells[row, 10] = bike.ServicePhone;
                excel.Cells[row, 11] = bike.StationRemarks;
            }
        }
    }

    public class AspNetPageGrap
    {
        private string _eventValidState = "";
        private string _viewState = "";

        /// <summary>
        /// 加载ViewState信息，在获取分页内容前需要调用该函数一次
        /// </summary>
        /// <param name="url"></param>
        public void LoadViewStateInfo(string url)
        {
            HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
            request.Method = "GET";
            request.KeepAlive = false;

            HttpWebResponse response = request.GetResponse() as HttpWebResponse;
            System.IO.Stream responseStream = response.GetResponseStream();
            System.IO.StreamReader reader = new System.IO.StreamReader(responseStream, Encoding.UTF8);
            string srcString = reader.ReadToEnd();
            //srcString = srcString.Replace("&nbsp;", " ");


            //抓取ViewState
            string vsregStr = "<input type=\"hidden\" name=\"__VIEWSTATE\" id=\"__VIEWSTATE\" value=\"(?<vs>[^\"]*)";
            string viewStateStr = Regex.Match(srcString, vsregStr, RegexOptions.IgnoreCase).Result("${vs}");

            //EVENTVALIDATION
            string eventValidRegStr = "<input type=\"hidden\" name=\"__EVENTVALIDATION\" id=\"__EVENTVALIDATION\" value=\"(?<vs>[^\"]*)";
            string eventValidStr = Regex.Match(srcString, eventValidRegStr, RegexOptions.IgnoreCase).Result("${vs}");

            this._eventValidState = eventValidStr;
            this._viewState = viewStateStr;

        }


        private void GetViewStateInfo(string htmlSrc)
        {
            //抓取ViewState
            string vsregStr = "<input type=\"hidden\" name=\"__VIEWSTATE\" id=\"__VIEWSTATE\" value=\"(?<vs>[^\"]*)";
            string viewStateStr = Regex.Match(htmlSrc, vsregStr, RegexOptions.IgnoreCase).Result("${vs}");

            //EVENTVALIDATION
            string eventValidRegStr = "<input type=\"hidden\" name=\"__EVENTVALIDATION\" id=\"__EVENTVALIDATION\" value=\"(?<vs>[^\"]*)";
            string eventValidStr = Regex.Match(htmlSrc, eventValidRegStr, RegexOptions.IgnoreCase).Result("${vs}");

            this._eventValidState = eventValidStr;
            //this._viewState = viewStateStr;
        }

        /// <summary>
        /// 获取基于ASP.NET翻页控件的页面信息
        /// </summary>
        /// <param name="url">页面URL</param>
        /// <param name="pageCtrlName">翻页控件的名称</param>
        /// <param name="page">需要下载的页面数</param>
        /// <returns></returns>
        public string GetPageInfo(string url,  int page, string pageCtrlName = "AspNetPager1")
        {
            System.Net.WebClient webclient = new WebClient();
            System.Collections.Specialized.NameValueCollection postparams = new System.Collections.Specialized.NameValueCollection();
            postparams.Add("__VIEWSTATE", this._viewState);
            postparams.Add("__EVENTVALIDATION", this._eventValidState);
            postparams.Add("__EVENTTARGET", pageCtrlName);
            postparams.Add("__EVENTARGUMENT", page.ToString());

            webclient.Headers.Add("ContentType", "application/x-www-form-urlencoded");

            try
            {
                byte[] bytes = webclient.UploadValues(url, "POST", postparams);
                string srcString = Encoding.UTF8.GetString(bytes);
                return srcString;
            }
            catch (Exception er)
            {
                return "";
            }
        }
    }
}
