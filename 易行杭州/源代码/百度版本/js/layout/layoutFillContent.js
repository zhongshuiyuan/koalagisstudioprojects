

function fillPanelContent(panel, panelName) {
    if (panel.id == "map_search_panel") {
        fillPanelContent_PnList(panel);
    }
    else if (panel.id == "poi_search_panel") {
        fillPanelContent_PoiList(panel);
    }
    else if (panel.id == "bus_search_panel") {
        fillPanelContent_Bus(panel);
    }
    else if (panel.id == "map_plot_panel") {
        fillPanelContent_MapMark(panel);
    }
    else if (panel.id == "map_correct_panel") {
        fillPanelContent_MapCorrect(panel);
    }
    else if (panel.id == "weather_forecase_panel") {
        fillPanelContent_Weather(panel);
    }
    else if (panel.id == "about_us_panel") {
        fillPanelContent_AboutUs(panel);
    }
}


///填充地名
function fillPanelContent_PnList(panel) {
    var html = '<div id="regionSearch" class="regionsearch">' +
                    '<div id="regionSearch_title" class="regionSearch_title">' +
                        '&nbsp; <span id="regionSearch_title_text">' +
                               ' 选择地市</span>' +
                    '</div>' +
                    '<div id="regionSearch_content" class="regionSearch_content">' +
                        '<table cellpadding="0" cellspacing="0">' +
                            '<tr>' +
                                '<td>' +
                                   ' <div id="regionList" class="regionlist">' +
                                   ' </div>' +
                                '</td>' +
                            '</tr>' +
//                            '<tr>' +
//                                '<td>' +
//                                    '<div id="regionCondition" class="regioncondition">' +
//                                        '当前选中：杭州市<img src="images/icons/delete.png" title="清除此查询条件" style="cursor: pointer;' +
//                                            'vertical-align: bottom; margin-left: 5px;" />' +
//                                    '</div>' +
//                                '</td>' +
//                            '</tr>' +
                            '<tr>' +
                                '<td>' +
                                    '<div id="regionSearchPanel" class="regionsearchpanel">' +
                                        '<input id="regionSearchKeywords" type="text" style="width: 140px;" />&nbsp;<input' +
                                            ' type="button" value="查询" style="width: 40px;" id="regionSearchBtn" onclick="regionSearchByKeywords();" />' +
                                    '</div>' +
                                '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' +
                                    '<div class="hints">' +
                                        '只要具备“查询条件”与关键字中至少一个即可进行查询</div>' +
                                '</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                '</div>';
    
    
    panel.set_content( html );

    iniPNList();

}


///填充兴趣点
function fillPanelContent_PoiList(panel) {

    var html = '<div id="poiSearch" class="poiSearch_title">' +
                    '&nbsp; <span id="poiSearch_title_text">' +
                            '选择兴趣点分类</span>' +
                '</div>' +
                '<div id="poiSearch_content" class="poiSearch_content">' +
                    '<table cellpadding="0" cellspacing="0">' + 
                        '<tr>' +
                            '<td>' +
                                '<div id="poiSearchList" class="poisearchlist">' +
                                    '<a href="#">公共管理</a><a href="#">交通运输</a><a href="#">金融保险</a><a href="#">房产楼盘</a><a ' +
                                        'href="#">生活服务</a> <a href="#">住宿</a><a href="#">餐饮</a><a href="#">休闲娱乐</a><a href="#">旅游服务</a><a ' +
                                            'href="#">医疗卫生</a> <a href="#">文化媒体</a><a href="#">自然要素</a><a href="#">其他</a>' +
                                '</div>' +
                            '</td>' +
                        '</tr>' +
//                        '<tr>' +
//                            '<td>' +
//                                '<div id="poiSearchCondition" class="poisearchcondition">' +
//                                    '当前选中：公共管理<img src="images/icons/delete.png" title="清除此查询条件" /> ' +
//                                '</div> ' +
//                            '</td>' +
//                        '</tr>' +
                        '<tr>' +
                            '<td>' +
                                '<div id="poiSearchPanel" class="poisearchpanel">' +
                                    '<input id="poiSearchKeywords" type="text" style="width: 140px;" />&nbsp;<input ' +
                                        'id="poiSearchBtn" type="button" value="查询" style="width: 40px;" onclick="poiSearchByKeywords();" /> ' +
                                '</div>' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>' +
                                '<div class="hints">' +
                                    '只要具备“查询条件”与关键字中至少一个即可进行查询</div>' +
                            '</td>' +
                        '</tr>' +
                    '</table>' +
                '</div>';

    panel.set_content(html);

    iniPoiList();

}


///填充公交查询
function fillPanelContent_Bus(panel) {
    
    //var shtml = "<table cellpadding='0' cellspacing='0'><tr>";
    //shtml += "<td id='tdBusLeft' style='width:" + panel.width + "px;'>";
    var shtml = '';
    var html = '' + 
            '<div id="busSearchli_con" class="menucontainer" style="display: block;">' +
                '<div id="busSearchImg" class="bussearchimg">' + 
                    '<a id="busTrans" onclick="busSearchClick(this);" href="javascript:void(0)" title="公交换乘查询" class="tool bussearchtool">换乘</a> ' +
                    '<a id="busLine"  onclick="busSearchClick(this);" href="javascript:void(0)" title="公交线路查询" class="tool buslinesearchtool">线路</a>' + 
                    '<a id="busStop"  onclick="busSearchClick(this);" href="javascript:void(0)" title="公交站点查询" class="tool busstopsearchtool">站点</a> ' +
                '</div>' +
                '<div id="busSearch_con">' +
                    '<div id="busTrans_con" class="bus">' +
                        '<table>' +
                            '<tr>' +
                                '<td> 起点：</td>' +
                                '<td>' +
                                    '<input id="busStart" type="text" style="width: 150px;" onkeyup="busTransSearch(this,event,\'start\');"  onchange="checkTransSearchChange(\'start\',this);"/>' +
                                '</td>'+
                                '<td rowspan="2" valign="middle" align="center">' +
                                    '<img src="Images/icons/exchangeStop.png" style="cursor: pointer;" title="交换起始点" onclick="exchangeStartAndEnd();"/>' +
                                '</td>' +
                            '</tr>'+
                            '<tr>' +
                                '<td>终点：</td>' +
                                '<td>' +
                                    '<input id="busEnd" type="text" style="width: 150px;" onkeyup="busTransSearch(this,event,\'end\');"  onchange="checkTransSearchChange(\'end\',this);"/>' +
                                '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td colspan="2" valign="middle" align="right">' +
                                    '<input type="button" id="busTrans_con_btn" value="查询"  onclick="busTransSearch(this,event,\'busTransSearch\');"/>' +
                                '</td>' +
                                '<td>&nbsp;</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                    '<div id="busLine_con" class="bus" style="display: none;">' +
                        '<table>' +
                            '<tr>' +
                                '<td>线路：</td>' +
                                '<td>' +
                                    '<input type="text" style="width: 150px;" id="busLineText"  onkeyup="busLineSearch(\'enter\',event);"  />' +
                                '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td valign="middle" align="right" colspan="2">' +
                                    '<input type="button" id="busLine_con_btn" value="查询线路" onclick="busLineSearch();" />' +
                                '</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                    '<div id="busStop_con" class="bus" style="display: none;">' +
                        '<table>' +
                            '<tr>' +
                                '<td>站点：</td>' +
                                '<td><input id="busStationsText" type="text" style="width: 150px;" onkeyup="busStationSearch(\'enter\',event);"/></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td valign="middle" align="right" colspan="2">' +
                                    '<input type="button" id="busStop_con_btn" value="查询站点" onclick="busStationSearch();" />' +
                                '</td>' +
                                '<td>&nbsp;</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                '</div>' +
                '<div id="busTrans_hint" class="hints">' +
                    '输入起点与终点的站点名称，点击“查询”搜索公交线路；要搜索返程线路，请点击“交换起始点”按钮后，点击“查询”' +
                '</div>' +
                '<div id="busLine_hint" class="hints" style="display: none;">' +
                    '输入公交线路查询该线路相关信息，如站点，首末班时间。' +
                '</div>' +
                '<div id="busStop_hint" class="hints" style="display: none;">' +
                    '输入站点名称，查询经过该站点的所有公交线路。' +
                '</div>' +
            '</div>';
            
    shtml += html ;
    //shtml += "<div id='busStationResult' class='bussearchresult' style='position:absolute; left: 240px; top:2px;'></div>"
            
    panel.set_content( shtml );
}


function showDropdownList(type) {
    if (document.getElementById("divDropdownList").style.display == "block"){
        document.getElementById("divDropdownList").style.display = "none";
        return;
    }
    
    document.getElementById("divDropdownList").style.display = "block";

    if (type == "symbol") {
        var symbolHTML = "<table cellspacing='0' class='symboltable'>";

        symbolHTML += "<tr>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark1.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark2.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark3.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark4.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark5.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark6.png'/></td>";
        symbolHTML += "</tr>";

        symbolHTML += "<tr>";
        
        symbolHTML += "<td ><img src='images/biaohui_icons/mark7.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark8.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark9.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark10.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark11.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark12.png'/></td>";
        symbolHTML += "</tr>";

        symbolHTML += "<tr>";
        
        symbolHTML += "<td ><img src='images/biaohui_icons/mark13.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark14.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark15.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark16.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark17.png'/></td>";
        symbolHTML += "<td ><img src='images/biaohui_icons/mark18.png'/></td>";
        symbolHTML += "</tr>";

        symbolHTML += "</table>";

        document.getElementById("divDropdownList").innerHTML = symbolHTML;
    }
    else if (type == "linecolor" || type == "fillcolor") {

        var colortable = '<table cellspacing="0" class="colortable"><tr>' +
			      '<td  height="10" width="10"  hx="f00"  style=" background: none repeat scroll 0% 0% rgb(255, 0, 0);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="ff0"  style=" background: none repeat scroll 0% 0% rgb(255, 255, 0);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="0f0"  style=" background: none repeat scroll 0% 0% rgb(0, 255, 0);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="0ff"  style=" background: none repeat scroll 0% 0% rgb(0, 255, 255);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="00f"  style=" background: none repeat scroll 0% 0% rgb(0, 0, 255);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="f0f"  style=" background: none repeat scroll 0% 0% rgb(255, 0, 255);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="fff"  style=" background: none repeat scroll 0% 0% rgb(255, 255, 255);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="ebebeb"  style=" background: none repeat scroll 0% 0% rgb(235, 235, 235);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="e1e1e1"  style=" background: none repeat scroll 0% 0% rgb(225, 225, 225);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="d7d7d7"  style=" background: none repeat scroll 0% 0% rgb(215, 215, 215);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="cccccc"  style=" background: none repeat scroll 0% 0% rgb(204, 204, 204);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="c2c2c2"  style=" background: none repeat scroll 0% 0% rgb(194, 194, 194);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="b7b7b7"  style=" background: none repeat scroll 0% 0% rgb(183, 183, 183);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="acacac"  style=" background: none repeat scroll 0% 0% rgb(172, 172, 172);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="a0a0a0"  style=" background: none repeat scroll 0% 0% rgb(160, 160, 160);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="959595"  style=" background: none repeat scroll 0% 0% rgb(149, 149, 149);">&nbsp;</td>' +
			    '</tr>' +
			    '<tr>' +
			      '<td  height="10" width="10"  hx="ee1d24"  style=" background: none repeat scroll 0% 0% rgb(238, 29, 36);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="fff100"  style=" background: none repeat scroll 0% 0% rgb(255, 241, 0);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="00a650"  style=" background: none repeat scroll 0% 0% rgb(0, 166, 80);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="00aeef"  style=" background: none repeat scroll 0% 0% rgb(0, 174, 239);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="2f3192"  style=" background: none repeat scroll 0% 0% rgb(47, 49, 146);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="ed008c"  style=" background: none repeat scroll 0% 0% rgb(237, 0, 140);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="898989"  style=" background: none repeat scroll 0% 0% rgb(137, 137, 137);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="7d7d7d"  style=" background: none repeat scroll 0% 0% rgb(125, 125, 125);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="707070"  style=" background: none repeat scroll 0% 0% rgb(112, 112, 112);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="626262"  style=" background: none repeat scroll 0% 0% rgb(98, 98, 98);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="555"  style=" background: none repeat scroll 0% 0% rgb(85, 85, 85);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="464646"  style=" background: none repeat scroll 0% 0% rgb(70, 70, 70);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="363636"  style=" background: none repeat scroll 0% 0% rgb(54, 54, 54);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="262626"  style=" background: none repeat scroll 0% 0% rgb(38, 38, 38);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="111"  style=" background: none repeat scroll 0% 0% rgb(17, 17, 17);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="000"  style=" background: none repeat scroll 0% 0% rgb(0, 0, 0);">&nbsp;</td>' +
			    '</tr>' +
			    '<tr>' +
			      '<td  height="10" width="10"  hx="f7977a"  style=" background: none repeat scroll 0% 0% rgb(247, 151, 122);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="fbad82"  style=" background: none repeat scroll 0% 0% rgb(251, 173, 130);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="fdc68c"  style=" background: none repeat scroll 0% 0% rgb(253, 198, 140);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="fff799"  style=" background: none repeat scroll 0% 0% rgb(255, 247, 153);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="c6df9c"  style=" background: none repeat scroll 0% 0% rgb(198, 223, 156);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="a4d49d"  style=" background: none repeat scroll 0% 0% rgb(164, 212, 157);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="81ca9d"  style=" background: none repeat scroll 0% 0% rgb(129, 202, 157);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="7bcdc9"  style=" background: none repeat scroll 0% 0% rgb(123, 205, 201);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="6ccff7"  style=" background: none repeat scroll 0% 0% rgb(108, 207, 247);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="7ca6d8"  style=" background: none repeat scroll 0% 0% rgb(124, 166, 216);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="8293ca"  style=" background: none repeat scroll 0% 0% rgb(130, 147, 202);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="8881be"  style=" background: none repeat scroll 0% 0% rgb(136, 129, 190);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="a286bd"  style=" background: none repeat scroll 0% 0% rgb(162, 134, 189);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="bc8cbf"  style=" background: none repeat scroll 0% 0% rgb(188, 140, 191);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="f49bc1"  style=" background: none repeat scroll 0% 0% rgb(244, 155, 193);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="f5999d"  style=" background: none repeat scroll 0% 0% rgb(245, 153, 157);">&nbsp;</td>' +
			    '</tr>' +
			    '<tr>' +
			      '<td  height="10" width="10"  hx="f16c4d"  style=" background: none repeat scroll 0% 0% rgb(241, 108, 77);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="f68e54"  style=" background: none repeat scroll 0% 0% rgb(246, 142, 84);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="fbaf5a"  style=" background: none repeat scroll 0% 0% rgb(251, 175, 90);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="fff467"  style=" background: none repeat scroll 0% 0% rgb(255, 244, 103);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="acd372"  style=" background: none repeat scroll 0% 0% rgb(172, 211, 114);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="7dc473"  style=" background: none repeat scroll 0% 0% rgb(125, 196, 115);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="39b778"  style=" background: none repeat scroll 0% 0% rgb(57, 183, 120);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="16bcb4"  style=" background: none repeat scroll 0% 0% rgb(22, 188, 180);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="00bff3"  style=" background: none repeat scroll 0% 0% rgb(0, 191, 243);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="438ccb"  style=" background: none repeat scroll 0% 0% rgb(67, 140, 203);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="5573b7"  style=" background: none repeat scroll 0% 0% rgb(85, 115, 183);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="5e5ca7"  style=" background: none repeat scroll 0% 0% rgb(94, 92, 167);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="855fa8"  style=" background: none repeat scroll 0% 0% rgb(133, 95, 168);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="a763a9"  style=" background: none repeat scroll 0% 0% rgb(167, 99, 169);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="ef6ea8"  style=" background: none repeat scroll 0% 0% rgb(239, 110, 168);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="f16d7e"  style=" background: none repeat scroll 0% 0% rgb(241, 109, 126);">&nbsp;</td>' +
			    '</tr>' +
			    '<tr>' +
			      '<td  height="10" width="10"  hx="ee1d24"  style=" background: none repeat scroll 0% 0% rgb(238, 29, 36);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="f16522"  style=" background: none repeat scroll 0% 0% rgb(241, 101, 34);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="f7941d"  style=" background: none repeat scroll 0% 0% rgb(247, 148, 29);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="fff100"  style=" background: none repeat scroll 0% 0% rgb(255, 241, 0);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="8fc63d"  style=" background: none repeat scroll 0% 0% rgb(143, 198, 61);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="37b44a"  style=" background: none repeat scroll 0% 0% rgb(55, 180, 74);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="00a650"  style=" background: none repeat scroll 0% 0% rgb(0, 166, 80);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="00a99e"  style=" background: none repeat scroll 0% 0% rgb(0, 169, 158);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="00aeef"  style=" background: none repeat scroll 0% 0% rgb(0, 174, 239);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="0072bc"  style=" background: none repeat scroll 0% 0% rgb(0, 114, 188);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="0054a5"  style=" background: none repeat scroll 0% 0% rgb(0, 84, 165);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="2f3192"  style=" background: none repeat scroll 0% 0% rgb(47, 49, 146);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="652c91"  style=" background: none repeat scroll 0% 0% rgb(101, 44, 145);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="91278f"  style=" background: none repeat scroll 0% 0% rgb(145, 39, 143);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="ed008c"  style=" background: none repeat scroll 0% 0% rgb(237, 0, 140);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="ee105a"  style=" background: none repeat scroll 0% 0% rgb(238, 16, 90);">&nbsp;</td>' +
			    '</tr>' +
			    '<tr>' +
			      '<td  height="10" width="10"  hx="9d0a0f"  style=" background: none repeat scroll 0% 0% rgb(157, 10, 15);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="a1410d"  style=" background: none repeat scroll 0% 0% rgb(161, 65, 13);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="a36209"  style=" background: none repeat scroll 0% 0% rgb(163, 98, 9);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="aba000"  style=" background: none repeat scroll 0% 0% rgb(171, 160, 0);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="588528"  style=" background: none repeat scroll 0% 0% rgb(88, 133, 40);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="197b30"  style=" background: none repeat scroll 0% 0% rgb(25, 123, 48);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="007236"  style=" background: none repeat scroll 0% 0% rgb(0, 114, 54);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="00736a"  style=" background: none repeat scroll 0% 0% rgb(0, 115, 106);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="0076a4"  style=" background: none repeat scroll 0% 0% rgb(0, 118, 164);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="004a80"  style=" background: none repeat scroll 0% 0% rgb(0, 74, 128);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="003370"  style=" background: none repeat scroll 0% 0% rgb(0, 51, 112);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="1d1363"  style=" background: none repeat scroll 0% 0% rgb(29, 19, 99);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="450e61"  style=" background: none repeat scroll 0% 0% rgb(69, 14, 97);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="62055f"  style=" background: none repeat scroll 0% 0% rgb(98, 5, 95);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="9e005c"  style=" background: none repeat scroll 0% 0% rgb(158, 0, 92);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="9d0039"  style=" background: none repeat scroll 0% 0% rgb(157, 0, 57);">&nbsp;</td>' +
			    '</tr>' +
			    '<tr>' +
			      '<td  height="10" width="10"  hx="790000"  style=" background: none repeat scroll 0% 0% rgb(121, 0, 0);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="7b3000"  style=" background: none repeat scroll 0% 0% rgb(123, 48, 0);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="7c4900"  style=" background: none repeat scroll 0% 0% rgb(124, 73, 0);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="827a00"  style=" background: none repeat scroll 0% 0% rgb(130, 122, 0);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="3e6617"  style=" background: none repeat scroll 0% 0% rgb(62, 102, 23);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="045f20"  style=" background: none repeat scroll 0% 0% rgb(4, 95, 32);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="005824"  style=" background: none repeat scroll 0% 0% rgb(0, 88, 36);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="005951"  style=" background: none repeat scroll 0% 0% rgb(0, 89, 81);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="005b7e"  style=" background: none repeat scroll 0% 0% rgb(0, 91, 126);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="003562"  style=" background: none repeat scroll 0% 0% rgb(0, 53, 98);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="002056"  style=" background: none repeat scroll 0% 0% rgb(0, 32, 86);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="0c004b"  style=" background: none repeat scroll 0% 0% rgb(12, 0, 75);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="30004a"  style=" background: none repeat scroll 0% 0% rgb(48, 0, 74);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="4b0048"  style=" background: none repeat scroll 0% 0% rgb(75, 0, 72);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="7a0045"  style=" background: none repeat scroll 0% 0% rgb(122, 0, 69);">&nbsp;</td>' +
			      '<td  height="10" width="10"  hx="7a0026"  style="background: none repeat scroll 0% 0% rgb(122, 0, 38);">&nbsp;</td>' +
			    '</tr></table>';


        document.getElementById("divDropdownList").innerHTML = colortable;

    }
    else if (type == "linewidth") {
        var linetab = "<table class='linewidthtable'>";
        linetab += "<tr><td linewidth='1'><hr width='100px' size=1 color=#000000/></td></tr>";
        linetab += "<tr><td linewidth='2'><hr width='100px' size=2 color=#000000/></td></tr>";
        linetab += "<tr><td linewidth='3'><hr width='100px' size=3 color=#000000/></td></tr>";
        linetab += "<tr><td linewidth='4'><hr width='100px' size=4 color=#000000/></td></tr>";
        linetab += "<tr><td linewidth='5'><hr width='100px' size=5 color=#000000/></td></tr>";
        linetab += "<tr><td linewidth='6'><hr width='100px' size=6 color=#000000/></td></tr>";
        linetab += "</table>";

        document.getElementById("divDropdownList").innerHTML = linetab;
    }

    ///通过jquery获取所有的td对象
    var tds = $("#divDropdownList table tr td");
    tds.click(function() { tdClick(this, type); });
    tds.mouseover(function() { mouseover(this, type); });
    tds.mouseout(function() { mouseout(this, type); });
}

function mouseover(sender,type ) {
    sender.style.border = "solid 1px white";
}

function mouseout(sender, type) {
    if (type == "linecolor" || type == "fillcolor") {
        sender.style.border = "solid 1px black";
    }
    else if (type == "linewidth") {
        sender.style.border = "solid 0px black";
    }
    else if (type == "symbol") {
        sender.style.border = "solid 1px black";
    }

}

function tdClick(sender, type) {

    document.getElementById("divDropdownList").style.display = "none";
    
    if (type == "linecolor") {
        plot_line_symbol.setColor(new dojo.Color("#" + sender.hx));
    }
    else if (type == "fillcolor") {
        plot_polygon_symbol.setColor(new dojo.Color("#" + sender.hx));
    }
    else if (type == "linewidth") {
        //sender.style.border = "solid 0px black";
        plot_line_symbol.setWidth( sender.linewidth );
    }
    else if (type == "symbol") {
        plot_point_symbol.setUrl(sender.childNodes[0].src);
    }
}


///地图标绘制
function fillPanelContent_MapMark(panel) {

    var html = '<div id="mapPlotting" class="mapplotting" >' +
                    '<div id="mapPlotting_title" class="mapplotting_title">' +
                        '&nbsp;<span id="Span1">地图标绘</span><span ' +
                               ' id="mapPlotsCounts"></span>&nbsp;<a href="javascript:void(0);" onclick="clearMapPlot();">全部删除</a>' +
                    '</div>' +
                    '<div id="mapPlotting_content" class="mapplotting_content" style="position:relative;" >' +
                        '<table cellspacing="0">' +
                            '<tr>' +
                                '<td align="left">' +
                                    '<a  title="点符号" style="cursor:pointer" onclick="showDropdownList(\'symbol\')"><img style="width:28px; height:28px;" src="images/biaohui_icons/dtbh.png"/></a>' +
                                    '<a  title="线颜色" style="cursor:pointer" onclick="showDropdownList(\'linecolor\')"><img src="images/biaohui_icons/marklinecolor.png"/></a>' +
                                    '<a  title="填充颜色" style="cursor:pointer" onclick="showDropdownList(\'fillcolor\')"><img src="images/biaohui_icons/markfillcolor.png"/></a>' +
                                    '<a  title="线宽" style="cursor:pointer" onclick="showDropdownList(\'linewidth\')"><img src="images/biaohui_icons/marklinewidth.png"/></a>' +
                                    '| ' +
                                    '<a href="javascript:void(0)" title="点标绘"  id="mapPointPlot" onclick="MapToolOnClick(\'mappointplot\');"><img src="images/biaohui_icons/markpoint.png"/></a>' +
                                    '<a href="javascript:void(0)" title="线标绘" id="mapLinePlot" onclick="MapToolOnClick(\'maplineplot\');"> <img src="images/biaohui_icons/markline.png"/></a> ' + 
                                    '<a href="javascript:void(0)" title="面标绘" class="" id="mapPolygonPlot" onclick="MapToolOnClick(\'mappolygonplot\');"><img src="images/biaohui_icons/markpolygon.png"/></a>' +
                               ' </td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><div style="position:relative;"><div id="divDropdownList" class="dropdownDiv"></div><div></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' +
                                    '<div id="mapPlottingList" class="mapplottinglist">' +
                                    '</div>' +
                                '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' +
                                    '<div class="hints">' +
                                       ' 选择"点标绘"，"线标绘"，"面标绘"工具，然后在地图窗口中绘制您的图形，输入相关信息并保存。' +
                                    '</div>' +
                                '</td>' +
                            '</tr>' +
                        '</table>' +
                        
                    '</div>'
                '</div>';

    panel.set_content(html);

    iniMapPlots(); //标绘初始化
}


function fillPanelContent_MapCorrect( panel ) {

    var html = '<div id="mapCorrection" class="mapcorrection">' +
                    '<div id="mapCorrection_title" class="mapcorrection_title">' +
                        '&nbsp; <span id="Span2">地图纠错</span><span ' +
                               ' id="mapCorrectionsCounts"></span>&nbsp;<a href="javascript:void(0);" onclick="clearMapCorrections();">全部删除</a>' +
                    '</div>' +
                    '<div id="mapCorrection_content" class="mapcorrection_content">' +
                        '<table cellspacing="0">' +
                            '<tr>' +
                                '<td align="left">' +
                                    '<a href="javascript:void(0)" title="添加纠错信息" class="tool mapcorrectionaddtool" id="mapPointCorrection"' +
                                        'onclick="MapToolOnClick(\'mappointcorrection\');">添加纠错</a>' +
                                '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' +
                                    '<div id="mapCorrectionList" class="mapcorrectionlist">' +
                                        '您尚未添加纠错信息' +
                                    '</div>' +
                                '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>' +
                                    '<div class="hints">' +
                                        '选择"添加纠错"工具，然后在地图窗口选择纠错位置，输入相关信息并保存。' +
                                    '</div>' +
                                '</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                '</div>';

    panel.set_content(html);

    iniMapCorrections(); //纠错初始化

}


function fillPanelContent_MapTool(panel) {

    var html = '<div id="MapToolbar" class="maptoolbar">'+
            '<table width="100%" height="100%" cellpadding="2">' +
                '<tr>' +
                   ' <!--地名快速定位-->' +
                    '<td align="left" valign="middle">' +
                        '<div id="CurrentWeather" class="quickpn"></div>' +
                    '</td>' +
                    '<td align="right" valign="middle">' +
                        '<table cellspacing="0" height="100%">' +
                            '<tr>' +
                                '<td><a id="mapTool_twodmap" href="javascript:void(0);" class="tool twodmap" onclick="MapToolOnClick(\'twodmap\');">二维</a></td>' +
                                '<td><a id="mapTool_threedmap" href="javascript:void(0);" class="tool threedmap" onclick="MapToolOnClick(\'threedmap\');">三维</a></td>' +
                                '<td><a id="mapTool_twothreedmap" href="javascript:void(0);" class="tool twothreedmap" onclick="MapToolOnClick(\'twothreedmap\');">二三维联动</a></td>' +
                                '<td><a id="mapTool_zoomin" href="javascript:void(0);" class="tool zoomin" onclick="MapToolOnClick(\'zoomin\');">放大</a></td>' +
                                '<td><a id="mapTool_zoomout" href="javascript:void(0);" class="tool zoomout" onclick="MapToolOnClick(\'zoomout\');">缩小</a></td>' +
                                '<td><a id="mapTool_pan" href="javascript:void(0);" class="tool pan" onclick="MapToolOnClick(\'pan\');">平移</a></td>' +
                                '<td><a id="mapTool_fullextent" href="javascript:void(0);" class="tool fullextent" onclick="MapToolOnClick(\'fullextent\');">全图显示</a></td>' +
                                '<td><a id="mapTool_measure" href="javascript:void(0);" class="tool measure" onclick="MapToolOnClick(\'measure\');">测距</a></td>' +
                                '<td><a id="mapTool_mianji" href="javascript:void(0);" class="tool mianji" onclick="MapToolOnClick(\'mianji\');">测面积</a></td>' +
                                '<td><a id="mapTool_print" href="javascript:void(0);" class="tool print" onclick="MapToolOnClick(\'print\');">截图</a></td>' +
                                '<td><a id="mapTool_clear" href="javascript:void(0);" class="tool clear" onclick="MapToolOnClick(\'clear\');">清除</a></td>' +
                                '<td><a id="mapTool_allscreen" href="javascript:void(0);" class="tool allscreen" onclick="MapToolOnClick(\'allscreen\');">全屏</a></td>' +
                                '<td><a id="mapTool_exitallscreen" href="javascript:void(0);" class="tool exitallscreen" onclick="MapToolOnClick(\'exitallscreen\');">退出全屏</a></td>' +
                            '</tr>' +
                        '</table>' +
                    '</td>' +
                '</tr>' +
            '</table>' +
        '</div>';

    panel.set_content(html);

}


function fillPanelContent_Weather(panel) {
    //var html = '<iframe src="http://m.weather.com.cn/m/pn12/weather.htm "   marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" allowtransparency="true" scrolling="no"></iframe>';


    var html = "<div id='cj'></div>";

    panel.set_content(html);

    showLoading(document.getElementById("cj"), "正在获取天气数据，请稍候……");

    dojo.xhrGet({
        url: 'WeatherHandler.ashx',
        method:  "GET",
        load: weatherInfoCallBack
    });
    
    //$.getJSON('WeatherHandler.ashx', weatherInfoCallBack);  //IE6下这个貌似有问题


    panel.show();

}

function fillPanelContent_AboutUs(panel) {
    var html = "<div id='divAboutUs' style=' padding-left:30px;padding-top:20px;text-align:left;'>嘉兴市城乡规划建设管理委员会<br><br>E-MAIL:<br><br>TEL:0572-88888888</div>";
    panel.set_content(html);
    panel.show();
}

function weatherInfoCallBack(data) {

    var jsonobj = eval( "(" + data + ")" );

    var cityname = jsonobj.weatherinfo.city;
    var id = jsonobj.weatherinfo.cityid;
    var cityinfo1 = jsonobj.weatherinfo.weather1;
    var cityinfo2 = jsonobj.weatherinfo.weather2;
    var wd1 = jsonobj.weatherinfo.wind1;
    var wd2 = jsonobj.weatherinfo.wind2;
    var temp1 = jsonobj.weatherinfo.temp1;
    var temp2 = jsonobj.weatherinfo.temp2;
    var img1 = jsonobj.weatherinfo.img1;
    var img2 = jsonobj.weatherinfo.img2;
    var img3 = jsonobj.weatherinfo.img3;
    var img4 = jsonobj.weatherinfo.img4;
    var index = jsonobj.weatherinfo.index;
    var index_d = jsonobj.weatherinfo.index_d;
    var index_xc = jsonobj.weatherinfo.index_xc;
    var index_uv = jsonobj.weatherinfo.index_uv;
    var date = jsonobj.weatherinfo.date;
    var date_y = jsonobj.weatherinfo.date_y;
    var imgtitle1 = jsonobj.weatherinfo.img_title1;
    var imgtitle2 = jsonobj.weatherinfo.img_title2;
    var fl1 = jsonobj.weatherinfo.fl1;
    var fl2 = jsonobj.weatherinfo.fl2;
    var imgsingle = jsonobj.weatherinfo.img_single;
    var imgtitlesingle = jsonobj.weatherinfo.img_title_single;


    var html = '<div id="cj">' +
                  '<div id="left" >' +
                    '<h3><em id="city"></em></h3>' +
                    '<p><img id="big1" src="#" alt="天气图标"/>&nbsp;<img id="big2" src="#" alt="天气图标" /></p>' +

                    '<h4><em id="weather1"></em></h4>' +
                  '</div>' +
                  '<div id="right">' +
                    '<h4>温　度：<em id="temp1"></em></h4>' +
                    '<h4>风　力：<em id="wd1"></em></h4>' +
                    '<h4>紫外线：<em id="index_uv"></em></h4>' +
                    '<h4 class="more"><a id="url8" href="#" target="_blank">未来七天预报</a></h4>' +

                  '</div>' +
              '</div>';

    GlobalPanels["weather"].panel.set_content(html);

    document.getElementById("url8").href = "http://www.weather.com.cn/weather/" + id + ".shtml";


    if (document.getElementById("small1") != null) {
        document.getElementById("small1").src = "images/weather/a" + img1 + ".png";
        document.getElementById("small1").title = imgtitle1;
        document.getElementById("small1").alt = imgtitle1;
    }
    if (document.getElementById("small2") != null) {
        if (img2 != '99') {
            document.getElementById("small2").src = "images/weather/a" + img2 + ".png";
            document.getElementById("small2").title = imgtitle2;
            document.getElementById("small2").alt = imgtitle2;
        }
        else {
            document.getElementById("small2").style.height = '0px';
            document.getElementById("small2").title = '';
            document.getElementById("small2").alt = '';
        }
    }
    if (document.getElementById("small") != null) // 单天气现象的图标（小）
    {
        document.getElementById("small").src = "images/weather/a" + imgsingle + ".png";
        document.getElementById("small").title = imgtitlesingle;
        document.getElementById("small").alt = imgtitlesingle;
    }
    if ((document.getElementById("big1") != null) && (document.getElementById("big1") != '99')) {
        document.getElementById("big1").src = "images/weather/b" + img1 + ".gif";
        document.getElementById("big1").title = imgtitle1;
        document.getElementById("big1").alt = imgtitle1;
    }
    if (document.getElementById("big2") != null) {
        if (img2 != '99') {
            document.getElementById("big2").src = "images/weather/b" + img2 + ".gif";
            document.getElementById("big2").title = imgtitle2;
            document.getElementById("big2").alt = imgtitle2;
        }
        else {
            document.getElementById("big2").style.height = '0px';
            document.getElementById("big2").title = '';
            document.getElementById("big2").alt = '';
        }
    }
    if (document.getElementById("big") != null) // 单天气现象的图标（大）
    {
        document.getElementById("big").src = "images/weather/b" + imgsingle + ".gif";
        document.getElementById("big").title = imgtitlesingle;
        document.getElementById("big").alt = imgtitlesingle;
    }
    if (document.getElementById("city") != null) {
        document.getElementById("city").innerHTML = cityname;
    }
    if (document.getElementById("weather1") != null) {
        if (cityinfo1.length > 8) {
            document.getElementById("weather1").innerHTML = cityinfo1.substr(0, 7) + '...';
            document.getElementById("weather1").title = cityinfo1;
        }
        else {
            document.getElementById("weather1").innerHTML = cityinfo1;
        }
    }

    //document.getElementById("weather2").innerHTML =cityinfo2;
    if (document.getElementById("temp1") != null) {
        document.getElementById("temp1").innerHTML = temp1;
    }
    //document.getElementById("temp2").innerHTML =temp2;
    if (document.getElementById("wd1") != null) {
        if (fl1 == '小于3级') {
            fl1 = '微风';
        }
        document.getElementById("wd1").innerHTML = fl1;
    }
    //document.getElementById("wd2").innerHTML =wd2; 
    if (document.getElementById("img1") != null) {
        document.getElementById("img1").innerHTML = img1;
    }
    if (document.getElementById("img2") != null) {
        document.getElementById("img2").innerHTML = img2;
    }
    //document.getElementById("img3").innerHTML =img3;
    //document.getElementById("img4").innerHTML =img4;
    if (document.getElementById("index") != null) {
        document.getElementById("index").innerHTML = index;
    }
    if (document.getElementById("index_d") != null) {
        document.getElementById("index_d").innerHTML = index_d;
    }
    if (document.getElementById("index_xc") != null) {
        document.getElementById("index_xc").innerHTML = index_xc;
    }
    if (document.getElementById("index_uv") != null) {
        document.getElementById("index_uv").innerHTML = index_uv;
    }
    if (document.getElementById("date") != null) {
        document.getElementById("date").innerHTML = date;
    }
    if (document.getElementById("date_y") != null) {
        document.getElementById("date_y").innerHTML = date_y;
    }
}

///显示公交站点信息面板
function showBusStationPanel(  ) {
    
//    var panelObj = GlobalPanels["busstation"];
//    if (!panelObj) {
//        alert("没有配置busstation面板");
//        return;
//    }

//    var panel = panelObj["panel"];
//    if (panel == null) {
//        panel = new FuncPanel("busstation");
//        panelObj["panel"] = panel;

//        panel.set_content('<div id="busSearchResult" class="bussearchresult"></div>');
//    }

//    var pl_bus = GlobalPanels["bussearch"]["panel"];
//    var pos = pl_bus.get_position();
//    var x = pos[0] + pl_bus.width;
//    var y = pos[1];
//    
//    panel.show( x, y );

    GlobalPanels["bussearch"]["panel"].set_size(512);
}


///显示公交查询结果面板
function showBusSearchResultPanel() {
    var panelObj = GlobalPanels["searchresult"];
    var panel = panelObj["panel"];
    if (panel == null) {
        panel = new FuncPanel("searchresult");
    }
    
    panel.set_content("<div id='busSearchResult' class='bussearchresult'>");

    panel.show();
}



///显示查询结果
function showSearchResult(resultHTML) {

    var panelObj = GlobalPanels["searchresult"];
    if (panelObj == undefined || panelObj == null) {
        alert("config.js里没有配置searchresult");
        return;
    }

    var panel = panelObj["panel"];
    if (panel == null) {
        panel = new FuncPanel("searchresult");
    }

    panel.set_content(resultHTML);

    panel.show();
}

///显示结果面板
function showSearchResultPanel() {
    var panelObj = GlobalPanels["searchresult"];
    if (panelObj == undefined || panelObj == null) {
        alert("config.js里没有配置searchresult");
        return;
    }

    var panel = panelObj["panel"];
    if (panel == null) {
        panel = new FuncPanel("searchresult");
    }

    panel.show();
    
}