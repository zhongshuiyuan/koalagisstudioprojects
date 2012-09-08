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
    /// 公交换乘类
    /// </summary>
    public class TrafficChange
    {
        DbOperation dbOperation = new DbOperation("PublicTrafficConnectionString");
        public List<RouteInfo> GetRtInfoColl()
        {
            List<RouteInfo> AllRtVec = new List<RouteInfo>();
            DataTable ptable = dbOperation.ExecuteQuery("select * from BUSLINE");
            try
            {
                int nameIndex = ptable.Columns.IndexOf("name");
                int idIndex = ptable.Columns.IndexOf("id");
                int nodeIndex = ptable.Columns.IndexOf("node");
                int priceIndex = ptable.Columns.IndexOf("price");
                foreach(DataRow rs in ptable.Rows)
                {
                    RouteInfo RtInfo = new RouteInfo();
                    RtInfo.setPrice(Convert.ToSingle(rs[priceIndex]));
                    RtInfo.setName(rs[nameIndex].ToString());
                    RtInfo.setNode(rs[nodeIndex].ToString());
                    RtInfo.setId(rs[idIndex].ToString());
                    AllRtVec.Add(RtInfo);
                }
            }
            catch (Exception e)
            {

            }

            return AllRtVec;
        }

        public List<RouteResult> ZhiDa(String Startid, String Endid, List<RouteInfo> RtInfoColl)
        {
            List<RouteResult> RtRsColl = new List<RouteResult>();
            for (int i = 0; i < RtInfoColl.Count; i++)
            {
                String NodeStr = RtInfoColl[i].getNode();
                String[] NodeArr = NodeStr.Split(';');
                String Rtid = RtInfoColl[i].getId();
                int StartInt = -1;
                int EndInt = -1;
                for (int j = 0; j < NodeArr.Length; j++)
                {
                    if (Startid == NodeArr[j])
                        StartInt = j;
                    if (Endid == NodeArr[j])
                        EndInt = j;
                }

                if ((StartInt > -1) && (EndInt > -1) && (EndInt > StartInt))
                {
                    RouteResult RtRs = new RouteResult();
                    String RtNodes = GetIdsFromRt(Startid, Endid, NodeStr);
                    RtRs.setNodesJiao(Startid + ";" + Endid);
                    RtRs.setRoutesStr(Rtid);
                    RtRs.setAllRtName(GetAllRtName(Rtid));
                    RtRs.setLength(GetAlllen(RtNodes, Rtid));
                    RtRs.setPrice(RtInfoColl[i].getPrice());
                    RtRs.setAllCoords(GetAllCoords(RtNodes, Rtid));
                    RtRs.setNodesCoords(QueryStationByid(Startid + "," + Endid));
                    RtRs.setAllNodesName(GetAllStaName(Startid + ";" + Endid));
                    RtRsColl.Add(RtRs);
                }

            }

            return RtRsColl;
        }

        private double GetAllPrice(String RouteIdStr)
        {
            String[] RtIdArr = RouteIdStr.Split(';');
            double Price = 0;
            for (int i = 0; i < RtIdArr.Length; i++)
            {
                try
                {
                    DbOperation dbOperation = new DbOperation("PublicTrafficConnectionString");
                    DataTable ptable = dbOperation.ExecuteQuery("Select * from BUSLINE where id='"
                            + RtIdArr[i] + "'");
                    if(ptable.Rows.Count > 0)
                        Price = Price + Convert.ToSingle(ptable.Rows[0][ptable.Columns.IndexOf("Price")]);
                }
                catch (Exception e)
                {

                }
            }
            return Price;
        }

        private int GetAlllen(String NodeStr, String RouteIdStr)
        {
            String[] NodeArr = NodeStr.Split('&');
            String[] RtIdArr = RouteIdStr.Split(';');
            int Len = 0;
            for (int i = 0; i < RtIdArr.Length; i++)
            {
                String AllPnt = NodeArr[i];
                Len = Len + GetlenOne(AllPnt, RtIdArr[i]);
            }
            return Len;
        }

        // 得到一条线路两个站点间的其它站点，也包括它们自己（起始点和终止点）
        private String GetIdsFrom(String StartId, String EndId, String RouteId)
        {
            String ResultStr = "";
            try
            {
                DataTable ptable = dbOperation.ExecuteQuery("Select * from BUSLINE where id='"
                        + RouteId + "'");
                String NodeStr = "";

                if(ptable.Rows.Count > 0)
                    NodeStr = ptable.Rows[0][ptable.Columns.IndexOf("Node")].ToString();
                
                String[] NodeArr = NodeStr.Split(';');

                int StartInt = -1;
                int EndInt = -1;
                for (int j = 0; j < NodeArr.Length; j++)
                {
                    if (StartId == NodeArr[j])
                        StartInt = j;
                    if (EndId == NodeArr[j])
                        EndInt = j;
                }

                if ((StartInt > -1) && (EndInt > -1) && (EndInt > StartInt))
                {
                    for (int j = StartInt; j <= EndInt; j++)
                    {
                        ResultStr = ResultStr + NodeArr[j] + ";";
                    }
                }
            }
            catch (Exception e)
            {

            }

            return ResultStr.Substring(0, ResultStr.Length - 1);
        }

        private String GetIdsFromRt(String StartId, String EndId,
                String RouteNodeStr)
        {
            String ResultStr = "";

            String[] NodeArr = RouteNodeStr.Split(';');

            int StartInt = -1;
            int EndInt = -1;
            for (int j = 0; j < NodeArr.Length; j++)
            {
                if (StartId == NodeArr[j])
                    StartInt = j;
                if (EndId == NodeArr[j])
                    EndInt = j;
            }

            if ((StartInt > -1) && (EndInt > -1) && (EndInt > StartInt))
            {
                for (int j = StartInt; j <= EndInt; j++)
                {
                    ResultStr = ResultStr + NodeArr[j] + ";";
                }
            }
            if (ResultStr.Length > 0)
                return ResultStr.Substring(0, ResultStr.Length - 1);
            else
                return "";
        }

        // 得到其中一段的长度
        private int GetlenOne(String NodeStr, String Routeid)
        {
            String[] NodeArr = NodeStr.Split(';');
            int Len = 0;
            for (int i = 0; i < NodeArr.Length - 1; i++)
            { 
                // RouteCoords为存储BUSLINE节点坐标的表名,Staid是BUSLINE的唯一标识
                DataTable ptable = dbOperation.ExecuteQuery("Select * from BUSLINECOORDS where startid='"
                        + NodeArr[i] + "' and endid='" + NodeArr[i + 1]
                        + "' and Staid='" + Routeid + "'");
                try
                {
                    if (ptable.Rows.Count > 0)
                        Len = Len + Convert.ToInt32(ptable.Rows[0][ptable.Columns.IndexOf("Length")]);

                }
                catch (Exception e)
                {

                }
            }

            return Len;
        }

        private String GetAllCoords(String NodeStr, String RouteIdStr)
        {
            String[] NodeArr = NodeStr.Split('&');
            String[] RtIdArr = RouteIdStr.Split(';');
            String AllCoords = "";
            for (int i = 0; i < RtIdArr.Length; i++)
            {
                String AllPnt = NodeArr[i];
                if (i == 0)
                    AllCoords = AllCoords + GetCoordsOne(AllPnt, RtIdArr[i], true)
                            + ";";
                else
                    AllCoords = AllCoords + GetCoordsOne(AllPnt, RtIdArr[i], false)
                            + ";";
            }
            return AllCoords.Substring(0, AllCoords.Length - 1);
        }

        // 得到其中一段的坐标串
        private String GetCoordsOne(String NodeStr, String Routeid,
                bool IsFirstCoords)
        {
            String[] NodeArr = NodeStr.Split(';');
            String CoordsStr = "";
            for (int i = 0; i < NodeArr.Length - 1; i++)
            { // RouteCoords为存储BUSLINE节点坐标的表名,Staid是BUSLINE的唯一标识
                DataTable ptable = dbOperation.ExecuteQuery("Select * from BUSLINECOORDS where startid='"
                        + NodeArr[i] + "' and endid='" + NodeArr[i + 1]
                        + "' and Staid='" + Routeid + "'");
                try
                {
                    if (ptable.Rows.Count > 0)
                    {
                        if (i == 0)
                            CoordsStr = CoordsStr + ptable.Rows[0][ptable.Columns.IndexOf("coords")].ToString() + ";";
                        else
                        {
                            String pCoords = ptable.Rows[0][ptable.Columns.IndexOf("coords")].ToString();
                            String[] CoordArr = pCoords.Split(';');
                            String Result = "";
                            for (int j = 0; j < CoordArr.Length; j++)
                            {
                                if (j > 0)
                                    Result = Result + CoordArr[j] + ";";
                            }

                            CoordsStr = CoordsStr + Result;
                        }
                    }
                }
                catch (Exception e)
                {

                }
            }

            if (IsFirstCoords)
                return CoordsStr.Substring(0, CoordsStr.Length - 1);
            else
            {
                String pCoords = CoordsStr.Substring(0, CoordsStr.Length - 1);
                String[] CoordArr = pCoords.Split(';');
                String Result = "";
                for (int i = 0; i < CoordArr.Length; i++)
                {
                    if (i > 0)
                        Result = Result + CoordArr[i] + ";";
                }
                return Result.Substring(0, Result.Length - 1);
            }
        }

        public List<RouteResult> Onechange(String Startid, String Endid, List<RouteInfo> RtInfoColl)
        {
            List<RouteResult> RtRsColl = new List<RouteResult>();
            List<RouteInfo> StartidLine = new List<RouteInfo>();
            List<RouteInfo> EndidLine = new List<RouteInfo>();

            for (int i = 0; i < RtInfoColl.Count; i++)
            {
                String StrLine = RtInfoColl[i].getNode();

                if (IsNodeInLine(Startid, StrLine))
                    StartidLine.Add(RtInfoColl[i]);

                if (IsNodeInLine(Endid, StrLine))
                    EndidLine.Add(RtInfoColl[i]);

            }

            for (int j = 0; j < StartidLine.Count; j++)
                for (int k = 0; k < EndidLine.Count; k++)
                {
                    RouteInfo StartRt = StartidLine[j];
                    RouteInfo EndRt = EndidLine[k];
                    String StartLineNodeStr = StartRt.getNode();
                    String EndLineNodeStr = EndRt.getNode();
                    String pJiaodian = IsLineIntersect(StartLineNodeStr,
                            EndLineNodeStr);

                    if ((pJiaodian.Length != 0) && (pJiaodian != Startid)
                            && (pJiaodian != Endid))
                    {
                        String RtNodes1 = GetIdsFromRt(Startid, pJiaodian,
                                StartLineNodeStr);
                        String RtNodes2 = GetIdsFromRt(pJiaodian, Endid,
                                EndLineNodeStr);
                        if ((RtNodes1.Length > 0) && (RtNodes2.Length > 0))
                        {
                            String RouteStartid = StartRt.getId();
                            String RouteEndid = EndRt.getId();
                            RouteResult RtRs = new RouteResult();
                            RtRs.setNodesJiao(Startid + ";" + pJiaodian + ";"
                                    + Endid);
                            RtRs.setRoutesStr(RouteStartid + ";" + RouteEndid);
                            RtRs.setLength(GetAlllen(RtNodes1 + "&" + RtNodes2,
                                    RouteStartid + ";" + RouteEndid));
                            RtRs.setAllRtName(GetAllRtName(RouteStartid + ";"
                                    + RouteEndid));
                            // RtRs.setPrice(GetAllPrice(RouteStartid + ";" +
                            // RouteEndid));
                            RtRs.setPrice(StartRt.getPrice() + EndRt.getPrice());
                            RtRs.setAllCoords(GetAllCoords(RtNodes1 + "&"
                                    + RtNodes2, RouteStartid + ";" + RouteEndid));
                            RtRs.setNodesCoords(QueryStationByid(Startid + ","
                                    + pJiaodian + "," + Endid));
                            RtRs.setAllNodesName(GetAllStaName(Startid + ";"
                                    + pJiaodian + ";" + Endid));
                            RtRsColl.Add(RtRs);
                        }
                    }
                }

            return RtRsColl;
        }

        private String GetAllRtName(String IdStr)
        {
            String Rs = "";
            String[] pIdArr = IdStr.Split(';');

            for (int i = 0; i < pIdArr.Length; i++)
            {   
                DataTable ptable = dbOperation.ExecuteQuery("select * from BUSLINE where id='"
                        + pIdArr[i] + "'");
                try
                {
                    int nameIndex = ptable.Columns.IndexOf("name");
                    foreach (DataRow rs in ptable.Rows)
                    {
                        Rs += rs[nameIndex].ToString() + ";";

                    }
                }
                catch (Exception e)
                {

                }
            }
            return Rs.Substring(0, Rs.Length - 1);
        }

        private String GetAllStaName(String IdStr)
        {
            String Rs = "";
            String[] pIdArr = IdStr.Split(';');

            for (int i = 0; i < pIdArr.Length; i++)
            {
                DataTable ptable = dbOperation.ExecuteQuery("select * from BUSSTATION where id='"
                        + pIdArr[i] + "'");
                try
                {
                    int nameIndex = ptable.Columns.IndexOf("名称");
                    foreach (DataRow rs in ptable.Rows)
                    {
                        Rs += rs[nameIndex].ToString() + ";";

                    }
                }
                catch (Exception e)
                {

                }
            }
            return Rs.Substring(0, Rs.Length - 1);
        }

        public List<RouteResult> Twochange(String Startid, String Endid, List<RouteInfo> RtInfoColl)
        {
            List<RouteResult> RtRsColl = new List<RouteResult>();
            List<RouteInfo> StartidLine = new List<RouteInfo>();
            List<RouteInfo> EndidLine = new List<RouteInfo>();

            //首先将经过起点和终点的路线全部加入内存
            for (int i = 0; i < RtInfoColl.Count; i++)
            {
                String StrLine = RtInfoColl[i].getNode();

                if (IsNodeInLine(Startid, StrLine))
                    StartidLine.Add(RtInfoColl[i]);

                if (IsNodeInLine(Endid, StrLine))
                    EndidLine.Add(RtInfoColl[i]);
            }

            for (int l = 0; l < RtInfoColl.Count; l++)
            {
                RouteInfo pAllRoute = RtInfoColl[l];
                String pAllLineNodeStr = pAllRoute.getNode();

                for (int j = 0; j < StartidLine.Count; j++)
                {
                    RouteInfo StartRt = StartidLine[j];
                    String StartLineNodeStr = StartRt.getNode();
                    String pStJiaodian = IsLineIntersect(StartLineNodeStr,
                            pAllLineNodeStr);

                    if ((pStJiaodian.Length != 0)
                            && (pStJiaodian != Startid)
                            && (pStJiaodian != Endid))
                    {
                        String RtNodes1 = GetIdsFromRt(Startid, pStJiaodian,
                                StartLineNodeStr);
                        if (RtNodes1.Length > 0)
                            for (int k = 0; k < EndidLine.Count; k++)
                            {
                                RouteInfo EndRt = EndidLine[k];
                                String pEndLineNodeStr = EndRt.getNode();
                                String pEndJiaodian = IsLineIntersect(
                                        pAllLineNodeStr, pEndLineNodeStr);
                                if ((pEndJiaodian.Length > 0)
                                        && (pEndJiaodian != Startid)
                                        && (pEndJiaodian != Endid))
                                {
                                    String RtNodes3 = GetIdsFromRt(pEndJiaodian,
                                            Endid, pEndLineNodeStr);
                                    if (RtNodes3.Length > 0)
                                    {
                                        String RtNodes2 = GetIdsFromRt(pStJiaodian,
                                                pEndJiaodian, pAllLineNodeStr);
                                        if (RtNodes2.Length > 0)
                                        {
                                            String RouteStartid = StartRt.getId();
                                            String RouteEndid = EndRt.getId();
                                            String RouteAllid = pAllRoute.getId();
                                            RouteResult RtRs = new RouteResult();
                                            RtRs.setNodesJiao(Startid + ";"
                                                    + pStJiaodian + ";"
                                                    + pEndJiaodian + ";" + Endid);
                                            RtRs.setRoutesStr(RouteStartid
                                                            + ";" + RouteAllid
                                                            + ";" + RouteEndid);
                                            RtRs.setAllRtName(GetAllRtName(RouteStartid
                                                            + ";"
                                                            + RouteAllid
                                                            + ";" + RouteEndid));
                                            RtRs.setLength(GetAlllen(RtNodes1 + "&"
                                                    + RtNodes2 + "&" + RtNodes3,
                                                    RouteStartid + ";" + RouteAllid
                                                            + ";" + RouteEndid));
                                            RtRs.setPrice(pAllRoute.getPrice()
                                                    + StartRt.getPrice()
                                                    + EndRt.getPrice());
                                            RtRs.setAllCoords(GetAllCoords(
                                                            RtNodes1 + "&"
                                                                    + RtNodes2
                                                                    + "&"
                                                                    + RtNodes3,
                                                            RouteStartid + ";"
                                                                    + RouteAllid
                                                                    + ";"
                                                                    + RouteEndid));
                                            RtRs.setNodesCoords(QueryStationByid(Startid
                                                            + ","
                                                            + pStJiaodian
                                                            + ","
                                                            + pEndJiaodian
                                                            + "," + Endid));

                                            RtRs.setAllNodesName(GetAllStaName(Startid
                                                            + ";"
                                                            + pStJiaodian
                                                            + ";"
                                                            + pEndJiaodian
                                                            + ";" + Endid));

                                            RtRsColl.Add(RtRs);
                                        }
                                    }
                                }
                            }
                    }
                }
            }

            return RtRsColl;
        }

        private String IsLineIntersect(String NodeStr1, String NodeStr2)
        {
            if (NodeStr1 == NodeStr2)
                return "";

            String[] Array1 = NodeStr1.Split(';');
            String[] Array2 = NodeStr2.Split(';');

            for (int i = 0; i < Array1.Length; i++)
                for (int j = 0; j < Array2.Length; j++)
                {

                    if (Array1[i] == Array2[j])
                        return Array1[i];
                }

            return "";
        }

        private bool IsNodeInLine(String NodeId, String NodeStr)
        {
            String[] NodeArr = NodeStr.Split(';');

            for (int i = 0; i < NodeArr.Length; i++)
            {
                if (NodeId == NodeArr[i])
                    return true;
            }

            return false;
        }

        // 通过BUSSTATIONid字符串找到坐标串
        private String QueryStationByid(String idStr)
        {
            String resultStr = "";
            // StationInfo是临时的表，name是临时字段表示路线名，id也是临时字段表示路线的唯一标识
            String[] idStrArr = idStr.Split(',');
            for (int i = 0; i < idStrArr.Length; i++)
            {
                DataTable ptable = dbOperation.ExecuteQuery("select * from BUSSTATION where id='" + idStrArr[i] + "'");
                try
                {
                    int coordsIndex = ptable.Columns.IndexOf("coords");
                    foreach (DataRow rs in ptable.Rows)
                    {
                        resultStr = resultStr + rs[coordsIndex].ToString() + ";";
                    }
                }
                catch (Exception e)
                {

                }

            }
            return resultStr.Substring(0, resultStr.Length - 1);
        }
    }