import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Table, Column, Cell} from 'fixed-data-table';

import '../../../node_modules/fixed-data-table/dist/fixed-data-table.css'; // TODO: Which to load?

// http://facebook.github.io/fixed-data-table/

const IndexCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props}>
        {rowIndex}
    </Cell>
);

const TextCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props}>
        {data[rowIndex][col]}
    </Cell>
);

const AddLayerDialog = ({ dataList, dataTableOpen, onRequestClose }) => {
    const actions = [
        <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={onRequestClose}
        />,
    ];

    return (
        <Dialog
            title="Data table"
            actions={actions}
            modal={true}
            open={dataTableOpen}
        >
            <Table
                rowHeight={50}
                headerHeight={50}
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
};

AddLayerDialog.propTypes = {
    dataList: PropTypes.array, // TODO: Use arrayOf?
};

AddLayerDialog.defaultProps = {
    dataList: [],
};

export default AddLayerDialog;