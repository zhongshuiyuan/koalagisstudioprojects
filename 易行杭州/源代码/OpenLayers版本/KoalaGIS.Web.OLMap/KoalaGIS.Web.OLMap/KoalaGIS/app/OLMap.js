//
//author:zhj
//date:2012-05-29 12:30
//在线地图app

Ext.application({
    name: 'OLMap',
    launch: function() {
        Ext.create('KoalaGIS.container.OLMapView');
    }
});