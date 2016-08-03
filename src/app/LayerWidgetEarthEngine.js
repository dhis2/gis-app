import isArray from 'd2-utilizr/lib/isArray';
import isFunction from 'd2-utilizr/lib/isFunction';
import {timeFormat} from 'd3-time-format';

export default function LayerWidgetEarthEngine(gis, layer) {

    // Supported Earth Engine datasets
    const datasets = {

        'USGS/SRTMGL1_003': {
            id: 'USGS/SRTMGL1_003',
            name: 'Elevation',
            description: '',
            valueLabel: 'Min/max elevation',
            min: 0,
            max: 1500,
            minValue: 0,
            maxValue: 8848,
            steps: 5,
            colors: 'YlOrBr',
        },

        'WorldPop/POP': { // Population density
            id: 'WorldPop/POP',
            name: 'Population density',
            description: 'Try a different year if you don\'t see data for your country.',
            imageLabel: 'Select year', // TODO: i18n
            valueLabel: 'Min/max people',
            min: 0,
            max: 1000,
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            steps: 5,
            colors: 'YlOrBr',
            filter(year) {
                return [{
                    type: 'eq',
                    arguments: ['year', year],
                }, {
                    type: 'eq',
                    arguments: ['UNadj', 'yes'],
                }];
            },
            collection(callback) { // Returns available years
                const imageCollection = ee.ImageCollection(this.id)
                    .filterMetadata('UNadj', 'equals', 'yes')
                    .distinct('year')
                    .sort('year', false);

                const featureCollection = ee.FeatureCollection(imageCollection)
                    .select(['year'], null, false);

                featureCollection.getInfo(data => {
                    callback(data.features.map(feature => ({
                        id: feature.properties['year'],
                        name: feature.properties['year'],
                    })));
                });
            },
        },

        'NOAA/DMSP-OLS/NIGHTTIME_LIGHTS': {
            id: 'NOAA/DMSP-OLS/NIGHTTIME_LIGHTS',
            name: 'Nighttime lights',
            description: 'Light intensity from cities, towns, and other sites with persistent lighting, including gas flares.',
            imageLabel: 'Select year', // TODO: i18n
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
                const imageCollection = ee.ImageCollection(this.id)
                    .distinct('system:time_start') // TODO: Why two images for some years?
                    .sort('system:time_start', false);

                const featureCollection = ee.FeatureCollection(imageCollection)
                    .select(['system:time_start'], null, false);

                featureCollection.getInfo(data => {
                    callback(data.features.map(feature => ({
                        id: feature.id,
                        name: new Date(feature.properties['system:time_start']).getFullYear(),
                    })));
                });
            },
        },

        'UCSB-CHG/CHIRPS/PENTAD': {
            id: 'UCSB-CHG/CHIRPS/PENTAD',
            name: 'Precipitation',
            description: 'Rainfall within a five day period.',
            valueLabel: 'Min/max rainfall',
            min: 0,
            max: 100,
            minValue: 0,
            maxValue: 100,
            steps: 6,
            colors: 'Blues',
            filter(index) {
                return [{
                    type: 'eq',
                    arguments: ['system:index', index],
                }];
            },
            collection: function(callback) {
                const imageCollection = ee.ImageCollection(this.id)
                    .sort('system:time_start', false);

                const featureCollection = ee.FeatureCollection(imageCollection)
                    .select(['system:time_start', 'system:time_end'], null, false);

                featureCollection.getInfo(data => {
                    callback(data.features.map(feature => ({
                        id: feature.id,
                        name: timeFormat('%-d – ')(feature.properties['system:time_start']) + timeFormat('%-d %b %Y')(feature.properties['system:time_end'] - 7200001), // Minus 2 hrs to end the day before
                    })));
                });
            }
        },

        'MODIS/MOD11A2': {
            id: 'MODIS/MOD11A2',
            name: 'Temperature',
            valueLabel: 'Min/max °C',
            min: 0,
            max: 50,
            minValue: -100,
            maxValue: 100,
            steps: 6,
            colors: 'Reds',
            description: 'Temperature description',
            filter(index) {
                return [{
                    type: 'eq',
                    arguments: ['system:index', index],
                }];
            },
            collection(callback) {
                const imageCollection = ee.ImageCollection(this.id)
                    .sort('system:time_start', false);

                const featureCollection = ee.FeatureCollection(imageCollection)
                    .select(['system:time_start', 'system:time_end'], null, false);

                featureCollection.getInfo(data => {
                    callback(data.features.map(feature => ({
                        id: feature.id,
                        name: timeFormat('%-d %b – ')(feature.properties['system:time_start']) + timeFormat('%-d %b %Y')(feature.properties['system:time_end'] - 7200001), // Minus 2 hrs to end the day before
                    })));
                });
            }
        },

        'MODIS/051/MCD12Q1': {
            id: 'MODIS/051/MCD12Q1',
            name: 'Landcover',
            imageLabel: 'Select year', // TODO: i18n
            filter(index) {
                return [{
                    type: 'eq',
                    arguments: ['system:index', index],
                }];
            },
            collection(callback) {
                const imageCollection = ee.ImageCollection(this.id)
                    .sort('system:time_start', false);

                const featureCollection = ee.FeatureCollection(imageCollection)
                    .select(['system:time_start', 'system:time_end'], null, false);

                featureCollection.getInfo(data => {
                    callback(data.features.map(feature => ({
                        id: feature.id,
                        name: new Date(feature.properties['system:time_start']).getFullYear(),
                    })));
                });
            }
        },

    };

    const minValue = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 93,
        style: 'margin-right:2px',
        allowDecimals: false,
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

    const minMaxLabel = Ext.create('Ext.container.Container', {
        html: 'Min / max value:', // TODO: i18n
        width: gis.conf.layout.widget.itemlabel_width,
        style: 'padding-top:5px;font-size:11px;'
    });

    const minMaxField = Ext.create('Ext.container.Container', {
        layout: 'hbox',
        hidden: true,
        style: 'padding:5px 0 0 5px;',
        items: [minMaxLabel, minValue, maxValue]
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
    const onDatasetSelect = function(combo) {
        const dataset = datasets[combo.getValue()];

        descriptionField.show();
        descriptionField.update(dataset.description);

        collectionCombo.clearValue();

        if (dataset.collection) {
            collectionCombo.show();
            collectionCombo.labelEl.update((dataset.imageLabel || 'Select period') + ':');
        } else {
            collectionCombo.hide();
        }

        if (dataset.min !== undefined) {
            minMaxField.show();
            minMaxLabel.update((dataset.valueLabel || 'Min/max value') + ':');
            minValue.setMinValue(dataset.minValue);
            minValue.setValue(dataset.min);
            maxValue.setMaxValue(dataset.maxValue);
            maxValue.setValue(dataset.max);

            stepField.show();
            stepValue.setValue(dataset.steps);

            colorsCombo.show().setValue(dataset.colors);
        } else {
            minMaxField.hide();
            stepField.hide();
            colorsCombo.hide();
        }
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
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: Object.keys(datasets).map(id => datasets[id]),
        }),
        listeners: {
            select: onDatasetSelect
        }
    });

    const loadCollection = function(id, callback) {
        const dataset = datasets[id];

        if (isFunction(dataset.collection)) { // Load image collection from EE

            collectionCombo.store.removeAll(); // Clear combo
            collectionCombo.setLoading(true); // Add loading mask

            // Fetch EE token - TODO: cache?
            fetch(gis.init.contextPath + '/api/tokens/google', { headers: gis.init.defaultHeaders })
                .then(response => response.json())
                .then(token => {

                    // Set token
                    ee.data.setAuthToken(token.client_id, 'Bearer', token.access_token, token.expires_in, null, null, false);
                    ee.initialize();

                    dataset.collection(list => {
                        collectionCombo.store.loadData(list);
                        dataset.collection = list;
                        collectionCombo.setLoading(false);

                        if (callback) {
                            callback(dataset);
                        }
                    });
                })
                .catch(error => gis.alert(error));

        } else { // Image collection already loaded

            collectionCombo.store.loadData(dataset.collection);

            if (callback) {
                callback(dataset);
            }
        }
    }

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
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name']
        }),
        listeners: {
            expand() {
                loadCollection(datasetCombo.getValue());
            }
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

    // Poulate the widget from a view (favorite)
    const setGui = function(view) {
        if (typeof view.config === 'string') { // TODO: Why needed?
            view.config = JSON.parse(view.config);
        }

        const config = view.config;
        const dataset = datasets[config.id];
        const params = config.params;

        datasetCombo.setValue(config.id);

        descriptionField.show();
        descriptionField.update(dataset.description);

        if (dataset.collection) {
            loadCollection(config.id, () => {
                if (isArray(config.filter)) {
                    collectionCombo.setValue(config.filter[0].arguments[1]);
                }
            });
            collectionCombo.show();

            if (collectionCombo.labelEl) { // TODO
                collectionCombo.labelEl.update(dataset.label || 'Select period');
            }
        } else {
            collectionCombo.hide();
        }

        minMaxField.show();
        minValue.setValue(params.min);
        maxValue.setValue(params.max);

        colorsCombo.show().setValue(params.palette);

        stepField.show();
        stepValue.setValue(params.palette.split(',').length - (params.min === 0 ? 1 : 2));
    };

    // Get the view representation of the layer
    const getView = function() {
        const dataset = datasets[datasetCombo.getValue()];
        const image = collectionCombo.getValue();
        const view = {
            config: { // Config object saved stored as one field
                id: dataset.id,
            },
        };

        if (!dataset) {
            gis.alert('No dataset selected.'); // TODO: i18n
            return;
        }

        if (dataset.collection && !image) {
            gis.alert('No period selected.'); // TODO: i18n
            return
        } else if (image) {
            view.config.image = collectionCombo.findRecordByValue(image).get('name');
        }

        if (dataset.min !== undefined) { // If not fixed palette
            view.config.params = {
                palette: colorsCombo.getValue().join(','),
                min: minValue.getValue(),
                max: maxValue.getValue()
            };
        }

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
