GIS.app.ContextMenu = function(gis, layer, feature) {
    var isRelocate = !!GIS.app ? !!gis.init.user.isAdmin : false,
        showRelocate,
        stopRelocate,
        onRelocate,
        showInfo,
        drill,
        selectHandlers,
        isPoint = feature.geometry.type === 'Point',
        att = feature.properties,
        mapContainer = gis.instance.getContainer();

    // Relocate
    showRelocate = function() {
        if (gis.relocate.window) {
            gis.relocate.window.destroy();
        }

        gis.relocate.window = Ext.create('Ext.window.Window', {
            title: 'Relocate facility',
            layout: 'fit',
            iconCls: 'gis-window-title-icon-relocate',
            cls: 'gis-container-default',
            setMinWidth: function(minWidth) {
                this.setWidth(this.getWidth() < minWidth ? minWidth : this.getWidth());
            },
            items: {
                html: att.name,
                cls: 'gis-container-inner'
            },
            bbar: [
                '->',
                {
                    xtype: 'button',
                    hideLabel: true,
                    text: GIS.i18n.cancel,
                    handler: function() {
                        gis.relocate.window.destroy();
                        stopRelocate();
                    }
                }
            ],
            listeners: {
                close: stopRelocate
            }
        });

        gis.relocate.window.show();
        gis.relocate.window.setMinWidth(220);

        gis.util.gui.window.setPositionTopRight(gis.relocate.window);

        gis.instance.on('click', onRelocate);

        mapContainer.style.cursor = 'crosshair';
    };

    stopRelocate = function () {
        mapContainer.style.cursor = 'auto';
        mapContainer.style.cursor = '-webkit-grab';
        mapContainer.style.cursor = '-moz-grab';

        gis.relocate.active = false;

        gis.instance.off('click', onRelocate);
    };

    onRelocate = function (evt) {
        var id = feature.id,
            latlng = evt.latlng,
            coordinates = '[' + latlng.lng + ',' + latlng.lat + ']';

        Ext.Ajax.request({
            url: gis.init.contextPath + '/api/organisationUnits/' + id + '.json?links=false',
            success: function(r) {
                var orgUnit = Ext.decode(r.responseText);

                orgUnit.coordinates = coordinates;

                console.log(orgUnit);

                Ext.Ajax.request({
                    url: gis.init.contextPath + '/api/metaData?preheatCache=false',
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    params: Ext.encode({organisationUnits: [orgUnit]}),
                    success: function(r) {

                        //gis.olmap.relocate.active = false;
                        //gis.olmap.relocate.window.destroy();
                        //gis.olmap.relocate.feature.move({x: parseFloat(e.clientX - center.x), y: parseFloat(e.clientY - 28)});
                        //gis.olmap.getViewport().style.cursor = 'auto';

                        //console.log(gis.olmap.relocate.feature.attributes.name + ' relocated to ' + coordinates);
                    }
                });

           }
        });

    };

    // Menu
    var menuItems = [];

    if (layer.id !== 'facility') {
        menuItems.push(Ext.create('Ext.menu.Item', {
            text: 'Float up',
            iconCls: 'gis-menu-item-icon-float',
            cls: 'gis-plugin',
            disabled: !att.hasCoordinatesUp,
            handler: function() {
                //drill(att.grandParentId, att.grandParentParentGraph, parseInt(att.level) - 1);
            }
        }));

        menuItems.push(Ext.create('Ext.menu.Item', {
            text: 'Drill down',
            iconCls: 'gis-menu-item-icon-drill',
            cls: 'gis-menu-item-first gis-plugin',
            disabled: !att.hasCoordinatesDown,
            handler: function() {
                //drill(att.id, att.parentGraph, parseInt(att.level) + 1);
            }
        }));
    }

    if (isRelocate && isPoint) {

        if (layer.id !== 'facility') {
            menuItems.push({
                xtype: 'menuseparator'
            });
        }

        menuItems.push( Ext.create('Ext.menu.Item', {
            text: GIS.i18n.relocate,
            iconCls: 'gis-menu-item-icon-relocate',
            disabled: !gis.init.user.isAdmin,
            handler: function(item) {
                gis.relocate.active = true;
                gis.relocate.feature = feature;
                showRelocate();
            }
        }));

        menuItems.push( Ext.create('Ext.menu.Item', {
            text: 'Swap lon/lat',
            iconCls: 'gis-menu-item-icon-relocate',
            disabled: !gis.init.user.isAdmin,
            handler: function(item) {
                var id = feature.properties.id,
                    coords = feature.geometry,
                    geo = feature.geometry;
                    //geo = Ext.clone(feature.geometry).transform('EPSG:900913', 'EPSG:4326');

                //console.log(feature.properties, geo.coordinates);


                /*
                if (Ext.isNumber(geo.x) && Ext.isNumber(geo.y) && gis.init.user.isAdmin) {
                    Ext.Ajax.request({
                        url: gis.init.contextPath + '/api/organisationUnits/' + id + '.json?links=false',
                        success: function(r) {
                            var orgUnit = Ext.decode(r.responseText);

                            orgUnit.coordinates = '[' + geo.y.toFixed(5) + ',' + geo.x.toFixed(5) + ']';

                            Ext.Ajax.request({
                                url: gis.init.contextPath + '/api/metaData?preheatCache=false',
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                params: Ext.encode({organisationUnits: [orgUnit]}),
                                success: function(r) {
                                    var x = feature.geometry.x,
                                        y = feature.geometry.y;

                                    delete feature.geometry.bounds;
                                    feature.geometry.x = y;
                                    feature.geometry.y = x;

                                    layer.redraw();

                                    console.log(feature.attributes.name + ' relocated to ' + orgUnit.coordinates);
                                }
                            });
                        }
                    });
                }
                */
            }
        }));

        menuItems.push( Ext.create('Ext.menu.Item', {
            text: GIS.i18n.show_information_sheet,
            iconCls: 'gis-menu-item-icon-information',
            handler: function(item) {
                //showInfo();
            }
        }));
    }

    if (menuItems.length) {
        menuItems[menuItems.length - 1].addCls('gis-menu-item-last');
    }

    return new Ext.menu.Menu({
        baseCls: 'gis-plugin gis-popupmenu',
        shadow: false,
        showSeparator: false,
        defaults: {
            bodyStyle: 'padding-right:6px'
        },
        items: menuItems
    });

};