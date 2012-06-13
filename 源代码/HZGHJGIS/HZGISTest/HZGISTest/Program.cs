using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Microsoft.Office.Interop.Excel;

namespace HZGISTest
{
    class Program
    {
        static void Main(string[] args)
        {
            DataQueryServiceClient client = new DataQueryServiceClient();

            string pois = "";
            
            //string pois = client.GetHotPoi();

            //119410000001
            //自行车
           // string pois = client.GetThemeDataFromTable("119410000001");
           //client.

           // string pois = client.Search("", "STAN_NAME", "THEMENAME;X;Y", "VW_PLACENAME", 10);
            pois = client.Search("4303", "ID", "NAME;STATE;CSVRID;CYCAVAIL;CYCBACK;TIME;ADDR;CALL;SERVICE;TYPE", "VW_BIKE", 10);

            //ID，X,Y,站点名称，值守状态，CSVRID,可租数量，可还数量，服务时间，站点地址，服务电话，其他服务，站点备注
            //pois = client.GetPois("ID", "X", "Y", "NAME;STATE;CSVRID;CYCAVAIL;CYCBACK;TIME;ADDR;CALL;SERVICE;TYPE", "VW_BIKE");

            
            
            //client.GetPoiStates("ID", "STATE", "CYCAVAIL;CYCBACK", "VM_BIKE");

            
            
            byte[] bytes = FX.Security.AesCryptography.Decrypt(pois);
            byte[] results = Cellbi.SvZLib.Utils.Decompress(bytes);


            ///////
           FX.Data.DataTable tbResult = FX.Serialization.DataContractSerialization.Deserialize<FX.Data.DataTable>(results) as FX.Data.DataTable;

           //CreateExcelSheet(tbResult);

           // string poi2 = System.Text.Encoding.UTF8.GetString(results);
            client.Close();
        }

        /// <summary>
        /// 将表格生成excel
        /// </summary>
        /// <param name="dt"></param>
        private static void CreateExcelSheet(FX.Data.DataTable dt)
        {
            Microsoft.Office.Interop.Excel.Application app = new Application();
            app.Visible = false;
            Workbook book = app.Workbooks.Add(Type.Missing);
            //Worksheet sheet = (Worksheet)(book.Sheets[1]);

            //生成字段
            for( int i = 0; i < dt.Columns.Count; i++ )
            {
                app.Cells[1,i+1] = dt.Columns[i].Caption;
            }


            //填充数据
            for( int i = 0; i < dt.Rows.Count; i++ )
            {
                for( int j = 0; j < dt.Columns.Count; j++ )
                {
                    app.Cells[i+2,j+1] = dt.Rows[i].Cells[dt.Columns[j].ColumnName].ToString();
                }
            }

            book.SaveAs("E:\\output.xls");

            app.Quit();
            //app.SaveWorkspace("E:\\output.xls");

        }
    }
}
