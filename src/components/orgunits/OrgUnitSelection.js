import React from 'react';
import PropTypes from 'prop-types';
import OrgUnitTree from '../orgunits/OrgUnitTree';
import UserOrgUnits from '../orgunits/UserOrgUnits';

const styles = {
    container: {
        position: 'relative'
    },
    orgUnitTree: {
        position: 'absolute',
        top: 24,
        bottom: 8,
        left: 24,
        right: 288,
        padding: 8,
        // overflowX: 'hidden',
        overflow: 'auto',
        boxShadow: '0px 0px 4px 1px rgba(0,0,0,0.2)',
    },
    userOrgUnits: {
        position: 'absolute',
        top: 24,
        bottom: 8,
        right: 24,
        width: 240,
        padding: '8px 16px',
        boxShadow: '0px 0px 4px 1px rgba(0,0,0,0.2)',
    }
};

const OrgUnits = ({ root, items = [], toggleOrganisationUnit }) => (
    <div>
        <OrgUnitTree
            root={root}
            selected={items.filter(item => item.path)}
            disabled={items.some(item => item.id.includes('USER_ORGUNIT'))}
            onClick={toggleOrganisationUnit}
            style={styles.orgUnitTree}
        />
        <UserOrgUnits
            selected={items.filter(item => item.id.includes('USER_ORGUNIT'))}
            onClick={toggleOrganisationUnit}
            style={styles.userOrgUnits}
        />
    </div>
);

OrgUnits.propTypes = {
    root: PropTypes.object,
    items:  PropTypes.array,
    toggleOrganisationUnit: PropTypes.func,
};

export default OrgUnits;
