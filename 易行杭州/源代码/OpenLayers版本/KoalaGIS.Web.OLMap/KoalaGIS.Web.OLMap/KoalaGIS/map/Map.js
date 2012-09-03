Ext.define('KoalaGIS.map.OpenLayers', {
    init: function() {
        var map = new OpenLayers.Map('map', { maxResolution: 0.703125 });
        var wmscURL = [
				    "http://wmsc1.terrapages.net/getmap?",
				    "http://wmsc2.terrapages.net/getmap?",
				    "http://wmsc3.terrapages.net/getmap?",
				    "http://wmsc4.terrapages.net/getmap?"
			    ];
        var terrapagesStreetLayer = new OpenLayers.Layer.WMS('TerraPages Street', wmscURL, { layers: 'UnprojectedStreet', format: 'image/jpeg' }, { buffer: 1, isBaseLayer: true });
        map.addLayer(terrapagesStreetLayer);
        map.zoomToMaxExtent();
    },
    addLayer: function() {
    }
});