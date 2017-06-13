import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionVisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import { grey600 } from 'material-ui/styles/colors';
import SortableHandle from './SortableHandle';
import OverlayToolbar from '../toolbar/OverlayToolbar';
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
};

const OverlayCard = (props) => {
    const {
        layer,
        editOverlay,
        removeOverlay,
        changeOverlayOpacity,
        toggleOverlayExpand,
        toggleOverlayVisibility,
        toggleDataTable,
    } = props;

    const {
        id,
        title,
        subtitle,
        isExpanded,
        isVisible,
        legend,
    } = layer;

    return (
        <Card
            style={styles.root}
            containerStyle={styles.container}
            expanded={isExpanded}
            onExpandChange={() => toggleOverlayExpand(id)}
        >
            <CardHeader
                title={title}
                subtitle={subtitle}
                showExpandableButton={true}
                style={{
                    ...styles.header,
                    paddingLeft: 34
                }}
                textStyle={styles.headerText}
            >
                <SortableHandle color={grey600} />
                <IconButton
                    style={styles.visibility}
                    onClick={() => toggleOverlayVisibility(id)}
                    tooltip="Toggle visibility">
                    {isVisible ? (
                        <ActionVisibilityIcon color={grey600} />
                    ) : (
                        <ActionVisibilityOffIcon color={grey600} />
                    )}
                </IconButton>
            </CardHeader>
            <CardText expandable={true} style={styles.body}>
                {legend && <Legend {...legend} />}
                <OverlayToolbar
                    layer={layer}
                    onEdit={() => editOverlay(layer)}
                    toggleDataTable={toggleDataTable}
                    onOpacityChange={changeOverlayOpacity}
                    onRemove={() => removeOverlay(id)}
                />
            </CardText>
        </Card>
    )
};

OverlayCard.propTypes= {
    layer: PropTypes.object,
    editOverlay: PropTypes.func.isRequired,
    removeOverlay: PropTypes.func.isRequired,
    changeOverlayOpacity: PropTypes.func.isRequired,
    toggleOverlayExpand: PropTypes.func.isRequired,
    toggleOverlayVisibility: PropTypes.func.isRequired,
    toggleDataTable: PropTypes.func.isRequired,
};

export default OverlayCard;
