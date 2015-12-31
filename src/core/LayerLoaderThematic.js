GIS.core.LayerLoaderThematic = function(gis, layer) {
    var olmap = layer.map,
        compareView,
        loadOrganisationUnits,
        loadData,
        loadLegend,
        afterLoad,
        loader,
        dimConf = gis.conf.finals.dimension;

    compareView = function(view, doExecute) {
        var src = layer.view, // TODO: view don't exist here layer.core.view,
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

        //gis.olmap.mask.hide();
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

            /*
            var geojson = gis.util.geojson.decode(r),
                format = new OpenLayers.Format.GeoJSON(),
                features = gis.util.map.getTransformedFeatureArray(format.read(geojson));
            */

            // Convert to GeoJSON features
            for (var i = 0, prop; i < r.length; i++) {
                prop = r[i];

                features.push({
                    type: 'Feature',
                    properties: prop,
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: JSON.parse(prop.co)
                    }
                });
            }

            //console.log(features);

            /* TODO
            if (!Ext.isArray(features)) {
                olmap.mask.hide();
                gis.alert(GIS.i18n.invalid_coordinates);
                return;
            }
            */

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

        if (isPlugin) {
            Ext.data.JsonP.request({
                url: url,
                disableCaching: false,
                success: function(r) {
                    success(r);
                }
            });
        }
        else {
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
        }
    };

    loadData = function(view, features) {
        var success;

        // TODO: Core don't exist
        view = view || layer.core.view;
        features = features || layer.core.featureStore.features;

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

        success = function(json) {
            //console.log("json", json);

            var response = gis.api.response.Response(json),
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
                var id = features[i].properties.id;
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
                    id = feature.properties.id;

                if (featureMap.hasOwnProperty(id) && valueMap.hasOwnProperty(id)) {
                    feature.properties.value = valueMap[id];

                    // feature.properties.popupText = feature.properties.name + ' (' + feature.properties.value + ')';

                    newFeatures.push(feature);
                }
            }

            //console.log("add to map", newFeatures);

            //layer.removeFeatures(layer.features);
            //layer.addFeatures(newFeatures);

            if (!layer.instance) {
                layer.instance = gis.instance.addLayer({
                    type: 'choropleth',
                    label: '{na} ({value})',
                    popup: '{na}',
                });
            }

            layer.instance.addFeatures(features);

            gis.instance.fitBounds(layer.instance.getBounds());

            gis.mask.hide();

            gis.response = response;

            // loadLegend(view); // TODO
        };

        if (Ext.isObject(GIS.app)) {
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
        }
        else if (Ext.isObject(GIS.plugin)) {
            Ext.data.JsonP.request({
                url: gis.init.contextPath + '/api/analytics.jsonp' + paramString,
                disableCaching: false,
                scope: this,
                success: function(r) {
                    success(r);
                }
            });
        }
    };

    loadLegend = function(view) {
        var bounds = [],
            colors = [],
            names = [],
            legends = [],

            addNames,
            fn;

        view = view || layer.core.view;

        // labels
        for (var i = 0, feature; i < layer.features.length; i++) {
            attr = layer.features[i].attributes;
            attr.label = view.labels ? attr.name + ' (' + attr.value + ')' : '';
        }

        layer.styleMap = GIS.core.StyleMap(view);

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

        fn = function() {
            addNames(gis.response);

            // Classification options
            var options = {
                indicator: gis.conf.finals.widget.value,
                method: view.legendSet ? mapfish.GeoStat.Distribution.CLASSIFY_WITH_BOUNDS : view.method,
                numClasses: view.classes,
                bounds: bounds,
                colors: layer.core.getColors(view.colorLow, view.colorHigh),
                minSize: view.radiusLow,
                maxSize: view.radiusHigh
            };

            layer.core.view = view;
            layer.core.colorInterpolation = colors;
            layer.core.applyClassification(options);

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
                        colors.push(new mapfish.ColorRgb());
                        colors[colors.length - 1].setFromHex(legends[i].color);
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

    afterLoad = function(view) {

        // Legend
        gis.viewport.eastRegion.doLayout();

        if (layer.legendPanel) {
            layer.legendPanel.expand();
        }

        // Layer
        layer.setLayerOpacity(view.opacity);

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
            olmap.zoomToVisibleExtent();
        }

        // Mask
        if (loader.hideMask) {
            olmap.mask.hide();
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
