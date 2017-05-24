import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionVisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import Slider from 'material-ui/Slider';
import { grey600 } from 'material-ui/styles/colors';

import BasemapList from './BasemapList';

const styles = {
    root: {
        zIndex: 1010,
    },
    container: {
        paddingBottom: 0,
        clear: 'both',
        zIndex: 1010,
    },
    header: {
        height: 56,
        paddingLeft: 14,
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
    },
    toolbar: {
        backgroundColor: '#eee',
        height: 32,
        paddingLeft: 7
    },
    sliderContainer: {
        float: 'left',
        width: 100,
        marginBottom: 0
    },
    slider: {
        margin: 8
    }
};

const BasemapCard = (props) => (
    <Card
        style={styles.root}
        containerStyle={styles.container}
        expanded={props.expanded}
        onExpandChange={() => props.toggleBasemapExpand(props.id)}
    >
        <CardHeader
            title={props.title}
            subtitle={props.subtitle}
            // actAsExpander={true}  // Not able to stop event bubbling for visibility icon
            showExpandableButton={true}
            style={styles.header}
            textStyle={styles.headerText}>
            {!props.basemap &&
            <SortableHandle color={grey600} />
            }
            <IconButton
                style={styles.visibility}
                onClick={() => props.toggleBasemapVisibility(props.id)}
                tooltip="Toggle visibility">
                {props.visible ? (
                    <ActionVisibilityIcon color={grey600} />
                ) : (
                    <ActionVisibilityOffIcon color={grey600} />
                )}
            </IconButton>
        </CardHeader>
        <CardText expandable={true} style={styles.body}>
            <BasemapList {...props} />
            <div style={styles.toolbar}>
                <Slider
                    defaultValue={props.opacity}
                    onChange={(evt, opacity) => props.changeBasemapOpacity(opacity)}
                    style={styles.sliderContainer}
                    sliderStyle={styles.slider}
                />
            </div>
        </CardText>
    </Card>
);

BasemapCard.propTypes= {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    opacity: PropTypes.number,
    visible: PropTypes.bool,
    expanded: PropTypes.bool,
};

BasemapCard.defaultProps = {
    opacity: 1,
    visible: true,
    expanded: false,
};

export default BasemapCard;