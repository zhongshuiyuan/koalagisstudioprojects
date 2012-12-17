/**
 * @description 公交车站对象
 * @param point {BMap.point} 经纬度
 * @param name {string} 车站名
 */
var BusStop = function(point,name){
    this.stopPosition = point,
    this.stopName = name
}

/**
 * @fileOverview: 公交查询模块，封装了公交换乘、公交线路两部分。
 *     公交换乘对象，支持最短时间、最少换乘、最少步行三种方案，封装了起点、终点选择和路线绘制等。
 * @author: Benny.Yu
 * @version: v1.0
 * @updateDate: 12-12-10
 */

KoalaGIS.EASYHZ.BusTransfer = KoalaGIS.EASYHZ.Class({
    /**
     * @description 地图对象
     * @field
     * @type {BMap.Map}
     */
    map:null,

    /**
     * @description 搜索关键字
     * @field
     * @type {string}
     */
    keyword:"",

    /**
     * @description 起点公交站点
     * @field
     * @type {BusStop}
     */
    startStop:null,

    /**
     * @description 终点公交站点
     * @field
     * @type {BusStop}
     */
    endStop:null,

    /**
     * @description 可选起止站点每页显示数量
     * @field
     * @type {number} 默认每页显示10个
     */
    maxPerPage:10,

    /**
     * @description 公交站点选择展示面板id
     * @field
     * @type {string}
     */
    busStopResultDivId:"",

    /**
     * @description 公交换乘查询展示面板id
     * @field
     * @type {string}
     */
    busInterchangeQueryResultDivId:"",

    /**
     * @description 公交线路查询展示面板id
     * @field
     * @type {string}
     */
    busLineQueryResultDivId:"",

    /**
     * @description BMap.LocalSearch对象
     * @field
     * @type {BMap.LocalSearch}
     */
    localSearchObj:null,

    /**
     * @description 起点查询结果
     * @field
     * @type {BMap.LocalSearchResult}
     */
    startStopSearchResult:null,

    /**
     * @description 终点查询结果
     * @feild
     * @type {Bmap.LocalSearchResult}
     */
    endStopSearchResult:null,

    /**
     * @constructor 初始化对象
     * @param map {BMap.map} 百度地图对象
     * @param keyword {string} 搜索关键字
     * @param stopResultDiv {string} 公交站点结果面板id
     * @param interchangeQueryResultDiv {string} 公交换乘结果面板id
     * @param lineQueryResultDiv {string} 公交线路结果面板id
     */
    initialize:function(map,keyword,stopResultDiv,interchangeQueryResultDiv,lineQueryResultDiv){
        this.busStopResultDivId = stopResultDiv;
        this.busInterchangeQueryResultDivId = interchangeQueryResultDiv;
        this.busLineQueryResultDivId = lineQueryResultDiv;
        //创建一个LocalSearch对象
        this.map = map;
        this.keyword = keyword;
        var resultOption = {
            onSearchComplete:function(result){
                //TODO 搜索结束后触发
            },
            onMarkersSet:function(pois){
                //TODO 标注完成后触发
            },
            onInfoHtmlSet:function(poi){
                //TODO 标注气泡完成后触发
            },
            onResultHtmlSet:function(container){
                //TODO 列表添加完成后触发
            },
            pageCapacity:10
        };

        this.localSearchObj = new BMap.LocalSearch(this.map,resultOption);
    },

    /**
     * @description 增加标注后触发的事件
     */
    afterAddMarkers:function(){},

    /**
     * @description 增加标注气泡后触发的事件
     */
    afterInfoHtml:function(){},

    /**
     * @description 列表添加完成后触发的事件
     */
    afterResultHtmlSet:function(){},

    /**
     * @description 清除结果展示面板的内容，供新的查询使用。
     */
    clearResult:function(){
        $("#" + this.busStopResultDivId).html("");
        $("#" + this.busInterchangeQueryResultDivId).html("");
        $("#" + this.busLineQueryResultDivId).html("");
    },

    /**
     * @description 执行本地搜索。搜索结果放入指定Div内
     */
    doLocalSearch:function(){
        var delegateObj = this;
        this.clearResult();
        this.localSearchObj.clearResults();
        this.localSearchObj.enableAutoViewport();
        this.disableFirstResultSelection();
        this.setPageCapacity = 10;
        //只针对单个关键词
        this.onSearchComplete(this.keyword,{forceLocal:true,customData:false})
        //设置检索结束后的回调:检索结果加入结果展示区。
        setSearchCompleteCallback = function(results){
            if(delegateObj.getStatus() == BMAP_STATUS_SUCCESS){
                //检索成功，封装返回的结果

            }else{
                //检索失败
            }

        };
    },

    /**
     * @description 选择起始站点，点击任意站点，在地图上绘制Poi和Popup
     */
    setStation:function(){},

    /**
     * @description 公交换乘搜索
     */
    doBusTransferQuery:function(){},

    /**
     * @description 填充公交换乘查询结果面板
     */
    setBusTransferQueryResultToPanel:function(){},

    /**
     * @description 公交线路搜索
     */
    doBusLineQuery:function(){},

    /**
     * @description 填充公交线路查询结果面板
     */
    setBusLineQueryResultToPanel:function(){},

    /**
     * @description 结果展示面板翻页，包括起始点选择和结果展示两个面板
     */
    turnPage:function(){},

    /**
     * @description 添加Popup
     */
    setPopup:function(){},

    /**
     * @description 添加Poi图标
     */
    setPoi:function(){},

    /**
     * @description 在地图上绘制公交换乘方案
     */
    setBusTransferResultToMap:function(){}







});