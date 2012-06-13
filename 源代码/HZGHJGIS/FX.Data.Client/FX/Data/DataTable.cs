namespace FX.Data
{
    using Cellbi.SvZLib;
    using FX.Security;
    using FX.Serialization;
    using System;
    using System.Collections.Generic;
    using System.Runtime.CompilerServices;
    using System.Runtime.Serialization;
    using System.Xml.Linq;

    [DataContract]
    public class DataTable
    {
        private bool _HasNextRows;
       
        private List<DataColumn> m_Columns;
        private string m_MessageError;
        private List<DataRow> m_Rows;

        public DataTable()
        {
            this.m_MessageError = string.Empty;
            this._HasNextRows = false;
            this.m_Rows = new List<DataRow>();
            this.m_Columns = new List<DataColumn>();
        }

        public DataTable(string xml)
        {
            this.m_MessageError = string.Empty;
            this._HasNextRows = false;
            this.LoadXMLDataTable(xml);
        }

        public bool AddColumn(DataColumn newColumn)
        {
            bool flag = true;
            if (this.m_Columns == null)
            {
                this.m_Columns = new List<DataColumn>();
            }
            else
            {
                foreach (DataColumn column in this.m_Columns)
                {
                    if (column.ColumnName.ToLower().Equals(newColumn.ColumnName.ToLower()))
                    {
                        flag = false;
                        break;
                    }
                }
            }
            if (flag)
            {
                this.m_Columns.Add(newColumn);
                return flag;
            }
            this.m_MessageError = "添加列失败，列" + newColumn.ColumnName.ToString() + "已经存在;";
            return flag;
        }

        public bool AddRow(DataRow newRow)
        {
            if ((this.Columns != null) && (this.Columns.Count > 0))
            {
                if (this.m_Rows == null)
                {
                    this.m_Rows = new List<DataRow>();
                }
                this.m_Rows.Add(newRow);
                return true;
            }
            this.m_MessageError = "添加行失败，请调用NewRow();";
            return false;
        }

        public void AddRowIndex()
        {
            if (this.Rows.Count > 0)
            {
                DataColumn item = new DataColumn();
                item.Caption = "行号";
                item.ColumnName = "index";
                this.Columns.Add(item);
                for (int i = 0; i < this.Rows.Count; i++)
                {
                    this.Rows[i].Cells.Add("index", i + 1);
                }
            }
        }

        public static DataTable Decrypt(string encryptedString)
        {
            if (string.IsNullOrEmpty(encryptedString))
            {
                return null;
            }
            return (DataContractSerialization.Deserialize<DataTable>(Utils.Decompress(AesCryptography.Decrypt(encryptedString))) as DataTable);
        }

        public string Encrypt()
        {
            return Encrypt(this);
        }

        public static string Encrypt(DataTable dt)
        {
            if (dt == null)
            {
                return null;
            }
            return AesCryptography.Encrypt(Utils.Compress(DataContractSerialization.Serialize(dt)));
        }

        public void LoadXMLDataTable(string xmlDataTable)
        {
            if (!string.IsNullOrEmpty(xmlDataTable))
            {
                XDocument document = XDocument.Parse(xmlDataTable);
                bool flag = false;
                if ((((document != null) && (document.Elements("Table") != null)) && (Extensions.Elements<XElement>(document.Elements("Table"), "Columns") != null)) && (Extensions.Elements<XElement>(Extensions.Elements<XElement>(document.Elements("Table"), "Columns"), "Column") != null))
                {
                    this.Name = document.Element("Table").Attribute("Name").Value;
                    flag = true;
                }
                if (flag)
                {
                    IEnumerable<XElement> enumerable = Extensions.Elements<XElement>(Extensions.Elements<XElement>(document.Elements("Table"), "Columns"), "Column");
                    foreach (XElement element in enumerable)
                    {
                        if (element.HasAttributes)
                        {
                            string str = string.Empty;
                            string str2 = string.Empty;
                            foreach (XAttribute attribute in element.Attributes())
                            {
                                string str5 = attribute.Name.LocalName.ToLower();
                                if (str5 != null)
                                {
                                    if (!(str5 == "columnname"))
                                    {
                                        if (str5 == "caption")
                                        {
                                            goto Label_0191;
                                        }
                                    }
                                    else
                                    {
                                        str = attribute.Value.ToLower();
                                    }
                                }
                                goto Label_019C;
                            Label_0191:
                                str2 = attribute.Value;
                            Label_019C:;
                            }
                            DataColumn newColumn = new DataColumn();
                            newColumn.Caption = str2;
                            newColumn.ColumnName = str;
                            this.AddColumn(newColumn);
                        }
                    }
                    if ((Extensions.Elements<XElement>(document.Elements("Table"), "Rows") != null) && (Extensions.Elements<XElement>(Extensions.Elements<XElement>(document.Elements("Table"), "Rows"), "Row") != null))
                    {
                        this.m_Rows = new List<DataRow>();
                        IEnumerable<XElement> enumerable2 = Extensions.Elements<XElement>(Extensions.Elements<XElement>(document.Elements("Table"), "Rows"), "Row");
                        foreach (XElement element2 in enumerable2)
                        {
                            XDocument document2 = XDocument.Parse(element2.ToString());
                            if (((document2 != null) && (document2.Elements("Row") != null)) && (Extensions.Elements<XElement>(document2.Elements("Row"), "Cell") != null))
                            {
                                DataRow newRow = this.NewRow();
                                IEnumerable<XElement> enumerable3 = Extensions.Elements<XElement>(document2.Elements("Row"), "Cell");
                                foreach (XElement element3 in enumerable3)
                                {
                                    string key = element3.FirstAttribute.Value.ToLower();
                                    string str4 = element3.Value;
                                    newRow.Cells.Add(key, str4);
                                }
                                this.AddRow(newRow);
                            }
                        }
                    }
                    else
                    {
                        this.m_MessageError = "加载失败:xDocTable.Elements('Table').Elements('Rows') != null && xDocTable.Elements('Table').Elements('Rows').Elements('Row') != null";
                    }
                }
                else
                {
                    this.m_MessageError = "加载失败：xmlDataTable != null && xDocTable.Elements('Table') != null && xDocTable.Elements('Table').Elements('Columns') != null && xDocTable.Elements('Table').Elements('Columns').Elements('Column') != null";
                }
            }
        }

        public DataRow NewRow()
        {
            DataRow row = new DataRow();
            if ((this.m_Columns != null) && (this.m_Columns.Count > 0))
            {
                row.Cells = new Dictionary<string, object>();
                return row;
            }
            this.m_MessageError = "数据列不存在，无法新建行;";
            return row;
        }

        [DataMember]
        public string Caption
        {
            get;
            set;
        }

        [DataMember]
        public List<DataColumn> Columns
        {
            get
            {
                return this.m_Columns;
            }
            set
            {
                this.m_Columns = value;
            }
        }

        [DataMember]
        public int DataBaseRowsCount
        {
            get;
            set;
        }

        public DataTable DataSource
        {
            set
            {
                this.m_Rows = new List<DataRow>();
                this.m_Columns = new List<DataColumn>();
                for (int i = 0; i < value.Rows.Count; i++)
                {
                    this.m_Rows.Add(value.m_Rows[i]);
                }
                for (int j = 0; j < value.Columns.Count; j++)
                {
                    this.m_Columns.Add(value.Columns[j]);
                }
            }
        }

        [DataMember]
        public bool HasNextRows
        {
            get
            {
                return this._HasNextRows;
            }
            set
            {
                this._HasNextRows = value;
            }
        }

        [DataMember]
        public string MessageError
        {
            get
            {
                return this.m_MessageError;
            }
            set
            {
                this.m_MessageError = value;
            }
        }

        [DataMember]
        public string Name
        {
            get;
            set;
        }

        [DataMember]
        public List<DataRow> Rows
        {
            get
            {
                return this.m_Rows;
            }
            set
            {
                this.m_Rows = value;
            }
        }
    }
}

