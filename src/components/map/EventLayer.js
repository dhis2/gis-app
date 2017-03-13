import Layer from './Layer';

class EventLayer extends Layer {

    createLayer(callback) {
        const props = this.props;
        const map = props.map;

        console.log('create facility layer', props);

        // Create layer config object
        const config = {
            type: 'dots',
            pane: props.id,
            data: props.data,
            color: '#' + props.eventPointColor,
            radius: props.eventPointRadius
        };

        // Create and add event layer based on config object
        this.instance = map.createLayer(config).addTo(map);
    }

}

export default EventLayer;