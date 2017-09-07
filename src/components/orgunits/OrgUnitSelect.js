import React from 'react';
// import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';

const OrgUnitSelect = ({ items }) => (
    <div>Organisation units

        {items.map(item => (
            <div key={item.id}>{item.id}</div>
        ))}

    </div>


);

export default OrgUnitSelect;
