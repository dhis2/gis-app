import React from 'react';
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


export default function AddLayerDialog(props) {
    const actions = [
        <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={props.onRequestClose}
        />,
    ];

    return (
        <Dialog
            title="Add new layer"
            actions={actions}
            modal={true}
            open={props.layersDialogOpen}
            bodyStyle={styles.bodyStyle}
        >
            <div style={styles.list}>
                {props.overlays.map((layer, index) => (

                    <div key={`layer-${index}`} style={styles.layer} onClick={() => props.onLayerSelect(layer)}>
                        <img src={layer.img} style={styles.image} />
                        <div style={styles.name}>{layer.layerType || layer.title}</div>
                    </div>

                ))}
            </div>


        </Dialog>
    );
}

