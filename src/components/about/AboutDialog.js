import React from 'react';
// import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const AboutDialog = ({ aboutDialogOpen, closeAboutDialog }) => {
    const actions = [
        <FlatButton
            label='Close' // TODO: i18n
            primary={true}
            onTouchTap={closeAboutDialog}
        />,
    ];

    return (
        <Dialog
            title='About DHIS 2 Maps' // TODO: i18n
            actions={actions}
            open={aboutDialogOpen}
            onRequestClose={closeAboutDialog}
        >
            Info coming here
        </Dialog>
    );
};



export default AboutDialog;
