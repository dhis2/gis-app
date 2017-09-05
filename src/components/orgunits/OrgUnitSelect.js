import React from 'react';

const OrgUnitSelect = ({ items }) => (
    <div>Organisation units

        {items.map(item => (
            <div key={item.id}>{item.id}</div>
        ))}

    </div>


);

export default OrgUnitSelect;
