export default function FavoriteWindow(gis) {

    // Objects
    var NameWindow,

    // Instances
        nameWindow,

    // Components
        addButton,
        searchTextfield,
        grid,
        prevButton,
        nextButton,
        info,
        nameTextfield,
        createButton,
        updateButton,
        cancelButton,
        favoriteWindow,

    // Vars
        windowWidth = 500,
        windowCmpWidth = windowWidth - 14;

    gis.store.maps.on('load', function(store, records) {
        var pager = store.proxy.reader.jsonData.pager;

        if (!pager) {
            return;
        }

        info.setText('Page ' + pager.page + ' of ' + pager.pageCount);

        prevButton.enable();
        nextButton.enable();

        if (pager.page === 1) {
            prevButton.disable();
        }

        if (pager.page === pager.pageCount) {
            nextButton.disable();
        }
    });

    NameWindow = function(id) {
        var window,
            record = gis.store.maps.getById(id);

        nameTextfield = Ext.create('Ext.form.field.Text', {
            height: 26,
            width: 371,
            fieldStyle: 'padding-left: 5px; border-radius: 1px; border-color: #bbb; font-size:11px',
            style: 'margin-bottom:0',
            emptyText: 'Favorite name',
            value: id ? record.data.name : '',
            listeners: {
                afterrender: function() {
                    this.focus();
                }
            }
        });

        createButton = Ext.create('Ext.button.Button', {
            text: GIS.i18n.create,
            handler: function() {
                var name = nameTextfield.getValue(),
                    layers = gis.util.map.getVisibleVectorLayers(),
                    centerPoint = gis.instance.getCenter(),
                    layer,
                    views = [],
                    view,
                    map;

                if (!layers.length) {
                    gis.alert('Please create a map first');
                    return;
                }

                if (!name) {
                    gis.alert('Please enter a name');
                    return;
                }

                for (var i = 0; i < layers.length; i++) {
                    layer = layers[i];

                    view = Ext.clone(layer.view);

                    // TODO temp fix: https://github.com/dhis2/dhis2-gis/issues/108
                    if (view.legendSet && view.method && (view.method === 2 || view.method === 3)) {
                        delete view.legendSet;
                    }

                    view.hidden = !gis.instance.hasLayer(layer.instance);

                    // add
                    view.layer = layer.id;

                    view.opacity = layer.layerOpacity;

                    // remove
                    delete view.dataDimensionItems;

                    views.push(view);
                }

                map = {
                    name: name,
                    longitude: centerPoint.lng,
                    latitude: centerPoint.lat,
                    zoom: gis.instance.getZoom(),
                    basemap: gis.util.map.getBasemap(),
                    mapViews: views,
                    user: {
                        id: 'currentUser'
                    }
                };

                //console.log('save', JSON.stringify(map));

                Ext.Ajax.request({
                    url: encodeURI(gis.init.contextPath + '/api/maps/'),
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    params: JSON.stringify(map),
                    success: function(r) {
                        var id = r.getAllResponseHeaders().location.split('/').pop();

                        gis.map = {
                            id: id,
                            name: name
                        };

                        gis.store.maps.loadStore();

                        window.destroy();
                    }
                });
            }
        });

        updateButton = Ext.create('Ext.button.Button', {
            text: GIS.i18n.update,
            handler: function() {
                var name = nameTextfield.getValue(),
                    map;

                Ext.Ajax.request({
                    url: encodeURI(gis.init.contextPath + '/api/maps/' + id + '.json?fields=' + gis.conf.url.mapFields.join(',')),
                    success: function(r) {
                        map = JSON.parse(r.responseText);

                        map.name = name;

                        Ext.Ajax.request({
                            url: encodeURI(gis.init.contextPath + '/api/maps/' + id),
                            method: 'PUT',
                            headers: {'Content-Type': 'application/json'},
                            params: JSON.stringify(map),
                            success: function() {
                                gis.store.maps.loadStore();

                                window.destroy();
                            }
                        });
                    }
                });
            }
        });

        cancelButton = Ext.create('Ext.button.Button', {
            text: GIS.i18n.cancel,
            handler: function() {
                window.destroy();
            }
        });

        window = Ext.create('Ext.window.Window', {
            title: id ? 'Rename favorite' : 'Create new favorite',
            iconCls: 'gis-window-title-icon-favorite',
            bodyStyle: 'padding:1px; background:#fff',
            resizable: false,
            modal: true,
            items: nameTextfield,
            destroyOnBlur: true,
            bbar: [
                cancelButton,
                '->',
                id ? updateButton : createButton
            ],
            listeners: {
                show: function(w) {
                    this.setPosition(favoriteWindow.x + 14, favoriteWindow.y + 67);

                    if (!w.hasDestroyOnBlurHandler) {
                        gis.util.gui.window.addDestroyOnBlurHandler(w);
                    }

                    gis.viewport.favoriteWindow.destroyOnBlur = true;

                    nameTextfield.focus(false, 500);
                }
            }
        });

        return window;
    };

    addButton = Ext.create('Ext.button.Button', {
        text: GIS.i18n.add_new,
        width: 67,
        height: 26,
        style: 'border-radius: 1px;',
        menu: {},
        handler: function() {
            nameWindow = new NameWindow(null, 'create');
            nameWindow.show();
        }
    });

    searchTextfield = Ext.create('Ext.form.field.Text', {
        width: windowCmpWidth - addButton.width - 3,
        height: 26,
        fieldStyle: 'padding-right: 0; padding-left: 4px; border-radius: 1px; border-color: #bbb; font-size:11px',
        emptyText: GIS.i18n.search_for_favorites,
        enableKeyEvents: true,
        currentValue: '',
        listeners: {
            keyup: {
                fn: function() {
                    if (this.getValue() !== this.currentValue) {
                        this.currentValue = this.getValue();

                        var value = this.getValue(),
                            url = value ? encodeURI(gis.init.contextPath + '/api/maps.json?fields=id,displayName|rename(name),access' + (value ? '&filter=displayName:ilike:' + value : '')) : null,
                            store = gis.store.maps;

                        store.page = 1;
                        store.loadStore(url);
                    }
                },
                buffer: 100
            }
        }
    });

    prevButton = Ext.create('Ext.button.Button', {
        text: GIS.i18n.prev,
        handler: function() {
            var value = searchTextfield.getValue(),
                url = value ? encodeURI(gis.init.contextPath + '/api/maps.json?fields=id,displayName|rename(name),access' + (value ? '&filter=displayName:ilike:' + value : '')) : null,
                store = gis.store.maps;

            store.page = store.page <= 1 ? 1 : store.page - 1;
            store.loadStore(url);
        }
    });

    nextButton = Ext.create('Ext.button.Button', {
        text: GIS.i18n.next,
        handler: function() {
            var value = searchTextfield.getValue(),
                url = value ? encodeURI(gis.init.contextPath + '/api/maps.json?fields=id,displayName|rename(name),access' + (value ? '&filter=displayName:ilike:' + value : '')) : null,
                store = gis.store.maps;

            store.page = store.page + 1;
            store.loadStore(url);
        }
    });

    info = Ext.create('Ext.form.Label', {
        cls: 'gis-label-info',
        width: 300,
        height: 22
    });

    grid = Ext.create('Ext.grid.Panel', {
        cls: 'gis-grid',
        scroll: false,
        hideHeaders: true,
        columns: [
            {
                dataIndex: 'name',
                sortable: false,
                width: windowCmpWidth - 88,
                renderer: function(value, metaData, record) {
                    var fn = function() {
                        var element = Ext.get(record.data.id);

                        if (element) {
                            element = element.parent('td');
                            element.addClsOnOver('link');
                            element.load = function() {
                                favoriteWindow.hide();
                                gis.map = {id: record.data.id};
                                GIS.core.MapLoader(gis).load();
                            };
                            element.dom.setAttribute('onclick', 'Ext.get(this).load();');
                        }
                    };

                    Ext.defer(fn, 100);

                    return '<div id="' + record.data.id + '" class="el-fontsize-10">' + value + '</div>';
                }
            },
            {
                xtype: 'actioncolumn',
                sortable: false,
                width: 80,
                items: [
                    {
                        iconCls: 'gis-grid-row-icon-edit',
                        getClass: function(value, metaData, record) {
                            return 'tooltip-favorite-edit' + (!record.data.access.update ? ' disabled' : '');
                        },
                        handler: function(grid, rowIndex, colIndex, col, event) {
                            var record = this.up('grid').store.getAt(rowIndex);

                            if (record.data.access.update) {
                                nameWindow = new NameWindow(record.data.id);
                                nameWindow.show();
                            }
                        }
                    },
                    {
                        iconCls: 'gis-grid-row-icon-overwrite',
                        getClass: function(value, metaData, record) {
                            return 'tooltip-favorite-overwrite' + (!record.data.access.update ? ' disabled' : '');
                        },
                        handler: function(grid, rowIndex, colIndex, col, event) {
                            var record = this.up('grid').store.getAt(rowIndex),
                                layers,
                                layer,
                                centerPoint,
                                views,
                                view,
                                map,
                                message;

                            if (record.data.access.update) {
                                layers = gis.util.map.getVisibleVectorLayers();

                                message = 'Overwrite favorite?\n\n' + record.data.name;

                                if (layers.length) {
                                    if (confirm(message)) {
                                        centerPoint = gis.instance.getCenter(),
                                        views = [];

                                        for (var i = 0; i < layers.length; i++) {
                                            layer = layers[i];
                                            view = layer.view;

                                            // add
                                            view.layer = layer.id;
                                            view.hidden = !gis.instance.hasLayer(layer.instance);

                                            // remove
                                            delete view.periodType;

                                            views.push(view);
                                        }

                                        map = {
                                            longitude: centerPoint.lng,
                                            latitude: centerPoint.lat,
                                            zoom: gis.instance.getZoom(),
                                            mapViews: views,
                                            basemap: gis.util.map.getBasemap()
                                        };

                                        Ext.Ajax.request({
                                            url: encodeURI(gis.init.contextPath + '/api/maps/' + record.data.id),
                                            method: 'PUT',
                                            headers: {'Content-Type': 'application/json'},
                                            params: JSON.stringify(map),
                                            success: function() {
                                                gis.map = map;
                                                gis.store.maps.loadStore();
                                            }
                                        });
                                    }
                                }
                                else {
                                    gis.alert(GIS.i18n.no_map_to_save);
                                }
                            }
                        }
                    },
                    {
                        iconCls: 'gis-grid-row-icon-sharing',
                        getClass: function(value, metaData, record) {
                            return 'tooltip-favorite-sharing' + (!record.data.access.manage ? ' disabled' : '');
                        },
                        handler: function(grid, rowIndex) {
                            var record = this.up('grid').store.getAt(rowIndex);

                            if (record.data.access.manage) {
                                Ext.Ajax.request({
                                    url: encodeURI(gis.init.contextPath + '/api/sharing?type=map&id=' + record.data.id),
                                    method: 'GET',
                                    failure: function(r) {
                                        gis.mask.hide();
                                        gis.alert(r);
                                    },
                                    success: function(r) {
                                        var sharing = JSON.parse(r.responseText),
                                            window = GIS.app.SharingWindow(gis, sharing);
                                        window.show();
                                    }
                                });
                            }
                        }
                    },
                    {
                        iconCls: 'gis-grid-row-icon-delete',
                        getClass: function(value, metaData, record) {
                            return 'tooltip-favorite-delete' + (!record.data.access['delete'] ? ' disabled' : '');
                        },
                        handler: function(grid, rowIndex, colIndex, col, event) {
                            var record = this.up('grid').store.getAt(rowIndex),
                                message;

                            if (record.data.access['delete']) {
                                message = 'Delete favorite?\n\n' + record.data.name;

                                if (confirm(message)) {
                                    Ext.Ajax.request({
                                        url: encodeURI(gis.init.contextPath + '/api/maps/' + record.data.id),
                                        method: 'DELETE',
                                        success: function() {
                                            gis.store.maps.loadStore();
                                        },
                                        failure: function(r) {
                                            gis.alert(r);
                                        }
                                    });
                                }
                            }
                        }
                    }
                ]
            },
            {
                sortable: false,
                width: 6
            }
        ],
        store: gis.store.maps,
        bbar: [
            info,
            '->',
            prevButton,
            nextButton
        ],
        listeners: {
            added: function() {
                gis.viewport.mapGrid = this;
            },
            render: function() {
                var size = Math.floor((gis.viewport.centerRegion.getHeight() - 155) / gis.conf.layout.grid.row_height);
                this.store.pageSize = size;
                this.store.page = 1;
                this.store.loadStore();

                gis.store.maps.on('load', function() {
                    if (this.isVisible()) {
                        this.fireEvent('afterrender');
                    }
                }, this);
            },
            afterrender: function() {
                var fn = function() {
                    var editArray = Ext.query('.tooltip-favorite-edit'),
                        overwriteArray = Ext.query('.tooltip-favorite-overwrite'),
                        sharingArray = Ext.query('.tooltip-favorite-sharing'),
                        dashboardArray = Ext.query('.tooltip-favorite-dashboard'),
                        deleteArray = Ext.query('.tooltip-favorite-delete'),
                        el;

                    for (var i = 0; i < editArray.length; i++) {
                        var el = editArray[i];
                        Ext.create('Ext.tip.ToolTip', {
                            target: el,
                            html: GIS.i18n.rename,
                            anchor: 'bottom',
                            anchorOffset: -14,
                            showDelay: 500
                        });
                    }

                    for (var i = 0; i < overwriteArray.length; i++) {
                        el = overwriteArray[i];
                        Ext.create('Ext.tip.ToolTip', {
                            target: el,
                            html: GIS.i18n.overwrite,
                            anchor: 'bottom',
                            anchorOffset: -14,
                            showDelay: 500
                        });
                    }

                    for (var i = 0; i < sharingArray.length; i++) {
                        el = sharingArray[i];
                        Ext.create('Ext.tip.ToolTip', {
                            target: el,
                            html: GIS.i18n.share_with_other_people,
                            anchor: 'bottom',
                            anchorOffset: -14,
                            showDelay: 500
                        });
                    }

                    for (var i = 0; i < dashboardArray.length; i++) {
                        el = dashboardArray[i];
                        Ext.create('Ext.tip.ToolTip', {
                            target: el,
                            html: GIS.i18n.add_to_dashboard,
                            anchor: 'bottom',
                            anchorOffset: -14,
                            showDelay: 500
                        });
                    }

                    for (var i = 0; i < deleteArray.length; i++) {
                        el = deleteArray[i];
                        Ext.create('Ext.tip.ToolTip', {
                            target: el,
                            html: GIS.i18n.delete,
                            anchor: 'bottom',
                            anchorOffset: -14,
                            showDelay: 500
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

    favoriteWindow = Ext.create('Ext.window.Window', {
        title: GIS.i18n.manage_favorites + (gis.map ? '<span style="font-weight:normal">&nbsp;|&nbsp;&nbsp;' + gis.map.name + '</span>' : ''),
        iconCls: 'gis-window-title-icon-favorite',
        cls: 'gis-container-default',
        bodyStyle: 'padding:1px',
        resizable: false,
        modal: true,
        width: windowWidth,
        destroyOnBlur: true,
        items: [
            {
                xtype: 'panel',
                layout: 'hbox',
                cls: 'gis-container-inner',
                height: 27,
                items: [
                    addButton,
                    {
                        height: 26,
                        width: 1,
                        style: 'width:1px; margin-left:1px; margin-right:1px',
                        bodyStyle: 'border-left: 1px solid #aaa'
                    },
                    searchTextfield
                ]
            },
            grid
        ],
        listeners: {
            show: function(w) {
                this.setPosition(199, 33);

                if (!w.hasDestroyOnBlurHandler) {
                    gis.util.gui.window.addDestroyOnBlurHandler(w);
                }

                searchTextfield.focus(false, 500);
            }
        }
    });

    return favoriteWindow;
};