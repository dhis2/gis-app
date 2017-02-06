import React from 'react';
import {Table, Column, Cell} from 'fixed-data-table';
import FakeObjectDataListStore from '../helpers/FakeObjectDataListStore';

import '../../../node_modules/fixed-data-table/dist/fixed-data-table.css'; // TODO: Which to load?

// http://facebook.github.io/fixed-data-table/

const DateCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props}>
        {data.getObjectAt(rowIndex)[col].toLocaleString()}
    </Cell>
);

const ImageCell = ({rowIndex, data, col, ...props}) => (
    <div>Image</div>
);

const LinkCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props}>
        <a href="#">{data.getObjectAt(rowIndex)[col]}</a>
    </Cell>
);


const TextCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props}>
        {data.getObjectAt(rowIndex)[col]}
    </Cell>
);


export default class ObjectDataExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dataList: new FakeObjectDataListStore(1000000),
        };
    }

    render() {
        var {dataList} = this.state;
        return (
            <Table
                rowHeight={50}
                headerHeight={50}
                rowsCount={dataList.getSize()}
                width={1000}
                height={500}
                {...this.props}>
                <Column
                    cell={<ImageCell data={dataList} col="avatar" />}
                    fixed={true}
                    width={50}
                />
                <Column
                    header={<Cell>First Name</Cell>}
                    cell={<LinkCell data={dataList} col="firstName" />}
                    fixed={true}
                    width={100}
                />
                <Column
                    header={<Cell>Last Name</Cell>}
                    cell={<TextCell data={dataList} col="lastName" />}
                    fixed={true}
                    width={100}
                />
                <Column
                    header={<Cell>City</Cell>}
                    cell={<TextCell data={dataList} col="city" />}
                    width={100}
                />
                <Column
                    header={<Cell>Street</Cell>}
                    cell={<TextCell data={dataList} col="street" />}
                    width={200}
                />
                <Column
                    header={<Cell>Zip Code</Cell>}
                    cell={<TextCell data={dataList} col="zipCode" />}
                    width={200}
                />
                <Column
                    header={<Cell>Email</Cell>}
                    cell={<LinkCell data={dataList} col="email" />}
                    width={200}
                />
                <Column
                    header={<Cell>DOB</Cell>}
                    cell={<DateCell data={dataList} col="date" />}
                    width={200}
                />
            </Table>
        );
    }
}
