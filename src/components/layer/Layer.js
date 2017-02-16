import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionVisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import {grey600} from 'material-ui/styles/colors';

import SortableHandle from './SortableHandle';
import LayerToolbar from './LayerToolbar';
import Basemaps from '../containers/Basemaps';
import Legend from '../legend/Legend';


function onEdit(layer) {
    console.log('edit layer', layer);
}

function onDataTableShow(layer) {
    console.log('show data table', layer);
}


const styles = {
    container: {
        paddingBottom: 0,
        clear: 'both',
    },
    header: {
        height: 56,
        padding: '0px 8px 0px 32px',
        marginRight: -8,
        fontSize: 10,
    },
    headerText: {
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)',
    },
    visibility: {
        width: 56,
        height: 56,
        padding: 8,
        position: 'absolute',
        right: 32
    },
    body: {
        padding: 0,
    },
    legend: {
        padding: '8px 16px 16px 32px',
        margin: 0,
    }
};

export default function LayerCard(props) {
    return (
        <Card
            containerStyle={styles.container}
            expanded={props.expanded}
            onExpandChange={() => props.onExpandChange(props.id)}
        >
            <CardHeader
                title={props.title}
                subtitle={props.subtitle}
                // actAsExpander={true}  // Not able to stop event bubbling for visibility icon
                showExpandableButton={true}
                style={styles.header}
                textStyle={styles.headerText}>
                {props.type !== 'basemap' &&
                    <SortableHandle color={grey600} />
                }
                <IconButton
                    style={styles.visibility}
                    onClick={() => props.onVisibilityChange(props.id)}
                    tooltip="Toggle visibility">
                    {props.visible ? (
                        <ActionVisibilityIcon color={grey600} />
                    ) : (
                        <ActionVisibilityOffIcon color={grey600} />
                    )}
                </IconButton>
            </CardHeader>
            <CardText expandable={true} style={styles.body}>
                {props.legend &&
                    <Legend
                        {...props.legend}
                        style={styles.legend}
                        style={styles.legend}
                    />
                }
                {props.type === 'basemap' &&
                    <Basemaps id={props.id} />
                }
                <LayerToolbar
                    id={props.id}
                    opacity={props.opacity}
                    onOpacityChange={props.onOpacityChange}
                    onEdit={props.type !== 'basemap' ? () => onEdit(props) : null}
                    onDataTableShow={props.type !== 'basemap' ? () => onDataTableShow(props) : null}
                    onFilter={props.onFilter}
                    onRemove={props.type!== 'basemap' ? () => props.onRemove(props.id) : null}
                />
            </CardText>
        </Card>
    )

}

/*
Layer.propTypes= {
    id: React.PropTypes.string,
    title: React.PropTypes.string,
    subtitle: React.PropTypes.string,
    opacity: React.PropTypes.number,
    legend: React.PropTypes.object,
    visible: React.PropTypes.bool,
    expanded: React.PropTypes.bool,
};

Layer.defaultProps = {
    opacity: 1,
    visible: true,
    expanded: false,
};
*/
