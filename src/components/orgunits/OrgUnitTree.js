import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import D2OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';

const styles = {
    container: {
        marginTop: 16,
        height: 300,
        width: '80%',
        overflowY: 'auto',
    },
    label: {
        cursor: 'pointer',
    },
    selectedLabel: {
        cursor: 'pointer',
    },
};

class OrgUnitTree extends Component {

    render() {
        const { root, selected, toggleOrganisationUnit } = this.props;

        if (!root) {
            return null;
        }

        console.log('selected', root.path);

        // onSelectClick

        return (
            <div style={styles.container}>
                <D2OrgUnitTree
                    style={{ background: 'red' }}
                    root={root}
                    selected={selected}
                    initiallyExpanded={[root.path]}
                    hideCheckboxes={true}
                    hideMemberCount={true}
                    onSelectClick={(evt, orgUnit) => toggleOrganisationUnit({
                        id: orgUnit.id,
                        path: orgUnit.path,
                    })}
                    labelStyle={styles.label}
                    selectedLabelStyle={styles.selectedLabel}
                />
            </div>
        );
    }

}

export default OrgUnitTree;