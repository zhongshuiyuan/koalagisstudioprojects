
/*********************************************************
* ID维护器，防止ID过大，以及限制标绘和纠错数量
*********************************************************/
var idCounter = function(max) {
    this.max = max;
    this.validId = [];
    for (var i = 0; i < this.max; i++) {
        this.validId[this.validId.length] = i;
    }
};
idCounter.prototype = {
    getId: function() {
        for (var i = 0; i < this.validId.length; i++) {
            if (this.validId[i] != null) {
                this.validId[i] = null;
                return i;
            }
        }
        return null;
    },
    collectId: function(id) {//回收id
        if (id < this.max) {
            this.validId[id] = id;
        }
    },
    remove: function(index) {
        this.validId[index] = null;
    }
};

var mapPlottings = function() { }   //所有标绘信息｛type:type,coord:[……]，title:title,content:content,id:id｝
mapPlottings.prototype = {
    add: function(title, content, graphic) {
        var id = this._mapPlotCounter.getId();
        this._list[this._list.length] = { type: graphic.geometry.type, title: title, content: content, id: id, graphic: graphic.toJson() };
        this.save();
        return this._list[this._list.length - 1];
    },
    remove: function(id) {
        for (var i = 0; i < this._list.length; i++) {
            if (this._list[i].id == id) {
                this._mapPlotCounter.collectId(this._list[i].id);
                this._list.splice(i, 1);
                return;
            }
        }
        alert("不存在该标绘信息！");
    },
    save: function() {
        var json = dojo.toJson(this._list);
        dojo.cookie("mapPlotting", json, { expires: 5 });
    },
    clear: function() {
        this._list = null;
        this._list = [];
        this._mapPlotCounter = new idCounter(50);
        dojo.cookie("mapPlotting", null);
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
        this._mapPlotCounter = new idCounter(50);
        this._list = [];

        if (this._list.length == 0) {
            this._list = dojo.fromJson(dojo.cookie("mapPlotting"));
            if (this._list == null || this._list == undefined || this._list.length == 0) {
                this._list = [];
                return;
            }

            this.checkValidIds();
        }
    },
    checkValidIds: function() {
        for (var i = 0; i < this._list.length; i++) {
            this._mapPlotCounter.remove(this._list[i].id);
        }
    },
    get_list: function() {
        return this._list;
    }
};
var mapPlot = new mapPlottings();
var mapPlotGraphics = null;


/*********************************************************
* 
*********************************************************/
var onCloseInfoWindow = function() {
    if (mapPlotGraphics != null) {
        map.graphics.remove(mapPlotGraphics);
        mapPlotGraphics = null;
        dojo.disconnect(map.infoWindow, "onHide", onCloseInfoWindow);
    }
}


var plot_point_symbol = new esri.symbol.PictureMarkerSymbol('images/biaohui_icons/mark22.png', 32, 32);
var plot_line_symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 3);
var plot_polygon_symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,new dojo.Color([255, 0, 0]), 2), 
    new dojo.Color([255, 255, 0, 0.25])); 


//添加点标绘
function addPlot2Map(geometry) {
    switch (geometry.type) {
        case "point":
            //var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 3), new dojo.Color([0, 255, 0, 0.25]));
            var symbol = plot_point_symbol;
            break;
        case "polyline":
            //var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3);
            var symbol = plot_line_symbol;
            break;
        case "polygon":
            //var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 3), new dojo.Color([255, 255, 0, 0.25]));
            var symbol = plot_polygon_symbol;
            break;
    }

    var graphic = new esri.Graphic(geometry, symbol);
    map.graphics.add(graphic);
    mapPlotGraphics = graphic;

    dojo.connect(map.infoWindow, "onHide", onCloseInfoWindow);

    createMapPlotInfo(graphic, geometry);
}

//添加标绘信息的交互面板
function createMapPlotInfo(graphic, geometry) {
    var infowindow = map1.infoWindow;

    infowindow.setTitle("添加标绘信息");

    var mapPlotInfoTemplate = "<table cellspacing='2' class='mapplotinfowindow'>";
    mapPlotInfoTemplate += "<tr><td class='title'>名称:</td><td><input type='text' id='mapPlotTitle' style='width:200px' /></td></tr>";
    mapPlotInfoTemplate += "<tr><td class='title'>内容:</td><td><input type='text' id='mapPlotContent'  style='width:200px;height:60px;' /></td></tr>";
    mapPlotInfoTemplate += "<tr><td align='right' colspan='2'><input type='button' value='确定' onclick='savePlot();' /></td></tr></table>";

    infowindow.setContent(mapPlotInfoTemplate);

    var center;
    if (geometry.type == "point") {
        center = geometry;
    } else {
        center = geometry.getPoint(0, 0);
    }
    
    infowindow.show(map.toScreen(center), map.getInfoWindowAnchor(map.toScreen(center)));
}

//保存标绘信息
function savePlot() {
    var title = Utils.trimString(document.getElementById("mapPlotTitle").value);
    var content = Utils.trimString(document.getElementById("mapPlotContent").value);
    if (title == "" || content == "") { alert("名称与内容不能为空！"); return; }

    var graphic = mapPlotGraphics;

    graphic.setAttributes({ title: title, content: content });

    var infoTemplate = new esri.InfoTemplate();

    var mapPlotInfoTemplate = "<table cellspacing='2' class='mapplotinfowindow'>";
    mapPlotInfoTemplate += "<tr><td class='title'>名称:</td><td>" + title + "</td></tr>";
    mapPlotInfoTemplate += "<tr><td class='title'>内容:</td><td>" + content + "</td></tr></table>";
    infoTemplate.setTitle( title );
    infoTemplate.setContent(mapPlotInfoTemplate);
    graphic.setInfoTemplate(infoTemplate);

    var plot = mapPlot.add(title, content, graphic);
    showMapPlotList();
    map.infoWindow.hide();
    showMapPlotInfo(plot.id);
}
//初始化
function iniMapPlots() {
    var mapPlottingList = document.getElementById('mapPlottingList');
    showLoading(mapPlottingList, "正在加载标绘信息……");
    mapPlot.ini();
    updateMapPlotList();
}

//更新显示列表
function updateMapPlotList() {
    var mapPlottingList = document.getElementById('mapPlottingList');
    var html = "";
    var list = mapPlot.get_list();
    for (var i = 0; i < list.length; i++) {
        var plot = list[i];
        var type = plot.type;
        if (type == "point") { type = "pointplottingtool"; }
        else if (type == "polyline") { type = "lineplottingtool"; }
        else if (type == "polygon") { type = "polygonplottingtool"; }
        html += "<div><img onclick='deleteMapPlot(" + plot.id + ");' src='images/icons/deleteIcon.png' style='float:left;cursor:pointer;' title='删除该标绘' />";
       
        html += "<div class='mapplottingitem tool " + type + "' onmouseover='mapPlotOver(this);' onmouseout='mapPlotOut(this);' onclick='showMapPlotInfo(" + plot.id + ")'>" + plot.title + "</div></div>";
        
    }
    mapPlottingList.innerHTML = html;

    document.getElementById("mapPlotsCounts").innerHTML = "[" + mapPlot.get_list().length + "]";
}

//构造标绘列表
function showMapPlotList() {
    var mapPlottingList = document.getElementById('mapPlottingList');
    showLoading(mapPlottingList, "正在更新标绘信息……");
    updateMapPlotList();
}

//标绘项的鼠标划过事件
function mapPlotOver(obj) {
    obj.style.backgroundColor = "#D5DDF3";
}
//标绘项的鼠标划过事件
function mapPlotOut(obj) {
    obj.style.backgroundColor = "";
}
//显示详细信息
function showMapPlotInfo(id) {
    var plot = mapPlot.get(id);
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
        map.centerAt(shape);
    } else {
        shape = graphic.geometry.getPoint(0, 0);
        map.centerAt(shape);
        //        map.setExtent(graphic.geometry.getExtent().expand(1));
    }
    map.infoWindow.show(map.toScreen(shape), map.getInfoWindowAnchor(map.toScreen(shape)));
    //    var connectZoomEnd = dojo.connect(map, "onExtentChange", function() {
    //        map.infoWindow.show(map.toScreen(shape), map.getInfoWindowAnchor(map.toScreen(shape)));
    //        dojo.disconnect(connectZoomEnd);
    //    });
}
//删除标绘信息
function deleteMapPlot(id) {
    var del = false;
    if (isConfirmBeforeDelete) {
        if (confirm("真的删除么？")) { del = true; }
    } else { del = true; }

    if (del) {
        clearMaps();
        mapPlot.remove(id);
        showMapPlotList();
    }
}

//清除所有
function clearMapPlot() {
    var del = false;
    if (isConfirmBeforeDelete) {
        if (confirm("真的删除么？")) { del = true; }
    } else { del = true; }

    if (del) {
        if (mapPlot != null) mapPlot.clear();
        updateMapPlotList();
    }
}
