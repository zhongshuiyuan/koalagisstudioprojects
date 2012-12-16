<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="admin_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style type="text/css">
        .style1
        {
            width: 168px;
        }
        .style2
        {
            float: left;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div class="style1" style=" float:left;">
    
        <asp:TreeView ID="TreeView1" runat="server" 
            ontreenodepopulate="TreeView1_TreeNodePopulate" ShowLines="True" 
            onselectednodechanged="TreeView1_SelectedNodeChanged">
            <Nodes>
                <asp:TreeNode Text="运维管理" Value="运维管理">
                    <asp:TreeNode Text="新闻管理" Value="新闻管理"></asp:TreeNode>
                    <asp:TreeNode Text="案例管理" Value="案例管理"></asp:TreeNode>
                </asp:TreeNode>
            </Nodes>
        </asp:TreeView>
        


    
    </div>
    <div class="style2">
        <div id="divNews" runat="server">
            <asp:GridView ID="GridViewNews" runat="server" AutoGenerateColumns="False" 
            DataKeyNames="ID" DataSourceID="DataSourceNews" 
            EnableModelValidation="True" AllowPaging="True">
            <Columns>
                <asp:BoundField DataField="ID" HeaderText="ID" InsertVisible="False" 
                    ReadOnly="True" SortExpression="ID" />
                <asp:BoundField DataField="TITLE" HeaderText="TITLE" SortExpression="TITLE" />
                <asp:BoundField DataField="POSTTIME" HeaderText="POSTTIME" 
                    SortExpression="POSTTIME" />
                <asp:BoundField DataField="PEOPLE" HeaderText="PEOPLE" 
                    SortExpression="PEOPLE" />
                <asp:BoundField DataField="READTIMES" HeaderText="READTIMES" 
                    SortExpression="READTIMES" />
                <asp:TemplateField HeaderText="编辑">
                        <ItemTemplate>
                                  <a target="_blank" href="../news/edit.htm?id=<%#Eval("ID")%>">编辑</a>
                        </ItemTemplate>
                    </asp:TemplateField>
                <asp:CommandField ShowDeleteButton="True" />
            </Columns>
        </asp:GridView>
        <a target="_blank" href="../news/newspost.htm" >添加新闻</a>
            
        </div>
        
        <div id="divDemos" runat="server">
        
        
        <asp:GridView ID="GridViewDemos" runat="server" AutoGenerateColumns="False" 
            DataKeyNames="ID" DataSourceID="DataSourceDemos" 
            EnableModelValidation="True" AllowPaging="True" CellPadding="4" 
            ForeColor="#333333" GridLines="None">
            <AlternatingRowStyle BackColor="White" />
            <Columns>
                <asp:BoundField DataField="ID" HeaderText="ID" InsertVisible="False" 
                    ReadOnly="True" SortExpression="ID" />
                <asp:BoundField DataField="TITLE" HeaderText="TITLE" SortExpression="TITLE" />
                <asp:BoundField DataField="CONTENT" HeaderText="CONTENT" 
                    SortExpression="CONTENT" />
                <asp:BoundField DataField="CREATETIME" HeaderText="CREATETIME" 
                    SortExpression="CREATETIME" />
                <asp:BoundField DataField="AUTHOR" HeaderText="AUTHOR" 
                    SortExpression="AUTHOR" />
                <asp:BoundField DataField="THUMBNAIL" HeaderText="THUMBNAIL" 
                    SortExpression="THUMBNAIL" />
                <asp:BoundField DataField="APPURL" HeaderText="APPURL" 
                    SortExpression="APPURL" />

                    <asp:TemplateField HeaderText="编辑">
                        <ItemTemplate>
                                  <a target="_blank" href="../demos/demoupdate.htm?id=<%#Eval("ID")%>">编辑</a>
                        </ItemTemplate>
                    </asp:TemplateField>
                <asp:CommandField />
                <asp:CommandField ShowDeleteButton="True" />
            </Columns>
            <EditRowStyle BackColor="#7C6F57" />
            <FooterStyle BackColor="#1C5E55" Font-Bold="True" ForeColor="White" />
            <HeaderStyle BackColor="#1C5E55" Font-Bold="True" ForeColor="White" />
            <PagerStyle BackColor="#666666" ForeColor="White" HorizontalAlign="Center" />
            <RowStyle BackColor="#E3EAEB" />
            <SelectedRowStyle BackColor="#C5BBAF" Font-Bold="True" ForeColor="#333333" />
        </asp:GridView>

        <a target="_blank" href="../demos/demopost.htm" >添加案例</a>
        </div>
        
    </div>
    <asp:AccessDataSource ID="DataSourceDemos" runat="server" 
        DataFile="~/App_Data/data.mdb" 
        SelectCommand="SELECT * FROM [APPS] ORDER BY [ID] DESC" 
        ConflictDetection="CompareAllValues" 
        DeleteCommand="DELETE FROM [APPS] WHERE [ID] = ? AND (([TITLE] = ?) OR ([TITLE] IS NULL AND ? IS NULL)) AND (([CONTENT] = ?) OR ([CONTENT] IS NULL AND ? IS NULL)) AND (([CREATETIME] = ?) OR ([CREATETIME] IS NULL AND ? IS NULL)) AND (([AUTHOR] = ?) OR ([AUTHOR] IS NULL AND ? IS NULL)) AND (([THUMBNAIL] = ?) OR ([THUMBNAIL] IS NULL AND ? IS NULL)) AND (([APPURL] = ?) OR ([APPURL] IS NULL AND ? IS NULL))" 
        InsertCommand="INSERT INTO [APPS] ([ID], [TITLE], [CONTENT], [CREATETIME], [AUTHOR], [THUMBNAIL], [APPURL]) VALUES (?, ?, ?, ?, ?, ?, ?)" 
        OldValuesParameterFormatString="original_{0}" 
        UpdateCommand="UPDATE [APPS] SET [TITLE] = ?, [CONTENT] = ?, [CREATETIME] = ?, [AUTHOR] = ?, [THUMBNAIL] = ?, [APPURL] = ? WHERE [ID] = ? AND (([TITLE] = ?) OR ([TITLE] IS NULL AND ? IS NULL)) AND (([CONTENT] = ?) OR ([CONTENT] IS NULL AND ? IS NULL)) AND (([CREATETIME] = ?) OR ([CREATETIME] IS NULL AND ? IS NULL)) AND (([AUTHOR] = ?) OR ([AUTHOR] IS NULL AND ? IS NULL)) AND (([THUMBNAIL] = ?) OR ([THUMBNAIL] IS NULL AND ? IS NULL)) AND (([APPURL] = ?) OR ([APPURL] IS NULL AND ? IS NULL))">
        <DeleteParameters>
            <asp:Parameter Name="original_ID" Type="Int32" />
            <asp:Parameter Name="original_TITLE" Type="String" />
            <asp:Parameter Name="original_TITLE" Type="String" />
            <asp:Parameter Name="original_CONTENT" Type="String" />
            <asp:Parameter Name="original_CONTENT" Type="String" />
            <asp:Parameter Name="original_CREATETIME" Type="DateTime" />
            <asp:Parameter Name="original_CREATETIME" Type="DateTime" />
            <asp:Parameter Name="original_AUTHOR" Type="String" />
            <asp:Parameter Name="original_AUTHOR" Type="String" />
            <asp:Parameter Name="original_THUMBNAIL" Type="String" />
            <asp:Parameter Name="original_THUMBNAIL" Type="String" />
            <asp:Parameter Name="original_APPURL" Type="String" />
            <asp:Parameter Name="original_APPURL" Type="String" />
        </DeleteParameters>
        <InsertParameters>
            <asp:Parameter Name="ID" Type="Int32" />
            <asp:Parameter Name="TITLE" Type="String" />
            <asp:Parameter Name="CONTENT" Type="String" />
            <asp:Parameter Name="CREATETIME" Type="DateTime" />
            <asp:Parameter Name="AUTHOR" Type="String" />
            <asp:Parameter Name="THUMBNAIL" Type="String" />
            <asp:Parameter Name="APPURL" Type="String" />
        </InsertParameters>
        <UpdateParameters>
            <asp:Parameter Name="TITLE" Type="String" />
            <asp:Parameter Name="CONTENT" Type="String" />
            <asp:Parameter Name="CREATETIME" Type="DateTime" />
            <asp:Parameter Name="AUTHOR" Type="String" />
            <asp:Parameter Name="THUMBNAIL" Type="String" />
            <asp:Parameter Name="APPURL" Type="String" />
            <asp:Parameter Name="original_ID" Type="Int32" />
            <asp:Parameter Name="original_TITLE" Type="String" />
            <asp:Parameter Name="original_TITLE" Type="String" />
            <asp:Parameter Name="original_CONTENT" Type="String" />
            <asp:Parameter Name="original_CONTENT" Type="String" />
            <asp:Parameter Name="original_CREATETIME" Type="DateTime" />
            <asp:Parameter Name="original_CREATETIME" Type="DateTime" />
            <asp:Parameter Name="original_AUTHOR" Type="String" />
            <asp:Parameter Name="original_AUTHOR" Type="String" />
            <asp:Parameter Name="original_THUMBNAIL" Type="String" />
            <asp:Parameter Name="original_THUMBNAIL" Type="String" />
            <asp:Parameter Name="original_APPURL" Type="String" />
            <asp:Parameter Name="original_APPURL" Type="String" />
        </UpdateParameters>
    </asp:AccessDataSource>
    <asp:AccessDataSource ID="DataSourceNews" runat="server" 
        DataFile="~/App_Data/data.mdb" 
        
        SelectCommand="SELECT [ID], [TITLE], [POSTTIME], [PEOPLE], [READTIMES] FROM [News] ORDER BY [ID] DESC" 
        ConflictDetection="CompareAllValues" 
        DeleteCommand="DELETE FROM [News] WHERE [ID] = ? AND (([TITLE] = ?) OR ([TITLE] IS NULL AND ? IS NULL)) AND (([POSTTIME] = ?) OR ([POSTTIME] IS NULL AND ? IS NULL)) AND (([PEOPLE] = ?) OR ([PEOPLE] IS NULL AND ? IS NULL)) AND (([READTIMES] = ?) OR ([READTIMES] IS NULL AND ? IS NULL))" 
        InsertCommand="INSERT INTO [News] ([ID], [TITLE], [POSTTIME], [PEOPLE], [READTIMES]) VALUES (?, ?, ?, ?, ?)" 
        OldValuesParameterFormatString="original_{0}" 
        UpdateCommand="UPDATE [News] SET [TITLE] = ?, [POSTTIME] = ?, [PEOPLE] = ?, [READTIMES] = ? WHERE [ID] = ? AND (([TITLE] = ?) OR ([TITLE] IS NULL AND ? IS NULL)) AND (([POSTTIME] = ?) OR ([POSTTIME] IS NULL AND ? IS NULL)) AND (([PEOPLE] = ?) OR ([PEOPLE] IS NULL AND ? IS NULL)) AND (([READTIMES] = ?) OR ([READTIMES] IS NULL AND ? IS NULL))">
        <DeleteParameters>
            <asp:Parameter Name="original_ID" Type="Int32" />
            <asp:Parameter Name="original_TITLE" Type="String" />
            <asp:Parameter Name="original_TITLE" Type="String" />
            <asp:Parameter Name="original_POSTTIME" Type="DateTime" />
            <asp:Parameter Name="original_POSTTIME" Type="DateTime" />
            <asp:Parameter Name="original_PEOPLE" Type="String" />
            <asp:Parameter Name="original_PEOPLE" Type="String" />
            <asp:Parameter Name="original_READTIMES" Type="Int32" />
            <asp:Parameter Name="original_READTIMES" Type="Int32" />
        </DeleteParameters>
        <InsertParameters>
            <asp:Parameter Name="ID" Type="Int32" />
            <asp:Parameter Name="TITLE" Type="String" />
            <asp:Parameter Name="POSTTIME" Type="DateTime" />
            <asp:Parameter Name="PEOPLE" Type="String" />
            <asp:Parameter Name="READTIMES" Type="Int32" />
        </InsertParameters>
        <UpdateParameters>
            <asp:Parameter Name="TITLE" Type="String" />
            <asp:Parameter Name="POSTTIME" Type="DateTime" />
            <asp:Parameter Name="PEOPLE" Type="String" />
            <asp:Parameter Name="READTIMES" Type="Int32" />
            <asp:Parameter Name="original_ID" Type="Int32" />
            <asp:Parameter Name="original_TITLE" Type="String" />
            <asp:Parameter Name="original_TITLE" Type="String" />
            <asp:Parameter Name="original_POSTTIME" Type="DateTime" />
            <asp:Parameter Name="original_POSTTIME" Type="DateTime" />
            <asp:Parameter Name="original_PEOPLE" Type="String" />
            <asp:Parameter Name="original_PEOPLE" Type="String" />
            <asp:Parameter Name="original_READTIMES" Type="Int32" />
            <asp:Parameter Name="original_READTIMES" Type="Int32" />
        </UpdateParameters>
    </asp:AccessDataSource>
    </form>
</body>
</html>
