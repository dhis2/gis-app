import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';

class EarthEngineDialog extends Component {

    render() {
        return (
            <Tabs>
                <Tab label={i18next.t('Style')}>

                </Tab>
            </Tabs>
        );
    }

}

export default EarthEngineDialog;