import Layer from './Layer';
import isString from 'd2-utilizr/lib/isString';
import isArray from 'd2-utilizr/lib/isArray';
import { apiFetch } from '../../util/api';

class EventLayer extends Layer {

    createLayer(callback) {
        const props = this.props;
        const data = props.data;
        const map = this.context.map;

        // Data elements to display in event popup
        this.displayElements = {};

        // Default props = no cluster
        const config = {
            type: 'dots',
            pane: props.id,
            data: data,
            color: '#' + props.eventPointColor,
            radius: props.eventPointRadius,
            popup: this.onEventClick.bind(this),
        };

        if (props.eventClustering) {
            if (isArray(data)) {
                config.type = 'clientCluster';
            } else if (isString(data)) {
                config.type = 'serverCluster';
                config.bounds = props.bounds;

                const self = this;
                config.load = function(params, callback) {
                    apiFetch(`${data}&bbox=${params.bbox}&clusterSize=${params.clusterSize}&includeClusterPoints=${params.includeClusterPoints}`)
                        .then(data => callback(params.tileId, self.toGeoJson(data)));
                }
            }
        }

        // Create and add event layer based on config object
        this.layer = map.createLayer(config).addTo(map);

        map.fitBounds(this.layer.getBounds()); // TODO: Do as action?

        this.loadDataElements();
    }

    // Get option sets by id (used for data elements i popup)
    getDataElementOptionSets(dataElement){
        if (dataElement.optionSet && dataElement.optionSet.id) {
            dhis2.gis.store.get('optionSets', dataElement.optionSet.id).done(optionSet => {
                optionSet.options.forEach(option => dataElement.optionSet[option.code] = option.name);
            });
        }
    }

    // Load data elements that should be displayed in popups
    loadDataElements() {
        const props = this.props;
        const namePropertyUrl = gis.init.namePropertyUrl; // TODO

        apiFetch(`programStages/${props.programStage.id}.json?fields=programStageDataElements[displayInReports,dataElement[id,${namePropertyUrl},optionSet]]`)
            .then(data => {
                if (data.programStageDataElements) {
                    data.programStageDataElements.forEach(el => {
                        if (el.displayInReports) {
                            this.displayElements[el.dataElement.id] = el.dataElement;
                            this.getDataElementOptionSets(el.dataElement);
                        } else if (props.eventCoordinateField && el.dataElement.id === props.eventCoordinateField) {
                            this.eventCoordinateFieldName = el.dataElement.name;
                        }
                    });
                }
            });
    }

    onEventClick(feature, callback) {
        const coord = feature.geometry.coordinates;

        apiFetch('events/' + feature.id + '.json')
            .then(data => {
                const time = data.eventDate.substring(0, 10) + ' ' + data.eventDate.substring(11, 16);
                const dataValues = data.dataValues;
                let content = '<table><tbody>';

                if (isArray(dataValues)) {
                    dataValues.forEach(dataValue => {
                        const displayEl = this.displayElements[dataValue.dataElement];

                        if (displayEl) {
                            let value = dataValue.value;

                            if (displayEl.optionSet) {
                                value = displayEl.optionSet[value];
                            }

                            content += `<tr><th>${displayEl.name}</th><td>${value}</td></tr>`;
                        }
                    });

                    content += '<tr style="height:5px;"><th></th><td></td></tr>';
                }

                content += `<tr><th>${GIS.i18n.organisation_unit}</th><td>${data.orgUnitName}</td></tr>
                            <tr><th>${GIS.i18n.event_time}</th><td>${time}</td></tr>
                            <tr><th>${this.eventCoordinateFieldName || GIS.i18n.event_location}</th><td>${coord[0]}, ${coord[1]}</td></tr> 
                            </tbody></table>`;

                callback(content);


            });

    }

    toGeoJson(data) {
        const header = {};
        const features = [];

        // Convert headers to object for easier lookup
        data.headers.forEach((h, i) => header[h.name] = i);

        if (isArray(data.rows)) {
            data.rows.forEach(row => {
                const extent = row[header.extent].match(/([-\d\.]+)/g);
                const coords = row[header.center].match(/([-\d\.]+)/g);

                // Round to 6 decimals - http://www.jacklmoore.com/notes/rounding-in-javascript/
                coords[0] = Number(Math.round(coords[0] + 'e6') + 'e-6');
                coords[1] = Number(Math.round(coords[1] + 'e6') + 'e-6');

                features.push({
                    type: 'Feature',
                    id: row[header.points],
                    geometry: {
                        type: 'Point',
                        coordinates: coords
                    },
                    properties: {
                        count: parseInt(row[header.count], 10),
                        bounds: [[extent[1], extent[0]], [extent[3], extent[2]]]
                    }
                });
            });
        }

        return features;
    }

}

export default EventLayer;