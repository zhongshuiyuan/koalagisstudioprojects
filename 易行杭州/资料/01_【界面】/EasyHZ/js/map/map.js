/**
 * Namespace: KoalaGIS.EASYHZ.Map
 * KoalaGIS.EASYHZ.Map对象封装地图相关操作，内部采用Baidu地图API。
 * 
 */
KoalaGIS.EASYHZ.Map = KoalaGIS.EASYHZ.Class({
    /**
    * APIProperty: map //地图对象
    * {BMap.Map}
    */
    map: null,

    /**
    * APIProperty: city //所在城市
    * {String}
    */
    city: "杭州",

    /**
    * APIProperty: cityCenter //城市定位点
    * {BMap.Point}
    */
    cityCenter: null,

    /**
    * APIProperty: viewBound //城市范围 
    * {BMap.Bound}
    */
    viewBound: null,

    /**
    * APIProperty: currentLevel //当前地图级别
    * {int}
    */
    currentLevel: 12,

    /**
    * Constructor: KoalaGIS.EASYHZ.Map
    *
    * Parameters:
    * id - {String} The map div's id
    * citycenter-{point}
    */
    initialize: function (id, citycenter, level) {
        this.initializeMap(id, citycenter, level);
        this.registerEvents();
        this.addControl();
    },

    /**
    * Method: initializeMap
    * 初始化地图，自动定位到指定城市，缩放到指定级别
    *
    * Parameters:
    * id - {string} 地图容器的id。
    * city - {BMap.Point} 指定城市的坐标点，地图自动定位到该点。
    * level - ｛number｝ 地图初始的缩放级别
    */
    initializeMap: function (id, city, level) {
        //构建map对象
        if (id != undefined) {
            this.id = id;
            this.map = new BMap.Map(id);
        }
        //初始化地图定位
        if (city != undefined) {
            try {
                this.cityCenter = city;
                if (level != undefined) {
                    this.map.centerAndZoom(this.cityCenter, this.currentLevel);
                } else {
                    this.map.centerAndZoom(this.cityCenter, 12);
                }
            } catch (e) {
                throw e;
            }
        } else {
            this.map.centerAndZoom(new BMap.Point(120.161883, 30.27877), 12);
        }
        //定义显示区域
        var viewbound = new BMap.Bounds(new BMap.Point(119.936517, 30.14513), new BMap.Point(120.499359, 30.389175));
        try {
            BMapLib.AreaRestriction.setBounds(this.map, viewbound);
        }
        catch (e) {
            alert(e);
        }
    },

    /**
    * Method: registerEvents
    * 初始化地图事件
    */
    registerEvents: function () {
        this.map.enableDragging();
        this.map.enableScrollWheelZoom();
        this.map.enableDoubleClickZoom();
        this.map.enableKeyboard();
    },

    /**
    * Method: addControl
    * 添加地图控件
    */
    addControl: function () {
        //向地图中添加缩放控件
//        var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE });
//        this.map.addControl(ctrl_nav);
        //向地图中添加比例尺控件
        var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
        this.map.addControl(ctrl_sca);
    }
});



