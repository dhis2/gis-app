GIS.core.LayerHandlerEvent = function(gis, layer) {

    var compareView,
        loadOrganisationUnits,
        loadData,
        afterLoad,
        handler,
        onRightClick,
        dimConf = gis.conf.finals.dimension;

    loadOrganisationUnits = function(view) {
        loadData(view);
    };

    loadData = function(view) {
        var paramString = '?',
            features = [],
            success;

        view = view || layer.view;

        // stage
        paramString += 'stage=' + view.stage.id;

        // dates
        paramString += '&startDate=' + view.startDate;
        paramString += '&endDate=' + view.endDate;

        // ou
        if (Ext.isArray(view.organisationUnits)) {
            paramString += '&dimension=ou:';

            for (var i = 0; i < view.organisationUnits.length; i++) {
                paramString += view.organisationUnits[i].id;
                paramString += i < view.organisationUnits.length - 1 ? ';' : '';
            }
        }

        // de
        for (var i = 0, element; i < view.dataElements.length; i++) {
            element = view.dataElements[i];
            paramString += '&dimension=' + element.dimension + (element.filter ? ':' + element.filter : '');
        }

        success = function(r) {
            var features = [],
                rows = [],
                lonIndex,
                latIndex,
                optionSetIndex,
                optionSetHeader,
                names = Ext.clone(r.metaData.names),
                booleanNames = {
                    'true': GIS.i18n.yes || 'Yes',
                    'false': GIS.i18n.no || 'No'
                },
                popupKeys = [
                    'ouname',
                    'eventdate',
                    'longitude',
                    'latitude'
                ],
                ignoreKeys = [
                    'eventdate',
                    'latitude',
                    'longitude',
                    'ou',
                    'oucode',
                    'ouname',
                    'psi',
                    'ps'
                ],
                popup,
                config,
                updateFeatures;

            updateFeatures = function() {

                // Find header names and keys
                for (var i = 0, header; i < r.headers.length; i++) {
                    header = r.headers[i];
                    names[header.name] = header.column;

                    if (!Ext.Array.contains(ignoreKeys, header.name)) {
                        popupKeys.push(header.name);
                    }
                }

                // Shorter header name for popup
                names['ouname'] = names['ou'];

                // Create popup template
                popup = '<table>';
                for (var i = 0, key; i < popupKeys.length; i++) {
                    key = popupKeys[i];
                    popup += '<tr><th>' + names[key] + '</th><td>{' + key + '}</td></tr>';
                }
                popup += '</table>';

                // Create GeoJSON features
                for (var i = 0, row, prop; i < rows.length; i++) {
                    row = rows[i];
                    prop = {};

                    // Build property object
                    for (var j = 0, value; j < row.length; j++) {
                        value = row[j];
                        prop[r.headers[j].name] = booleanNames[value] || r.metaData.optionNames[value] || names[value] || value;
                    }

                    features.push({
                        type: 'Feature',
                        properties: prop,
                        geometry: {
                            type: 'Point',
                            coordinates: [prop.longitude, prop.latitude]
                        }
                    });
                }

                // Apply layer config
                Ext.apply(layer.config, {
                    data: features,
                    label: '{ouname}',
                    popup: popup,
                    contextmenu: onRightClick
                });

                // Remove layer instance if already exist
                if (layer.instance && gis.instance.hasLayer(layer.instance)) {
                    gis.instance.removeLayer(layer.instance);
                }

                // Create layer instance
                layer.instance = gis.instance.addLayer(layer.config);

                // Fit map to layer bounds
                gis.instance.fitBounds(layer.instance.getBounds());

                afterLoad(view);
            };

            getOptionSets = function() {
                if (!optionSetHeader) {
                    updateFeatures();
                }
                else {
                    dhis2.gis.store.get('optionSets', optionSetHeader.optionSet).done( function(obj) {
                        Ext.apply(r.metaData.optionNames, gis.util.array.getObjectMap(obj.options, 'code', 'name'));
                        updateFeatures();
                    });
                }
            };

            r.metaData.optionNames = {};

            // name-column map, lonIndex, latIndex, optionSet
            for (var i = 0, header; i < r.headers.length; i++) {
                header = r.headers[i];

                names[header.name] = header.column;

                if (header.name === 'longitude') {
                    lonIndex = i;
                }

                if (header.name === 'latitude') {
                    latIndex = i;
                }

                if (Ext.isString(header.optionSet) && header.optionSet.length) {
                    optionSetIndex = i;
                    optionSetHeader = header;
                }
            }

            // get events with coordinates
            if (Ext.isArray(r.rows) && r.rows.length) {
                for (var i = 0, row; i < r.rows.length; i++) {
                    row = r.rows[i];

                    if (row[lonIndex] && row[latIndex]) {
                        rows.push(row);
                    }
                }
            }

            if (!rows.length) {
                gis.alert('No event coordinates found');
                gis.mask.hide();
                return;
            }

            // option set
            getOptionSets();
        };

        if (Ext.isObject(GIS.app)) {
            Ext.Ajax.request({
                url: gis.init.contextPath + '/api/analytics/events/query/' + view.program.id + '.json' + paramString,
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
                url: gis.init.contextPath + '/api/analytics/events/query/' + view.program.id + '.jsonp' + paramString,
                disableCaching: false,
                scope: this,
                success: function(r) {
                    success(r);
                }
            });
        }
    };

    onRightClick = function (evt) {
        console.log("rightclick", evt);
    };

    afterLoad = function(view) {

        // Layer
        if (layer.item) {
            layer.item.setValue(true, view.opacity);
        }
        else {
            layer.instance.setOpacity(view.opacity);
        }

        // Gui
        if (handler.updateGui && Ext.isObject(layer.widget)) {
            layer.widget.setGui(view);
        }

        // Zoom
        if (handler.zoomToVisibleExtent) {
            // olmap.zoomToVisibleExtent(); // TODO
        }

        // Mask
        if (handler.hideMask) {
            gis.mask.hide();
        }

        // Map callback
        if (handler.callBack) {
            handler.callBack(layer);
        }
        else {
            gis.map = null;
        }
    };

    handler = {
        compare: false,
        updateGui: false,
        zoomToVisibleExtent: false,
        hideMask: false,
        callBack: null,
        load: function(view) {

            if (gis.mask && !gis.skipMask) {
                gis.mask.show();
            }

            loadOrganisationUnits(view);
        },
        loadData: loadData
    };

    return handler;
};