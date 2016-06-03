export default function LayerWidgetEarthEngine(gis, layer) {
    var layerStore,
        elevation,
        minValue,
        maxValue,
        minField,
        maxField,
        elevationField,
        layerCombo,
        colorsCombo,
        onLayerComboSelect,
        reset,
        setGui,
        getView,
        panel;

    // Store for combo with supported Earth Engine layers
    layerStore = Ext.create('Ext.data.Store', {
        fields: ['key', 'name'],
        data: [{
            key: 'elevation_srtm_30m',
            name: 'Elevation'
        },{
            key: 'worldpop_2010_un',
            name: 'Population density 2010'
        }]
    });

    minValue = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 80,
        allowDecimals: false,
        //minValue: 1,
        //maxValue: 8848,
        value: 1500,
        style: 'padding-bottom:10px;'
    });

    maxValue = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 80,
        allowDecimals: false,
        //minValue: 1,
        //maxValue: 8848,
        value: 3000,
        style: 'padding-bottom:10px;'
    });

    minField = Ext.create('Ext.container.Container', {
        layout: 'hbox',
        hidden: true,
        items: [{
            xtype: 'container',
            html: 'Min value:', // TODO: i18n
            width: 60,
            style: 'padding-top:5px;font-size:11px;'
        }, minValue]
    });

    maxField = Ext.create('Ext.container.Container', {
        layout: 'hbox',
        hidden: true,
        items: [{
            xtype: 'container',
            html: 'Max value:', // TODO: i18n
            width: 60,
            style: 'padding-top:5px;font-size:11px;'
        }, maxValue]
    });

    elevation = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 90,
        allowDecimals: false,
        minValue: 1,
        maxValue: 8848,
        value: 1200,
        style: 'padding-bottom:10px;'
    });

    // Number field to specify elevation (altitude)
    elevationField = Ext.create('Ext.container.Container', {
        layout: 'hbox',
        hidden: true,
        items: [{
            xtype: 'container',
            html: 'Elevation:', // TODO: i18n
            width: 60,
            style: 'padding:5px;font-size:11px;'
        }, elevation]
    });

    // Show elevation field when elevation layer is selected
    onLayerComboSelect = function() {
        colorsCombo.show();

        if (this.getValue() === 'elevation_srtm_30m') {
            minField.show();
            maxField.show();
        } else {
            minField.hide();
            maxField.hide();
        }
    };

    // Combo with with supported Earth Engine layers
    layerCombo = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        // fieldLabel: GIS.i18n.select_layer_from_google_earth_engine,
        fieldLabel: 'Select layer form Google Earth Engine',
        editable: false,
        valueField: 'key',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        width: 220,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        labelAlign: 'top',
        labelCls: 'gis-form-item-label-top',
        style: 'padding-bottom:10px;',
        store: layerStore,
        listeners: {
            select: onLayerComboSelect
        }
    });

    colorsCombo = Ext.create('Ext.ux.field.ColorRamp', {
        fieldLabel: 'Select color ramp',
        hidden: true
    });

    // Reset this widget
    reset = function() {
        layer.item.setValue(false);

        if (!layer.window.isRendered) {
            layer.view = null;
            return;
        }

        console.log('reset');
        layerCombo.reset();
    };

    // Poulate the widget from a view (favorite)
    setGui = function(view) {
        layerCombo.setValue(view.key);
    };

    // Get the view representation of the layer
    getView = function() {
        var key = layerCombo.getValue();

        if (key === null) {
            return;
        }

        var view = {
            key: key,
            palette: colorsCombo.getValue().join(','),
            min: minValue.getValue(),
            max: maxValue.getValue()
        };

        if (key === 'elevation_srtm_30m') {
            view.elevation = elevation.getValue();
        }

        return view;
    };

    // This widget panel
    panel = Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border-style:none; padding:10px; padding-bottom:0',
        items: [layerCombo, colorsCombo, minField, maxField],
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