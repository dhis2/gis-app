GIS.core.LayerHandlerThematic = function(gis, layer) {
    var olmap = layer.map,
        compareView,
        loadOrganisationUnits,
        addData,
        loadLegend,
        applyClassification,
        getClass,
        updateMap,
        afterLoad,
        loader,
        dimConf = gis.conf.finals.dimension;

    compareView = function(view, doExecute) {
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

        // legend
        //if (typeof view.legendSet !== typeof src.legendSet) {
            //if (doExecute) {
                //loadLegend(view);
            //}
            //return gis.conf.finals.widget.loadtype_legend;
        //}
        //else if (view.classes !== src.classes ||
            //view.method !== src.method ||
            //view.colorLow !== src.colorLow ||
            //view.radiusLow !== src.radiusLow ||
            //view.colorHigh !== src.colorHigh ||
            //view.radiusHigh !== src.radiusHigh) {
                //if (doExecute) {
                    //loadLegend(view);
                //}
                //return gis.conf.finals.widget.loadtype_legend;
        //}

        // if no changes - reload legend but do not zoom
        if (doExecute) {
            loader.zoomToVisibleExtent = false;
            loadLegend(view);
            return gis.conf.finals.widget.loadtype_legend;
        }

        gis.mask.hide();
    };

    loadOrganisationUnits = function(view) {
        var items = view.rows[0].items,
            isPlugin = GIS.plugin && !GIS.app,
            propertyMap = {
                'name': 'name',
                'displayName': 'name',
                'shortName': 'shortName',
                'displayShortName': 'shortName'
            },
            keyAnalysisDisplayProperty = gis.init.userAccount.settings.keyAnalysisDisplayProperty,
            displayProperty = propertyMap[keyAnalysisDisplayProperty] || propertyMap[view.displayProperty] || 'name',
            url = function() {
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

                return gis.init.contextPath + '/api/geoFeatures.' + (isPlugin ? 'jsonp' : 'json') + params;
            }(),
            success,
            failure;

        success = function(r) {
            var features = [];

            // Convert to GeoJSON features
            for (var i = 0, prop, coord; i < r.length; i++) {
                prop = r[i];
                coord = JSON.parse(prop.co);

                if (coord && coord.length) {
                    prop.name = prop.na;

                    features.push({
                        type: 'Feature',
                        id: prop.id,
                        properties: prop,
                        geometry: {
                            type: 'MultiPolygon',
                            coordinates: coord
                        }
                    });
                }
            }

            if (!features.length) {
                gis.mask.hide();
                gis.alert(GIS.i18n.no_valid_coordinates_found);
                return;
            }

            // layer.core.featureStore.loadFeatures(features.slice(0)); // TODO

            loadData(view, features);
        };

        failure = function() {
            olmap.mask.hide();
            gis.alert(GIS.i18n.coordinates_could_not_be_loaded);
        };

        Ext.Ajax.request({
            url: url,
            disableCaching: false,
            success: function(r) {
                success(Ext.decode(r.responseText));
            },
            failure: function() {
                failure();
            }
        });
    };

    loadData = function(view, features) {
        var success,
            dimConf = gis.conf.finals.dimension,
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

        success = function(json) {
            var layerConfig;

            var response = gis.api.response.Response(json), // validate
                featureMap = {},
                valueMap = {},
                ouIndex,
                dxIndex,
                valueIndex,
                newFeatures = [],
                dimensions,
                items = [];

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

                    // feature.properties.popupText = feature.properties.name + ' (' + feature.properties.value + ')';

                    newFeatures.push(feature);
                }
            }

            //console.log("add to map", newFeatures);

            //layer.removeFeatures(layer.features);
            //layer.addFeatures(newFeatures);


            loadLegend(view, response.metaData, features);
        };


        Ext.Ajax.request({
            url: gis.init.contextPath + '/api/analytics.json' + paramString,
            disableCaching: false,
            failure: function(r) {
                gis.alert(r);
            },
            success: function(r) {
                success(Ext.decode(r.responseText));
            }
        });
    };

    loadLegend = function(view, metaData, features) {
        var bounds = [],
            colors = [],
            names = [],
            legends = [],

            addNames,
            fn;

        //view = view || layer.core.view;

        // labels
        /*
        for (var i = 0, feature; i < layer.features.length; i++) {
            attr = layer.features[i].attributes;
            attr.label = view.labels ? attr.name + ' (' + attr.value + ')' : '';
        }
        */

        // layer.styleMap = GIS.core.StyleMap(view);

        addNames = function(response) {
            // All dimensions
            var dimensions = Ext.Array.clean([].concat(view.columns || [], view.rows || [], view.filters || [])),
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

            //console.log("dimensions", dimensions);

            // Period name without changing the id
            view.filters[0].items[0].name = metaData.names[peIds[peIds.length - 1]];
        };

        fn = function() {
            //console.log("fn", gis.response);

            addNames(gis.response);

            // Classification options
            var options = {
                indicator: gis.conf.finals.widget.value,
                // method: view.legendSet ? mapfish.GeoStat.Distribution.CLASSIFY_WITH_BOUNDS : view.method,
                numClasses: view.classes,
                bounds: bounds,
                // colors: layer.core.getColors(view.colorLow, view.colorHigh),
                colors: colors,
                minSize: view.radiusLow,
                maxSize: view.radiusHigh
            };

            layer.view = view;
            //layer.core.colorInterpolation = colors;
            //layer.core.applyClassification(options);

            applyClassification(options, features);
            updateMap(features);
            afterLoad(view);
        };

        loadLegendSet = function(view) {
            Ext.Ajax.request({
                url: gis.init.contextPath + '/api/legendSets/' + view.legendSet.id + '.json?fields=' + gis.conf.url.legendSetFields.join(','),
                scope: this,
                disableCaching: false,
                success: function(r) {
                    legends = Ext.decode(r.responseText).legends;

                    Ext.Array.sort(legends, function (a, b) {
                        return a.startValue - b.startValue;
                    });

                    for (var i = 0; i < legends.length; i++) {
                        if (bounds[bounds.length - 1] !== legends[i].startValue) {
                            if (bounds.length !== 0) {
                                colors.push(new mapfish.ColorRgb(240,240,240));
                                names.push('');
                            }
                            bounds.push(legends[i].startValue);
                        }
                        //colors.push(new mapfish.ColorRgb());
                        //colors[colors.length - 1].setFromHex(legends[i].color);
                        colors.push(legends[i].color);
                        names.push(legends[i].name);
                        bounds.push(legends[i].endValue);
                    }

                    view.legendSet.names = names;
                    view.legendSet.bounds = bounds;
                    view.legendSet.colors = colors;

                },
                callback: function() {
                    fn();
                }
            });
        };

        if (view.legendSet) {
            loadLegendSet(view);
        }
        else {
            //console.log("else");
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
                success: function(r) {
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
                failure: function() {
                    fn();
                }
            });
        }
    };

    // Assign color to feature based on value
    applyClassification = function(options, features) {
        // TODO: Calculate radius

        for (var i = 0, prop, value; i < features.length; i++) {
            prop = features[i].properties;
            value = prop[options.indicator];
            prop.color = options.colors[getClass(value, options.bounds)-1];
        }
    };

    // Returns class number
    getClass = function(value, bounds) {
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

    // Add layer to map
    updateMap = function(features) {
        var layerConfig;

        // Remove layer instance if already exist
        if (layer.instance && gis.instance.hasLayer(layer.instance)) {
            gis.instance.removeLayer(layer.instance);
        }

        layerConfig = Ext.applyIf({
            data: features,
            label: '{na} ({value})',
            popup: '{na}',
        }, layer.config);

        layer.instance = gis.instance.addLayer(layerConfig);
    };

    afterLoad = function(view) {

        // Legend
        gis.viewport.eastRegion.doLayout();

        if (layer.legendPanel) {
            layer.legendPanel.expand();
        }

        // Layer
        layer.instance.setOpacity(view.opacity); // TODO

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
