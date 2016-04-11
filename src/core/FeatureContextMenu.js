import isArray from 'd2-utilizr/lib/isArray';
import isNumeric from 'd2-utilizr/lib/isNumeric';
import isString from 'd2-utilizr/lib/isString';

export default function FeatureContextMenu(gis, layer, instance) {
    var feature = instance.feature,
        isRelocate = !!GIS.app ? !!gis.init.user.isAdmin : false,
        infrastructuralPeriod,
        showRelocate,
        stopRelocate,
        onRelocate,
        showInfo,
        drill,
        isPoint = feature.geometry.type === 'Point',
        att = feature.properties,
        mapContainer = gis.instance.getContainer();

    // Relocate
    showRelocate = function() {
        if (gis.relocate.window) {
            gis.relocate.window.destroy();
        }

        gis.relocate.window = Ext.create('Ext.window.Window', {
            title: GIS.i18n.relocate_facility,
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

    stopRelocate = function () {
        gis.relocate.window.destroy();
        gis.relocate.active = false;

        mapContainer.style.cursor = 'auto';
        mapContainer.style.cursor = '-webkit-grab';
        mapContainer.style.cursor = '-moz-grab';

        gis.instance.off('click', onRelocate);
    };

    onRelocate = function (evt) {
        var id = feature.id,
            latlng = evt.latlng,
            coordinates = '[' + latlng.lng.toFixed(6) + ',' + latlng.lat.toFixed(6) + ']';

        Ext.Ajax.request({
            url: encodeURI(gis.init.contextPath + '/api/organisationUnits/' + id + '.json?links=false'),
            success: function(r) {
                var orgUnit = JSON.parse(r.responseText);

                orgUnit.coordinates = coordinates;

                Ext.Ajax.request({
                    url: encodeURI(gis.init.contextPath + '/api/metaData?preheatCache=false'),
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    params: JSON.stringify({organisationUnits: [orgUnit]}),
                    success: function(r) {
                        instance.setLatLng(latlng);
                        stopRelocate();
                        console.log(gis.relocate.feature.properties.name + ' relocated to ' + coordinates);
                    }
                });
            }
        });

    };

    // Infrastructural data
    showInfo = function() {
        Ext.Ajax.request({
            url: encodeURI(gis.init.contextPath + '/api/organisationUnits/' + att.id + '.json?fields=id,' + gis.init.namePropertyUrl + ',code,address,email,phoneNumber,coordinates,parent[id,' + gis.init.namePropertyUrl + '],organisationUnitGroups[id,' + gis.init.namePropertyUrl + ']'),
            success: function(r) {
                var ou = JSON.parse(r.responseText);

                if (layer.infrastructuralWindow) {
                    layer.infrastructuralWindow.destroy();
                }

                layer.infrastructuralWindow = Ext.create('Ext.window.Window', {
                    title: GIS.i18n.information,
                    layout: 'column',
                    iconCls: 'gis-window-title-icon-information',
                    cls: 'gis-container-default',
                    //width: 550,
                    height: 400, //todo
                    period: null,
                    items: [
                        {
                            cls: 'gis-container-inner',
                            width: 180,
                            bodyStyle: 'padding-right:4px',
                            items: function() {
                                var a = [];

                                if (att.name) {
                                    a.push({html: GIS.i18n.name, cls: 'gis-panel-html-title'}, {html: att.name, cls: 'gis-panel-html'}, {cls: 'gis-panel-html-separator'});
                                }

                                if (ou.parent) {
                                    a.push({html: GIS.i18n.parent_unit, cls: 'gis-panel-html-title'}, {html: ou.parent.name, cls: 'gis-panel-html'}, {cls: 'gis-panel-html-separator'});
                                }

                                if (ou.code) {
                                    a.push({html: GIS.i18n.code, cls: 'gis-panel-html-title'}, {html: ou.code, cls: 'gis-panel-html'}, {cls: 'gis-panel-html-separator'});
                                }

                                if (ou.address) {
                                    a.push({html: GIS.i18n.address, cls: 'gis-panel-html-title'}, {html: ou.address, cls: 'gis-panel-html'}, {cls: 'gis-panel-html-separator'});
                                }

                                if (ou.email) {
                                    a.push({html: GIS.i18n.email, cls: 'gis-panel-html-title'}, {html: ou.email, cls: 'gis-panel-html'}, {cls: 'gis-panel-html-separator'});
                                }

                                if (ou.phoneNumber) {
                                    a.push({html: GIS.i18n.phone_number, cls: 'gis-panel-html-title'}, {html: ou.phoneNumber, cls: 'gis-panel-html'}, {cls: 'gis-panel-html-separator'});
                                }

                                if (isString(ou.coordinates)) {
                                    var co = ou.coordinates.replace("[","").replace("]","").replace(",",", ");
                                    a.push({html: GIS.i18n.coordinates, cls: 'gis-panel-html-title'}, {html: co, cls: 'gis-panel-html'}, {cls: 'gis-panel-html-separator'});
                                }

                                if (isArray(ou.organisationUnitGroups) && ou.organisationUnitGroups.length) {
                                    var html = '';

                                    for (var i = 0; i < ou.organisationUnitGroups.length; i++) {
                                        html += ou.organisationUnitGroups[i].name;
                                        html += i < ou.organisationUnitGroups.length - 1 ? '<br/>' : '';
                                    }

                                    a.push({html: GIS.i18n.groups, cls: 'gis-panel-html-title'}, {html: html, cls: 'gis-panel-html'}, {cls: 'gis-panel-html-separator'});
                                }

                                return a;
                            }()
                        },
                        {
                            xtype: 'form',
                            cls: 'gis-container-inner gis-form-widget',
                            //width: 360,
                            bodyStyle: 'padding-left:4px',
                            items: [
                                {
                                    html: GIS.i18n.infrastructural_data,
                                    cls: 'gis-panel-html-title'
                                },
                                {
                                    cls: 'gis-panel-html-separator'
                                },
                                {
                                    xtype: 'combo',
                                    fieldLabel: GIS.i18n.period,
                                    editable: false,
                                    valueField: 'id',
                                    displayField: 'name',
                                    emptyText: 'Select period',
                                    forceSelection: true,
                                    width: 350, //todo
                                    labelWidth: 70,
                                    store: {
                                        fields: ['id', 'name'],
                                        data: function() {
                                            var periodType = gis.init.systemSettings.infrastructuralPeriodType.id,
                                                generator = gis.init.periodGenerator,
                                                //periods = generator.filterFuturePeriodsExceptCurrent(generator.generateReversedPeriods(periodType, this.periodOffset)) || [];
                                                periods = generator.filterFuturePeriodsExceptCurrent(generator.generateReversedPeriods(periodType, undefined)) || [];

                                            if (isArray(periods) && periods.length) {
                                                for (var i = 0; i < periods.length; i++) {
                                                    periods[i].id = periods[i].iso;
                                                }

                                                periods = periods.slice(0,5);
                                            }

                                            return periods;
                                        }()
                                    },
                                    lockPosition: false,
                                    listeners: {
                                        select: function(cmp) {
                                            var period = cmp.getValue(),
                                                url = gis.init.contextPath + '/api/analytics.json?',
                                                iig = gis.init.systemSettings.infrastructuralIndicatorGroup || {},
                                                ideg = gis.init.systemSettings.infrastructuralDataElementGroup || {},

                                                indicators = iig.indicators || [],
                                                dataElements = ideg.dataElements || [],
                                                data = [].concat(indicators, dataElements),
                                                paramString = '';

                                            // data
                                            paramString += 'dimension=dx:';

                                            for (var i = 0; i < data.length; i++) {
                                                paramString += data[i].id + (i < data.length - 1 ? ';' : '');
                                            }

                                            // period
                                            paramString += '&filter=pe:' + period;

                                            // orgunit
                                            paramString += '&dimension=ou:' + att.id;

                                            Ext.Ajax.request({
                                                url: encodeURI(url + paramString),
                                                success: function(r) {
                                                    var records = [],
                                                        dxIndex,
                                                        valueIndex;

                                                    r = JSON.parse(r.responseText);

                                                    if (!r.rows && r.rows.length) {
                                                        return;
                                                    }
                                                    else {
                                                        // index
                                                        for (var i = 0; i < r.headers.length; i++) {
                                                            if (r.headers[i].name === 'dx') {
                                                                dxIndex = i;
                                                            }

                                                            if (r.headers[i].name === 'value') {
                                                                valueIndex = i;
                                                            }
                                                        }

                                                        // records
                                                        for (var i = 0, value; i < r.rows.length; i++) {
                                                            value = r.rows[i][valueIndex];

                                                            records.push({
                                                                name: r.metaData.names[r.rows[i][dxIndex]],
                                                                value: isNumeric(value) ? parseFloat(value) : value
                                                            });
                                                        }

                                                        layer.widget.infrastructuralDataElementValuesStore.loadData(records);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                },
                                {
                                    xtype: 'grid',
                                    cls: 'gis-grid plain',
                                    height: 313, //todo
                                    width: 350,
                                    scroll: 'vertical',
                                    columns: [
                                        {
                                            id: 'name',
                                            text: GIS.i18n.dataelement,
                                            dataIndex: 'name',
                                            sortable: true,
                                            width: 200
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
                                }
                            ]
                        }
                    ],
                    listeners: {
                        show: function() {
                            if (infrastructuralPeriod) {
                                this.down('combo').setValue(infrastructuralPeriod);
                                infrastructuralDataElementValuesStore.load({
                                    params: {
                                        periodId: infrastructuralPeriod,
                                        organisationUnitId: att.internalId
                                    }
                                });
                            }
                        }
                    }
                });

                layer.infrastructuralWindow.show();
                gis.util.gui.window.setPositionTopRight(layer.infrastructuralWindow);
            }
        });
    };

    // Drill or float
    drill = function(parentId, parentGraph, level) {
        var dimConf = gis.conf.finals.dimension,
            view = Ext.clone(layer.view),
            handler;

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
            handler = layer.handler(gis, layer);
            handler.updateGui = true;
            handler.zoomToVisibleExtent = true;
            handler.hideMask = true;
            handler.load(view);
        }
    };

    // Menu
    var menuItems = [];

    if (layer.id !== 'facility') {
        menuItems.push(Ext.create('Ext.menu.Item', {
            text: GIS.i18n.float_up,
            iconCls: 'gis-menu-item-icon-float',
            cls: 'gis-plugin',
            disabled: !att.hasCoordinatesUp,
            handler: function() {
                drill(att.grandParentId, att.grandParentParentGraph, parseInt(att.level) - 1);
            }
        }));

        menuItems.push(Ext.create('Ext.menu.Item', {
            text: GIS.i18n.drill_down,
            iconCls: 'gis-menu-item-icon-drill',
            cls: 'gis-menu-item-first gis-plugin',
            disabled: !att.hasCoordinatesDown,
            handler: function() {
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
            handler: function(item) {
                gis.relocate.active = true;
                gis.relocate.feature = feature;
                showRelocate();
            }
        }));

        menuItems.push( Ext.create('Ext.menu.Item', {
            text: GIS.i18n.swap_lon_lat,
            iconCls: 'gis-menu-item-icon-relocate',
            disabled: !gis.init.user.isAdmin,
            handler: function(item) {
                var id = feature.properties.id,
                    coords = feature.geometry.coordinates;

                if (gis.init.user.isAdmin) {
                    Ext.Ajax.request({
                        url: encodeURI(gis.init.contextPath + '/api/organisationUnits/' + id + '.json?links=false'),
                        success: function(r) {
                            var orgUnit = JSON.parse(r.responseText);

                            orgUnit.coordinates = '[' + coords[1].toFixed(6) + ',' + coords[0].toFixed(6) + ']';

                            Ext.Ajax.request({
                                url: encodeURI(gis.init.contextPath + '/api/metaData?preheatCache=false'),
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                params: JSON.stringify({organisationUnits: [orgUnit]}),
                                success: function(r) {
                                    instance.setLatLng(coords);
                                    feature.geometry.coordinates = coords.reverse();
                                    // console.log(feature.properties.name + ' relocated to ' + orgUnit.coordinates);
                                }
                            });
                        }
                    });
                }
            }
        }));

        menuItems.push( Ext.create('Ext.menu.Item', {
            text: GIS.i18n.show_information_sheet,
            iconCls: 'gis-menu-item-icon-information',
            handler: function(item) {
                showInfo();
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