import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {SortableElement} from 'react-sortable-hoc';
import DragHandle from './DragHandle';
import IconButton from 'material-ui/IconButton';
import ActionVisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';

import LayerToolbar from './LayerToolbar';
import Legend from '../legend/Legend';
import {grey600} from 'material-ui/styles/colors'; // http://www.material-ui.com/#/customization/colors

const SortableLayer = SortableElement((props) => {
    const legend = props.legend;

    const styles = {
        container: {
            paddingBottom: 0,
            clear: 'both',
        },
        header: {
            padding: '10px 10px 10px 40px',
            marginRight: -5,
        },
        visibility: {
            width: 34,
            height: 34,
            padding: 5,
            position: 'absolute',
            right: 44
        },
        body: {
            padding: 0
        }
    };


    let visibilityIcon;
    let expandIcon;

    if (props.visible) {
        visibilityIcon = <ActionVisibilityIcon color={grey600} />;
    } else {
        visibilityIcon = <ActionVisibilityOffIcon color={grey600} />;
    }

    return (
        <Card containerStyle={styles.container}>
            <CardHeader
                title={props.title}
                subtitle={props.subtitle}
                // actAsExpander={true}  // Not able to stop event bubbling for visibility icon
                showExpandableButton={true}
                style={styles.header}>
                <DragHandle color={grey600} />
                <IconButton
                    style={styles.visibility}
                    onClick={(event) => props.onVisibilityClick(event, props.value)}
                    tooltip="Toggle visibility">
                    {visibilityIcon}
                </IconButton>
            </CardHeader>
            <CardText expandable={true} style={styles.body}>
                {legend &&
                    <Legend
                        unit={legend.unit}
                        items={legend.items}
                        description={legend.description}
                    />
                }
                <LayerToolbar />
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
        console.log('click', evt);
        evt.stopPropagation();
        evt.preventDefault();

        this.setState(prevState => ({
            visible: !prevState.visible
        }));
    }

    // TODO: Merge with SortableLayer renderer above
    render() {
        return (
            <SortableLayer
                index={this.props.index}
                title={this.props.title}
                subtitle={this.props.subtitle}
                visible={this.state.visible}
                onVisibilityClick={this.onVisibilityClick}
                legend={this.props.legend}
            />
        );
    }
}

