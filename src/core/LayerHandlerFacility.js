import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';
import arrayDifference from 'd2-utilizr/lib/arrayDifference';

export default function LayerHandlerFacility(gis, layer) {

	const loadOrganisationUnitGroups = function (view) {
		const url = gis.init.apiPath + 'organisationUnitGroupSets/' + view.organisationUnitGroupSet.id + '.json' + '?fields=organisationUnitGroups[id,' + gis.init.namePropertyUrl + ',symbol]';

		Ext.Ajax.request({
			url: encodeURI(url),
			success: function(r) {
                const data = JSON.parse(r.responseText);
                loadOrganisationUnits(view, data.organisationUnitGroups);
			}
		});
	};

	const loadOrganisationUnits = function(view, orgUnitGroups) {
		const items = view.rows[0].items;
		const propertyMap = {
			'name': 'name',
			'displayName': 'name',
			'shortName': 'shortName',
			'displayShortName': 'shortName'
		};
		const keyAnalysisDisplayProperty = gis.init.userAccount.settings.keyAnalysisDisplayProperty;
		const displayProperty = propertyMap[keyAnalysisDisplayProperty] || propertyMap[xLayout.displayProperty] || 'name';
		const url = function() {
			let params = '?ou=ou:' + items.map(item => item.id).join(';');

			params += '&displayProperty=' + displayProperty.toUpperCase();

			if (isArray(view.userOrgUnit) && view.userOrgUnit.length) {
				params += '&userOrgUnit=' + view.userOrgUnit.map(unit => unit).join(';');
			}

			return gis.init.apiPath + 'geoFeatures.json' + params + '&includeGroupSets=true';
		}();

		const success = function(data) {
			const indicator = view.organisationUnitGroupSet.id;
			const orgUnitGroupSymbols = {};

			// Easier lookup of unit group symbols
            orgUnitGroups.forEach((group, index) => {
                if (!group.symbol) { // Add default symbol
                    group.symbol = (21 + index) + '.png'; // Symbol 21-25 are coloured circles
                }

                // orgUnitGroupSymbols[group.name] = group.symbol; // Not safe to match on name
                orgUnitGroupSymbols[group.id] = group.symbol;
            });

			const features = [];

            data.forEach(facility => {
                if (facility.ty === 1 && isObject(facility.dimensions)) { // Only add points with belonging to a org.unit group
                    const coord = JSON.parse(facility.co);
                    const group = facility.dimensions[indicator];

					// console.log('orgUnitGroupSymbols', orgUnitGroupSymbols);

                    if (gis.util.map.isValidCoordinate(coord) && group) {

                        facility.icon = {
                            iconUrl: gis.init.contextPath + '/images/orgunitgroup/' + orgUnitGroupSymbols[group],
                            iconSize: [16, 16]
                        };

                        facility.name = facility.na;
                        facility.label = facility.na + ' (' + group + ')';

                        features.push({
                            type: 'Feature',
                            id: facility.id,
                            properties: facility,
                            geometry: {
                                type: 'Point',
                                coordinates: coord
                            }
                        });
                    }
                }
            });

            if (!features.length) {
				gis.alert(GIS.i18n.no_valid_coordinates_found);
				return;
			}

			// Store features for search
            layer.featureStore.loadFeatures(features.slice(0));
            layer.features = features;

			updateLegend(orgUnitGroups, orgUnitGroupSymbols);
			updateMap(view, features);
		};

		Ext.Ajax.request({
			url: url,
			disableCaching: false,
			success(r) {
				success(JSON.parse(r.responseText));
			},
            failure() {
                if (gis.mask) {
                    gis.mask.hide();
                }
                gis.alert(GIS.i18n.coordinates_could_not_be_loaded);
            }
		});
	};

	const updateMap = function(view, features) {
        const layerConfig = Ext.applyIf({
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
                    fontWeight: view.labelFontWeight,
                    paddingTop: '10px'
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

        layer.instance.on('click', onFeatureClick);
        layer.instance.on('contextmenu', onFeatureRightClick);

		afterLoad(view);
	};

	const onFeatureClick = function(evt) {
		const attr = evt.layer.feature.properties;
		let content = '<div class="leaflet-popup-orgunit"><em>' + attr.name + '</em>';

		if (isObject(attr.dimensions)) {
			content += '<br/>' + GIS.i18n.groups + ': ' + Object.keys(attr.dimensions).map(id => attr.dimensions[id]).join(', ');
		}

		if (attr.pn) {
			content += '<br/>' + GIS.i18n.parent_unit + ': ' + attr.pn;
		}

		content += '</div>';

		L.popup()
			.setLatLng(evt.latlng)
			.setContent(content)
			.openOn(gis.instance);
	};

	const onFeatureRightClick = function(evt) {
		L.DomEvent.stopPropagation(evt); // Don't propagate to map right-click
		const menu = GIS.core.ContextMenu(gis, layer, evt.layer, evt.latlng);
		menu.showAt([evt.originalEvent.x, evt.originalEvent.y]);
	};

	const updateLegend = function(items, symbols) {
		let html = '<div class="dhis2-legend"><dl class="dhis2-legend-image">';

		// console.log('legend', items, symbols);

        items.forEach(item => {
            html += '<dt style="background-image:url(' + gis.init.contextPath + '/images/orgunitgroup/' + item.symbol + ');"></dt>';
            html += '<dd>' + item.name + '</dd>';
        });

		html += '</dl></div>';

		if (layer.legendPanel) {
			layer.legendPanel.update(html);
		} else { // Dashboard map
			if (!gis.legend) {
				gis.legend = gis.instance.addControl({
					type: 'legend',
					offset: [0, -64],
					content: html
				});
			} else {
				gis.legend.setContent(gis.legend.getContent() + html);
			}
		}
	};

	const afterLoad = function(view) {
		layer.view = view;

		// Legend
		if (gis.viewport) {
			gis.viewport.eastRegion.doLayout();
		}

		if (layer.legendPanel) {
			layer.legendPanel.expand();
		}

		// Layer
		if (layer.item) {
			layer.item.setValue(true, view.opacity);
		}
		else {
			layer.instance.setOpacity(view.opacity);
		}

		// Gui
		if (loader.updateGui && isObject(layer.widget)) {
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

	const loader = {
		compare: false,
		updateGui: false,
		zoomToVisibleExtent: false,
		hideMask: false,
		callBack: null,
		load(view) {
			if (gis.mask && !gis.skipMask) {
				gis.mask.show();
			}

			loadOrganisationUnitGroups(view);
		}
	};

	return loader;
};
