import Layer from './Layer';
import isString from 'd2-utilizr/lib/isString';
import isArray from 'd2-utilizr/lib/isArray';
import { apiFetch } from '../../util/api';

// let eventCoordinateFieldName; // Name of event coordinate field to show in popup


class EventLayer extends Layer {

    createLayer(callback) {
        const props = this.props;
        const data = props.data;
        const map = props.map;

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
            }
        }

        // console.log('create event layer', props, this, this.onEventClick);

        // Create and add event layer based on config object
        this.instance = map.createLayer(config).addTo(map);

        map.fitBounds(this.instance.getBounds()); // TODO: Do as action?

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
            .then(response => response.json())
            .then(data => {
                // console.log('loadDataElements', data, this);

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

                // console.log('displayElements', this.displayElements);

            })
            .catch(error => console.log('Parsing failed: ', error)); // TODO

    }

    onEventClick(feature, callback) {
        const coord = feature.geometry.coordinates;

        apiFetch('events/' + feature.id + '.json')
            .then(response => response.json())
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
                            </tbody></table>`

                callback(content);


            })
            .catch(error => console.log('Parsing failed: ', error)); // TODO





        console.log('Event click', feature);
    }


}

export default EventLayer;