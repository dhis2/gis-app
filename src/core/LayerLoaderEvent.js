GIS.core.LayerLoaderEvent = function(gis, layer) {

    var olmap = layer.map,
        compareView,
        loadOrganisationUnits,
        loadData,
        loadLegend,
        afterLoad,
        loader,
        dimConf = gis.conf.finals.dimension;

    loadOrganisationUnits = function(view) {
        loadData(view);
    };

    loadData = function(view) {
        var paramString = '?',
            features = [],
            success;

        view = view || layer.core.view;

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

            //if (element.filter) {
            //if (element.operator) {
            //paramString += ':' + element.operator;
            //}

            //paramString += ':' + element.value;
            //}
        }

        success = function(r) {
            var events = [],
                features = [],
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
                updateFeatures;


            updateFeatures = function() {
                for (var i = 0, header; i < r.headers.length; i++) {
                    header = r.headers[i];
                    names[header.name] = header.column;
                }

                // events
                for (var i = 0, row, obj; i < rows.length; i++) {
                    row = rows[i];
                    obj = {};

                    for (var j = 0, value; j < row.length; j++) {
                        value = row[j];
                        obj[r.headers[j].name] = booleanNames[value] || r.metaData.optionNames[value] || names[value] || value;
                    }

                    obj[gis.conf.finals.widget.value] = 0;
                    obj.label = obj.ouname;
                    obj.popupText = obj.ouname;
                    obj.nameColumnMap = Ext.apply(names, r.metaData.optionNames, r.metaData.booleanNames);

                    events.push(obj);
                }

                // features

                //console.log('add features', events);


                /*
                for (var i = 0, event, point; i < events.length; i++) {
                    event = events[i];

                    point = gis.util.map.getTransformedPointByXY(event.longitude, event.latitude);

                    features.push(new OpenLayers.Feature.Vector(point, event));
                }

                layer.removeFeatures(layer.features);
                layer.addFeatures(features);
                */

                loadLegend(view);
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
                olmap.mask.hide();
                return;
            }

            // option set
            getOptionSets();
        };

        console.log('API URL', gis.init.contextPath + '/api/analytics/events/query/' + view.program.id + '.json' + paramString);

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

    loadLegend = function(view) {
        view = view || layer.core.view;

        // classification optionsvar options = {
        var options = {
            indicator: gis.conf.finals.widget.value,
            method: 2,
            numClasses: 5,
            // colors: layer.core.getColors('000000', '222222'), // TODO
            colors: ['000000', '222222'],
            minSize: 5,
            maxSize: 5
        };

        layer.core.view = view;

        // layer.core.applyClassification(options); // TODO

        afterLoad(view);
    };

    afterLoad = function(view) {

        // Layer
        if (layer.item) {
            layer.item.setValue(true, view.opacity);
        }
        else {
            // layer.setLayerOpacity(view.opacity); // TODO
        }

        // Gui
        if (loader.updateGui && Ext.isObject(layer.widget)) {
            layer.widget.setGui(view);
        }

        // Zoom
        if (loader.zoomToVisibleExtent) {
            // olmap.zoomToVisibleExtent(); // TODO
        }

        // Mask
        if (loader.hideMask) {
            //olmap.mask.hide();
            gis.mask.hide();
        }

        // Map callback
        if (loader.callBack) {
            loader.callBack(layer);
        }
        else {
            gis.map = null;
        }

        // session storage
        //if (GIS.isSessionStorage) {
        //gis.util.layout.setSessionStorage('map', gis.util.layout.getAnalytical());
        //}
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

            loadOrganisationUnits(view);
        },
        loadData: loadData,
        loadLegend: loadLegend
    };

    return loader;
};