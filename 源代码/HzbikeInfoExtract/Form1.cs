using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace KoalaGIS.EasyHz.BikeInfoExtractor
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            //KoalaGIS.EasyHz.Utils.BikeExtract test = new Utils.BikeExtract();
            //test.Test("http://www.hzbus.cn/Page/NearbyBicyle.aspx?w=500&x=120.19879038464029&y=30.28017029916467");

            KoalaGIS.EasyHz.Utils.BikeExtract grasp = new Utils.BikeExtract();
            grasp.PageInfoEvent += new Utils.PageInfoHandler(grasp_PageInfoEvent);
            grasp.ExportData("D:");

            MessageBox.Show("哇嘎嘎！抓取完成了！");
        }

        void grasp_PageInfoEvent(int total, int cur)
        {
            this.progressBar1.Value = cur;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            this.progressBar1.Maximum = 232;
            this.progressBar1.Minimum = 0;
            
            //KoalaGIS.EasyHz.Utils.AspNetPageGrap grap = new Utils.AspNetPageGrap();
            //grap.LoadViewStateInfo("http://www.hzbus.cn/Page/BicyleNearby.aspx?w=50&rnd=2");
            //string result = grap.GetPageInfo("http://www.hzbus.cn/Page/BicyleNearby.aspx?w=50&rnd=2", 3, 4);
        }
    }
}
