import React from 'react'
import TextField from 'material-ui/TextField';
// import SortIndicator from './SortIndicator'
import type { HeaderRendererParams } from './types'

export default function defaultHeaderRenderer ({
    columnData,
    dataKey,
    disableSort,
    label,
    sortBy,
    sortDirection
    }) {
    //const showSortIndicator = sortBy === dataKey;

    const children = [
        <span
            className='ReactVirtualized__Table__headerTruncatedText'
            key='label'
            title={label}
        >
          {label}#
        </span>
    ];

    /*
    if (showSortIndicator) {
        children.push(
            <SortIndicator
                key='SortIndicator'
                sortDirection={sortDirection}
            />
        )
    }
    */

        children.push(
            <TextField
                key='filter'
                hintText='Search'
            />
        )

    return children;
}