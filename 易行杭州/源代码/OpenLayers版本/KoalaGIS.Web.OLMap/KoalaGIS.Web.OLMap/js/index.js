//2012-11-26
//by zhj


//添加自行车图层
function addBikeLayer() {

    //alert('gaga');
    //return;
    var proj = 'EPSG:900913';


    /* Layer can also accept serverResolutions array
    * to deal with situation in which layer resolution array & map resolution
    * array are out of sync*/
    var mapResolutions = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144];
    mapResolutions = mapResolutions.reverse();
    /* For this example this next line is not really needed, 256x256 is default.
    * However, you would need to change this if your layer had different tile sizes */
    var tileSize = new OpenLayers.Size(256, 256);

    /* Tile Origin is required unless it is the same as the implicit map origin
    * which can be affected by several variables including maxExtent for map or base layer */
    var agsTileOrigin = new OpenLayers.LonLat(-5123300, 10002300);

    /* This can really be any valid bounds that the map would reasonably be within */
    /*  var mapExtent = new OpenLayers.Bounds(293449.454286,4307691.661132,314827.830376,4323381.484178); */
    var mapExtent = new OpenLayers.Bounds(289310.8204, 4300021.937, 314710.8712, 4325421.988);

    var bikeUrl = 'http://localhost/AGCCache/ghj数据配准在百度地图上的数据2/Layers/_alllayers';
    //var roadsUrl = 'http://serverx.esri.com/arcgiscache/DG_County_roads_yesA_backgroundDark/Layers/_alllayers';

    var baseLayer = new OpenLayers.Layer.ArcGISCacheEx('自行车', bikeUrl, {
        //id:'Bike',
        tileOrigin: agsTileOrigin,
        resolutions: mapResolutions,
        sphericalMercator: true,
        //maxExtent: mapExtent,
        useArcGISServer: false,
        isBaseLayer: false,
        type: 'png',
        projection: proj
    });

    map.addLayer(baseLayer);



}

//清除图层上的任何东西
function clear() {
    var bikelayer = map.getLayer('Bike');
    if (bikelayer) {
        map.removeLayer(bikelayer);
    }
    
}
