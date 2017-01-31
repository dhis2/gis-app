import React, {Component} from 'react';
import {SortableElement} from 'react-sortable-hoc';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionVisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import {grey600} from 'material-ui/styles/colors'; // http://www.material-ui.com/#/customization/colors

import SortableHandle from './SortableHandle';
import LayerToolbar from './LayerToolbar';
import Legend from '../legend/Legend';


class SortableLayer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };

        this.onVisibilityChange = this.onVisibilityChange.bind(this);
    }

    onVisibilityChange(evt) {
        console.log('visibility change $$$', evt);
        // evt.stopPropagation();
        // evt.preventDefault();

        this.setState(prevState => ({
           visible: !prevState.visible
        }));
    }

    render() {
        const props = this.props;
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

        if (this.state.visible) {
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
                    <SortableHandle color={grey600} />
                    <IconButton
                        style={styles.visibility}
                        onClick={(event) => this.onVisibilityChange(event, props.value)}
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
    }
};


export default SortableElement(SortableLayer);
