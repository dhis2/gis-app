GIS.core.LayerHandlerThematic = function(gis, layer) {
    var olmap = layer.map,
        compareView,
        loadOrganisationUnits,
        addData,
        loadLegend,
        classifyWithBounds,
        classifyByEqIntervals,
        classifyByQuantils,
        applyClassification,
        getClass,
        updateMap,
        updateLegend,
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

                return gis.init.contextPath + '/api/geoFeatures.json' + params;
            }(),
            success,
            failure;

        success = function(r) {
            var features = gis.util.geojson.decode(r, 'ASC');

            if (!features.length) {
                gis.mask.hide();
                gis.alert(GIS.i18n.no_valid_coordinates_found);
                return;
            }

            layer.featureStore.loadFeatures(features.slice(0));

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
                valueIndex,
                values = [];

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
                    values.push(valueMap[id]);
                } else { // Remove feature without value
                    feature.properties.value = 'No data';
                }
            }

            // Sort values in ascending order
            values.sort(function(a,b) {
                return a - b;
            });

            loadLegend(view, response.metaData, features, values);
        };

        // console.log("URL", gis.init.contextPath + '/api/analytics.json' + paramString);

        Ext.Ajax.request({
            url: gis.init.contextPath + '/api/analytics.json' + paramString,
            // disableCaching: false, // TODO: remove comment
            failure: function(r) {
                gis.alert(r);
            },
            success: function(r) {
                success(Ext.decode(r.responseText));
            }
        });
    };

    loadLegend = function(view, metaData, features, values) {
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

        addNames = function() {
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

            // Period name without changing the id
            view.filters[0].items[0].name = metaData.names[peIds[peIds.length - 1]];
        };

        fn = function() {
            addNames();

            //console.log("###########", view.legendSet, view);

            // Classification options
            // TODO: Should min/max value only be from facilities/points?
            var options = {
                indicator: gis.conf.finals.widget.value,
                // method: view.legendSet ? mapfish.GeoStat.Distribution.CLASSIFY_WITH_BOUNDS : view.method,
                numClasses: view.classes,
                bounds: bounds,
                // colors: layer.core.getColors(view.colorLow, view.colorHigh),
                colors: colors,
                minSize: view.radiusLow,
                maxSize: view.radiusHigh,
                minValue: values[0],
                maxValue: values[values.length - 1]
            };

            //console.log("#######", values);

            layer.view = view;
            //layer.core.colorInterpolation = colors;
            //layer.core.applyClassification(options);

            applyClassification(options, features);
            updateLegend(view, metaData, options);
            updateMap(features);
            afterLoad(view);
        };

        loadLegendSet = function(view) {
            //console.log("loadLegendSet", view.legendSet);

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
                                //colors.push(new mapfish.ColorRgb(240,240,240));
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

    setClassification = function(options, features) {

        //console.log("setClassification", options, features);

        var values = [];
        for (var i = 0; i < features.length; i++) {
            //console.log("feature", features[i]);
            values.push(features[i].properties.value);
            //values.push(this.layer.features[i].attributes[this.indicator]);
        }

        //console.log("##", values);
        /*
        var distOptions = {
            labelGenerator: this.options.labelGenerator
        };
        var dist = new mapfish.GeoStat.Distribution(values, distOptions);

        this.minVal = dist.minVal;
        this.maxVal = dist.maxVal;

        this.classification = dist.classify(
            this.method,
            this.numClasses,
            null
        );

        this.createColorInterpolation();
        */
    };


    // Assign color to feature based on value
    applyClassification = function(options, features) {
        //setClassification(options, features);

        //console.log("options", options);

        // TODO: Calculate radius

        for (var i = 0, prop, value; i < features.length; i++) {
            prop = features[i].properties;
            value = prop[options.indicator];
            prop.color = options.colors[getClass(value, options.bounds)-1];

            // TODO: Better way to calaculate radius?
            prop.radius = (value - options.minValue) / (options.maxValue - options.minValue) * (options.maxSize - options.minSize) + options.minSize;
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

        var layerConfig = Ext.applyIf({
            data: features,
            label: '{name} ({value})'
        }, layer.config);

        // Remove layer instance if already exist
        if (layer.instance && gis.instance.hasLayer(layer.instance)) {
            gis.instance.removeLayer(layer.instance);
        }

        layer.instance = gis.instance.addLayer(layerConfig);

        // Put map layers in correct order: https://github.com/dhis2/dhis2-gis/issues/9
        gis.util.map.orderLayers();

        // TODO: Remember to remove events
        layer.instance.on('click', onFeatureClick);
        layer.instance.on('contextmenu', onFeatureRightClick);

    };

    onFeatureClick = function(evt) {
        GIS.app.FeaturePopup(gis, evt.layer);
    };

    onFeatureRightClick = function(evt) {
        var menu = GIS.app.FeatureContextMenu(gis, layer, evt.layer);
        menu.showAt([evt.originalEvent.x, evt.originalEvent.y]);
    };

    updateLegend = function(view, metaData, options) {
        var	isPlugin = gis.plugin,
            bounds = options.bounds,
            colors = options.colors,
            element = document.createElement('div'),
            style = {},
            legendNames = view.legendSet ? view.legendSet.names || {} : {},
            child,
            id,
            name;

        style.dataLineHeight = isPlugin ? '12px' : '14px';
        style.dataPaddingBottom = isPlugin ? '1px' : '3px';
        style.colorWidth = isPlugin ? '15px' : '30px';
        style.colorHeight = isPlugin ? '13px' : '15px';
        style.colorMarginRight = isPlugin ? '5px' : '8px';
        style.fontSize = isPlugin ? '10px' : '11px';

        // data
        id = view.columns[0].items[0].id;
        name = view.columns[0].items[0].name;
        child = document.createElement("div");
        child.style.lineHeight = style.dataLineHeight;
        child.style.paddingBottom = style.dataPaddingBottom;
        child.innerHTML += metaData.names[id] || name || id;
        child.innerHTML += "<br/>";

        // period
        id = view.filters[0].items[0].id;
        name = view.filters[0].items[0].name;
        child.innerHTML += metaData.names[id] || name || id;
        element.appendChild(child);

        child = document.createElement("div");
        child.style.clear = "left";
        element.appendChild(child);

        //console.log(options, legendNames);

        // legends
        if (view.legendSet) {
            for (var i = 0; i < bounds.length - 1; i++) {
                var name = 'abc';

                child = document.createElement('div');
                //child.style.backgroundColor = this.colorInterpolation[i].toHexString();
                child.style.backgroundColor = colors[i];
                child.style.width = style.colorWidth;
                child.style.height = legendNames[i] ? '25px' : style.colorHeight;
                //child.style.height = name ? '25px' : style.colorHeight;
                child.style.cssFloat = 'left';
                child.style.marginRight = style.colorMarginRight;
                element.appendChild(child);

                child = document.createElement('div');
                child.style.lineHeight = legendNames[i] ? '12px' : '7px';
                //child.style.lineHeight = name ? '12px' : '7px';
                child.innerHTML = '<b style="color:#222; font-size:10px !important">' + (legendNames[i] || '') + '</b><br/>' + '123'; // + this.classification.bins[i].label;
                //child.innerHTML = '<b style="color:#222; font-size:10px !important">' + (name || '') + '</b><br/>' + '123';
                element.appendChild(child);

                child = document.createElement('div');
                child.style.clear = 'left';
                element.appendChild(child);
            }
        }
        else {
            for (var i = 0; i < this.classification.bins.length; i++) {
                child = document.createElement('div');
                child.style.backgroundColor = this.colorInterpolation[i].toHexString();
                child.style.width = style.colorWidth;
                child.style.height = style.colorHeight;
                child.style.cssFloat = 'left';
                child.style.marginRight = style.colorMarginRight;
                element.appendChild(child);

                child = document.createElement('div');
                child.innerHTML = this.classification.bins[i].label;
                element.appendChild(child);

                child = document.createElement('div');
                child.style.clear = 'left';
                element.appendChild(child);
            }
        }

        layer.legendPanel.update(element.outerHTML);
    },

    classifyWithBounds = function(bounds) {
        var bins = [];
        var binCount = [];
        var sortedValues = [];

        for (var i = 0; i < this.values.length; i++) {
            sortedValues.push(this.values[i]);
        }
        sortedValues.sort(function(a,b) {return a-b;});
        var nbBins = bounds.length - 1;

        for (var j = 0; j < nbBins; j++) {
            binCount[j] = 0;
        }

        for (var k = 0; k < nbBins - 1; k) {
            if (sortedValues[0] < bounds[k + 1]) {
                binCount[k] = binCount[k] + 1;
                sortedValues.shift();
            }
            else {
                k++;
            }
        }

        binCount[nbBins - 1] = this.nbVal - mapfish.Util.sum(binCount);

        for (var m = 0; m < nbBins; m++) {
            bins[m] = new mapfish.GeoStat.Bin(binCount[m], bounds[m], bounds[m + 1], m == (nbBins - 1));
            var labelGenerator = this.labelGenerator || this.defaultLabelGenerator;
            bins[m].label = labelGenerator(bins[m], m, nbBins);
        }

        return new mapfish.GeoStat.Classification(bins);
    };

    classifyByEqIntervals = function(nbBins) {
        var bounds = [];

        for (var i = 0; i <= nbBins; i++) {
            bounds[i] = this.minVal + i*(this.maxVal - this.minVal) / nbBins;
        }

        return this.classifyWithBounds(bounds);
    };

    classifyByQuantils = function(nbBins) {
        var values = this.values;
        values.sort(function(a,b) {return a-b;});
        var binSize = Math.round(this.values.length / nbBins);

        var bounds = [];
        var binLastValPos = (binSize === 0) ? 0 : binSize;

        if (values.length > 0) {
            bounds[0] = values[0];
            for (i = 1; i < nbBins; i++) {
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

        return this.classifyWithBounds(bounds);
    };

    // method: 'bounds', 'equal', 'quantiles'
    classify = function(method, nbBins, bounds) {
        var classification = null;
        if (!nbBins) {
            console.log("TODO: sturgesRule");
            //nbBins = sturgesRule();
            //nbBins = Math.floor(1 + 3.3 * Math.log(this.nbVal, 10));
        }

        switch (method) {
            case 'bounds':
                classification = this.classifyWithBounds(bounds);
                break;
            case 'equal':
                classification = this.classifyByEqIntervals(nbBins);
                break;
            case 'quantiles':
                classification = this.classifyByQuantils(nbBins);
                break;
            default:
                console.error("Unsupported or invalid classification method");
        }
        return classification;
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
