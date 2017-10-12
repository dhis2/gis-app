import React from 'react';
import OrgUnitTree from '../orgunits/OrgUnitTree';
import UserOrgUnits from '../orgunits/UserOrgUnits';

// import PropTypes from 'prop-types';

const styles = {
};



const OrgUnits = ({ root, items = [], toggleOrganisationUnit }) => {
    console.log('orgUnit items', items);

    return (
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
}

export default OrgUnits;
