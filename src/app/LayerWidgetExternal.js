// Ext JS widget for external layers (WMS/TMS/XYZ)
export default function LayerWidgetExternal(gis, layer) {

    const externalCombo = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.select_layer,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        labelWidth: 70,
        width: gis.conf.layout.widget.item_width,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'service', 'url', 'layers', 'attribution', 'placement'],
            data: [{
                id: '1',
                name: 'Carto Dark Matter Basemap',
                service: 'xyz',
                url: '//cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
                placement: 'basemap',
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
            }, {
                id: '12',
                name: 'Carto Labels Overlay',
                service: 'xyz',
                url: '//cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png',
                placement: 'overlay',
                attribution: '© OpenStreetMap, © CartoDB</a>',
            }, {
                id: '123',
                name: 'Blue Marble WMS',
                service: 'wms',
                layers: 'nasa:bluemarble',
                url: '//demo.opengeo.org/geoserver/ows',
                placement: 'basemap',
                attribution: 'OpenGeo/NASA',
            }, {
                id: '1234',
                name: 'Natural Earth TMS',
                service: 'tms',
                url: '//demo.opengeo.org/geoserver/gwc/service/tms/1.0.0/ne:ne@EPSG:900913@png/{z}/{x}/{y}.png',
                placement: 'basemap',
                attribution: 'Natural Earth'
            }]
        }),
        listeners: {
            render() { // Select first record (WMS)
                // this.select(this.getStore().getAt(2)); // TODO: change to 0
            },
            change() { // Show/hide WMS layers field
                /*
                if (this.getValue() === 'wms') {
                    layersField.show();
                } else {
                    layersField.hide();
                }
                */
            }
        }
    });



    // Combo with with supported web map services (WMS/TMS/XYZ)
    const serviceCombo = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.select_service,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: [{
                id: 'wms',
                name: 'WMS'
            },{
                id: 'tms',
                name: 'TMS'
            },{
                id: 'xyz',
                name: 'XYZ'
            }],
        }),
        listeners: {
            render() { // Select first record (WMS)
                this.select(this.getStore().getAt(2)); // TODO: change to 0
            },
            change() { // Show/hide WMS layers field
                if (this.getValue() === 'wms') {
                    layersField.show();
                } else {
                    layersField.hide();
                }
            }
        }
    });

    // Web service URL field
    const urlField = Ext.create('Ext.form.field.Text', {
        cls: 'gis-combo',
        value: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', // TODO: remove
        fieldLabel: GIS.i18n.service_url,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width
    });

    // WMS layers field
    const layersField = Ext.create('Ext.form.field.Text', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.layers,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width,
        hidden: true
    });

    // Layer attribution field
    const attributionField = Ext.create('Ext.form.field.Text', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.attribution,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width
    });

    // Lapyer placement combo (overlay/basemap)
    const placementCombo = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.placement,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: [{
                id: 'overlay',
                name: 'Overlay'
            },{
                id: 'basemap',
                name: 'Basemap'
            }]
        }),
        listeners: {
            render() { // Select first record (WMS)
                this.select(this.getStore().getAt(0));
            }
        }
    });

    // TODO: Reset this widget
    const reset = function() {
        console.log('reset');
    };

    // TODO: Poulate the widget from a view (favorite)
    const setGui = function(view) {
        console.log('setGui');
    };

    // Get the view representation of the layer

    /*
    const getView = function() {
        const service = serviceCombo.getValue();
        const url = urlField.getValue();
        const layers = layersField.getValue();
        const attribution = attributionField.getValue();
        const placement = placementCombo.getValue();

        const view = {
            service,
            url,
            attribution,
            placement
        };

        if (layers) {
            view.layers = layers;
        }

        return view;
    };
    */

    const getView = function() {
        const external = externalCombo.getStore().getById(externalCombo.getValue());
        const view = { // Config object stored as one field in favorite
            config: external.data
        };
        return view;
    };

    // Return widget panel
    return Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border:0;padding:5px 1px;',
        // items: [serviceCombo, urlField, layersField, attributionField, placementCombo],
        items: [externalCombo],
        map: layer.map,
        layer: layer,
        menu: layer.menu,

        reset: reset,
        setGui: setGui,
        getView: getView,

        listeners: {
            added: function() {
                layer.accordion = this;
            }
        }
    });

}