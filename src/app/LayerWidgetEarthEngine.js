export default function LayerWidgetEarthEngine(gis, layer) {
    var panel;


    panel = Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border-style:none; padding:1px; padding-bottom:0',
        //items: accordionBody,
        //panels: accordionPanels,

        map: layer.map,
        layer: layer,
        menu: layer.menu,

        //reset: reset,
        //setGui: setGui,
        //getView: getView,

        listeners: {
            added: function() {
                layer.accordion = this;
            }
        }
    });


    return panel;
};