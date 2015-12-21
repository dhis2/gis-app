	GIS.core.StyleMap = function(labelConfig) {
		var defaults = {
				fillOpacity: 1,
				strokeColor: '#fff',
				strokeWidth: 1,
                pointRadius: 8,
                labelAlign: 'cr',
                labelYOffset: 13,
                fontFamily: '"Arial","Sans-serif","Roboto","Helvetica","Consolas"'
			},
			select = {
				fillOpacity: 0.9,
				strokeColor: '#fff',
				strokeWidth: 1,
                //pointRadius: 8,
				cursor: 'pointer',
                labelAlign: 'cr',
                labelYOffset: 13
			};

        if (Ext.isObject(labelConfig) && labelConfig.labels) {
            defaults.label = '\${label}';
            defaults.fontSize = labelConfig.labelFontSize;
            defaults.fontWeight = labelConfig.labelFontWeight;
            defaults.fontStyle = labelConfig.labelFontStyle;
            defaults.fontColor = labelConfig.labelFontColor;
        }

		return new OpenLayers.StyleMap({
			'default': defaults,
			select: select
		});
	};
