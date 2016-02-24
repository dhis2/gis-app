//GIS.core.LayerHandlerThematic = function(gis, layer) {
export default function LayerHandlerThematic(gis, layer) {
    var compareView,
        loadOrganisationUnits,
        loadLegend,
        applyClassification,
        rgbToHex,
        hexToRgb,
        getClass,
        getColorsByRgbInterpolation,
        updateMap,
        updateLegend,
        loadData,
        afterLoad,
        onFeatureClick,
        onFeatureRightClick,
        loader,
        data = {};

    compareView = function (view, doExecute) {
        var src = layer.view,
            viewIds,
            viewDim,
            srcIds,
            srcDim;

        loader.zoomToVisibleExtent = true;

        if (!src) {
            if (doExecute) {
                loadOrganisationUnits(view);
            }
            return gis.conf.finals.widget.loadtype_organisationunit;
        }

        // organisation units
        viewIds = [];
        viewDim = view.rows[0];
        srcIds = [];
        srcDim = src.rows[0];

        if (viewDim.items.length === srcDim.items.length) {
            for (var i = 0; i < viewDim.items.length; i++) {
                viewIds.push(viewDim.items[i].id);
            }

            for (var i = 0; i < srcDim.items.length; i++) {
                srcIds.push(srcDim.items[i].id);
            }

            if (Ext.Array.difference(viewIds, srcIds).length !== 0) {
                if (doExecute) {
                    loadOrganisationUnits(view);
                }
                return gis.conf.finals.widget.loadtype_organisationunit;
            }
        }
        else {
            if (doExecute) {
                loadOrganisationUnits(view);
            }
            return gis.conf.finals.widget.loadtype_organisationunit;
        }

        // data
        loader.zoomToVisibleExtent = false;

        viewIds = [];
        viewDim = view.columns[0];
        srcIds = [];
        srcDim = src.columns[0];

        if (viewDim.items.length === srcDim.items.length) {
            for (var i = 0; i < viewDim.items.length; i++) {
                viewIds.push(viewDim.items[i].id);
            }

            for (var i = 0; i < srcDim.items.length; i++) {
                srcIds.push(srcDim.items[i].id);
            }

            if (Ext.Array.difference(viewIds, srcIds).length !== 0) {
                if (doExecute) {
                    loadData(view);
                }
                return gis.conf.finals.widget.loadtype_organisationunit;
            }
        }
        else {
            if (doExecute) {
                loadData(view);
            }
            return gis.conf.finals.widget.loadtype_organisationunit;
        }

        // period
        viewIds = [];
        viewDim = view.filters[0];
        srcIds = [];
        srcDim = src.filters[0];

        if (viewDim.items.length === srcDim.items.length) {
            for (var i = 0; i < viewDim.items.length; i++) {
                viewIds.push(viewDim.items[i].id);
            }

            for (var i = 0; i < srcDim.items.length; i++) {
                srcIds.push(srcDim.items[i].id);
            }

            if (Ext.Array.difference(viewIds, srcIds).length !== 0) {
                if (doExecute) {
                    loadData(view);
                }
                return gis.conf.finals.widget.loadtype_organisationunit;
            }
        }
        else {
            if (doExecute) {
                loadData(view);
            }
            return gis.conf.finals.widget.loadtype_organisationunit;
        }

        // if no changes - reload legend but do not zoom
        if (doExecute) {
            loader.zoomToVisibleExtent = false;
            loadLegend(view);
            return gis.conf.finals.widget.loadtype_legend;
        }

        gis.mask.hide();
    };

    loadOrganisationUnits = function (view) {
        var items = view.rows[0].items,
            propertyMap = {
                'name': 'name',
                'displayName': 'name',
                'shortName': 'shortName',
                'displayShortName': 'shortName'
            },
            keyAnalysisDisplayProperty = gis.init.userAccount.settings.keyAnalysisDisplayProperty,
            displayProperty = propertyMap[keyAnalysisDisplayProperty] || propertyMap[view.displayProperty] || 'name',
            url = function () {
                var params = '?ou=ou:';

                for (var i = 0; i < items.length; i++) {
                    params += items[i].id;
                    params += i !== items.length - 1 ? ';' : '';
                }

                params += '&displayProperty=' + displayProperty.toUpperCase();

                if (Ext.isArray(view.userOrgUnit) && view.userOrgUnit.length) {
                    params += '&userOrgUnit=';

                    for (var i = 0; i < view.userOrgUnit.length; i++) {
                        params += view.userOrgUnit[i] + (i < view.userOrgUnit.length - 1 ? ';' : '');
                    }
                }

                return gis.init.contextPath + '/api/geoFeatures.json' + params;
            }(),
            success,
            failure;

        success = function (r) {
            var features = gis.util.geojson.decode(r, 'ASC');

            if (!features.length) {
                gis.mask.hide();
                gis.alert(GIS.i18n.no_valid_coordinates_found);
                return;
            }

            layer.featureStore.loadFeatures(features.slice(0));
            layer.features = features;

            loadData(view, features);
        };

        failure = function () {
            gis.mask.hide();
            gis.alert(GIS.i18n.coordinates_could_not_be_loaded);
        };

        Ext.Ajax.request({
            url: url,
            disableCaching: false,
            success: function (r) {
                success(Ext.decode(r.responseText));
            },
            failure: function () {
                failure();
            }
        });
    };

    loadData = function (view, features) {
        var success;

        view = view || layer.view;
        features = features || layer.featureStore.features;

        var dimConf = gis.conf.finals.dimension,
            paramString = '?',
            dxItems = view.columns[0].items,
            isOperand = view.columns[0].dimension === dimConf.operand.objectName,
            peItems = view.filters[0].items,
            ouItems = view.rows[0].items,
            propertyMap = {
                'name': 'name',
                'displayName': 'name',
                'shortName': 'shortName',
                'displayShortName': 'shortName'
            },
            keyAnalysisDisplayProperty = gis.init.userAccount.settings.keyAnalysisDisplayProperty,
            displayProperty = propertyMap[keyAnalysisDisplayProperty] || propertyMap[view.displayProperty] || 'name';

        // ou
        paramString += 'dimension=ou:';

        for (var i = 0; i < ouItems.length; i++) {
            paramString += ouItems[i].id;
            paramString += i < ouItems.length - 1 ? ';' : '';
        }

        // dx
        paramString += '&dimension=dx:';

        for (var i = 0; i < dxItems.length; i++) {
            paramString += isOperand ? dxItems[i].id.split('.')[0] : dxItems[i].id;
            paramString += i < dxItems.length - 1 ? ';' : '';
        }

        // program
        if (view.program) {
            paramString += '&program=' + view.program.id;
        }

        paramString += isOperand ? '&dimension=co' : '';

        // pe
        paramString += '&filter=pe:';

        for (var i = 0; i < peItems.length; i++) {
            paramString += peItems[i].id;
            paramString += i < peItems.length - 1 ? ';' : '';
        }

        // display property
        paramString += '&displayProperty=' + displayProperty.toUpperCase();

        if (Ext.isArray(view.userOrgUnit) && view.userOrgUnit.length) {
            paramString += '&userOrgUnit=';

            for (var i = 0; i < view.userOrgUnit.length; i++) {
                paramString += view.userOrgUnit[i] + (i < view.userOrgUnit.length - 1 ? ';' : '');
            }
        }

        // relative period date
        if (view.relativePeriodDate) {
            paramString += '&relativePeriodDate=' + view.relativePeriodDate;
        }

        success = function (json) {
            var response = gis.api.response.Response(json), // validate
                featureMap = {},
                valueMap = {},
                ouIndex,
                valueIndex,
                valueFeatures = [], // only include features with values
                values = []; // to find min and max values

            if (!response) {
                gis.mask.hide();
                return;
            }

            // ou index, value index
            for (var i = 0; i < response.headers.length; i++) {
                if (response.headers[i].name === dimConf.organisationUnit.dimensionName) {
                    ouIndex = i;
                }
                else if (response.headers[i].name === dimConf.value.dimensionName) {
                    valueIndex = i;
                }
            }

            // Feature map
            for (var i = 0, id; i < features.length; i++) {
                var id = features[i].id;
                featureMap[id] = true;
            }

            // Value map
            for (var i = 0; i < response.rows.length; i++) {
                var id = response.rows[i][ouIndex],
                    value = parseFloat(response.rows[i][valueIndex]);

                valueMap[id] = value;
            }

            for (var i = 0; i < features.length; i++) {
                var feature = features[i],
                    id = feature.id;

                if (featureMap.hasOwnProperty(id) && valueMap.hasOwnProperty(id)) {
                    feature.properties.value = valueMap[id];
                    valueFeatures.push(feature);
                    values.push(valueMap[id]);
                }
            }

            // Sort values in ascending order
            values.sort(function (a, b) {
                return a - b;
            });

            // TODO: Temporarilty fix
            gis.data = {
                metaData: response.metaData,
                features: valueFeatures,
                values: values
            };

            gis.response = response;

            loadLegend(view);
        };

        Ext.Ajax.request({
            url: gis.init.contextPath + '/api/analytics.json' + paramString,
            disableCaching: false,
            failure: function (r) {
                gis.alert(r);
            },
            success: function (r) {
                success(Ext.decode(r.responseText));
            }
        });
    };

    loadLegend = function (view, metaData, features, values) {
        var dimConf = gis.conf.finals.dimension,
            metaData = metaData || gis.data.metaData,
            features = features || gis.data.features,
            values = values || gis.data.values,
            bounds = [],
            colors = [],
            names = [],
            legends = [],
            count = {}, // number in each class
            addNames,
            fn,
            loadLegendSet;

        view = view || layer.view;

        addNames = function(response) {

            // All dimensions
            var dimensions = Ext.Array.clean([].concat(view.columns || [], view.rows || [], view.filters || [])),
                metaData = response.metaData,
                peIds = metaData[dimConf.period.objectName];

            for (var i = 0, dimension; i < dimensions.length; i++) {
                dimension = dimensions[i];

                for (var j = 0, item; j < dimension.items.length; j++) {
                    item = dimension.items[j];

                    if (item.id.indexOf('.') !== -1) {
                        var ids = item.id.split('.');
                        item.name = metaData.names[ids[0]] + ' ' + metaData.names[ids[1]];
                    }
                    else {
                        item.name = metaData.names[item.id];
                    }
                }
            }

            // Period name without changing the id
            view.filters[0].items[0].name = metaData.names[peIds[peIds.length - 1]];
        };

        fn = function () {
            addNames(gis.response);

            var options = { // Classification options
                indicator: gis.conf.finals.widget.value,
                method: view.method,
                numClasses: view.classes,
                bounds: bounds,
                colors: colors,
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

        loadLegendSet = function (view) {
            Ext.Ajax.request({
                url: gis.init.contextPath + '/api/legendSets/' + view.legendSet.id + '.json?fields=' + gis.conf.url.legendSetFields.join(','),
                scope: this,
                disableCaching: false,
                success: function (r) {
                    legends = Ext.decode(r.responseText).legends;

                    Ext.Array.sort(legends, function (a, b) {
                        return a.startValue - b.startValue;
                    });

                    for (var i = 0; i < legends.length; i++) {
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
            var elementMap = {
                    'in': 'indicators',
                    'de': 'dataElements',
                    'ds': 'dataSets'
                },
                elementUrl = elementMap[view.columns[0].objectName],
                id = view.columns[0].items[0].id;

            if (!elementUrl) {
                fn();
                return;
            }

            Ext.Ajax.request({
                url: gis.init.contextPath + '/api/' + elementUrl + '.json?fields=legendSet[id,displayName|rename(name)]&paging=false&filter=id:eq:' + id,
                success: function (r) {
                    var elements = Ext.decode(r.responseText)[elementUrl],
                        set;

                    if (Ext.Array.from(elements).length) {
                        set = Ext.isObject(elements[0]) ? elements[0].legendSet || null : null;
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
    applyClassification = function (options, features, values) {
        var method = options.method,
            bounds = [],
            colors = [];

        if (method === 1) { // predefined bounds

            bounds = options.bounds;
            colors = options.colors;

        } else if (method === 2) { // equal intervals

            for (var i = 0; i <= options.numClasses; i++) {
                bounds[i] = options.minValue + i * (options.maxValue - options.minValue) / options.numClasses;
            }
            options.bounds = bounds;
            colors = options.colors = getColorsByRgbInterpolation(options.colorLow, options.colorHigh, options.numClasses);

        } else if (method === 3) { // quantiles

            var binSize = Math.round(values.length / options.numClasses),
                binLastValPos = (binSize === 0) ? 0 : binSize;

            if (values.length > 0) {
                bounds[0] = values[0];
                for (i = 1; i < options.numClasses; i++) {
                    bounds[i] = values[binLastValPos];
                    binLastValPos += binSize;

                    if (binLastValPos > values.length - 1) {
                        binLastValPos = values.length - 1;
                    }
                }
                bounds.push(values[values.length - 1]);
            }

            for (var j = 0; j < bounds.length; j++) {
                bounds[j] = parseFloat(bounds[j]);
            }

            options.bounds = bounds;
            colors = options.colors = getColorsByRgbInterpolation(options.colorLow, options.colorHigh, options.numClasses);
        }

        if (bounds.length) {
            for (var i = 0, prop, value, classNumber; i < features.length; i++) {
                prop = features[i].properties;
                value = prop[options.indicator];
                classNumber = getClass(value, bounds);
                prop.color = colors[classNumber - 1];
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
    getClass = function (value, bounds) {
        if (value >= bounds[0]) {
            for (var i = 1; i < bounds.length; i++) {
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

    getColorsByRgbInterpolation = function (firstColor, lastColor, nbColors) {
        var colors = [],
            colorA = hexToRgb('#' + firstColor),
            colorB = hexToRgb('#' + lastColor);

        if (nbColors == 1) {
            return ['#' + firstColor];
        }
        for (var i = 0; i < nbColors; i++) {
            colors.push(rgbToHex({
                r: parseInt(colorA.r + i * (colorB.r - colorA.r) / (nbColors - 1)),
                g: parseInt(colorA.g + i * (colorB.g - colorA.g) / (nbColors - 1)),
                b: parseInt(colorA.b + i * (colorB.b - colorA.b) / (nbColors - 1)),
            }));
        }
        return colors;
    };

    // Convert hex color to RGB
    hexToRgb = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    // Convert RGB color to hex
    rgbToHex = function (rgb) {
        return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
    };

    // Add layer to map
    updateMap = function (view, features) {

        var layerConfig = Ext.applyIf({
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

        // Put map layers in correct order: https://github.com/dhis2/dhis2-gis/issues/9
        gis.util.map.orderLayers();

        layer.instance.on('click', onFeatureClick);
        //layer.instance.on('contextmenu', onFeatureRightClick); // TODO: Fix bug with drill down for thematic layers

    };

    onFeatureClick = function (evt) {
        GIS.core.FeaturePopup(gis, evt.layer);
    };

    onFeatureRightClick = function (evt) {
        var menu = GIS.core.FeatureContextMenu(gis, layer, evt.layer);
        menu.showAt([evt.originalEvent.x, evt.originalEvent.y]);
    };

    updateLegend = function (view, metaData, options) {
        var bounds = options.bounds,
            colors = options.colors,
            legendNames = view.legendSet ? view.legendSet.names || {} : {},
            html,
            id,
            name;

        // title
        id = view.columns[0].items[0].id;
        name = view.columns[0].items[0].name;
        html = '<div class="dhis2-legend"><h2>' + (metaData.names[id] || name || id);

        // period
        id = view.filters[0].items[0].id;
        name = view.filters[0].items[0].name;
        html += ' <span>' + (metaData.names[id] || name || id) + '</span></h2>';

        // color legend
        if (view.method === 1 && view.legendSet) {
            html += '<dl class="dhis2-legend-predefined">';

            for (var i = 0, name, label; i < bounds.length - 1; i++) {
                name = legendNames[i];
                label = bounds[i] + ' - ' + bounds[i + 1] + ' (' + (options.count[i + 1] || 0) + ')';
                html += '<dt style="background-color:' + colors[i] + ';"></dt>';
                html += '<dd><strong>' + (name || '') + '</strong>' + label + '</dd>';
            }
        }
        else {
            html += '<dl class="dhis2-legend-automatic">';

            for (var i = 0, label; i < bounds.length - 1; i++) {
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
                    offset: [0, -62],
                    content: html
                });
            } else {
                gis.legend.setContent(gis.legend.getContent() + html);
            }
        }
    },

    afterLoad = function(view) {

        // Legend
        gis.viewport.eastRegion.doLayout();

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
        if (loader.updateGui && Ext.isObject(layer.widget)) {
            layer.widget.setGui(view);
        }

        // Zoom
        if (loader.zoomToVisibleExtent) {
            gis.instance.fitBounds(layer.instance.getBounds());
        }

        // Mask
        if (loader.hideMask) {
            gis.mask.hide();
        }

        // Map callback
        if (loader.callBack) {
            loader.callBack(layer);
        }
        else {
            gis.map = null;
            if (gis.viewport.shareButton) {
                gis.viewport.shareButton.enable();
            }
        }

        // session storage
        if (GIS.isSessionStorage) {
            gis.util.layout.setSessionStorage('map', gis.util.layout.getAnalytical());
        }
    };

    loader = {
        compare: false,
        updateGui: false,
        zoomToVisibleExtent: false,
        hideMask: false,
        callBack: null,
        load: function(view) {
            if (gis.mask && !gis.skipMask) {
                gis.mask.show();
            }

            if (this.compare) {
                compareView(view, true);
            }
            else {
                loadOrganisationUnits(view);
            }
        },
        loadData: loadData,
        loadLegend: loadLegend
    };

    return loader;
};
