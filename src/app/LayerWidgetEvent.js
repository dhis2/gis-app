import isString from 'd2-utilizr/lib/isString';
import isObject from 'd2-utilizr/lib/isObject';
import isArray from 'd2-utilizr/lib/isArray';
import isFunction from 'd2-utilizr/lib/isFunction';
import arrayClean from 'd2-utilizr/lib/arrayClean';
import arrayPluck from 'd2-utilizr/lib/arrayPluck';

export default function LayerWidgetEvent(gis, layer) {

    // Cache
    const stageStorage = {};
    const attributeStorage = {};
    const dataElementStorage = {};

    // Constants
    const baseWidth = 444;
    const accBaseWidth = baseWidth - 2;

    // Dimensions
    const dimConf = gis.conf.finals.dimension;


    // --------------- STORES --------------- //

    // Programs
    const programStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        proxy: {
            type: 'ajax',
            url: encodeURI(gis.init.apiPath + 'programs.json?fields=id,displayName~rename(name)&paging=false'),
            reader: {
                type: 'json',
                root: 'programs'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        },
        sortInfo: {field: 'name', direction: 'ASC'},
        isLoaded: false,
        listeners: {
            load() {
                if (!this.isLoaded) {
                    this.isLoaded = true;
                }
            }
        }
    });

    // Program stages
    const stagesByProgramStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        proxy: {
            type: 'ajax',
            url: '',
            reader: {
                type: 'json',
                root: 'programStages'
            }
        },
        isLoaded: false,
        loadFn(fn) {
            if (isFunction(fn)) {
                if (this.isLoaded) {
                    fn.call();
                }
                else {
                    this.load({
                        callback: fn
                    });
                }
            }
        },
        listeners: {
            load() {
                if (!this.isLoaded) {
                    this.isLoaded = true;
                }
                this.sort('name', 'ASC');
            }
        }
    });

    // Program stage data elements
    const dataElementsByStageStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name', 'isAttribute'],
        data: [],
        sorters: [
            {
                property: 'isAttribute',
                direction: 'DESC'
            },
            {
                property: 'name',
                direction: 'ASC'
            }
        ]
    });


    // --------------- COMPONENTS --------------- //

    // Program
    const program = Ext.create('Ext.form.field.ComboBox', {
        fieldLabel: GIS.i18n.program,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        labelAlign: 'top',
        labelCls: 'gis-form-item-label-top',
        labelSeparator: '',
        emptyText: GIS.i18n.select_program,
        forceSelection: true,
        queryMode: 'remote',
        columnWidth: 0.5,
        style: 'margin:1px 1px 1px 0',
        storage: {},
        store: programStore,
        getRecord() {
            return this.getValue ? {
                id: this.getValue(),
                name: this.getRawValue()
            } : null;
        },
        listeners: {
            select(cb) {
                onProgramSelect(cb.getValue());
            }
        }
    });

    // Stage
    const stage = Ext.create('Ext.form.field.ComboBox', {
        editable: false,
        valueField: 'id',
        displayField: 'name',
        fieldLabel: GIS.i18n.stage,
        labelAlign: 'top',
        labelCls: 'gis-form-item-label-top',
        labelSeparator: '',
        emptyText: GIS.i18n.select_stage,
        queryMode: 'local',
        forceSelection: true,
        columnWidth: 0.5,
        style: 'margin:1px 0 1px 0',
        disabled: true,
        listConfig: {loadMask: false},
        store: stagesByProgramStore,
        getRecord() {
            return this.getValue() ? {
                id: this.getValue(),
                name: this.getRawValue()
            } : null;
        },
        listeners: {
            select(cb) {
                onStageSelect(cb.getValue());
            }
        }
    });

    const dataElementAvailable = Ext.create('Ext.ux.form.MultiSelect', {
        cls: 'ns-toolbar-multiselect-left',
        width: accBaseWidth - 4,
        height: 118,
        valueField: 'id',
        displayField: 'name',
        style: 'margin-bottom:1px',
        store: dataElementsByStageStore,
        tbar: [
            {
                xtype: 'label',
                text: 'Available data items',
                cls: 'ns-toolbar-multiselect-left-label'
            },
            '->',
            {
                xtype: 'button',
                icon: 'images/arrowdown.png',
                width: 22,
                height: 22,
                handler() {
                    if (dataElementAvailable.getValue().length) {
                        selectDataElements(dataElementAvailable.getValue());
                    }
                }
            },
            {
                xtype: 'button',
                icon: 'images/arrowdowndouble.png',
                width: 22,
                height: 22,
                handler() {
                    if (dataElementsByStageStore.getRange().length) {
                        selectDataElements(dataElementsByStageStore.getRange());
                    }
                }
            }
        ],
        listeners: {
            afterrender(ms) {
                this.boundList.on('itemdblclick', function() {
                    if (ms.getValue().length) {
                        selectDataElements(ms.getValue());
                    }
                });
            }
        }
    });

    const dataElementSelected = Ext.create('Ext.panel.Panel', {
        width: accBaseWidth - 4,
        height: 176,
        bodyStyle: 'padding-left:1px',
        autoScroll: true,
        tbar: {
            height: 27,
            items: [
                {
                    xtype: 'label',
                    text: 'Selected data items',
                    style: 'padding-left:6px; color:#222',
                    cls: 'ns-toolbar-multiselect-left-label'
                },
                '->',
                {
                    xtype: 'button',
                    icon: 'images/arrowupdouble.png',
                    width: 22,
                    height: 22,
                    handler() {
                        dataElementSelected.removeAllDataElements();
                    }
                }
            ]
        },
        getChildIndex(child) {
            const items = this.items.items;

            for (let i = 0; i < items.length; i++) {
                if (items[i].id === child.id) {
                    return i;
                }
            }

            return items.length;
        },
        hasDataElement(dataElementId) {
            let hasDataElement = false;

            this.items.each(function(item) {
                if (item.dataElement.id === dataElementId) {
                    hasDataElement = true;
                }
            });

            return hasDataElement;
        },
        removeAllDataElements() {
            this.items.items.forEach(item => item.removeDataElement());
        }
    });

    const dataElement = Ext.create('Ext.panel.Panel', {
        title: '<div class="gis-panel-title-data">' + GIS.i18n.data + '</div>',
        bodyStyle: 'padding:1px',
        hideCollapseTool: true,
        items: [
            {
                layout: 'column',
                bodyStyle: 'border:0 none',
                style: 'margin-top:2px',
                items: [
                    program,
                    stage
                ]
            },
            dataElementAvailable,
            dataElementSelected
        ]
    });


    const startDate = Ext.create('Ext.form.field.Text', {
        fieldLabel: GIS.i18n.start_date,
        labelAlign: 'top',
        labelCls: 'gis-form-item-label-top',
        labelSeparator: '',
        columnWidth: 0.5,
        height: 41,
        value: gis.init.calendar.formatDate(gis.init.systemInfo.dateFormat, gis.init.calendar.today().add(-12, 'm')),
        listeners: {
            render(c) {
                onDateFieldRender(c);
            }
        }
    });

    const endDate = Ext.create('Ext.form.field.Text', {
        fieldLabel: GIS.i18n.end_date,
        labelAlign: 'top',
        labelCls: 'gis-form-item-label-top',
        labelSeparator: '',
        columnWidth: 0.5,
        height: 41,
        style: 'margin-left: 1px',
        value: gis.init.calendar.formatDate(gis.init.systemInfo.dateFormat, gis.init.calendar.today()),
        listeners: {
            render(c) {
                onDateFieldRender(c);
            }
        }
    });

    // Relative periods
    const periods = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.period,
        labelSeparator: '',
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        width: 220,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        labelAlign: 'top',
        labelCls: 'gis-form-item-label-top',
        style: 'padding-bottom:5px;',
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'index'],
            data: [{id: 'CUSTOM', name: GIS.i18n.start_end_dates}].concat(gis.conf.period.relativePeriods)
        }),
        selectFirst() {
            this.setValue(this.store.getAt(0).data.id);
        },
        listeners: {
            select() {
                const id = this.getValue();

                if (id === 'CUSTOM') {
                    startDate.enable();
                    endDate.enable();
                } else {
                    startDate.disable();
                    endDate.disable();
                }
            }
        }
    });

    const period = Ext.create('Ext.panel.Panel', {
        title: '<div class="gis-panel-title-period">Periods</div>',
        bodyStyle: 'padding:4px 1px 2px',
        hideCollapseTool: true,
        width: accBaseWidth,
        items: [
            periods, {
                xtype: 'container',
                layout: 'column',
                items: [
                    startDate,
                    endDate
                ]
            }
        ]
    });

    // organisation unit
    const treePanel = Ext.create('Ext.tree.Panel', {
        cls: 'gis-tree',
        width: accBaseWidth - 4,
        height: 313,
        bodyStyle: 'border:0 none',
        style: 'border-top: 1px solid #ddd; padding-top: 1px;',
        displayField: 'name',
        rootVisible: false,
        autoScroll: false, // https://www.sencha.com/forum/archive/index.php/t-144780.html?s=b3a72bbd82e5cc20417f0b5779439b97
        scroll:false,
        viewConfig: {
            style: 'overflow-y:auto'
        },
        multiSelect: true,
        rendered: false,
        reset() {
            const rootNode = this.getRootNode().findChild('id', gis.init.rootNodes[0].id);
            this.collapseAll();
            this.expandPath(rootNode.getPath());
            this.getSelectionModel().select(rootNode);
        },
        selectRootIf() {
            if (this.getSelectionModel().getSelection().length < 1) {
                const node = this.getRootNode().findChild('id', gis.init.rootNodes[0].id);
                if (this.rendered) {
                    this.getSelectionModel().select(node);
                }
                return node;
            }
        },
        isPending: false,
        recordsToSelect: [],
        recordsToRestore: [],
        multipleSelectIf(map, doUpdate) {
            if (this.recordsToSelect.length === gis.util.object.getLength(map)) {
                this.getSelectionModel().select(this.recordsToSelect);
                this.recordsToSelect = [];
                this.isPending = false;

                if (doUpdate) {
                    update();
                }
            }
        },
        multipleExpand(id, map, doUpdate) {
            const that = this;
            const rootId = gis.conf.finals.root.id;
            let path = map[id];

            if (path.substr(0, rootId.length + 1) !== ('/' + rootId)) {
                path = '/' + rootId + path;
            }

            that.expandPath(path, 'id', '/', function() {
                const record = Ext.clone(that.getRootNode().findChild('id', id, true));
                that.recordsToSelect.push(record);
                that.multipleSelectIf(map, doUpdate);
            });
        },
        select(url, params) {
            if (!params) {
                params = {};
            }
            Ext.Ajax.request({
                url: encodeURI(url),
                method: 'GET',
                params: params,
                scope: this,
                success(r) {
                    const units = JSON.parse(r.responseText).organisationUnits;
                    this.numberOfRecords = units.length;

                    units.forEach(unit => {
                        this.multipleExpand(unit.id, unit.path);
                    });
                }
            });
        },
        getParentGraphMap() {
            const selection = this.getSelectionModel().getSelection();
            const map = {};

            if (isArray(selection) && selection.length) {
                selection.forEach(sel => {
                    const pathArray = sel.getPath().split('/');
                    map[pathArray.pop()] = pathArray.join('/');
                });
            }

            return map;
        },
        selectGraphMap(map, update) {
            if (!gis.util.object.getLength(map)) {
                return;
            }

            this.isPending = true;

            for (let key in map) {
                if (map.hasOwnProperty(key)) {
                    treePanel.multipleExpand(key, map, update);
                }
            }
        },
        store: Ext.create('Ext.data.TreeStore', {
            fields: ['id', 'name', 'hasChildren'],
            proxy: {
                type: 'rest',
                format: 'json',
                noCache: false,
                extraParams: {
                    fields: 'children[id,' + gis.init.namePropertyUrl + ',children::isNotEmpty~rename(hasChildren)&paging=false'
                },
                url: gis.init.apiPath + 'organisationUnits',
                reader: {
                    type: 'json',
                    root: 'children'
                },
                sortParam: false
            },
            sorters: [{
                property: 'name',
                direction: 'ASC'
            }],
            root: {
                id: gis.conf.finals.root.id,
                expanded: true,
                children: gis.init.rootNodes
            },
            listeners: {
                beforeload(store, operation) {
                    if (!store.proxy._url) {
                        store.proxy._url = store.proxy.url;
                    }

                    store.proxy.url = store.proxy._url + '/' + operation.node.data.id;
                },
                load(store, node, records) {
                    records.forEach(function(record) {
                        if (Ext.isBoolean(record.data.hasChildren)) {
                            record.set('leaf', !record.data.hasChildren);
                        }
                    });
                }
            }
        }),
        xable(values) {
            for (let i = 0; i < values.length; i++) {
                if (!!values[i]) {
                    this.disable();
                    return;
                }
            }

            this.enable();
        },
        getDimension() {
            const r = treePanel.getSelectionModel().getSelection();
            const config = {
                dimension: gis.conf.finals.dimension.organisationUnit.objectName,
                items: []
            };

            if (userOrganisationUnit.getValue() || userOrganisationUnitChildren.getValue() || userOrganisationUnitGrandChildren.getValue()) {
                if (userOrganisationUnit.getValue()) {
                    config.items.push({
                        id: 'USER_ORGUNIT',
                        name: ''
                    });
                }
                if (userOrganisationUnitChildren.getValue()) {
                    config.items.push({
                        id: 'USER_ORGUNIT_CHILDREN',
                        name: ''
                    });
                }
                if (userOrganisationUnitGrandChildren.getValue()) {
                    config.items.push({
                        id: 'USER_ORGUNIT_GRANDCHILDREN',
                        name: ''
                    });
                }
            }
            else {
                r.forEach(item => config.items.push({id: item.data.id}));
            }

            return config.items.length ? config : null;
        },
        listeners: {
            beforeitemexpand() {
                if (!treePanel.isPending) {
                    treePanel.recordsToRestore = treePanel.getSelectionModel().getSelection();
                }
            },
            itemexpand() {
                if (!treePanel.isPending && treePanel.recordsToRestore.length) {
                    treePanel.getSelectionModel().select(treePanel.recordsToRestore);
                    treePanel.recordsToRestore = [];
                }
            },
            render() {
                this.rendered = true;
            },
            afterrender() {
                if (this.getRootNode().getChildAt(0)) {
                    this.getSelectionModel().select(0);
                }
            },
            itemcontextmenu(v, r, h, i, e) {
                e.stopEvent();

                v.getSelectionModel().select(r, false);

                if (v.menu) {
                    v.menu.destroy();
                }
                v.menu = Ext.create('Ext.menu.Menu', {
                    showSeparator: false,
                    shadow: false
                });
                if (!r.data.leaf) {
                    v.menu.add({
                        text: GIS.i18n.select_sub_units,
                        icon: 'images/node-select-child.png',
                        handler() {
                            r.expand(false, function() {
                                v.getSelectionModel().select(r.childNodes, true);
                                v.getSelectionModel().deselect(r);
                            });
                        }
                    });
                }
                else {
                    return;
                }

                v.menu.showAt(e.xy);
            }
        }
    });

    const userOrganisationUnit = Ext.create('Ext.form.field.Checkbox', {
        columnWidth: 0.33, // 0.25,
        style: 'padding-top: 2px; padding-left: 5px; margin-bottom: 0',
        boxLabelCls: 'x-form-cb-label-alt1',
        boxLabel: GIS.i18n.user_ou,
        labelWidth: gis.conf.layout.form_label_width,
        handler(chb, checked) {
            treePanel.xable([checked, userOrganisationUnitChildren.getValue(), userOrganisationUnitGrandChildren.getValue()]);
        }
    });

    const userOrganisationUnitChildren = Ext.create('Ext.form.field.Checkbox', {
        columnWidth: 0.33, // 0.26,
        style: 'padding-top: 2px; margin-bottom: 0',
        boxLabelCls: 'x-form-cb-label-alt1',
        boxLabel: GIS.i18n.user_sub_units,
        labelWidth: gis.conf.layout.form_label_width,
        handler(chb, checked) {
            treePanel.xable([checked, userOrganisationUnit.getValue(), userOrganisationUnitGrandChildren.getValue()]);
        }
    });

    const userOrganisationUnitGrandChildren = Ext.create('Ext.form.field.Checkbox', {
        columnWidth: 0.33, //0.4,
        style: 'padding-top: 2px; margin-bottom: 0',
        boxLabelCls: 'x-form-cb-label-alt1',
        boxLabel: GIS.i18n.user_sub_x2_units,
        labelWidth: gis.conf.layout.form_label_width,
        handler(chb, checked) {
            treePanel.xable([checked, userOrganisationUnit.getValue(), userOrganisationUnitChildren.getValue()]);
        }
    });

    const organisationUnitPanel = Ext.create('Ext.panel.Panel', {
        width: accBaseWidth,
        layout: 'column',
        bodyStyle: 'border:0 none',
        items: [
            userOrganisationUnit,
            userOrganisationUnitChildren,
            userOrganisationUnitGrandChildren
        ]
    });

    const organisationUnit = Ext.create('Ext.panel.Panel', {
        title: '<div class="gis-panel-title-organisationunit">' + GIS.i18n.organisation_units + '</div>',
        bodyStyle: 'padding:1px',
        hideCollapseTool: true,
        items: [
            organisationUnitPanel,
            treePanel
        ]
    });

    const coordinateFieldStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [{
            id: 'event',
            name: GIS.i18n.event_location
        }]
    });

    // Coordinate field
    const coordinateField = Ext.create('Ext.form.field.ComboBox', {
        editable: false,
        valueField: 'id',
        displayField: 'name',
        width: 160,
        forceSelection: true,
        queryMode: 'local',
        style: 'margin:1px 1px 10px 0',
        store: coordinateFieldStore,
        listeners: {
            render(cb) { // Event is default
                cb.setValue(cb.store.getAt(0).data.id);
            }
        }
    });

    const eventCluster = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: GIS.i18n.group_nearby_events,
        cls: 'gis-event-clustering-checkbox',
        checked: true
    });

    const eventColor = Ext.create('Ext.ux.button.ColorButton', {
        xtype: 'colorbutton',
        height: 24,
        width: 80,
        value: '333333'
    });

    const eventRadius = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 80,
        allowDecimals: false,
        minValue: 1,
        maxValue: 20,
        value: 6
    });

    const optionsPanel = Ext.create('Ext.panel.Panel', {
        title: '<div class="gis-panel-title-options">' + GIS.i18n.options + '</div>',
        cls: 'gis-accordion-last',
        bodyStyle: 'padding:6px 8px;',
        hideCollapseTool: true,
        width: accBaseWidth,
        items: [
            {
                xtype: 'container',
                html: GIS.i18n.coordinate_field,
                style: 'padding-bottom:3px;font-weight:bold;font-size:12px;'
            },
            coordinateField,
            {
                xtype: 'container',
                html: GIS.i18n.clustering,
                style: 'padding-bottom:3px;font-weight:bold;font-size:12px;'
            },
            eventCluster,
            {
                xtype: 'container',
                html: GIS.i18n.style,
                style: 'padding:10px 0 3px;font-weight:bold;font-size:12px;'
            },
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'container',
                        html: GIS.i18n.point_color + ':',
                        width: 80,
                        style: 'padding:5px;font-size:11px;'
                    },
                    eventColor
                ]
            },
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'container',
                        html: GIS.i18n.point_radius + ':',
                        width: 80,
                        style: 'padding:5px;font-size:11px;'
                    },
                    eventRadius
                ]
            }
        ]
    });

    // --------------- HANDLERS --------------- //

    // Program selection handler
    const onProgramSelect = function(programId, layout) {
        programId = layout ? layout.program.id : programId;
        stage.clearValue();

        dataElementsByStageStore.removeAll();
        dataElementSelected.removeAll();

        const load = function(stages) {
            stage.enable();
            stage.clearValue();

            stagesByProgramStore.removeAll();
            stagesByProgramStore.loadData(stages);

            const stageId = (layout ? layout.programStage.id : null) || (stages.length === 1 ? stages[0].id : null);

            if (stageId) {
                stage.setValue(stageId);
                onStageSelect(stageId, layout);
            }
        };

        if (stageStorage.hasOwnProperty(programId)) {
            load(stageStorage[programId]);
        }
        else {
            Ext.Ajax.request({
                url: encodeURI(gis.init.apiPath + 'programs.json?filter=id:eq:' + programId + '&fields=programStages[id,displayName~rename(name)],programTrackedEntityAttributes[trackedEntityAttribute[id,displayName~rename(name),valueType,optionSet[id,displayName~rename(name)]]]&paging=false'),
                success(r) {
                    const program = JSON.parse(r.responseText).programs[0];

                    if (!program) {
                        return;
                    }

                    const stages = program.programStages;
                    const attributes = arrayPluck(program.programTrackedEntityAttributes, 'trackedEntityAttribute');

                    // Mark as attribute
                    attributes.forEach(attribute => attribute.isAttribute = true);

                    // Attributes cache
                    if (isArray(attributes) && attributes.length) {
                        attributeStorage[programId] = attributes;
                    }

                    if (isArray(stages) && stages.length) {
                        stageStorage[programId] = stages; // stages cache
                        load(stages);
                    }
                }
            });
        }
    };

    const onStageSelect = function(stageId, layout) {
        if (!layout) {
            dataElementSelected.removeAll();
        }

        loadDataElements(stageId, layout);
    };

    const onDateFieldRender = function(c) {
        $('#' + c.inputEl.id).calendarsPicker({
            calendar: gis.init.calendar,
            dateFormat: gis.init.systemInfo.dateFormat
        });

        Ext.get(c.id).setStyle('z-index', 100000);
    };


    // --------------- FUNCTIONS --------------- //

    const loadDataElements = function(stageId, layout) {
        const programId = layout ? layout.program.id : (program.getValue() || null);

        stageId = stageId || layout.programStage.id;

        const load = function(dataElements) {
            const attributes = attributeStorage[programId];
            const data = arrayClean([].concat(attributes || [], dataElements || []));
            const coordinateFields = [{
                id: 'event',
                name: 'Event location'
            }].concat(data.filter(field => field.valueType === 'COORDINATE'));

            dataElementsByStageStore.loadData(data);

            coordinateFieldStore.removeAll();
            coordinateFieldStore.loadData(coordinateFields);

            if (layout) {
                const dataDimensions = gis.util.layout.getDataDimensionsFromLayout(layout);
                const records = [];

                dataDimensions.forEach(dim => {
                    const row = dataElementsByStageStore.getById(dim.dimension);

                    if (row) {
                        records.push(Ext.applyIf(dim, row.data));
                    }
                });

                selectDataElements(records, layout);

                if (layout.eventCoordinateField) {
                    coordinateField.setValue(layout.eventCoordinateField);
                }
            }
        };

        // data elements
        if (dataElementStorage.hasOwnProperty(stageId)) {
            load(dataElementStorage[stageId]);
        }
        else {
            Ext.Ajax.request({
                url: encodeURI(gis.init.apiPath + 'programStages.json?filter=id:eq:' + stageId + '&fields=programStageDataElements[dataElement[id,' + gis.init.namePropertyUrl + ',valueType,optionSet[id,displayName~rename(name)]]]'),
                success(r) {
                    const objects = JSON.parse(r.responseText).programStages;

                    if (!objects.length) {
                        load();
                        return;
                    }

                    const dataElements = arrayPluck(objects[0].programStageDataElements, 'dataElement');

                    dataElementStorage[stageId] = dataElements; // Data elements cache
                    load(dataElements);
                }
            });
        }
    };

    const addUxFromDataElement = function(element, index) {
        element.type = element.type || element.valueType;
        index = index || dataElementSelected.items.items.length;

        const getUxType = function(element) {
            if (Ext.isObject(element.optionSet) && Ext.isString(element.optionSet.id)) {
                return 'Ext.ux.panel.OrganisationUnitGroupSetContainer';
            }

            if (element.type === 'INTEGER' || element.type === 'NUMBER') {
                return 'Ext.ux.panel.DataElementIntegerContainer';
            }

            if (element.type === 'TEXT') {
                return 'Ext.ux.panel.DataElementStringContainer';
            }

            if (element.type === 'DATE') {
                return 'Ext.ux.panel.DataElementDateContainer';
            }

            if (element.type === 'BOOLEAN' || element.type === 'TRUE_ONLY') {
                return 'Ext.ux.panel.DataElementBooleanContainer';
            }

            return 'Ext.ux.panel.DataElementIntegerContainer';
        };

        const ux = dataElementSelected.insert(index, Ext.create(getUxType(element), {
            dataElement: element
        }));

        ux.removeDataElement = function() {
            dataElementSelected.remove(ux);

            if (!dataElementSelected.hasDataElement(element.id)) {
                dataElementsByStageStore.add(element);
                dataElementsByStageStore.sort();
            }
        };

        ux.duplicateDataElement = function() {
            const index = dataElementSelected.getChildIndex(ux) + 1;
            addUxFromDataElement(element, index);
        };

        dataElementsByStageStore.removeAt(dataElementsByStageStore.findExact('id', element.id));

        return ux;
    };

    const selectDataElements = function(items, layout) {
        const dataElements = [];

        // Data element objects
        items.forEach(item => {
            if (isString(item)) {
                dataElements.push(dataElementsByStageStore.getAt(dataElementsByStageStore.findExact('id', item)).data);
            }
            else if (isObject(item)) {
                if (item.data) {
                    dataElements.push(item.data);
                }
                else {
                    dataElements.push(item);
                }
            }
        });

        // panel, store
        dataElements.forEach(element => {
            const ux = addUxFromDataElement(element);

            if (layout) {
                ux.setRecord(element);
            }
        })
    };

    const reset = function(skipTree) {
        // Uncheck in layers list
        layer.item.setValue(false);

        if (!layer.window.isRendered) {
            layer.view = null;
            return;
        }

        // Components
        program.clearValue();
        stage.clearValue();

        dataElementsByStageStore.removeAll();
        dataElementSelected.removeAll();

        periods.selectFirst();
        startDate.reset();
        endDate.reset();

        if (!skipTree) {
            treePanel.reset();
        }

        userOrganisationUnit.setValue(false);
        userOrganisationUnitChildren.setValue(false);
        userOrganisationUnitGrandChildren.setValue(false);

        // Options
        coordinateFieldStore.removeAll();
        eventCluster.reset();
        eventColor.reset();
        eventRadius.reset();
    };

    const setGui = function(view) {
        const ouDim = view.rows[0];

        let isOu = false;
        let isOuc = false;
        let isOugc = false;
        let isTopOu = false;

        const setWidgetGui = function() {

            // Components
            if (!layer.window.isRendered) {
                return;
            }

            reset(true);

            // Program
            program.store.add(view.program);
            program.setValue(view.program.id);

            onProgramSelect(null, view);

            if (view.startDate) {
                startDate.setValue(view.startDate);
                startDate.enable();
            }

            if (view.endDate) {
                endDate.setValue(view.endDate);
                endDate.enable();
            }

            // Periods
            if (view.filters && view.filters[0] && view.filters[0].dimension === dimConf.period.objectName && view.filters[0].items) {
                periods.select(view.filters[0].items[0].id);
                startDate.disable();
                endDate.disable();
            }

            // Organisation units
            ouDim.items.forEach(item => {
                if (item.id === 'USER_ORGUNIT') {
                    isOu = true;
                }
                else if (item.id === 'USER_ORGUNIT_CHILDREN') {
                    isOuc = true;
                }
                else if (item.id === 'USER_ORGUNIT_GRANDCHILDREN') {
                    isOugc = true;
                } else {
                    isTopOu = true;
                }
            });

            if (!isTopOu) {
                userOrganisationUnit.setValue(isOu);
                userOrganisationUnitChildren.setValue(isOuc);
                userOrganisationUnitGrandChildren.setValue(isOugc);
            }

            treePanel.selectGraphMap(view.parentGraphMap);

            // Options
            if (view.eventCoordinateField !== undefined) {
                coordinateField.setValue(view.eventCoordinateField);
            }

            if (view.eventClustering !== undefined) {
                eventCluster.setValue(view.eventClustering);
            }

            if (view.eventPointColor) {
                eventColor.setValue(view.eventPointColor);
            }

            if (view.eventPointRadius !== undefined) {
                eventRadius.setValue(view.eventPointRadius);
            }

        }();

        const setLayerGui = function() {

            // Layer item
            layer.item.setValue(!view.hidden, view.opacity);

            // Layer menu
            layer.menu.enableItems();
        }();
    };

    const getView = function(config) {
        const view = {};

        view.program = program.getRecord();
        view.programStage = stage.getRecord();

        if (periods.getValue() === 'CUSTOM') {
            view.startDate = gis.init.calendar.formatDate('yyyy-mm-dd', gis.init.calendar.parseDate(gis.init.systemInfo.dateFormat, startDate.getValue()));
            view.endDate = gis.init.calendar.formatDate('yyyy-mm-dd', gis.init.calendar.parseDate(gis.init.systemInfo.dateFormat, endDate.getValue()));
        } else {
            // pe
            view.filters = [{
                dimension: dimConf.period.objectName,
                items: [{
                    id: periods.getValue()
                }]
            }];
        }

        view.columns = [];

        dataElementSelected.items.items.forEach(panel => {
            view.columns.push(panel.getRecord());
        });

        view.rows = [{
            dimension: 'ou',
            items: treePanel.getDimension().items
        }];

        if (coordinateField.getValue() !== 'event') { // If not event location
            view.eventCoordinateField = coordinateField.getValue();
        }

        view.eventClustering = eventCluster.getValue();
        view.eventPointColor = eventColor.getValue();
        view.eventPointRadius = eventRadius.getValue();
        view.opacity = layer.layerOpacity;

        return view;
    };

    const validateView = function(view) {
        if (!(Ext.isArray(view.rows) && view.rows.length && Ext.isString(view.rows[0].dimension) && Ext.isArray(view.rows[0].items) && view.rows[0].items.length)) {
            GIS.logg.push([view.rows, layer.id + '.rows: dimension array']);
            alert('No organisation units selected');
            return false;
        }

        return view;
    };

    // accordion
    const accordionBody = Ext.create('Ext.panel.Panel', {
        layout: 'accordion',
        activeOnTop: true,
        cls: 'gis-accordion',
        bodyStyle: 'border:0 none',
        height: 450,
        items: [
            dataElement,
            period,
            organisationUnit,
            optionsPanel
        ],
        listeners: {
            afterrender() { // nasty workaround
                optionsPanel.expand();
                organisationUnit.expand();
                period.expand();
                dataElement.expand();
                periods.selectFirst();
            }
        }
    });

    const panel = Ext.create('Ext.panel.Panel', {
        map: layer.map,
        layer: layer,
        menu: layer.menu,

        reset: reset,
        setGui: setGui,
        getView: getView,
        getParentGraphMap() {
            return treePanel.getParentGraphMap();
        },

        cls: 'gis-form-widget',
        border: false,
        items: [
            accordionBody
        ]
    });

    return panel;
};
