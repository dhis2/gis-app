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

        this.instance = this.props.map.createLayer(config).addTo(this.props.map);
    }

}
