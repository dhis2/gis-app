import React from 'react';
import FilterInput from '../../containers/FilterInput';
import './ColumnHeader.css';
import { SortIndicator } from 'react-virtualized';

// Replacement for https://github.com/bvaughn/react-virtualized/blob/master/source/Table/defaultHeaderRenderer.js

const ColumnHeader = ({ columnData, dataKey, label, type, sortBy, sortDirection }) => (
    <div className='ColumnHeader'>
        <span className='ColumnHeader-label'>{label}</span>
        {sortBy === dataKey ? <SortIndicator sortDirection={sortDirection} /> : null}
        <FilterInput
            type={type}
            dataKey={dataKey}
        />
    </div>
);

export default ColumnHeader;
