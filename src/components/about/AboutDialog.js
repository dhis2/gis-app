import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import Button from 'd2-ui/lib/button/Button';

const style = {
  padding: 5
};

const AboutDialog = (props, context) => {
    const { aboutDialogOpen, closeAboutDialog } = props;
    const d2 = context.d2;
    let system;
    let user;
    let i18n;

    // TODO: Possible to render after d2 is available?

    if (d2) {
        system = d2.system.systemInfo;
        user = d2.currentUser;
        i18n = d2.i18n.getTranslation.bind(d2.i18n);
    } else {
        return false;
    }

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
