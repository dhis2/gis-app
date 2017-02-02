import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default function NewLayerDialog(props) {
    return (
        <Dialog
            title="Add new layer"
            //actions={actions}
            modal={true}
            open={false}
            //onRequestClose={this.handleClose}
        >
            The actions in this window were passed in as an array of React objects.
        </Dialog>
    );
}