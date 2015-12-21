	GIS.core.MeasureWindow = function(gis) {
		var window,
			label,
			handleMeasurements,
			control,
			styleMap;

		styleMap = new OpenLayers.StyleMap({
			'default': new OpenLayers.Style()
		});

		control = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
			persist: true,
			immediate: true,
			handlerOption: {
				layerOptions: {
					styleMap: styleMap
				}
			}
		});

		handleMeasurements = function(e) {
			if (e.measure) {
				label.setText(e.measure.toFixed(2) + ' ' + e.units);
			}
		};

		gis.olmap.addControl(control);

		control.events.on({
			measurepartial: handleMeasurements,
			measure: handleMeasurements
		});

		control.geodesic = true;
		control.activate();

		label = Ext.create('Ext.form.Label', {
			style: 'height: 20px',
			text: '0 km'
		});

		window = Ext.create('Ext.window.Window', {
			title: GIS.i18n.measure_distance,
			layout: 'fit',
			cls: 'gis-container-default gis-plugin',
			bodyStyle: 'text-align: center',
			width: 130,
			minWidth: 130,
			resizable: false,
			items: label,
			listeners: {
				show: function() {
					var x = gis.viewport.eastRegion.getPosition()[0] - this.getWidth() - 3,
						y = gis.viewport.centerRegion.getPosition()[1] + 64;
					this.setPosition(x, y);
				},
				destroy: function() {
					control.deactivate();
					gis.olmap.removeControl(control);
				}
			}
		});

		return window;
	};
