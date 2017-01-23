import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {SortableElement, SortableHandle} from 'react-sortable-hoc';
import LayerHeader from './LayerHeader';
import LayerToolbar from './LayerToolbar';
import Legend from '../legend/Legend';
import {grey600} from 'material-ui/styles/colors'; // http://www.material-ui.com/#/customization/colors

// Vertical drag icon
const DragHandle = SortableHandle(({color}) => (
    <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
        <path fill={color} d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z" />
    </svg>
));

const SortableLayer = SortableElement((props) => {
    return (
        <Card>
            <CardHeader
                title={props.title}
                subtitle={props.subtitle}
                actAsExpander={true}
                showExpandableButton={true}
            />
            <CardActions>
                <DragHandle color={grey600} />
            </CardActions>
            <CardText expandable={true}>
                Legend
            </CardText>
        </Card>
    )
});


// Stateful component: https://facebook.github.io/react/docs/state-and-lifecycle.html
export default class LayerWidget extends Component {
    constructor(props) {
        super(props);

        // The only place where we can assign this.state
        this.state = {
            visible: true, // Can it be passed from favorite?
            expanded: true,
        };

        // This binding is necessary to make `this` work in the callback
        this.onExpandClick = this.onExpandClick.bind(this);
        this.onVisibilityClick = this.onVisibilityClick.bind(this);

    }

    // Runs after the widget has been rendered to the DOM
    componentDidMount() {

    }

    // Clean up when layer is removed
    componentWillUnmount() {

    }

    onExpandClick(evt) {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }));
    }

    onVisibilityClick(evt) {
        this.setState(prevState => ({
            visible: !prevState.visible
        }));
    }

    render() {
        return (
            <SortableLayer
                index={this.props.index}
                title={this.props.title}
                subtitle={this.props.subtitle}
            />
        );
    }
}



/*
<LayerHeader
    title={this.props.title}
    visible={this.state.visible}
    onVisibilityClick={this.onVisibilityClick}
    expanded={this.state.expanded}
    onExpandClick={this.onExpandClick}
/>
<Legend />
<LayerToolbar />
*/