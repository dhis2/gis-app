import React from 'react';
import PropTypes from 'prop-types';
import { Table, Column } from 'react-virtualized';

const DataTable = (props) => {
    const {
        overlay,
        width,
        height,
    } = props;
    const valueFilter = overlay.valueFilter || { gt: null, lt: null, };
    let data = overlay.data;

    if (valueFilter.gt !== null) {
        data = data.filter(feature => feature.properties.value > valueFilter.gt);
    }

    if (valueFilter.lt !== null) {
        data = data.filter(feature => feature.properties.value < valueFilter.lt);
    }

    // Temp
    data = data.map((d, i) => {
        return {
            ...d.properties,
            index: i,
        };
    });

    console.log(data[0]);

    return (
        <Table
            className='dhis-gis-data-table'
            width={width}
            height={height}
            headerHeight={56}
            rowHeight={32}
            rowCount={data.length}
            rowGetter={({ index }) => data[index]}
            onRowClick={evt => console.log('row click')}
            sort={({ sortBy, sortDirection }) => console.log(sortBy, sortDirection)}
            useDynamicRowHeight={false}
            hideIndexRow={false}
        >
            <Column
                label='Index'
                cellDataGetter={
                    ({ columnData, dataKey, rowData }) => rowData.index
                }
                dataKey='index'
                // disableSort={!this._isSortEnabled()}
                width={72}
                className='right'
                headerRenderer={({label}) => (
                    <div key='header'>
                        <span>{label}</span>
                        <input defaultValue='3,5-15,>20' />
                    </div>
                )}
            />
            <Column
                label='Name'
                dataKey='name'
                width={100}
                headerRenderer={({label}) => (
                    <div key='header'>
                        <span>{label}</span>
                        <input defaultValue='Search' />
                    </div>
                )}
            />
            <Column
                label='Value'
                dataKey='value'
                width={72}
                className='right'
                headerRenderer={({label}) => (
                    <div key='header'>
                        <span>{label}</span>
                        <input defaultValue='3,5-15,>20' />
                    </div>
                )}
            />
            <Column
                label='Level'
                dataKey='level'
                width={72}
                className='right'
                headerRenderer={({label}) => (
                    <div key='header'>
                        <span>{label}</span>
                        <input defaultValue='3,5-15,>20' />
                    </div>
                )}
            />
            <Column
                label='Parent'
                dataKey='parentName'
                width={100}
                headerRenderer={({label}) => (
                    <div key='header'>
                        <span>{label}</span>
                        <input defaultValue='Search' />
                    </div>
                )}
            />
            <Column
                label='ID'
                dataKey='id'
                width={100}
                disableSort={true}
                headerRenderer={({label}) => (
                    <div key='header'>
                        <span>{label}</span>
                        <input defaultValue='Search' />
                    </div>
                )}
            />
            <Column
                label='Color'
                dataKey='color'
                width={100}
                disableSort={true}
                headerRenderer={({label}) => (
                    <div key='header'>
                        <span>{label}</span>
                        <input defaultValue='Search' />
                    </div>
                )}
            />
        </Table>
    );
};

export default DataTable;
