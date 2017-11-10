import React, { Component } from 'react';
import PropTypes from 'prop-types';
import D2OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';

const styles = {
    label: {
        cursor: 'pointer',
    },
    selectedLabel: {
        cursor: 'pointer',
    },
    disabled: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 50000,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.8)',
    }
};

const OrgUnitTree = ({ root, selected, disabled, onClick, style }) => root ? (
    <div
        style={{
            ...style,
            overflowY: disabled ? 'hidden' : 'auto',
        }}
    >
        <D2OrgUnitTree
            root={root}
            selected={selected.map(item => item.path)}
            // selected={selected.length ? selected.map(item => item.path) : [root.path]}
            initiallyExpanded={[root.path]}
            hideCheckboxes={true}
            hideMemberCount={true}
            onSelectClick={(evt, orgUnit) => !disabled ? onClick({
                id: orgUnit.id,
                path: orgUnit.path,
            }) : null}
            labelStyle={styles.label}
            selectedLabelStyle={styles.selectedLabel}
        />
        {disabled ?
            <div style={styles.disabled} />
        : null}
    </div>
) : null;

OrgUnitTree.propTypes = {
    root: PropTypes.object,
    selected:  PropTypes.array,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

export default OrgUnitTree;
