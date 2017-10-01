import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import Button from 'd2-ui/lib/button/Button';

const style = {
  padding: 5
};

const AboutDialog = ({ aboutDialogOpen, closeAboutDialog }, { d2 }) => {
    const system = d2.system.systemInfo;
    const user = d2.currentUser;
    const i18n = d2.i18n.getTranslation.bind(d2.i18n);

    return (
        <Dialog
            title={i18n('about_dhis2_maps')}
            actions={[
                <Button
                    color='primary'
                    onClick={closeAboutDialog}
                >Close</Button>
            ]}
            open={aboutDialogOpen}
            onRequestClose={closeAboutDialog}
        >
            <div style={style}><b>{i18n('time_since_last_data_update')}</b>: {system.intervalSinceLastAnalyticsTableSuccess}</div>
            <div style={style}><b>{i18n('version')}</b>: {system.version}</div>
            <div style={style}><b>{i18n('revision')}</b>: {system.revision}</div>
            <div style={style}><b>{i18n('username')}</b>: {user.username}</div>
        </Dialog>
    );
};

AboutDialog.contextTypes = {
    d2: PropTypes.object
};

export default AboutDialog;
