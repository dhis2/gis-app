//GIS.core.LayerHandlerFacility = function(gis, layer) {
export default function LayerHandlerFacility(gis, layer) {
	var compareView,
		loadOrganisationUnitGroups,
		loadOrganisationUnits,
		loadData,
		loadLegend,
		updateLegend,
		updateMap,
		addCircles,
		afterLoad,
        onFeatureClick,
		onFeatureRightClick,
		isValidCoordinate,
		loader;

	compareView = function(view, doExecute) {
		var src = layer.view,
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

		// always reload legend
		if (doExecute) {
			loadLegend(view);
			return gis.conf.finals.widget.loadtype_legend;
		}

		gis.mask.hide();
	};

	loadOrganisationUnitGroups = function (view) {
		var url = gis.init.contextPath + '/api/organisationUnitGroupSets/' + view.organisationUnitGroupSet.id + '.json' + '?fields=organisationUnitGroups[id,' + gis.init.namePropertyUrl + ',symbol]',
            data;

		Ext.Ajax.request({
			url: url,
			success: function(r) {
                data = Ext.decode(r.responseText);
                loadOrganisationUnits(view, data.organisationUnitGroups);
			}
		});
	},

	loadOrganisationUnits = function(view, orgUnitGroups) {
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
			var indicator = view.organisationUnitGroupSet.id,
				orgUnitGroupSymbols = {};

			// Easier lookup of unit group symbols
			for (var i = 0; i < orgUnitGroups.length; i++) {
				orgUnitGroupSymbols[orgUnitGroups[i].name] = orgUnitGroups[i].symbol;
			}

			var features = [];

			for (var i = 0, prop, coord, group; i < r.length; i++) {
				prop = r[i];

				if (prop.ty === 1) { // Only add points
					coord = JSON.parse(prop.co);
					group = prop.dimensions[indicator];

					if (gis.util.map.isValidCoordinate(coord) && group) {
						prop.icon = {
							iconUrl: gis.init.contextPath + '/images/orgunitgroup/' + orgUnitGroupSymbols[group],
							iconSize: [16, 16]
						};

                        prop.name = prop.na;
                        prop.label = prop.na + ' (' + group + ')';

						features.push({
							type: 'Feature',
							id: prop.id,
							properties: prop,
							geometry: {
								type: 'Point',
								coordinates: coord
							}
						});
					}
				}
			}

			if (!features.length) {
				gis.mask.hide();
				gis.alert(GIS.i18n.no_valid_coordinates_found);
				return;
			}

			// Store features for search
            layer.featureStore.loadFeatures(features.slice(0));
            layer.features = features;

			updateLegend(orgUnitGroups);
			updateMap(view, features);
		};

		failure = function() {
			gis.mask.hide();
			gis.alert(GIS.i18n.coordinates_could_not_be_loaded);
		};

		Ext.Ajax.request({
			url: url,
			disableCaching: false,
			success: function(r) {
				success(Ext.decode(r.responseText));
			}
		});
	};

	updateMap = function(view, features) {
        var layerConfig = Ext.applyIf({
            data: features,
            hoverLabel: '{label}'
        }, layer.config);

        if (view.labels) {
            Ext.apply(layerConfig, {
                label: '{name}',
                labelStyle: {
                    color: view.labelFontColor,
                    fontSize: view.labelFontSize,
                    fontStyle: view.labelFontStyle,
                    fontWeight: view.labelFontWeight
                }
            });
        }

        // Remove area layer instance if already exist
        if (layer.areaInstance && gis.instance.hasLayer(layer.areaInstance)) {
            gis.instance.removeLayer(layer.areaInstance);
        }

        if (view.areaRadius) {
            layer.areaInstance = gis.instance.addLayer({
                type: 'circles',
                radius: view.areaRadius,
                highlightStyle: false,
                data: features
            });
        }

        // Remove layer instance if already exist
        if (layer.instance && gis.instance.hasLayer(layer.instance)) {
			layer.instance.off('click', onFeatureClick);
			layer.instance.off('contextmenu', onFeatureRightClick);
            gis.instance.removeLayer(layer.instance);
        }

		// Create layer instance
		layer.instance = gis.instance.addLayer(layerConfig);

		// Put map layers in correct order: https://github.com/dhis2/dhis2-gis/issues/9
		gis.util.map.orderLayers();

        // TODO: Remember to remove events
        layer.instance.on('click', onFeatureClick);
        layer.instance.on('contextmenu', onFeatureRightClick);

        layer.view = view;

		afterLoad(view);
	};

	onFeatureClick = function(evt) {
		GIS.core.FeaturePopup(gis, evt.layer);
	};

	onFeatureRightClick = function(evt) {
		var menu = GIS.core.FeatureContextMenu(gis, layer, evt.layer);
		menu.showAt([evt.originalEvent.x, evt.originalEvent.y]);
	};

	updateLegend = function(items) {
		var	element = document.createElement('ul'),
			child;

		element.className = 'legend';

		for (var i = 0; i < items.length; i++) {
			child = document.createElement('li');
			child.style.backgroundImage = 'url(' + gis.init.contextPath + '/images/orgunitgroup/' + items[i].symbol + ')';
			child.innerHTML = items[i].name;
			element.appendChild(child);
		}

		layer.legendPanel.update(element.outerHTML);
	},

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
			gis.instance.fitBounds(layer.instance.getBounds());
		}

		// Mask
		if (loader.hideMask) {
			gis.mask.hide();
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
			if (gis.mask && !gis.skipMask) {
				gis.mask.show();
			}

			if (this.compare) {
				compareView(view, true);
			}
			else {
				loadOrganisationUnitGroups(view);
			}
		},
		loadData: loadData,
		loadLegend: loadLegend
	};

	return loader;
};
