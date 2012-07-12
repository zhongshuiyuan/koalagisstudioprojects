using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Drawing.Drawing2D;
using System.Drawing;
using System.Net;

namespace createimage
{
    class Program
    {
        static void Main(string[] args)
        {
            int size = 256;
            int row = 8;
            int col = 15;
            int widht = col * size;
            int height = row * size;
            //Bitmap bmp = new Bitmap(widht, height);
            Bitmap bmp = new Bitmap(widht, height, System.Drawing.Imaging.PixelFormat.Format32bppArgb);


            //百度
            //int startRow = 27497;
            //int startCol = 104486;

            //杭州规划局
            //int startRow = 433;
            //int startCol = 423;

            //杭州规划局新
            int startRow = 146416;
            int startCol = 76776;

            Graphics g = Graphics.FromImage(bmp);

            int iCounter = 0;
            Pen pen = new Pen( Color.Red, 1.0f);
            Font font = new Font( FontFamily.GenericSerif, 10);
            Brush brush = new SolidBrush( Color.Blue);
            for (int i = 0; i < row; i++)
            {
                for (int j = 0; j < col; j++)
                {
                    try
                    {
                   // http://q8.baidu.com/it/u=x=104486;y=27497;z=19;v=011;type=web&fm=44 
                    //http://220.191.211.111/ArcGIS/rest/services/ghj_map/MapServer/tile/9/146416/76776.png
                        string url = string.Format("http://220.191.211.111/ArcGIS/rest/services/ghj_map/MapServer/tile/9/{0}/{1}.png", startRow + i, startCol + j);
                        //string url = string.Format("http://service.hzplanning.gov.cn/GHJMapServers/Map.aspx/tile/10/{0}/{1}", startRow + i, startCol + j);
                        //string url = string.Format("http://q8.baidu.com/it/u=x={1};y={0};z=19;v=011;type=web&fm=44", startRow - i, startCol + j);
                        WebRequest request = WebRequest.Create(url);
                        WebResponse response = request.GetResponse();
                        Bitmap img = new Bitmap(response.GetResponseStream());

                        Bitmap bmp2 = new Bitmap(img);

                        g.DrawImage(bmp2, j * size, i * size);

                        g.DrawRectangle(pen, j * size, i * size, 256, 256);
                        g.DrawString(string.Format("{0}-{1}", startRow + i, startCol + j), font, brush, j * size + 20, i * size + 20);
                    }
                    catch (Exception er)
                    {
                        Console.WriteLine(er.Message);
                    }

                    Console.WriteLine(iCounter);
                    iCounter++;
                }
            }

            bmp.Save("D:\\ghj2010.jpg");
        }


        static void CreateXYExcel()
        {

        }
    }
}
