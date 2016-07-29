export default function LayerWidgetEarthEngine(gis, layer) {
    var layerStore,
        timeStore,
        // elevation,
        minValue,
        maxValue,
        stepValue,
        minMaxField,
        // minField,
        // maxField,
        stepField,
        descriptionField,
        // elevationField,
        colorsCombo,
        layerCombo,
        onLayerComboSelect,
        timeCombo,
        onTimeComboExpand,
        reset,
        setGui,
        getView,
        panel;

    // Store for combo with supported Earth Engine layers
    layerStore = Ext.create('Ext.data.Store', {
        fields: ['key', 'name', 'min', 'max', 'maxValue', 'steps', 'colors', 'description'],
        data: [{
            key: 'elevation_srtm_30m',
            name: 'Elevation',
            min: 0,
            max: 1500,
            maxValue: Number.MAX_VALUE,
            steps: 5,
            colors: 'YlOrBr',
            description: 'Metres above sea level.'
        },/*{
            key: 'worldpop_2015_un',
            name: 'Population density 2015',
            min: 0,
            max: 100,
            steps: 5,
            colors: 'YlOrBr',
            description: 'Population in 100 x 100 m grid cells.'
        },*/{
            key: 'worldpop_2010_un',
            name: 'Population density 2010',
            min: 0,
            max: 10,
            maxValue: Number.MAX_VALUE,
            steps: 5,
            colors: 'YlOrBr',
            description: 'Population in 100 x 100 m grid cells.'
        },{
            key: 'nightlights_2013',
            name: 'Nighttime lights 2013',
            min: 0,
            max: 63,
            maxValue: 63,
            steps: 6,
            colors: 'YlOrBr',
            description: 'Light intensity from cities, towns, and other sites with persistent lighting, including gas flares.'
        },{
            key: 'precipitation',
            name: 'Precipitation',
            min: 0,
            max: 100,
            maxValue: 100,
            steps: 6,
            colors: 'Blues',
            description: 'Precipitation description'
        }]
    });

    timeStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [{
            id: 'latest',
            name: 'Latest' // TODO: i18n
        }]
    });

    minValue = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 93,
        style: 'margin-right:2px',
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
        width: 93,
        allowDecimals: false,
        //minValue: 1,
        //maxValue: 8848,
        value: 2500
    });

    stepValue = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 93,
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

    descriptionField = Ext.create('Ext.container.Container', {
        hidden: true,
        style: 'padding:10px; color:#444'
    });

    minMaxField = Ext.create('Ext.container.Container', {
        layout: 'hbox',
        hidden: true,
        style: 'padding:5px 0 0 5px;',
        items: [{
            xtype: 'container',
            html: 'Min / max value:', // TODO: i18n
            width: gis.conf.layout.widget.itemlabel_width,
            style: 'padding-top:5px;font-size:11px;'
        }, minValue, maxValue]
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

        var paletteString = record.get('palette');
        
        if (paletteString) {
            colorsCombo.show().setValue(colorsCombo.paletteIdMap[paletteString]);
        }
        else {
            colorsCombo.show().setValue(record.get('colors'));
        }

        descriptionField.show();
        descriptionField.update(record.get('description'));

        timeCombo.show();

        minMaxField.show();
        minValue.setValue(record.get('min'));
        maxValue.setMaxValue(record.get('maxValue'));
        maxValue.setValue(record.get('max'));
        
        stepField.show();
        stepValue.setValue(record.get('steps'));
    };

    // Combo with with supported Earth Engine layers
    layerCombo = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        // fieldLabel: GIS.i18n.select_layer_from_google_earth_engine,
        fieldLabel: 'Select dataset', // TODO: i18n
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

    onTimeComboExpand = function() {
        console.log('load list first time', layer);

        Ext.Ajax.request({
            url: gis.init.contextPath + '/api/tokens/google',
            disableCaching: false,
            failure: function(r) {
                gis.alert(r);
            },
            success: function(r) {
                var token = JSON.parse(r.responseText);
                ee.data.setAuthToken(token.client_id, 'Bearer', token.access_token, token.expires_in, null, null, false);

                var collection = ee.ImageCollection('UCSB-CHG/CHIRPS/PENTAD').sort('system:time_start', false);

                collection.getInfo(function(data) {
                    var list = data.features.map(feature => {
                        return {
                            id: feature.properties['system:index'],
                            name: feature.properties['system:index'],
                        };
                    });

                    console.log('list', list);

                    // Add to time store
                    timeStore.loadData(list, true);

                });
            }
        });
    };

    // Combo with with supported Earth Engine layers
    timeCombo = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: 'Select period', // TODO: i18n
        hidden: true,
        editable: false,
        valueField: 'key',
        displayField: 'name',
        queryMode: 'local',
        mode: 'local',
        forceSelection: true,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width,
        store: timeStore,
        listeners: {
            expand: onTimeComboExpand
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
        var config = view.config;
        var record = layerStore.getAt(layerStore.findExact('key', config.key));

        if (!record) {
            alert('Invalid Earth Engine dataset id'); // TODO: i18n
        }
        
        record.set('min', config.params.min);
        record.set('max', config.params.max);
        record.set('palette', config.params.palette);
        record.set('steps', config.params.palette.split(',').length - 1);

        layerCombo.setValue(config.key);
        onLayerComboSelect(layerCombo, [record]);
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
        bodyStyle: 'border:0;padding:5px 1px;',
        items: [layerCombo, descriptionField, timeCombo, minMaxField, colorsCombo, stepField],
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
