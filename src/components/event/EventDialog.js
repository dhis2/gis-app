import React from 'react';
// import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
// import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ProgramSelect from '../../containers/ProgramSelect';

const styles = {
    body: {
        padding: 0,
    },
    title: {
        padding: '8px 16px',
        fontSize: 18,
    },
    content: {
        padding: '0 24px 16px',
    },
};

const EventDialog = ({ programs }) => {
    console.log('programs', programs);

    return (
        <Dialog
            title='Event layer' // TODO: i18n
            bodyStyle={styles.body}
            titleStyle={styles.title}
            open={true}
        >
            <Tabs>
                <Tab label='Data'>
                    <div style={styles.content}>
                        <ProgramSelect />
                    </div>
                </Tab>
                <Tab label='Filter'>
                    <div style={styles.content}>
                        Filter
                    </div>
                </Tab>
                <Tab label='Organisation units'>
                    <div style={styles.content}>
                        Organisation units
                    </div>
                </Tab>
                <Tab label='Options'>
                    <div style={styles.content}>
                        Options
                    </div>
                </Tab>
            </Tabs>

        </Dialog>
    );
};

export default EventDialog;
