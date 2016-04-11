import arraySort from 'd2-utilizr/lib/arraySort';
import isDefined from 'd2-utilizr/lib/isDefined';
import isNumber from 'd2-utilizr/lib/isNumber';

export default function LegendSetWindow(gis) {

    // Stores
    var legendSetStore,
        legendStore,
        tmpLegendStore,

    // Objects
        LegendSetPanel,
        LegendPanel,

    // Instances
        legendSetPanel,
        legendPanel,

    // Components
        window,
        legendSetName,
        legendName,
        startValue,
        endValue,
        color,
        legendGrid,
        create,
        update,
        cancel,
        info,

    // Functions
        showUpdateLegendSet,
        deleteLegendSet,
        deleteLegend,
        getRequestBody,
        reset,
        validateLegends,

        windowWidth = 450,
        windowBorder = 12,
        bodyPadding = 2,

        legendBodyBorder = 1,
        legendBodyPadding = 1,
        fieldLabelWidth = 105,
        gridPadding = 1;

    legendSetStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        proxy: {
            type: 'ajax',
            url: encodeURI(gis.init.contextPath + '/api/legendSets.json?fields=id,displayName|rename(name)&paging=false'),
            reader: {
                type: 'json',
                root: 'legendSets'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        },
        listeners: {
            load: function(store, records) {
                this.sort('name', 'ASC');

                info.setText(records.length + ' legend set' + (records.length !== 1 ? 's' : '') + ' available');
            }
        }
    });

    legendStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name', 'startValue', 'endValue', 'color'],
        proxy: {
            type: 'ajax',
            url: '',
            reader: {
                type: 'json',
                root: 'legends'
            }
        },
        deleteLegend: deleteLegend,
        listeners: {
            load: function(store, records) {
                var data = [];

                for (var i = 0; i < records.length; i++) {
                    data.push(records[i].data);
                }

                arraySort(data, function (a, b) {
                    return a.startValue - b.startValue;
                });

                tmpLegendStore.add(data);

                info.setText(records.length + ' legend sets available');
            }
        }
    });

    LegendSetPanel = function() {
        var items,
            addButton,
            legendSetGrid;

        addButton = Ext.create('Ext.button.Button', {
            text: GIS.i18n.add_new,
            height: 26,
            style: 'border-radius: 1px',
            menu: {},
            handler: function() {
                showUpdateLegendSet();
            }
        });

        legendSetGrid = Ext.create('Ext.grid.Panel', {
            cls: 'gis-grid',
            scroll: 'vertical',
            height: true,
            hideHeaders: true,
            currentItem: null,
            columns: [
                {
                    dataIndex: 'name',
                    sortable: false,
                    width: 369
                },
                {
                    xtype: 'actioncolumn',
                    sortable: false,
                    width: 40,
                    items: [
                        {
                            iconCls: 'gis-grid-row-icon-edit',
                            getClass: function() {
                                return 'tooltip-legendset-edit';
                            },
                            handler: function(grid, rowIndex, colIndex, col, event) {
                                var id = this.up('grid').store.getAt(rowIndex).data.id;
                                showUpdateLegendSet(id);
                            }
                        },
                        {
                            iconCls: 'gis-grid-row-icon-delete',
                            getClass: function() {
                                return 'tooltip-legendset-delete';
                            },
                            handler: function(grid, rowIndex, colIndex, col, event) {
                                var record = this.up('grid').store.getAt(rowIndex),
                                    id = record.data.id,
                                    name = record.data.name,
                                    message = 'Delete legend set?\n\n' + name;

                                if (confirm(message)) {
                                    deleteLegendSet(id);
                                }
                            }
                        }
                    ]
                },
                {
                    sortable: false,
                    width: 17
                }
            ],
            store: legendSetStore,
            listeners: {
                render: function() {
                    var that = this,
                        maxHeight = gis.viewport.centerRegion.getHeight() - 155,
                        height;

                    this.store.on('load', function() {
                        if (isDefined(that.setHeight)) {
                            height = 1 + that.store.getCount() * gis.conf.layout.grid.row_height;
                            that.setHeight(height > maxHeight ? maxHeight : height);
                            window.doLayout();
                        }
                    });

                    this.store.load();
                },
                afterrender: function() {
                    var fn = function() {
                        var editArray = document.getElementsByClassName('tooltip-legendset-edit'),
                            deleteArray = document.getElementsByClassName('tooltip-legendset-delete'),
                            len = editArray.length,
                            el;

                        for (var i = 0; i < len; i++) {
                            el = editArray[i];
                            Ext.create('Ext.tip.ToolTip', {
                                target: el,
                                html: 'Edit',
                                'anchor': 'bottom',
                                anchorOffset: -14,
                                showDelay: 1000
                            });

                            el = deleteArray[i];
                            Ext.create('Ext.tip.ToolTip', {
                                target: el,
                                html: 'Delete',
                                'anchor': 'bottom',
                                anchorOffset: -14,
                                showDelay: 1000
                            });
                        }
                    };

                    Ext.defer(fn, 100);
                },
                itemmouseenter: function(grid, record, item) {
                    this.currentItem = Ext.get(item);
                    this.currentItem.removeCls('x-grid-row-over');
                },
                select: function() {
                    this.currentItem.removeCls('x-grid-row-selected');
                },
                selectionchange: function() {
                    this.currentItem.removeCls('x-grid-row-focused');
                }
            }
        });

        items = [
            {
                xtype: 'panel',
                layout: 'hbox',
                cls: 'gis-container-inner',
                bodyStyle: 'padding: 0',
                style: 'margin-bottom: 1px',
                items: [
                    addButton
                ]
            },
            legendSetGrid
        ];

        return items;
    };

    LegendPanel = function(id) {
        var panel,
            addLegend,
            LegendEditWindow,
            validateEditLegendForm,
            showUpdateLegend;

        // edit legend panel
        LegendEditWindow = function(record) {
            var editLegendName,
                editStartValue,
                editEndValue,
                editColor,
                editCancel,
                editUpdate,
                editWindow;

            editLegendName = Ext.create('Ext.form.field.Text', {
                cls: 'gis-textfield',
                width: windowWidth - windowBorder - bodyPadding - (2 * legendBodyBorder) - (2 * legendBodyPadding) + 4,
                height: 23,
                fieldStyle: 'padding-left: 3px; border-color: #bbb',
                labelStyle: 'padding-top: 5px; padding-left: 3px',
                fieldLabel: GIS.i18n.legend_name,
                value: record.data.name
            });

            editStartValue = Ext.create('Ext.form.field.Number', {
                width: 163 + 2,
                height: 23,
                allowDecimals: true,
                style: 'margin-bottom: 0px',
                value: record.data.startValue
            });

            editEndValue = Ext.create('Ext.form.field.Number', {
                width: 163 + 2,
                height: 23,
                allowDecimals: true,
                style: 'margin-bottom: 0px; margin-left: 1px',
                value: record.data.endValue
            });

            editColor = Ext.create('Ext.ux.button.ColorButton', {
                width: windowWidth - windowBorder - bodyPadding - (2 * legendBodyBorder) - (2 * legendBodyPadding) - fieldLabelWidth + 4,
                height: 23,
                style: 'border-radius: 1px',
                value: record.data.color.replace('#', '')
            });

            validateEditLegendForm = function() {
                if (!(editLegendName.getValue() && isNumber(editStartValue.getValue()) && isNumber(editEndValue.getValue()) && editColor.getValue())) {
                    return;
                }

                if (editStartValue.getValue() >= editEndValue.getValue()) {
                    return;
                }

                return true;
            };

            editCancel = Ext.create('Ext.button.Button', {
                text: GIS.i18n.cancel,
                handler: function() {
                    editWindow.destroy();
                }
            });

            editUpdate = Ext.create('Ext.button.Button', {
                text: GIS.i18n.update,
                handler: function() {
                    if (!validateEditLegendForm()) {
                        return;
                    }

                    record.set('name', editLegendName.getValue());
                    record.set('startValue', editStartValue.getValue());
                    record.set('endValue', editEndValue.getValue());
                    record.set('color', '#' + editColor.getValue());

                    editWindow.destroy();
                    window.isDirty = true;
                    tmpLegendStore.sort('startValue', 'ASC');
                }
            });

            editWindow = Ext.create('Ext.window.Window', {
                title: GIS.i18n.edit_legend + ' (' + record.data.name + ')',
                width: windowWidth,
                modal: true,
                shadow: true,
                resizable: false,
                bodyStyle: 'background: #fff; padding: 1px',
                bbar: [
                    editCancel,
                    '->',
                    editUpdate
                ],
                items: [
                    editLegendName,
                    {
                        layout: 'hbox',
                        cls: 'gis-container-inner',
                        bodyStyle: 'background: transparent',
                        items: [
                            {
                                html: GIS.i18n.start_end_value + ':',
                                width: fieldLabelWidth,
                                bodyStyle: 'background:transparent; padding-top:3px; padding-left:3px'
                            },
                            editStartValue,
                            editEndValue
                        ]
                    },
                    {
                        layout: 'column',
                        cls: 'gis-container-inner',
                        bodyStyle: 'background: transparent',
                        items: [
                            {
                                html: GIS.i18n.legend_symbolizer + ':',
                                width: fieldLabelWidth,
                                bodyStyle: 'background:transparent; padding-top:3px; padding-left:3px'
                            },
                            editColor
                        ]
                    }
                ]
            });

            return editWindow;
        };

        showUpdateLegend = function(record) {
            LegendEditWindow(record).showAt(window.getPosition()[0], window.getPosition()[1] + 55);
        };

        // legend panel
        tmpLegendStore = Ext.create('Ext.data.ArrayStore', {
            fields: ['id', 'name', 'startValue', 'endValue', 'color']
        });

        legendSetName = Ext.create('Ext.form.field.Text', {
            cls: 'gis-textfield',
            width: windowWidth - windowBorder - bodyPadding,
            height: 25,
            fieldStyle: 'padding-left: 5px; border-color: #bbb',
            labelStyle: 'padding-top: 5px; padding-left: 3px',
            fieldLabel: GIS.i18n.legend_set_name,
            style: 'margin-bottom: 6px'
        });

        legendName = Ext.create('Ext.form.field.Text', {
            cls: 'gis-textfield',
            width: windowWidth - windowBorder - bodyPadding - (2 * legendBodyBorder) - (2 * legendBodyPadding),
            height: 23,
            fieldStyle: 'padding-left: 3px; border-color: #bbb',
            labelStyle: 'padding-top: 5px; padding-left: 3px',
            fieldLabel: GIS.i18n.legend_name
        });

        startValue = Ext.create('Ext.form.field.Number', {
            width: 163,
            height: 23,
            allowDecimals: true,
            style: 'margin-bottom: 0px',
            value: 0
        });

        endValue = Ext.create('Ext.form.field.Number', {
            width: 163,
            height: 23,
            allowDecimals: true,
            style: 'margin-bottom: 0px; margin-left: 1px',
            value: 0
        });

        color = Ext.create('Ext.ux.button.ColorButton', {
            width: windowWidth - windowBorder - bodyPadding - (2 * legendBodyBorder) - (2 * legendBodyPadding) - fieldLabelWidth,
            height: 23,
            style: 'border-radius: 1px',
            value: 'e1e1e1'
        });

        addLegend = Ext.create('Ext.button.Button', {
            text: GIS.i18n.add_legend,
            height: 26,
            style: 'border-radius: 1px',
            handler: function() {
                var date = new Date(),
                    id = date.toISOString(),
                    ln = legendName.getValue(),
                    sv = startValue.getValue(),
                    ev = endValue.getValue(),
                    co = color.getValue().toUpperCase(),
                    items = tmpLegendStore.data.items,
                    data = [];

                if (ln && (ev > sv)) {
                    for (var i = 0; i < items.length; i++) {
                        data.push(items[i].data);
                    }

                    data.push({
                        id: id,
                        name: ln,
                        startValue: sv,
                        endValue: ev,
                        color: '#' + co
                    });

                    arraySort(data, function (a, b) {
                        return a.startValue - b.startValue;
                    });

                    tmpLegendStore.removeAll();
                    tmpLegendStore.add(data);

                    legendName.reset();
                    startValue.reset();
                    endValue.reset();
                    color.reset();

                    window.isDirty = true;
                }
            }
        });

        legendGrid = Ext.create('Ext.grid.Panel', {
            cls: 'gis-grid',
            bodyStyle: 'border-top: 0 none',
            width: windowWidth - windowBorder - bodyPadding - (2 * gridPadding),
            height: 235,
            scroll: 'vertical',
            hideHeaders: true,
            currentItem: null,
            columns: [
                {
                    dataIndex: 'name',
                    sortable: false,
                    width: 236
                },
                {
                    sortable: false,
                    width: 45,
                    renderer: function(value, metaData, record) {
                        return '<span style="color:' + record.data.color + '">Color</span>';
                    }
                },
                {
                    dataIndex: 'startValue',
                    sortable: false,
                    width: 45
                },
                {
                    dataIndex: 'endValue',
                    sortable: false,
                    width: 45
                },
                {
                    xtype: 'actioncolumn',
                    sortable: false,
                    width: 40,
                    items: [
                        {
                            iconCls: 'gis-grid-row-icon-edit',
                            getClass: function() {
                                return 'tooltip-legendset-edit';
                            },
                            handler: function(grid, rowIndex, colIndex, col, event) {
                                var record = this.up('grid').store.getAt(rowIndex);
                                showUpdateLegend(record);
                            }
                        },
                        {
                            iconCls: 'gis-grid-row-icon-delete',
                            getClass: function() {
                                return 'tooltip-legend-delete';
                            },
                            handler: function(grid, rowIndex, colIndex, col, event) {
                                var id = this.up('grid').store.getAt(rowIndex).data.id;
                                deleteLegend(id);
                            }
                        }
                    ]
                },
                {
                    sortable: false,
                    width: 17
                }
            ],
            store: tmpLegendStore,
            listeners: {
                itemmouseenter: function(grid, record, item) {
                    this.currentItem = Ext.get(item);
                    this.currentItem.removeCls('x-grid-row-over');
                },
                select: function() {
                    this.currentItem.removeCls('x-grid-row-selected');
                },
                selectionchange: function() {
                    this.currentItem.removeCls('x-grid-row-focused');
                },
                afterrender: function() {
                    var fn = function() {
                        var deleteArray = document.getElementsByClassName('tooltip-legend-delete'),
                            len = deleteArray.length,
                            el;

                        for (var i = 0; i < len; i++) {
                            el = deleteArray[i];
                            Ext.create('Ext.tip.ToolTip', {
                                target: el,
                                html: 'Delete',
                                'anchor': 'bottom',
                                anchorOffset: -14,
                                showDelay: 1000
                            });
                        }
                    };

                    Ext.defer(fn, 100);
                }
            }
        });

        panel = Ext.create('Ext.panel.Panel', {
            cls: 'gis-container-inner',
            bodyStyle: 'padding:0px',
            legendSetId: id,
            items: [
                legendSetName,
                {
                    xtype: 'container',
                    html: GIS.i18n.add_legend,
                    cls: 'gis-panel-html-title',
                    style: 'padding-left: 3px; margin-bottom: 3px'
                },
                {
                    bodyStyle: 'background-color:#f1f1f1; border:1px solid #ccc; border-radius:1px; padding:' + legendBodyPadding + 'px',
                    style: 'margin-bottom: 1px',
                    items: [
                        legendName,
                        {
                            layout: 'hbox',
                            bodyStyle: 'background: transparent',
                            items: [
                                {
                                    html: GIS.i18n.start_end_value + ':',
                                    width: fieldLabelWidth,
                                    bodyStyle: 'background:transparent; padding-top:3px; padding-left:3px'
                                },
                                startValue,
                                endValue
                            ]
                        },
                        {
                            layout: 'column',
                            cls: 'gis-container-inner',
                            bodyStyle: 'background: transparent',
                            items: [
                                {
                                    html: GIS.i18n.legend_symbolizer + ':',
                                    width: fieldLabelWidth,
                                    bodyStyle: 'background:transparent; padding-top:3px; padding-left:3px'
                                },
                                color
                            ]
                        }
                    ]
                },
                {
                    cls: 'gis-container-inner',
                    bodyStyle: 'text-align: right',
                    width: windowWidth - windowBorder - bodyPadding,
                    items: addLegend
                },
                {
                    xtype: 'container',
                    html: GIS.i18n.current_legends,
                    cls: 'gis-panel-html-title',
                    style: 'padding-left: 3px; margin-bottom: 3px'
                },
                {
                    xtype: 'container',
                    cls: 'gis-container-inner',
                    style: 'padding:' + gridPadding + 'px',
                    items: legendGrid
                }
            ]
        });

        if (id) {
            legendStore.proxy.url = encodeURI(gis.init.contextPath + '/api/legendSets/' + id + '.json?fields=legends[id,displayName|rename(name),startValue,endValue,color]');
            legendStore.load();

            legendSetName.setValue(legendSetStore.getById(id).data.name);
        }

        return panel;
    };

    showUpdateLegendSet = function(id) {
        legendPanel = new LegendPanel(id);
        window.removeAll();
        window.add(legendPanel);
        info.hide();
        cancel.show();

        if (id) {
            update.show();
        }
        else {
            create.show();
        }
    };

    deleteLegendSet = function(id) {
        if (id) {
            Ext.Ajax.request({
                url: encodeURI(gis.init.contextPath + '/api/legendSets/' + id),
                method: 'DELETE',
                success: function() {
                    legendSetStore.load();
                    gis.store.legendSets.load();
                }
            });
        }
    };

    deleteLegend = function(id) {
        tmpLegendStore.remove(tmpLegendStore.getById(id));
    };

    getRequestBody = function() {
        var items = tmpLegendStore.data.items,
            body;

        body = {
            name: legendSetName.getValue(),
            symbolizer: gis.conf.finals.widget.symbolizer_color,
            legends: []
        };

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            body.legends.push({
                name: item.data.name,
                startValue: item.data.startValue,
                endValue: item.data.endValue,
                color: item.data.color
            });
        }

        return body;
    };

    reset = function() {
        legendPanel.destroy();
        legendSetPanel = new LegendSetPanel();
        window.removeAll();
        window.add(legendSetPanel);
        window.isDirty = false;

        info.show();
        cancel.hide();
        create.hide();
        update.hide();
    };

    validateLegends = function() {
        var items = tmpLegendStore.data.items,
            item,
            prevItem;

        if (items.length === 0) {
            alert('At least one legend is required');
            return false;
        }

        for (var i = 1; i < items.length; i++) {
            item = items[i].data;
            prevItem = items[i - 1].data;

            if (item.startValue < prevItem.endValue) {
                var msg = 'Overlapping legends not allowed!\n\n' +
                    prevItem.name + ' (' + prevItem.startValue + ' - ' + prevItem.endValue + ')\n' +
                    item.name + ' (' + item.startValue + ' - ' + item.endValue + ')';
                alert(msg);
                return false;
            }

            if (prevItem.endValue < item.startValue) {
                var msg = 'Legend gaps detected!\n\n' +
                    prevItem.name + ' (' + prevItem.startValue + ' - ' + prevItem.endValue + ')\n' +
                    item.name + ' (' + item.startValue + ' - ' + item.endValue + ')\n\n' +
                    'Proceed anyway?';

                if (!confirm(msg)) {
                    return false;
                }
            }
        }

        return true;
    };

    create = Ext.create('Ext.button.Button', {
        text: GIS.i18n.create,
        hidden: true,
        handler: function() {
            if (legendSetName.getValue() && validateLegends()) {
                if (legendSetStore.findExact('name', legendSetName.getValue()) !== -1) {
                    alert('Name already in use');
                    return;
                }

                var body = JSON.stringify(getRequestBody());

                Ext.Ajax.request({
                    url: encodeURI(gis.init.contextPath + '/api/legendSets/'),
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    params: body,
                    success: function() {
                        gis.store.legendSets.load();
                        reset();
                    }
                });
            }
        }
    });

    update = Ext.create('Ext.button.Button', {
        text: GIS.i18n.update,
        hidden: true,
        handler: function() {
            if (legendSetName.getValue() && validateLegends()) {
                var body = getRequestBody(),
                    id = legendPanel.legendSetId;
                body.id = id;
                body = JSON.stringify(getRequestBody());

                Ext.Ajax.request({
                    url: encodeURI(gis.init.contextPath + '/api/legendSets/' + id),
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    params: body,
                    success: function() {
                        reset();
                    }
                });
            }
        }
    });

    cancel = Ext.create('Ext.button.Button', {
        text: GIS.i18n.cancel,
        hidden: true,
        handler: function() {
            reset();
        }
    });

    info = Ext.create('Ext.form.Label', {
        cls: 'gis-label-info',
        width: 400,
        height: 22
    });

    window = Ext.create('Ext.window.Window', {
        title: GIS.i18n.legendsets,
        iconCls: 'gis-window-title-icon-legendset', //todo
        bodyStyle: 'padding:1px; background-color:#fff',
        resizable: false,
        width: windowWidth,
        modal: true,
        items: new LegendSetPanel(),
        destroyOnBlur: true,
        bbar: {
            height: 27,
            items: [
                info,
                cancel,
                '->',
                create,
                update
            ]
        },
        listeners: {
            show: function(w) {
                this.setPosition(269, 33);

                if (!w.hasDestroyOnBlurHandler) {
                    gis.util.gui.window.addDestroyOnBlurHandler(w);
                }
            },
            beforeclose: function() {
                if (window.isDirty) {
                    return confirm('The legend set has unsaved modifications. Close anyway?');
                }
            }
        }
    });

    return window;
};