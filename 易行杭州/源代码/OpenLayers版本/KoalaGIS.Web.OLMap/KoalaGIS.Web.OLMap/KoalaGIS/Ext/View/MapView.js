//
//author:zhj
//date:2012-05-29 12:30
//在线地图app

Ext.define('KoalaGIS.Ext.View.MapView', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    items: [{
        region: 'north',
        html: '杭州市公共自行车查询系统',
        border: false
    }/*, {
        region: 'west',
        collapsible: false,
        //title: 'Navigation',
        width: 150
    }*/, {
        region: 'south',
        //title: 'South Panel',
        collapsible: false,
        html: 'Information goes here',
        split: false,
        height: 70,
        //minHeight: 100
    }, {
        region: 'center',
        //xtype: 'tabpanel', // TabPanel itself has no title
        //activeTab: 0,      // First tab active by default
        layout:'fit',
        items: {
            //title: '地图控件',
            html: '<div id="divMap" style="width:100%;height:100%; border:solid 1px red"></div>',
            tbar:['->',{
                xtype: 'button',
                text: 'bike',
                handler: function () {
                    addBikeLayer();
                }
            },'-',{
                text:'图层控制',
                handler:function(){
                    
                }
            },'-',{
                text:'清除',
                handler:function(){
                    clear();
                }
            }]
        }
    }]

});