import React from 'react';
import FilterInput from './FilterInput';
import './ColumnHeader.css';
import { SortIndicator } from 'react-virtualized';

// Replacement for https://github.com/bvaughn/react-virtualized/blob/master/source/Table/defaultHeaderRenderer.js

const ColumnHeader = ({ columnData, dataKey, label, sortBy, sortDirection }) => (
    <div className="ColumnHeader">
        <span className="ColumnHeader-label">{label}</span>
        {sortBy === dataKey ? <SortIndicator className="AAA" sortDirection={sortDirection} /> : null}
        <FilterInput type='string' />
    </div>
);

export default ColumnHeader;
