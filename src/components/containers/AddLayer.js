import React from 'react';
import { connect } from 'react-redux'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import { addLayer } from '../actions';

let AddLayerButton = ({ dispatch }) => {

    let onTouchTap = () => {
        console.log('dispatch');
        dispatch(addLayer({title: 'New layer'}));
    };

    return (
        <FloatingActionButton onTouchTap={onTouchTap}>
            <ContentAddIcon />
        </FloatingActionButton>
    )
};

AddLayerButton = connect()(AddLayerButton)

export default AddLayerButton;
