import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';
import isString from 'd2-utilizr/lib/isString';
import arrayClean from 'd2-utilizr/lib/arrayClean';

export default function extendInstance(gis) {
    var util = gis.util,
        init = gis.init,
        store = gis.store,
        layer;

    // util
    (function() {
        util.map.getFeaturesByLayers = function(layers) {
            var a = [];
            for (var i = 0; i < layers.length; i++) {
                a = a.concat(layers[i].features);
            }
            return a;
        };

        util.map.hasVisibleFeatures = function() {
            var layers = util.map.getVisibleVectorLayers(),
                layer;

            if (layers.length) {
                for (var i = 0; i < layers.length; i++) {
                    layer = layers[i];
                    if (layer.features.length) {
                        return true;
                    }
                }
            }

            return false;
        };

        util.map.getLayersByType = function(layerType) {
            var layers = [];
            for (var i = 0; i < gis.olmap.layers.length; i++) {
                var layer = gis.olmap.layers[i];
                if (layer.layerType === layerType) {
                    layers.push(layer);
                }
            }
            return layers;
        };

        util.map.addMapControl = function(name, fn) {
            var panel = GIS.app.MapControlPanel(name, fn);
            gis.olmap.addControl(panel);
            panel.div.className += ' ' + name;
            panel.div.childNodes[0].className += ' ' + name + 'Button';
        };

        /*
         util.map.getTransformedPointByXY = function(x, y) {
         var p = new OpenLayers.Geometry.Point(parseFloat(x), parseFloat(y));
         return p.transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913'));
         };
         */

        /*
         util.map.getLonLatByXY = function(x, y) {
         var point = util.map.getTransformedPointByXY(x, y);
         return new OpenLayers.LonLat(point.x, point.y);
         };
         */

        util.map.map2plugin = function(map) {
            map.url = init.contextPath;

            if (map.id) {
                return {id: map.id};
            }

            delete map.access;
            delete map.created;
            //delete lastUpdated;
            //delete name;

            for (var i = 0, dimensions, layout; i < map.mapViews.length; i++) {
                layout = map.mapViews[i];

                dimensions = arrayClean([].concat(layout.columns || [], layout.rows || [], layout.filters || []));dimension = dimensions[i];

                for (var j = 0, dimension; j < dimensions.length; j++) {
                    dimension = dimensions[j];

                    delete dimension.id;
                    delete dimension.ids;
                    delete dimension.type;
                    delete dimension.dimensionName;
                    delete dimension.objectName;

                    for (var k = 0, item; k < dimension.items.length; k++) {
                        item = dimension.items[k];

                        delete item.name;
                        delete item.code;
                        delete item.created;
                        delete item.lastUpdated;
                    }
                }

                if (layout.legendSet) {
                    delete layout.method;
                    delete layout.classes;
                    delete layout.colorLow;
                    delete layout.colorHigh;
                    delete layout.radiusLow;
                    delete layout.radiusHigh;
                }
                else {
                    if (layout.method === 2) {
                        delete layout.method;
                    }

                    if (layout.classes === 5) {
                        delete layout.classes;
                    }

                    if (layout.colorLow === "ff0000") {
                        delete layout.colorLow;
                    }

                    if (layout.colorHigh === "00ff00") {
                        delete layout.colorHigh;
                    }

                    if (layout.radiusLow === 5) {
                        delete layout.radiusLow;
                    }

                    if (layout.radiusHigh === 15) {
                        delete layout.radiusHigh;
                    }
                }

                if (layout.opacity === gis.conf.layout.layer.opacity) {
                    delete layout.opacity;
                }

                if (!layout.userOrganisationUnit) {
                    delete layout.userOrganisationUnit;
                }

                if (!layout.userOrganisationUnitChildren) {
                    delete layout.userOrganisationUnitChildren;
                }

                if (!layout.userOrganisationUnitGrandChildren) {
                    delete layout.userOrganisationUnitGrandChildren;
                }

                if (!layout.organisationUnitGroupSet) {
                    delete layout.organisationUnitGroupSet;
                }

                delete layout.parentGraphMap;
            }

            return map;
        };

        util.url = util.url || {};

        util.url.getUrlParam = function(s) {
            var output = '';
            var href = window.location.href;
            if (href.indexOf('?') > -1 ) {
                var query = href.substr(href.indexOf('?') + 1);
                var query = query.split('&');
                for (var i = 0; i < query.length; i++) {
                    if (query[i].indexOf('=') > -1) {
                        var a = query[i].split('=');
                        if (a[0].toLowerCase() === s) {
                            output = a[1];
                            break;
                        }
                    }
                }
            }
            return unescape(output);
        };

        util.svg = util.svg || {};

        util.svg.merge = function(str, strArray) {
            if (strArray.length) {
                str = str || '<svg></svg>';
                for (var i = 0; i < strArray.length; i++) {
                    str = str.replace('</svg>', '');
                    strArray[i] = strArray[i].substring(strArray[i].indexOf('>') + 1);
                    str += strArray[i];
                }
            }
            return str;
        };

        util.svg.getString = function(title, layers) {
            var svgArray = [],
                svg = '',
                namespace,
                title = Ext.htmlEncode(title),
                titleSVG,
                legendSVG = '',
                scalelineSVG,
                x = 20,
                y = 35,
                center = gis.viewport.centerRegion;

            if (!layers.length) {
                return false;
            }

            layers = layers.reverse();

            namespace = 'xmlns="http://www.w3.org/2000/svg"';

            svg = '<svg ' + namespace + ' width="' + center.getWidth() + '" height="' + center.getHeight() + '"></svg>';

            titleSVG = '<g id="title" style="display: block; visibility: visible;">' +
                '<text id="title" x="' + x + '" y="' + y + '" font-size="18" font-weight="bold">' +
                '<tspan>' + title + '</tspan></text></g>';

            y += 35;

            for (var i = layers.length - 1; i > 0; i--) {
                if (layers[i].id === gis.layer.facility.id) {
                    layers.splice(i, 1);
                    console.log(GIS.i18n.facility_layer_export_currently_not_supported);
                }
            }

            if (!layers.length) {
                return false;
            }

            for (var i = 0; i < layers.length; i++) {
                console.log("legend", layers[i]);

                var layer = layers[i],
                    id = layer.id,
                    imageLegendConfig = layer.imageLegendConfig || [],
                    what,
                    when,
                    where,
                    legend;

                // SVG
                //svgArray.push(layer.div.innerHTML);

                // Legend
                if (id !== gis.layer.boundary.id && id !== gis.layer.facility.id && id !== gis.layer.event.id) {
                    what = '<g id="indicator" style="display: block; visibility: visible;">' +
                        '<text id="indicator" x="' + x + '" y="' + y + '" font-size="12">' +
                        '<tspan>' + Ext.htmlEncode(layer.view.columns[0].items[0].name) + '</tspan></text></g>';

                    y += 15;

                    when = '<g id="period" style="display: block; visibility: visible;">' +
                        '<text id="period" x="' + x + '" y="' + y + '" font-size="12">' +
                        '<tspan>' + Ext.htmlEncode(layer.view.filters[0].items[0].name) + '</tspan></text></g>';

                    y += 8;

                    legend = '<g>';

                    for (var j = 0; j < imageLegendConfig.length; j++) {
                        if (j !== 0) {
                            y += 15;
                        }

                        legend += '<rect x="' + x + '" y="' + y + '" height="15" width="30" ' +
                            'fill="' + Ext.htmlEncode(imageLegendConfig[j].color) + '" stroke="#000000" stroke-width="1"/>';

                        legend += '<text id="label" x="' + (x + 40) + '" y="' + (y + 12) + '" font-size="12">' +
                            '<tspan>' + Ext.htmlEncode(imageLegendConfig[j].label) + '</tspan></text>';
                    }

                    legend += '</g>';

                    legendSVG += (what + when + where + legend);

                    y += 50;
                }
            }

            // Map
            if (svgArray.length) {
                svg = util.svg.merge(svg, svgArray);
            }

            svg = svg.replace('</svg>', (titleSVG + legendSVG + scalelineSVG) + '</svg>');

            return svg;
        };

        util.json = util.json || {};

        util.json.encodeString = function(str) {
            return isString(str) ? str.replace(/[^a-zA-Z 0-9(){}<>_!+;:?*&%#-]+/g,'') : str;
        };

        util.json.decodeAggregatedValues = function(responseText) {
            responseText = JSON.parse(responseText);
            var values = [];

            for (var i = 0; i < responseText.length; i++) {
                values.push({
                    oi: responseText[i][0],
                    v: responseText[i][1]
                });
            }
            return values;
        };

        util.gui = util.gui || {};
        util.gui.window = util.gui.window || {};

        util.gui.window.setPositionTopRight = function(window) {
            window.setPosition(gis.viewport.centerRegion.getWidth() - (window.getWidth() + 3), gis.viewport.centerRegion.y + 64);
        };

        util.gui.window.setPositionTopLeft = function(window) {
            window.setPosition(2,33);
        };

        util.gui.window.addHideOnBlurHandler = function(w) {
            var maskElements = Ext.query('.x-mask'),
                el = Ext.get(maskElements[maskElements.length - 1]);

            el.on('click', function() {
                if (w.hideOnBlur) {
                    w.hide();
                }
            });

            w.hasHideOnBlurHandler = true;
        };

        util.gui.window.addDestroyOnBlurHandler = function(w) {
            var maskElements = Ext.query('.x-mask'),
                el = Ext.get(maskElements[maskElements.length - 1]);

            el.on('click', function() {
                if (w.destroyOnBlur) {
                    w.destroy();
                }
            });

            w.hasDestroyOnBlurHandler = true;
        };

        util.gui.window.setAnchorPosition = function(w, target) {
            var vpw = gis.viewport.getWidth(),
                targetx = target ? target.getPosition()[0] : 4,
                winw = w.getWidth(),
                y = target ? target.getPosition()[1] + target.getHeight() + 4 : 33;

            if ((targetx + winw) > vpw) {
                w.setPosition((vpw - winw - 2), y);
            }
            else {
                w.setPosition(targetx, y);
            }
        };

        util.layout = {};

        util.layout.getAnalytical = function(map) {
            var layout,
                layer;

            if (isObject(map) && isArray(map.mapViews) && map.mapViews.length) {
                for (var i = 0, view, id; i < map.mapViews.length; i++) {
                    view = map.mapViews[i];
                    id = view.layer;

                    if (gis.layer.hasOwnProperty(id) && gis.layer[id].layerCategory === gis.conf.finals.layer.category_thematic) {
                        layout = gis.api.layout.Layout(view);

                        if (layout) {
                            return layout;
                        }
                    }
                }
            }
            else {
                for (var key in gis.layer) {
                    if (gis.layer.hasOwnProperty(key) && gis.layer[key].layerCategory === gis.conf.finals.layer.category_thematic && gis.layer[key].core.view) {
                        layer = gis.layer[key];
                        layout = gis.api.layout.Layout(layer.core.view);

                        if (layout) {
                            if (!layout.parentGraphMap && layer.widget) {
                                layout.parentGraphMap = layer.widget.getParentGraphMap();
                            }

                            return layout;
                        }
                    }
                }
            }

            return;
        };

        util.layout.getPluginConfig = function() {
            var layers = gis.util.map.getVisibleVectorLayers(),
                map = {};

            if (gis.map) {
                return gis.map;
            }

            map.mapViews = [];

            for (var i = 0, layer; i < layers.length; i++) {
                layer = layers[i];

                if (layer.view) {
                    layer.view.layer = layer.id;

                    map.mapViews.push(layer.view);
                }
            }

            return map;
        };

        util.layout.setSessionStorage = function(session, obj, url) {
            if (GIS.isSessionStorage) {
                var dhis2 = JSON.parse(sessionStorage.getItem('dhis2')) || {};
                dhis2[session] = obj;
                sessionStorage.setItem('dhis2', JSON.stringify(dhis2));

                if (isString(url)) {
                    window.location.href = url;
                }
            }
        };
    }());

    // init
    (function() {

        // root nodes
        for (var i = 0; i < init.rootNodes.length; i++) {
            init.rootNodes[i].path = '/root/' + init.rootNodes[i].id;
        }

        // sort organisation unit levels
        util.array.sort(init.organisationUnitLevels, 'ASC', 'level');

        // sort indicator groups
        util.array.sort(init.indicatorGroups);

        // sort data element groups
        util.array.sort(init.dataElementGroups);
    }());

    // store
    (function() {
        store.periodTypes = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: gis.conf.period.periodTypes
        });

        store.groupSets = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            proxy: {
                type: 'ajax',
                url: encodeURI(gis.init.contextPath + '/api/organisationUnitGroupSets.json?fields=id,' + gis.init.namePropertyUrl + '&paging=false'),
                reader: {
                    type: 'json',
                    root: 'organisationUnitGroupSets'
                }
            },
            isLoaded: false,
            loadFn: function(fn) {
                if (this.isLoaded) {
                    fn.call();
                }
                else {
                    this.load(fn);
                }
            },
            listeners: {
                load: function() {
                    if (!this.isLoaded) {
                        this.isLoaded = true;
                    }
                    this.sort('name', 'ASC');
                }
            }
        });

        store.groupsByGroupSet = Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'symbol'],
        });

        store.organisationUnitGroup = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            proxy: {
                type: 'ajax',
                url: encodeURI(init.contextPath + '/api/organisationUnitGroups.json?fields=id,' + gis.init.namePropertyUrl + '&paging=false'),
                reader: {
                    type: 'json',
                    root: 'organisationUnitGroups'
                }
            }
        });

        store.legendSets = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            proxy: {
                type: 'ajax',
                url: encodeURI(gis.init.contextPath + '/api/legendSets.json?fields=id,displayName|rename(name)&paging=false'),
                reader: {
                    type: 'json',
                    root: 'legendSets'
                }
            },
            isLoaded: false,
            loadFn: function(fn) {
                if (this.isLoaded) {
                    fn.call();
                }
                else {
                    this.load(fn);
                }
            },
            listeners: {
                load: function() {
                    if (!this.isLoaded) {
                        this.isLoaded = true;
                    }
                    this.sort('name', 'ASC');
                }
            }
        });

        store.maps = Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'access'],
            proxy: {
                type: 'ajax',
                reader: {
                    type: 'json',
                    root: 'maps'
                }
            },
            isLoaded: false,
            pageSize: 10,
            page: 1,
            defaultUrl: encodeURI(gis.init.contextPath + '/api/maps.json?fields=id,displayName|rename(name),access'),
            loadStore: function(url) {
                this.proxy.url = url || this.defaultUrl;

                this.load({
                    params: {
                        pageSize: this.pageSize,
                        page: this.page
                    }
                });
            },
            loadFn: function(fn) {
                if (this.isLoaded) {
                    fn.call();
                }
                else {
                    this.load(fn);
                }
            },
            listeners: {
                load: function() {
                    if (!this.isLoaded) {
                        this.isLoaded = true;
                    }

                    this.sort('name', 'ASC');
                }
            }
        });
    }());

    // layer
    (function() {
        layer = gis.layer.event;
        layer.menu = GIS.app.LayerMenu(gis, layer, 'gis-toolbar-btn-menu-first');
        layer.widget = GIS.app.LayerWidgetEvent(gis, layer);
        layer.window = GIS.app.WidgetWindow(gis, layer, gis.conf.layout.widget.window_width + 150, 1);
        layer.window.widget = layer.widget;

        layer = gis.layer.facility;
        layer.menu = GIS.app.LayerMenu(gis, layer);
        layer.widget = GIS.app.LayerWidgetFacility(gis, layer);
        layer.window = GIS.app.WidgetWindow(gis, layer);
        layer.window.widget = layer.widget;

        layer = gis.layer.thematic1;
        layer.menu = GIS.app.LayerMenu(gis, layer);
        layer.widget = GIS.app.LayerWidgetThematic(gis, layer);
        layer.window = GIS.app.WidgetWindow(gis, layer);
        layer.window.widget = layer.widget;

        layer = gis.layer.thematic2;
        layer.menu = GIS.app.LayerMenu(gis, layer);
        layer.widget = GIS.app.LayerWidgetThematic(gis, layer);
        layer.window = GIS.app.WidgetWindow(gis, layer);
        layer.window.widget = layer.widget;

        layer = gis.layer.thematic3;
        layer.menu = GIS.app.LayerMenu(gis, layer);
        layer.widget = GIS.app.LayerWidgetThematic(gis, layer);
        layer.window = GIS.app.WidgetWindow(gis, layer);

        layer = gis.layer.thematic4;
        layer.menu = GIS.app.LayerMenu(gis, layer);
        layer.widget = GIS.app.LayerWidgetThematic(gis, layer);
        layer.window = GIS.app.WidgetWindow(gis, layer);
        layer.window.widget = layer.widget;

        layer = gis.layer.boundary;
        layer.menu = GIS.app.LayerMenu(gis, layer);
        layer.widget = GIS.app.LayerWidgetBoundary(gis, layer);
        layer.window = GIS.app.WidgetWindow(gis, layer);
        layer.window.widget = layer.widget;
    }());
};