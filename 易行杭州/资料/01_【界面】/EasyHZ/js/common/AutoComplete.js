/**
 * @fileOverview: 根据输入的关键词自动提示，并返回选中的关键词数组。
 *   如果输入的关键词未能返回智能提示结果，清空输入栏并提示用户重新输入。
 *   智能提示本身不支持多关键词查询
 * @author: Benny.Yu
 * @version: v1.0
 * @updateDate: 2012-12-8
 */

/**
 * Class: KoalaGIS.EASYHZ.AutoComplete
 */
KoalaGIS.EASYHZ.AutoComplete = KoalaGIS.EASYHZ.Class({
    /**
    * @description 地图对象
    * @filed
    * @type {BaiDu.Map} map 百度地图对象
    */
    map: null,

    /**
    * @description 所在城市，默认“杭州”
    * @field
    * @type {string} city 默认查询的城市
    */
    city: "杭州",

    /**
    * @description 本地搜索关键词
    * @field
    * @type {string} keyword 查询关键词
    */
    keyword: "",

    /**
    * @description AutoComplete对象
    * @field
    * @type {BMAP.AutoComplete} autocomplete对象
    */
    acObject: null,

    /**
    * @description 回车选中高亮项是否触发LocalSearch事件
    * @field
    * @type {bool} true:触发LocalSearch事件;false:不触发事件。
    */
    activeEnterPress:false,

    /*
    * @description 智能提示匹配结果
    * @field
    * @type {BMap.AutoCompleteResult}
     */
    acResult:null,

    /**
    * @constructor: 初始化BMap.AutoComplete对象
    * @param inputDivId {string} 指定关联AutoComplete的input控件
    * @param mapObj {BaiDu.Map} 返回结果的所属范围
    */
    initialize: function (inputDivId, mapObj) {
        this.map = (mapObj == null || mapObj == undefined) ? this.city : mapObj;
        //构建AC对象
        if(this.acObject == null || this.acObject == "undefined" || this.acObject == undefined){
            var delegateObj = this;
            this.acObject = new BMap.Autocomplete({
                "input": inputDivId,
                "location": this.map,
                "onSearchComplete": function (result) {
                    //保存关键词
                    delegateObj.keyword = result.keyword;
                    //保存智能提示返回的结果集
                    delegateObj.acResult = result;
                    //鼠标或键盘事件
                    delegateObj.acObject.addEventListener("onhighlight",function(e){
                        if (e.fromitem.index > -1) {
                            value = e.toitem.value.business;
                            delegateObj.acObject.setInputValue(value);
                        }
                    });
                }
            });
        }
    },

    /**
     * @description 销毁ac对象
     * @return {None}
     */
    destroyAutocompleteObject: function(){
        this.acObject.dispose();
    }

});