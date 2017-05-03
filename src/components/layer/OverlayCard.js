import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionVisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import { grey600 } from 'material-ui/styles/colors';

import SortableHandle from './SortableHandle';
import LayerToolbar from './LayerToolbar';
import Legend from '../legend/Legend';

const styles = {
    root: {
        zIndex: 1100,
    },
    container: {
        paddingBottom: 0,
        clear: 'both',
    },
    header: {
        height: 56,
        paddingRight: 8,
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
        right: 32,
        top: 0,
    },
    body: {
        padding: 0,
    },
    legend: {
        padding: '8px 16px 16px 32px',
        margin: 0,
    }
};

const OverlayCard = (props) => {
    const layer = props.layer;

    return (
        <Card
            style={styles.root}
            containerStyle={styles.container}
            expanded={layer.expanded}
            onExpandChange={() => props.onExpandChange(layer.id)}
        >
            <CardHeader
                title={layer.title}
                subtitle={layer.subtitle}
                // actAsExpander={true}  // Not able to stop event bubbling for visibility icon
                showExpandableButton={true}
                style={{
                    ...styles.header,
                    paddingLeft: props.basemap ? 14 : 34
                }}
                textStyle={styles.headerText}>
                {!props.basemap &&
                    <SortableHandle color={grey600} />
                }
                <IconButton
                    style={styles.visibility}
                    onClick={() => props.onVisibilityChange(layer.id)}
                    tooltip="Toggle visibility">
                    {layer.visible ? (
                        <ActionVisibilityIcon color={grey600} />
                    ) : (
                        <ActionVisibilityOffIcon color={grey600} />
                    )}
                </IconButton>
            </CardHeader>
            <CardText expandable={true} style={styles.body}>
                {layer.legend &&
                <Legend
                    {...layer.legend}
                    style={styles.legend}
                />
                }
                {props.basemap &&
                <Basemaps id={layer.id} />
                }
                <LayerToolbar
                    layer={layer}
                    onEdit={!props.basemap ? () => props.onEdit(layer) : null}
                    onDataTableShow={!props.basemap ? props.onDataTableShow : null}
                    onOpacityChange={props.onOpacityChange}
                    onRemove={!props.basemap ? () => props.onRemove(layer.id) : null}
                />
            </CardText>
        </Card>
    )

};

OverlayCard.propTypes= {
    layer: PropTypes.object,
};



/*
OverlayCard.propTypes= {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    opacity: PropTypes.number,
    legend: PropTypes.object,
    visible: PropTypes.bool,
    expanded: PropTypes.bool,
};
*/

OverlayCard.defaultProps = {
    opacity: 1,
    visible: true,
    expanded: true,
};

export default OverlayCard;