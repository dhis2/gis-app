//GIS.core.FeaturePopup = function(gis, instance) {
export default function FeaturePopup(gis, instance) {

    // systemSettings is currently not set for plugins
    if (gis.init.systemSettings) {
        var feature = instance.feature,
            generator = gis.init.periodGenerator,
            periodType = gis.init.systemSettings.infrastructuralPeriodType.name,
            attr = feature.properties,
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


        success = function(r) {
            var html = '<h2>' + feature.properties.name + '</h2>',
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
                html += 'No data found for:<ul>' +
                    '<li>Indicators in group: <em>' + iig.name + '</em></li>' +
                    '<li>Data elements in group: <em>' + ideg.name + '</em></li>' +
                    '<li>Period: <em>' + period.name + '</em></li>' +
                    '<p>To change groups, please go to general settings.</p>';
            }

            instance.bindPopup(html).openPopup();
            gis.mask.hide();
        };

        failure = function(r) {
            gis.mask.hide();
        };

        getData = function(paramString) {
            gis.mask.show();

            Ext.Ajax.request({
                url: gis.init.contextPath + '/api/analytics.json' + paramString,
                disableCaching: false,
                success: function(r) {
                    success(Ext.decode(r.responseText));
                },
                failure: failure
            });
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

    }
};