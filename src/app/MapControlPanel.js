GIS.app.MapControlPanel = function(name, fn) {
    var button,
        panel;

    button = new OpenLayers.Control.Button({
        displayClass: 'olControlButton',
        trigger: function() {
            fn.call(gis.olmap);
        }
    });

    panel = new OpenLayers.Control.Panel({
        defaultControl: button
    });

    panel.addControls([button]);

    return panel;
};