import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';
import ItemTypeSelect from './ItemTypeSelect';
import IndicatorGroupSelect from '../../indicator/IndicatorGroupSelect';
import OrgUnitTree from '../../../containers/OrgUnits';

const styles = {
    content: { // TODO: reuse styles
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
        padding: 12,
        height: 300,
        overflowY: 'auto',
    },
};

class Thematic extends Component {

    render() {
        const {
            rows = [],
        } = this.props;

        const orgUnits = rows.filter(r => r.dimension === 'ou')[0];

        console.log('dimConf',  gis.conf.finals.dimension, gis.conf);

        return (
            <Tabs>
                <Tab label={i18next.t('data')}>
                    <div style={styles.content}>
                        <ItemTypeSelect />
                        <IndicatorGroupSelect />
                    </div>
                </Tab>
                <Tab label={i18next.t('Organisation units')}>
                    <div style={styles.content}>
                        <OrgUnitTree
                            selected={orgUnits ? orgUnits.items : []}
                        />
                    </div>
                </Tab>
                <Tab label={i18next.t('Style')}>

                </Tab>
            </Tabs>
        );
    }
}

export default Thematic;
