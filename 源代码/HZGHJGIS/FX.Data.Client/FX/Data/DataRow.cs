namespace FX.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Runtime.CompilerServices;
    using System.Runtime.Serialization;

    [DataContract]
    public class DataRow
    {

        [DataMember]
        public Dictionary<string, object> Cells
        {
            get;
            set;
        }

        public object this[string key]
        {
            get
            {
                return this[key, false];
            }
            set
            {
                if (key == null)
                {
                    throw new NullReferenceException("键为空。");
                }
                if (this.Cells == null)
                {
                    this.Cells = new Dictionary<string, object>();
                }
                this.Cells.Add(key, value);
            }
        }

        public object this[string key, bool caseSensitive]
        {
            get
            {
                Func<string, bool> func = null;
                if (key == null)
                {
                    throw new NullReferenceException("键为空。");
                }
                if (this.Cells == null)
                {
                    return null;
                }
                if (!caseSensitive)
                {
                    if (func == null)
                    {
                        func = delegate (string k) {
                            return k.ToUpper() == key.ToUpper();
                        };
                    }
                    key = Enumerable.FirstOrDefault<string>(this.Cells.Keys, func);
                }
                return ((key == null) ? null : this.Cells[key]);
            }
        }

        [DataMember]
        public object Tag
        {
            get;
            set;
        }
    }
}

