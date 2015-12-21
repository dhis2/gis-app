	GIS.core.CircleLayer = function(gis, features, radius) {
		var points = gis.util.map.getPointsByFeatures(features),
			lonLats = gis.util.map.getLonLatsByPoints(points),
			controls = [],
			control,
			layer = new OpenLayers.Layer.Vector(),
			deactivateControls,
			createCircles,
			params = {};

		radius = radius && Ext.isNumber(parseInt(radius)) ? parseInt(radius) : 5;

		deactivateControls = function() {
			for (var i = 0; i < controls.length; i++) {
				controls[i].deactivate();
			}
		};

		createCircles = function() {
			if (lonLats.length) {
				for (var i = 0; i < lonLats.length; i++) {
					control = new OpenLayers.Control.Circle({
						layer: layer
					});
					control.lonLat = lonLats[i];
					controls.push(control);
				}

				gis.olmap.addControls(controls);

				for (var i = 0; i < controls.length; i++) {
					control = controls[i];
					control.activate();
					control.updateCircle(control.lonLat, radius);
				}
			}
		}();

		layer.deactivateControls = deactivateControls;

		return layer;
	};
