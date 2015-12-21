GIS.app.createExtensions = function(gis) {

    Ext.define('Ext.ux.panel.LayerItemPanel', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.layeritempanel',
        layout: 'column',
        layer: null,
        checkbox: null,
        numberField: null,
        imageUrl: null,
        text: null,
        height: 22,
        value: false,
        opacity: gis.conf.layout.layer.opacity,
        getValue: function() {
            return this.checkbox.getValue();
        },
        setValue: function(value, opacity) {
            this.checkbox.setValue(value);
            this.numberField.setDisabled(!value);
            this.layer.setVisibility(value);

            if (value) {
                opacity = Ext.isNumber(parseFloat(opacity)) ? parseFloat(opacity) : this.opacity;

                if (opacity === 0) {
                    this.numberField.setValue(0);
                    this.setOpacity(0.01);
                }
                else {
                    this.numberField.setValue(opacity * 100);
                    this.setOpacity(opacity);
                }
            }
        },
        getOpacity: function() {
            return this.opacity;
        },
        setOpacity: function(opacity) {
            this.opacity = opacity === 0 ? 0.01 : opacity;
            this.layer.setLayerOpacity(this.opacity);

            if (this.layer.circleLayer) {
                this.layer.circleLayer.setOpacity(this.opacity);
            }
        },
        disableItem: function() {
            this.checkbox.setValue(false);
            this.numberField.disable();
            this.layer.setVisibility(false);
        },
        enableItem: function() {
            this.checkbox.setValue(true);
            this.numberField.enable();
            this.layer.setVisibility(true);
        },
        updateItem: function(value) {
            this.numberField.setDisabled(!value);
            this.layer.setVisibility(value);

            if (value && this.layer.layerType === gis.conf.finals.layer.type_base) {
                gis.olmap.setBaseLayer(this.layer);
            }

            if (this.layer.circleLayer) {
                this.layer.circleLayer.setVisibility(value);
            }
        },
        initComponent: function() {
            var that = this,
                image;

            this.checkbox = Ext.create('Ext.form.field.Checkbox', {
                width: 14,
                checked: this.value,
                listeners: {
                    change: function(chb, value) {
                        if (value && that.layer.layerType === gis.conf.finals.layer.type_base) {
                            var layers = gis.util.map.getLayersByType(gis.conf.finals.layer.type_base);

                            for (var i = 0; i < layers.length; i++) {
                                if (layers[i] !== that.layer) {
                                    layers[i].item.checkbox.suppressChange = true;
                                    layers[i].item.disableItem();
                                }
                            }
                        }
                        that.updateItem(value);

                        if (gis.viewport) {
                            gis.viewport.downloadButton.xable();
                        }
                    }
                }
            });

            image = Ext.create('Ext.Img', {
                width: 14,
                height: 14,
                src: this.imageUrl
            });

            this.numberField = Ext.create('Ext.form.field.Number', {
                width: 47,
                height: 18,
                minValue: 0,
                maxValue: 100,
                value: this.opacity * 100,
                allowBlank: false,
                disabled: this.numberFieldDisabled,
                listeners: {
                    change: function() {
                        var value = this.getValue(),
                            opacity = value === 0 ? 0.01 : value/100;

                        that.setOpacity(opacity);
                    }
                }
            });

            this.items = [
                {
                    width: this.checkbox.width + 4,
                    items: this.checkbox
                },
                {
                    width: image.width + 5,
                    items: image,
                    bodyStyle: 'padding-top: 4px'
                },
                {
                    width: 106,
                    html: this.text,
                    bodyStyle: 'padding-top: 4px'
                },
                {
                    width: this.numberField.width,
                    items: this.numberField
                }
            ];

            this.layer.setOpacity(this.opacity);

            this.callParent();
        }
    });

    Ext.define('Ext.ux.panel.CheckTextNumber', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.checktextnumber',
        layout: 'column',
        bodyStyle: 'border: 0 none',
        layer: null,
        checkbox: null,
        checkboxBoxLabel: null,
        numberField: null,
        numberFieldWidth: 70,
        height: 24,
        number: 5000,
        value: false,
        components: [],
        getValue: function() {
            return this.checkbox.getValue();
        },
        getNumber: function() {
            return this.numberField.getValue();
        },
        setValue: function(value, number) {
            if (value) {
                this.checkbox.setValue(value);
            }
            if (number) {
                this.numberField.setValue(number);
            }
        },
        enable: function() {
            for (var i = 0; i < this.components.length; i++) {
                this.components[i].enable();
            }
        },
        disable: function() {
            for (var i = 0; i < this.components.length; i++) {
                this.components[i].disable();
            }
        },
        reset: function() {
            this.numberField.setValue(this.number);

            this.checkbox.setValue(false);
            this.disable();
        },
        initComponent: function() {
            var ct = this,
                padding = 2,
                onAdded = function(cmp) {
                    ct.components.push(cmp);
                };

            ct.items = [];

            ct.numberField = Ext.create('Ext.form.field.Number', {
                cls: 'gis-numberfield',
                width: ct.numberFieldWidth,
                height: 21,
                minValue: 0,
                maxValue: 9999999,
                allowBlank: false,
                disabled: true,
                value: ct.number,
                listeners: {
                    added: onAdded
                }
            });

            ct.checkbox = Ext.create('Ext.form.field.Checkbox', {
                cls: 'gis-checkbox',
                width: ct.width - ct.numberField.width,
                boxLabel: ct.checkboxBoxLabel,
                boxLabelCls: 'x-form-cb-label-alt1',
                checked: ct.value,
                disabled: ct.disabled,
                style: 'padding-left: 3px',
                listeners: {
                    change: function(chb, value) {
                        if (value) {
                            ct.enable();
                        }
                        else {
                            ct.disable();
                        }
                    }
                }
            });

            ct.items.push(ct.checkbox);
            ct.items.push(ct.numberField);

            this.callParent();
        }
    });

    Ext.define('Ext.ux.panel.LabelPanel', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.labelpanel',
        layout: 'column',
        bodyStyle: 'border: 0 none',
        skipBoldButton: false,
        skipColorButton: false,
        checkboxWidth: 100,
        chechboxBoxLabel: 'Show labels',
        numberFieldValue: 11,
        numberFieldWidth: 50,
        colorButtonWidth: 87,
        colorButtonColor: '000000',
        width: 290,
        height: 24,
        value: false,
        components: [],
        getConfig: function() {
            var config = {
                labels: this.checkbox.getValue(),
                labelFontSize: this.numberField.getValue() + 'px',
                labelFontStyle: this.italicButton.pressed ? 'italic' : 'normal'
            };

            if (!this.skipBoldButton) {
                config.labelFontWeight = this.boldButton.pressed ? 'bold' : 'normal';
            }

            if (!this.skipColorButton) {
                config.labelFontColor = '#' + this.colorButton.getValue();
            }

            return config;
        },
        setConfig: function(config) {
            this.numberField.setValue(parseInt(config.labelFontSize));
            this.italicButton.toggle(Ext.Array.contains(['italic', 'oblique'], config.labelFontStyle));

            if (!this.skipBoldButton) {
                this.boldButton.toggle(Ext.Array.contains(['bold', 'bolder'], config.labelFontWeight) || (Ext.isNumber(parseInt(config.labelFontWeight)) && parseInt(config.labelFontWeight) >= 700));
            }

            if (!this.skipColorButton) {
                this.colorButton.setValue(config.labelFontColor);
            }

            this.checkbox.setValue(config.labels);
        },
        enable: function() {
            for (var i = 0; i < this.components.length; i++) {
                this.components[i].enable();
            }
        },
        disable: function() {
            for (var i = 0; i < this.components.length; i++) {
                this.components[i].disable();
            }
        },
        reset: function() {
            this.numberField.setValue(this.numberFieldValue);
            this.boldButton.toggle(false);
            this.italicButton.toggle(false);
            this.colorButton.setValue(this.colorButtonColor);

            this.checkbox.setValue(false);
            this.disable();
        },
        initComponent: function() {
            var ct = this,
                onAdded = function(cmp) {
                    ct.components.push(cmp);
                };

            ct.items = [];

            ct.checkbox = Ext.create('Ext.form.field.Checkbox', {
                cls: 'gis-checkbox',
                width: ct.checkboxWidth,
                boxLabel: ct.chechboxBoxLabel,
                checked: ct.value,
                disabled: ct.disabled,
                boxLabelCls: 'x-form-cb-label-alt1',
                style: 'padding-left: 3px',
                listeners: {
                    change: function(chb, value) {
                        if (value) {
                            ct.enable();
                        }
                        else {
                            ct.disable();
                        }
                    }
                }
            });

            ct.items.push(ct.checkbox);

            ct.numberField = Ext.create('Ext.form.field.Number', {
                cls: 'gis-numberfield',
                width: ct.numberFieldWidth,
                height: 21,
                minValue: 0,
                maxValue: 9999999,
                allowBlank: false,
                disabled: true,
                value: ct.numberFieldValue,
                listeners: {
                    added: onAdded
                }
            });

            ct.items.push(ct.numberField);

            if (!ct.skipBoldButton) {
                ct.boldButton = Ext.create('Ext.button.Button', {
                    width: 24,
                    height: 24,
                    icon: 'images/text_bold.png',
                    style: 'margin-left: 1px',
                    disabled: true,
                    enableToggle: true,
                    listeners: {
                        added: onAdded
                    }
                });

                ct.items.push(ct.boldButton);
            }

            ct.italicButton = Ext.create('Ext.button.Button', {
                width: 24,
                height: 24,
                icon: 'images/text_italic.png',
                style: 'margin-left: 1px',
                disabled: true,
                enableToggle: true,
                listeners: {
                    added: onAdded
                }
            });

            ct.items.push(ct.italicButton);

            if (!ct.skipColorButton) {
                ct.colorButton = Ext.create('Ext.ux.button.ColorButton', {
                    width: ct.colorButtonWidth,
                    height: 24,
                    style: 'margin-left: 1px',
                    value: ct.colorButtonColor,
                    listeners: {
                        added: onAdded
                    }
                });

                ct.items.push(ct.colorButton);
            }

            this.callParent();
        }
    });

    var operatorCmpWidth = 70,
        valueCmpWidth = 306,
        buttonCmpWidth = 20,
        nameCmpWidth = 400,
        namePadding = '2px 3px',
        margin = '3px 0 1px';

    Ext.define('Ext.ux.panel.DataElementIntegerContainer', {
        extend: 'Ext.container.Container',
        alias: 'widget.dataelementintegerpanel',
        layout: 'column',
        bodyStyle: 'border:0 none',
        style: 'margin: ' + margin,
        getRecord: function() {
            var record = {};

            record.dimension = this.dataElement.id;
            record.name = this.dataElement.name;

            if (this.valueCmp.getValue()) {
                record.filter = this.operatorCmp.getValue() + ':' + this.valueCmp.getValue();
            }

            return record;
        },
        setRecord: function(record) {
            if (record.filter) {
                var a = record.filter.split(':');

                this.operatorCmp.setValue(a[0]);
                this.valueCmp.setValue(a[1]);
            }
        },
        initComponent: function() {
            var container = this;

            this.nameCmp = Ext.create('Ext.form.Label', {
                text: this.dataElement.name,
                width: nameCmpWidth,
                style: 'padding:' + namePadding
            });

            this.operatorCmp = Ext.create('Ext.form.field.ComboBox', {
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                editable: false,
                width: operatorCmpWidth,
                style: 'margin-bottom:0',
                value: 'EQ',
                store: {
                    fields: ['id', 'name'],
                    data: [
                        {id: 'EQ', name: '='},
                        {id: 'GT', name: '>'},
                        {id: 'GE', name: '>='},
                        {id: 'LT', name: '<'},
                        {id: 'LE', name: '<='},
                        {id: 'NE', name: '!='}
                    ]
                }
            });

            this.valueCmp = Ext.create('Ext.form.field.Number', {
                width: valueCmpWidth,
                style: 'margin-bottom:0'
            });

            this.addCmp = Ext.create('Ext.button.Button', {
                text: '+',
                width: buttonCmpWidth,
                handler: function() {
                    container.duplicateDataElement();
                }
            });

            this.removeCmp = Ext.create('Ext.button.Button', {
                text: 'x',
                width: buttonCmpWidth,
                handler: function() {
                    container.removeDataElement();
                }
            });

            this.items = [
                this.nameCmp,
                this.operatorCmp,
                this.valueCmp,
                this.addCmp,
                this.removeCmp
            ];

            this.callParent();
        }
    });

    Ext.define('Ext.ux.panel.DataElementStringContainer', {
        extend: 'Ext.container.Container',
        alias: 'widget.dataelementstringpanel',
        layout: 'column',
        bodyStyle: 'border:0 none',
        style: 'margin: ' + margin,
        getRecord: function() {
            var record = {};

            record.dimension = this.dataElement.id;
            record.name = this.dataElement.name;

            if (this.valueCmp.getValue()) {
                record.filter = this.operatorCmp.getValue() + ':' + this.valueCmp.getValue();
            }

            return record;
        },
        setRecord: function(record) {
            this.operatorCmp.setValue(record.operator);
            this.valueCmp.setValue(record.filter);
        },
        initComponent: function() {
            var container = this;

            this.nameCmp = Ext.create('Ext.form.Label', {
                text: this.dataElement.name,
                width: nameCmpWidth,
                style: 'padding:' + namePadding
            });

            this.operatorCmp = Ext.create('Ext.form.field.ComboBox', {
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                editable: false,
                width: operatorCmpWidth,
                style: 'margin-bottom:0',
                value: 'LIKE',
                store: {
                    fields: ['id', 'name'],
                    data: [
                        {id: 'LIKE', name: 'Contains'},
                        {id: 'EQ', name: 'Is exact'}
                    ]
                }
            });

            this.valueCmp = Ext.create('Ext.form.field.Text', {
                width: valueCmpWidth,
                style: 'margin-bottom:0'
            });

            this.addCmp = Ext.create('Ext.button.Button', {
                text: '+',
                width: buttonCmpWidth,
                handler: function() {
                    container.duplicateDataElement();
                }
            });

            this.removeCmp = Ext.create('Ext.button.Button', {
                text: 'x',
                width: buttonCmpWidth,
                handler: function() {
                    container.removeDataElement();
                }
            });

            this.items = [
                this.nameCmp,
                this.operatorCmp,
                this.valueCmp,
                this.addCmp,
                this.removeCmp
            ];

            this.callParent();
        }
    });

    Ext.define('Ext.ux.panel.DataElementDateContainer', {
        extend: 'Ext.container.Container',
        alias: 'widget.dataelementdatepanel',
        layout: 'column',
        bodyStyle: 'border:0 none',
        style: 'margin: ' + margin,
        getRecord: function() {
            var record = {};

            record.dimension = this.dataElement.id;
            record.name = this.dataElement.name;

            if (this.valueCmp.getValue()) {
                record.filter = this.operatorCmp.getValue() + ':' + this.valueCmp.getSubmitValue();
            }

            return record;
        },
        setRecord: function(record) {
            if (record.filter && Ext.isString(record.filter)) {
                var a = record.filter.split(':');

                this.operatorCmp.setValue(a[0]);
                this.valueCmp.setValue(a[1]);
            }
        },
        initComponent: function() {
            var container = this;

            this.nameCmp = Ext.create('Ext.form.Label', {
                text: this.dataElement.name,
                width: nameCmpWidth,
                style: 'padding:' + namePadding
            });

            this.operatorCmp = Ext.create('Ext.form.field.ComboBox', {
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                editable: false,
                width: operatorCmpWidth,
                style: 'margin-bottom:0',
                value: 'EQ',
                store: {
                    fields: ['id', 'name'],
                    data: [
                        {id: 'EQ', name: '='},
                        {id: 'GT', name: '>'},
                        {id: 'GE', name: '>='},
                        {id: 'LT', name: '<'},
                        {id: 'LE', name: '<='},
                        {id: 'NE', name: '!='}
                    ]
                }
            });

            this.valueCmp = Ext.create('Ext.form.field.Date', {
                width: valueCmpWidth,
                style: 'margin-bottom:0',
                format: 'Y-m-d'
            });

            this.addCmp = Ext.create('Ext.button.Button', {
                text: '+',
                width: buttonCmpWidth,
                handler: function() {
                    container.duplicateDataElement();
                }
            });

            this.removeCmp = Ext.create('Ext.button.Button', {
                text: 'x',
                width: buttonCmpWidth,
                handler: function() {
                    container.removeDataElement();
                }
            });

            this.items = [
                this.nameCmp,
                this.operatorCmp,
                this.valueCmp,
                this.addCmp,
                this.removeCmp
            ];

            this.callParent();
        }
    });

    Ext.define('Ext.ux.panel.DataElementBooleanContainer', {
        extend: 'Ext.container.Container',
        alias: 'widget.dataelementbooleanpanel',
        layout: 'column',
        bodyStyle: 'border:0 none',
        style: 'margin: ' + margin,
        getRecord: function() {
            var record = {};

            record.dimension = this.dataElement.id;
            record.name = this.dataElement.name;

            if (this.valueCmp.getValue()) {
                record.filter = 'EQ:' + this.valueCmp.getValue();
            }

            return record;
        },
        setRecord: function(record) {
            this.valueCmp.setValue(record.filter);
        },
        initComponent: function() {
            var container = this;

            this.nameCmp = Ext.create('Ext.form.Label', {
                text: this.dataElement.name,
                width: nameCmpWidth,
                style: 'padding:' + namePadding
            });

            this.valueCmp = Ext.create('Ext.form.field.ComboBox', {
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                editable: false,
                width: operatorCmpWidth + valueCmpWidth,
                style: 'margin-bottom:0',
                value: 'true',
                store: {
                    fields: ['id', 'name'],
                    data: [
                        {id: 'true', name: GIS.i18n.yes},
                        {id: 'false', name: GIS.i18n.no}
                    ]
                }
            });

            this.addCmp = Ext.create('Ext.button.Button', {
                text: '+',
                width: buttonCmpWidth,
                handler: function() {
                    container.duplicateDataElement();
                }
            });

            this.removeCmp = Ext.create('Ext.button.Button', {
                text: 'x',
                width: buttonCmpWidth,
                handler: function() {
                    container.removeDataElement();
                }
            });

            this.items = [
                this.nameCmp,
                this.valueCmp,
                this.addCmp,
                this.removeCmp
            ];

            this.callParent();
        }
    });

    Ext.define('Ext.ux.panel.OrganisationUnitGroupSetContainer', {
        extend: 'Ext.container.Container',
        alias: 'widget.organisationunitgroupsetpanel',
        layout: 'column',
        bodyStyle: 'border:0 none',
        style: 'margin: ' + margin,
        addCss: function() {
            var css = '.optionselector .x-boundlist-selected { background-color: #fff; border-color: #fff } \n';
            css += '.optionselector .x-boundlist-selected.x-boundlist-item-over { background-color: #ddd; border-color: #ddd } \n';

            Ext.util.CSS.createStyleSheet(css);
        },
        getRecord: function() {
            var items = this.valueCmp.getValue(),
                record = {
                    dimension: this.dataElement.id,
                    name: this.dataElement.name
                };

            // array or object
            for (var i = 0; i < items.length; i++) {
                if (Ext.isObject(items[i])) {
                    items[i] = items[i].code;
                }
            }

            if (items.length) {
                record.filter = 'IN:' + items.join(';');
            }

            return record;
        },
        setRecord: function(record) {
            if (Ext.isString(record.filter) && record.filter.length) {
                var a = record.filter.split(':');
                this.valueCmp.setOptionValues(a[1].split(';'));
            }
        },
        getRecordsByCode: function(options, codeArray) {
            var records = [];

            for (var i = 0; i < options.length; i++) {
                for (var j = 0; j < codeArray.length; j++) {
                    if (options[i].code === codeArray[j]) {
                        records.push(options[i]);
                    }
                }
            }

            return records;
        },
        initComponent: function() {
            var container = this,
                idProperty = 'code',
                nameProperty = 'name';

            this.addCss();

            this.nameCmp = Ext.create('Ext.form.Label', {
                text: this.dataElement.name,
                width: nameCmpWidth,
                style: 'padding:' + namePadding
            });

            this.operatorCmp = Ext.create('Ext.form.field.ComboBox', {
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                editable: false,
                style: 'margin-bottom:0',
                width: operatorCmpWidth,
                value: 'IN',
                store: {
                    fields: ['id', 'name'],
                    data: [
                        {id: 'IN', name: 'One of'}
                    ]
                }
            });

            this.searchStore = Ext.create('Ext.data.Store', {
                fields: [idProperty, nameProperty],
                data: [],
                loadOptionSet: function(optionSetId, key, pageSize) {
                    var store = this;

                    optionSetId = optionSetId || container.dataElement.optionSet.id;
                    pageSize = pageSize || 100;

                    dhis2.gis.store.get('optionSets', optionSetId).done( function(obj) {
                        if (Ext.isObject(obj) && Ext.isArray(obj.options) && obj.options.length) {
                            store.removeAll();
                            store.loadData(obj.options.slice(0, pageSize));
                        }
                    });
                },
                listeners: {
                    datachanged: function(s) {
                        if (container.searchCmp && s.getRange().length) {
                            container.searchCmp.expand();
                        }
                    }
                }
            });

            // function
            this.filterSearchStore = function() {
                var selected = container.valueCmp.getValue();

                container.searchStore.clearFilter();

                container.searchStore.filterBy(function(record) {
                    return !Ext.Array.contains(selected, record.data[idProperty]);
                });
            };

            this.searchCmp = Ext.create('Ext.form.field.ComboBox', {
                multiSelect: true,
                width: 62,
                style: 'margin-bottom:0',
                emptyText: 'Search..',
                valueField: idProperty,
                displayField: nameProperty,
                hideTrigger: true,
                delimiter: '; ',
                enableKeyEvents: true,
                queryMode: 'local',
                listConfig: {
                    minWidth: 304
                },
                store: this.searchStore,
                listeners: {
                    keyup: {
                        fn: function() {
                            var value = this.getValue(),
                                optionSetId = container.dataElement.optionSet.id;

                            // search
                            container.searchStore.loadOptionSet(optionSetId, value);

                            // trigger
                            if (!value || (Ext.isString(value) && value.length === 1)) {
                                container.triggerCmp.setDisabled(!!value);
                            }
                        }
                    },
                    select: function() {
                        var id = Ext.Array.from(this.getValue())[0];

                        // value
                        if (container.valueStore.findExact(idProperty, id) === -1) {
                            container.valueStore.add(container.searchStore.getAt(container.searchStore.findExact(idProperty, id)).data);
                        }

                        // search
                        this.select([]);

                        // filter
                        container.filterSearchStore();

                        // trigger
                        container.triggerCmp.enable();
                    },
                    expand: function() {
                        container.filterSearchStore();
                    }
                }
            });

            this.triggerCmp = Ext.create('Ext.button.Button', {
                cls: 'gis-button-combotrigger',
                disabledCls: 'gis-button-combotrigger-disabled',
                width: 18,
                height: 22,
                handler: function(b) {
                    container.searchStore.loadOptionSet();
                }
            });

            this.valueStore = Ext.create('Ext.data.Store', {
                fields: [idProperty, nameProperty],
                listeners: {
                    add: function() {
                        container.valueCmp.select(this.getRange());
                    },
                    remove: function() {
                        container.valueCmp.select(this.getRange());
                    }
                }
            });

            this.valueCmp = Ext.create('Ext.form.field.ComboBox', {
                multiSelect: true,
                style: 'margin-bottom:0',
                width: 226,
                valueField: idProperty,
                displayField: nameProperty,
                emptyText: 'No selected items',
                editable: false,
                hideTrigger: true,
                store: container.valueStore,
                queryMode: 'local',
                listConfig: {
                    cls: 'optionselector'
                },
                setOptionValues: function(codeArray) {
                    var me = this,
                        records = [];

                    dhis2.gis.store.get('optionSets', container.dataElement.optionSet.id).done( function(obj) {
                        if (Ext.isObject(obj) && Ext.isArray(obj.options) && obj.options.length) {
                            records = container.getRecordsByCode(obj.options, codeArray);

                            container.valueStore.removeAll();
                            container.valueStore.loadData(records);

                            me.setValue(records);
                        }
                    });
                },
                listeners: {
                    change: function(cmp, newVal, oldVal) {
                        newVal = Ext.Array.from(newVal);
                        oldVal = Ext.Array.from(oldVal);

                        if (newVal.length < oldVal.length) {
                            var id = Ext.Array.difference(oldVal, newVal)[0];
                            container.valueStore.removeAt(container.valueStore.findExact(idProperty, id));
                        }
                    }
                }
            });

            this.addCmp = Ext.create('Ext.button.Button', {
                text: '+',
                width: buttonCmpWidth,
                style: 'font-weight:bold',
                handler: function() {
                    container.duplicateDataElement();
                }
            });

            this.removeCmp = Ext.create('Ext.button.Button', {
                text: 'x',
                width: buttonCmpWidth,
                handler: function() {
                    container.removeDataElement();
                }
            });

            this.items = [
                this.nameCmp,
                this.operatorCmp,
                this.searchCmp,
                this.triggerCmp,
                this.valueCmp,
                this.addCmp,
                this.removeCmp
            ];

            this.callParent();
        }
    });

};