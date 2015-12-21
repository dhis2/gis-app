	GIS.core.createSelectHandlers = function(gis, layer) {
		var isRelocate = !!GIS.app ? !!gis.init.user.isAdmin : false,
			infrastructuralPeriod,
            destroyDataPopups,
			defaultHoverSelect,
			defaultHoverUnselect,
            defaultLeftClickSelect,
			defaultRightClickSelect,
            selectHandlers,
			dimConf = gis.conf.finals.dimension,
            defaultHoverWindow,
            eventWindow,
            isBoundary = layer.id === 'boundary',
            isEvent = layer.id === 'event';

        layer.dataPopups = [];

        destroyDataPopups = function() {
            if (layer.dataPopups) {
                for (var i = 0, popup; i < layer.dataPopups.length; i++) {
                    popup = layer.dataPopups[i];

                    if (popup && popup.destroy) {
                        popup.destroy();
                        popup = null;
                        layer.dataPopups[i] = null;
                    }
                }

                layer.dataPopups = Ext.clean(layer.dataPopups);
            }
        };

        layer.onMouseDown = function(e) {
            if (OpenLayers.Event.isRightClick(e)) {
                defaultRightClickSelect(layer.getFeatureFromEvent(e), e);
            }
            else {
                defaultLeftClickSelect(layer.getFeatureFromEvent(e), e);
            }
        };

        layer.registerMouseDownEvent = function() {

            // clear mousedown listeners
            //if (layer.events && layer.events.listeners && Ext.isArray(layer.events.listeners.mousedown)) {
                //layer.events.listeners.mousedown = [];
            //}

            layer.events.register('mousedown', null, layer.onMouseDown);
        };

        layer.unregisterMouseDownEvent = function() {
            layer.events.unregister('mousedown', null, layer.onMouseDown);
        };

		defaultHoverSelect = function fn(feature) {
            if (isBoundary) {
                var style = layer.core.getDefaultFeatureStyle();

                style.fillOpacity = 0.15;
                style.strokeColor = feature.style.strokeColor;
                style.strokeWidth = feature.style.strokeWidth;
                style.label = feature.style.label;
                style.fontFamily = feature.style.fontFamily;
                style.fontWeight = feature.style.strokeWidth > 1 ? 'bold' : 'normal';
                style.labelAlign = feature.style.labelAlign;
                style.labelYOffset = feature.style.labelYOffset;

                layer.drawFeature(feature, style);
            }

			if (defaultHoverWindow) {
				defaultHoverWindow.destroy();
			}
			defaultHoverWindow = Ext.create('Ext.window.Window', {
				cls: 'gis-window-widget-feature gis-plugin',
				preventHeader: true,
				shadow: false,
				resizable: false,
				items: {
					html: feature.attributes.popupText
				}
			});

			defaultHoverWindow.show();
                
            var cr = gis.viewport.centerRegion,
                crp = cr.getPosition(),
                x = crp[0] + (cr.getWidth() / 2) - (defaultHoverWindow.getWidth() / 2),
                y = crp[1] + (GIS.app ? 36 : 0);

			defaultHoverWindow.setPosition(x, y);

            layer.registerMouseDownEvent();
		};

		defaultHoverUnselect = function fn(feature) {
			defaultHoverWindow.destroy();

            // remove mouse click event
            if (layer.events && layer.events.listeners && Ext.isArray(layer.events.listeners.mousedown)) {
                layer.events.listeners.mousedown = [];
            }
            //layer.unregisterMouseDownEvent();
		};

        defaultLeftClickSelect = function fn(feature, e) {
            if (!feature) {
                return;
            }

            var generator = gis.init.periodGenerator,
                periodType = gis.init.systemSettings.infrastructuralPeriodType.name,
                attr = feature.attributes,
                iig = gis.init.systemSettings.infrastructuralIndicatorGroup || gis.init.systemSettings.indicatorGroups[0] || {},
                ideg = gis.init.systemSettings.infrastructuralDataElementGroup || {},

                indicators = iig.indicators || [],
                dataElements = ideg.dataElements || [],
                data = [].concat(indicators, dataElements),
                period = generator.filterFuturePeriodsExceptCurrent(generator.generateReversedPeriods(periodType))[0],
                paramString = '?',
                showWindow,
                success,
                failure,
                getData,
                getParamString;

            showWindow = function(html) {
                destroyDataPopups();

                win = Ext.create('Ext.window.Window', {
                    bodyStyle: 'background-color: #fff; padding: 5px; line-height: 13px',
                    autoScroll: true,
                    closeAction: 'destroy',
                    title: 'Infrastructural data',
                    resizable: false,
                    html: html,
                    listeners: {
                        show: function() {
                            var winHeight = this.getHeight(),
                                viewportHeight = gis.viewport.getHeight(),
                                diff = (winHeight + e.y) - viewportHeight;

                            if (diff > 0) {
                                this.setHeight(winHeight - diff - 5);
                                this.setWidth(this.getWidth() + 18);
                            }
                        }
                    }
                });

                win.showAt(e.x + 20, e.y);

                layer.dataPopups.push(win);

                gis.olmap.mask.hide();
            };

            success = function(r) {
                var html = '',
                    records = [],
                    dxIndex,
                    valueIndex,
                    win;

                if (r.rows && r.rows.length) {

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
                    for (var i = 0; i < r.rows.length; i++) {
                        records.push({
                            name: r.metaData.names[r.rows[i][dxIndex]],
                            value: r.rows[i][valueIndex]
                        });
                    }

                    gis.util.array.sort(records);

                    // html
                    html += '<div style="font-weight: bold; color: #333">' + attr.name + '</div>';
                    html += '<div style="font-weight: bold; color: #333; padding-bottom: 5px">' + r.metaData.names[period.iso] + '</div>';

                    for (var i = 0; i < records.length; i++) {
                        html += records[i].name + ': ' + '<span style="color: #005aa5">' + records[i].value + '</span>' + (i < records.length - 1 ? '<br/>' : '');
                    }
                }
                else {
                    html = 'No data found for<br/><br/>Indicators in group: <span style="color:#005aa5">' + iig.name + '</span>' +
                           '<br/>Data elements in group: <span style="color:#005aa5">' + ideg.name + '</span>' +
                           '<br/>Period: <span style="color:#005aa5">' + period.name + '</span>' +
                           '<br/><br/>To change groups, please go to general settings.';
                }

                showWindow(html);
            };

            failure = function(r) {
                console.log(r);
                gis.olmap.mask.hide();
            };

            getData = function(paramString) {
                gis.olmap.mask.show();

                if (GIS.plugin && !GIS.app) {
                    Ext.data.JsonP.request({
                        url: gis.init.contextPath + '/api/analytics.jsonp' + paramString,
                        success: success,
                        failure: failure
                    });
                }
                else {
                    Ext.Ajax.request({
                        url: gis.init.contextPath + '/api/analytics.json' + paramString,
                        disableCaching: false,
                        success: function(r) {
                            success(Ext.decode(r.responseText));
                        },
                        failure: failure
                    });
                }
            };

            getParamString = function(data) {

                // data
                paramString += 'dimension=dx:';

                for (var i = 0; i < data.length; i++) {
                    paramString += data[i].id + (i < data.length - 1 ? ';' : '');
                }

                // period
                paramString += '&filter=pe:' + period.iso;

                // orgunit
                paramString += '&dimension=ou:' + attr.id;

                getData(paramString);
            };

            // init
            if (!data.length) {
                showWindow('No indicator or data element groups found.');
                return;
            }

            getParamString(data);

        };

		defaultRightClickSelect = function fn(feature) {
			var showInfo,
				showRelocate,
				drill,
				menu,
				selectHandlers,
				isPoint = feature.geometry.CLASS_NAME === gis.conf.finals.openLayers.point_classname,
				att = feature.attributes;

			// Relocate
			showRelocate = function() {
				if (gis.olmap.relocate.window) {
					gis.olmap.relocate.window.destroy();
				}

				gis.olmap.relocate.window = Ext.create('Ext.window.Window', {
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
								gis.olmap.relocate.active = false;
								gis.olmap.relocate.window.destroy();
								gis.olmap.getViewport().style.cursor = 'auto';
							}
						}
					],
					listeners: {
						close: function() {
							gis.olmap.relocate.active = false;
							gis.olmap.getViewport().style.cursor = 'auto';
						}
					}
				});

				gis.olmap.relocate.window.show();
				gis.olmap.relocate.window.setMinWidth(220);

				gis.util.gui.window.setPositionTopRight(gis.olmap.relocate.window);
			};

			// Infrastructural data
			showInfo = function() {
				Ext.Ajax.request({
					url: gis.init.contextPath + '/api/organisationUnits/' + att.id + '.json?fields=id,' + gis.init.namePropertyUrl + ',code,address,email,phoneNumber,coordinates,parent[id,' + gis.init.namePropertyUrl + '],organisationUnitGroups[id,' + gis.init.namePropertyUrl + ']',
					success: function(r) {
						var ou = Ext.decode(r.responseText);

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

                                        if (Ext.isString(ou.coordinates)) {
                                            var co = ou.coordinates.replace("[","").replace("]","").replace(",",", ");
											a.push({html: GIS.i18n.coordinates, cls: 'gis-panel-html-title'}, {html: co, cls: 'gis-panel-html'}, {cls: 'gis-panel-html-separator'});
                                        }

                                        if (Ext.isArray(ou.organisationUnitGroups) && ou.organisationUnitGroups.length) {
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
														periods = generator.filterFuturePeriodsExceptCurrent(generator.generateReversedPeriods(periodType, this.periodOffset)) || [];

													if (Ext.isArray(periods) && periods.length) {
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
														url: url + paramString,
														success: function(r) {
                                                            var records = [];

                                                            r = Ext.decode(r.responseText);

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
                                                                        value: Ext.isNumeric(value) ? parseFloat(value) : value
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
													text: 'Data element',
													dataIndex: 'name',
													sortable: true,
													width: 200
												},
												{
													id: 'value',
													header: 'Value',
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
				var view = Ext.clone(layer.core.view),
					loader;

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
					loader = layer.core.getLoader();
					loader.updateGui = true;
					loader.zoomToVisibleExtent = true;
					loader.hideMask = true;
					loader.load(view);
				}
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
						drill(att.grandParentId, att.grandParentParentGraph, parseInt(att.level) - 1);
					}
				}));

                menuItems.push(Ext.create('Ext.menu.Item', {
					text: 'Drill down',
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
						gis.olmap.relocate.active = true;
						gis.olmap.relocate.feature = feature;
						gis.olmap.getViewport().style.cursor = 'crosshair';
						showRelocate();
					}
				}));

				menuItems.push( Ext.create('Ext.menu.Item', {
                    text: 'Swap lon/lat',
					iconCls: 'gis-menu-item-icon-relocate',
					disabled: !gis.init.user.isAdmin,
					handler: function(item) {
                        var id = feature.attributes.id,
                            geo = Ext.clone(feature.geometry).transform('EPSG:900913', 'EPSG:4326');

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

			menu = new Ext.menu.Menu({
				baseCls: 'gis-plugin gis-popupmenu',
				shadow: false,
				showSeparator: false,
				defaults: {
					bodyStyle: 'padding-right:6px'
				},
				items: menuItems
			});

			menu.showAt([gis.olmap.mouseMove.x, gis.olmap.mouseMove.y]);
		};

		if (isEvent) {
			defaultLeftClickSelect = function fn(feature) {
                var ignoreKeys = ['label', 'value', 'nameColumnMap', 'psi', 'ps', 'longitude', 'latitude', 'eventdate', 'ou', 'oucode', 'ouname', 'popupText'],
                    attributes = feature.attributes,
                    map = attributes.nameColumnMap,
                    html = '<table class="padding1">',
                    titleStyle = ' style="font-weight:bold; padding-right:10px; vertical-align:top"',
                    valueStyle = ' style="max-width:170px"',
                    windowPosition;

                // default properties
                html += '<tr><td' + titleStyle + '>' + map['ou'] + '</td><td' + valueStyle + '>' + attributes['ouname'] + '</td></tr>';
                html += '<tr><td' + titleStyle + '>' + map['eventdate'] + '</td><td' + valueStyle + '>' + attributes['eventdate'] + '</td></tr>';
                html += '<tr><td' + titleStyle + '>' + map['longitude'] + '</td><td' + valueStyle + '>' + attributes['longitude'] + '</td></tr>';
                html += '<tr><td' + titleStyle + '>' + map['latitude'] + '</td><td' + valueStyle + '>' + attributes['latitude'] + '</td></tr>';

                for (var key in attributes) {
                    if (attributes.hasOwnProperty(key) && !Ext.Array.contains(ignoreKeys, key)) {
                        html += '<tr><td' + titleStyle + '>' + map[key] + '</td><td>' + attributes[key] + '</td></tr>';
                    }
                }

                html += '</table>';

                if (Ext.isObject(eventWindow) && eventWindow.destroy) {
                    windowPosition = eventWindow.getPosition();
                    eventWindow.destroy();
                    eventWindow = null;
                }

                eventWindow = Ext.create('Ext.window.Window', {
                    title: 'Event',
                    title: 'Event',
                    layout: 'fit',
                    resizable: false,
                    bodyStyle: 'background-color:#fff; padding:5px',
                    html: html,
                    autoShow: true,
                    listeners: {
                        show: function(w) {
                            if (windowPosition) {
                                w.setPosition(windowPosition);
                            }
                            else {
                                gis.util.gui.window.setPositionTopRight(w);
                            }
                        },
                        destroy: function() {
                            eventWindow = null;
                        }
                    }
                });
            };
		}

		selectHandlers = new OpenLayers.Control.newSelectFeature(layer, {
            onHoverSelect: defaultHoverSelect,
            onHoverUnselect: defaultHoverUnselect
        });

		gis.olmap.addControl(selectHandlers);
		selectHandlers.activate();
	};
