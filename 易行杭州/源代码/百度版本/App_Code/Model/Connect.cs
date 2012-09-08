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

namespace Zjgis.LSGIS.Main.Model
{
    /// <summary>
    /// 两点连通分析类，主要用于自驾车出行、自定义路线的查询
    /// </summary>
    public class Connect
    {
        private int[,] AdMatrix;
        private int[] Distance;
        private String[] ArcArr;
        private int Mindistance = 0;
        private String CoordsStr = "";
        private String RoadInfo = "";
        private String QXName = "";
        DbOperation dbOperation = new DbOperation("PublicTrafficConnectionString");

        public void GetMatrix(List<string> pPntIdVec, String StartId, String EndId)
        {
            DataTable rsArcStartId = dbOperation.ExecuteQuery("select * from pnref t where id='"
                    + StartId + "' and QXName ='" + QXName + "'");
            String ArcStartId = "";
            String StartIdCoord = "";
            // 起始地名点映射后节点的序号
            int StartIdIndex = -1;
            try
            {
                int arcIndex = rsArcStartId.Columns.IndexOf("arc");
                int nodeindexIndex = rsArcStartId.Columns.IndexOf("nodeindex");
                int CoordsIndex = rsArcStartId.Columns.IndexOf("Coords");
                if (rsArcStartId.Rows.Count > 0)
                {
                    DataRow rowArcStartId = rsArcStartId.Rows[0];
                    ArcStartId = rowArcStartId[arcIndex].ToString();
                    StartIdIndex = Convert.ToInt32(rowArcStartId[nodeindexIndex]);
                    StartIdCoord = rowArcStartId[CoordsIndex].ToString();
                }
            }
            catch (Exception e)
            {

            }

            DataTable rsArcEndId = dbOperation.ExecuteQuery("select * from pnref t where id='"
                    + EndId + "' and QXName ='" + QXName + "'");
            String ArcEndId = "";
            String EndIdCoord = "";
            // 终止地名点映射后节点的序号
            int EndIdIndex = -1;
            try
            {
                int arcIndex = rsArcEndId.Columns.IndexOf("arc");
                int nodeindexIndex = rsArcEndId.Columns.IndexOf("nodeindex");
                int CoordsIndex = rsArcEndId.Columns.IndexOf("Coords");
                if ( rsArcEndId.Rows.Count > 0)
                {
                    DataRow rowArcEndId = rsArcEndId.Rows[0];
                    ArcEndId = rowArcEndId[arcIndex].ToString();
                    EndIdIndex = Convert.ToInt32(rowArcEndId[nodeindexIndex]);
                    EndIdCoord = rowArcEndId[CoordsIndex].ToString();
                }
            }
            catch (Exception e)
            {

            }

            pPntIdVec.Add("p" + StartId);
            pPntIdVec.Add("p" + EndId);

            int j;
            String node_s_Id, node_e_Id;
            DataTable rsNodes = dbOperation.ExecuteQuery("select * from arc_nodes t where QXName ='" + QXName + "'");
            try
            {
                int node_sIndex = rsNodes.Columns.IndexOf("node_s");
                int node_eIndex = rsNodes.Columns.IndexOf("node_e");
                foreach (DataRow rowNodes in rsNodes.Rows)
                {
                    node_s_Id = rowNodes[node_sIndex].ToString();
                    for (j = 0; j < pPntIdVec.Count; j++)
                    {
                        if (pPntIdVec[j] == node_s_Id) break;
                    }
                    if (j == pPntIdVec.Count)
                        pPntIdVec.Add(node_s_Id);

                    node_e_Id = rowNodes[node_eIndex].ToString();
                    for (j = 0; j < pPntIdVec.Count; j++)
                    {
                        if (pPntIdVec[j] == node_e_Id) break;
                    }
                    if (j == pPntIdVec.Count)
                        pPntIdVec.Add(node_e_Id);
                }
            }
            catch (Exception e)
            {

            }

            AdMatrix = new int[pPntIdVec.Count, pPntIdVec.Count];

            for (int i = 0; i < pPntIdVec.Count; i++)
                for (j = 0; j < pPntIdVec.Count; j++)
                {
                    if (i == j)
                        AdMatrix[i,j] = 0;
                    else
                        AdMatrix[i,j] = 99999999;
                }

            DataTable rsArcs = dbOperation.ExecuteQuery("select * from arc_nodes t where QXName ='" + QXName + "'");
            try
            {
                int ArcIndex = rsNodes.Columns.IndexOf("Arc");
                int node_sIndex = rsNodes.Columns.IndexOf("Node_S");
                int node_eIndex = rsNodes.Columns.IndexOf("Node_E");
                int CoordsIndex = rsNodes.Columns.IndexOf("Coords");
                int isdoubleIndex = rsNodes.Columns.IndexOf("isdouble");
                int lengthIndex = rsNodes.Columns.IndexOf("length");
                foreach (DataRow rowArcs in rsArcs.Rows)
                {
                    String Arcid = rowArcs[ArcIndex].ToString();
                    String Node_S = rowArcs[node_sIndex].ToString();
                    String Node_E = rowArcs[node_eIndex].ToString();
                    String CoordsStr = rowArcs[CoordsIndex].ToString();
                    int IsDouble = Convert.ToInt32(rowArcs[isdoubleIndex]);
                    int Arcslength = Convert.ToInt32(rowArcs[lengthIndex]);

                    if ((ArcStartId == ArcEndId) && (Arcid == ArcStartId))
                    {
                        int Startlen = CalLen(CoordsStr, StartIdIndex, StartIdCoord);
                        int Endlen = CalLen(CoordsStr, EndIdIndex, EndIdCoord);
                        int Len = Math.Abs(Startlen - Endlen);
                        if (Startlen < Endlen)
                        {
                            AdMatrix[DbToMatrix("p" + StartId, pPntIdVec),DbToMatrix(
                                    "p" + EndId, pPntIdVec)] = Len;
                            AdMatrix[DbToMatrix(Node_S, pPntIdVec),DbToMatrix("p"
                                    + EndId, pPntIdVec)] = Startlen;
                            AdMatrix[DbToMatrix("p" + EndId, pPntIdVec),DbToMatrix(
                                    Node_E, pPntIdVec)] = Arcslength - Endlen;

                            if (IsDouble > 0)
                            {
                                AdMatrix[DbToMatrix("p" + EndId, pPntIdVec),DbToMatrix(
                                        "p" + StartId, pPntIdVec)] = Len;
                                AdMatrix[DbToMatrix("p" + EndId, pPntIdVec),DbToMatrix(
                                        Node_S, pPntIdVec)] = Startlen;
                                AdMatrix[DbToMatrix(Node_E, pPntIdVec),DbToMatrix(
                                        "p" + EndId, pPntIdVec)] = Arcslength - Endlen;
                            }
                        }
                        else
                        {
                            AdMatrix[DbToMatrix("p" + EndId, pPntIdVec),DbToMatrix(
                                    "p" + StartId, pPntIdVec)] = Len;
                            AdMatrix[DbToMatrix(Node_S, pPntIdVec),DbToMatrix("p"
                                    + EndId, pPntIdVec)] = Endlen;
                            AdMatrix[DbToMatrix("p" + StartId, pPntIdVec),DbToMatrix(
                                    Node_E, pPntIdVec)] = Arcslength - Endlen;

                            if (IsDouble > 0)
                            {
                                AdMatrix[DbToMatrix("p" + StartId, pPntIdVec),DbToMatrix(
                                        "p" + EndId, pPntIdVec)] = Len;
                                AdMatrix[DbToMatrix("p" + EndId, pPntIdVec),DbToMatrix(
                                        Node_S, pPntIdVec)] = Endlen;
                                AdMatrix[DbToMatrix(Node_E, pPntIdVec),DbToMatrix(
                                        "p" + StartId, pPntIdVec)] = Arcslength - Endlen;
                            }
                        }

                        continue;
                    }
                    else
                    {
                        if (ArcStartId == Arcid)
                        {
                            int Startlen = CalLen(CoordsStr, StartIdIndex,
                                    StartIdCoord);
                            AdMatrix[DbToMatrix(Node_S, pPntIdVec),DbToMatrix("p"
                                    + StartId, pPntIdVec)] = Startlen;

                            AdMatrix[DbToMatrix("p" + StartId, pPntIdVec),DbToMatrix(
                                    Node_E, pPntIdVec)] = Arcslength - Startlen;

                            if (IsDouble > 0)
                            {
                                AdMatrix[DbToMatrix("p" + StartId, pPntIdVec),DbToMatrix(
                                        Node_S, pPntIdVec)] = Startlen;

                                AdMatrix[DbToMatrix(Node_E, pPntIdVec),DbToMatrix(
                                        "p" + StartId, pPntIdVec)] = Arcslength - Startlen;
                                ;

                            }
                            continue;
                        }

                        if (ArcEndId == Arcid)
                        {
                            int Endlen = CalLen(CoordsStr, EndIdIndex, EndIdCoord);
                            AdMatrix[DbToMatrix(Node_S, pPntIdVec),DbToMatrix("p"
                                    + EndId, pPntIdVec)] = Endlen;

                            AdMatrix[DbToMatrix("p" + EndId, pPntIdVec),DbToMatrix(
                                    Node_E, pPntIdVec)] = Arcslength - Endlen;

                            if (IsDouble > 0)
                            {
                                AdMatrix[DbToMatrix("p" + EndId, pPntIdVec),DbToMatrix(
                                        Node_S, pPntIdVec)] = Endlen;

                                AdMatrix[DbToMatrix(Node_E, pPntIdVec),DbToMatrix(
                                        "p" + EndId, pPntIdVec)] = Arcslength - Endlen;

                            }
                            continue;
                        }
                    }
                    AdMatrix[DbToMatrix(Node_S, pPntIdVec),DbToMatrix(Node_E,
                            pPntIdVec)] = Arcslength;
                    if (IsDouble > 0)
                        AdMatrix[DbToMatrix(Node_E, pPntIdVec),DbToMatrix(Node_S,
                                pPntIdVec)] = Arcslength;
                }
            }
            catch (Exception e)
            {

            }
        }

        private void Dijkstra(int pBegin, int MatrixLen)
        {
            double MinEdge = 0;
            int Vertex = 0;
            int Edges = 0;
            int[] Visited = new int[MatrixLen];
            Distance = new int[MatrixLen];
            ArcArr = new String[MatrixLen];
            String pStr = "";

            for (int i = 0; i < Distance.Length; i++)
            {
                Distance[i] = AdMatrix[pBegin,i];

                if ((Distance[i] > 0) && (Distance[i] < 99999999))
                    pStr = pBegin.ToString() + "," + i.ToString();
                else
                    pStr = pBegin.ToString();

                ArcArr[i] = pStr;
            }

            Visited[pBegin] = 1;

            while (Edges < MatrixLen - 1)
            {
                Edges++;
                MinEdge = 99999999;

                for (int i = 0; i < MatrixLen; i++)
                {
                    if ((Visited[i] == 0) && (MinEdge > Distance[i]))
                    {
                        Vertex = i;
                        MinEdge = Distance[i];
                    }
                }

                Visited[Vertex] = 1;

                pStr = ArcArr[Vertex];

                for (int i = 0; i < MatrixLen; i++)
                {
                    if ((Visited[i] == 0)
                            && (Distance[Vertex] + AdMatrix[Vertex,i] < Distance[i]))
                    {
                        Distance[i] = Distance[Vertex] + AdMatrix[Vertex,i];
                        ArcArr[i] = pStr + "," + i.ToString();
                    }
                }

            }
        }

        public bool ZDLJFun(String StartId, String EndId, String strQXName)
        {
            List<string> pPntIdVec = new List<string>();
            QXName = strQXName;
            GetMatrix(pPntIdVec, StartId, EndId);
            Dijkstra(DbToMatrix("p" + StartId, pPntIdVec), pPntIdVec.Count);
            Mindistance = Distance[DbToMatrix("p" + EndId, pPntIdVec)];
            // 这个Nodes是pPntIdVec序列号的集合，
            String Nodes = ArcArr[DbToMatrix("p" + EndId, pPntIdVec)];
            if (Nodes.Split(',').Length < 2)
                return false;
            else
            {
                GetCoordsStr(Nodes, pPntIdVec);
                return true;
            }
        }

        // 两个地名点在一个弧段上
        private String GetCoordStrAtOneArc(String Nodes, List<string> pPntIdVec)
        {
            String AllCoords = "";
            String ArcId = "";
            int StartIndex = -1;
            int EndIndex = -1;
            String StartCoord = "";
            String EndCoord = "";
            String[] NodesArr = Nodes.Split(',');
            String Start = pPntIdVec[Convert.ToInt32(NodesArr[0])];
            
            DataTable rsStart = dbOperation.ExecuteQuery("select * from pnref t where id='"
                    + Start.Substring(1, Start.Length) + "'");
            try
            {
                if (rsStart.Rows.Count > 0)
                {
                    ArcId = rsStart.Rows[0][rsStart.Columns.IndexOf("arc")].ToString();
                    StartIndex = Convert.ToInt32(rsStart.Rows[0][rsStart.Columns.IndexOf("nodeindex")]);
                    StartCoord = rsStart.Rows[0][rsStart.Columns.IndexOf("coords")].ToString();
                }
            }
            catch (Exception e)
            {

            }

            String End = pPntIdVec[Convert.ToInt32(NodesArr[1])];
            DataTable rsEnd = dbOperation.ExecuteQuery("select * from pnref t where id='"
                    + End.Substring(1, End.Length) + "'");

            try
            {
                if (rsEnd.Rows.Count > 0)
                {
                    EndIndex = Convert.ToInt32(rsEnd.Rows[0][rsEnd.Columns.IndexOf("nodeindex")]);  //mod zly
                    EndCoord = rsEnd.Rows[0][rsEnd.Columns.IndexOf("coords")].ToString();           //mod zly
                }
            }
            catch (Exception e)
            {

            }

            DataTable rsArc = dbOperation.ExecuteQuery("select * from arc_nodes t where arc='"
                    + ArcId + "'");
            try
            {
                if (rsArc.Rows.Count > 0)
                {
                    AllCoords = rsArc.Rows[0][rsArc.Columns.IndexOf("coords")].ToString();
                    String[] CoordsArr = AllCoords.Split(';');
                    GetRoadInfo(rsArc.Rows[0][rsArc.Columns.IndexOf("roadname")].ToString());
                    AllCoords = "";
                    if (EndIndex > StartIndex)
                    {
                        for (int i = StartIndex + 1; i <= EndIndex; i++)
                            AllCoords = CoordsArr[i] + ";";
                        AllCoords = StartCoord + ";" + AllCoords + EndCoord;
                    }
                    else if (StartIndex > EndIndex)
                    {
                        for (int i = EndIndex + 1; i <= StartIndex; i++)
                            AllCoords = CoordsArr[i] + ";";
                        AllCoords = StartCoord + ";" + AllCoords + EndCoord;
                    }
                    else
                        AllCoords = StartCoord + ";" + EndCoord;
                }
            }
            catch (Exception e)
            {

            }

            return AllCoords;
        }

        private void GetCoordsStr(String Nodes, List<string> pPntIdVec)
        {
            CoordsStr = "";
            String[] NodesArr = Nodes.Split(';');
            if (NodesArr.Length == 2)
            {
                CoordsStr = GetCoordStrAtOneArc(Nodes, pPntIdVec);
                return;
            }
            for (int i = 0; i < NodesArr.Length - 1; i++)
            {
                if ((i == 0) || (i == NodesArr.Length - 2))
                {
                    String pId = "";
                    if (i == 0)
                        pId = (String)pPntIdVec[Convert.ToInt32(NodesArr[i])];
                    else
                        pId = (String)pPntIdVec[Convert.ToInt32(NodesArr[i + 1])];

                    DataTable rs = dbOperation.ExecuteQuery("select * from pnref t where id='"
                            + pId.Substring(1, pId.Length) + "'");
                    try
                    {
                        int arcIndex = rs.Columns.IndexOf("arc");
                        int nodeindexIndex = rs.Columns.IndexOf("nodeindex");
                        int CoordsIndex = rs.Columns.IndexOf("Coords");
                        foreach (DataRow row in rs.Rows)
                        {
                            String ArcId = row[arcIndex].ToString();
                            int NodeIndex = Convert.ToInt32(row[nodeindexIndex]);
                            String NodeCoord = row[CoordsIndex].ToString();
                            if (i == 0)
                                if (NodesArr.Length == 3)
                                {
                                    String PnId = pPntIdVec[Convert.ToInt32(NodesArr[2])];
                                    PnId = PnId.Substring(1, PnId.Length);
                                    CoordsStr = GetCoordsPn(ArcId, NodeIndex,
                                            NodeCoord, true,
                                            GetArcCoordsFromPn(PnId));
                                }
                                else
                                    CoordsStr = GetCoordsPn(ArcId, NodeIndex,
                                            NodeCoord, true, GetOneArcCoords(
                                                    pPntIdVec, NodesArr, 1, false));
                            if (i == NodesArr.Length - 2)
                                if (NodesArr.Length == 3)
                                {
                                    String PnId = pPntIdVec[Convert.ToInt32(NodesArr[0])];
                                    PnId = PnId.Substring(1, PnId.Length);
                                    CoordsStr = CoordsStr
                                            + ";"
                                            + GetCoordsPn(ArcId, NodeIndex,
                                                    NodeCoord, false,
                                                    GetArcCoordsFromPn(PnId));
                                }
                                else
                                    CoordsStr = CoordsStr
                                            + ";"
                                            + GetCoordsPn(ArcId, NodeIndex,
                                                    NodeCoord, false,
                                                    GetOneArcCoords(pPntIdVec,
                                                            NodesArr,
                                                            NodesArr.Length - 3,
                                                            false));
                        }
                    }
                    catch (Exception e)
                    {

                    }

                }
                else
                {

                    String AllCoords = GetOneArcCoords(pPntIdVec, NodesArr, i, true);
                    String[] AllCoordsArr = AllCoords.Split(';');
                    AllCoords = "";
                    for (int j = 1; j < AllCoordsArr.Length; j++)
                    {
                        AllCoords += AllCoordsArr[j] + ";";
                    }
                    CoordsStr = CoordsStr + ";"
                            + AllCoords.Substring(0, AllCoords.Length - 1);
                }
            }
        }

        // 通过地名点id号得到地名点所在弧段弧段的坐标串
        private String GetArcCoordsFromPn(String pId)
        {
            String AllStr = "";
            DataTable rs = dbOperation.ExecuteQuery("select * from pnref t where id='" + pId
                    + "'");
            try
            {
                int arcIndex = rs.Columns.IndexOf("arc");
                foreach (DataRow row in rs.Rows)
                {
                    String ArcId = row[arcIndex].ToString();
                    DataTable RsArc = dbOperation.ExecuteQuery("select * from Arc_Nodes t where arc='"
                                    + ArcId + "'");
                    if (RsArc.Rows.Count > 0)
                    {
                        AllStr = RsArc.Rows[0][RsArc.Columns.IndexOf("Coords")].ToString();
                    }
                }

            }
            catch (Exception e)
            {

            }
            return AllStr;
        }

        // 得到一个整个弧段的坐标串
        private String GetOneArcCoords(List<string> pPntIdVec, String[] NodesArr,
                int Index, bool IsRoadName)
        {
            String AllCoords = "";
            String pId1 = pPntIdVec[Convert.ToInt32(NodesArr[Index])];
            String pId2 = pPntIdVec[Convert.ToInt32(NodesArr[Index + 1])];
            DataTable rs = dbOperation.ExecuteQuery("select * from arc_nodes t where (Node_s='"
                    + pId1 + "' and Node_e='" + pId2 + "') or (Node_S='" + pId2
                    + "' and Node_e='" + pId1 + "')");
            try
            {
                int CoordsIndex = rs.Columns.IndexOf("Coords");
                int Node_sIndex = rs.Columns.IndexOf("Node_s");
                int Node_eIndex = rs.Columns.IndexOf("Node_e");
                int roadnameIndex = rs.Columns.IndexOf("roadname");
                foreach (DataRow row in rs.Rows)
                {
                    String CoordsStrOneArc = row[CoordsIndex].ToString();
                    String[] CoordsArr = CoordsStrOneArc.Split(';');

                    if ((row[Node_sIndex].ToString() == pId1) && (row[Node_eIndex].ToString() == pId2))
                        AllCoords = CoordsStrOneArc;
                    else
                        AllCoords = ConverMatrix(CoordsArr);

                    if (IsRoadName)
                        GetRoadInfo(row[roadnameIndex].ToString());
                }
            }
            catch (Exception e)
            {

            }
            return AllCoords;
        }

        // 颠倒矩阵
        private String ConverMatrix(String[] CoordsArr)
        {
            // String[] CoordsArr = AllCoords.split(";");
            String[] Rs = new String[CoordsArr.Length];
            String RsStr = "";
            for (int i = 0; i < CoordsArr.Length; i++)
            {
                Rs[i] = CoordsArr[CoordsArr.Length - 1 - i];
            }

            for (int j = 0; j < Rs.Length; j++)
            {
                RsStr += Rs[j] + ";";
            }

            return RsStr.Substring(0, RsStr.Length - 1);
        }

        // 得到含有地名映射点弧段的坐标串
        private String GetCoordsPn(String ArcId, int NodeIndex, String NodeCoord,
                bool pStart, String ArcCoords)
        {
            String RsStr = "";
            String[] Arr = ArcCoords.Split(';');
            DataTable rs = dbOperation.ExecuteQuery("select * from arc_nodes t where arc='"
                    + ArcId + "'");
            try
            {
                int coordsIndex = rs.Columns.IndexOf("coords");
                int roadnameIndex = rs.Columns.IndexOf("roadname");
                foreach (DataRow row in rs.Rows)
                {
                    // 一个弧段所有坐标串
                    String[] NodesArr = row[coordsIndex].ToString().Split(';');
                    GetRoadInfo(row[roadnameIndex].ToString());
                    if (pStart)
                    {
                        RsStr = NodeCoord;
                        if ((NodesArr[0] == Arr[0]) || (NodesArr[0] == Arr[Arr.Length - 1]))
                        {
                            for (int i = NodeIndex; i >= 0; i--)
                                RsStr = RsStr + ";" + NodesArr[i];
                        }
                        else
                        {
                            for (int i = NodeIndex + 1; i < NodesArr.Length; i++)
                            {
                                RsStr = RsStr + ";" + NodesArr[i];
                            }
                        }
                    }
                    else
                    {

                        if ((NodesArr[0] == Arr[0]) || (NodesArr[0] == Arr[Arr.Length - 1]))
                            for (int i = 1; i <= NodeIndex; i++)
                            {
                                RsStr = RsStr + NodesArr[i] + ";";
                            }
                        else
                            for (int i = NodesArr.Length - 2; i > NodeIndex; i--)
                            {
                                RsStr = RsStr + NodesArr[i] + ";";
                            }
                        RsStr = RsStr + NodeCoord;
                    }
                }

            }
            catch (Exception e)
            {

            }
            return RsStr;
        }

        private void GetRoadInfo(String RoadName)
        {
            if ((RoadInfo.IndexOf(RoadName) < 0) && (RoadInfo == ""))
                RoadInfo = RoadName;
            if ((RoadInfo.IndexOf(RoadName) < 0) && !(RoadInfo == ""))
                RoadInfo = RoadInfo + ";" + RoadName;
        }

        private int CalLen(String Coords, int index, String PnCoord)
        {
            String[] CoordArr = Coords.Split(';');
            int AllLen = 0;
            for (int i = 0; i < index; i++)
            {
                int X1 = Convert.ToInt32(CoordArr[i].Split(',')[0]);
                int Y1 = Convert.ToInt32(CoordArr[i].Split(',')[1]);
                int X2 = Convert.ToInt32(CoordArr[i + 1].Split(',')[0]);
                int Y2 = Convert.ToInt32(CoordArr[i + 1].Split(',')[1]);
                AllLen = (int)(AllLen + Math.Sqrt((X1 - X2) * (X1 - X2)
                        + (Y1 - Y2) * (Y1 - Y2)));
            }
            {
                int X1 = Convert.ToInt32(CoordArr[index].Split(',')[0]);
                int Y1 = Convert.ToInt32(CoordArr[index].Split(',')[1]);
                int X2 = Convert.ToInt32(PnCoord.Split(',')[0]);
                int Y2 = Convert.ToInt32(PnCoord.Split(',')[1]);
                AllLen = (int)(AllLen + Math.Sqrt((X1 - X2) * (X1 - X2) + (Y1 - Y2)
                        * (Y1 - Y2)));
            }
            return AllLen;
        }

        private int DbToMatrix(String pId, List<string> pIdVec)
        {
            int index = 0;
            for (int i = 0; i < pIdVec.Count; i++)
            {
                if (pIdVec[i] == pId)
                {
                    index = i;
                }
            }
            return index;
        }

        public int getMindistance()
        {
            return Mindistance;
        }

        public String getCoordsStr()
        {
            return CoordsStr;
        }

        public String getRoadInfo()
        {
            return RoadInfo;
        }
    }
}