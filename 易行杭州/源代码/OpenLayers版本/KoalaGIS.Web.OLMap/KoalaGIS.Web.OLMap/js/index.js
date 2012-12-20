//2012-11-26
//by zhj


var isBikeShow = false;
var bikeLayer;

//自行车标注图层
var bikeMarksLayer;

//显示自行车列表或者搜索结果集
var bikesWindow;


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

    //清除标注
    clearBikeMarkers();

}

//添加自行车标注
function showBikeMarkers(bikes) {
    var icon = new OpenLayers.Icon('images/mark.png', new OpenLayers.Size(32, 32));
    if (!bikeMarksLayer) {
        bikeMarksLayer = new OpenLayers.Layer.Markers('BikeMarkLayerName');
        map.addLayer(bikeMarksLayer);
    }

    function markMouseOver(evt) {
        var mark = evt.object;
        mark.icon.setSize(new OpenLayers.Size(40, 40));
    }

    function markMouseOut(evt) {
        var mark = evt.object;
        mark.icon.setSize(new OpenLayers.Size(32, 32));
    }

    var popupClass = OpenLayers.Class(OpenLayers.Popup.FramedCloud, {
            'autoSize': true
        });

    for (var i = 0; i < bikes.length; i++) {
        var bike = bikes[i];
        var x = bike.X;
        var y = bike.Y;
        var mark = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon.clone());

//        mark.events.register('mousedown', mark, markMouseDown);
//        mark.events.register('mouseover', mark, markMouseOver);
//        mark.events.register('mouseout', mark, markMouseOut);

        //        bikeMarksLayer.addMarker(mark);
        var htmlContent = createInfoWindowHTML(bike);

        mark.data = bike;

        addMarker(bikeMarksLayer, mark, popupClass, htmlContent, true, true);
    }
}

function createInfoWindowHTML(bike) {

    var sHtml = [];
    sHtml.push('<table border="1px" cellspacing="0px" style="width:300px;">');

    function createRow(title, value, id ) {
        if (!id) {
            return '<tr><td>' + title + '</td><td>' + value + '</td></tr>';
        } else {
            return '<tr><td>' + title + '</td><td id="'+ id +'">' + value + '</td></tr>';  
        }
    }

    sHtml.push(createRow('站点名称', bike.StationName));
    sHtml.push(createRow('租车情况', '数据加载中......', 'BikeBorrowInfo'));
    sHtml.push(createRow('服务时间', bike.ServiceTime));
    sHtml.push(createRow('值守状态', bike.ServiceState));
    sHtml.push(createRow('站点地址', bike.StationAddr));
    sHtml.push(createRow('服务电话', bike.ServicePhone));
    sHtml.push(createRow('其他服务', bike.StationRemarks));

    sHtml.push('</table');

    sHtml = sHtml.join('');

    return sHtml;
}


var g_popup = null;

//添加标会 markers Markers图层, xy坐标点,popupClass, closeBox,overflow：true:false
function addMarker(markers, marker, popupClass, popupContentHTML, closeBox, overflow) {

    overflow = (overflow) ? "auto" : "hidden";


    var markerClick = function (evt) {
        var marker = evt.object;
        if (g_popup) {
            map.removePopup(g_popup);
            //g_popup.destroy();
            g_popup = null;
        }

        var lonlat = marker.lonlat;

        var bikeid;
        if (marker.data) {
            var bike = marker.data;
            bikeid = bike.StationID;

        }
        g_popup = new popupClass("popup",
            lonlat,
            new OpenLayers.Size(200, 200),
            popupContentHTML,
           marker.icon,
            true);

        map.addPopup(g_popup);
        g_popup.show();

        if (bikeid) {
            //加载数据
            Ext.Ajax.request({
                url: 'queryStationInfo.ashx?type=1&keyword=' + bikeid,
                success: function (response) {
                    var json = Ext.decode(response.responseText);
                    var information = '没有查询到数据！';
                    if (json.length > 0) {
                        var n1 = json[0].CYCAVAIL;
                        var n2 = json[0].CYCBACK;
                        information = '可借' + n1 + '辆,可还' + n2 + '辆';
                    }

                    document.getElementById('BikeBorrowInfo').innerHTML = information ;
                },
                failure: function () {
                    document.getElementById('BikeBorrowInfo').innerHTML = '查询数据失败！';
                }
            });

        }

        OpenLayers.Event.stop(evt);
    };

    marker.events.register("mousedown", marker, markerClick);

    markers.addMarker(marker);
}

//清除所有的自行车标注
function clearBikeMarkers() {

    if (g_popup) {
        map.removePopup(g_popup);
        //g_popup.destroy();
        g_popup = null;
    }

    if (bikeMarksLayer) {
        var mks = bikeMarksLayer.markers;
        do {
            bikeMarksLayer.removeMarker(mks[0]);
        } while (bikeMarksLayer.markers.length > 0);
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

//根据名称或地址搜索自行车
function searchBikes(keyword) {
    var store = Ext.data.StoreManager.lookup('GridBikesStore');
    if (!store) {
        var store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            pageSize: 10,
            storeId: 'GridBikesStore',
            proxy: {
                type: 'ajax',
                url: 'Bikes/BikesHandler.ashx?request=searchbikesbyname',
                extraParams: { keyword: keyword },
                limitParam: 'pagesize',
                reader: {
                    type: 'json',
                    root: 'ResultSet',
                    totalProperty: 'TotalCount'
                }
            },
            fields: ['StationName', 'StationID', 'X', 'Y', 'ServiceTime', 'ServicePhone', 'StationAddr', 'ServiceState']
        });
        //绑定load数据的事件
        store.on('load', function (store, records, isSuccessful, operation, options) {
            //alert('load');
            var record;
            var bikes = [];
            var minx = Number.MAX_VALUE;
            var maxx = Number.MIN_VALUE;
            var miny = Number.MAX_VALUE;
            var maxy = Number.MIN_VALUE;
            for (var i = 0; i < records.length; i++) {
                record = records[i];
                var name = record.get("StationName");
                var id = record.get("StationID");
                var x = record.get("X");
                var y = record.get("Y");

                if (x < minx) minx = x;
                if (x > maxx) maxx = x;
                if (y < miny) miny = y;
                if (y > maxy) maxy = y;

                //bikes.push({ X: x, Y: y,Station });
                bikes.push(record.data);
            }

            //var cex = 0.5 * (minx + maxx);
            //var cey = 0.5 * (miny + maxy);
            //var center = new OpenLayers.LonLat(cex, cey);
            //map.panTo(center);
          
            map.zoomToExtent([minx, miny, maxx, maxy], true);

            clearBikeMarkers();


            showBikeMarkers(bikes);

        });
    } else {
        var proxy = store.getProxy();
        proxy.url = 'Bikes/BikesHandler.ashx?request=searchbikesbyname';
        proxy.extraParams = {keyword:keyword};
    }

    store.load();

    showBikesWindow(store);
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
            storeId: 'GridBikesStore',
            url: 'Bikes/BikesHandler.ashx?request=querybikes',
            limitParam: 'pagesize',
            reader: {
                type:'json',
                root: 'ResultSet',
                totalProperty: 'TotalCount'
            }
        },
        fields: ['StationName', 'StationID', 'X', 'Y', 'ServiceTime', 'ServicePhone', 'StationAddr', 'ServiceState']
    });

    //绑定load数据的事件
    store.on('load', function (store, records, isSuccessful, operation, options) {
        //alert('load');
        var record;
        var bikes = [];
        var minx = Number.MAX_VALUE;
        var maxx = Number.MIN_VALUE;
        var miny = Number.MAX_VALUE;
        var maxy = Number.MIN_VALUE;
        for (var i = 0; i < records.length; i++) {
            record = records[i];
            var name = record.get("StationName");
            var id = record.get("StationID");
            var x = record.get("X");
            var y = record.get("Y");

            if (x < minx) minx = x;
            if (x > maxx) maxx = x;
            if (y < miny) miny = y;
            if (y > maxy) maxy = y;

            //bikes.push({ X: x, Y: y,Station });
            bikes.push(record.data);
        }

        var cex = 0.5 * (minx + maxx);
        var cey = 0.5 * (miny + maxy);
        var center = new OpenLayers.LonLat(cex, cey);
        map.panTo(center);

        clearBikeMarkers();


        showBikeMarkers(bikes);

    });

    showBikesWindow(store);
}


//根据数据源显示列表窗体
function showBikesWindow(store) {
    if (!bikesWindow) {
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
                store: store,
                pageSize: 10,
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
        gridPanel.on('itemdblclick', function (view, record, item, index, e, options) {
            var id = record.get('StationID');
            var marker = bikeMarksLayer.markers[index];
            var center = marker.lonlat;
            map.panTo(center);
            marker.events.triggerEvent('mousedown');
        });
        
        bikesWindow = Ext.create('widget.window', {
            closeAction:'hide',
            title: '自行车列表',
            layout: 'fit',
            items: [gridPanel]
        });

        var width = Ext.Element.getDocumentWidth();
        var height = Ext.Element.getDocumentHeight();

        bikesWindow.setPosition(width - 350, 120, true);


        bikesWindow.on('hide', function (cmp, options) {
            clearBikeMarkers();
        });
    }

    if (!bikesWindow.isVisible()) {
        bikesWindow.show();
    }
}
