namespace FX.Data
{
    using System;
    using System.Runtime.CompilerServices;
    using System.Runtime.Serialization;

    [DataContract]
    public class DataColumn
    {


        [DataMember]
        public string Caption
        {
            get;
            set;
        }

        [DataMember]
        public string ColumnName
        {
            get;
            set;
        }
    }
}

