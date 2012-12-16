using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class admin_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!this.IsPostBack)
        {
            this.divDemos.Visible = false;
            
        }
    }
    protected void TreeView1_TreeNodePopulate(object sender, TreeNodeEventArgs e)
    {
        this.GridViewDemos.Visible = true;
    }
    protected void TreeView1_SelectedNodeChanged(object sender, EventArgs e)
    {
        TreeView tvw = (TreeView)sender;
        string value = tvw.SelectedValue;
        if (value == "案例管理")
        {
            this.divDemos.Visible = true;
            this.divNews.Visible = false;
        }
        else if( value == "新闻管理")
        {
            this.divDemos.Visible = false;
            this.divNews.Visible = true;
        }
    }
}