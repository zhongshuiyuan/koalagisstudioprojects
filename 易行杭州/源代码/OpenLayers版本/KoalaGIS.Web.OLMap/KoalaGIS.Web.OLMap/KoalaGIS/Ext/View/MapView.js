//
//author:zhj
//date:2012-05-29 12:30
//在线地图app


//Ext.Loader.setPath('Ext.ux', 'http://cdn.sencha.io/ext-4.1.1a-gpl/examples/ux/');
//Ext.require(['Ext.grid.*', 'Ext.data.*', 'Ext.util.*', 'Ext.tip.QuickTipManager']);

Ext.define('KoalaGIS.Ext.View.MapView', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    items: [{
        region: 'north',
        //html: 'divLogo',
        border: false,
        bbar: [{
            xtype: 'displayfield',
            value: '杭州市公共自行车查询'
        }, '->', {
            xtype: 'button',
            text: '显示自行车分布图',
            id: 'BTN_BIKE',
            handler: function () {
                if (this.text == '显示自行车分布图') {
                    addBikeLayer();
                    this.setText('隐藏自行车分布图');
                } else {
                    hideBikeLayer();
                    this.setText('显示自行车分布图');
                }
            }
        }, '-', {
            text: '清除',
            handler: function () {
                clear();
            }
        }, '-', {
            text: '测试功能',
            handler: function () {
                //testShowMarks();
                showSearchGrid();
            }
        }, '-', {
            xtype: 'textfield',
            fieldLabel: '名称',
            labelWidth: 30
        }, {
            text: '搜索',
            handler: function () {

            }
        }]
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
        height: 25,
        html: '<div><div id="divXY"/><div style="float:right;">Copy Left By KoalaGIS Studio</div></div>'
        //minHeight: 100
    }, {
        region: 'center',
        //xtype: 'tabpanel', // TabPanel itself has no title
        //activeTab: 0,      // First tab active by default
        layout: 'fit',
        items: {
            //title: '地图控件',
            html: '<div id="divMap" style="width:100%;height:100%; border:solid 1px red"></div>'

        }
    }]

});