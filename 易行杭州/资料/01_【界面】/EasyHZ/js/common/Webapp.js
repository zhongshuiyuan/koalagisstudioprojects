/*============================================
*全局变量
*============================================*/
var wtg = new WKTToGeometry();
var gtw = new GeometryToWKT();



/*============================================
*网站初始化
*============================================*/
//dojo.addOnLoad(function() {
//    iniMaps(); //地图初始化
//    initShowPanels();
//});

function addOnLoad() {
    var divID = "mapcontent";
    var cityPt = new BMap.Point(120.161883, 30.27877);
    var level = 12;
    var map = new KoalaGIS.EASYHZ.Map(divID,cityPt,level);    
};

///初始化显示面板
function initShowPanels() {
    openAppPanel('mapsearch');
    openAppPanel('poisearch');
}


/*============================================
*有关界面的事件
*============================================*/
//主功能面板切换
function MenuListClick(obj) {
    var id = obj.id;
    var MenuList = document.getElementById("MenuList");

    var menus = MenuList.childNodes;
    //更改样式
    for (var i = 0; i < menus.length; i++) {
        if (menus[i].tagName == "LI") {
            menus[i].className = "menuli";
        }
    }
    obj.className = "menuli selected";

    //打开面板
    var con = document.getElementById(id + "_con");
    var MenuCons = document.getElementById("LeftContainer");
    var menucons = MenuCons.childNodes;
    //不显示关闭
    for (var i = 0; i < menucons.length; i++) {
        if (menucons[i].tagName == "DIV") {
            menucons[i].style.display = "none";
        }
    }
    con.style.display = "block";
}

//地图搜索功能面板折叠
function expandOrCollapsePanel(obj) {
    var id = obj.id;
    var contentId = id.split("_")[0];
    if (contentId == undefined || contentId == null || contentId == "") {
        alert("获取地图搜索功能面板ID出错");
        return;
    }
    var content = document.getElementById(contentId + "_content");

    if (content.style.display == "none") {
        checkExpandState(obj, true);
    } else {
        checkExpandState(obj, false);
    }
}
//确认功能面板状态
function checkExpandState(obj, isExpand) {
    var id = obj.id;
    var contentId = id.split("_")[0];
    if (contentId == undefined || contentId == null || contentId == "") {
        alert("获取地图搜索功能面板ID出错");
        return;
    }
    var content = document.getElementById(contentId + "_content");

    if (isExpand == true) {
        content.style.display = "block";
        obj.src = "images/icons/iw_minus.gif";
    } else if (isExpand == false) {
        content.style.display = "none";
        obj.src = "images/icons/iw_plus.gif";
    }
}

//公交查询tab事件
function busSearchClick(obj) {
    var id = obj.id;
    var busImgs = document.getElementById("busSearchImg");

    var imgs = busImgs.childNodes;
    //更改样式
    for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].tagName == "IMG") {
            //imgs[i].src =;
        }
    }
    //obj.className = "menuli selected";

    //打开面板
    var con = document.getElementById(id + "_con");
    var busSearchs = document.getElementById("busSearch_con");
    var children = busSearchs.childNodes;
    //不显示的面板关闭
    for (var i = 0; i < children.length; i++) {
        if (children[i].tagName == "DIV") {
            children[i].style.display = "none";
        }
    }
    con.style.display = "block";

    //切换提示信息
    children = ["busTrans", "busLine", "busStop"];
    for (var i = 0; i < children.length; i++) {
        var child = document.getElementById(children[i] + "_hint");
        if (child != undefined && child != null) {
            child.style.display = "none";
        }
    }

    document.getElementById(id + "_hint").style.display = "";
}

//双屏切换
function switchDblScreen(cmd) {
    var dblMapSwitcher = document.getElementById("dblMapSwitcher");
    switch (cmd) {
        case "dblscreen":
            dblMapState = "dblscreen";
            dblMapSwitcher.innerHTML = "退出双屏";
            dblMapSwitcher.onclick = function() { switchDblScreen('exitdblscreen'); }
            checkDblMapState();
            bindEvent();
            break;
        case "exitdblscreen":
            unBindEvent();
            dblMapState = "exitdblscreen";
            dblMapSwitcher.innerHTML = "双屏显示";
            dblMapSwitcher.onclick = function() { switchDblScreen('dblscreen'); }
            checkDblMapState();
            break;
    }
}

//确认双屏显示状态
function checkDblMapState() {
    var MapBody = document.getElementById("MapBody");
    var spliter = document.getElementById("dblSpliter");
    var map1El = document.getElementById("Map1");
    var map2El = document.getElementById("Map2");

    var width = MapBody.clientWidth;
    var height = MapBody.clientHeight;
    var spliterWidth = spliter.clientWidth;
    if (spliterWidth == 0) spliterWidth = 5;
    var halfWidth = Math.floor((width - spliterWidth) / 2);
    var mapHeight = height - 30;

    switch (dblMapState) {
        /*********双屏显示*******************/ 
        case "dblscreen":
            map1El.style.display = "block";
            map1El.style.width = halfWidth + "px";

            map2El.style.display = "block";
            map2El.style.width = halfWidth + "px";
            map2El.style.height = mapHeight + "px";

            spliter.style.display = "block";
            spliter.style.height = mapHeight + "px";
            spliter.style.left = halfWidth + "px";

            if (map2) {
                map2.resize();
                map2.reposition();
            }
            break;
        /*********退出双屏*******************/ 
        case "exitdblscreen":
            map1El.style.display = "";
            map1El.style.width = width + "px";
            map2El.style.display = "none";
            spliter.style.display = "none";
            break;
    }

    if (map1) {
        map1.resize();
        map1.reposition();
        //      map1.centerAt(center);
    }

}

/*============================================
*XHR调用统一函数
*============================================*/
function Request(url, params, method, onCompleted, onError) {
    params['random'] = new Date().getTime();
    dojo.xhrGet({
        url: url,
        method: (method == null || method == undefined) ? "GET" : method,
        content: params,
        load: onCompleted
    });
}
/*============================================
*解析JSON
*============================================*/
function Eval2Obj(responseText) {
    var obj;
    try {
        responseText = trimEnter(responseText);
        obj = eval("(" + responseText + ")")
        return obj;
    } catch (e) {
        alert("解析JSON出错!");
        return null;
    }
}

/*============================================
*去除回车换行符
*============================================*/
function trimEnter(text) {
    var reg = /[\n]/g;
    return text.replace(reg, "");
}

/*
 *控制Panel的显示状态
 *@panelName:面板id
*/
function showPanel(panelName){
    var panelDiv = $('div : has(func_panel)');
    for (var i = 0; i < panelDiv.length;i++ ) {
        if (panelDiv[i].atrr("id") == panelName) {
            panelDiv[i].css("display", "block");
        } else {
            panelDiv[i].css("display","none"); 
        }
    }
    
}