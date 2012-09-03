
//公交站点查询
function busLineSearch(type, evt) {
    if (type == "enter") {
        var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
        if (keyCode != 13) {
            return;
        }
    }

    var keyword = Utils.trimString(document.getElementById("busLineText").value);
    if (keyword == "") {
        alert("公交线路名称不能为空");
        return;
    }

    isInBuTransSearch=false;//不是换乘搜索
    //初始化分页信息
    busCurrentPage = 1;
    busPageSize=10;
    
    lineSearch(keyword);

}
//线路查询
function lineSearch(keyword) {

    showBusSearchResultPanel();
    
    showLoading(document.getElementById("busSearchResult"), "正在查询，请稍后……");
    busCurrentQueryConditon["keyword"]=keyword;
    busCurrentQueryConditon["type"]='lineSearch';
    var params = { type: 'queryroute', para: keyword, pageIndex: busCurrentPage, pageSize: busPageSize};
    Request(busStationSearchUrl, params, "GET", displayLineSearchResult);
}

function displayLineSearchResult(responseText){
    var searchObjs=Eval2Obj(responseText);
    searchResultSet=searchObjs.RESULTSET;
    if(searchResultSet==null)   return;
    
    var busSearchResult=document.getElementById("busSearchResult");
    maxSize=parseInt(searchObjs.NUM);
    var html="";
    
    if(searchResultSet.length==0){
        busSearchResult.innerHTML="<img src='images/icons/warning.png' style='margin:5px;float:left;'/><span style='font-size:10pt;line-height:32px;height:32px;'>未找到公交线路</span>";
        return;
    }
    
    for(var i=0;i<searchResultSet.length;i++){
        var solution=searchResultSet[i];
        var lineName=solution['NAME'].split(";");
        var stations=solution['STATIONS'];
        var start=stations[0];
        var end=stations[stations.length-1];
        var price=solution['PRICE'];
        var len=solution['LENGTH'];
        
        if(i==busTransSelecedIndex){
            html+="<div class='trans_selected'>";
        }else{
            html+="<div class='trans_normal'>";
        }
        html+="    <div class='trans_title' onclick='showThisLine("+i+");'>";
        html+="        <div class='title num"+(i+1)+"'></div> ";
        html+="        <div class='title_right'></div>";
        html+="        <div class='title_middle'>"+lineName+"</div>";
        html+="    </div>";
        //附加信息
        html+="    <div class='trans_info'>";
        html+="票价："+price+"元&nbsp;&nbsp;全长："+(len/1000).toFixed(1)+"公里";
        html+="    </div>";
        
        html+="    <div class='trans_content'>";
        html+="        <div class='start'><a href='javascript:void(0);' onclick='isInBuTransSearch=false;showPositionOnMap(\""+start["ID"]+"\",\""+start["COORDS"]+"\");'>"+start["NAME"]+"</a></div>";
        //html+="        <div class='bus1'>途中经过"+(stations.length-2)+"站</div>";
        for(var j=1;j<(stations.length-1);j++){
            html+="        <div class='bus1'><a href='javascript:void(0);' onclick='isInBuTransSearch=false;showPositionOnMap(\""+stations[j]["ID"]+"\",\""+stations[j]["COORDS"]+"\");'>"+stations[j]["NAME"]+"</a></div>";
        }
        html+="        <div class='end'><a href='javascript:void(0);' onclick='isInBuTransSearch=false;showPositionOnMap(\""+end["ID"]+"\",\""+end["COORDS"]+"\");'>"+end["NAME"]+"</a></div>";
        html+="    </div>";
        html+="    <div class='trans_foot'>";
        html+="         <div class='foot_left'></div>";
        html+="         <div class='foot_right'></div>";
        html+="         <div class='foot_middle'></div>";
        html+="    </div>";
        html+="</div>";
    }
    //先选中第一个
    showThisLine(0);
    busSearchResult.innerHTML=html;
}

//显示当前选中的线路
function showThisLine(index){
    //解绑事件
    
    //绑定事件
    dojo.connect(map.graphics, "onMouseOver",busLinePointOnMouseOver);
    //map.graphics的鼠标移开事件
    dojo.connect(map.graphics, "onMouseOut",busLinePointOnMouseOut);
//    
//    dojo.connect(map.graphics,"onClick",dealDelLeng);
//    
    //首先改变显示
    setSelectedItemCss(index);
    clearMaps();
    //绘制线路
    createBusLineTemplate(index);
}

function busLinePointOnMouseOver(evt){
    var gra=evt.graphic;
    if(gra&&gra.symbol.url){
        gra.symbol.setOffset(0,-16);
    }
    document.getElementById("Map1_container").style.cursor="pointer";
}

function busLinePointOnMouseOut(evt){
    var gra=evt.graphic;
    if(gra&&gra.symbol.url){
        gra.symbol.setOffset(0,-13);
    }
    document.getElementById("Map1_container").style.cursor="";
}

//在地图上画出查询到的数据,并添加infoTemplate;
function createBusLineTemplate(index, color) {
    var record = searchResultSet[index];
    var shape = record["COORDS"];
    var name = record["NAME"];
    if (shape.indexOf("LINESTRING") != -1) {
        var pointStr = shape.substring(10);
        shape = wtg.write("line1", pointStr);
    }
    var sms = null;
    if (color == "red") {
        sms = new esri.symbol.CartographicLineSymbol(esri.symbol.CartographicLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 3);
    } else {
        sms = new esri.symbol.CartographicLineSymbol(esri.symbol.CartographicLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 3);
    }

    var graphic = new esri.Graphic(shape, sms);
    map.graphics.add(graphic); //在地图上加上图标
    
    //添加站点图标
    var stations=record["STATIONS"];
    for(var i=0;i<stations.length;i++){
        var point=stations[i]["COORDS"];
        if (point.indexOf("Point") != -1) {
            pointStr = point.substring(5);
            point = wtg.write("point1", pointStr);
        }
        var sym=null;
        if(i==0){//起点
            sym=new esri.symbol.PictureMarkerSymbol("Images/bus/busStart.png", 23, 26);
            sym.setOffset(0, -13);
        }else if(i==(stations.length-1)){//终点
            sym=new esri.symbol.PictureMarkerSymbol("Images/bus/busEnd.png", 23, 26);
            sym.setOffset(0, -13);
        }else{//中间站点
            sym=new esri.symbol.PictureMarkerSymbol("Images/bus/bus1_16.gif", 16, 16);
        }
        var text=new esri.symbol.TextSymbol(stations[i]["NAME"]);
        text.setAlign("ALIGN_START");
        text.setOffset(16, 2);
        var graphic1 = new esri.Graphic(point, sym);
        map.graphics.add(graphic1); //在地图上加上图标
        var graphic2 = new esri.Graphic(point, text);
        map.graphics.add(graphic2); //在地图上加上图标
    }
    
    var dd = shape.getExtent();
    var center=dd.getCenter();
//    map.centerAndZoom(center,3);
    map.setExtent(dd.expand(2));
}

//显示站点位置
function showPositionOnMap(id,coords){
    var point=coords;
    if (point.indexOf("Point") != -1) {
        pointStr = point.substring(5);
        point = wtg.write("point1", pointStr);
    }
    if(map.getLevel()>4){
        map.centerAt(point);
    }else{
        map.centerAndZoom(point,4);
    }
    
    //改变选中站点的颜色
    
}