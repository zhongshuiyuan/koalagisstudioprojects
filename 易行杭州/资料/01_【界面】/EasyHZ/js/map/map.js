//创建地图对象
var map;

function InitMap() {
	map = new BMap.Map("mapcontent");
	//定位杭州
	map.centerAndZoom(new BMap.Point(120.161883,30.27877),12);
	//支持滚轮
	map.enableScrollWheelZoom();
	//定义显示区域
	var viewbound = new BMap.Bounds(new BMap.Point(119.936517,30.14513),new BMap.Point(120.499359,30.389175));
	try
	{
		BMapLib.AreaRestriction.setBounds(map,viewbound);
	}
	catch (e)
	{
		alert(e);
	}
}