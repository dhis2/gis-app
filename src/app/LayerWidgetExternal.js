// Ext JS widget for external layers (WMS/TMS/XYZ)
export default function LayerWidgetExternal(gis, layer) {

    // Store for external layers
    const externalStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name', 'mapService', 'url', 'layers', 'attribution', 'mapLayerPosition', 'imageFormat', 'legendSet', 'legendSetUrl'],
        proxy: {
            type: 'ajax',
            url: encodeURI(gis.init.apiPath + 'externalMapLayers.json?fields=id,displayName~rename(name),service,url,attribution,mapService,layers,imageFormat,mapLayerPosition,legendSet,legendSetUrl&paging=false'),
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
        forceSelection: true,
        labelWidth: 70,
        width: gis.conf.layout.widget.item_width,
        store: externalStore
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