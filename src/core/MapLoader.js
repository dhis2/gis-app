GIS.core.MapLoader = function(gis, isSession, applyConfig) {
	var getMap,
		setMap,
		closeAllLayers,
		afterLoad,
		callBack,
		register = [],
		loader,
		applyViews = Ext.isObject(applyConfig) && Ext.Array.from(applyConfig.mapViews).length ? applyConfig.mapViews : null,
		clearAllLayers;

	getMap = function() {
		var url = gis.init.contextPath + '/api/maps/' + gis.map.id + '.json?fields=' + gis.conf.url.mapFields.join(','),
			success,
			failure;

		success = function(r) {

			// operand
			if (Ext.isArray(r.mapViews)) {
				for (var i = 0, view, objectName; i < r.mapViews.length; i++) {
					view = r.mapViews[i];

					// TODO, TMP
					if (Ext.isArray(view.dataDimensionItems) && view.dataDimensionItems.length && Ext.isObject(view.dataDimensionItems[0])) {
						var item = view.dataDimensionItems[0];

						if (item.hasOwnProperty('dataElement')) {
							objectName = 'de';
						}
						else if (item.hasOwnProperty('dataSet')) {
							objectName = 'ds';
						}
						else {
							objectName = 'in';
						}
					}
				}
			}

			gis.map = r;
			setMap();
		};

		failure = function(r) {
			gis.mask.hide();

			r = Ext.decode(r.responseText);

			if (Ext.Array.contains([403], parseInt(r.httpStatusCode))) {
				r.message = GIS.i18n.you_do_not_have_access_to_all_items_in_this_favorite || r.message;
			}

			gis.alert(r);
		};

		Ext.Ajax.request({
			url: url,
			success: function(r) {
				success(Ext.decode(r.responseText));
			},
			failure: function(r) {
				failure(r);
			}
		});
	};

	setMap = function() {
		var views = gis.map.mapViews,
			handler;

		// title
		if (gis.dashboard && gis.viewport.northRegion && gis.map && gis.map.name) {
			gis.viewport.northRegion.update(gis.map.name);
		}

		if (!(Ext.isArray(views) && views.length)) {
			gis.mask.hide();
			gis.alert(GIS.i18n.favorite_outdated_create_new);
			return;
		}

		for (var i = 0, applyView; i < views.length; i++) {
			applyView = applyViews ? applyViews[i] : null;
			views[i] = gis.api.layout.Layout(views[i], applyView);
		}

		views = Ext.Array.clean(views);

		if (!views.length) {
			gis.mask.hide();
			return;
		}

		if (gis.viewport && gis.viewport.favoriteWindow && gis.viewport.favoriteWindow.isVisible()) {
			gis.viewport.favoriteWindow.destroy();
		}

		clearAllLayers();

		for (var i = 0, layout, layer; i < views.length; i++) {
			layout = views[i];
			layer = gis.layer[layout.layer];

			handler = layer.handler(gis, layer);
			handler.updateGui = !gis.el;
			handler.callBack = callBack;
			handler.load(layout);
		}

	};

	// Replacement for gis.olmap.closeAllLayers()
	clearAllLayers = function() {
		var layer;

		for (var type in gis.layer) {
			if (gis.layer.hasOwnProperty(type)) {
				layer = gis.layer[type];

				// Only clear vector layers (overlays)
				if (layer.layerType !== 'base') {

					// Remove layer from map if exist
					if (layer.instance && gis.instance.hasLayer(layer.instance)) {
						gis.instance.removeLayer(layer.instance);
					}

					// Reset layer widget
					if (layer.widget) {
						layer.widget.reset();
					}
				}
			}
		}
	};

	callBack = function(layer) {
		register.push(layer);

		if (register.length === gis.map.mapViews.length) {
			afterLoad();
		}
	};

	afterLoad = function() {
		var lon = parseFloat(gis.map.longitude) || 0,
			lat = parseFloat(gis.map.latitude) || 20,
			zoom = gis.map.zoom || 3,
			validLatLng = ((lon >= -180 && lon <= 180) && (lat >= -90 && lat <= 90));

		// gis.el is the element used to render the map (only for plugin)
		// isSession is true if you select "map -> view this table/chart" as map in pivot/visualizer
		if (gis.el || isSession || !validLatLng) {
			gis.instance.fitBounds(gis.instance.getLayersBounds());
		}
		else {
			gis.instance.setView([lat, lon], zoom);
		}

		// interpretation button
		if (gis.viewport.shareButton) {
			gis.viewport.shareButton.enable();
		}

		// session storage
		if (GIS.isSessionStorage) {
			gis.util.layout.setSessionStorage('map', gis.util.layout.getAnalytical());
		}

		gis.mask.hide();
	};

	loader = {
		load: function(views) {
			if (gis.mask && !gis.skipMask) {
				gis.mask.show();
			}

			if (gis.map && gis.map.id) {

				getMap();
			}
			else {
				if (views) {
					gis.map = {
						mapViews: views
					};
				}

				setMap();
			}
		}
	};

	return loader;
};
