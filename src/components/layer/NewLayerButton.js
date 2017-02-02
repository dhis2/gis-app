import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export default function NewLayerButton(props) {
    return (
        <FloatingActionButton {...props}>
            <ContentAdd />
        </FloatingActionButton>
    );
}