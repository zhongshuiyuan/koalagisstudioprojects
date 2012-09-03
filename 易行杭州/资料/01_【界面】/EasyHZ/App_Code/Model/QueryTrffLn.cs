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
using System.Collections.Generic;
using Zjgis.Db;
    /// <summary>
    /// 查询线路信息类
    /// </summary>
    public class QueryTrffLn
    {
        DbOperation dbOperation = new DbOperation("PublicTrafficConnectionString");
        // 通过模糊查询得到线路信息的集合，因为可能会查询到几条线路
        public String QueryTrffId(String pName,int from,int to)
        {
            String resultStr = "";
            // TrffLnInfo是临时的表，name是临时字段表示路线名，id也是临时字段表示路线的唯一标识            
            DataTable ptable = dbOperation.ExecuteQuery("select * from BUSLINE where name like '%"
                    + pName + "%'");
            try
            {
                //int nameIndex = ptable.Columns.IndexOf("name");
                //int idIndex = ptable.Columns.IndexOf("id");
                //int EnvIndex = ptable.Columns.IndexOf("Env");
                //foreach(DataRow rs in ptable.Rows)
                //{
                //    String Name = rs[nameIndex].ToString();
                //    String Id = rs[idIndex].ToString();
                //    String Env = rs[EnvIndex].ToString();
                //    resultStr = resultStr + Name + "," + Id + "," + Env + "&";
                //}

                string json = "{{'NUM':{0},'RESULTSET':[{1}]}}";
                string lineFormat = "{{'ID':'{0}','NAME':'{1}','EXTENT':'{2}','STATIONS':[{3}],'PRICE':'{4}','COORDS':'{5}','LENGTH':{6}}}";

                if (ptable.Rows.Count == 0) resultStr = "{NUM:0,RESULTSET:[]}";
                else
                {
                    DataTable dt = this.getPageResult(ptable, from, to);
                    int count = dt.Rows.Count;
                    string[] lines = new string[count];

                    for (int i = 0; i < count; i++)
                    {
                        DataRow rs = dt.Rows[i];
                        string lineId=rs["ID"].ToString();
                        //路径总长
                        double totalLen = 0.0;
                        string totalArcs = "";

                        //查询经过的站点
                        string[] stations = rs["NODE"].ToString().Split(";".ToCharArray());
                        string sql = "select * from BUSSTATION B where ID in ('" + string.Join("','", stations) + "') ORDER BY CASE B.ID ";
                        for (int j = 0; j < stations.Length; j++) {
                            sql += " WHEN '"+stations[j]+"' THEN "+(j+1).ToString();
                        }
                        sql += " END ";

                        DataTable dt2 = dbOperation.ExecuteQuery(sql);
                        if (dt2.Rows.Count == 0) { return ""; }
                        stations = new string[dt2.Rows.Count];
                        string stationFormater = "{{'ID':'{0}','NAME':'{1}','COORDS':'Point({2})'}}";//,'ARCS':[{3}]
                        for (int j = 0; j < dt2.Rows.Count; j++)
                        {
                            //获取两站点间的实际线路
                            if (j != dt2.Rows.Count - 1)
                            {
                                string node_s = dt2.Rows[j]["ID"].ToString();
                                string node_e = dt2.Rows[j + 1]["ID"].ToString();
                                sql = "select * from BUSLINECOORDS where STARTID='" + node_s + "'" + " AND ENDID='" + node_e + "' AND STAID='" + lineId + "'";
                                DataTable dt3=dbOperation.ExecuteQuery(sql);
                                if(dt3.Rows.Count!=0){
                                    totalArcs+=dt3.Rows[0]["COORDS"].ToString()+";";
                                    totalLen+=double.Parse(dt3.Rows[0]["LENGTH"].ToString());
                                }
                                dt3=null;
                            }
                            stations[j] = string.Format(stationFormater, dt2.Rows[j]["ID"].ToString(), dt2.Rows[j]["名称"].ToString(), dt2.Rows[j]["COORDS"].ToString().Replace(","," "));
                        }

                        //处理坐标串为WKT格式
                        totalArcs = totalArcs.Substring(0, totalArcs.Length - 1);
                        totalArcs=totalArcs.Replace(",", " ");
                        totalArcs=totalArcs.Replace(";", ",");
                        totalArcs = "LINESTRING(" + totalArcs + ")";

                        lines[i] = string.Format(lineFormat, rs["ID"].ToString(), rs["NAME"].ToString(), rs["ENV"].ToString(), string.Join(",", stations), rs["PRICE"].ToString(), totalArcs, totalLen.ToString());
                    }

                    

                    resultStr = string.Format(json, ptable.Rows.Count.ToString(), string.Join(",", lines));
                }
            }
            catch (Exception e)
            {
                resultStr = e.Message;
            }

            return resultStr;

            //if (resultStr.Trim().Length == 0)
            //    return "";
            //else
            //    return resultStr.Substring(0, resultStr.Length - 1);
        }

        // 通过BUSLINE的唯一id号，返回查询到的BUSLINE的坐标串
        public String QueryTrff(String id)
        {
            String AllNodeStr = "";
            String StationNodeStr = "";
            String Node = "";
            // TrffLnInfo是临时的表，name是临时字段表示路线名，id也是临时字段表示路线的唯一标识
            DataTable ptable = dbOperation.ExecuteQuery("select * from BUSLINE where id='" + id + "'");
            try
            {
                int nodeIndex = ptable.Columns.IndexOf("node");
                int coordsIndex = ptable.Columns.IndexOf("coords");
                foreach (DataRow rs in ptable.Rows)
                {
                    Node = rs[nodeIndex].ToString();
                    String[] NodeArr = Node.Split(';');
                    for (int i = 0; i < NodeArr.Length; i++)
                    {
                        if (i != NodeArr.Length - 1)
                        {
                            DataTable RsCoords = dbOperation.ExecuteQuery("select * from BUSLINE坐标 where staid='"
                                            + id + "' and startid='" + NodeArr[i] + "'");
                            if (RsCoords.Rows.Count > 0)
                            {
                                String Coords = RsCoords.Rows[0][RsCoords.Columns.IndexOf("coords")].ToString();
                                String[] CoordsArr = Coords.Split(';');
                                if (i == 0)
                                {
                                    AllNodeStr = Coords;
                                    StationNodeStr = CoordsArr[0];
                                    if (NodeArr.Length == 2)
                                    {
                                        StationNodeStr = CoordsArr[0] + ";"
                                                + CoordsArr[CoordsArr.Length - 1];
                                    }
                                }
                                else
                                {
                                    for (int j = 0; j < CoordsArr.Length; j++)
                                    {
                                        if (j != 0)
                                            AllNodeStr = AllNodeStr + ";"
                                                    + CoordsArr[j];
                                    }

                                    if (i == NodeArr.Length - 2)
                                    {
                                        StationNodeStr = StationNodeStr + ";"
                                                + CoordsArr[0] + ";"
                                                + CoordsArr[CoordsArr.Length - 1];

                                    }

                                    else
                                    {
                                        StationNodeStr = StationNodeStr + ";"
                                                + CoordsArr[0];

                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }
            return Node + "&" + AllNodeStr + "&" + StationNodeStr;
        }

        // 返回一个BUSSTATION所经过的所有公交路线的唯一id的字符串,输入的是站点的唯一标识id
        public String QueryLnOnSta(String id)
        {
            String resultStr = "";

            DataTable ptable = dbOperation.ExecuteQuery("select * from BUSLINE");
            try
            {
                int nameIndex = ptable.Columns.IndexOf("name");
                int idIndex = ptable.Columns.IndexOf("id");
                int nodeIndex = ptable.Columns.IndexOf("node");
                int EnvIndex = ptable.Columns.IndexOf("Env");
                foreach (DataRow rs in ptable.Rows)
                {
                    String Lineid = rs[idIndex].ToString();
                    String NodeStr = rs[nodeIndex].ToString();
                    String Env = rs[EnvIndex].ToString();
                    String Name = rs[nameIndex].ToString();
                    String[] NodeArr = NodeStr.Split(';');
                    for (int i = 0; i < NodeArr.Length; i++)
                    {
                        if (id == NodeArr[i])
                        {
                            resultStr = resultStr + Name + "," + Lineid + "," + Env + "&";
                        }
                    }
                }
            }
            catch (Exception e)
            {
                resultStr = e.Message;
            }

            if (resultStr.Trim().Length == 0)
                return "";
            else
                return resultStr.Substring(0, resultStr.Length - 1);
        }

        // 查询的是BUSSTATION，返回BUSSTATION唯一id的字符串
        public String QueryStation(String pName,int from ,int to)
        {
            String resultStr = "";
            // StationInfo是临时的表，name是临时字段表示路线名，id也是临时字段表示路线的唯一标识
            DataTable ptable = dbOperation.ExecuteQuery("select * from BUSSTATION where 名称 like '%"+ pName + "%'");
            try
            {
                //int idIndex = ptable.Columns.IndexOf("id");
                //foreach (DataRow rs in ptable.Rows)
                //{
                //    String Staid = rs[idIndex].ToString();
                //    resultStr = resultStr + Staid + ";";
                //}

                string json="{{NUM:{0},RESULTSET:[{1}]}}";
                string stationFormat = "{{'ID':'{0}','NAME':'{1}','COORDS':'Point({2})','LINES':[{3}]}}";

                if (ptable.Rows.Count == 0) resultStr = "{NUM:0,RESULTSET:[]}";
                else {
                    DataTable dt = this.getPageResult(ptable,from,to);
                    int count = dt.Rows.Count;
                    string[] stations = new string[count];

                    for (int i = 0; i < count; i++)
                    {
                        DataRow rs = dt.Rows[i];

                        //查询进过的线路
                        string[] lines = rs["LINE"].ToString().Split(",".ToCharArray());
                        DataTable dt2 = dbOperation.ExecuteQuery("select * from BUSLINE where ID in ('" + string.Join("','", lines) + "')");
                        if (dt2.Rows.Count == 0) { return ""; }
                        lines=new string[dt2.Rows.Count];
                        string lineFormater = "{{'ID':'{0}','NAME':'{1}','ALIAS':'{2}'}}";
                        for(int j=0;j<dt2.Rows.Count;j++){
                            lines[j] = string.Format(lineFormater, dt2.Rows[j]["ID"].ToString(), dt2.Rows[j]["NAME"].ToString(), dt2.Rows[j]["ALIASNAME"].ToString());
                        }

                        stations[i] = string.Format(stationFormat, rs["ID"].ToString(), rs["STATION"].ToString(), rs["COORDS"].ToString().Replace(","," "),string.Join(",",lines));
                    }
                    resultStr = string.Format(json,ptable.Rows.Count.ToString(),string.Join(",", stations));
                }
            }
            catch (Exception e)
            {
                //log.error(e.Message);
            }
            return resultStr;
            //if (resultStr.Trim().Length == 0)
            //    return "";
            //else
            //    return resultStr.Substring(0, resultStr.Length - 1);
        }

        //对查询结果进行分页
        public DataTable getPageResult(DataTable dt ,int from,int to) { 
            if(dt.Rows.Count==0)    return null;

            int count=dt.Rows.Count-1;

            //首先预处理，确保from,to均大于0，切to>=from
            if (from < 0) from = 0;
            if (to < 0) to = 0;

            //确保to大于from
            if (from > to) {
                int tmp = from;
                from = to;
                to = tmp;
            }

            //分情况处理from ,to
            if ((from == 0 && to == 0) || (from == to && from > count))
            {
                from = 0;
                to = count;
            }
            else if (from==to && to<=count) {
                from = to;
            }else if(count<from){
                from = 0; to = count;
            }
            else if (count >= from && count < to) {
                to = count;
            }

            DataTable dt2 = dt.Clone();            
            for (int i = from; i <= to; i++) {
                dt2.ImportRow(dt.Rows[i]);
            }

            return dt2;
        }

        // 查询BUSSTATION名称和id号
        public String QueryStaNameId(String pName)
        {
            String resultStr = "";
            // StationInfo是临时的表，name是临时字段表示路线名，id也是临时字段表示路线的唯一标识
            DataTable ptable = dbOperation.ExecuteQuery("select * from BUSSTATION where 名称 like '%" + pName + "%'");
            try
            {
                int idIndex = ptable.Columns.IndexOf("id");
                int nameIndex = ptable.Columns.IndexOf("名称");
                foreach (DataRow rs in ptable.Rows)
                {
                    String Staid = rs[idIndex].ToString();
                    String Name = rs[nameIndex].ToString();
                    resultStr = resultStr + Name + ";" + Staid + "&";
                }
            }
            catch (Exception e)
            {
                //log.error(e.Message);
            }

            if (resultStr.Trim().Length == 0)
                return "";
            else
                return resultStr.Substring(0, resultStr.Length - 1);
        }

        public String QueryStaNameIdCoods(String pName)
        {
            String resultStr = "";
            // StationInfo是临时的表，name是临时字段表示路线名，id也是临时字段表示路线的唯一标识
            DataTable ptable = dbOperation.ExecuteQuery("select * from BUSSTATION where 名称 like '%"
                    + pName + "%'");
            try
            {
                int idIndex = ptable.Columns.IndexOf("id");
                int nameIndex = ptable.Columns.IndexOf("名称");
                int coordsIndex = ptable.Columns.IndexOf("coords");
                foreach (DataRow rs in ptable.Rows)
                {
                    String Staid = rs[idIndex].ToString();
                    String Name = rs[nameIndex].ToString();
                    String Coords = rs[coordsIndex].ToString();
                    resultStr = resultStr + Name + ";" + Staid + ";" + Coords + "&";
                }
            }
            catch (Exception e)
            {
                //log.error(e.Message);
            }

            if (resultStr.Trim().Length == 0)
                return "";
            else
                return resultStr.Substring(0, resultStr.Length - 1);
        }

        // 通过地名查询BUSSTATION的id
        private String PlaceNameToSta(String PNStr)
        {
            String RtStr = "";

            DataTable ptable = dbOperation.ExecuteQuery("select * from 地名 where name like '%"
                    + PNStr + "%'");

            List<string> Vpn = new List<string>();
            List<string> Vsta = new List<string>();

            try
            {
                int nameIndex = ptable.Columns.IndexOf("name");
                int coordsIndex = ptable.Columns.IndexOf("coords");
                foreach (DataRow rs in ptable.Rows)
                {
                    String coords = rs[coordsIndex].ToString();
                    String name = rs[nameIndex].ToString();
                    int x = Convert.ToInt32(coords.Split(',')[0]);
                    int y = Convert.ToInt32(coords.Split(',')[1]);
                    Vpn.Add(x.ToString() + "," + y.ToString() + "," + name);
                }
                
                DataTable RsSta = dbOperation.ExecuteQuery("select * from BUSSTATION");
                int idIndex = RsSta.Columns.IndexOf("id");
                coordsIndex = RsSta.Columns.IndexOf("coords");
                foreach (DataRow rs in RsSta.Rows)
                {
                    String coords = rs[coordsIndex].ToString();
                    String id = rs[idIndex].ToString();
                    int x = Convert.ToInt32(coords.Split(',')[0]);
                    int y = Convert.ToInt32(coords.Split(',')[1]);
                    Vsta.Add(x.ToString() + "," + y.ToString() + "," + id);
                }
            }
            catch (Exception e)
            {

            }

            return CompareVector(Vpn, Vsta);
        }

        private String CompareVector(List<string> Vpn, List<string> Vsta)
        {
            String RsStr = "";
            for (int i = 0; i < Vpn.Count; i++)
            {
                String CoordStr = Vpn[i];
                String[] Arr = CoordStr.Split(',');
                int x = Convert.ToInt32(Arr[0]);
                int y = Convert.ToInt32(Arr[1]);
                String name = Arr[2];
                bool addName = false;
                for (int j = 0; j < Vsta.Count; j++)
                {
                    String CoordStrT = Vsta[j];
                    String[] ArrT = CoordStrT.Split(',');
                    int xT = Convert.ToInt32(ArrT[0]);
                    int yT = Convert.ToInt32(ArrT[1]);
                    String id = ArrT[2];
                    //if (id.equals("143"))
                    if (((x - 500) < xT) && (xT < (x + 500))
                            && ((y - 500) < yT) && (yT < (y + 500)))
                    {
                        if (addName)
                            RsStr += id + ",";
                        else
                        {
                            RsStr += name + ";" + id + ",";
                            addName = true;
                        }
                    }
                }
                if (RsStr.Trim().Length == 0)
                {
                }
                else
                    RsStr = RsStr.Substring(0, RsStr.Length - 1) + "&";
            }


            if (RsStr.Trim().Length == 0)
                return "";
            else
                return RsStr.Substring(0, RsStr.Length - 1);
        }

        // 公交换乘的模糊查询
        public String GetAllStaId(String pName)
        {
            String RsStr = "";
            String StaNameStr = QueryStaNameId(pName);
            String PnNameStr = PlaceNameToSta(pName);
            if ((StaNameStr.Trim() != "") && (PnNameStr.Trim() != ""))
            {
                RsStr = StaNameStr + "&" + PnNameStr;
            }
            if ((StaNameStr.Trim() == "") && (PnNameStr.Trim() != ""))
            {
                RsStr = PnNameStr;
            }

            if ((StaNameStr.Trim() != "") && (PnNameStr.Trim() == ""))
            {
                RsStr = StaNameStr;
            }

            return RsStr;
        }

        public String QueryPnNameId(String PNStr, String QXName)
        {
            String id = "";
            String name = "";
            String RtStr = "";
            DataTable ptable = dbOperation.ExecuteQuery("select * from pnref where QXName = '" + QXName + "' and name like '%"
                    + PNStr + "%'");
            try
            {
                int nameIndex = ptable.Columns.IndexOf("name");
                int idIndex = ptable.Columns.IndexOf("id");
                foreach (DataRow rs in ptable.Rows)
                {
                    id = rs[idIndex].ToString();
                    name = rs[nameIndex].ToString();
                    RtStr += name + ";" + id + "&";
                }
            }
            catch (Exception e)
            {

            }

            if (RtStr.Trim().Length == 0)
                return "";
            else
                return RtStr.Substring(0, RtStr.Length - 1);
        }

        public String QueryPnNameId2(String PNStr, String QXName)
        {
            String RtStr = "";
            DataTable ptable = dbOperation.ExecuteQuery("select * from pnref where QXName = '" + QXName + "' and name = '"
                    + PNStr + "'");
            try
            {
                int nameIndex = ptable.Columns.IndexOf("name");
                int idIndex = ptable.Columns.IndexOf("id");
                int rcoordsIndex = ptable.Columns.IndexOf("rcoords");
                foreach (DataRow rs in ptable.Rows)
                {
                    string id = rs[idIndex].ToString();
                    string name = rs[nameIndex].ToString();
                    String coords = rs[rcoordsIndex].ToString();
                    if (id.Trim() != "")
                        RtStr += name + ";" + id + ";" + coords + "&";
                }
            }
            catch (Exception e)
            {

            }

            if (RtStr.Trim().Length == 0)
                return "";
            else
                return RtStr.Substring(0, RtStr.Length - 1);
        }

        private String OnePnToSta(int x, int y)
        {
            String RtStr = "";
            DataTable ptable = dbOperation.ExecuteQuery("select * from BUSSTATION");
            try
            {
                int idIndex = ptable.Columns.IndexOf("id");
                int coordsIndex = ptable.Columns.IndexOf("coords");
                foreach (DataRow rs in ptable.Rows)
                {
                    String coords = rs[coordsIndex].ToString();
                    int xSta = Convert.ToInt32(coords.Split(',')[0]);
                    int ySta = Convert.ToInt32(coords.Split(',')[1]);
                    if (((x - 500) < xSta) && (xSta < (x + 200))
                            && ((y - 200) < ySta) && (ySta < (y + 200)))
                    {
                        RtStr += rs[idIndex].ToString() + ",";
                    }
                }
            }
            catch (Exception e)
            {

            }

            if (RtStr.Trim().Length == 0)
                return "";
            else
                return RtStr.Substring(0, RtStr.Length - 1);
        }

        // 查询的是BUSSTATION，返回BUSSTATION的名称或坐标字符串
        public String QueryStationByid(String id)
        {
            String resultStr = "";
            // StationInfo是临时的表，name是临时字段表示路线名，id也是临时字段表示路线的唯一标识
            DataTable ptable = dbOperation.ExecuteQuery("select * from BUSSTATION where id='" + id + "'");
            try
            {
                int nameIndex = ptable.Columns.IndexOf("名称");
                //int coordsIndex = ptable.Columns.IndexOf("coords");
                //foreach (DataRow rs in ptable.Rows)
                //{
                //    String Name = rs[nameIndex].ToString();
                //    String StaCoords = rs[coordsIndex].ToString();
                //    resultStr = Name + ":" + StaCoords;
                //}
                string json = "{{'NUM':{0},'RESULTSET':[{1}]}}";
                if (ptable.Rows.Count == 0) resultStr = "{NUM:0,RESULTSET:[]}";
                else
                { 
                    
                }
            }
            catch (Exception e)
            {
                //log.error(e.getMessage());
            }

            return resultStr;
        }
    }