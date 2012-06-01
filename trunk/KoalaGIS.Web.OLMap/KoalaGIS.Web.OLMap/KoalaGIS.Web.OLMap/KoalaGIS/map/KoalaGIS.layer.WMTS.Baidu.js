

KoalaGIS.Layer.WMTS.Baidu = OpenLayers.Class(OpenLayers.Layer.WMTS, {

    version: '1.0.0',
    url: 'http://www.baidu.com',
    layer: 'KOALAGIS_LAYER_WMTS_BAIDU',
    tileOrigin: null,
    tileFullExtent: null,

    initialize: function(config) {

    },

    getURL: function(bounds) {
        bounds = this.adjustBounds(bounds);
        var url = "";
        if (!this.tileFullExtent || this.tileFullExtent.intersectsBounds(bounds)) {
            var center = bounds.getCenterLonLat();
            var info = this.getTileInfo(center);
            var matrixId = this.matrix.identifier;
        }

    },

    CLASS_NAME: 'KoalaGIS.Layer.WMTS.Baidu'

});