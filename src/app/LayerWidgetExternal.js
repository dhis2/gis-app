// Ext JS widget for external layers (WMS/TMS/XYZ)
export default function LayerWidgetExternal(gis, layer) {

    // Store for external layers
    const externalStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name', 'mapService', 'url', 'layers', 'attribution', 'mapLayerPosition', 'imageFormat', 'legendSet', 'legendSetUrl'],
        proxy: {
            type: 'ajax',
            url: encodeURI(gis.init.apiPath + 'externalMapLayers.json?fields=id,displayName|rename(name),service,url,attribution,mapService,layers,imageFormat,mapLayerPosition,legendSet,legendSetUrl&paging=false'),
            reader: {
                type: 'json',
                root: 'externalMapLayers'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    });

    const externalCombo = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.select_layer,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        // queryMode: 'local',
        forceSelection: true,
        labelWidth: 70,
        width: gis.conf.layout.widget.item_width,
        store: externalStore
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

    // Reset this widget
    const reset = function() {
        externalCombo.reset();
    };

    // Poulate the widget from a view (favorite)
    const setGui = function(view) {
        if (typeof view.config === 'string') {
            view.config = JSON.parse(view.config);
        }

        if (view.config.id) {
            externalCombo.setValue(view.config.id);
        }
    };

    // Get the view representation of the layer
    const getView = function() {
        const external = externalCombo.getStore().getById(externalCombo.getValue());

        return {
            config: external.data // Config object stored as one field in favorite
        };
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