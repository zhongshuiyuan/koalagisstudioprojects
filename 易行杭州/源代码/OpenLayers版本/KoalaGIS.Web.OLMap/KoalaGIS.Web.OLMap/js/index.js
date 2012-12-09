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

//添加自行车标注
function addMarker(bikes) {
    var icon = new OpenLayers.Icon('images/mark.png', new OpenLayers.Size(32, 32));
    var markLayer = map.getLayer('BikeMarkLayer');
    if (!markLayer) {
        var markLayer = new OpenLayers.Layer.Markers('BikeMarkLayer');
        map.addLayer(markLayer);
    }

    function markMouseOver(evt) {
        var mark = evt.object;
        mark.icon.setSize(new OpenLayers.Size(40, 40));
    }

    function markMouseOut(evt) {
        var mark = evt.object;
        mark.icon.setSize(new OpenLayers.Size(32, 32));
    }

    function markMouseDown(evt) {
        debugger;
        var mark = evt.object;

        var popup = new OpenLayers.Popup("自行车信息", mark.lonlat, new OpenLayers.Size(200, 200), "Inner Html", true);

        map.addPopup(popup);

        OpenLayers.Event.stop(evt);
    }

    for (var i = 0; i < bikes.length; i++) {
        var bike = bikes[i];
        var x = bike.X;
        var y = bike.Y;
        var mark = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon.clone());

        mark.events.register('mousedown', mark, markMouseDown);
        mark.events.register('mouseover', mark, markMouseOver);
        mark.events.register('mouseout', mark, markMouseOut);

        markLayer.addMarker(mark);
    }
}

function testShowMarks(bbox) {
    var bikes = [{ X: 13374681, Y: 3519564 }, { X: 13374881, Y: 3519836}];
    bikes = [];
    var cex = 13374681;
    var cey = 3519564;

    var radius = 500;

    bbox = map.getExtent();

    for (var i = 0; i < bikes_data.length; i++) {
        var x = bikes_data[i][8];
        var y = bikes_data[i][9];

        if (Math.abs(x - cex) <= radius && Math.abs(y - cey) <= radius ) {
            bikes.push({ X: x, Y: y });
        }

        
    }
    addMarker(bikes);
    
}
