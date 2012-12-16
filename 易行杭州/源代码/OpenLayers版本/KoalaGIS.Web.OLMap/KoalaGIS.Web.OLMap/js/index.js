//2012-11-26
//by zhj


var isBikeShow = false;
var bikeLayer;
//添加自行车图层
function addBikeLayer() {

    if (bikeLayer) {
        bikeLayer.setVisibility(true);
        return;
    }
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

    var bikeUrl = 'http://www.5ihangzhou.com/Layers/_alllayers';
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

    bikeLayer = baseLayer;

    map.addLayer(baseLayer);

    isBikeShow = true;



}

//隐藏自行车图层
function hideBikeLayer() {
    if (bikeLayer) {
        bikeLayer.setVisibility(false);
    }
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

//根据当前bbox搜索自行车
function searchBikes(bbox) {
    
}

//获取指定自行车位的详细信息
function showBikeInfo(id) {
}

function showSearchGrid() {

    var store = Ext.create('Ext.data.Store', {
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: 'Bikes/BikesHandler.ashx?request=querybikes',
            limitParam: 'pagesize',
            reader: {
                type:'json',
                root: 'ResultSet',
                totalProperty: 'TotalCount'
            }
        },
        fields: [{ name: 'StationName' }, { name: 'StationID' }, { name: 'X' }, { name: 'Y'}]
    });

    // create the Grid, see Ext.
    //Ext.ux.LiveSearchGridPanel
    var gridPanel = Ext.create('Ext.grid.Panel', {
        store: store,
        columnLines: true,
        columns: [{
            text: 'ID',
            width: 75,
            dataIndex: 'StationID'
        }, {
            text: '名称',
            flex: 1,
            dataIndex: 'StationName'
        }],
        height: 360,
        width: 310,
        //title: 'Live Search Grid',
        //renderTo: 'grid-example',
        viewConfig: {
            stripeRows: true
        },
        bbar: {
            xtype: 'pagingtoolbar',
            store:store,
            pageSize:10,
            displayInfo: true,
            //displayMsg: '显示第 {0} 条到  {1} 条记录, 一共 {2} 条',
            displayMsg: '共{2} 条',
            emptyMsg: "没有记录",
            beforePageText: '页码',
            afterPageText: '/{0}',
            firstText: '首页',
            prevText: '上一页',
            nextText: '下一页',
            lastText: '末页',
            refreshText: '刷新'
        }
    });

    var window = Ext.create('widget.window', {
        title:'自行车列表',
        layout: 'fit',
        items:[gridPanel]
    });

    window.show();
}
