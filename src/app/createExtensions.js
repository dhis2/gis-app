import isArray from 'd2-utilizr/lib/isArray';
import isBoolean from 'd2-utilizr/lib/isBoolean';
import isNumber from 'd2-utilizr/lib/isNumber';
import isObject from 'd2-utilizr/lib/isObject';
import isString from 'd2-utilizr/lib/isString';
import arrayContains from 'd2-utilizr/lib/arrayContains';
import arrayDifference from 'd2-utilizr/lib/arrayDifference';
import arrayFrom from 'd2-utilizr/lib/arrayFrom';

export default function createExtensions(gis) {

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

            this.setLayerVisibility(value);

            if (value) {
                opacity = isNumber(parseFloat(opacity)) ? parseFloat(opacity) : this.opacity;

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
        setLayerVisibility: function(isVisible) {
            var layer = this.layer;

            if (isVisible) {
                if (layer.instance) { // Layer instance already exist
                    gis.instance.addLayer(layer.instance);
                } else if (layer.id !== 'earthEngine' && layer.id !== 'external') { // Earth Engine and External layer can't be empty
                    // Create and add layer instance
                    layer.instance = gis.instance.addLayer(layer.config);
                }
            } else if (layer.instance) { // Remove if layer instance exit
                gis.instance.removeLayer(layer.instance);
            }
        },
        getOpacity: function() {
            return this.opacity;
        },
        setOpacity: function(opacity) {
            var layer = this.layer;

            if (layer.instance && layer.instance.setOpacity) {
                layer.instance.setOpacity(opacity);
            }

            layer.layerOpacity = opacity;

            this.opacity = opacity;
        },
        disableItem: function() {
            this.checkbox.setValue(false);
            this.numberField.disable();
            this.setLayerVisibility(false);
        },
        enableItem: function() {
            this.checkbox.setValue(true);
            this.numberField.enable();
            this.setLayerVisibility(true);
        },
        updateItem: function(value) {
            this.numberField.setDisabled(!value);
            this.setLayerVisibility(value);
        },
        initComponent: function() {
            var that = this,
                layer,
                image;

            this.checkbox = Ext.create('Ext.form.field.Checkbox', {
                width: 14,
                checked: this.value,
                listeners: {
                    change: function(chb, value) {

                        // Only allow one base layer
                        if (value && that.layer.layerType === 'base') {
                            for (var id in gis.layer) {
                                if (gis.layer.hasOwnProperty(id)) {
                                    layer = gis.layer[id];

                                    if (layer.layerType === 'base' && layer !== that.layer) {
                                        layer.item.checkbox.suppressChange = true;
                                        layer.item.disableItem();
                                    }
                                }
                            }
                        }

                        that.updateItem(value, that.layer.layerType);

                        if (gis.viewport && gis.viewport.downloadButton) {
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

            this.setOpacity(this.opacity);

            this.self.superclass.initComponent.call(this);
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

            //this.callParent();
            this.self.superclass.initComponent.call(this);
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
            this.italicButton.toggle(arrayContains(['italic', 'oblique'], config.labelFontStyle));

            if (!this.skipBoldButton) {
                this.boldButton.toggle(arrayContains(['bold', 'bolder'], config.labelFontWeight) || (isNumber(parseInt(config.labelFontWeight)) && parseInt(config.labelFontWeight) >= 700));
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
                maxValue: 100,
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

            //this.callParent();
            this.self.superclass.initComponent.call(this);
        }
    });

    var scrollbarWidth = /\bchrome\b/.test(navigator.userAgent.toLowerCase()) ? 8 : 17,
        nameCmpWidth = 440 - 12 - scrollbarWidth,
        operatorCmpWidth = 70,
        triggerCmpWidth = 17,
        valueCmpWidth = 350,
        namePadding = '3px 3px',
        margin = '3px 0 1px',
        removeCmpStyle = 'padding: 0; margin-left: 3px';

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
                flex: 1,
                style: 'padding:' + namePadding
            });

            this.addCmp = Ext.create('Ext.button.Button', {
                cls: 'ns-linkbutton',
                style: 'padding: 0',
                height: 18,
                text: GIS.i18n.duplicate,
                handler: function() {
                    container.duplicateDataElement();
                }
            });

            this.removeCmp = Ext.create('Ext.button.Button', {
                cls: 'ns-linkbutton',
                style: removeCmpStyle,
                height: 18,
                text: GIS.i18n.remove,
                handler: function() {
                    container.removeDataElement();
                }
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

            this.items = [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: nameCmpWidth,
                    items: [
                        this.nameCmp,
                        this.addCmp,
                        this.removeCmp
                    ]
                },
                this.operatorCmp,
                this.valueCmp
            ];

            //this.callParent();
            this.self.superclass.initComponent.call(this);
        }
    });

    Ext.define('Ext.ux.panel.DataElementStringContainer', {
        extend: 'Ext.container.Container',
        alias: 'widget.dataelementstringpanel',
        cls: 'ns-dxselector',
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
                flex: 1,
                style: 'padding:' + namePadding
            });

            this.addCmp = Ext.create('Ext.button.Button', {
                cls: 'ns-linkbutton',
                style: 'padding: 0',
                height: 18,
                text: GIS.i18n.duplicate,
                handler: function() {
                    container.duplicateDataElement();
                }
            });

            this.removeCmp = Ext.create('Ext.button.Button', {
                cls: 'ns-linkbutton',
                style: removeCmpStyle,
                height: 18,
                text: GIS.i18n.remove,
                handler: function() {
                    container.removeDataElement();
                }
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
                width: nameCmpWidth - operatorCmpWidth,
                style: 'margin-bottom:0'
            });

            this.items = [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: nameCmpWidth,
                    items: [
                        this.nameCmp,
                        this.addCmp,
                        this.removeCmp
                    ]
                },
                this.operatorCmp,
                this.valueCmp
            ];

            //this.callParent();
            this.self.superclass.initComponent.call(this);
        }
    });

    Ext.define('Ext.ux.panel.DataElementDateContainer', {
        extend: 'Ext.container.Container',
        alias: 'widget.dataelementdatepanel',
        cls: 'ns-dxselector',
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
                flex: 1,
                style: 'padding:' + namePadding
            });

            this.addCmp = Ext.create('Ext.button.Button', {
                cls: 'ns-linkbutton',
                style: 'padding: 0',
                height: 18,
                text: GIS.i18n.duplicate,
                handler: function() {
                    container.duplicateDataElement();
                }
            });

            this.removeCmp = Ext.create('Ext.button.Button', {
                cls: 'ns-linkbutton',
                style: removeCmpStyle,
                height: 18,
                text: GIS.i18n.remove,
                handler: function() {
                    container.removeDataElement();
                }
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
                width: nameCmpWidth - operatorCmpWidth,
                style: 'margin-bottom:0',
                format: 'Y-m-d'
            });

            this.items = [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: nameCmpWidth,
                    items: [
                        this.nameCmp,
                        this.addCmp,
                        this.removeCmp
                    ]
                },
                this.operatorCmp,
                this.valueCmp
            ];

            //this.callParent();
            this.self.superclass.initComponent.call(this);
        }
    });

    Ext.define('Ext.ux.panel.DataElementBooleanContainer', {
        extend: 'Ext.container.Container',
        alias: 'widget.dataelementbooleanpanel',
        cls: 'ns-dxselector',
        layout: 'column',
        bodyStyle: 'border:0 none',
        style: 'margin: ' + margin,
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
                idProperty = 'id',
                nameProperty = 'name';

            this.nameCmp = Ext.create('Ext.form.Label', {
                text: this.dataElement.name,
                flex: 1,
                style: 'padding:' + namePadding
            });

            this.addCmp = Ext.create('Ext.button.Button', {
                cls: 'ns-linkbutton',
                style: 'padding: 0',
                height: 18,
                text: GIS.i18n.duplicate,
                handler: function() {
                    container.duplicateDataElement();
                }
            });

            this.removeCmp = Ext.create('Ext.button.Button', {
                cls: 'ns-linkbutton',
                style: removeCmpStyle,
                height: 18,
                text: GIS.i18n.remove,
                handler: function() {
                    container.removeDataElement();
                }
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

            this.getData = function(idArray) {
                var data = [], yes = {}, no = {};

                yes[idProperty] = '1';
                yes[nameProperty] = NS.i18n.yes;
                no[idProperty] = '0';
                no[nameProperty] = NS.i18n.no;

                for (var i = 0; i < idArray.length; i++) {
                    if (idArray[i] === '1' || idArray[i] === 1) {
                        data.push(yes);
                    }
                    else if (idArray[i] === '0' || idArray[i] === 0) {
                        data.push(no);
                    }
                }

                return data;
            };

            this.searchStore = Ext.create('Ext.data.Store', {
                fields: [idProperty, nameProperty],
                data: container.getData(['1', '0'])
            });

            // function
            this.filterSearchStore = function(isLayout) {
                var selected = container.valueCmp.getValue();

                // hack, using internal method to activate dropdown before filtering
                if (isLayout) {
                    container.searchCmp.onTriggerClick();
                    container.searchCmp.collapse();
                }

                // filter
                container.searchStore.clearFilter();

                container.searchStore.filterBy(function(record) {
                    return !Ext.Array.contains(selected, record.data[idProperty]);
                });
            };

            this.searchCmp = Ext.create('Ext.form.field.ComboBox', {
                multiSelect: true,
                width: operatorCmpWidth,
                style: 'margin-bottom:0',
                emptyText: 'Select..',
                valueField: idProperty,
                displayField: nameProperty,
                queryMode: 'local',
                listConfig: {
                    minWidth: nameCmpWidth - operatorCmpWidth
                },
                store: this.searchStore,
                listeners: {
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
                    },
                    expand: function() {
                        container.filterSearchStore();
                    }
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
                width: nameCmpWidth - operatorCmpWidth - operatorCmpWidth,
                valueField: idProperty,
                displayField: nameProperty,
                emptyText: 'No selected items',
                editable: false,
                hideTrigger: true,
                store: container.valueStore,
                queryMode: 'local',
                listConfig: {
                    minWidth: 266,
                    cls: 'ns-optionselector'
                },
                setOptionValues: function(codeArray) {
                    container.valueStore.removeAll();
                    container.valueStore.loadData(container.getData(codeArray));

                    this.setValue(codeArray);
                    container.filterSearchStore(true);
                    container.searchCmp.blur();
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

            this.items = [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: nameCmpWidth,
                    items: [
                        this.nameCmp,
                        this.addCmp,
                        this.removeCmp
                    ]
                },
                this.operatorCmp,
                this.searchCmp,
                this.valueCmp
            ];

            //this.callParent();
            this.self.superclass.initComponent.call(this);
        }
    });

    Ext.define('Ext.ux.panel.OrganisationUnitGroupSetContainer', {
        extend: 'Ext.container.Container',
        alias: 'widget.organisationunitgroupsetpanel',
        cls: 'ns-dxselector',
        layout: 'column',
        bodyStyle: 'border:0 none',
        style: 'margin: ' + margin,
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

            this.nameCmp = Ext.create('Ext.form.Label', {
                text: this.dataElement.name,
                flex: 1,
                style: 'padding:' + namePadding
            });

            this.addCmp = Ext.create('Ext.button.Button', {
                cls: 'ns-linkbutton',
                style: 'padding: 0',
                height: 18,
                text: GIS.i18n.duplicate,
                handler: function() {
                    container.duplicateDataElement();
                }
            });

            this.removeCmp = Ext.create('Ext.button.Button', {
                cls: 'ns-linkbutton',
                style: removeCmpStyle,
                height: 18,
                text: GIS.i18n.remove,
                handler: function() {
                    container.removeDataElement();
                }
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
                            var data = [];

                            if (key) {
                                var re = new RegExp(key, 'gi');

                                for (var i = 0, name, match; i < obj.options.length; i++) {
                                    name = obj.options[i].name;
                                    match = name.match(re);

                                    if (Ext.isArray(match) && match.length) {
                                        data.push(obj.options[i]);

                                        if (data.length === pageSize) {
                                            break;
                                        }
                                    }
                                }
                            }
                            else {
                                data = obj.options;
                            }

                            store.removeAll();
                            store.loadData(data.slice(0, pageSize));

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
                width: operatorCmpWidth - triggerCmpWidth,
                style: 'margin-bottom:0',
                emptyText: 'Search..',
                valueField: idProperty,
                displayField: nameProperty,
                hideTrigger: true,
                enableKeyEvents: true,
                queryMode: 'local',
                listConfig: {
                    minWidth: nameCmpWidth - operatorCmpWidth
                },
                store: this.searchStore,
                listeners: {
                    keyup: function() {
                        var value = this.getValue(),
                            optionSetId = container.dataElement.optionSet.id;

                        // search
                        container.searchStore.loadOptionSet(optionSetId, value);

                        // trigger
                        if (!value || (Ext.isString(value) && value.length === 1)) {
                            container.triggerCmp.setDisabled(!!value);
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
                cls: 'ns-button-combotrigger',
                disabledCls: 'ns-button-combotrigger-disabled',
                width: triggerCmpWidth,
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
                width: nameCmpWidth - operatorCmpWidth - operatorCmpWidth,
                valueField: idProperty,
                displayField: nameProperty,
                emptyText: 'No selected items',
                editable: false,
                hideTrigger: true,
                store: container.valueStore,
                queryMode: 'local',
                listConfig: {
                    minWidth: 266,
                    cls: 'ns-optionselector'
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

            this.items = [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: nameCmpWidth,
                    items: [
                        this.nameCmp,
                        this.addCmp,
                        this.removeCmp
                    ]
                },
                this.operatorCmp,
                this.searchCmp,
                this.triggerCmp,
                this.valueCmp
            ];

            //this.callParent();
            this.self.superclass.initComponent.call(this);
        }
    });

};
