//
//author:zhj
//date:2012-05-29 12:30
//在线地图app

//Ext.Loader.setConfig({
//    enabled: true
//});


Ext.application({
    name: 'KoalaGIS',
    appFolder: 'KoalaGIS',
    views: ['KoalaGIS.Ext.View.MapView'],
    launch: function () {
        Ext.create('KoalaGIS.Ext.View.MapView');

        //Ext.require('KoalaGIS.OpenLayers');
        //Ext.require('KoalaGIS.OpenLayers.Baidu');

        //Ext.create('KoalaGIS.map.OpenLayers');

        //初始化地图
        var map = KoalaGIS.OpenLayers.InitMap('divMap', {
            theme: null,
            projection: "EPSG:900913",
            units: "m",
            maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
            maxResolution: 156543.0339
        });

        //设置全局变量
        window.map = map;

        KoalaGIS.OpenLayers.AddBaiduLayer();

        KoalaGIS.OpenLayers.AddPanZoomBar();

        var divXY = document.getElementById('divXY');
        map.addControl(new OpenLayers.Control.MousePosition({div:divXY,prefix:'当前坐标：'}));

        var proj = new OpenLayers.Projection('EPSG:4326');
        var proj2 = new OpenLayers.Projection('EPSG:900913');
        //var lonlat = new OpenLayers.LonLat(116.404, 39.915);

        //定位到杭州市保俶北路83号
        var lonlat = new OpenLayers.LonLat(120.14127, 30.12216);
        lonlat.transform(proj, proj2);

        map.setCenter(lonlat, 18);


    }

});