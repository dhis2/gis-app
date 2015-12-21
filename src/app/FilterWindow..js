GIS.app.FilterWindow = function(layer) {
    var lowerNumberField,
        greaterNumberField,
        lt,
        gt,
        filter,
        window;

    greaterNumberField = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        fieldLabel: 'Greater than',
        width: 200,
        value: parseInt(layer.core.minVal),
        listeners: {
            change: function() {
                gt = this.getValue();
            }
        }
    });

    lowerNumberField = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        fieldLabel: 'And/or lower than',
        style: 'margin-bottom: 0',
        width: 200,
        value: parseInt(layer.core.maxVal) + 1,
        listeners: {
            change: function() {
                lt = this.getValue();
            }
        }
    });

    filter = function() {
        var cache = layer.core.featureStore.features.slice(0),
            features = [];

        if (!gt && !lt) {
            features = cache;
        }
        else if (gt && lt) {
            for (var i = 0; i < cache.length; i++) {
                if (gt < lt && (cache[i].attributes.value > gt && cache[i].attributes.value < lt)) {
                    features.push(cache[i]);
                }
                else if (gt > lt && (cache[i].attributes.value > gt || cache[i].attributes.value < lt)) {
                    features.push(cache[i]);
                }
                else if (gt === lt && cache[i].attributes.value === gt) {
                    features.push(cache[i]);
                }
            }
        }
        else if (gt && !lt) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].attributes.value > gt) {
                    features.push(cache[i]);
                }
            }
        }
        else if (!gt && lt) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].attributes.value < lt) {
                    features.push(cache[i]);
                }
            }
        }

        layer.removeAllFeatures();
        layer.addFeatures(features);
    };

    window = Ext.create('Ext.window.Window', {
        title: 'Filter by value',
        iconCls: 'gis-window-title-icon-filter',
        bodyStyle: 'background-color: #fff; padding: 1px',
        resizable: false,
        filter: filter,
        items: [
            {
                xtype: 'container',
                style: 'padding: 4px; border: 0 none',
                html: '<b>Show</b> organisation units with values..'
            },
            {
                xtype: 'container',
                height: 7
            },
            greaterNumberField,
            lowerNumberField
            //{
            //layout: 'column',
            //height: 22,
            //cls: 'gis-container-inner',
            //items: [
            //{
            //cls: 'gis-panel-html-label',
            //html: 'Greater than:',
            //width: gis.conf.layout.tool.item_width - gis.conf.layout.tool.itemlabel_width
            //},
            //greaterNumberField
            //]
            //},
            //{
            //cls: 'gis-panel-html-separator'
            //},
            //{
            //layout: 'column',
            //height: 22,
            //cls: 'gis-container-inner',
            //items: [
            //{
            //cls: 'gis-panel-html-label',
            //html: 'And/or lower than:',
            //width: gis.conf.layout.tool.item_width - gis.conf.layout.tool.itemlabel_width
            //},
            //lowerNumberField
            //]
            //}
            //]
        ],
        bbar: [
            '->',
            {
                xtype: 'button',
                text: GIS.i18n.update,
                handler: function() {
                    filter();
                }
            }
        ],
        listeners: {
            render: function() {
                gis.util.gui.window.setPositionTopLeft(this);
            },
            destroy: function() {
                layer.removeAllFeatures();
                layer.addFeatures(layer.core.featureStore.features);
            }
        }
    });

    return window;
};