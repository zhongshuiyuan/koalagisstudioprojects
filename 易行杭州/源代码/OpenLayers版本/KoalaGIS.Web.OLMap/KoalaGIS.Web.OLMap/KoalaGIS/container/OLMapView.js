//
//author:zhj
//date:2012-05-29 12:30
//在线地图app

Ext.define('KoalaGIS.container.OLMapView', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    items: [{
        region: 'north',
        html: 'Logo and Title',
        border: false,
        margins: '0 0 5 0'
    }, {
        region: 'west',
        collapsible: true,
        title: 'Navigation',
        width: 150
    }, {
        region: 'south',
        title: 'South Panel',
        collapsible: true,
        html: 'Information goes here',
        split: true,
        height: 100,
        minHeight: 100
    }, {
        region: 'center',
        xtype: 'tabpanel', // TabPanel itself has no title
        activeTab: 0,      // First tab active by default
        items: {
            title: 'Default Tab',
            html: '<div id="divMap" style="width:100%;height:100%; border:solid 1px red">The first tab\'s content. Others may be added dynamically</div>'
        }
    }]

});