/**
 * Namespace: KoalaGIS.EASYHZ.Map
 * KoalaGIS.EASYHZ.Map对象封装地图相关操作，内部采用Baidu地图API。
 * 
 */
KoalaGIS.EASYHZ.Map = KoalaGIS.EASYHZ.Class({
    /**
    * @description 地图对象
    * @field
    * @type {BMap.Map}
    */
    map: null,

    /**
    * @description 所在城市
    * @field
    * @type {String}
    */
    city: "杭州",

    /**
    * @description 城市定位点
    * @field
    * @type {BMap.Point}
    */
    cityCenter: null,

    /**
    * @description 城市范围
    * @field
    * @type {BMap.Bound}
    */
    viewBound: null,

    /**
    * @description 当前地图级别
    * @field
    * @type {int}
    */
    currentLevel: 12,

    /**
     * @constructor: 初始化BMap.AutoComplete对象
     * @param id - {String} The map div's id
     * @param citycenter-{point}
     */
    initialize: function (id, citycenter, level) {
        this.initializeMap(id, citycenter, level);
        this.registerEvents();
        this.addControl();
    },

   /**
    * @description 初始化地图，自动定位到指定城市，缩放到指定级别
    * @param: {string} 地图容器的id。
    * @param: {BMap.Point} 指定城市的坐标点，地图自动定位到该点。
    * @param:｛number｝ 地图初始的缩放级别
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
    * @description 初始化地图事件
    * @return {NULL}
    */
    registerEvents: function () {
        this.map.enableDragging();
        this.map.enableScrollWheelZoom();
        this.map.enableDoubleClickZoom();
        this.map.enableKeyboard();
    },

   /**
    * @description 添加控件
    * @return {NULL}
    */
    addControl: function () {
        //向地图中添加缩放控件
        //var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE });
        //this.map.addControl(ctrl_nav);
        //向地图中添加比例尺控件
        var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
        this.map.addControl(ctrl_sca);
    },

    /**
     * @dscription 在地图上添加Poi点
     */
    addMark:function(){},

    /**
     * @description 在地图上添加线段
     */
    addLine:function(){},

    /**
     * @description 将当前位置作为地图中心位置
     */
    panToCenter:function(){}







});



