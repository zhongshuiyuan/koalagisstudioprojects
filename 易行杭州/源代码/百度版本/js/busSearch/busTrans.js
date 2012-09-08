var busTransSearchUrl="Controlller/ChangeSvlt.ashx";
var searchResultSet;//查询结果集
var maxSize;
var busTransSelecedIndex=0;//当前选中的方案
var isInBuTransSearch=false;//判断当前是否为换乘搜索
var searchType = 0; //0为
var defaultBusTransHints='输入起点与终点的站点名称，点击“查询”搜索公交线路；要搜索返程线路，请点击“交换起始点”按钮后，点击“查询”';

//设置起点或终点站点
function setStartOrEndStation(e,type,id,name ){    
 
    if(e & e.stopPropagation){
        e.stopPropagation();
    }else{
        window.event.cancelBubble=true;
    }

    if(type=="start"){
        busCurrentQueryConditon["start"]=id;
        document.getElementById("busStart").value=name;
    }else if(type=="end"){
        busCurrentQueryConditon["end"]=id;
        document.getElementById("busEnd").value=name;
    }
    
    isInBuTransSearch = true;
   
    //判断是否需要继续搜索终点
    checkNextSearch();
    
    
}

//判断是否需要继续搜索终点，主要针对公交换乘的搜索
function checkNextSearch(){
    //如果不是换乘搜索
    //if(!isInBuTransSearch)  return;
    var keyword="";
    var hint=document.getElementById("busTrans_hint");
    if(busCurrentQueryConditon['start']==null || busCurrentQueryConditon['start']==undefined){//搜索起点
        //初始化分页信息
        busCurrentPage = 1;
        keyword=document.getElementById("busStart").value.trim();
        hint.innerHTML="请选择起始站点";
    }else if(busCurrentQueryConditon['end']==null || busCurrentQueryConditon['end']==undefined){//搜索终点
        //初始化分页信息
        busCurrentPage = 1;
        keyword=document.getElementById("busEnd").value.trim();
        hint.innerHTML="请选择终点站点";
    }else{//所有信息齐全，开始查询换乘
        hint.innerHTML=defaultBusTransHints;
        //if( !isInBuTransSearch )    //如果是从到站点查询结果里搜索的话，则直接立刻执行搜索
        //    transSearch(busCurrentQueryConditon['start'],busCurrentQueryConditon['end']);
//        busCurrentQueryConditon['start'],busCurrentQueryConditon['end']
    }

    if (keyword != "") {
        stationSearch(keyword);
    }
}

//当公交查询字符改变时，重置查询条件
function checkTransSearchChange(type,obj){
    if(type=="start"){
        busCurrentQueryConditon["start"]=null;
    }else if(type=="end"){
        busCurrentQueryConditon["end"]=null;
    }
}

//交换起始点
function exchangeStartAndEnd(){
    var busStart=document.getElementById("busStart");   
    var busEnd=document.getElementById("busEnd");   
    
    var tmp=busStart.value;
    busStart.value=busEnd.value;
    busEnd.value=tmp;
    
    tmp=busCurrentQueryConditon["start"];
    busCurrentQueryConditon["start"]=busCurrentQueryConditon["end"];
    busCurrentQueryConditon["end"]=tmp;
    checkNextSearch();
}

//公交换乘
var startKeyword="",endKeyword="";
function busTransSearch(obj,evt,type) {
//    if (type == "enter") {
//        var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
//        if (keyCode != 13) {
//            return;
//        }
//    }

    
    if(type=="busTransSearch"){
        
        //alert( isInBuTransSearch );
        //如果不是换乘搜索
        if (!isInBuTransSearch) return;
        var hint = document.getElementById("busTrans_hint");
        if (busCurrentQueryConditon['start'] == null || busCurrentQueryConditon['start'] == undefined) {//搜索起点
            hint.innerHTML = "请选择起始站点";
            return;
        } else if (busCurrentQueryConditon['end'] == null || busCurrentQueryConditon['end'] == undefined) {//搜索终点
            hint.innerHTML = "请选择终点站点";
            return;
        } else {//所有信息齐全，开始查询换乘
            
            hint.innerHTML = defaultBusTransHints;
            transSearch(busCurrentQueryConditon['start'],busCurrentQueryConditon['end']);
        }
        return;
    }
    
    var keyword=obj.value.trim();
    if(keyword=="") return;
    
    if(type=="start"){        
        if(startKeyword==keyword){
            return;
        }
        startKeyword=keyword;
    }else if(type=="end"){
        if(endKeyword==keyword){
            return;
        }
        endKeyword=keyword;
    }

    isInBuTransSearch=true;    
    stationSearch(keyword);
}

//站点查询
function transSearch(start,end) {

    showBusSearchResultPanel();
    
    showLoading(document.getElementById("busSearchResult"), "正在查询，请稍后……");
    busCurrentQueryConditon = { start:start,end:end,type: 'transSearch' };
    var params = {start: start,end:end};
    Request(busTransSearchUrl, params, "GET", displayTransSearchResult);
}
//显示查询结果
function displayTransSearchResult(responseText){
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
        var lines=solution['LINES'];
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
        html+="    <div class='trans_title' onclick='setCurrentSolution("+i+");'>";
        html+="        <div class='title num"+(i+1)+"'></div> ";
        html+="        <div class='title_right'></div>";
        html+="        <div class='title_middle'>";
        for(var i=0;i<lines.length;i++){
            if(i!=(lines.length-1)){
                html+=lines[i].NAME+">";
            }else{
                html+=lines[i].NAME;
            }
            
        }
        html+="</div>";
        html+="    </div>";
        //附加信息
        html+="    <div class='trans_info'>";
        html+="票价："+price+"元&nbsp;&nbsp;全长："+(len/1000).toFixed(1)+"公里";
        html+="    </div>";
        
        html+="    <div class='trans_content'>";
        html+="        <div class='start'><a href='javascript:void(0);' onclick='isInBuTransSearch=false;showPositionOnMap(\""+start["ID"]+"\",\""+start["COORDS"]+"\");'>"+start.NAME+"</a></div>";
        //html+="        <div class='bus1'>途中经过"+(stations.length-2)+"站</div>";
        for(var j=1;j<(stations.length-1);j++){
            html+="        <div class='trans'><a href='javascript:void(0);' onclick='isInBuTransSearch=false;showPositionOnMap(\""+stations[j]["ID"]+"\",\""+stations[j]["COORDS"]+"\");'>"+stations[j].NAME+"</a></div>";
        }
        html+="        <div class='end'><a href='javascript:void(0);' onclick='isInBuTransSearch=false;showPositionOnMap(\""+end["ID"]+"\",\""+end["COORDS"]+"\");'>"+end.NAME+"</a></div>";
        html+="    </div>";
        html+="    <div class='trans_foot'>";
        html+="         <div class='foot_left'></div>";
        html+="         <div class='foot_right'></div>";
        html+="         <div class='foot_middle'></div>";
        html+="    </div>";
        html+="</div>";
    }
    setCurrentSolution(0);
    busSearchResult.innerHTML=html;
}

//选择当前方案
function setCurrentSolution(index){
    //绑定事件
    dojo.connect(map.graphics, "onMouseOver",busLinePointOnMouseOver);
    //map.graphics的鼠标移开事件
    dojo.connect(map.graphics, "onMouseOut",busLinePointOnMouseOut);
    dojo.connect(map.graphics,"onClick",dealDelLeng);
    
    clearMaps();
    //首先改变显示
    setSelectedItemCss(index);
    //绘制线路
    createBusTransTemplate(index);
}

//设置界面修改
function setSelectedItemCss(index){
    var busSearchResult=document.getElementById("busSearchResult");

    for(var i=0;i<busSearchResult.childNodes.length;i++){
        if(busSearchResult.childNodes[i].tagName=="DIV"){
            busSearchResult.childNodes[i].className="trans_normal";
        }
    }
    if(index<busSearchResult.childNodes.length){
        busSearchResult.childNodes[index].className="trans_selected";
    }
}

//显示换乘线路
function createBusTransTemplate(index,color){
    var record = searchResultSet[index];
    var shape = record["ALLCOORDS"];
//    var name = record["NAME"];
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
            sym=new esri.symbol.PictureMarkerSymbol("Images/bus/busTrans.png", 23, 26);
            sym.setOffset(0, -13);
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