import isArray from 'd2-utilizr/lib/isArray';
import isBoolean from 'd2-utilizr/lib/isBoolean';
import isString from 'd2-utilizr/lib/isString';
import arrayMax from 'd2-utilizr/lib/arrayMax';

export default function LayerWidgetBoundary(gis, layer) {
    const accordionPanels = [];
    let last;

    // Stores
    const infrastructuralDataElementValuesStore = Ext.create('Ext.data.Store', {
        fields: ['name', 'value'],
        sorters: [{
            property: 'name',
            direction: 'ASC'
        }]
    });

    // Components

    const treePanel = Ext.create('Ext.tree.Panel', {
        cls: 'gis-tree',
        height: 327,
        style: 'border-top: 1px solid #ddd; padding-top: 1px',
        displayField: 'name',
        width: gis.conf.layout.widget.item_width,
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
            const rootId = gis.conf.finals.root.id;
            let path = map[id];

            if (path.substr(0, rootId.length + 1) !== ('/' + rootId)) {
                path = '/' + rootId + path;
            }

            this.expandPath(path, 'id', '/', () => {
                const record = Ext.clone(this.getRootNode().findChild('id', id, true));
                if (record) { // Can be null
                    this.recordsToSelect.push(record);
                }
                this.multipleSelectIf(map, doUpdate);
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
                    const a = JSON.parse(r.responseText).organisationUnits;
                    this.numberOfRecords = a.length;
                    a.forEach(u => this.multipleExpand(u.id, u.path));
                }
            });
        },
        getParentGraphMap() {
            const selection = this.getSelectionModel().getSelection();
            const map = {};

            if (isArray(selection) && selection.length) {
                for (let i = 0, pathArray; i < selection.length; i++) {
                    pathArray = selection[i].getPath().split('/');
                    map[pathArray.pop()] = pathArray.join('/');
                }
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
                        if (isBoolean(record.data.hasChildren)) {
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

            if (toolMenu.menuValue === 'orgunit') {
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
                    for (let i = 0; i < r.length; i++) {
                        config.items.push({id: r[i].data.id});
                    }
                }
            }
            else if (toolMenu.menuValue === 'level') {
                const levels = organisationUnitLevel.getValue();
                const maxLevel = arrayMax(levels);

                for (let i = 0; i < levels.length; i++) {
                    config.items.push({
                        id: 'LEVEL-' + levels[i],
                        name: ''
                    });
                }

                for (let i = 0, item; i < r.length; i++) {
                    item = r[i].data;

                    if (maxLevel && item.depth > maxLevel) {
                        gis.alert(item.name + ' ' + GIS.i18n.is_not_part_of_selected_organisation_unit_levels);
                        return null;
                    }

                    config.items.push({
                        id: item.id,
                        name: ''
                    });
                }
            }
            else if (toolMenu.menuValue === 'group') {
                const groupIds = organisationUnitGroup.getValue();

                for (let i = 0; i < groupIds.length; i++) {
                    config.items.push({
                        id: 'OU_GROUP-' + groupIds[i],
                        name: ''
                    });
                }

                for (let i = 0; i < r.length; i++) {
                    config.items.push({
                        id: r[i].data.id,
                        name: ''
                    });
                }
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
        columnWidth: 0.3,
        style: 'padding-top: 2px; padding-left: 3px; margin-bottom: 0',
        boxLabelCls: 'x-form-cb-label-alt1',
        boxLabel: GIS.i18n.user_ou,
        labelWidth: gis.conf.layout.form_label_width,
        handler(chb, checked) {
            treePanel.xable([checked, userOrganisationUnitChildren.getValue(), userOrganisationUnitGrandChildren.getValue()]);
        }
    });

    const userOrganisationUnitChildren = Ext.create('Ext.form.field.Checkbox', {
        columnWidth: 0.33,
        style: 'padding-top: 2px; margin-bottom: 0',
        boxLabelCls: 'x-form-cb-label-alt1',
        boxLabel: GIS.i18n.sub_units,
        labelWidth: gis.conf.layout.form_label_width,
        handler(chb, checked) {
            treePanel.xable([checked, userOrganisationUnit.getValue(), userOrganisationUnitGrandChildren.getValue()]);
        }
    });

    const userOrganisationUnitGrandChildren = Ext.create('Ext.form.field.Checkbox', {
        columnWidth: 0.34,
        style: 'padding-top: 2px; margin-bottom: 0',
        boxLabelCls: 'x-form-cb-label-alt1',
        boxLabel: GIS.i18n.sub_x2_units,
        labelWidth: gis.conf.layout.form_label_width,
        handler(chb, checked) {
            treePanel.xable([checked, userOrganisationUnit.getValue(), userOrganisationUnitChildren.getValue()]);
        }
    });

    const organisationUnitLevel = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        multiSelect: true,
        style: 'margin-bottom:0',
        width: gis.conf.layout.widget.item_width - 37,
        valueField: 'level',
        displayField: 'name',
        emptyText: GIS.i18n.select_organisation_unit_levels,
        editable: false,
        hidden: true,
        store: {
            fields: ['id', 'name', 'level'],
            data: gis.init.organisationUnitLevels
        }
    });

    const organisationUnitGroup = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        multiSelect: true,
        style: 'margin-bottom:0',
        width: gis.conf.layout.widget.item_width - 37,
        valueField: 'id',
        displayField: 'name',
        emptyText: GIS.i18n.select_organisation_unit_groups,
        editable: false,
        hidden: true,
        store: gis.store.organisationUnitGroup
    });

    const toolMenu = Ext.create('Ext.menu.Menu', {
        shadow: false,
        showSeparator: false,
        menuValue: 'level',
        clickHandler(param) {
            if (!param) {
                return;
            }

            const items = this.items.items;
            this.menuValue = param;

            // Menu item icon cls
            for (let i = 0; i < items.length; i++) {
                if (items[i].setIconCls) {
                    if (items[i].param === param) {
                        items[i].setIconCls('gis-menu-item-selected');
                    }
                    else {
                        items[i].setIconCls('gis-menu-item-unselected');
                    }
                }
            }

            // Gui
            if (param === 'orgunit') {
                userOrganisationUnit.show();
                userOrganisationUnitChildren.show();
                userOrganisationUnitGrandChildren.show();
                organisationUnitLevel.hide();
                organisationUnitGroup.hide();

                if (userOrganisationUnit.getValue() || userOrganisationUnitChildren.getValue()) {
                    treePanel.disable();
                }
            }
            else if (param === 'level') {
                userOrganisationUnit.hide();
                userOrganisationUnitChildren.hide();
                userOrganisationUnitGrandChildren.hide();
                organisationUnitLevel.show();
                organisationUnitGroup.hide();
                treePanel.enable();
            }
            else if (param === 'group') {
                userOrganisationUnit.hide();
                userOrganisationUnitChildren.hide();
                userOrganisationUnitGrandChildren.hide();
                organisationUnitLevel.hide();
                organisationUnitGroup.show();
                treePanel.enable();
            }
        },
        items: [
            {
                xtype: 'label',
                text: GIS.i18n.selection_mode,
                style: 'padding:7px 5px 5px 7px; font-weight:bold; border:0 none'
            },
            {
                text: GIS.i18n.select_organisation_units + '&nbsp;&nbsp;',
                param: 'orgunit',
                iconCls: 'gis-menu-item-selected'
            },
            {
                text: GIS.i18n.select_levels + '&nbsp;&nbsp;',
                param: 'level',
                iconCls: 'gis-menu-item-unselected'
            },
            {
                text: GIS.i18n.select_groups + '&nbsp;&nbsp;',
                param: 'group',
                iconCls: 'gis-menu-item-unselected'
            }
        ],
        listeners: {
            afterrender() {
                this.getEl().addCls('gis-btn-menu');
            },
            click(menu, item) {
                this.clickHandler(item.param);
            }
        }
    });

    const tool = Ext.create('Ext.button.Button', {
        cls: 'gis-button-organisationunitselection',
        iconCls: 'gis-button-icon-gear',
        width: 36,
        height: 24,
        menu: toolMenu
    });

    const toolPanel = Ext.create('Ext.panel.Panel', {
        width: 36,
        bodyStyle: 'border:0 none; text-align:right',
        style: 'margin-right:1px',
        items: tool
    });

    const organisationUnit = Ext.create('Ext.panel.Panel', {
        title: '<div class="ns-panel-title-data">' + GIS.i18n.organisation_units + '</div>',
        hideCollapseTool: true,
        items: [
            {
                layout: 'column',
                bodyStyle: 'border:0 none',
                style: 'padding-bottom:1px',
                items: [
                    toolPanel,
                    {
                        layout: 'column',
                        bodyStyle: 'border:0 none',
                        items: [
                            userOrganisationUnit,
                            userOrganisationUnitChildren,
                            userOrganisationUnitGrandChildren,
                            organisationUnitLevel,
                            organisationUnitGroup
                        ]
                    }
                ]
            },
            treePanel
        ],
        listeners: {
            added() {
                accordionPanels.push(this);
            }
        }
    });

    const labelPanel = Ext.create('Ext.ux.panel.LabelPanel', {
        skipBoldButton: true,
        skipColorButton: true
    });

    const radius = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 75,
        allowDecimals: false,
        minValue: 1,
        maxValue: 50,
        value: 5
    });

    const optionsPanel = Ext.create('Ext.panel.Panel', {
        title: '<div class="ns-panel-title-data">' + GIS.i18n.options + '</div>',
        hideCollapseTool: true,
        items: [labelPanel, {
            xtype: 'container',
            layout: 'hbox',
            style: 'margin-top:5px',
            items: [
                {
                    xtype: 'container',
                    html: 'Point radius:',
                    width: 100,
                    style: 'padding:5px;font-size:11px;'
                },
                radius
            ]
        }],
        listeners: {
            added() {
                accordionPanels.push(this);
            }
        }
    });

    // Functions

    const reset = function(skipTree) {

        // Item
        layer.item.setValue(false);

        if (!layer.window.isRendered) {
            layer.view = null;
            return;
        }

        // Components
        toolMenu.clickHandler(toolMenu.menuValue);

        if (!skipTree) {
            treePanel.reset();
        }

        userOrganisationUnit.setValue(false);
        userOrganisationUnitChildren.setValue(false);
        userOrganisationUnitGrandChildren.setValue(false);

        organisationUnitLevel.clearValue();
        organisationUnitGroup.clearValue();

        // Layer options
        if (layer.searchWindow) {
            layer.searchWindow.destroy();
            layer.searchWindow = null;
        }

        radius.setValue(5);
    };

    const setGui = function(view) {
        const ouDim = view.rows[0];
        const levels = [];
        const groups = [];

        let isOu = false;
        let isOuc = false;
        let isOugc = false;

        const setWidgetGui = function() {

            // Components
            if (!layer.window.isRendered) {
                return;
            }

            reset(true);

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
                }
                else if (item.id.substr(0,5) === 'LEVEL') {
                    levels.push(parseInt(item.id.split('-')[1]));
                }
                else if (item.id.substr(0,8) === 'OU_GROUP') {
                    groups.push(parseInt(item.id.split('-')[1]));
                }
            });

            if (levels.length) {
                toolMenu.clickHandler('level');
                organisationUnitLevel.setValue(levels);
            }
            else if (groups.length) {
                toolMenu.clickHandler('group');
                organisationUnitGroup.setValue(groups);
            }
            else {
                toolMenu.clickHandler('orgunit');
                userOrganisationUnit.setValue(isOu);
                userOrganisationUnitChildren.setValue(isOuc);
                userOrganisationUnitGrandChildren.setValue(isOugc);
            }

            treePanel.selectGraphMap(view.parentGraphMap);

            if (view.radiusLow) {
                radius.setValue(view.radiusLow);
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

        if (treePanel.getDimension()) {
            view.rows = [treePanel.getDimension()];
        } else {
            return;
        }

        Ext.apply(view, labelPanel.getConfig());

        view.radiusLow = radius.getValue(); // Reusing map view field from thematic layer

        return validateView(view);
    };

    const validateView = function(view) {
        if (!(isArray(view.rows) && view.rows.length && isString(view.rows[0].dimension) && isArray(view.rows[0].items) && view.rows[0].items.length)) {
            GIS.logg.push([view.rows, layer.id + '.rows: dimension array']);
            alert('No organisation units selected');
            return false;
        }

        return view;
    };

    const accordionBody = Ext.create('Ext.panel.Panel', {
        layout: 'accordion',
        activeOnTop: true,
        cls: 'ns-accordion',
        bodyStyle: 'border:0 none; margin-bottom:1px',
        height: 408,
        items: function() {
            const panels = [
                organisationUnit,
                optionsPanel
            ];

            last = panels[panels.length - 1];
            last.cls = 'ns-accordion-last';

            return panels;
        }(),
        listeners: {
            afterrender() { // nasty workaround
                for (let i = accordionPanels.length - 1; i >= 0; i--) {
                    accordionPanels[i].expand();
                }
            }
        }
    });

    const accordion = Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border-style:none; padding:1px; padding-bottom:0',
        items: accordionBody,
        panels: accordionPanels,

        map: layer.map,
        layer: layer,
        menu: layer.menu,

        reset: reset,
        setGui: setGui,
        getView: getView,
        getParentGraphMap() {
            return treePanel.getParentGraphMap();
        },

        infrastructuralDataElementValuesStore: infrastructuralDataElementValuesStore,
        getExpandedPanel() {
            for (let i = 0; i < this.panels.length; i++) {
                if (!this.panels[i].collapsed) {
                    return this.panels[i];
                }
            }

            return null;
        },
        getFirstPanel() {
            return this.panels[0];
        },
        listeners: {
            render() {
                toolMenu.clickHandler('level');
            }
        }
    });

    return accordion;
};
