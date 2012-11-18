/**
* Function:创建面板
* Parameters:
* name:面板名称
*/
KoalaGIS.EASYHZ.Util.CreatePanel = function (panelName) {
    var panelObj = PanelTemplate[panelName];
    if (panelObj == undefined || panelObj == null) {
        alert("未初始化" + panelName + "面板！");
        return;
    }

    var panel = panelObj["panel"];
    if (panel == null) {
        panel = new FuncPanel(panelName);
        //根据toolbar和bottombar的高度设置resultPanel高度
        $(".func_panel").css("height", document.body.clientHeight - /*顶部和底部*/125 - /*和底部保持一定距离*/10 + "px");
        //填充面板内容
        //fillPanelContent(panel);
    }

    return panel;
};

/**
* Function:检索面板
*
* Parameters:
* name:面板名称
*/
KoalaGIS.EASYHZ.Util.FindPanel = function (panelName) {
    var panelObj = PanelTemplate[panelName];
    return panelObj["panel"];
}

/**
* Function:控制面板的显示
* 
* Parameters:
* panelName - {string} 面板名称
* 
*/
KoalaGIS.EASYHZ.Util.showPanel = function (panelName) {
    //关闭其他Panel
    for (var prop in PanelTemplate) {
        if (PanelTemplate[prop]["panel"] != null || PanelTemplate[prop]["panel"] != undefined) {
            PanelTemplate[prop]["panel"].hide();
        }
    }

    var panel = this.CreatePanel(panelName);
    panel.show();
};

/**
 * Function:控制面板的关闭
 *
 * Parmeters:
 * panelname - {string} 面板名称
 */

KoalaGIS.EASYHZ.Util.closePanel = function (panelName) {
    var panel = this.CreatePanel(panelName);
    panel.hide();
};
