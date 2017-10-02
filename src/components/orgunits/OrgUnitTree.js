import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import D2OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';

class OrgUnitTree extends Component {

    render() {
        const { root, selected, toggleOrganisationUnit } = this.props;

        if (!root) {
            return null;
        }

        console.log('selected', selected);

        // onSelectClick

        return (
            <D2OrgUnitTree
                root={root}
                selected={selected}
                hideCheckboxes={true}
                onSelectClick={(evt, orgUnit) => toggleOrganisationUnit({
                    id: orgUnit.id,
                    path: orgUnit.path,
                })}
            />
        );
    }

}

export default OrgUnitTree;