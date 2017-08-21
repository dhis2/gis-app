import React from 'react';
// import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const style = {
  padding: 5
};

const AboutDialog = ({ system, user, aboutDialogOpen, closeAboutDialog }) => {

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
            <div style={style}><b>{GIS.i18n.time_since_last_data_update}</b>: {system.intervalSinceLastAnalyticsTableSuccess}</div>
            <div style={style}><b>{GIS.i18n.version}</b>: {system.version}</div>
            <div style={style}><b>{GIS.i18n.revision}</b>: {system.revision}</div>
            <div style={style}><b>{GIS.i18n.username}</b>: {user.username}</div>
        </Dialog>
    );
};



export default AboutDialog;
