import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';
import arrayClean from 'd2-utilizr/lib/arrayClean';
import arrayDifference from 'd2-utilizr/lib/arrayDifference';
import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import arraySort from 'd2-utilizr/lib/arraySort';

export default function LayerHandlerThematic(gis, layer) {

    // Load organisation units
    const loadOrganisationUnits = function (view) {
        const items = view.rows[0].items;
        const propertyMap = {
            'name': 'name',
            'displayName': 'name',
            'shortName': 'shortName',
            'displayShortName': 'shortName'
        };
        const keyAnalysisDisplayProperty = gis.init.userAccount.settings.keyAnalysisDisplayProperty;
        const displayProperty = propertyMap[keyAnalysisDisplayProperty] || propertyMap[view.displayProperty] || 'name';
        const url = function () {
            let params = '?ou=ou:' + items.map(item => item.id).join(';');

            params += '&displayProperty=' + displayProperty.toUpperCase();

            if (isArray(view.userOrgUnit) && view.userOrgUnit.length) {
                params += '&userOrgUnit=' + view.userOrgUnit.join(';');
            }

            return gis.init.apiPath + 'geoFeatures.json' + params;
        }();

        const success = function (r) {
            const features = gis.util.geojson.decode(r, 'ASC');

            if (!features.length) {
                gis.alert(GIS.i18n.no_valid_coordinates_found);
                return;
            }

            layer.featureStore.loadFeatures(features.slice(0));
            layer.features = features;

            loadData(view, features);
        };

        Ext.Ajax.request({
            url: encodeURI(url),
            disableCaching: false,
            success (r) {
                success(JSON.parse(r.responseText));
            },
            failure() {
                gis.alert(GIS.i18n.coordinates_could_not_be_loaded);
            }
        });
    };

    // Load data
    const loadData = function (view, features) {
        view = view || layer.view;
        features = features || layer.featureStore.features;

        const dimConf = gis.conf.finals.dimension;
        const dxItems = view.columns[0].items;
        const isOperand = view.columns[0].dimension === dimConf.operand.objectName;
        const peItems = view.filters[0].items;
        const ouItems = view.rows[0].items;
        const propertyMap = {
            'name': 'name',
            'displayName': 'name',
            'shortName': 'shortName',
            'displayShortName': 'shortName'
        };
        const keyAnalysisDisplayProperty = gis.init.userAccount.settings.keyAnalysisDisplayProperty;
        const displayProperty = propertyMap[keyAnalysisDisplayProperty] || propertyMap[view.displayProperty] || 'name';

        // ou
        let paramString = '?dimension=ou:' + ouItems.map(item => item.id).join(';');

        // dx
        paramString += '&dimension=dx:' + dxItems.map(item => isOperand ? item.id.split('.')[0] : item.id).join(';');

        if (view.valueType === 'ds') {
            paramString += '.REPORTING_RATE';
        }

        paramString += isOperand ? '&dimension=co' : '';

        // pe
        paramString += '&filter=pe:' + peItems.map(item => item.id).join(';');

        // display property
        paramString += '&displayProperty=' + displayProperty.toUpperCase();

        if (isArray(view.userOrgUnit) && view.userOrgUnit.length) {
            paramString += '&userOrgUnit=' + view.userOrgUnit.join(';');
        }

        // relative period date
        if (view.relativePeriodDate) {
            paramString += '&relativePeriodDate=' + view.relativePeriodDate;
        }

        if (view.aggregationType) {
            paramString += '&aggregationType=' + view.aggregationType;
        }

        const success = function (json) {
            const response = gis.api.response.Response(json); // validate
            const featureMap = {};
            const valueMap = {};
            const valueFeatures = []; // only include features with values
            const values = []; // to find min and max values

            let ouIndex;
            let valueIndex;

            if (!response) {
                if (gis.mask) {
                    gis.mask.hide();
                }
                return;
            }

            // ou index, value index
            for (let i = 0; i < response.headers.length; i++) {
                if (response.headers[i].name === dimConf.organisationUnit.dimensionName) {
                    ouIndex = i;
                }
                else if (response.headers[i].name === dimConf.value.dimensionName) {
                    valueIndex = i;
                }
            }

            // Feature map
            features.forEach(feature => {
                featureMap[feature.id] = true;
            });

            // Value map
            response.rows.forEach(row => {
                valueMap[row[ouIndex]] = parseFloat(row[valueIndex]);
            });

            features.forEach(feature => {
                const id = feature.id;

                if (featureMap.hasOwnProperty(id) && valueMap.hasOwnProperty(id)) {
                    feature.properties.value = valueMap[id];
                    valueFeatures.push(feature);
                    values.push(valueMap[id]);
                }
            });

            // Sort values in ascending order
            values.sort(function (a, b) {
                return a - b;
            });

            // TODO: Temporarily
            gis.data = {
                metaData: response.metaData,
                features: valueFeatures,
                values: values
            };

            gis.response = response;

            loadLegend(view);
        };

        Ext.Ajax.request({
            url: encodeURI(gis.init.apiPath + 'analytics.json' + paramString),
            disableCaching: false,
            failure(r) {
                gis.alert(r);
            },
            success(r) {
                success(JSON.parse(r.responseText));
            }
        });
    };

    const loadLegend = function (view, metaData, features, values) {
        view = view || layer.view;
        metaData = metaData || gis.data.metaData;
        features = features || gis.data.features;
        values = values || gis.data.values;

        const dimConf = gis.conf.finals.dimension;
        const bounds = [];
        const colors = [];
        const names = [];
        const count = {}; // number in each class

        let legends = [];

        const addNames = function(response) {

            // All dimensions
            const dimensions = arrayClean([].concat(view.columns || [], view.rows || [], view.filters || []));
            const metaData = response.metaData;
            const peIds = metaData[dimConf.period.objectName];

            for (let i = 0, dimension; i < dimensions.length; i++) {
                dimension = dimensions[i];

                for (let j = 0, item; j < dimension.items.length; j++) {
                    item = dimension.items[j];
                    item.name = metaData.names[item.id];
                }
            }

            // Period name without changing the id
            view.filters[0].items[0].name = metaData.names[peIds[peIds.length - 1]];
        };

        const fn = function () {
            addNames(gis.response);

            const options = { // Classification options
                indicator: gis.conf.finals.widget.value,
                method: view.method,
                numClasses: view.classes,
                bounds: bounds,
                colors:  view.colorScale ? view.colorScale.split(',') : colors,
                count: count,
                minSize: view.radiusLow,
                maxSize: view.radiusHigh,
                minValue: values[0],
                maxValue: values[values.length - 1],
                colorLow: view.colorLow,
                colorHigh: view.colorHigh
            };

            layer.view = view;
            layer.minValue = options.minValue;
            layer.maxValue = options.maxValue;

            applyClassification(options, features, values);
            updateLegend(view, metaData, options);
            updateMap(view, features);
            afterLoad(view);
        };

        const loadLegendSet = function (view) {
            Ext.Ajax.request({
                url: encodeURI(gis.init.apiPath + 'legendSets/' + view.legendSet.id + '.json?fields=' + gis.conf.url.legendSetFields.join(',')),
                scope: this,
                disableCaching: false,
                success: function (r) {
                    legends = JSON.parse(r.responseText).legends;

                    arraySort(legends, 'ASC', 'startValue');

                    for (let i = 0; i < legends.length; i++) {
                        if (bounds[bounds.length - 1] !== legends[i].startValue) {
                            if (bounds.length !== 0) {
                                colors.push('#F0F0F0');
                                names.push('');
                            }
                            bounds.push(legends[i].startValue);
                        }
                        colors.push(legends[i].color);
                        names.push(legends[i].name);
                        bounds.push(legends[i].endValue);
                    }

                    view.legendSet.names = names;
                    view.legendSet.bounds = bounds;
                    view.legendSet.colors = colors;
                    view.legendSet.count = count;
                },
                callback: function () {
                    fn();
                }
            });
        };

        if (view.legendSet) {
            view.method = 1; // Predefined legend
            loadLegendSet(view);
        }
        else {
            const elementMap = {
                'in': 'indicators',
                'de': 'dataElements',
                'ds': 'dataSets'
            };
            const elementUrl = elementMap[view.columns[0].objectName];
            const id = view.columns[0].items[0].id;

            if (!elementUrl) {
                fn();
                return;
            }

            Ext.Ajax.request({
                url: encodeURI(gis.init.apiPath + '' + elementUrl + '.json?fields=legendSet[id,displayName|rename(name)]&paging=false&filter=id:eq:' + id),
                success: function (r) {
                    const elements = JSON.parse(r.responseText)[elementUrl];
                    let set;

                    if (arrayFrom(elements).length) {
                        set = isObject(elements[0]) ? elements[0].legendSet || null : null;
                    }

                    if (set) {
                        view.legendSet = set;
                        loadLegendSet(view);
                    }
                    else {
                        fn();
                    }
                },
                failure: function () {
                    fn();
                }
            });
        }
    };

    // Calculate bounds and assign color to features based on value
    const applyClassification = function (options, features, values) {
        const method = options.method;
        let bounds = [];
        let colors = [];

        if (method === 1) { // predefined bounds
            bounds = options.bounds;
            colors = options.colors;

        } else if (method === 2) { // equal intervals
            for (let i = 0; i <= options.numClasses; i++) {
                bounds[i] = options.minValue + i * (options.maxValue - options.minValue) / options.numClasses;
            }
            options.bounds = bounds;

            if (!options.colors.length) { // Backward compability
                options.colors = getColorsByRgbInterpolation(options.colorLow, options.colorHigh, options.numClasses);
            }

        } else if (method === 3) { // quantiles
            const binSize = Math.round(values.length / options.numClasses);
            let binLastValPos = (binSize === 0) ? 0 : binSize;

            if (values.length > 0) {
                bounds[0] = values[0];
                for (let i = 1; i < options.numClasses; i++) {
                    bounds[i] = values[binLastValPos];
                    binLastValPos += binSize;

                    if (binLastValPos > values.length - 1) {
                        binLastValPos = values.length - 1;
                    }
                }
                bounds.push(values[values.length - 1]);
            }

            for (let j = 0; j < bounds.length; j++) {
                bounds[j] = parseFloat(bounds[j]);
            }

            options.bounds = bounds;

            if (!options.colors.length) { // Backward compability
                options.colors = getColorsByRgbInterpolation(options.colorLow, options.colorHigh, options.numClasses);
            }
        }

        if (bounds.length) {
            for (let i = 0, prop, value, classNumber; i < features.length; i++) {
                prop = features[i].properties;
                value = prop[options.indicator];
                classNumber = getClass(value, bounds);
                prop.color = options.colors[classNumber - 1];
                prop.radius = (value - options.minValue) / (options.maxValue - options.minValue) * (options.maxSize - options.minSize) + options.minSize;

                // Count features in each class
                if (!options.count[classNumber]) {
                    options.count[classNumber] = 1;
                } else {
                    options.count[classNumber]++;
                }
            }
        }
    };

    // Returns class number
    const getClass = function (value, bounds) {
        if (value >= bounds[0]) {
            for (let i = 1; i < bounds.length; i++) {
                if (value < bounds[i]) {
                    return i;
                }
            }
            if (value === bounds[bounds.length - 1]) {
                return bounds.length - 1;
            }
        }

        return null;
    };

    const getColorsByRgbInterpolation = function (firstColor, lastColor, nbColors) {
        const colors = [];
        const colorA = hexToRgb('#' + firstColor);
        const colorB = hexToRgb('#' + lastColor);

        if (nbColors == 1) {
            return ['#' + firstColor];
        }
        for (let i = 0; i < nbColors; i++) {
            colors.push(rgbToHex({
                r: parseInt(colorA.r + i * (colorB.r - colorA.r) / (nbColors - 1)),
                g: parseInt(colorA.g + i * (colorB.g - colorA.g) / (nbColors - 1)),
                b: parseInt(colorA.b + i * (colorB.b - colorA.b) / (nbColors - 1)),
            }));
        }
        return colors;
    };

    // Convert hex color to RGB
    const hexToRgb = function (hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    // Convert RGB color to hex
    const rgbToHex = function (rgb) {
        return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
    };

    // Add layer to map
    const updateMap = function (view, features) {
        const layerConfig = Ext.applyIf({
            data: features,
            hoverLabel: '{name} ({value})'
        }, layer.config);

        if (view.labels) {
            Ext.apply(layerConfig, {
                label: '{name}',
                labelStyle: {
                    fontSize: view.labelFontSize,
                    fontStyle: view.labelFontStyle
                }
            });
        }

        // Remove layer instance if already exist
        if (layer.instance && gis.instance.hasLayer(layer.instance)) {
            gis.instance.removeLayer(layer.instance);
        }

        layer.instance = gis.instance.addLayer(layerConfig);

        layer.instance.on('click', onFeatureClick);
        layer.instance.on('contextmenu', onFeatureRightClick);

        layer.view = view;
    };

    const onFeatureClick = function (evt) {

        // TODO: optimize!
        const view = layer.view;
        const indicator = view.columns[0].items[0].name;
        const period = view.filters[0].items[0].name;
        const name = evt.layer.feature.properties.name;
        const value = evt.layer.feature.properties.value;
        const unit = '';
        const content = '<strong style="font-weight:bold;">' + name + '</strong><br>' + indicator + '<br>' + period + ': ' + value + ' ' + unit;

        L.popup()
            .setLatLng(evt.latlng)
            .setContent(content)
            .openOn(gis.instance);

        GIS.core.FeaturePopup(gis, evt.layer); // TODO: Remove
    };

    const onFeatureRightClick = function (evt) {
        L.DomEvent.stopPropagation(evt); // Don't propagate to map right-click
        const contextMenu = GIS.core.ContextMenu(gis, layer, evt.layer, evt.latlng);
        contextMenu.showAt([evt.originalEvent.x, evt.originalEvent.pageY || evt.originalEvent.y]);
    };

    const updateLegend = function (view, metaData, options) {
        const bounds = options.bounds;
        const colors = options.colors;
        const legendNames = view.legendSet ? view.legendSet.names || {} : {};

        // title
        let id = view.columns[0].items[0].id;

        // event data items
        if (view.valueType === 'di') {
            id = view.program.id + '.' + id;
        }

        let name = view.columns[0].items[0].name;
        let html = '<div class="dhis2-legend"><h2>' + (metaData.names[id] || name || id);

        // period
        id = view.filters[0].items[0].id;
        name = view.filters[0].items[0].name;
        html += ' <span>' + (metaData.names[id] || name || id) + '</span></h2>';

        // color legend
        if (view.method === 1 && view.legendSet) {
            html += '<dl class="dhis2-legend-predefined">';

            for (let i = 0, name, label; i < bounds.length - 1; i++) {
                name = legendNames[i];
                label = bounds[i] + ' - ' + bounds[i + 1] + ' (' + (options.count[i + 1] || 0) + ')';
                html += '<dt style="background-color:' + colors[i] + ';"></dt>';
                html += '<dd><strong>' + (name || '') + '</strong>' + label + '</dd>';
            }
        }
        else {
            html += '<dl class="dhis2-legend-automatic">';

            for (let i = 0, label; i < bounds.length - 1; i++) {
                label = bounds[i].toFixed(1) + ' - ' + bounds[i + 1].toFixed(1) + ' (' + (options.count[i + 1] || 0) + ')';
                html += '<dt style="background-color:' + colors[i] + ';"></dt>';
                html += '<dd>' + label + '</dd>';
            }
        }

        html += '</dl></div>';

        if (layer.legendPanel) {
            layer.legendPanel.update(html);
        } else { // Dashboard map
            if (!gis.legend) {
                gis.legend = gis.instance.addControl({
                    type: 'legend',
                    offset: [0, -64],
                    content: html
                });
            } else {
                gis.legend.setContent(gis.legend.getContent() + html);
            }
        }
    };

    const afterLoad = function(view) {

        // Legend
        if (gis.viewport) {
            gis.viewport.eastRegion.doLayout();
        }

        if (layer.legendPanel) {
            layer.legendPanel.expand();
        }

        // Layer
        layer.instance.setOpacity(view.opacity);

        if (layer.item) {
            layer.item.setValue(true);
        }

        // Filter
        if (layer.filterWindow && layer.filterWindow.isVisible()) {
            layer.filterWindow.filter();
        }

        // Gui
        if (loader.updateGui && isObject(layer.widget)) {
            layer.widget.setGui(view, loader.isDrillDown);
        }

        // Zoom
        if (loader.zoomToVisibleExtent) {
            gis.instance.fitBounds(layer.instance.getBounds());
        }

        // Mask
        if (loader.hideMask && gis.mask) {
            gis.mask.hide();
        }

        // Map callback
        if (loader.callBack) {
            loader.callBack(layer);
        }
        else {
            gis.map = null;
            if (gis.viewport && gis.viewport.shareButton) {
                gis.viewport.shareButton.enable();
            }
        }

        // session storage
        if (GIS.isSessionStorage) {
            gis.util.layout.setSessionStorage('map', gis.util.layout.getAnalytical());
        }
    };

    const loader = {
        updateGui: false,
        zoomToVisibleExtent: false,
        hideMask: false,
        callBack: null,
        isDrillDown: false,
        load: function(view) {
            if (gis.mask && !gis.skipMask) {
                gis.mask.show();
            }

            loadOrganisationUnits(view);
        },
        loadData: loadData,
        loadLegend: loadLegend
    };

    return loader;
};
