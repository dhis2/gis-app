export default function LayerWidgetEarthEngine(gis, layer) {
    var layerStore,
        layerCombo,
        reset,
        setGui,
        getView,
        panel;

    var layerStore = Ext.create('Ext.data.Store', {
        fields: ['code', 'name'],
        data: [{
            code: 'elevation_srtm_30m',
            name: 'Elevation'
        },{
            code: 'worldpop_2010_un',
            name: 'Population density 2010'
        }]
    });

    layerCombo = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.select_layer_from_google_earth_engine,
        editable: false,
        valueField: 'code',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        width: 220,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        labelAlign: 'top',
        labelCls: 'gis-form-item-label-top',
        style: 'padding:5px 5px 10px 5px;',
        store: layerStore,
        listeners: {
            afterRender: function() {
                this.reset();
            }
        },
        reset: function() { // Set first layer as default
            this.setValue(this.store.getAt(0).data.code);
        }
    });

    reset = function() {
        layer.item.setValue(false);

        if (!layer.window.isRendered) {
            layer.view = null;
            return;
        }

        layerCombo.reset();
    };

    setGui = function(view) {
        layerCombo.setValue(view.code);
    };

    getView = function() {
        var code = layerCombo.getValue();

        if (code === null) {
            return;
        }

        return {
            code: code
        };
    };

    panel = Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border-style:none; padding:1px; padding-bottom:0',
        items: [layerCombo],
        map: layer.map,
        layer: layer,
        menu: layer.menu,

        reset: reset,
        setGui: setGui,
        getView: getView,

        listeners: {
            added: function() {
                layer.accordion = this;
            }
        }
    });

    return panel;
};