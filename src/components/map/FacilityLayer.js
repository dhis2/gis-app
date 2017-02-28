import Layer from './Layer';

// TODO: How to share headers for all fetch requests
const headers = {
    'Authorization': 'Basic ' + btoa('admin:district'),
};

export default class FacilityLayer extends Layer {

    createLayer() {
        const props = this.props;
        const indicator = props.organisationUnitGroupSet.id;
        const orgUnitGroupSymbols = {};
        const features = [];

        const config = {
            ...props.config,
            pane: props.id,
        };

        this.loadOrganisationUnitGroups(orgUnitGroups => {

            // Easier lookup of unit group symbols
            orgUnitGroups.forEach((group, index) => {
                if (!group.symbol) { // Add default symbol
                    group.symbol = (21 + index) + '.png'; // Symbol 21-25 are coloured circles
                }

                orgUnitGroupSymbols[group.name] = group.symbol;
            });

            this.loadOrganisationUnits(data => {

                // Only include point facilities - TODO: Add check if coordinate is valid
                config.data = data.filter(facility => facility.ty === 1).map(facility => {
                    const coord = JSON.parse(facility.co);
                    const group = facility.dimensions[indicator];

                    return {
                        type: 'Feature',
                        id: facility.id,
                        properties: {
                            ...facility,
                            name: facility.na,
                            label: facility.na + ' (' + group + ')',
                            icon: {
                                iconUrl: '//localhost:8080/images/orgunitgroup/' + orgUnitGroupSymbols[group],
                                iconSize: [16, 16]
                            },
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: coord
                        }
                    }
                });

                this.instance = this.props.map.createLayer(config).addTo(this.props.map);
            });
        });

        console.log('facility layer config', config);

        this.instance = this.props.map.createLayer(config).addTo(this.props.map);
    }

    loadOrganisationUnitGroups(callback) {
        fetch('//localhost:8080/api/27/organisationUnitGroupSets/J5jldMd8OHv.json?fields=organisationUnitGroups[id,displayShortName~rename(name),symbol]', { headers })
            .then(response => response.json())
            .then(json => callback(json.organisationUnitGroups))
            .catch(error => console.log('parsing failed', error));
    }

    loadOrganisationUnits(callback) {
        fetch('//localhost:8080/api/26/geoFeatures.json?ou=ou:LEVEL-4;ImspTQPwCqd&displayProperty=SHORTNAME&includeGroupSets=true', { headers })
            .then(response => response.json())
            .then(json => callback(json))
            .catch(error => console.log('parsing failed', error));
    }

}
