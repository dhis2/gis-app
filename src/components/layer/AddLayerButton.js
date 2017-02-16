import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';

const style = {
    position: 'absolute',
    right: 16,
    bottom: 24,
    zIndex: 10
};

export default function AddLayerButton(props) {
    return (
        <FloatingActionButton onTouchTap={props.onClick} style={style}>
            <ContentAddIcon />
        </FloatingActionButton>
    )
}