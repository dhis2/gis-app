import React from 'react';
import PropTypes from 'prop-types';
import OrgUnitTree from '../orgunits/OrgUnitTree';
import UserOrgUnits from '../orgunits/UserOrgUnits';

const OrgUnits = ({ root, items = [], toggleOrganisationUnit }) => (
    <div>
        <OrgUnitTree
            root={root}
            selected={items.filter(item => item.path)}
            disabled={items.some(item => item.id.includes('USER_ORGUNIT'))}
            onClick={toggleOrganisationUnit}
        />
        <UserOrgUnits
            selected={items.filter(item => item.id.includes('USER_ORGUNIT'))}
            onClick={toggleOrganisationUnit}
        />
    </div>
);

OrgUnits.propTypes = {
    root: PropTypes.object,
    items:  PropTypes.array,
    toggleOrganisationUnit: PropTypes.func,
};

export default OrgUnits;
