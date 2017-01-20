import arraySort from 'd2-utilizr/lib/arraySort';

// Layer handler for external layer (WMS/TMS/XYZ)
export default function LayerHandlerExternal(gis, layer) {

    // Create new layer for view definition
    const createLayer = function(view) {
        if (typeof view.config === 'string') { // From database as favorite
            view.config = JSON.parse(view.config);
        }

        const config = view.config;

        const layerConfig = {
            type: 'tileLayer',
            url: config.url,
            attribution: config.attribution,
            pane: 'external_' + config.mapLayerPosition.toLowerCase()
        };

        if (config.mapService === 'TMS') {
            layerConfig.tms = true;
        }

        if (config.mapService === 'WMS') {
            layerConfig.type = 'wmsLayer';
            layerConfig.layers = config.layers;

            if (config.imageFormat === 'JPG') { // PNG is default
                layerConfig.format = 'image/jpeg';
            }
        }

        // Remove layer instance if already exist
        if (layer.instance && gis.instance.hasLayer(layer.instance)) {
            gis.instance.removeLayer(layer.instance);
        }

        // Create layer instance
        layer.instance = gis.instance.addLayer(layerConfig);

        addLegend(view);
    }

    const addLegend = function(view, legend) {

        const config = view.config;
        let html = '<div class="dhis2-legend"><h2>' + config.name + '</h2>';

        createLegend(config, legend => {
            html += legend;

            if (config.attribution) {
                html += '<p>Source: ' + config.attribution + '</p>';
            }

            html += '</div>';

            if (layer.legendPanel) {
                layer.legendPanel.update(html);
            } else { // Dashboard map
                if (!gis.legend) {
                    gis.legend = gis.instance.addControl({
                        type: 'legend',
                        offset: [0, -64],
                        content: html
                    });
                } else { // Append legend
                    gis.legend.setContent(gis.legend.getContent() + html);
                }
            }

            afterLoad(view);
        });
    }

    // Show a predefined legend set or image URL
    const createLegend = function(config, callback) {
        if (config.legendSet && config.legendSet.id) { // Predefined legend
            Ext.Ajax.request({
                url: encodeURI(gis.init.apiPath + 'legendSets/' + config.legendSet.id + '.json?fields=' + gis.conf.url.legendSetFields.join(',')),
                scope: this,
                disableCaching: false,
                success(r) {
                    const legend = JSON.parse(r.responseText).legends;

                    arraySort(legend, 'ASC', 'startValue');

                    let html = '<dl class="dhis2-legend-predefined">';

                    legend.forEach(item => {
                        const label = item.startValue + ' - ' + item.endValue;

                        html += '<dt style="background-color:' + item.color + ';"></dt>';

                        if (item.name !== label) {
                            html += '<dd><strong>' + (item.name || '') + '</strong>' + label + '</dd>';
                        } else {
                            html += '<dd style="line-height:23px">' + label + '</dd>';
                        }
                    });

                    html += '</dl>';

                    callback(html);
                }
            });

        } else if (config.legendSetUrl) { // Legend from URL
            const externalImage = new Image();

            callback('<img id="dhis2-legend-img" style="padding:5px 0;" />'); // Placeholder image

            // Need to call doLayout after loading the image is loaded
            externalImage.onload = function(){
                document.getElementById('dhis2-legend-img').src = this.src;

                if (gis.viewport) {
                    gis.viewport.eastRegion.doLayout();
                }
            };
            externalImage.src = config.legendSetUrl;
        } else {
            callback(''); // No legend
        }
    }

    const afterLoad = function(view) {
        layer.view = { // simplify view for storage
            config: JSON.stringify(view.config)
        };

        // Legend
        if (gis.viewport) {
            gis.viewport.eastRegion.doLayout();
        }

        if (layer.legendPanel) {
            layer.legendPanel.expand();
        }

        if (layer.item) { // Layer stack
            layer.item.setValue(true, view.opacity);
        }
        else {
            layer.instance.setOpacity(view.opacity);
        }

        // Gui
        if (loader.updateGui && layer.widget) {
            layer.widget.setGui(view);
        }

        if (gis.mask && loader.hideMask) {
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
    }

    const loader = {
        compare: false,
        updateGui: false,
        zoomToVisibleExtent: false,
        hideMask: false,
        callBack: null,
        load: function(view) {
            if (gis.mask && !gis.skipMask) {
                gis.mask.show();
            }

            createLayer(view);
        }
    };

    return loader;
}