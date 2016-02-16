//GIS.core.LayerHandlerEvent = function(gis, layer) {
export default function LayerHandlerEvent(gis, layer) {
    var loadOrganisationUnits,
        loadData,
        afterLoad,
        updateMap,
        handler;

    loadOrganisationUnits = function(view) {
        loadData(view);
    };

    loadData = function(view) {
        var paramString = '?',
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
                popupKeys = [ // Default popup keys
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
                updateFeatures,
                getOptionSets;

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
                for (var i = 0, row, properties, coord; i < rows.length; i++) {
                    row = rows[i];
                    properties = {};

                    // Build property object
                    for (var j = 0, value; j < row.length; j++) {
                        value = row[j];
                        properties[r.headers[j].name] = booleanNames[value] || r.metaData.optionNames[value] || names[value] || value;
                    }

                    coord = [properties.longitude, properties.latitude];

                    if (gis.util.map.isValidCoordinate(coord)) {
                        features.push({
                            type: 'Feature',
                            id: properties.psi,
                            properties: properties,
                            geometry: {
                                type: 'Point',
                                coordinates: coord
                            }
                        });
                    }
                }

                updateMap(features, popup);

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
    };

    // Add layer to map
    updateMap = function(features, popup) {
        var layerConfig = Ext.applyIf({
            data: features,
            label: '{ouname}',
            popup: popup
        }, layer.config);

        // Remove layer instance if already exist
        if (layer.instance && gis.instance.hasLayer(layer.instance)) {
            gis.instance.removeLayer(layer.instance);
        }

        // Create layer instance
        layer.instance = gis.instance.addLayer(layerConfig);

        // Put map layers in correct order: https://github.com/dhis2/dhis2-gis/issues/9
        gis.util.map.orderLayers();
    };

    afterLoad = function(view) {

        layer.view = view;

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
            gis.instance.fitBounds(layer.instance.getBounds());
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