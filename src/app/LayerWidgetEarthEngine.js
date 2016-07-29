import isFunction from 'd2-utilizr/lib/isFunction';

export default function LayerWidgetEarthEngine(gis, layer) {

    // Supported Earth Engine datasets
    const datasets = {

        'USGS/SRTMGL1_003': {
            id: 'USGS/SRTMGL1_003',
            name: 'Elevation',
            description: 'Metres above sea level.',
            min: 0,
            max: 1500,
            maxValue: Number.MAX_VALUE,
            steps: 5,
            colors: 'YlOrBr',
        },

        'WorldPop/POP': { // Population density
            id: 'WorldPop/POP',
            name: 'Population density',
            description: 'Population in 100 x 100 m grid cells.',
            min: 0,
            max: 10,
            maxValue: Number.MAX_VALUE,
            steps: 5,
            colors: 'YlOrBr',
            filter(year) {
                return [{
                    type: 'eq',
                    arguments: ['UNadj', 'yes'],
                }, {
                    type: 'eq',
                    arguments: ['year', year],
                }];
            },
            collection(callback) { // Returns available years
                const collection = ee.ImageCollection(this.id)
                    .filterMetadata('UNadj', 'equals', 'yes')
                    .distinct('year')
                    .sort('year', false);

                // TODO: More effective way to get this info?
                collection.getInfo(data => {
                    callback(data.features.map(feature => {
                        return {
                            id: feature.properties['year'],
                            name: feature.properties['year'],
                        };
                    }));
                });
            },
        },

        'NOAA/DMSP-OLS/NIGHTTIME_LIGHTS': {
            id: 'NOAA/DMSP-OLS/NIGHTTIME_LIGHTS',
            name: 'Nighttime lights',
            description: 'Light intensity from cities, towns, and other sites with persistent lighting, including gas flares.',
            min: 0,
            max: 63,
            maxValue: 63,
            steps: 6,
            colors: 'YlOrBr',
            filter(index) {
                return [{
                    type: 'eq',
                    arguments: ['system:index', index],
                }];
            },
            collection(callback) { // Returns available times
                const collection = ee.ImageCollection(this.id)
                    .distinct('system:time_start') // TODO: Why two images for some years?
                    .sort('system:time_start', false);

                // TODO: More effective way to get this info?
                collection.getInfo(data => {
                    callback(data.features.map(feature => {
                        return {
                            id: feature.properties['system:index'],
                            name: new Date(feature.properties['system:time_start']).getFullYear(),
                        };
                    }));
                });
            },
        },

        'UCSB-CHG/CHIRPS/PENTAD': {
            id: 'UCSB-CHG/CHIRPS/PENTAD',
            name: 'Precipitation',
            min: 0,
            max: 100,
            maxValue: 100,
            steps: 6,
            colors: 'Blues',
            description: 'Precipitation description',
            collection: function(callback) {
                const collection = ee.ImageCollection(this.get('id')).distinct('year').sort('year', false);

                collection.getInfo(data => {
                    callback(data.features.map(feature => {
                        return {
                            id: feature.properties['year'],
                            name: feature.properties['year']
                        };
                    }));
                });

                //collection = collection.distinct('year');

                //console.log('get collection!', this.get('id'));

                //console.log('population', collection.getInfo());

                // distinct('year')


                /*
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
                 */


                callback([]);
            }
        },
    };

    // TODO: genereate from above
    // Store for combo with supported Earth Engine layers
    const layerStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [{
            id: 'USGS/SRTMGL1_003',
            name: 'Elevation',
        },{
            id: 'WorldPop/POP',
            name: 'Population density',
        },{
            id: 'NOAA/DMSP-OLS/NIGHTTIME_LIGHTS',
            name: 'Nighttime lights',
        },{
            id: 'UCSB-CHG/CHIRPS/PENTAD',
            name: 'Precipitation',
        }],
    });

    const collectionStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [{
            id: 'latest',
            name: 'Latest' // TODO: i18n
        }]
    });

    const minValue = Ext.create('Ext.form.field.Number', {
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

    const maxValue = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 93,
        allowDecimals: false,
        //minValue: 1,
        //maxValue: 8848,
        value: 2500
    });

    const stepValue = Ext.create('Ext.form.field.Number', {
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

    const descriptionField = Ext.create('Ext.container.Container', {
        hidden: true,
        style: 'padding:10px; color:#444'
    });

    const minMaxField = Ext.create('Ext.container.Container', {
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

    const stepField = Ext.create('Ext.container.Container', {
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

    // Show form fields used by the selected EE dataset
    const onDatasetComboSelect = function(combo) {
        const dataset = datasets[combo.getValue()];

        // record = record[0];

        //console.log(dataset);

        /*
        var paletteString = record.get('palette');
        
        if (paletteString) {
            colorsCombo.show().setValue(colorsCombo.paletteIdMap[paletteString]);
        }
        else {
            colorsCombo.show().setValue(record.get('colors'));
        }
        */

        // TODO: What happens if favorite is loaded?
        colorsCombo.show().setValue(dataset.colors);

        descriptionField.show();
        descriptionField.update(dataset.description);

        if (dataset.collection) {
            collectionCombo.show(); // TODO: Reset
        } else {
            collectionCombo.hide();
        }

        minMaxField.show();
        minValue.setValue(dataset.min);
        maxValue.setMaxValue(dataset.maxValue);
        maxValue.setValue(dataset.max);
        
        stepField.show();
        stepValue.setValue(dataset.steps);
    };

    // Combo with with supported Earth Engine layers
    const datasetCombo = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        // fieldLabel: GIS.i18n.select_layer_from_google_earth_engine,
        fieldLabel: 'Select dataset', // TODO: i18n
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width,
        store: layerStore,
        listeners: {
            select: onDatasetComboSelect
        }
    });

    // Load collection items first time combo is expanded
    const onCollectionComboExpand = function() {
        const dataset = datasets[datasetCombo.getValue()];

        if (isFunction(dataset.collection)) {
            //console.log('load');
            Ext.Ajax.request({
                url: gis.init.contextPath + '/api/tokens/google',
                disableCaching: false,
                failure: error => gis.alert(error),
                success: response => {
                    const token = JSON.parse(response.responseText);

                    ee.data.setAuthToken(token.client_id, 'Bearer', token.access_token, token.expires_in, null, null, false);
                    ee.initialize();

                    // TODO: Add loading indicator
                    dataset.collection(list => {
                        collectionStore.loadData(list);
                        dataset.collection = list;
                    });
                }
            });
        } else {
            collectionStore.loadData(dataset.collection);
        }
    };

    // Combo with with supported Earth Engine layers
    const collectionCombo = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: 'Select period', // TODO: i18n
        hidden: true,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width,
        store: collectionStore,
        listeners: {
            expand: onCollectionComboExpand
        }
    });

    const colorsCombo = Ext.create('Ext.ux.field.ColorScale', {
        fieldLabel: 'Color scale',
        hidden: true,
        value: 'YlOrBr',
        classes: 6,
        style: 'padding-top:5px;',
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width
    });

    // Reset this widget
    const reset = function() {
        layer.item.setValue(false);

        if (!layer.window.isRendered) {
            layer.view = null;
            return;
        }

        datasetCombo.reset();
    };

    // TODO
    // Poulate the widget from a view (favorite)
    const setGui = function(view) {
        var config = view.config;
        var record = layerStore.getAt(layerStore.findExact('id', config.id));

        if (!record) {
            alert('Invalid Earth Engine dataset id'); // TODO: i18n
        }
        
        record.set('min', config.params.min);
        record.set('max', config.params.max);
        record.set('palette', config.params.palette);
        record.set('steps', config.params.palette.split(',').length - 1);

        datasetCombo.setValue(config.id);
        onLayerComboSelect(datasetCombo, [record]);
    };

    // Get the view representation of the layer
    const getView = function() {
        const id = datasetCombo.getValue();
        const dataset = datasets[id];
        const image = collectionCombo.getValue();

        if (id === null) {
            return;
        }

        const view = {
            config: { // Config object saved stored as one field
                //id: id,
                id: dataset.id,
                params: {
                    palette: colorsCombo.getValue().join(','),
                    min: minValue.getValue(),
                    max: maxValue.getValue()
                }
            }
        };

        if (image) {
            view.config.filter = dataset.filter(image);
        }

        return view;
    };

    // Return widget panel
    return Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border:0;padding:5px 1px;',
        items: [datasetCombo, descriptionField, collectionCombo, minMaxField, colorsCombo, stepField],
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

};
