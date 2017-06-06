import { apiFetch } from '../util/api';
import { toGeoJson } from '../util/map';
import { arraySort } from '../util/array';
import { classify } from '../util/thematic';
import isObject from 'd2-utilizr/lib/isObject';
import isArray from 'd2-utilizr/lib/isArray';
import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import arrayClean from 'd2-utilizr/lib/arrayClean';

class ThematicLoader {

    constructor(layer, callback) {
        this.layer = layer;
        this.callback = callback;
        this.dimConf = gis.conf.finals.dimension; // TODO

        this.load(layer);
    }

    load(layer) {
        const orgUnits = layer.rows[0].items;
        const dxItems = layer.columns[0].items;
        const isOperand = layer.columns[0].dimension === this.dimConf.operand.objectName;
        const peItems = layer.filters[0].items;
        const ouItems = layer.rows[0].items;
        const propertyMap = {
            'name': 'name',
            'displayName': 'name',
            'shortName': 'shortName',
            'displayShortName': 'shortName'
        };
        const keyAnalysisDisplayProperty = gis.init.userAccount.settings.keyAnalysisDisplayProperty; // TODO
        const displayProperty = propertyMap[keyAnalysisDisplayProperty] || propertyMap[layer.displayProperty] || 'name';

        let orgUnitParams = '?ou=ou:' + orgUnits.map(item => item.id).join(';') + '&displayProperty=' + displayProperty.toUpperCase();

        if (isArray(layer.userOrgUnit) && layer.userOrgUnit.length) {
            orgUnitParams += '&userOrgUnit=' + layer.userOrgUnit.join(';');
        }

        // ou
        let dataParams = '?dimension=ou:' + ouItems.map(item => item.id).join(';');

        // dx
        dataParams += '&dimension=dx:' + dxItems.map(item => isOperand ? item.id.split('.')[0] : item.id).join(';');

        if (layer.valueType === 'ds') {
            dataParams += '.REPORTING_RATE';
        }

        dataParams += isOperand ? '&dimension=co' : '';

        // pe
        dataParams += '&filter=pe:' + peItems.map(item => item.id).join(';');

        // display property
        dataParams += '&displayProperty=' + displayProperty.toUpperCase();

        if (isArray(layer.userOrgUnit) && layer.userOrgUnit.length) {
            dataParams += '&userOrgUnit=' + layer.userOrgUnit.join(';');
        }

        // relative period date
        if (layer.relativePeriodDate) {
            dataParams += '&relativePeriodDate=' + layer.relativePeriodDate;
        }

        if (layer.aggregationType) {
            dataParams += '&aggregationType=' + layer.aggregationType;
        }

        // console.log(orgUnitParams, dataParams);
        // return gis.init.apiPath + 'geoFeatures.json' + params;

        const orgUnitReq = apiFetch(`geoFeatures.json${orgUnitParams}`);
        const dataReq = apiFetch(`analytics.json${dataParams}`);

        // Load data from API
        Promise.all([orgUnitReq, dataReq])
            .then(response => Promise.all(response.map(r => r.json())))
            .then(data => this.onLoad(data[0], data[1]))
            .catch(error => console.log('Parsing failed: ', error));
    }

    // Called when org units and data is loaded
    onLoad(orgUnits, data) {
        const features = toGeoJson(orgUnits, 'ASC');
        const layer = this.layer;

        this.metaData = data.metaData;

        if (!features.length) {
            gis.alert(GIS.i18n.no_valid_coordinates_found); // TODO
            return;
        }

        // layer.featureStore.loadFeatures(features.slice(0)); // TODO
        // layer.features = features;

        // const response = gis.api.response.Response(data); // validate - TODO: needed?
        const featureMap = {};
        const valueMap = {};
        const valueFeatures = []; // only include features with values
        const values = []; // to find min and max values

        this.aggregationType = (GIS.i18n[(layer.aggregationType || '').toLowerCase()] || '').toLowerCase();

        let ouIndex;
        let valueIndex;

        if (!data) {
            /* TODO
             if (gis.mask) {
             gis.mask.hide();
             }
             */
            return;
        }

        // ou index, value index
        for (let i = 0; i < data.headers.length; i++) {
            if (data.headers[i].name === this.dimConf.organisationUnit.dimensionName) {
                ouIndex = i;
            }
            else if (data.headers[i].name === this.dimConf.value.dimensionName) {
                valueIndex = i;
            }
        }

        // Feature map
        features.forEach(feature => {
            featureMap[feature.id] = true;
        });

        // Value map
        data.rows.forEach(row => {
            valueMap[row[ouIndex]] = parseFloat(row[valueIndex]);
        });

        features.forEach(feature => {
            const id = feature.id;

            if (featureMap.hasOwnProperty(id) && valueMap.hasOwnProperty(id)) {
                feature.properties.value = valueMap[id];
                feature.properties.aggregationType = this.aggregationType;
                valueFeatures.push(feature);
                values.push(valueMap[id]);
            }
        });

        // Sort values in ascending order
        values.sort((a, b) => a - b);

        this.features = valueFeatures;
        this.values = values;

        this.loadLegend(features, values);
    }

    loadLegend(features, values) {
        const layer = this.layer;

        this.bounds = [];
        this.colors = [];
        this.names = [];
        this.count = {}; // number in each class

        let legends = [];

        if (layer.legendSet) { // Pre-defined legend set
            this.loadLegendSet();
        } else { // Custom legend
            const elementMap = {
                'in': 'indicators',
                'de': 'dataElements',
                'ds': 'dataSets'
            };
            const elementUrl = elementMap[layer.columns[0].objectName];
            const id = layer.columns[0].items[0].id;

            if (!elementUrl) {
                this.createLegend();
                return;
            }

            // TODO: Not sure why this is needed
            apiFetch(`${elementUrl}.json?fields=legendSet[id,displayName~rename(name)]&paging=false&filter=id:eq:${id}`)
                .then(response => response.json())
                .then(data => {
                    const elements = data[elementUrl];
                    let set;

                    if (arrayFrom(elements).length) {
                        set = isObject(elements[0]) ? elements[0].legendSet || null : null;
                    }

                    if (set) {
                        layer.legendSet = set;
                        this.loadLegendSet();
                    } else {
                        this.createLegend();
                    }
                })
                .catch(this.createLegend); // TODO
        }
    }

    loadLegendSet() {
        const layer = this.layer;
        const fields = gis.conf.url.legendSetFields.join(','); // TODO
        const bounds = this.bounds;
        const colors = this.colors;
        const names = this.names;

        apiFetch(`legendSets/${layer.legendSet.id}.json?fields=${fields}`)
            .then(response => response.json())
            .then(data => {
                const legendItems = data.legends;

                arraySort(legendItems, 'ASC', 'startValue');

                legendItems.forEach(item => {
                    if (bounds[bounds.length - 1] !== item.startValue) {
                        if (bounds.length !== 0) {
                            colors.push('#F0F0F0');
                            names.push('');
                        }
                        bounds.push(item.startValue);
                    }
                    colors.push(item.color);
                    names.push(item.name);
                    bounds.push(item.endValue);

                });

                layer.method = 1; // Predefined legend
                layer.legendSet.names = names;
                layer.legendSet.bounds = bounds;
                layer.legendSet.colors = colors;
                layer.legendSet.count = this.count;

                this.createLegend()

            })
            .catch(error => console.log('Parsing failed: ', error)); // TODO
    }

    createLegend() {
        const layer = this.layer;
        const metaData = this.metaData;
        const bounds = this.bounds;
        const colors = this.colors;
        const names = this.names;
        const values = this.values;
        const features = this.features;

        // All dimensions
        const dimensions = arrayClean([].concat(layer.columns || [], layer.rows || [], layer.filters || []));
        const peIds = metaData[this.dimConf.period.objectName];

        for (let i = 0, dimension; i < dimensions.length; i++) {
            dimension = dimensions[i];

            for (let j = 0, item; j < dimension.items.length; j++) {
                item = dimension.items[j];
                item.name = metaData.names[item.id];
            }
        }

        // Period name without changing the id
        layer.filters[0].items[0].name = metaData.names[peIds[peIds.length - 1]];

        const options = { // Classification options
            indicator: gis.conf.finals.widget.value, // TODO
            method: layer.method,
            numClasses: layer.classes,
            bounds: bounds,
            colors: layer.colorScale ? layer.colorScale.split(',') : colors,
            count: this.count,
            minSize: layer.radiusLow,
            maxSize: layer.radiusHigh,
            minValue: values[0],
            maxValue: values[values.length - 1],
            colorLow: layer.colorLow,
            colorHigh: layer.colorHigh
        };

        //if (!loader.isDrillDown) { // TODO: Where is this set?
        // updateLegend(layer, metaData, options);
        //}

        // Build legend object
        const legend = {
            items: []
        };

        const legendNames = layer.legendSet ? layer.legendSet.names || {} : {};

        // title
        let id = layer.columns[0].items[0].id;

        // event data items
        if (layer.valueType === 'di') {
            id = layer.program.id + '.' + id;
        }

        let name = layer.columns[0].items[0].name;

        // legend.title = (metaData.names[id] || name || id) + (aggregationType ? ` (${aggregationType})` : '');
        layer.title = (metaData.names[id] || name || id) + (this.aggregationType ? ` (${this.aggregationType})` : '');

        // period
        id = layer.filters[0].items[0].id;
        name = layer.filters[0].items[0].name;

        layer.subtitle = metaData.names[id] || name || id;

        if (layer.method === 1 && layer.legendSet) { // Predefined legend
            for (let i = 0; i < bounds.length - 1; i++) {
                const name = legendNames[i];
                const label = bounds[i] + ' - ' + bounds[i + 1];
                const count = ' (' + (options.count[i + 1] || 0) + ')';

                const item = {
                    color: options.colors[i],
                };

                if (name === label) {
                    item.name = label + count;
                } else {
                    item.name = name || '';
                    item.range = label + count;
                }

                legend.items.push(item);
            }
        }
        else { // Automatic legend
            for (let i = 0; i < options.bounds.length - 1; i++) {
                legend.items.push({
                    color: options.colors[i],
                    name: options.bounds[i].toFixed(1) + ' - ' + options.bounds[i + 1].toFixed(1) + ' (' + (options.count[i + 1] || 0) + ')',
                });
            }
        }

        // Apply classification
        classify(features, values, options, legend);

        layer.legend = legend;
        layer.data = features;
        layer.isLoaded = true;

        this.callback(layer);
    }
}

export default ThematicLoader;