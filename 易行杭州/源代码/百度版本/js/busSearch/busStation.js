var busStationSearchUrl="Controlller/QuerySvlt.ashx";
var stationsSearchResults;//查询结果数据集
var busPageSize = 10;
var busCurrentPage = 1;
var busMaxPage = 0;
var busCurrentQueryConditon={}; //当前查询条件{keyword:keyword,type:type}

//公交站点查询
function busStationSearch(type,evt){
    if(type=="enter"){
        var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
        if (keyCode != 13) {
            return;
        }
    }    
    
    var keyword=Utils.trimString(document.getElementById("busStationsText").value);
    if(keyword==""){
        alert("站点名称不能为空");
        return;
    }

    isInBuTransSearch=false;//不是换乘搜索
    //初始化分页信息
    busCurrentPage = 1;
    busPageSize=10;

    stationSearch(keyword);

}
//站点查询
function stationSearch(keyword){

    showBusSearchResultPanel();

    showLoading(document.getElementById("busSearchResult"), "正在查询，请稍后……");
    busCurrentQueryConditon["keyword"]=keyword;
    busCurrentQueryConditon["type"]='stationSearch';
    var params={type:'querystation',para:keyword,pageIndex:busCurrentPage,pageSize:busPageSize};
    Request(busStationSearchUrl,params,"GET",displayStationSearchResult);
}

function displayStationSearchResult(responseText){
    try{
        stationsSearchResults=Eval2Obj(responseText);
    }catch(e){
        return;
    }
    clearMaps();
    
    var strArr=[];
    if (stationsSearchResults=="" || stationsSearchResults == null || stationsSearchResults.NUM == 0) {
        strArr.push("<span style='text-decoration:none;font-size:12px;'>共查询到0条记录</span>");
    } else {
        var wholeSearchObjectArr = stationsSearchResults.RESULTSET;
        var num = stationsSearchResults.NUM;
        busMaxPage = parseInt((parseInt(stationsSearchResults.NUM) + busPageSize - 1) / busPageSize);

        for (var i = 0; i < wholeSearchObjectArr.length; i++) {
            var geometry = wholeSearchObjectArr[i]["COORDS"];
            var name = wholeSearchObjectArr[i]["NAME"];
            var id = wholeSearchObjectArr[i]["ID"];
            index = i + 1;

            strArr.push("<div class='one' onmouseover='station_onMouseOverRecord(" + i + ",\"" + geometry + "\",this);' onmouseout='station_onMouseOutRecord(" + i + ",\"" + geometry + "\",this);' onClick='busStations_toLocation(\"" + geometry + "\"," + i + ");'>");
            strArr.push("<div class='img'><img src='Images/dingwei/dw"+index+".png' /></div>");
            strArr.push("<div class='content'>");
            strArr.push("<div class='title'><a href='javascript:void(0);'>"+name+"</a></div>");
            strArr.push("<div class='detail'>");
            if(isInBuTransSearch){
                strArr.push("<a href='javascript:void(0);' style='color:black' onclick='setStartOrEndStation(event,\"start\",\""+id+"\",\""+name+"\");'>选为起点</a>‖<a href='javascript:void(0);' style='color:black;' onclick='setStartOrEndStation(event,\"end\",\""+id+"\",\""+name+"\");'>选为终点</a>");
            }else{
                strArr.push("<a href='javascript:void(0);' style='color:black' onclick='setStartOrEndStation(event,\"start\",\""+id+"\",\""+name+"\");'>从这里出发</a>‖<a href='javascript:void(0);' style='color:black;' onclick='setStartOrEndStation(event,\"end\",\""+id+"\",\""+name+"\");'>到这里去</a>");
            }
            
            strArr.push("</div></div></div>");
            busStations_createInfoTemplate(index, "red");
        }
        strArr.push("<table align=center cellspacing='2' border='0' cellpadding='2' >");
        strArr.push("<tr><td style='font-size:12px;text-align:center;' align='center' >共");
        strArr.push(num);
        strArr.push("条,当前第");
        strArr.push(busCurrentPage);
        strArr.push("/");
        strArr.push(busMaxPage);
        strArr.push("页</td></tr>");
        if (busMaxPage == 0) {
            strArr.push("<tr><td align='center'>&nbsp;</td></tr></table>");
        } else {
            ifDisable_head = (busCurrentPage == 1) ? true : false;
            ifDisable_foot = (busCurrentPage == busMaxPage) ? true : false;
            strArr.push("<tr><td align='center'>");
            strArr.push("<a style='color:black;text-decoration:none;font-size:13px;");
            strArr.push((ifDisable_head ? "color:black;'" : "cursor:pointer;' onclick='busStations_head1()'"));
            strArr.push(">首 页</a>&nbsp;");
            strArr.push("<a style='color:black;text-decoration:none;font-size:13px;");
            strArr.push((ifDisable_head ? "color:black;'" : "cursor:pointer;' onclick='busStations_pre1()'"));
            strArr.push(">上一页</a>&nbsp;");
            strArr.push("<a style='color:black;text-decoration:none;font-size:13px;");
            strArr.push((ifDisable_foot ? "color:black;'" : "cursor:pointer;' onclick='busStations_next1()'"));
            strArr.push(">下一页</a>&nbsp;");
            strArr.push("<a style='color:black;text-decoration:none;font-size:13px;");
            strArr.push((ifDisable_foot ? "color:black;'" : "cursor:pointer;' onclick='busStations_tail1()'"));
            strArr.push(">末 页</a>");
            strArr.push("</td></tr></table>");
        }
//        map1.setExtent(rExtent.expand(2));
        //        rExtent = null;



        document.getElementById("busSearchResult").innerHTML = strArr.join("");

        
    }

   
}

function station_onMouseOverRecord(i, shape, oRow) {
    //oRow.style.backgroundColor = "#F6F6F6";
//    var graphics = map1.graphics.graphics;
//    var grap = getOneGrapByShape(shape, graphics);
//    map1.graphics.remove(grap);
//    createInfoTemplate(parseInt(i) + 1, "blue");
}

function station_onMouseOutRecord(i, shape, oRow) {
    //oRow.style.backgroundColor = "#FFFFFF";
//    var graphics = map1.graphics.graphics;
//    var grap = getOneGrapByShape(shape, graphics);
//    map1.graphics.remove(grap);
//    createInfoTemplate(parseInt(i) + 1, "red");
}



//首页	
function busStations_head1() {
    busCurrentPage = 1;
    buspageOperate1();
}

//下一页
function busStations_next1() {
    busCurrentPage++;
    if (busCurrentPage >= busMaxPage) busCurrentPage = busMaxPage;
    buspageOperate1();
}

//上一页
function busStations_pre1() {
    busCurrentPage--;
    if (busCurrentPage <= 0) busCurrentPage = 1;
    buspageOperate1();
}

//末页
function busStations_tail1() {
    busCurrentPage = busMaxPage;
    buspageOperate1();
}

//查询处理过程
function buspageOperate1() {
    if (map1.graphics == null) return;
    clearMaps(); //清楚地图上已有的graphics

    if (busCurrentQueryConditon != null) {
        switch (busCurrentQueryConditon.type) {
            case "stationSearch":
                stationSearch(busCurrentQueryConditon.keyword);
                break;
            case "lineSearch":
                lineSearch(busCurrentQueryConditon.keyword);
                break;
        }
    }
}

//点击查询结果
function busStations_toLocation(shape, i){
    var graphics = map1.graphics.graphics;
    var grapGeo = null;
    var grap = null;
    if (shape.indexOf("Point") != -1) {
        var pointStr = shape.substring(5);
        shape = wtg.write("point1", pointStr);
        for (var j = 0; j < graphics.length; j++) {
            grapGeo = graphics[j].geometry;
            if (shape.x == grapGeo.x && shape.y == grapGeo.y) {
                grap = graphics[j];
                break;
            }
        }
    }
    if (grap == null) {
        busStations_createInfoTemplate(parseInt(i) + 1, "red");
        grap = map1.graphics.graphics[map1.graphics.graphics.length - 1];
    }
    
    var record = stationsSearchResults.RESULTSET[i];
    var infoWindow = map.infoWindow;
    var title = record["NAME"];
    infoWindow.setTitle(title);
    
    var str = '<div id="description"  style="display:block;line-height:20px;">经过线路：</div>';

    infoWindow.setContent(str);
    map.centerAndZoom(shape, 4);
    var connectZoomEnd = dojo.connect(map.map, "onExtentChange", function() {
        map.infoWindow.show(map.toScreen(shape), map.getInfoWindowAnchor(map.toScreen(shape)));
        dojo.disconnect(connectZoomEnd);
    });
}

//在地图上画出查询到的数据,并添加infoTemplate;
function busStations_createInfoTemplate(index, color) {
    var record = stationsSearchResults.RESULTSET[index - 1];    
    var shape = record["COORDS"];
    var name = record["NAME"];
    if (shape.indexOf("Point") != -1) {
        var pointStr = shape.substring(5);        
        shape = wtg.write("point1", pointStr);
    }
    var sms = null;
    if (color == "red") {
        sms = new esri.symbol.PictureMarkerSymbol("Images/dingwei/dw" + index + ".png", 23, 25);
    } else {
        sms = new esri.symbol.PictureMarkerSymbol("Images/dingwei/dw" + index + "x.png", 23, 25);
    }
    
    var lines=record["LINES"];
    var strContent = '<div id="description" style="display:block;line-height:25px;text-align:left;">经过线路：<br />';
    for(var i=0;i<lines.length;i++){
        strContent+='<a href="javascript:void(0);" style="color:black;" onclick="isInBuTransSearch=false;lineSearch(\''+lines[i].NAME+'\');">'+lines[i].NAME+'‖</a>';
    }
    strContent+='</div>';    
    
    var title =name;
    var infoTemplate = new esri.InfoTemplate(title, strContent);
    
    var graphic = new esri.Graphic(shape, sms, {}, infoTemplate);
    map.graphics.add(graphic); //在地图上加上图标
    var dd = shape.getExtent();
    if (index == 1)
        rExtent = graphic._extent;
    else
        if (rExtent != null) {
        rExtent = rExtent.union(graphic._extent);
    }
}
