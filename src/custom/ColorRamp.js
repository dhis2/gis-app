import colorbrewer from '../custom/colorbrewer';



console.log(colorbrewer);

/* ColorButton */
Ext.define('Ext.ux.field.ColorRamp', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.colorramp',
    cls: 'gis-combo',
    // fieldLabel: GIS.i18n.select_layer_from_google_earth_engine,
    fieldLabel: 'Select layer form Google Earth Engine',
    editable: false,
    valueField: 'key',
    displayField: 'name',
    queryMode: 'local',
    forceSelection: true,
    width: 220,
    // labelWidth: gis.conf.layout.widget.itemlabel_width,
    labelAlign: 'top',
    labelCls: 'gis-form-item-label-top',
    style: 'padding-bottom:10px;',


    displayTpl: Ext.create('Ext.XTemplate', '<tpl for="."><h1>###</h1></tpl>'),


    //tpl:'<div class="x-combo-list-item">###</div>',
    styleHtmlContent: false,
    store: Ext.create('Ext.data.Store', {
        fields: ['key', 'name'],
        data: [{
            key: 'elevation_srtm_30m',
            name: '<h1>Elevation</h1>'
        },{
            key: 'worldpop_2010_un',
            name: 'Population density 2010'
        }]
    }),
    listeners: {
        // select: onLayerComboSelect
        afterRender: function() {
            var div = document.createElement('div');
            div.className = 'color-ramp';

            // TODO: Create dynamically
            div.innerHTML = this.createRamp('YlGn', 7);

            this.inputEl.insertSibling(div);

            this.reset();
        }
    },
    reset: function() { // Set first layer as default
        this.setValue(this.store.getAt(0).data.key);
    },
    createRamp: function(scheme, classes) {
        console.log('create', colorbrewer[scheme][classes]);

        return '<ul><li style="background:#FFFFB2;"></li><li style="background:#FED976;"></li><li style="background:#FEB24C;"></li><li style="background:#FD8D3C;"></li><li style="background:#FC4E2A;"></li><li style="background:#E31A1C;"></li><li style="background:#B10026;"></li></ul>';
    }



    //disabledCls: 'gis-colorramp-disabled',
    //width: 109,
    //height: 22,
    //defaultValue: null,
    //value: 'f1f1f1',

    /*
    getValue: function() {
        return this.value;
    },
    setValue: function(color) {
        this.value = color;
        if (Ext.isDefined(this.getEl())) {
            this.getEl().dom.style.background = '#' + color;
        }
    },
    reset: function() {
        this.setValue(this.defaultValue);
    },
    */

    /*
    initComponent: function() {
        this.callParent();
    },
    listeners: {
        render: function() {
            //this.setValue(this.value);
        }
    }
    */
});
