import React, { PropTypes } from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionVisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import { grey600 } from 'material-ui/styles/colors';

import SortableHandle from './SortableHandle';
import LayerToolbar from './LayerToolbar';
import Basemaps from '../../containers/Basemaps';
import Legend from '../legend/Legend';

const styles = {
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

const LayerCard = (props) => (
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
            style={{
                ...styles.header,
                paddingLeft: props.type !== 'basemap' ? 34 : 14
            }}
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
                />
            }
            {props.type === 'basemap' &&
                <Basemaps id={props.id} />
            }
            <LayerToolbar
                {...props}
                onEdit={props.type !== 'basemap' ? () => console.log('Edit layer') : null}
                onDataTableShow={props.type !== 'basemap' ? props.onDataTableShow : null}
                onRemove={props.type!== 'basemap' ? () => props.onRemove(props.id) : null}
            />
        </CardText>
    </Card>
)

LayerCard.propTypes= {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    opacity: PropTypes.number,
    legend: PropTypes.object,
    visible: PropTypes.bool,
    expanded: PropTypes.bool,
};

LayerCard.defaultProps = {
    opacity: 1,
    visible: true,
    expanded: false,
};


export default LayerCard;