<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="Index.aspx.cs" Inherits="_Default" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
    <script type="text/javascript" src="js/common/Utility.js"></script>
    <script type="text/javascript" src="js/common/Loadcss.js"></script>
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
                <div id="appCon" style="padding-left:40px;">
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

</body>
<script type="text/javascript" src="js/common/Loadjs.js"></script>
</html>
