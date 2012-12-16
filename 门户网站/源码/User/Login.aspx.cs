using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Security;

public partial class User_Login : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        
    }
    protected void UserLogin(object sender, AuthenticateEventArgs e)
    {
        string user = this.Login1.UserName;
        string password = this.Login1.Password;

        bool isValid = System.Web.Security.FormsAuthentication.Authenticate(user, password);
        e.Authenticated = isValid;
        if (isValid)
        {
            FormsAuthentication.RedirectFromLoginPage(user, true);
        }
       
    }
}