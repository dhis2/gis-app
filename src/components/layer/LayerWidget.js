import React from 'react';
import LayerHeader from './LayerHeader';
import LayerToolbar from './LayerToolbar';
import Legend from '../legend/Legend';


// Stateful component: https://facebook.github.io/react/docs/state-and-lifecycle.html
export default class LayerWidget extends React.Component {
    constructor(props) {
        super(props);

        // The only place where we can assign this.state
        this.state = {
            visible: true // Can it be passed from favorite?
        };

        // This binding is necessary to make `this` work in the callback
        this.onVisibilityClick = this.onVisibilityClick.bind(this);

    }

    // Runs after the widget has been rendered to the DOM
    componentDidMount() {

    }

    // Clean up when layer is removed
    componentWillUnmount() {

    }

    onVisibilityClick(evt) {
        this.setState(prevState => ({
            visible: !prevState.visible
        }));
    }

    render() {
        return (
            <div>
                <LayerHeader
                    title={this.props.title}
                    visible={this.state.visible}
                    onVisibilityClick={this.onVisibilityClick}
                />
                <Legend />
                <LayerToolbar />
            </div>
        );
    }
}
