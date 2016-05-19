export default function LayerWidgetEarthEngine(gis, layer) {
    var panel,
        datasets,
        combo,
        getView,
        panel;

    datasets = [{
        id: 'srtm90_v4',
        name: 'Elevation',
        config: {
            min: 0,
            max: 2000,
            palette: '6EDC6E, F0FAA0, E6DCAA, DCDCDC, FAFAFA'
        },
        attribution: '<a href="http://srtm.csi.cgiar.org/">NASA / CIGAR</a>'
    }, {
        id: 'WorldPop/POP',
        name: 'Population density',
        filter: [{
            type: 'eq',
            arguments: ['year', 2010]
        },{
            type: 'eq',
            arguments: ['UNadj', 'yes']
        }],
        config: {
            min: 0,
            max: 250,
            palette: '#ffffd4, #fee391, #fec44f, #fe9929, #ec7014, #cc4c02, #8c2d04'
        },
        attribution: '<a href="http://www.worldpop.org.uk/">WorldPop</a>'
    }];

    combo = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.select_earth_engine_layer,
        // labelSeparator: '',
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        // forceSelection: true,
        width: 220,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        labelAlign: 'top',
        labelCls: 'gis-form-item-label-top',
        style: 'padding:5px 5px 10px 5px;',
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: datasets
        }),
        listeners: {
            /*
            select: function () {
                var id = this.getValue();
                var data = this.valueModels[0].raw;
            },
            */
            afterRender: function() {
                this.setValue(this.store.getAt(0).data.id);
            }
        }
    });

    getView = function() {
        var id = combo.getValue(),
            record = combo.store.findRecord('id', id);

        if (id === null || record === null) {
            return;
        }

        /*
        var view = {
            id: record.raw.id, // TODO
            config: record.raw.config
        };
        */

        //return view;
        return record.raw;
    };

    panel = Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border-style:none; padding:1px; padding-bottom:0',
        items: [combo],
        //panels: accordionPanels,

        map: layer.map,
        layer: layer,
        menu: layer.menu,

        //reset: reset,
        //setGui: setGui,
        getView: getView,

        listeners: {
            added: function() {
                layer.accordion = this;
            }
        }
    });

    return panel;
};