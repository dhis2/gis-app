import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import FlatButton from 'material-ui/FlatButton';
import DragIcon from 'material-ui/svg-icons/editor/drag-handle';
import {Table, Column, Cell} from 'fixed-data-table';
import { grey400, grey600 } from 'material-ui/styles/colors';

import '../../../node_modules/fixed-data-table/dist/fixed-data-table.css'; // TODO: Which to load?

// http://facebook.github.io/fixed-data-table/

const styles = {
    resizeHandle: {
        position: 'absolute',
        left: '50%',
        top: -8,
        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)',
        borderRadius: 2,
        width: 40,
        height: 16,
        background: '#fff',
        zIndex: 1500,
        cursor: '-webkit-grab',
    },
    dialog: {
        padding: 0,
    },
    dialogContent: {
        // width: 660,
        // maxWidth: 'none',
    },
    toolbar: {
        height: 40,
        padding: '0px 16px',
    },
    toolbarTitle: {
        fontSize: 16,
    },
    field: {
        width: 100,
        height: 48,
        fontSize: 12,
        marginRight: 16,
    },
    input: {
        marginTop: 4,
    },
    underline: {
        background: 'red',
    },
    floatingLabel: {
        top: 14,
    },
    floatingLabelShrink: {
        top: 26,
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



class DataTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: this.getWidth(),
            height: 200
        };
    }

    componentDidMount() {
        this.updateDimensions = () => {
            this.setState({
                width: this.getWidth(),
            });
        };

        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    getWidth() {
        return window.innerWidth - (this.props.ui.layersPanelOpen ? 300 : 0);
    }

    onDrag(evt) {
        // evt.preventDefault();
        // evt.stopPropagation();

        if (evt.pageY) {
            const el = findDOMNode(this.refs['dhis-gis-data-table']);

            el.style.height = (window.innerHeight - evt.pageY) + 'px';

            // console.log(window.innerHeight - evt.pageY, el);
            /*
            this.setState({
                height: window.innerHeight - evt.pageY,
            });
            */
        }
    }

    onDragEnd(evt) {
        // evt.preventDefault();
        // evt.stopPropagation();

        if (evt.pageY) {
            //const el = findDOMNode(this.refs['dhis-gis-data-table']);

            //el.style.height = (window.innerHeight - evt.pageY) + 'px';

            // console.log(window.innerHeight - evt.pageY, el);

            this.setState({
                height: window.innerHeight - evt.pageY,
            });

        }
    }


    render() {
        const {overlayId, overlays, closeDataTable, selectOrgUnit, unselectOrgUnit, filterOrgUnits, unfilterOrgUnits, ui} = this.props;

        if (overlayId) {
            // document.getElementById('app').className = 'dhis-gis-data-table-visible'; // TODO: Do with redux state

            const overlay = overlays.filter(layer => layer.id === overlayId)[0];
            const valueFilter = overlay.valueFilter || { gt: null, lt: null, };
            let data = overlay.data;

            if (valueFilter.gt !== null) {
                data = data.filter(feature => feature.properties.value > valueFilter.gt);
            }

            if (valueFilter.lt !== null) {
                data = data.filter(feature => feature.properties.value < valueFilter.lt);
            }

            const actions = [
                <FlatButton
                    label="Close"
                    primary={true}
                    onTouchTap={closeDataTable}
                />
            ];

            const dataList = data.map(item => ({
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

            const onGreaterThanChange = function(evt, value) {
                valueFilter.gt = (value !== '') ? Number(value) : null;
                filterOrgUnits(overlayId, valueFilter);
            };

            const onLessThanChange = function(evt, value) {
                valueFilter.lt = (value !== '') ? Number(value) : null;
                filterOrgUnits(overlayId, valueFilter);
            };

            const dataTableStyle = {
                position: 'absolute',
                left: ui.layersPanelOpen ? 300 : 0,
                height: this.state.height,
                right: 0,
                bottom: 0,
                boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.227451)',
                zIndex: 1048,
                background: '#fff',
            };

            return (
                <div ref="dhis-gis-data-table" style={dataTableStyle}>

                    <div draggable={true} onDrag={(evt) => this.onDrag(evt)} onDragEnd={(evt) => this.onDragEnd(evt)} style={styles.resizeHandle} className="dhis-gis-resize-handle">
                        <DragIcon color={grey400} />
                    </div>

                    <Toolbar style={styles.toolbar}>
                        <ToolbarGroup>
                            <ToolbarTitle style={styles.toolbarTitle} text="Data table" />
                            <SearchIcon style={styles.icon} color={grey600} />
                            <TextField
                                floatingLabelText="Search"
                                style={styles.field}
                                inputStyle={styles.input}
                                underlineStyle={styles.underline}
                                floatingLabelStyle={styles.floatingLabel}
                                floatingLabelShrinkStyle={styles.floatingLabelShrink}
                            />
                            <FilterIcon style={styles.icon} color={grey600} />
                            <TextField
                                type="number"
                                floatingLabelText="Greater than"
                                value={valueFilter.gt !== null ? valueFilter.gt : ''}
                                onChange={onGreaterThanChange}
                                style={styles.field}
                                inputStyle={styles.input}
                                underlineStyle={styles.underline}
                                floatingLabelStyle={styles.floatingLabel}
                                floatingLabelShrinkStyle={styles.floatingLabelShrink}
                            />
                            <TextField
                                type="number"
                                floatingLabelText="Lower than"
                                value={valueFilter.lt !== null ? valueFilter.lt : ''}
                                onChange={onLessThanChange}
                                style={styles.field}
                                inputStyle={styles.input}
                                underlineStyle={styles.underline}
                                floatingLabelStyle={styles.floatingLabel}
                                floatingLabelShrinkStyle={styles.floatingLabelShrink}
                            />
                        </ToolbarGroup>
                    </Toolbar>
                    <Table
                        width={this.state.width}
                        height={this.state.height - 40}
                        rowHeight={24}
                        headerHeight={24}
                        rowsCount={dataList.length}
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
                            header={<Cell style={styles.rightAlign}>Value</Cell>}
                            cell={<NumberCell data={dataList} col="value" />}
                            width={100}
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
                            header={<Cell>Id</Cell>}
                            cell={<TextCell data={dataList} col="id" />}
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
                </div>
            );
        } else {
            // document.getElementById('app').className = ''; // TODO: Do with redux state
            return null;
        }

    }

}



export default DataTable;