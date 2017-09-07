import React from 'react';
import FilterItem from './FilterItem';

// https://react.rocks/example/react-redux-test



const DataItemFilters = ({filters, dataItems}) => {

    return (
        <div>
            {filters.map((item, index) => (
                <FilterItem
                    key={index}
                    dataItems={dataItems}
                    {...item}
                />
            ))}

            <div>Add filter btn</div>

        </div>


    )


}
;

export default DataItemFilters;
