using System;
using System.Collections.Generic;
using System.Web;

namespace ZJGIS.Model.Common
{
    public class QueryResultSet<T>
    {
        private int _totalcount;
        public int TotalCount { get { return _totalcount; } set { _totalcount = value; } }

        private List<T> _resultset;
        public List<T> ResultSet { get { return _resultset; } set { _resultset = value; } }
    }
}