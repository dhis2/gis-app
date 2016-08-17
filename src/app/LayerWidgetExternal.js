export default function LayerWidgetExternal(gis, layer) {

    // Reset this widget
    const reset = function() {

    };

    // Poulate the widget from a view (favorite)
    const setGui = function(view) {

    };

    // Get the view representation of the layer
    const getView = function() {
        const view = {};

        return view;
    };

    // Return widget panel
    return Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border:0;padding:5px 1px;',
        items: [],
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