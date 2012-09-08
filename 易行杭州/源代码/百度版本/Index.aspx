<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="Index.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
    <title>EasyHZ,易行你的生活！</title>
    <link type="text/css" href="css/blitzer/jquery-ui-1.8.21.custom.css" rel="stylesheet" />
    <!--  BaiDu Map API 改用异步加载,JQuery改用加载microsoft CDN -->
	<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.3"></script>
	<script type="text/javascript" src="http://api.map.baidu.com/library/AreaRestriction/1.2/src/AreaRestriction_min.js"></script>
    <script type="text/javascript" src="js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="js/jquery/jquery-ui-1.8.21.custom.min.js"></script>
    <script type="text/javascript" src="js/loadcss.js"></script>
</head>
<body class="tundra">
    <!--Top-->
    <div id="topCon">
        <div id="logocon">
            <div id="logo"></div>  
        </div>        
        <!--主功能面板-->
        <div id="mainAppCon">
            <div id="mainApp_content">
                <div id="appCon" style=" padding-left:40px;">
				    <div id="busSearch_appbutton" class="appbutton">
                        <div class="appicon bussearch"></div>
                        <div class="apptext">公交查询</div>
                    </div>
                    <div id="bicycleSearch_appbutton" class="appbutton">
                        <div class="appicon bicycleSearch"></div>
                        <div class="apptext">公共自行车</div>
                    </div>
                    <div id="drive_appbutton" class="appbutton">
                        <div class="appicon drive"></div>
                        <div class="apptext">自驾导航</div>
                    </div>
                    <div id="food_appbutton" class="appbutton">
                        <div class="appicon food"></div>
                        <div class="apptext">餐饮美食</div>
                    </div>
                    <div id="tour_appbutton" class="appbutton">
                        <div class="appicon tour"></div>
                        <div class="apptext">酒店住宿</div>
                    </div>	
                    <div id="entertainment_appbutton" class="appbutton">
                        <div class="appicon entertainment"></div>
                        <div class="apptext">休闲娱乐</div>
                    </div>
                    <div id="shopping_appbutton" class="appbutton">
                        <div class="appicon shopping"></div>
                        <div class="apptext">购物逛街</div>
                    </div>		
                    <div id="tourspot_appbutton" class="appbutton">
                        <div class="appicon tourspot"></div>
                        <div class="apptext">旅游景点</div>
                    </div>
                    <div id="hospital_appbutton" class="appbutton">
                        <div class="appicon hospital"></div>
                        <div class="apptext">医疗健康</div>
                    </div>
                    <div id="bank_appbutton" class="appbutton" onclick="openAppPanel('weather');">
                        <div class="appicon bank"></div>
                        <div class="apptext">金融银行</div>
                    </div>
                    <div id="life_appbutton" class="appbutton" onclick="openAppPanel('about');">
                        <div class="appicon life"></div>
                        <div class="apptext">生活便利</div>
                    </div>                    
                </div>
            </div>
        </div>
        <!--用户状态信息-->
        <div id="userState">
          <div id="stateContent">
            <ul>
              <li id="suggestion"><a href="#">意见建议</a></li>
              <li class="splitline">|</li>
              <li id="aboutUs"><a href="#">关于我们</a></li>
              <li class="splitline">|</li>
              <li id="savesite"><a href="#">收藏网站</a></li>
            </ul>
          </div>
          <div id="weather">
            <div id="forecastIcon"></div>
            <div id="forecastInfo">杭州   晴   25C～34C</div>
          </div>
        </div>
        <!--分割线-->
        <div class="header_sepline_left"></div>
        <div class="header_sepline_right"></div>
    </div>

    <!--地图范围-->
    <div id="mainCon">
        <div id="mapcontent"></div>
    </div>
    <!--底部-->
    <div id="bottomCon">
        <div id="bottom_toolbar_bg"><a target="_blank" href="http://www.cnblogs.com/laoyu">Koala Studio Copyright </a>@ 2012 All Rights Reserved</div>
    </div>

    <!--公交查询面板-->
    <div id="bus_search_panel" class="func_panel">
      <!--面板标题-->
      <div id="bus_search_panel_title" class="func_panel_title">
        <div id="bus_search_panel_titleleft" class="func_panel_title_left"></div>
        <div id="bus_search_panel_titleright" class="func_panel_title_right"></div>
        <div id="bus_search_panel_titlebg" class="func_panel_title_bg"></div>
      </div>
      <!--面板内容区-->
      <div id="bus_search_panel_content" class="func_panel_content">
        <div id="bus_search_panel_contentleft" class="func_panel_content_left"></div>
        <div id="bus_search_panel_contentright" class="func_panel_content_right"></div>
        <div id="bus_search_panel_contentbg" class="func_panel_content_bg">
          <div id="bus_search_panel_contenttext" class="func_panel_content_text">
            <div id="busSearchli_con" class="menucontainer">
              <ul class="tit">
                <li id="busSearch" class="on">
                  <span class="gj">公交换乘</span>
                </li>
                <li id="busline" class="out">
                  <span class="xl">线路查询</span>
                </li>
              </ul>
                <!--里面的内容根据用户选择进行切换-->
              <div class="bus">
                <ul id="a1" class="ul" style="display:block;">
                  <!--公交查询-->
                  <div id="c1" style="display:block;">
                    <li class="li1">
                      从：<input id="startCat" class="input01" type="text" onkeydown="" value="" />
                    </li>
                    <li class="li1">
                      到：<input id="endCat" class="input01" type="text" onkeydown="" value="" />
                    </li>
                    <li class="button04" onclick="" onmouseout="javascript:this.className='button04'" onmouseover="javascript:this.className='button04click'">
                    </li>
                    <li class="button05li">
                      <input class="button05" type="button" onclick="" value="搜 索" />
                    </li>
                  </div>
                </ul>
                <ul>
                  <!--线路查询-->
                  <div id="c2" style="display:none">
                    <li class="li1">
                      <input id="lineKey" class="input02" type="text" onkeydown="" />
                      <input class="button_x1" type="button" onclick="" value="搜 索" />
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--面板底部-->
      <div id="bus_search_panel_foot" class="func_panel_foot">
        <div id="bus_search_panel_footleft" class="func_panel_foot_left"></div>
        <div id="bus_search_panel_footright" class="func_panel_foot_right"></div>
        <div id="bus_search_panel_footbg" class="func_panel_foot_bg"></div>
      </div>
      <div id="bus_search_panel_icon" class="func_panel_icon"></div>
      <div id="bus_search_panel_sepline" class="func_panel_sepline"></div>
      <div id="bus_search_panel_titletext" class="func_panel_title_text">公交查询</div>
      <div id="bus_search_panel_control" class="func_panel_control">
        <a id="bus_search_panel_controlclose" class="func_panel_control_icon func_panel_close" title="关闭"></a>
      </div>
    </div>

    <!--公共自行车查询面板-->
    <div id="bike_search_panel" class="func_panel">
      <!--面板标题-->
      <div id="bike_search_panel_title" class="func_panel_title">
        <div id="bike_search_panel_titleleft" class="func_panel_title_left"></div>
        <div id="bike_search_panel_titleright" class="func_panel_title_right"></div>
        <div id="bike_search_panel_titlebg" class="func_panel_title_bg"></div>
      </div>
      <!--面板内容区-->
      <div id="bike_search_panel_content" class="func_panel_content">
        <div id="bike_search_panel_contentleft" class="func_panel_content_left"></div>
        <div id="bike_search_panel_contentright" class="func_panel_content_right"></div>
        <div id="bike_search_panel_contentbg" class="func_panel_content_bg">
          <div id="bike_search_panel_contenttext" class="func_panel_content_text">
            <div id="bikeSearchli_con" class="menucontainer">
              <div id="bikeSearch_con" class="bus">
                <table>
                   <tbody>
                      <tr>
                        <td>距离</td>
                        <td>
                          <input id="bikeposition" type="text" value="输入地点" />
                        </td>
                        <td align="center" valign="middle">
                          <input id="bikespot" type="button" />
                        </td>
                      </tr>
                     </tbody>
                </table>
                <table>
                    <tbody>
                      <tr>
                        <td>附近</td>
                        <td>
                          <select name="areaDist">
                            <option value="100m" selected="selected">100米</option>
                            <option value="300m">300米</option>
                            <option value="500m">500米</option>
                          </select>
                        </td>
                        <td align="center" valign="middle">范围内的公共自行车</td>
                      </tr>
                      <tr>
                        <td align="right" valign="middle" colspan="3">
                          <input id="bikeSearch_con_btn" type="button" value="查询" />
                        </td>
                      </tr>
                    </tbody>
                 </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--面板底部-->
      <div id="bike_search_panel_foot" class="func_panel_foot">
        <div id="bike_search_panel_footleft" class="func_panel_foot_left"></div>
        <div id="bike_search_panel_footright" class="func_panel_foot_right"></div>
        <div id="bike_search_panel_footbg" class="func_panel_foot_bg"></div>
      </div>
      <div id="bike_search_panel_icon" class="func_panel_icon"></div>
      <div id="bike_search_panel_sepline" class="func_panel_sepline"></div>
      <div id="bike_search_panel_titletext" class="func_panel_title_text">公共自行车</div>
      <div id="bike_search_panel_control" class="func_panel_control">
        <a id="bike_search_panel_controlclose" class="func_panel_control_icon func_panel_close" title="关闭"></a>
      </div>
    </div>

    <!--自驾导航查询面板-->
    <div id="car_search_panel" class="func_panel">
      <!--面板标题-->
      <div id="car_search_panel_title" class="func_panel_title">
        <div id="car_search_panel_titleleft" class="func_panel_title_left"></div>
        <div id="car_search_panel_titleright" class="func_panel_title_right"></div>
        <div id="car_search_panel_titlebg" class="func_panel_title_bg"></div>
      </div>
      <!--面板内容区-->
      <div id="car_search_panel_content" class="func_panel_content">
        <div id="car_search_panel_contentleft" class="func_panel_content_left"></div>
        <div id="car_search_panel_contentright" class="func_panel_content_right"></div>
        <div id="car_search_panel_contentbg" class="func_panel_content_bg">
          <div id="car_search_panel_contenttext" class="func_panel_content_text">
            <div id="carSearchli_con" class="menucontainer">
               <div id="carSearch_con" class="bus">
                  <table>
                    <tbody>
                      <tr>
                        <td>起点：</td>
                        <td>
                          <input id="carStart" type="text" value="请输入出发地" />
                        </td>
                      </tr>
                      <tr>
                        <td>终点：</td>
                        <td>
                          <input id="carEnd" type="text" value="请输入目的地"/>
                        </td>
                      </tr>
                      <tr>
                        <td align="right" valign="middle" colspan="2">
                          <input id="carSearch_con_btn" type="button" value="查询" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        </div>
      </div>
      <!--面板底部-->
      <div id="car_search_panel_foot" class="func_panel_foot">
        <div id="car_search_panel_footleft" class="func_panel_foot_left"></div>
        <div id="car_search_panel_footright" class="func_panel_foot_right"></div>
        <div id="car_search_panel_footbg" class="func_panel_foot_bg"></div>
      </div>
      <div id="car_search_panel_icon" class="func_panel_icon"></div>
      <div id="car_search_panel_sepline" class="func_panel_sepline"></div>
      <div id="car_search_panel_titletext" class="func_panel_title_text">自驾导航</div>
      <div id="car_search_panel_control" class="func_panel_control">
        <a id="car_search_panel_controlclose" class="func_panel_control_icon func_panel_close" title="关闭"></a>
      </div>
    </div>

    <!--酒店住宿查询面板-->
    <div id="tour_search_panel" class="func_panel">
      <!--面板标题-->
      <div id="tour_search_panel_title" class="func_panel_title">
        <div id="tour_search_panel_titleleft" class="func_panel_title_left"></div>
        <div id="tour_search_panel_titleright" class="func_panel_title_right"></div>
        <div id="tour_search_panel_titlebg" class="func_panel_title_bg"></div>
      </div>
      <!--面板内容区-->
      <div id="tour_search_panel_content" class="func_panel_content">
        <div id="tour_search_panel_contentleft" class="func_panel_content_left"></div>
        <div id="tour_search_panel_contentright" class="func_panel_content_right"></div>
        <div id="tour_search_panel_contentbg" class="func_panel_content_bg">
          <div id="tour_search_panel_contenttext" class="func_panel_content_text">
          <div id="hotelsearchli_con" class="menucontainer">
              <div id="hotelsearch_con" class="bus">
                <table>
                   <tbody>
                      <tr>
                        <td>在</td>
                        <td>
                          <select name="hotelContent">
                            <option value="全部" selected="selected">全部</option>
                            <option value="快捷酒店">快捷酒店</option>
                            <option value="星级酒店">星级酒店</option>
                            <option value="旅馆">旅馆</option>
                            <option value="度假村">度假村</option>
                            <option value="五星级">五星级</option>
                            <option value="四星级">四星级</option>
                            <option value="三星级">三星级</option>
                            <option value="招待所">招待所</option>
                            <option value="青年旅舍">青年旅舍</option>
                            <option value="如家">如家</option>
                            <option value="锦江之星">锦江之星</option>
                            <option value="汉庭">汉庭</option>
                            <option value="7天">7天</option>
                            <option value="莫泰168">莫泰168</option>
                            <option value="速8">速8</option>
                            <option value="格林豪泰">格林豪泰</option>
                          </select>
                          中寻找
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colspan="2">
                            <input id="hotelCon" type="text" value="" />
                        </td>
                        <td align="center" valign="middle">
                            <input id="hotelSearch" type="button" value="搜索" />
                        </td>
                      </tr>
                    </tbody>
                 </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--面板底部-->
      <div id="tour_search_panel_foot" class="func_panel_foot">
        <div id="tour_search_panel_footleft" class="func_panel_foot_left"></div>
        <div id="tour_search_panel_footright" class="func_panel_foot_right"></div>
        <div id="tour_search_panel_footbg" class="func_panel_foot_bg"></div>
      </div>
      <div id="tour_search_panel_icon" class="func_panel_icon"></div>
      <div id="tour_search_panel_sepline" class="func_panel_sepline"></div>
      <div id="tour_search_panel_titletext" class="func_panel_title_text">酒店住宿</div>
      <div id="tour_search_panel_control" class="func_panel_control">
        <a id="tour_search_panel_controlclose" class="func_panel_control_icon func_panel_close" title="关闭"></a>
      </div>
    </div>

    <!--购物逛街查询面板-->
    <div id="shopping_search_panel" class="func_panel">
      <!--面板标题-->
      <div id="shopping_search_panel_title" class="func_panel_title">
        <div id="shopping_search_panel_titleleft" class="func_panel_title_left"></div>
        <div id="shopping_search_panel_titleright" class="func_panel_title_right"></div>
        <div id="shopping_search_panel_titlebg" class="func_panel_title_bg"></div>
      </div>
      <!--面板内容区-->
      <div id="shopping_search_panel_content" class="func_panel_content">
        <div id="shopping_search_panel_contentleft" class="func_panel_content_left"></div>
        <div id="shopping_search_panel_contentright" class="func_panel_content_right"></div>
        <div id="shopping_search_panel_contentbg" class="func_panel_content_bg">
          <div id="shopping_search_panel_contenttext" class="func_panel_content_text">
            <div id="shoppingSearchli_con" class="menucontainer">
              <div id="shoppingSearch_con" class="bus">
                <table>
                   <tbody>
                      <tr>
                        <td>在</td>
                        <td>
                          <select name="shoppingContent">
                            <option value="全部" selected="selected">全部</option>
                            <option value="商场">商场</option>
                            <option value="超市">超市</option>
                            <option value="潮流服饰">潮流服饰</option>
                            <option value="家居用品">家居用品</option>
                            <option value="亲子购物">亲子购物</option>
                            <option value="户外活动">户外活动</option>
                            <option value="数码家电">数码家电</option>
                            <option value="苏宁">苏宁</option>
                            <option value="国美">国美</option>
                            <option value="五星">五星</option>
                          </select>
                          中寻找
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colspan="2">
                            <input id="shoppingContent" type="text" value="" />
                        </td>
                        <td align="center" valign="middle">
                            <input id="shoppingSearch" type="button" value="搜索" />
                        </td>
                      </tr>
                    </tbody>
                 </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--面板底部-->
      <div id="shopping_search_panel_foot" class="func_panel_foot">
        <div id="shopping_search_panel_footleft" class="func_panel_foot_left"></div>
        <div id="shopping_search_panel_footright" class="func_panel_foot_right"></div>
        <div id="shopping_search_panel_footbg" class="func_panel_foot_bg"></div>
      </div>
      <div id="shopping_search_panel_icon" class="func_panel_icon"></div>
      <div id="shopping_search_panel_sepline" class="func_panel_sepline"></div>
      <div id="shopping_search_panel_titletext" class="func_panel_title_text">购物逛街</div>
      <div id="shopping_search_panel_control" class="func_panel_control">
        <a id="shopping_search_panel_controlclose" class="func_panel_control_icon func_panel_close" title="关闭"></a>
      </div>
    </div>

    <!--休闲娱乐查询面板-->
    <div id="entertainment_search_panel" class="func_panel">
      <!--面板标题-->
      <div id="entertainment_search_panel_title" class="func_panel_title">
        <div id="entertainment_search_panel_titleleft" class="func_panel_title_left"></div>
        <div id="entertainment_search_panel_titleright" class="func_panel_title_right"></div>
        <div id="entertainment_search_panel_titlebg" class="func_panel_title_bg"></div>
      </div>
      <!--面板内容区-->
      <div id="entertainment_search_panel_content" class="func_panel_content">
        <div id="entertainment_search_panel_contentleft" class="func_panel_content_left"></div>
        <div id="entertainment_search_panel_contentright" class="func_panel_content_right"></div>
        <div id="entertainment_search_panel_contentbg" class="func_panel_content_bg">
          <div id="entertainment_search_panel_contenttext" class="func_panel_content_text">
            <div id="entertainmentSearchli_con" class="menucontainer">
              <div id="entertainmentSearch_con" class="bus">
                <table>
                   <tbody>
                      <tr>
                        <td>在</td>
                        <td>
                          <select name="entertainmentContent">
                            <option value="全部" selected="selected">全部</option>
                            <option value="电影院">电影院</option>
                            <option value="KTV">KTV</option>
                            <option value="夜总会">夜总会</option>
                            <option value="体育场馆">体育场馆</option>
                            <option value="健身">健身</option>
                            <option value="游泳馆">游泳馆</option>
                            <option value="羽毛球馆">羽毛球馆</option>
                            <option value="棋牌室">棋牌室</option>
                            <option value="网吧">网吧</option>
                            <option value="洗浴">洗浴</option>
                            <option value="按摩">按摩</option>
                            <option value="足疗">足疗</option>
                            <option value="咖啡厅">咖啡厅</option>
                            <option value="酒吧">酒吧</option>
                            <option value="茶馆">茶馆</option>
                            <option value="桌游">桌游</option>
                          </select>
                          中寻找
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colspan="2">
                            <input id="entertainmentContent" type="text" value="" />
                        </td>
                        <td align="center" valign="middle">
                            <input id="entertainmentSearch" type="button" value="搜索" />
                        </td>
                      </tr>
                    </tbody>
                 </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--面板底部-->
      <div id="entertainment_search_panel_foot" class="func_panel_foot">
        <div id="entertainment_search_panel_footleft" class="func_panel_foot_left"></div>
        <div id="entertainment_search_panel_footright" class="func_panel_foot_right"></div>
        <div id="entertainment_search_panel_footbg" class="func_panel_foot_bg"></div>
      </div>
      <div id="entertainment_search_panel_icon" class="func_panel_icon"></div>
      <div id="entertainment_search_panel_sepline" class="func_panel_sepline"></div>
      <div id="entertainment_search_panel_text" class="func_panel_title_text">休闲娱乐</div>
      <div id="entertainment_search_panel_control" class="func_panel_control">
        <a id="entertainment_search_panel_controlclose" class="func_panel_control_icon func_panel_close" title="关闭"></a>
      </div>
    </div>

    <!--餐饮美食查询面板-->
    <div id="food_search_panel" class="func_panel">
      <!--面板标题-->
      <div id="food_search_panel_title" class="func_panel_title">
        <div id="food_search_panel_titleleft" class="func_panel_title_left"></div>
        <div id="food_search_panel_titleright" class="func_panel_title_right"></div>
        <div id="food_search_panel_titlebg" class="func_panel_title_bg"></div>
      </div>
      <!--面板内容区-->
      <div id="food_search_panel_content" class="func_panel_content">
        <div id="food_search_panel_contentleft" class="func_panel_content_left"></div>
        <div id="food_search_panel_contentright" class="func_panel_content_right"></div>
        <div id="food_search_panel_contentbg" class="func_panel_content_bg">
          <div id="food_search_panel_contenttext" class="func_panel_content_text">
            <div id="foodSearchli_con" class="menucontainer">
              <div id="foodSearch_con" class="bus">
                <table>
                   <tbody>
                      <tr>
                        <td>在</td>
                        <td>
                          <select name="footContent">
                            <option value="全部" selected="selected">全部</option>
                            <option value="中餐馆">中餐馆</option>
                            <option value="西餐厅">西餐厅</option>
                            <option value="日本菜">日本菜</option>
                            <option value="韩国料理">韩国料理</option>
                            <option value="东南亚菜">东南亚菜</option>
                            <option value="快餐">快餐</option>
                            <option value="甜点冷饮">甜点冷饮</option>
                            <option value="火锅">火锅</option>
                          </select>
                          中寻找
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colspan="2">
                            <input id="foodCon" type="text" value="" />
                        </td>
                        <td align="center" valign="middle">
                            <input id="foodSearch" type="button" value="搜索" />
                        </td>
                      </tr>
                    </tbody>
                 </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--面板底部-->
      <div id="food_search_panel_foot" class="func_panel_foot">
        <div id="food_search_panel_footleft" class="func_panel_foot_left"></div>
        <div id="food_search_panel_footright" class="func_panel_foot_right"></div>
        <div id="food_search_panel_footbg" class="func_panel_foot_bg"></div>
      </div>
      <div id="food_search_panel_icon" class="func_panel_icon"></div>
      <div id="food_search_panel_sepline" class="func_panel_sepline"></div>
      <div id="food_search_panel_text" class="func_panel_title_text">餐饮美食</div>
      <div id="food_search_panel_control" class="func_panel_control">
        <a id="food_search_panel_controlclose" class="func_panel_control_icon func_panel_close" title="关闭"></a>
      </div>
    </div>

    <!--金融银行查询面板-->
    <div id="bank_search_panel" class="func_panel">
      <!--面板标题-->
      <div id="bank_search_panel_title" class="func_panel_title">
        <div id="bank_search_panel_titleleft" class="func_panel_title_left"></div>
        <div id="bank_search_panel_titleright" class="func_panel_title_right"></div>
        <div id="bank_search_panel_titlebg" class="func_panel_title_bg"></div>
      </div>
      <!--面板内容区-->
      <div id="bank_search_panel_content" class="func_panel_content">
        <div id="bank_search_panel_contentleft" class="func_panel_content_left"></div>
        <div id="bank_search_panel_contentright" class="func_panel_content_right"></div>
        <div id="bank_search_panel_contentbg" class="func_panel_content_bg">
          <div id="bank_search_panel_contenttext" class="func_panel_content_text">
            <div id="bankSearchli_con" class="menucontainer">
              <div id="bankSearch_con" class="bus">
                <table>
                   <tbody>
                      <tr>
                        <td>在</td>
                        <td>
                          <select name="footContent">
                            <option value="全部" selected="selected">全部</option>
                            <option value="中国银行">中国银行</option>
                            <option value="工商银行">工商银行</option>
                            <option value="建设银行">建设银行</option>
                            <option value="招商银行">招商银行</option>
                            <option value="农业银行">农业银行</option>
                            <option value="浙商银行">浙商银行</option>
                            <option value="浦发银行">浦发银行</option>
                            <option value="宁波银行">宁波银行</option>
                            <option value="交通银行">交通银行</option>
                            <option value="杭州银行">杭州银行</option>
                            <option value="光大银行">光大银行</option>
                            <option value="中信银行">中信银行</option>
                            <option value="广发银行">广发银行</option>
                            <option value="民生银行">民生银行</option>
                            <option value="华夏银行">华夏银行</option>
                            <option value="中国人寿">中国人寿</option>
                            <option value="平安保险">平安保险</option>
                            <option value="太平洋保险">太平洋保险</option>
                            <option value="中国人民保险">中国人民保险</option>
                            <option value="新华保险">新华保险</option>
                            <option value="泰康人寿">泰康人寿</option>
                          </select>
                          中寻找
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colspan="2">
                            <input id="bankCon" type="text" value="" />
                        </td>
                        <td align="center" valign="middle">
                            <input id="bankSearch" type="button" value="搜索" />
                        </td>
                      </tr>
                    </tbody>
                 </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--面板底部-->
      <div id="bank_search_panel_foot" class="func_panel_foot">
        <div id="bank_search_panel_footleft" class="func_panel_foot_left"></div>
        <div id="bank_search_panel_footright" class="func_panel_foot_right"></div>
        <div id="bank_search_panel_footbg" class="func_panel_foot_bg"></div>
      </div>
      <div id="bank_search_panel_icon" class="func_panel_icon"></div>
      <div id="bank_search_panel_sepline" class="func_panel_sepline"></div>
      <div id="bank_search_panel_text" class="func_panel_title_text">金融银行</div>
      <div id="bank_search_panel_control" class="func_panel_control">
        <a id="bank_search_panel_controlclose" class="func_panel_control_icon func_panel_close" title="关闭"></a>
      </div>
    </div>

    <!--生活便利查询面板-->
    <div id="life_search_panel" class="func_panel">
      <!--面板标题-->
      <div id="life_search_panel_title" class="func_panel_title">
        <div id="life_search_panel_titleleft" class="func_panel_title_left"></div>
        <div id="life_search_panel_titleright" class="func_panel_title_right"></div>
        <div id="life_search_panel_titlebg" class="func_panel_title_bg"></div>
      </div>
      <!--面板内容区-->
      <div id="life_search_panel_content" class="func_panel_content">
        <div id="life_search_panel_contentleft" class="func_panel_content_left"></div>
        <div id="life_search_panel_contentright" class="func_panel_content_right"></div>
        <div id="life_search_panel_contentbg" class="func_panel_content_bg">
          <div id="life_search_panel_contenttext" class="func_panel_content_text">
            <div id="lifeSearchli_con" class="menucontainer">
              <div id="lifeSearch_con" class="bus">
                <table>
                   <tbody>
                      <tr>
                        <td>在</td>
                        <td>
                          <select name="lifeContent">
                            <option value="全部" selected="selected">全部</option>
                            <option value="停车场">停车场</option>
                            <option value="加油站">加油站</option>
                            <option value="火车站代售点">火车站代售点</option>
                            <option value="长途车站">长途车站</option>
                            <option value="机场">机场</option>
                            <option value="码头">码头</option>
                            <option value="超市">超市</option>
                            <option value="学校">学校</option>
                            <option value="邮局">邮局</option>
                            <option value="燃气">燃气</option>
                            <option value="自来水">自来水</option>
                            <option value="中国电信">中国电信</option>
                            <option value="中国联通">中国联通</option>
                            <option value="中国移动">中国移动</option>
                          </select>
                          中寻找
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colspan="2">
                            <input id="lifeCon" type="text" value="" />
                        </td>
                        <td align="center" valign="middle">
                            <input id="lifeSearch" type="button" value="搜索" />
                        </td>
                      </tr>
                    </tbody>
                 </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--面板底部-->
      <div id="life_search_panel_foot" class="func_panel_foot">
        <div id="life_search_panel_footleft" class="func_panel_foot_left"></div>
        <div id="life_search_panel_footright" class="func_panel_foot_right"></div>
        <div id="life_search_panel_footbg" class="func_panel_foot_bg"></div>
      </div>
      <div id="life_search_panel_icon" class="func_panel_icon"></div>
      <div id="life_search_panel_sepline" class="func_panel_sepline"></div>
      <div id="life_search_panel_text" class="func_panel_title_text">生活便利</div>
      <div id="life_search_panel_control" class="func_panel_control">
        <a id="life_search_panel_controlclose" class="func_panel_control_icon func_panel_close" title="关闭"></a>
      </div>
    </div>

    <!--旅游景点查询面板-->
    <div id="tourspot_search_panel" class="func_panel">
      <!--面板标题-->
      <div id="tourspot_search_panel_title" class="func_panel_title">
        <div id="tourspot_search_panel_titleleft" class="func_panel_title_left"></div>
        <div id="tourspot_search_panel_titleright" class="func_panel_title_right"></div>
        <div id="tourspot_search_panel_titlebg" class="func_panel_title_bg"></div>
      </div>
      <!--面板内容区-->
      <div id="tourspot_search_panel_content" class="func_panel_content">
        <div id="tourspot_search_panel_contentleft" class="func_panel_content_left"></div>
        <div id="tourspot_search_panel_contentright" class="func_panel_content_right"></div>
        <div id="tourspot_search_panel_contentbg" class="func_panel_content_bg">
          <div id="tourspot_search_panel_contenttext" class="func_panel_content_text">
            <div id="tourspotSearchli_con" class="menucontainer">
              <div id="tourspotSearch_con" class="bus">
                <table>
                   <tbody>
                      <tr>
                        <td>在</td>
                        <td>
                          <select name="tourspotContent">
                            <option value="全部" selected="selected">全部</option>
                            <option value="公园">公园</option>
                            <option value="旅游景点">旅游景点</option>
                            <option value="文化场馆">文化场馆</option>
                          </select>
                          中寻找
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colspan="2">
                            <input id="tourspotcon" type="text" value="" />
                        </td>
                        <td align="center" valign="middle">
                            <input id="tourspotSearch" type="button" value="搜索" />
                        </td>
                      </tr>
                    </tbody>
                 </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--面板底部-->
      <div id="tourspot_search_panel_foot" class="func_panel_foot">
        <div id="tourspot_search_panel_footleft" class="func_panel_foot_left"></div>
        <div id="tourspot_search_panel_footright" class="func_panel_foot_right"></div>
        <div id="tourspot_search_panel_footbg" class="func_panel_foot_bg"></div>
      </div>
      <div id="tourspot_search_panel_icon" class="func_panel_icon"></div>
      <div id="tourspot_search_panel_sepline" class="func_panel_sepline"></div>
      <div id="tourspot_search_panel_text" class="func_panel_title_text">旅游景点</div>
      <div id="tourspot_search_panel_control" class="func_panel_control">
        <a id="tourspot_search_panel_controlclose" class="func_panel_control_icon func_panel_close" title="关闭"></a>
      </div>
    </div>

    <!--医疗健康查询面板-->
    <div id="hospital_search_panel" class="func_panel">
      <!--面板标题-->
      <div id="hospital_search_panel_title" class="func_panel_title">
        <div id="hospital_search_panel_titleleft" class="func_panel_title_left"></div>
        <div id="hospital_search_panel_titleright" class="func_panel_title_right"></div>
        <div id="hospital_search_panel_titlebg" class="func_panel_title_bg"></div>
      </div>
      <!--面板内容区-->
      <div id="hospital_search_panel_content" class="func_panel_content">
        <div id="hospital_search_panel_contentleft" class="func_panel_content_left"></div>
        <div id="hospital_search_panel_contentright" class="func_panel_content_right"></div>
        <div id="hospital_search_panel_contentbg" class="func_panel_content_bg">
          <div id="hospital_search_panel_contenttext" class="func_panel_content_text">
            <div id="hospitalSearchli_con" class="menucontainer">
              <div id="hospitalSearch_con" class="bus">
                <table>
                   <tbody>
                      <tr>
                        <td>在</td>
                        <td>
                          <select name="hospitalContent">
                            <option value="全部" selected="selected">全部</option>
                            <option value="中医院">中医院</option>
                            <option value="口腔医院">口腔医院</option>
                            <option value="儿童医院">儿童医院</option>
                            <option value="肿瘤医院">肿瘤医院</option>
                            <option value="妇科医院">妇科医院</option>
                            <option value="眼科医院">眼科医院</option>
                            <option value="骨科医院">骨科医院</option>
                            <option value="妇幼保健院">妇幼保健院</option>
                          </select>
                          中寻找
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colspan="2">
                            <input id="hospitalCon" type="text" value="" />
                        </td>
                        <td align="center" valign="middle">
                            <input id="hospitalSearch" type="button" value="搜索" />
                        </td>
                      </tr>
                    </tbody>
                 </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--面板底部-->
      <div id="hospital_search_panel_foot" class="func_panel_foot">
        <div id="hospital_search_panel_footleft" class="func_panel_foot_left"></div>
        <div id="hospital_search_panel_footright" class="func_panel_foot_right"></div>
        <div id="hospital_search_panel_footbg" class="func_panel_foot_bg"></div>
      </div>
      <div id="hospital_search_panel_icon" class="func_panel_icon"></div>
      <div id="hospital_search_panel_sepline" class="func_panel_sepline"></div>
      <div id="hospital_search_panel_text" class="func_panel_title_text">医疗健康</div>
      <div id="hospital_search_panel_control" class="func_panel_control">
        <a id="hospital_search_panel_controlclose" class="func_panel_control_icon func_panel_close" title="关闭"></a>
      </div>
    </div>

</body>
<script type="text/javascript" src="js/loadjs.js"></script>
</html>
