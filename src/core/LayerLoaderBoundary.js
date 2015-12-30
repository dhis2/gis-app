GIS.core.LayerLoaderBoundary = function(gis, layer) {
    var olmap = layer.map,
        compareView,
        loadOrganisationUnits,
        loadData,
        loadLegend,
        afterLoad,
        loader;

    compareView = function(view, doExecute) {
        var src = layer.view,
            viewIds,
            viewDim,
            srcIds,
            srcDim;

        if (!src) {
            if (doExecute) {
                loadOrganisationUnits(view);
            }
            return gis.conf.finals.widget.loadtype_organisationunit;
        }

        viewIds = [];
        viewDim = view.rows[0];
        srcIds = [];
        srcDim = src.rows[0];

        // organisation units
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

            if (doExecute) {
                loader.zoomToVisibleExtent = false;
                loadLegend(view);
            }

            return gis.conf.finals.widget.loadtype_legend;
        }
        else {
            if (doExecute) {
                loadOrganisationUnits(view);
            }
            return gis.conf.finals.widget.loadtype_organisationunit;
        }

        gis.olmap.mask.hide();
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
            displayProperty = propertyMap[keyAnalysisDisplayProperty] || propertyMap[xLayout.displayProperty] || 'name',
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
            var //colors = ['black', 'blue', 'red', 'green', 'yellow'],
                //levels = [],
                //levelObjectMap = {},
                features = [];

            if (!r.length) {
                gis.mask.hide();
                gis.alert(GIS.i18n.no_valid_coordinates_found);
                return;
            }

            /* TODO
            if (!Ext.isArray(features)) {
                olmap.mask.hide();
                gis.alert(GIS.i18n.invalid_coordinates);
                return;
            }
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

            // get levels, colors, map
            /*
            for (var i = 0; i < features.length; i++) {
                levels.push(parseFloat(features[i].properties.level));
            }

            levels = Ext.Array.unique(levels).sort();

            for (var i = 0; i < levels.length; i++) {
                levelObjectMap[levels[i]] = {
                    strokeColor: colors[i]
                };
            }

            // style
            for (var i = 0, feature, obj, strokeWidth; i < features.length; i++) {
                feature = features[i];
                obj = levelObjectMap[feature.attributes.level];
                strokeWidth = levels.length === 1 ? 1 : feature.attributes.level == 2 ? 2 : 1;

                feature.style = {
                    strokeColor: obj.strokeColor || 'black',
                    strokeWidth: strokeWidth,
                    fillOpacity: 0,
                    pointRadius: 5,
                    labelAlign: 'cr',
                    labelYOffset: 13
                };
            }

            layer.core.featureStore.loadFeatures(features.slice(0));
            */

            addData(view, features);
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

    addData = function(view, features) {
        view = view || layer.view;
        // features = features || layer.core.featureStore.features; // TODO

        /*
        for (var i = 0; i < features.length; i++) {
            features[i].attributes.value = 0;
            features[i].attributes.popupText = features[i].attributes.name;
        }

        layer.removeFeatures(layer.features);
        layer.addFeatures(features);
        */


        if (!layer.instance) {
            layer.instance = gis.instance.addLayer({
                type: 'features',
                label: '{na}',
                popup: '{na}',
            });
        }

        layer.instance.addData(features);

        gis.instance.fitBounds(layer.instance.getBounds());

        gis.mask.hide();


        // loadLegend(view);
    };

    loadLegend = function(view) {
        view = view || layer.core.view;

        // labels
        for (var i = 0, feature; i < layer.features.length; i++) {
            attr = layer.features[i].attributes;
            attr.label = view.labels ? attr.name : '';
        }

        var options = {
            indicator: gis.conf.finals.widget.value,
            method: 2,
            numClasses: 5,
            colors: layer.core.getColors('000000', '000000'),
            minSize: 6,
            maxSize: 6
        };

        layer.core.view = view;

        layer.core.applyClassification(options);

        // labels
        layer.core.setFeatureLabelStyle(view.labels, false, view);

        afterLoad(view);
    };

    afterLoad = function(view) {

        // Layer
        if (layer.item) {
            layer.item.setValue(true, view.opacity);
        }
        else {
            layer.setLayerOpacity(view.opacity);
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

        // mouse events
        if (layer.unregisterMouseDownEvent) {
            layer.unregisterMouseDownEvent();
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
