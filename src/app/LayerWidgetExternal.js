export default function LayerWidgetExternal(gis, layer) {

    // Combo with with supported Earth Engine layers
    const serviceCombo = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        // fieldLabel: GIS.i18n.select_layer_from_google_earth_engine,
        fieldLabel: 'Select service', // TODO: i18n
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
                this.select(this.getStore().getAt(2));
            },
            change() { // Show/hide WMS layers field
                layersField[this.getValue() === 'wms' ? 'show' : 'hide']();
            }
        }
    });

    const urlField = Ext.create('Ext.form.field.Text', {
        cls: 'gis-combo',
        fieldLabel: 'Service URL', // TODO: i18n
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width
    });

    const layersField = Ext.create('Ext.form.field.Text', {
        cls: 'gis-combo',
        fieldLabel: 'Layers', // TODO: i18n
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width,
        hidden: true
    });

    const attributionField = Ext.create('Ext.form.field.Text', {
        cls: 'gis-combo',
        fieldLabel: 'Attribution', // TODO: i18n
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width
    });


    // Reset this widget
    const reset = function() {

    };

    // Poulate the widget from a view (favorite)
    const setGui = function(view) {

    };

    // Get the view representation of the layer
    const getView = function() {
        const service = serviceCombo.getValue();
        const url = urlField.getValue();
        const layers = layersField.getValue();
        const attribution = attributionField.getValue();

        const view = {
            service,
            url,
            attribution
        };

        if (layers) {
            view.layers = layers;
        }

        return view;
    };

    // Return widget panel
    return Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border:0;padding:5px 1px;',
        items: [serviceCombo, urlField, layersField, attributionField],
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