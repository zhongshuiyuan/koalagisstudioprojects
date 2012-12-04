using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BicycleInfoParser{
    /// <summary>
    ///BicycleInfo 的摘要说明
    /// </summary>
    public class BicycleInfo
    {
        public BicycleInfo()
        {
            //
            //TODO: 在此处添加构造函数逻辑
            //
        }
        /// <summary>
        /// 站点名称
        /// </summary>
        public string StationName { get; set; }

        /// <summary>
        /// 站点编号
        /// </summary>
        public string StationID { get; set; }

        /// <summary>
        /// 可借车辆
        /// </summary>
        public int BorrowNum { get; set; }

        /// <summary>
        /// 可还车辆
        /// </summary>
        public int ReturnNum { get; set; }

        /// <summary>
        /// 服务时间
        /// </summary>
        public string ServiceTime { get; set; }

        /// <summary>
        /// 值守状态
        /// </summary>
        public string ServiceState { get; set; }

        /// <summary>
        /// 站点地址
        /// </summary>
        public string StationAddr { get; set; }

        /// <summary>
        /// 站点X坐标
        /// </summary>
        public double X { get; set; }

        /// <summary>
        /// 站点X坐标
        /// </summary>
        public double Y { get; set; }

        /// <summary>
        /// 服务电话
        /// </summary>
        public string ServicePhone { get; set; }

        /// <summary>
        /// 站点备注
        /// </summary>
        public string StationRemarks { get; set; }

        /// <summary>
        /// 将自行车信息以json方式输出
        /// </summary>
        /// <returns></returns>
        public string ToJson()
        {
            return string.Format("{{StationName:'{0}', BorrowNum:'{1}',ReturnNum: '{2}', StationAddr:'{3}', X:{4}, Y:{5}}}", this.StationName, this.BorrowNum, this.ReturnNum,this.StationAddr, this.X, this.Y);
        }

    }
}
