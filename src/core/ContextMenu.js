import isArray from 'd2-utilizr/lib/isArray';
import isNumeric from 'd2-utilizr/lib/isNumeric';
import isString from 'd2-utilizr/lib/isString';

// Right-click context menu for map and features
export default function ContextMenu(gis, layer, instance, latlng) {
    const mapContainer = gis.instance.getContainer();
    const isRelocate = !!GIS.app ? !!gis.init.user.isAdmin : false;
    const menuItems = [];

    if (instance) { // layer and instance don't exist when basemap is clicked
        const feature = instance.feature;
        const isPoint = feature.geometry.type === 'Point';
        const att = feature.properties;

        let infrastructuralPeriod; // TODO: in use?

        // Relocate
        const showRelocate = function() {
            if (gis.relocate.window) {
                gis.relocate.window.destroy();
            }

            gis.relocate.window = Ext.create('Ext.window.Window', {
                title: GIS.i18n.relocate_facility,
                layout: 'fit',
                iconCls: 'gis-window-title-icon-relocate',
                cls: 'gis-container-default',
                setMinWidth(minWidth) {
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
                        handler: stopRelocate
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

        const stopRelocate = function () {
            gis.relocate.window.destroy();
            gis.relocate.active = false;

            mapContainer.style.cursor = 'auto';
            mapContainer.style.cursor = '-webkit-grab';
            mapContainer.style.cursor = '-moz-grab';

            gis.instance.off('click', onRelocate);
        };

        const onRelocate = function (evt) {
            const id = feature.id;
            const latlng = evt.latlng;
            const coordinates = '[' + latlng.lng.toFixed(6) + ',' + latlng.lat.toFixed(6) + ']';

            Ext.Ajax.request({
                url: encodeURI(gis.init.apiPath + 'organisationUnits/' + id),
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                params: JSON.stringify({coordinates: coordinates}),
                success(r) {
                    instance.setLatLng(latlng);
                    stopRelocate();
                    console.log(gis.relocate.feature.properties.name + ' relocated to ' + coordinates);
                }
            });
        };

        // Infrastructural data
        const showInfo = function() {

            // Destroy window if created previously
            if (layer.infrastructuralWindow) {
                layer.infrastructuralWindow.destroy();
                layer.widget.infrastructuralDataElementValuesStore.removeAll();
            }

            const orgUnitInfo = Ext.create('Ext.panel.Panel', {
                cls: 'gis-container-inner',
                width: 150,
                bodyStyle: 'padding-right:5px;',
                items: [
                    {
                        html: GIS.i18n.name,
                        cls: 'gis-panel-html-title'
                    },
                    {
                        html: att.name || '',
                        cls: 'gis-panel-html'
                    },
                    {
                        cls: 'gis-panel-html-separator'
                    }
                ]
            });

            const onPeriodChange = function(cmp) {
                const period = cmp.getValue();
                const url = gis.init.apiPath + 'analytics.json?';
                const iig = gis.init.systemSettings.infrastructuralIndicatorGroup || {};
                const ideg = gis.init.systemSettings.infrastructuralDataElementGroup || {};
                const indicators = iig.indicators || [];
                const dataElements = ideg.dataElements || [];
                const data = [].concat(indicators, dataElements);

                // data
                let paramString = 'dimension=dx:';
                data.forEach((d, i) => paramString += d.id + (i < data.length - 1 ? ';' : ''));

                // period
                paramString += '&filter=pe:' + period;

                // orgunit
                paramString += '&dimension=ou:' + att.id;

                Ext.Ajax.request({
                    url: encodeURI(url + paramString),
                    success(r) {
                        const records = [];
                        let dxIndex;
                        let valueIndex;

                        r = JSON.parse(r.responseText);

                        if (!r.rows && r.rows.length) {
                            return;
                        }
                        else {
                            // index
                            r.headers.forEach((header, i) => {
                                if (header.name === 'dx') {
                                    dxIndex = i;
                                }
                                if (header.name === 'value') {
                                    valueIndex = i;
                                }
                            });

                            // records
                            r.rows.forEach(row => {
                                const value = row[valueIndex];
                                records.push({
                                    name: r.metaData.names[row[dxIndex]],
                                    value: isNumeric(value) ? parseFloat(value) : value
                                });

                            });

                            layer.widget.infrastructuralDataElementValuesStore.loadData(records);
                        }
                    }
                });
            };


            const orgUnitDataCombo = Ext.create('Ext.form.field.ComboBox', {
                fieldLabel: GIS.i18n.period,
                editable: false,
                valueField: 'id',
                displayField: 'name',
                emptyText: 'Select period',
                forceSelection: true,
                width: 340,
                labelWidth: 70,
                store: {
                    fields: ['id', 'name'],
                    data: function() {
                        const periodType = gis.init.systemSettings.infrastructuralPeriodType.id;
                        const generator = gis.init.periodGenerator;
                        let periods = generator.filterFuturePeriodsExceptCurrent(generator.generateReversedPeriods(periodType, undefined)) || [];

                        if (isArray(periods) && periods.length) {
                            periods.forEach(period => period.id = period.iso);
                            periods = periods.slice(0,5);
                        }

                        return periods;
                    }()
                },
                lockPosition: false,
                listeners: {
                    change: onPeriodChange,
                    render() {
                        this.select(this.getStore().getAt(0));
                    }
                }
            });

            const orgUnitDataGrid = Ext.create('Ext.grid.Panel',                     {
                xtype: 'grid',
                cls: 'gis-grid plain',
                height: 163,
                width: 340,
                scroll: 'vertical',
                columns: [
                    {
                        id: 'name',
                        text: GIS.i18n.dataelement,
                        dataIndex: 'name',
                        sortable: true,
                        width: 190
                    },
                    {
                        id: 'value',
                        header: GIS.i18n.value,
                        dataIndex: 'value',
                        sortable: true,
                        width: 150
                    }
                ],
                disableSelection: true,
                store: layer.widget.infrastructuralDataElementValuesStore
            });

            // Ext.form.Panel
            const orgUnitForm = Ext.create('Ext.panel.Panel', {
                cls: 'gis-container-inner gis-form-widget',
                bodyStyle: 'padding-left:4px;',
                width: 350,
                items: [
                    {
                        html: GIS.i18n.infrastructural_data,
                        cls: 'gis-panel-html-title'
                    },
                    {
                        cls: 'gis-panel-html-separator'
                    },
                    orgUnitDataCombo,
                    orgUnitDataGrid
                ]
            });

            layer.infrastructuralWindow = Ext.create('Ext.window.Window', {
                title: GIS.i18n.information,
                layout: 'column',
                iconCls: 'gis-window-title-icon-information',
                cls: 'gis-container-default',
                height: 250,
                period: null,
                items: [orgUnitInfo, orgUnitForm]
            });

            layer.infrastructuralWindow.show();
            gis.util.gui.window.setPositionTopRight(layer.infrastructuralWindow);

            // Load info about organisation unit
            Ext.Ajax.request({
                url: encodeURI(gis.init.apiPath + 'organisationUnits/' + att.id + '.json?fields=id,' + gis.init.namePropertyUrl + ',code,address,email,phoneNumber,coordinates,parent[id,' + gis.init.namePropertyUrl + '],organisationUnitGroups[id,' + gis.init.namePropertyUrl + ']'),
                success(r) {
                    const ou = JSON.parse(r.responseText);

                    if (ou.parent) {
                        orgUnitInfo.add(
                            {
                                html: GIS.i18n.parent_unit,
                                cls: 'gis-panel-html-title'
                            },
                            {
                                html: ou.parent.name,
                                cls: 'gis-panel-html'
                            },
                            {
                                cls: 'gis-panel-html-separator'
                            }
                        );
                    }

                    if (ou.code) {
                        orgUnitInfo.add(
                            {
                                html: GIS.i18n.code,
                                cls: 'gis-panel-html-title'
                            },
                            {
                                html: ou.code,
                                cls: 'gis-panel-html'
                            },
                            {
                                cls: 'gis-panel-html-separator'
                            }
                        );
                    }

                    if (ou.address) {
                        orgUnitInfo.add(
                            {
                                html: GIS.i18n.address,
                                cls: 'gis-panel-html-title'
                            },
                            {
                                html: ou.address,
                                cls: 'gis-panel-html'
                            },
                            {
                                cls: 'gis-panel-html-separator'
                            }
                        );
                    }

                    if (ou.email) {
                        orgUnitInfo.add(
                            {
                                html: GIS.i18n.email,
                                cls: 'gis-panel-html-title'
                            },
                            {
                                html: ou.email,
                                cls: 'gis-panel-html'
                            },
                            {
                                cls: 'gis-panel-html-separator'
                            }
                        );
                    }

                    if (ou.phoneNumber) {
                        orgUnitInfo.add(
                            {
                                html: GIS.i18n.phone_number,
                                cls: 'gis-panel-html-title'
                            },
                            {
                                html: ou.phoneNumber,
                                cls: 'gis-panel-html'
                            },
                            {
                                cls: 'gis-panel-html-separator'
                            }
                        );
                    }

                    if (isString(ou.coordinates)) { // TODO: We don't need to download coordinates
                        var co = JSON.parse(ou.coordinates);

                        if (typeof co[0] === 'number') {
                            orgUnitInfo.add(
                                {
                                    html: GIS.i18n.coordinates,
                                    cls: 'gis-panel-html-title'
                                },
                                {
                                    html: co.join(', '),
                                    cls: 'gis-panel-html'
                                },
                                {
                                    cls: 'gis-panel-html-separator'
                                }
                            );
                        }
                    }

                    if (isArray(ou.organisationUnitGroups) && ou.organisationUnitGroups.length) {
                        let html = '';

                        ou.organisationUnitGroups.forEach((group, index) => {
                            html += group.name;
                            html += index < ou.organisationUnitGroups.length - 1 ? '<br/>' : '';
                        });

                        orgUnitInfo.add(
                            {
                                html: GIS.i18n.groups,
                                cls: 'gis-panel-html-title'
                            },
                            {
                                html: html,
                                cls: 'gis-panel-html'
                            },
                            {
                                cls: 'gis-panel-html-separator'
                            }
                        );
                    }
                }
            });
        };

        // Drill or float
        const drill = function(parentId, parentGraph, level) {
            const dimConf = gis.conf.finals.dimension;
            const view = Ext.clone(layer.view);

            // parent graph map
            view.parentGraphMap = {};
            view.parentGraphMap[parentId] = parentGraph;

            // dimension
            view.rows = [{
                dimension: dimConf.organisationUnit.objectName,
                items: [
                    {id: parentId},
                    {id: 'LEVEL-' + level}
                ]
            }];

            if (view) {
                const handler = layer.handler(gis, layer);
                handler.updateGui = true;
                handler.zoomToVisibleExtent = true;
                handler.hideMask = true;
                handler.isDrillDown = true;
                handler.load(view);
            }
        };

        if (layer.id !== 'facility') {
            menuItems.push(Ext.create('Ext.menu.Item', {
                text: GIS.i18n.float_up,
                iconCls: 'gis-menu-item-icon-float',
                cls: 'gis-plugin',
                disabled: !att.hasCoordinatesUp,
                handler() {
                    drill(att.grandParentId, att.grandParentParentGraph, parseInt(att.level) - 1);
                }
            }));

            menuItems.push(Ext.create('Ext.menu.Item', {
                text: GIS.i18n.drill_down,
                iconCls: 'gis-menu-item-icon-drill',
                cls: 'gis-menu-item-first gis-plugin',
                disabled: !att.hasCoordinatesDown,
                handler() {
                    drill(att.id, att.parentGraph, parseInt(att.level) + 1);
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
                handler(item) {
                    gis.relocate.active = true;
                    gis.relocate.feature = feature;
                    showRelocate();
                }
            }));

            menuItems.push( Ext.create('Ext.menu.Item', {
                text: GIS.i18n.swap_lon_lat,
                iconCls: 'gis-menu-item-icon-relocate',
                disabled: !gis.init.user.isAdmin,
                handler(item) {
                    const id = feature.properties.id;
                    const coordinates = feature.geometry.coordinates;
                    const swappedCoordinates = coordinates.slice(0).reverse();

                    if (gis.init.user.isAdmin) {
                        Ext.Ajax.request({
                            url: encodeURI(gis.init.apiPath + 'organisationUnits/' + id),
                            method: 'PATCH',
                            headers: {'Content-Type': 'application/json'},
                            params: '{"coordinates": "' + JSON.stringify(swappedCoordinates) + '"}',
                            success(r) {
                                instance.setLatLng(coordinates);
                                feature.geometry.coordinates = swappedCoordinates;
                            }
                        });
                    }
                }
            }));
        }

        menuItems.push( Ext.create('Ext.menu.Item', {
            text: GIS.i18n.show_information_sheet,
            iconCls: 'gis-menu-item-icon-information',
            handler: showInfo
        }));

    }

    // Earth Engine layer
    if (gis.layer.earthEngine.instance && gis.instance.hasLayer(gis.layer.earthEngine.instance)) {
        const name = gis.layer.earthEngine.instance.options.name.toLowerCase();

        menuItems.push(Ext.create('Ext.menu.Item', {
            text: GIS.i18n.show + ' ' + name,
            iconCls: 'gis-menu-item-icon-earthengine',
            handler(item) {
                gis.layer.earthEngine.instance.showValue(latlng);
            }
        }));
    }

    if (latlng && !(instance && instance.feature.geometry.type === 'Point')) {
        menuItems.push(Ext.create('Ext.menu.Item', {
            text: GIS.i18n.show_lon_lat,
            iconCls: 'gis-menu-item-icon-relocate',
            handler(item) {
                L.popup()
                    .setLatLng(latlng)
                    .setContent('Longitude: ' + latlng.lng.toFixed(6) + '<br />Latitude: ' + latlng.lat.toFixed(6))
                    .openOn(gis.instance);
            }
        }));
    }

    menuItems[menuItems.length - 1].addCls('gis-menu-item-last');

    // Hide context menu on map click
    const onMapClick = function () {
        contextMenu.hide();
    };

    const contextMenu = new Ext.menu.Menu({
        baseCls: 'gis-plugin gis-popupmenu',
        shadow: false,
        showSeparator: false,
        defaults: {
            bodyStyle: 'padding-right:6px'
        },
        items: menuItems,
        listeners: {
            show() {
                gis.instance.on('click', onMapClick);
            },
            hide() {
                gis.instance.off('click', onMapClick);
            }
        }
    });


    return contextMenu;
};
