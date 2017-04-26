import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import FlatButton from 'material-ui/FlatButton';
import {Table, Column, Cell} from 'fixed-data-table';
import { grey600 } from 'material-ui/styles/colors';

import '../../../node_modules/fixed-data-table/dist/fixed-data-table.css'; // TODO: Which to load?

// http://facebook.github.io/fixed-data-table/

const styles = {
    dialog: {
        padding: 0,
    },
    dialogContent: {
        width: 660,
        maxWidth: 'none',
    },
    toolbar: {
        height: 40,
        padding: '0px 16px',
    },
    toolbarTitle: {
        fontSize: 16,
    },
    searchField: {
        width: 100,
        fontSize: 12,
    },
    valueField: {
        width: 100,
        fontSize: 12,
        marginRight: 16,
    },
    icon: {
        margin: '0 8px 0 16px',
    },
    rightAlign: {
        textAlign: 'right',
    },
};

const IndexCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props} style={styles.rightAlign} className={data[rowIndex].isSelected ? 'selected' : ''}>
        {rowIndex}
    </Cell>
);

const NumberCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props} style={styles.rightAlign} className={data[rowIndex].isSelected ? 'selected' : ''}>
        {data[rowIndex][col]}
    </Cell>
);

const TextCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props} className={data[rowIndex].isSelected ? 'selected' : ''}>
        {data[rowIndex][col]}
    </Cell>
);

const AddLayerDialog = ({ overlayId, overlays, closeDataTable, selectOrgUnit, unselectOrgUnit }) => {

    if (overlayId) {

        const overlay = overlays.filter(layer => layer.id === overlayId)[0];

        // console.log('overlay', overlay);

        const actions = [
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={closeDataTable}
            />
        ];

        const dataList = overlay.data.map(item => ({
            id: item.id,
            type: item.geometry.type,
            name: item.properties.name,
            value: item.properties.value,
            color: item.properties.color,
            level: item.properties.level,
            parent: item.properties.parentName,
            isSelected: item.isSelected || false,
        }));

        // Toggle row selection
        const onRowClick = function(evt, index) {
            const orgUnit = dataList[index];

            if (!orgUnit.isSelected) {
                selectOrgUnit(overlayId, orgUnit.id);
            } else {
                unselectOrgUnit(overlayId, orgUnit.id);
            }
        };

        return (
            <Dialog
                bodyStyle={styles.dialog}
                contentStyle={styles.dialogContent}
                actions={actions}
                modal={true}
                open={true}
            >

                <Toolbar style={styles.toolbar}>
                    <ToolbarGroup>
                        <ToolbarTitle style={styles.toolbarTitle} text="Data table" />
                        <SearchIcon style={styles.icon} color={grey600} />
                        <TextField style={styles.searchField} hintText="Search" />
                        <FilterIcon style={styles.icon} color={grey600} />
                        <TextField style={styles.valueField} hintText="Greater than" />
                        <TextField style={styles.valueField} hintText="Lower than" />

                    </ToolbarGroup>
                </Toolbar>
                <Table
                    rowHeight={24}
                    headerHeight={24}
                    rowsCount={dataList.length}
                    width={660}
                    height={500}
                    onRowClick={onRowClick}
                >
                    <Column
                        header={<Cell style={styles.rightAlign}>#</Cell>}
                        cell={<IndexCell data={dataList} />}
                        fixed={true}
                        width={40}
                    />
                    <Column
                        header={<Cell>Name</Cell>}
                        cell={<TextCell data={dataList} col="name" />}
                        fixed={true}
                        width={200}
                    />
                    <Column
                        header={<Cell>Id</Cell>}
                        cell={<TextCell data={dataList} col="id" />}
                        width={100}
                    />
                    <Column
                        header={<Cell style={styles.rightAlign}>Value</Cell>}
                        cell={<NumberCell data={dataList} col="value" />}
                        width={100}
                    />
                    <Column
                        header={<Cell>Color</Cell>}
                        cell={<TextCell data={dataList} col="color" />}
                        width={100}
                    />
                    <Column
                        header={<Cell>Type</Cell>}
                        cell={<TextCell data={dataList} col="type" />}
                        width={120}
                    />
                    <Column
                        header={<Cell>Level</Cell>}
                        cell={<TextCell data={dataList} col="level" />}
                        width={60}
                    />
                    <Column
                        header={<Cell>Parent unit</Cell>}
                        cell={<TextCell data={dataList} col="parent" />}
                        width={200}
                    />
                    <Column
                        header={<Cell>Ownership</Cell>}
                        cell={<TextCell data={dataList} col="ownership" />}
                        width={120}
                    />
                    <Column
                        header={<Cell>Location</Cell>}
                        cell={<TextCell data={dataList} col="location" />}
                        width={120}
                    />
                </Table>
            </Dialog>
        );
    } else {
        return null;
    }
};

/*
AddLayerDialog.propTypes = {
    dataList: PropTypes.array, // TODO: Use arrayOf?
};

AddLayerDialog.defaultProps = {
    dataList: [],
};
*/

export default AddLayerDialog;
