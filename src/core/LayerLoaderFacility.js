	GIS.core.LayerLoaderFacility = function(gis, layer) {
		var olmap = layer.map,
			compareView,
			loadOrganisationUnits,
			loadData,
			loadLegend,
			addCircles,
			afterLoad,
			loader;

		compareView = function(view, doExecute) {
			var src = layer.core.view,
				viewIds,
				viewDim,
				srcIds,
				srcDim;

			loader.zoomToVisibleExtent = true;

			if (!src) {
				if (doExecute) {
					loadOrganisationUnits(view);
				}
				return gis.conf.finals.widget.loadtype_organisationunit;
			}

			// organisation units
			viewIds = [];
			viewDim = view.rows[0];
			srcIds = [];
			srcDim = src.rows[0];

			if (viewDim.items.length === srcDim.items.length) {
				for (var i = 0; i < viewDim.items.length; i++) {
					viewIds.push(viewDim.items[i].id);
				}

				for (var i = 0; i < srcDim.items.length; i++) {
					srcIds.push(srcDim.items[i].id);
				}

				if (Ext.Array.difference(viewIds, srcIds).length !== 0) {
					if (doExecute) {
						loadOrganisationUnits(view);
					}
					return gis.conf.finals.widget.loadtype_organisationunit;
				}
			}
			else {
				if (doExecute) {
					loadOrganisationUnits(view);
				}
				return gis.conf.finals.widget.loadtype_organisationunit;
			}

			// Group set
			loader.zoomToVisibleExtent = false;

			if (view.organisationUnitGroupSet.id !== src.organisationUnitGroupSet.id) {
				if (doExecute) {
					loadOrganisationUnits(view);
				}
				return gis.conf.finals.widget.loadtype_organisationunit;
			}

			//if (view.areaRadius !== src.areaRadius) {
				//if (doExecute) {
					//loadLegend(view);
				//}
				//return gis.conf.finals.widget.loadtype_legend;
			//}

			// always reload legend
			if (doExecute) {
				loadLegend(view);
				return gis.conf.finals.widget.loadtype_legend;
			}

			//gis.olmap.mask.hide();
		};

		loadOrganisationUnits = function(view) {
            var items = view.rows[0].items,
                isPlugin = GIS.plugin && !GIS.app,
                propertyMap = {
                    'name': 'name',
                    'displayName': 'name',
                    'shortName': 'shortName',
                    'displayShortName': 'shortName'
                },
                keyAnalysisDisplayProperty = gis.init.userAccount.settings.keyAnalysisDisplayProperty,
                displayProperty = propertyMap[keyAnalysisDisplayProperty] || propertyMap[xLayout.displayProperty] || 'name',
                url = function() {
                    var params = '?ou=ou:';

                    for (var i = 0; i < items.length; i++) {
                        params += items[i].id;
                        params += i !== items.length - 1 ? ';' : '';
                    }

                    params += '&displayProperty=' + displayProperty.toUpperCase();

                    if (Ext.isArray(view.userOrgUnit) && view.userOrgUnit.length) {
                        params += '&userOrgUnit=';

                        for (var i = 0; i < view.userOrgUnit.length; i++) {
                            params += view.userOrgUnit[i] + (i < view.userOrgUnit.length - 1 ? ';' : '');
                        }
                    }

                    return gis.init.contextPath + '/api/geoFeatures.' + (isPlugin ? 'jsonp' : 'json') + params + '&includeGroupSets=true';
                }(),
                success,
                failure;

            success = function(r) {
                var geojson = layer.core.decode(r),
                    format = new OpenLayers.Format.GeoJSON(),
                    features = gis.util.map.getTransformedFeatureArray(format.read(geojson));

                if (!Ext.isArray(features)) {
                    olmap.mask.hide();
                    gis.alert(GIS.i18n.invalid_coordinates);
                    return;
                }

                if (!features.length) {
                    olmap.mask.hide();
                    gis.alert(GIS.i18n.no_valid_coordinates_found);
                    return;
                }

                layer.core.featureStore.loadFeatures(features.slice(0));

                loadData(view, features);
            };

            failure = function() {
                olmap.mask.hide();
                gis.alert(GIS.i18n.coordinates_could_not_be_loaded);
            };

            if (GIS.plugin && !GIS.app) {
                Ext.data.JsonP.request({
                    url: url,
                    disableCaching: false,
                    success: function(r) {
                        success(r);
                    }
                });
            }
            else {
                Ext.Ajax.request({
                    url: url,
                    disableCaching: false,
                    success: function(r) {
                        success(Ext.decode(r.responseText));
                    }
                });
            }
        };

		loadData = function(view, features) {
			view = view || layer.core.view;
			features = features || layer.core.featureStore.features;

			for (var i = 0; i < features.length; i++) {
				features[i].attributes.popupText = features[i].attributes.name + ' (' + features[i].attributes[view.organisationUnitGroupSet.id] + ')';
			}

			layer.removeFeatures(layer.features);
			layer.addFeatures(features);

			loadLegend(view);
		};

		loadLegend = function(view) {
            var isPlugin = GIS.plugin && !GIS.app,
                type = isPlugin ? 'jsonp' : 'json',
                url = gis.init.contextPath + '/api/organisationUnitGroupSets/' + view.organisationUnitGroupSet.id + '.' + type + '?fields=organisationUnitGroups[id,' + gis.init.namePropertyUrl + ',symbol]',
                success;

			view = view || layer.core.view;

            // labels
            for (var i = 0, attr; i < layer.features.length; i++) {
                attr = layer.features[i].attributes;
                attr.label = view.labels ? attr.name : '';
            }

            layer.styleMap = GIS.core.StyleMap(view);

            success = function(r) {
                var data = r.organisationUnitGroups,
                    options = {
                        indicator: view.organisationUnitGroupSet.id
                    };

                gis.store.groupsByGroupSet.loadData(data);

                layer.core.view = view;

                layer.core.applyClassification({
                    indicator: view.organisationUnitGroupSet.id
                });

                addCircles(view);

                afterLoad(view);
            };

            if (isPlugin) {
                Ext.data.JsonP.request({
                    url: url,
                    success: function(r) {
                        success(r);
                    }
                });
            }
            else {
                Ext.Ajax.request({
                    url: url,
                    success: function(r) {
                        success(Ext.decode(r.responseText));
                    }
                });
            }
		};

		addCircles = function(view) {
			var radius = view.areaRadius;

			if (layer.circleLayer) {
				layer.circleLayer.deactivateControls();
				layer.circleLayer = null;
			}
			if (Ext.isDefined(radius) && radius) {
				layer.circleLayer = GIS.core.CircleLayer(gis, layer.features, radius);
				nissa = layer.circleLayer;
			}
		};

		afterLoad = function(view) {

			// Legend
			gis.viewport.eastRegion.doLayout();

            if (layer.legendPanel) {
                layer.legendPanel.expand();
            }

			// Layer
			if (layer.item) {
				layer.item.setValue(true, view.opacity);
			}
			else {
				layer.setLayerOpacity(view.opacity);
			}

			// Gui
			if (loader.updateGui && Ext.isObject(layer.widget)) {
				layer.widget.setGui(view);
			}

			// Zoom
			if (loader.zoomToVisibleExtent) {
				olmap.zoomToVisibleExtent();
			}

			// Mask
			if (loader.hideMask) {
				olmap.mask.hide();
			}

			// Map callback
			if (loader.callBack) {
				loader.callBack(layer);
			}
			else {
				gis.map = null;

				if (gis.viewport.shareButton) {
                    gis.viewport.shareButton.enable();
				}
			}
		};

		loader = {
			compare: false,
			updateGui: false,
			zoomToVisibleExtent: false,
			hideMask: false,
			callBack: null,
			load: function(view) {
                if (gis.olmap.mask && !gis.skipMask) {
                    gis.olmap.mask.show();
                }

				if (this.compare) {
					compareView(view, true);
				}
				else {
					loadOrganisationUnits(view);
				}
			},
			loadData: loadData,
			loadLegend: loadLegend
		};

		return loader;
	};
