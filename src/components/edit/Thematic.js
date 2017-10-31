import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import OrgUnitTree from '../../containers/OrgUnits';

const styles = {
  content: {
    padding: '0 24px',
    minHeight: 300,
  },
};

class Thematic extends Component {

  static contextTypes = {
    d2: PropTypes.object,
  };

  render() {
    const {
      rows = [],
    } = this.props;

    const orgUnits = rows.filter(r => r.dimension === 'ou')[0];
    // const d2 = this.context.d2;
    // const i18n = d2.i18n.getTranslation.bind(d2.i18n);

    return (
      <Tabs>
        <Tab label={i18n('organisation_units')}>
          <div style={styles.content}>
            <OrgUnitTree
              selected={orgUnits ? orgUnits.items : []}
            />
          </div>
        </Tab>
        <Tab label={i18n('style')}>

        </Tab>
      </Tabs>
    );
  }
}

export default Thematic;
