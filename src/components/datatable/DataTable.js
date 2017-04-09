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

const IndexCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props} style={{textAlign: 'right'}}>
        {rowIndex}
    </Cell>
);

const TextCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props}>
        {data[rowIndex][col]}
    </Cell>
);

const styles = {
    dialog: {
        padding: 0,
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
        margin: '0 8px 0 16px'
    }
};


const AddLayerDialog = ({ overlayId, overlays, onRequestClose }) => {
    if (overlayId) {
        const overlay = overlays.filter(layer => layer.id === overlayId)[0];

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={onRequestClose}
            />
        ];

        const dataList = overlay.data.map(item => ({
            code: item.id,
            name: item.properties.name,
            type: item.geometry.type,
        }));

        return (
            <Dialog
                bodyStyle={styles.dialog}
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
                    height={500}>
                    <Column
                        header={<Cell></Cell>}
                        cell={<IndexCell />}
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
                        header={<Cell>Code</Cell>}
                        cell={<TextCell data={dataList} col="code" />}
                        width={100}
                    />
                    <Column
                        header={<Cell>Type</Cell>}
                        cell={<TextCell data={dataList} col="type" />}
                        width={120}
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