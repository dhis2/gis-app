import React from 'react';

const DataItemFilters = ({ filters }) => (
    <div>FILTERS

        {filters.map((item, index) => (
            <div
                key={index}
            >{item.dimension} {item.name} {item.filter}</div>
        ))}

    </div>


);

export default DataItemFilters;
