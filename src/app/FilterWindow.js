export default function FilterWindow(gis, layer) {
    let lt;
    let gt;

    const greaterNumberField = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        fieldLabel: GIS.i18n.greater_than,
        width: 200,
        value: layer.minValue,
        listeners: {
            change() {
                gt = this.getValue();
            }
        }
    });

    const lowerNumberField = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        fieldLabel: GIS.i18n.and_or_lower_than,
        style: 'margin-bottom: 0',
        width: 200,
        value: layer.maxValue + 1,
        listeners: {
            change() {
                lt = this.getValue();
            }
        }
    });

    const filter = function() {
        const cache = layer.featureStore.features.slice(0);
        let features = [];

        if (!gt && !lt) {
            features = cache;
        }
        else if (gt && lt) {
            for (let i = 0; i < cache.length; i++) {
                if (gt < lt && (cache[i].properties.value > gt && cache[i].properties.value < lt)) {
                    features.push(cache[i]);
                }
                else if (gt > lt && (cache[i].properties.value > gt || cache[i].properties.value < lt)) {
                    features.push(cache[i]);
                }
                else if (gt === lt && cache[i].properties.value === gt) {
                    features.push(cache[i]);
                }
            }
        }
        else if (gt && !lt) {
            for (let i = 0; i < cache.length; i++) {
                if (cache[i].properties.value > gt) {
                    features.push(cache[i]);
                }
            }
        }
        else if (!gt && lt) {
            for (let i = 0; i < cache.length; i++) {
                if (cache[i].properties.value < lt) {
                    features.push(cache[i]);
                }
            }
        }

        layer.instance.clearLayers();
        layer.instance.addData(features);
    };

    const window = Ext.create('Ext.window.Window', {
        title: GIS.i18n.filter_by_value,
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
        ],
        bbar: [
            '->',
            {
                xtype: 'button',
                text: GIS.i18n.update,
                handler: filter

            }
        ],
        listeners: {
            render() {
                gis.util.gui.window.setPositionTopLeft(this);
            },
            destroy() {
                layer.instance.clearLayers();
                layer.instance.addData(layer.featureStore.features);
            }
        }
    });

    return window;
};