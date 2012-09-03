/**
 * Namespace：Util
 */
Namespace.register("EasyHZ.Util");

/**
 * Function:控制面板的显示
 * 
 * Parmeters:
 * panelname - {string} 面板名称
 * 
 */
EasyHZ.Util.showPanel = function (panelname) {
    var panelArray = $(".func_panel");
    for (var i = 0; i < panelArray.length; i++) {
        if ($(panelArray[i]).attr("id") == panelname) {
            $(panelArray[i]).css("display", "block");
        } else {
            $(panelArray[i]).css("display", "none");
        }
    }
};

/**
 * Function:控制面板的关闭
 *
 * Parmeters:
 * panelname - {string} 面板名称
 */

EasyHZ.Util.closePanel = function (panelname) {
    var panelArray = $(".func_panel");
    for (var i = 0; i < panelArray.length; i++) {
        if ($(panelArray[i]).attr("id") == panelname) {
            $(panelArray[i]).css("display", "none");
            break;
        }
    }
};
