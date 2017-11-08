import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';
import OrgUnitTree from '../../containers/OrgUnits';

const styles = {
  content: {
    padding: '0 24px',
    minHeight: 300,
  },
};

class Thematic extends Component {

  render() {
    const {
      rows = [],
    } = this.props;

    const orgUnits = rows.filter(r => r.dimension === 'ou')[0];

    return (
      <Tabs>
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
