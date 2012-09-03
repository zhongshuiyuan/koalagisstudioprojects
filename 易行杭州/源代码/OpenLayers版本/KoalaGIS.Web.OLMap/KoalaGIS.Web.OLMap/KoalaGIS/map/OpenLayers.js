Ext.define('KoalaGIS.map.OpenLayers', {
    init: function (div, options) {
        this._map = new OpenLayers.Map(div, options);

    },
    getMap: function () {
        return this._map;
    },
    addLayer: function () {
    },

    loadDefaultMap: function () {
        var wms = new OpenLayers.Layer.WMS('OpenLayers WMS', 'http://vmap0.tiles.osgeo.org/wms/vmap0?', { 'layers': 'basic' });
        if (!this._map) {
            throw ("没有初始化地图！！");
        }
        this._map.addLayer(wms);
        this._map.zoomToExtent(new OpenLayers.Bounds(-100.898437, 22.148438, -78.398437, 39.726563));
    }
});