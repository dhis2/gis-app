export default function FavoriteWindow(gis) {
    const windowWidth = 500;
    const windowCmpWidth = windowWidth - 14;

    gis.store.maps.on('load', (store, records) => {
        const pager = store.proxy.reader.jsonData.pager;

        if (!pager) {
            return;
        }

        info.setText(GIS.i18n.page + ' ' + pager.page + ' / ' + pager.pageCount);

        prevButton.enable();
        nextButton.enable();

        if (pager.page === 1) {
            prevButton.disable();
        }

        if (pager.page === pager.pageCount) {
            nextButton.disable();
        }
    });

    // Objects
    const NameWindow = function(id) {
        const record = gis.store.maps.getById(id);

        const nameTextfield = Ext.create('Ext.form.field.Text', {
            height: 26,
            width: 371,
            fieldStyle: 'padding-left: 5px; border-radius: 1px; border-color: #bbb; font-size:11px',
            style: 'margin-bottom:0',
            emptyText: GIS.i18n.favorite_name,
            value: id ? record.data.name : '',
            listeners: {
                afterrender() {
                    this.focus();
                }
            }
        });

        const createButton = Ext.create('Ext.button.Button', {
            text: GIS.i18n.create,
            handler() {

                const name = nameTextfield.getValue();
                const map = favoriteWindow.map;
                const basemap = map.basemap;
                const layers = map.overlays;
                // const centerPoint = gis.instance.getCenter();
                const views = [];

                if (!layers.length) {
                    gis.alert(GIS.i18n.please_create_map_first);
                    return;
                }

                if (!name) {
                    gis.alert(GIS.i18n.please_enter_a_name);
                    return;
                }

                layers.forEach(layer => {
                    const view = Ext.clone(layer);

                    // Remove properties used by UI, but not handled by server
                    delete view.id;
                    delete view.data;
                    delete view.isLoading;
                    delete view.visible; // TODO: Should be stored? Is "hidden" used instead?
                    delete view.expanded; // TODO: Should be stored?
                    delete view.valueFilter;  // TODO: Should be stored?
                    delete view.legend;
                    delete view.dataDimensionItems;

                    // TODO temp fix: https://github.com/dhis2/dhis2-gis/issues/108
                    if (view.legendSet && view.method && (view.method === 2 || view.method === 3)) {
                        delete view.legendSet;
                    }

                    // add
                    view.layer = layer.id;
                    view.opacity = layer.layerOpacity;
                    view.hidden = !layer.visible;

                    views.push(view);
                });

                const config = {
                    name: name,
                    // longitude: centerPoint.lng, // TODO
                    // latitude: centerPoint.lat, // TODO
                    // zoom: gis.instance.getZoom(), // TODO
                    // basemap: gis.util.map.getBasemap(),
                    basemap: basemap.visible ? basemap.id : 'none',
                    mapViews: views
                };

                Ext.Ajax.request({
                    url: encodeURI(gis.init.apiPath + 'maps/'),
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    params: JSON.stringify(config),
                    success(r) {
                        const id = r.getAllResponseHeaders().location.split('/').pop();

                        console.log('success', id);

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

        const updateButton = Ext.create('Ext.button.Button', {
            text: GIS.i18n.update,
            handler() {
                const name = nameTextfield.getValue();

                Ext.Ajax.request({
                    url: encodeURI(gis.init.apiPath + 'maps/' + id + '.json?fields=' + gis.conf.url.mapFields.join(',')),
                    success(r) {
                        const map = JSON.parse(r.responseText);

                        map.name = name;

                        Ext.Ajax.request({
                            url: encodeURI(gis.init.apiPath + 'maps/' + id),
                            method: 'PUT',
                            headers: {'Content-Type': 'application/json'},
                            params: JSON.stringify(map),
                            success() {
                                gis.store.maps.loadStore();
                                window.destroy();
                            }
                        });
                    }
                });
            }
        });

        const cancelButton = Ext.create('Ext.button.Button', {
            text: GIS.i18n.cancel,
            handler() {
                window.destroy();
            }
        });

        const window = Ext.create('Ext.window.Window', {
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
                show(w) {
                    // this.setPosition(favoriteWindow.x + 14, favoriteWindow.y + 67);

                    // if (!w.hasDestroyOnBlurHandler) {
                    //     gis.util.gui.window.addDestroyOnBlurHandler(w);
                    // }

                    // gis.viewport.favoriteWindow.destroyOnBlur = true;

                    nameTextfield.focus(false, 500);
                }
            }
        });

        return window;
    };

    const addButton = Ext.create('Ext.button.Button', {
        text: GIS.i18n.add_new,
        width: 67,
        height: 26,
        style: 'border-radius: 1px;',
        menu: {},
        handler() {
            const nameWindow = new NameWindow(null, 'create');
            nameWindow.show();
        }
    });

    const searchTextfield = Ext.create('Ext.form.field.Text', {
        width: windowCmpWidth - addButton.width - 3,
        height: 26,
        fieldStyle: 'padding-right: 0; padding-left: 4px; border-radius: 1px; border-color: #bbb; font-size:11px',
        emptyText: GIS.i18n.search_for_favorites,
        enableKeyEvents: true,
        currentValue: '',
        listeners: {
            keyup: {
                fn() {
                    if (this.getValue() !== this.currentValue) {
                        this.currentValue = this.getValue();

                        const value = this.getValue();
                        const url = value ? encodeURI(gis.init.apiPath + 'maps.json?fields=id,displayName~rename(name),access' + (value ? '&filter=displayName:ilike:' + value : '')) : null;
                        const store = gis.store.maps;

                        store.page = 1;
                        store.loadStore(url);
                    }
                },
                buffer: 100
            }
        }
    });

    const prevButton = Ext.create('Ext.button.Button', {
        text: GIS.i18n.previous,
        handler() {
            const value = searchTextfield.getValue();
            const url = value ? encodeURI(gis.init.apiPath + 'maps.json?fields=id,displayName~rename(name),access' + (value ? '&filter=displayName:ilike:' + value : '')) : null;
            const store = gis.store.maps;

            store.page = store.page <= 1 ? 1 : store.page - 1;
            store.loadStore(url);
        }
    });

    const nextButton = Ext.create('Ext.button.Button', {
        text: GIS.i18n.next,
        handler() {
            const value = searchTextfield.getValue();
            const url = value ? encodeURI(gis.init.apiPath + 'maps.json?fields=id,displayName~rename(name),access' + (value ? '&filter=displayName:ilike:' + value : '')) : null;
            const store = gis.store.maps;

            store.page = store.page + 1;
            store.loadStore(url);
        }
    });

    const info = Ext.create('Ext.form.Label', {
        cls: 'gis-label-info',
        width: 300,
        height: 22
    });

    const grid = Ext.create('Ext.grid.Panel', {
        cls: 'gis-grid',
        scroll: false,
        hideHeaders: true,
        columns: [
            {
                dataIndex: 'name',
                sortable: false,
                width: windowCmpWidth - 88,
                renderer: (value, metaData, record) => {
                    const fn = function() {
                        let element = Ext.get(record.data.id);

                        if (element) {
                            element = element.parent('td');
                            element.addClsOnOver('link');
                            element.load = function() {
                                favoriteWindow.hide();
                                // gis.map = {id: record.data.id};
                                // GIS.core.MapLoader(gis).load();

                                // TODO: Temporary hack to pass map id back to react/redux app
                                favoriteWindow.onFavoriteClick(record.data.id);
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
                        getClass(value, metaData, record) {
                            return 'tooltip-favorite-edit' + (!record.data.access.update ? ' disabled' : '');
                        },
                        handler(grid, rowIndex, colIndex, col, event) {
                            const record = this.up('grid').store.getAt(rowIndex);

                            if (record.data.access.update) {
                                const nameWindow = new NameWindow(record.data.id);
                                nameWindow.show();
                            }
                        }
                    },
                    {
                        iconCls: 'gis-grid-row-icon-overwrite',
                        getClass(value, metaData, record) {
                            return 'tooltip-favorite-overwrite' + (!record.data.access.update ? ' disabled' : '');
                        },
                        handler(grid, rowIndex, colIndex, col, event) {
                            const record = this.up('grid').store.getAt(rowIndex);
                            const name = record.get('name');

                            if (record.data.access.update) {
                                const layers = gis.util.map.getVisibleVectorLayers();

                                const message = GIS.i18n.overwrite_favorite + '\n\n' + record.data.name;

                                if (layers.length) {
                                    if (confirm(message)) {
                                        const centerPoint = gis.instance.getCenter();
                                        const views = [];

                                        layers.forEach(layer => {
                                            const view = Ext.clone(layer.view);

                                            // TODO temp fix: https://github.com/dhis2/dhis2-gis/issues/108
                                            if (view.legendSet && view.method && (view.method === 2 || view.method === 3)) {
                                                delete view.legendSet;
                                            }

                                            // add
                                            view.layer = layer.id;
                                            view.hidden = !gis.instance.hasLayer(layer.instance);
                                            view.opacity = layer.layerOpacity;

                                            // remove
                                            delete view.periodType;
                                            delete view.dataDimensionItems;

                                            views.push(view);
                                        });

                                        const map = {
                                            name: name,
                                            longitude: centerPoint.lng,
                                            latitude: centerPoint.lat,
                                            zoom: gis.instance.getZoom(),
                                            mapViews: views,
                                            basemap: gis.util.map.getBasemap()
                                        };

                                        if (gis.map && gis.map.user) {
                                            map.user = gis.map.user;
                                        }

                                        Ext.Ajax.request({
                                            url: encodeURI(gis.init.apiPath + 'maps/' + record.data.id),
                                            method: 'PUT',
                                            headers: {'Content-Type': 'application/json'},
                                            params: JSON.stringify(map),
                                            success() {
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
                        getClass(value, metaData, record) {
                            return 'tooltip-favorite-sharing' + (!record.data.access.manage ? ' disabled' : '');
                        },
                        handler(grid, rowIndex) {
                            const record = this.up('grid').store.getAt(rowIndex);

                            if (record.data.access.manage) {
                                Ext.Ajax.request({
                                    url: encodeURI(gis.init.apiPath + 'sharing?type=map&id=' + record.data.id),
                                    method: 'GET',
                                    failure(r) {
                                        gis.mask.hide();
                                        gis.alert(r);
                                    },
                                    success(r) {
                                        const sharing = JSON.parse(r.responseText);
                                        const window = GIS.app.SharingWindow(gis, sharing);

                                        window.show();
                                    }
                                });
                            }
                        }
                    },
                    {
                        iconCls: 'gis-grid-row-icon-delete',
                        getClass(value, metaData, record) {
                            return 'tooltip-favorite-delete' + (!record.data.access['delete'] ? ' disabled' : '');
                        },
                        handler(grid, rowIndex, colIndex, col, event) {
                            const record = this.up('grid').store.getAt(rowIndex);

                            if (record.data.access['delete']) {
                                const message = GIS.i18n.delete_favorite + '?\n\n' + record.data.name;

                                if (confirm(message)) {
                                    Ext.Ajax.request({
                                        url: encodeURI(gis.init.apiPath + 'maps/' + record.data.id),
                                        method: 'DELETE',
                                        success() {
                                            gis.store.maps.loadStore();
                                        },
                                        failure(r) {
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
            added() {
                // gis.viewport.mapGrid = this;
            },
            render() {
                // const size = Math.floor((gis.viewport.centerRegion.getHeight() - 155) / gis.conf.layout.grid.row_height);
                const size = Math.floor((window.innerHeight - 150) / gis.conf.layout.grid.row_height);
                this.store.pageSize = size;
                this.store.page = 1;
                this.store.loadStore();

                gis.store.maps.on('load', function() {
                    if (this.isVisible()) {
                        this.fireEvent('afterrender');
                    }
                }, this);
            },
            afterrender() {
                const fn = function() {
                    const editArray = Ext.query('.tooltip-favorite-edit');
                    const overwriteArray = Ext.query('.tooltip-favorite-overwrite');
                    const sharingArray = Ext.query('.tooltip-favorite-sharing');
                    const dashboardArray = Ext.query('.tooltip-favorite-dashboard');
                    const deleteArray = Ext.query('.tooltip-favorite-delete');

                    editArray.forEach(el => Ext.create('Ext.tip.ToolTip', {
                        target: el,
                        html: GIS.i18n.rename,
                        anchor: 'bottom',
                        anchorOffset: -14,
                        showDelay: 500
                    }));

                    overwriteArray.forEach(el => Ext.create('Ext.tip.ToolTip', {
                        target: el,
                        html: GIS.i18n.overwrite,
                        anchor: 'bottom',
                        anchorOffset: -14,
                        showDelay: 500
                    }));


                    sharingArray.forEach(el => Ext.create('Ext.tip.ToolTip', {
                        target: el,
                        html: GIS.i18n.share_with_other_people,
                        anchor: 'bottom',
                        anchorOffset: -14,
                        showDelay: 500
                    }));

                    dashboardArray.forEach(el => Ext.create('Ext.tip.ToolTip', {
                        target: el,
                        html: GIS.i18n.add_to_dashboard,
                        anchor: 'bottom',
                        anchorOffset: -14,
                        showDelay: 500
                    }));

                    deleteArray.forEach(el => Ext.create('Ext.tip.ToolTip', {
                        target: el,
                        html: GIS.i18n.delete,
                        anchor: 'bottom',
                        anchorOffset: -14,
                        showDelay: 500
                    }));
                };

                Ext.defer(fn, 100);
            },
            itemmouseenter(grid, record, item) {
                this.currentItem = Ext.get(item);
                this.currentItem.removeCls('x-grid-row-over');
            },
            select() {
                this.currentItem.removeCls('x-grid-row-selected');
            },
            selectionchange() {
                this.currentItem.removeCls('x-grid-row-focused');
            }
        }
    });

    const favoriteWindow = Ext.create('Ext.window.Window', {
        title: GIS.i18n.manage_favorites + (gis.map ? '<span style="font-weight:normal">&nbsp;|&nbsp;&nbsp;' + gis.map.name + '</span>' : ''),
        iconCls: 'gis-window-title-icon-favorite',
        cls: 'gis-container-default gis-widget-favorite',
        bodyStyle: 'padding:1px',
        resizable: false,
        modal: true,
        width: windowWidth,
        closeAction: 'hide',
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
            show(w) {
                this.setPosition(null, 60);

                if (!w.hasDestroyOnBlurHandler) {
                    gis.util.gui.window.addDestroyOnBlurHandler(w);
                }

                searchTextfield.focus(false, 500);
            },
            close(win) {
                win.onClose(); // Temporary hack
            }
        }
    });

    return favoriteWindow;
};