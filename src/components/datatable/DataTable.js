import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Column } from 'react-virtualized';
import ColumnHeader from './ColumnHeader';
import ColorCell from './ColorCell';
import './DataTable.css';

// Using react component to keep sorting state, which is only used within the data table.
class DataTable extends Component {

    constructor(props, context) {
        super(props);

        // Default sort
        const sortBy = 'index';
        const sortDirection = 'ASC';

        this.state = {
            sortBy: sortBy,
            sortDirection: sortDirection,
            data: this.sort(props.data, sortBy, sortDirection),
        };
    }

    render() {
        const { width, height, data } = this.props;
        const { sortBy, sortDirection } = this.state;
        const sortedData = this.sort(data, sortBy, sortDirection);

        return (
            <Table
                className='DataTable'
                width={width}
                height={height}
                headerHeight={48}
                rowHeight={32}
                rowCount={sortedData.length}
                rowGetter={({ index }) => sortedData[index]}
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
                    label='Index'
                    width={72}
                    className='right'
                    headerRenderer={(props) => <ColumnHeader type='number' {...props}  />}
                />
                <Column
                    dataKey='name'
                    label='Name'
                    width={100}
                    headerRenderer={(props) => <ColumnHeader type='string' {...props}  />}
                />
                <Column
                    dataKey='value'
                    label='Value'
                    width={72}
                    className='right'
                    headerRenderer={(props) => <ColumnHeader type='number' {...props}  />}
                />
                <Column
                    dataKey='legend'
                    label='Legend'
                    width={100}
                    headerRenderer={(props) => <ColumnHeader type='multiselect' {...props}  />}
                />
                <Column
                    dataKey='range'
                    label='Range'
                    width={72}
                    headerRenderer={(props) => <ColumnHeader type='string' {...props}  />}
                />
                <Column
                    dataKey='level'
                    label='Level'
                    width={72}
                    className='right'
                    headerRenderer={(props) => <ColumnHeader type='number' {...props}  />}
                />
                <Column
                    dataKey='parentName'
                    label='Parent'
                    width={100}
                    headerRenderer={(props) => <ColumnHeader type='string' {...props}  />}
                />
                <Column
                    dataKey='id'
                    label='ID'
                    width={100}
                    headerRenderer={(props) => <ColumnHeader type='string' {...props}  />}
                />
                <Column
                    dataKey='type'
                    label='Type'
                    width={100}
                    headerRenderer={(props) => <ColumnHeader type='string' {...props}  />}
                />
                <Column
                    dataKey='color'
                    label='Color'
                    width={100}
                    headerRenderer={(props) => <ColumnHeader type='string' {...props}  />}
                    cellRenderer={ColorCell}
                />
            </Table>
        );
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
