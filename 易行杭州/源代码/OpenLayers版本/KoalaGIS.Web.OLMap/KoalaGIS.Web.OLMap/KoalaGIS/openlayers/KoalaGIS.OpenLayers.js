//date:2012-11-23

(function () {
    //var KoalaGIS;
    var global = this;

    if (global.KoalaGIS === undefined ) {
        global.KoalaGIS = {};
    }

    KoalaGIS.Version = '1.0.0';
    KoalaGIS.OpenLayers = {

        //初始化地图
        InitMap: function (div, options) {
            this._map = new OpenLayers.Map(div, options);
            return this._map;
        },

        //添加图层
        AddLayer: function (layer) {
            this._map.addLayer(layer);
        },

        //添加鱼骨头控件
        AddPanZoomBar:function(){
            this._map.addControl(new OpenLayers.Control.PanZoomBar());
        },

        //添加百度地图
        AddBaiduLayer: function () {
            var res = [];
            for (var i = 0; i < 19; i++) {

                //res[i] = 131072 * Math.pow(2, i - 18);
                res[i] = Math.pow(2, 18 - i);
            }
            var baidu = new KoalaGIS.OpenLayers.Baidu.WmtsLayer('baidu', 'http://q3.baidu.com/it/', {
                isBaseLayer: true,
                displayOutsideMaxExtent: false,
                resolutions: res,
                maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34)
            });
            this.AddLayer(baidu);
        }


    }

})();