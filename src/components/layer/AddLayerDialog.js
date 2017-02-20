import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    bodyStyle: {
        overflowY: 'scroll',
    },
    layer: {
        float: 'left',
        width: 120,
        marginRight: 24,
        cursor: 'pointer',
        boxSizing: 'border-box',
        height: 160,
    },
    name: {
        fontSize: 14,
        color: '#333',
        paddingBottom: 20,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    image: {
        boxSizing: 'border-box',
        border: '1px solid #555',
        width: 120,
        height: 120,
    },
};

const AddLayerDialog = ({ layersDialogOpen, overlays, onRequestClose, onLayerSelect }) => {
    const actions = [
        <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={onRequestClose}
        />,
    ];

    return (
        <Dialog
            title="Add new layer"
            actions={actions}
            modal={true}
            open={layersDialogOpen}
            bodyStyle={styles.bodyStyle}
        >
            <div style={styles.list}>
                {overlays.map((layer, index) => (
                    <div key={`layer-${index}`} style={styles.layer} onClick={() => onLayerSelect(layer)}>
                        <img src={layer.img} style={styles.image} />
                        <div style={styles.name}>{layer.layerType || layer.title}</div>
                    </div>
                ))}
            </div>
        </Dialog>
    );
};

AddLayerDialog.propTypes = {
    layersDialogOpen: PropTypes.bool,
    overlays: PropTypes.array, // TODO: Use arrayOf?
    onRequestClose: PropTypes.func.isRequired,
    onLayerSelect: PropTypes.func.isRequired,
};

AddLayerDialog.defaultProps = {
    layersDialogOpen: false,
    overlays: [],
};

export default AddLayerDialog;
