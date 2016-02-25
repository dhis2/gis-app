export default function FilterWindowFacility(gis, layer) {
    var window,
        multiSelect,
        button,
        filter,
        selection,
        features = [],
        coreFeatures = layer.core.featureStore.features.slice(0),
        groupSetName = layer.core.view.organisationUnitGroupSet.name,
        store = gis.store.groupsByGroupSet;

    filter = function() {
        features = [];

        if (!selection.length || !selection[0]) {
            features = coreFeatures;
        }
        else {
            for (var i = 0; i < coreFeatures.length; i++) {
                for (var j = 0; j < selection.length; j++) {
                    if (coreFeatures[i].attributes[groupSetName] === selection[j]) {
                        features.push(coreFeatures[i]);
                    }
                }
            }
        }

        layer.removeAllFeatures();
        layer.addFeatures(features);
    };

    multiSelect = Ext.create('Ext.ux.form.MultiSelect', {
        hideLabel: true,
        dataFields: ['id', 'name'],
        valueField: 'name',
        displayField: 'name',
        width: 200,
        height: 300,
        store: store
    });

    button = Ext.create('Ext.button.Button', {
        text: 'Filter',
        handler: function() {
            selection = multiSelect.getValue();
            filter();
        }
    });

    window = Ext.create('Ext.window.Window', {
        title: 'Filter by value',
        iconCls: 'gis-window-title-icon-filter',
        cls: 'gis-container-default',
        resizable: false,
        filter: filter,
        items: multiSelect,
        bbar: [
            '->',
            button
        ],
        listeners: {
            render: function() {
                gis.util.gui.window.setPositionTopLeft(this);
            },
            destroy: function() {
                layer.removeAllFeatures();
                layer.addFeatures(coreFeatures);
            }
        }
    });

    return window;
};
