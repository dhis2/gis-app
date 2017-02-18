import React from 'react';
import Dialog from 'material-ui/Dialog';
import {Table, Column, Cell} from 'fixed-data-table';

import '../../../../node_modules/fixed-data-table/dist/fixed-data-table.css'; // TODO: Which to load?

// https://play.dhis2.org/dev/api/26/geoFeatures.json?ou=ou:LEVEL-4;ImspTQPwCqd&displayProperty=NAME&includeGroupSets=true
const dataList = [{
    name: 'Ahamadyya Mission Cl',
    code: 'OU_211234',
    level: 4,
    parent: 'Magbema',
    type: '',
    ownership: 'Public facilities',
    location: 'Rural',
},{
    name: 'Ahmadiyya Muslim Hospital',
    code: 'OU_268246',
    level: 4,
    parent: 'Yoni',
    type: 'Hospital',
    ownership: 'Public facilities',
    location: 'Urban',
},{
    name: 'Air Port Centre, Lungi',
    code: 'OU_255017',
    level: 4,
    parent: 'Kaffu Bullom',
    type: '',
    ownership: 'Public facilities',
    location: 'Urban',
},{
    name: 'Allen Town Health Post',
    code: 'OU_278337',
    level: 4,
    parent: 'Freetown',
    type: '',
    ownership: 'Public facilities',
    location: 'Urban',
},{
    name: 'Approved School CHP',
    code: 'OU_278314',
    level: 4,
    parent: 'Freetown',
    type: 'CHP',
    ownership: 'Public facilities',
    location: 'Urban',
},{
    name: 'Arab Clinic',
    code: 'OU_233378',
    level: 4,
    parent: 'Gbense',
    type: 'Clinic',
    ownership: 'Public facilities',
    location: 'Urban',
},{
    name: 'Baama CHC',
    code: 'OU_222681',
    level: 4,
    parent: 'Wandor',
    type: 'CHC',
    ownership: 'Public facilities',
    location: 'Urban',
},{
    name: 'Babara CHC',
    code: 'OU_254991',
    level: 4,
    parent: 'Lokomasama',
    type: 'CHC',
    ownership: 'Public facilities',
    location: 'Urban',
},{
    name: 'Bafodia CHC',
    code: 'OU_226243',
    level: 4,
    parent: 'Wara Wara Bafodia',
    type: 'CHC',
    ownership: 'Public facilities',
    location: 'Urban',
},{
    name: 'Bai Largo MCHP',
    code: 'OU_246994',
    level: 4,
    parent: 'Kori',
    type: 'MCHP',
    ownership: 'Public facilities',
    location: 'Urban',
},{
    name: 'Baiama CHP',
    code: 'OU_233331',
    level: 4,
    parent: 'Tankoro',
    type: 'CHP',
    ownership: 'Public facilities',
    location: 'Urban',
}];


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






export default class ObjectDataExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dataList: dataList,
        };
    }

    render() {
        var {dataList} = this.state;
        return (
            <Dialog
                title="Data table"
                //actions={actions}
                modal={true}
                open={false}
                {...this.props}
                //onRequestClose={this.handleClose}
            >
                <Table
                    rowHeight={50}
                    headerHeight={50}
                    rowsCount={dataList.length}
                    width={660}
                    height={500}
                    {...this.props}>
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
    }
}
