import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';
import arrayClean from 'd2-utilizr/lib/arrayClean';
import arrayContains from 'd2-utilizr/lib/arrayContains';
import arrayFrom from 'd2-utilizr/lib/arrayFrom';

export default function MapLoader(gis, isSession, applyConfig) {

    const getMap = function() {
        const url = gis.init.apiPath + 'maps/' + gis.map.id + '.json?fields=' + gis.conf.url.mapFields.join(',');

        console.log("#", url);

        const success = function(r) {
            gis.map = r;
            setMap();
        };

        const failure = function(r) {
            if (gis.mask) {
                gis.mask.hide();
            }

            r = JSON.parse(r.responseText);

            if (arrayContains([403], parseInt(r.httpStatusCode))) {
                r.message = GIS.i18n.you_do_not_have_access_to_all_items_in_this_favorite || r.message;
            }

            gis.alert(r);
        };

        Ext.Ajax.request({
            url: encodeURI(url),
            success: function(r) {
                success(JSON.parse(r.responseText));
            },
            failure: function(r) {
                failure(r);
            }
        });
    };

    const setMap = function() {
        const basemap = gis.map.basemap || 'osmLight';
        const applyViews = isObject(applyConfig) && arrayFrom(applyConfig.mapViews).length ? applyConfig.mapViews : null;
        const register = [];
        let views = gis.map.mapViews;

        // title
        if (gis.dashboard && gis.container && gis.map && gis.map.name) {
            gis.container.childNodes[0].innerText = gis.map.name;
        }

        if (!(isArray(views) && views.length)) {
            if (gis.mask) {
                gis.mask.hide();
            }
            gis.alert(GIS.i18n.favorite_outdated_create_new);
            return;
        }

        for (let i = 0, applyView; i < views.length; i++) {
            applyView = applyViews ? applyViews[i] : null;

            views[i] = gis.api.layout.Layout(views[i], applyView);
        }

        views = arrayClean(views);

        if (!views.length) {
            if (gis.mask) {
                gis.mask.hide();
            }
            return;
        }

        if (gis.viewport && gis.viewport.favoriteWindow && gis.viewport.favoriteWindow.isVisible()) {
            gis.viewport.favoriteWindow.destroy();
        }

        clearAllLayers();

        // Add basemap
        if (basemap !== 'none') {
            const layer = gis.layer[basemap] || gis.layer['osmLight'];

            if (layer.instance) { // Layer instance already exist
                gis.instance.addLayer(layer.instance);
            } else { // Create and add layer instance
                layer.instance = gis.instance.addLayer(layer.config);
            }

            if (layer.item) {
                layer.item.setValue(true, 1);
            }
        }

        // Add views/overlays
        views.forEach(layout => {
            const layer = gis.layer[layout.layer];
            const handler = layer.handler(gis, layer);

            handler.updateGui = !gis.el;
            handler.callBack = function(layer) {
                register.push(layer);
                if (register.length === gis.map.mapViews.length) {
                    afterLoad();
                }
            };
            handler.load(layout);
        });
    };

    // Remove current layers from map
    const clearAllLayers = function() {
        for (let type in gis.layer) {
            if (gis.layer.hasOwnProperty(type)) {
                const layer = gis.layer[type];

                // Remove layer from map if exist
                if (layer.instance && gis.instance.hasLayer(layer.instance)) {
                    gis.instance.removeLayer(layer.instance);
                }

                // Reset layer widget
                if (layer.widget && layer.widget.reset) {
                    layer.widget.reset();
                }

                // Clear legend
                if (layer.legendPanel) {
                    layer.legendPanel.update('');
                    layer.legendPanel.collapse();
                }

                // Uncheck in layer stack
                if (layer.item) {
                    layer.item.checkbox.setValue(false);
                }
            }
        }
    };

    const afterLoad = function() {
        const lon = parseFloat(gis.map.longitude) || 0;
        const lat = parseFloat(gis.map.latitude) || 20;
        const zoom = gis.map.zoom || 3;
        const validLatLng = ((lon >= -180 && lon <= 180) && (lat >= -90 && lat <= 90));
        const layersBounds = gis.instance.getLayersBounds();

        // gis.el is the element used to render the map (only for plugin)
        // isSession is true if you select "map -> view this table/chart" as map in pivot/visualizer
        if (layersBounds && layersBounds.isValid() && (gis.el || isSession || !validLatLng)) {
            // Fit bounds not always set without a delay
            // window.setTimeout(function(){ gis.instance.fitBounds(layersBounds); }, 2000);
            gis.instance.fitBounds(layersBounds);
        }
        else {
            gis.instance.setView([lat, lon], zoom);
        }

        // interpretation button
        if (gis.viewport && gis.viewport.shareButton) {
            gis.viewport.shareButton.enable();
        }

        // session storage
        if (GIS.isSessionStorage) {
            gis.util.layout.setSessionStorage('map', gis.util.layout.getAnalytical());
        }

        if (gis.mask) {
            gis.mask.hide();
        }

        // data statistics
        if (isObject(GIS.app) && !isObject(GIS.plugin)) {
            Ext.Ajax.request({
                url: gis.init.apiPath + 'dataStatistics?eventType=MAP_VIEW' + (gis.map.id ? '&favorite=' + gis.map.id : ''),
                method: 'POST'
            });
        }
    };

    const loader = {
        load(views) {
            if (gis.mask && !gis.skipMask) {
                gis.mask.show();
            }

            if (gis.map && gis.map.id) {
                getMap();
            }
            else {
                if (views) {
                    gis.map = {
                        mapViews: views
                    };
                }

                setMap();
            }
        }
    };

    return loader;
};
