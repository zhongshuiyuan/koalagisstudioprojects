var mapCorrections = function() { }   //所有纠错信息｛type:type,coord:[……]，title:title,content:content,id:id｝
mapCorrections.prototype = {
    add: function(title, content, graphic) {
        var id = this._mapCorrectionCounter.getId();
        this._list[this._list.length] = { type: graphic.geometry.type, title: title, content: content, id: id, graphic: graphic.toJson() };
        this.save();
        return this._list[this._list.length - 1];
    },
    remove: function(id) {
        for (var i = 0; i < this._list.length; i++) {
            if (this._list[i].id == id) {
                this._mapCorrectionCounter.collectId(this._list[i].id);
                this._list.splice(i, 1);
                return;
            }
        }
        alert("不存在该纠错信息！");
    },
    save: function() {
        var json = dojo.toJson(this._list);
        dojo.cookie("mapCorrection", json, { expires: 5 });
    },
    clear: function() {
        this._list = null;
        this._list = [];
        this._mapCorrectionCounter = new idCounter(50);
        dojo.cookie("mapCorrection", null);
    },
    get: function(id) {
        for (var i = 0; i < this._list.length; i++) {
            if (this._list[i].id == id) {
                return this._list[i];
            }
        }
        return null;
    },
    ini: function() {
        this._mapCorrectionCounter = new idCounter(50);
        this._list = [];

        if (this._list.length == 0) {
            this._list = dojo.fromJson(dojo.cookie("mapCorrection"));
            if (this._list == null || this._list == undefined || this._list.length == 0) {
                this._list = [];
                return;
            }

            this.checkValidIds();
        }
    },
    checkValidIds: function() {
        for (var i = 0; i < this._list.length; i++) {
            this._mapCorrectionCounter.remove(this._list[i].id);
        }
    },
    get_list: function() {
        return this._list;
    }
};
var mapCorrection = new mapCorrections();
var mapCorrectionGraphics = null;


/*********************************************************
* 
*********************************************************/
var MapCorrection_onCloseInfoWindow = function() {
    if (mapCorrectionGraphics != null) {
        map.graphics.remove(mapCorrectionGraphics);
        mapCorrectionGraphics = null;
        dojo.disconnect(map.infoWindow, "onHide", MapCorrection_onCloseInfoWindow);
    }
}

//添加点纠错
function addCorrection2Map(geometry) {
    switch (geometry.type) {
        case "point":
            var symbol = new esri.symbol.PictureMarkerSymbol('images/biaohui_icons/tack.png', 24, 23);
            break;
        case "polyline":
            var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3);
            break;
        case "polygon":
            var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 3), new dojo.Color([255, 255, 0, 0.25]));
            break;
    }

    var graphic = new esri.Graphic(geometry, symbol);
    map.graphics.add(graphic);
    mapCorrectionGraphics = graphic;

    dojo.connect(map.infoWindow, "onHide", MapCorrection_onCloseInfoWindow);

    createMapCorrectionInfo(graphic, geometry);
}

//添加纠错信息的交互面板
function createMapCorrectionInfo(graphic, geometry) {
    var infowindow = map1.infoWindow;
    infowindow.setTitle("添加纠错信息");

    var mapPlotInfoTemplate = "<table cellspacing='2' class='mapplotinfowindow'>";
    mapPlotInfoTemplate += "<tr><td class='title'>名称:</td><td><input type='text' id='mapPlotTitle' style='width:200px' /></td></tr>";
    mapPlotInfoTemplate += "<tr><td class='title'>内容:</td><td><input type='text' id='mapPlotContent'  style='width:200px;height:60px;' /></td></tr>";
    mapPlotInfoTemplate += "<tr><td align='right' colspan='2'><input type='button' value='确定' onclick='saveMapCorrection();' /></td></tr></table>";

    infowindow.setContent(mapPlotInfoTemplate);

    var center;
    if (geometry.type == "point") {
        center = geometry;
    } else {
        center = geometry.getPoint(0, 0);
    }
    infowindow.show(map.toScreen(center), map.getInfoWindowAnchor(map.toScreen(center)));
}

//保存纠错信息
function saveMapCorrection() {
    var title = Utils.trimString(document.getElementById("mapPlotTitle").value);
    var content = Utils.trimString(document.getElementById("mapPlotContent").value);
    if (title == "" || content == "") { alert("名称与内容不能为空！"); return; }

    var graphic = mapCorrectionGraphics;

    graphic.setAttributes({ title: title, content: content });

    var infoTemplate = new esri.InfoTemplate();

    var mapPlotInfoTemplate = "<table cellspacing='2' class='mapplotinfowindow'>";
    mapPlotInfoTemplate += "<tr><td class='title'>名称:</td><td>document.getElementById{title}</td></tr>";
    mapPlotInfoTemplate += "<tr><td class='title'>内容:</td><td>document.getElementById{content}</td></tr></table>";
    infoTemplate.setTitle("document.getElementById{title}");
    infoTemplate.setContent(mapPlotInfoTemplate);
    graphic.setInfoTemplate(infoTemplate);

    var plot = mapCorrection.add(title, content, graphic);
    showMapCorrectionList();
    map.infoWindow.hide();
    showMapCorrectionInfo(plot.id);
}
//初始化
function iniMapCorrections() {
    var mapCorrectionList = document.getElementById('mapCorrectionList');
    showLoading(mapCorrectionList, "正在加载纠错信息……");
    mapCorrection.ini();
    updateMapCorrectionsList();
}

//更新显示列表
function updateMapCorrectionsList() {
    var mapCorrectionList = document.getElementById('mapCorrectionList');
    var html = "";
    var list = mapCorrection.get_list();
    for (var i = 0; i < list.length; i++) {
        var plot = list[i];
        var type = plot.type;
        if (type == "point") { type = "pointplottingtool"; }
        else if (type == "polyline") { type = "lineplottingtool"; }
        else if (type == "polygon") { type = "polygonplottingtool"; }
        html += "<div><img onclick='deleteMapCorrection(" + plot.id + ");' src='images/icons/delete.png' style='float:left;cursor:pointer;' title='删除该纠错' /><div class='mapplottingitem tool " + type + "' onmouseover='mapPlotOver(this);' onmouseout='mapPlotOut(this);' onclick='showMapCorrectionInfo(" + plot.id + ")'>" + plot.title + "</div></div>";
    }
    mapCorrectionList.innerHTML = html;

    document.getElementById("mapCorrectionsCounts").innerHTML = "[" + mapCorrection.get_list().length + "]";
}

//构造纠错列表
function showMapCorrectionList() {
    var mapCorrectionList = document.getElementById('mapCorrectionList');
    showLoading(mapCorrectionList, "正在更新纠错信息……");
    updateMapCorrectionsList();
}

//显示详细信息
function showMapCorrectionInfo(id) {
    var plot = mapCorrection.get(id);
    if (plot == null) return;
    var json = plot.graphic;
    var graphic = new esri.Graphic(json);
    clearMaps();
    map.graphics.add(graphic);
    graphic.show();

    var mapPlotInfoTemplate = "<table cellspacing='2' class='mapplotinfowindow'>";
    mapPlotInfoTemplate += "<tr><td class='title'>名称:</td><td>" + plot.title + "</td></tr>";
    mapPlotInfoTemplate += "<tr><td class='title'>内容:</td><td>" + plot.content + "</td></tr></table>";

    map.infoWindow.setTitle(plot.title);
    map.infoWindow.setContent(mapPlotInfoTemplate);

    var shape;
    if (graphic.geometry.type == "point") {
        shape = graphic.geometry;
    } else {
        shape = graphic.geometry.getPoint(0, 0);
    }
    map.infoWindow.show(map.toScreen(shape), map.getInfoWindowAnchor(map.toScreen(shape)));
}
//删除纠错信息
function deleteMapCorrection(id) {
    var del = false;
    if (isConfirmBeforeDelete) {
        if (confirm("真的删除么？")) { del = true; }
    } else { del = true; }

    if (del) {
        clearMaps();
        mapCorrection.remove(id);
        showMapCorrectionList();
    }
}

//清除所有
function clearMapCorrections() {
    var del = false;
    if (isConfirmBeforeDelete) {
        if (confirm("真的删除么？")) { del = true; }
    } else { del = true; }

    if (del) {
        if (mapCorrection != null) mapCorrection.clear();
        updateMapCorrectionsList();
    }
}
