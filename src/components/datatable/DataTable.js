import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Column } from 'react-virtualized';
import ColumnHeader from './ColumnHeader';
import './DataTable.css';

// Using react component to keep sorting state, which is only used within the data table.
class DataTable extends Component {

    constructor(props, context) {
        super(props);

        // Default sort
        const sortBy = 'index';
        const sortDirection = 'ASC';

        // Transform from GeoJSON to table format
        // TODO: What happens if data changes outside the component?
        const data = props.data.map((d, i) => {
            return {
                ...d.properties,
                index: i,
                type: d.geometry.type,
            };
        });

        this.state = {
            sortBy: sortBy,
            sortDirection: sortDirection,
            data: this.sort(data, sortBy, sortDirection),
        };
    }

    render() {
        const { width, height } = this.props;
        const { data, sortBy, sortDirection } = this.state;

        return (
            <Table
                className='DataTable'
                width={width}
                height={height}
                headerHeight={48}
                rowHeight={32}
                rowCount={data.length}
                rowGetter={({ index }) => data[index]}
                onRowClick={evt => console.log('row click')}
                sort={({ sortBy, sortDirection }) => this.onSort(sortBy, sortDirection) }
                sortBy={sortBy}
                sortDirection={sortDirection}
                useDynamicRowHeight={false}
                hideIndexRow={false}
            >
                <Column
                    cellDataGetter={
                        ({ columnData, dataKey, rowData }) => rowData.index
                    }
                    dataKey='index'
                    label="Index"
                    width={72}
                    className='right'
                    headerRenderer={ColumnHeader}
                />
                <Column
                    dataKey='name'
                    width={100}
                    headerRenderer={() =>
                        <ColumnHeader
                            type='string'
                            label='Name'
                        />
                    }
                />
                <Column
                    dataKey='value'
                    width={72}
                    className='right'
                    headerRenderer={() =>
                        <ColumnHeader
                            type='number'
                            label='Value'
                        />
                    }
                />
                <Column
                    dataKey='level'
                    width={72}
                    className='right'
                    headerRenderer={() =>
                        <ColumnHeader
                            type='number'
                            label='Level'
                        />
                    }
                />
                <Column
                    dataKey='parentName'
                    width={100}
                    headerRenderer={() =>
                        <ColumnHeader
                            type='string'
                            label='Parent'
                        />
                    }
                />
                <Column
                    dataKey='id'
                    width={100}
                    headerRenderer={() =>
                        <ColumnHeader
                            type='string'
                            label='ID'
                        />
                    }
                />
                <Column
                    dataKey='type'
                    width={100}
                    headerRenderer={() =>
                        <ColumnHeader
                            type='string'
                            label='Type'
                        />
                    }
                />
                <Column
                    dataKey='color'
                    width={100}
                    headerRenderer={() =>
                        <ColumnHeader
                            type='string'
                            label='Color'
                        />
                    }
                />
            </Table>
        );
    }

    filter() {
        /*
         const valueFilter = overlay.valueFilter || { gt: null, lt: null, };
         let data = overlay.data;

         if (valueFilter.gt !== null) {
         data = data.filter(feature => feature.properties.value > valueFilter.gt);
         }

         if (valueFilter.lt !== null) {
         data = data.filter(feature => feature.properties.value < valueFilter.lt);
         }

         */
    }

    onSort(sortBy, sortDirection) {
        const data = this.state.data;

        this.setState({
            sortBy,
            sortDirection,
            data: this.sort(data, sortBy, sortDirection),
        });
    }

    // TODO: Make sure sorting works across different locales - use lib method
    sort(data, sortBy, sortDirection) {
        return data.sort((a, b) => {
            a = a[sortBy];
            b = b[sortBy];

            if (typeof a === 'number') {
                return sortDirection === 'ASC' ? a - b : b - a;
            }

            return sortDirection === 'ASC' ? a.localeCompare(b) : b.localeCompare(a);
        });
    }
}

export default DataTable;
