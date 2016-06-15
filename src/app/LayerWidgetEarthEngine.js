export default function LayerWidgetEarthEngine(gis, layer) {
    var layerStore,
        elevation,
        minValue,
        maxValue,
        stepValue,
        minField,
        maxField,
        stepField,
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
        fields: ['key', 'name', 'min', 'max', 'steps', 'colors'],
        data: [{
            key: 'elevation_srtm_30m',
            name: 'Elevation',
            min: 1000,
            max: 2500,
            steps: 5,
            colors: 'YlOrBr'
        },{
            key: 'worldpop_2010_un',
            name: 'Population density 2010',
            min: 0,
            max: 100,
            steps: 5,
            colors: 'YlOrBr'
        }]
    });

    minValue = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 80,
        allowDecimals: false,
        minValue: 0,
        //maxValue: 8848,
        value: 0,
        listeners: {
            change: function(field, value) {
                let steps = stepValue.getValue();

                if (value === 0 && steps === 1) { // Not allowed
                    stepValue.setValue(2);
                    steps = 2;
                }

                colorsCombo.setClasses(steps + (value === 0 ? 1 : 2));
            }
        }
    });

    maxValue = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 80,
        allowDecimals: false,
        //minValue: 1,
        //maxValue: 8848,
        value: 2500
    });

    stepValue = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 80,
        allowDecimals: false,
        minValue: 1,
        maxValue: 7,
        value: 5,
        listeners: {
            change: function(field, value) {
                const min = minValue.getValue();

                if (value === 1 && min === 0) { // Not allowed
                    this.setValue(2);
                    value = 2;
                }

                colorsCombo.setClasses(value + (min === 0 ? 1 : 2));
            }
        }
    });

    minField = Ext.create('Ext.container.Container', {
        layout: 'hbox',
        hidden: true,
        style: 'padding:5px 0 0 5px;',
        items: [{
            xtype: 'container',
            html: 'Min value:', // TODO: i18n
            width: gis.conf.layout.widget.itemlabel_width,
            style: 'padding-top:5px;font-size:11px;'
        }, minValue]
    });

    maxField = Ext.create('Ext.container.Container', {
        layout: 'hbox',
        hidden: true,
        style: 'padding:5px 0 0 5px;',
        items: [{
            xtype: 'container',
            html: 'Max value:', // TODO: i18n
            width: gis.conf.layout.widget.itemlabel_width,
            style: 'padding-top:5px;font-size:11px;'
        }, maxValue]
    });

    stepField = Ext.create('Ext.container.Container', {
        layout: 'hbox',
        hidden: true,
        style: 'padding:5px 0 0 5px;',
        items: [{
            xtype: 'container',
            html: 'Steps:', // TODO: i18n
            width: gis.conf.layout.widget.itemlabel_width,
            style: 'padding-top:5px;font-size:11px;'
        }, stepValue]
    });

    onLayerComboSelect = function(combo, record) {
        record = record[0];

        colorsCombo.show().setValue(record.get('colors'));

        minField.show();
        minValue.setValue(record.get('min'));

        maxField.show();
        maxValue.setValue(record.get('max'));

        stepField.show();
        stepValue.setValue(record.get('steps'));
    };

    // Combo with with supported Earth Engine layers
    layerCombo = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        // fieldLabel: GIS.i18n.select_layer_from_google_earth_engine,
        fieldLabel: 'Select layer',
        editable: false,
        valueField: 'key',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width,
        store: layerStore,
        listeners: {
            select: onLayerComboSelect
        }
    });

    colorsCombo = Ext.create('Ext.ux.field.ColorScale', {
        fieldLabel: 'Color scale',
        hidden: true,
        value: 'YlOrBr',
        classes: 6,
        style: 'padding-top:5px;',
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width
    });

    // Reset this widget
    reset = function() {
        layer.item.setValue(false);

        if (!layer.window.isRendered) {
            layer.view = null;
            return;
        }

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
            config: { // Config object saved stored as one field
                key: key,
                params: {
                    palette: colorsCombo.getValue().join(','),
                    min: minValue.getValue(),
                    max: maxValue.getValue()
                }
            }
        };

        return view;
    };

    // This widget panel
    panel = Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border:0;padding:10px 0;',
        items: [layerCombo, colorsCombo, minField, maxField, stepField],
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