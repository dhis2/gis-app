import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Column } from 'react-virtualized';
import headerRenderer from './headerRenderer';
import { LAYERS_PANEL_SIZE, DATA_TABLE_SIZE } from '../../constants/layout';

// Inspiration (custom filters): http://adazzle.github.io/react-data-grid/examples.html#/custom-filters
// Filters: https://github.com/adazzle/react-data-grid/tree/master/packages/react-data-grid-addons/src/cells/headerCells/filters

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
        return window.innerWidth - (this.props.layersPanelOpen ? 300 : 0);
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
        const {
            overlayId,
            overlays,
            closeDataTable,
            selectOrgUnit,
            unselectOrgUnit,
            filterOrgUnits,
            unfilterOrgUnits,
            layersPanelOpen
        } = this.props;

        if (overlayId) {

            const overlay = overlays.filter(layer => layer.id === overlayId)[0];
            const valueFilter = overlay.valueFilter || { gt: null, lt: null, };
            let data = overlay.data;

            if (valueFilter.gt !== null) {
                data = data.filter(feature => feature.properties.value > valueFilter.gt);
            }

            if (valueFilter.lt !== null) {
                data = data.filter(feature => feature.properties.value < valueFilter.lt);
            }

            // Temp
            data = data.map(d => d.properties);

            console.log('DATA!', data);

            const dataTableStyle = {
                position: 'absolute',
                left: layersPanelOpen ? 300 : 0,
                height: this.state.height,
                right: 0,
                bottom: 0,
                boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.227451)',
                zIndex: 1048,
                background: '#fff',
            };

            // sortBy={sortBy}
            // sortDirection={sortDirection}
            // scrollToIndex={scrollToIndex}

            return (
                <div>DATA TABLE WILL BE HERE!</div>
            );


            /*
            return (
                <div style={dataTableStyle}>
                    <Table
                        className=''
                        width={700}
                        height={150}
                        headerHeight={50}
                        rowHeight={30}
                        rowCount={data.length}
                        rowGetter={({ index }) => data[index]}
                        onRowClick={evt => console.log('row click')}
                        sort={({ sortBy, sortDirection }) => console.log(sortBy, sortDirection)}
                        useDynamicRowHeight={false}
                    >
                        <Column
                            label='ID'
                            dataKey='id'
                            width={100}
                            disableSort={true}
                        />
                        <Column
                            label='Name'
                            dataKey='name'
                            width={100}
                            headerRenderer={({label}) => [
                                <span key='label'>#{label}#</span>
                            ]}
                        />
                        <Column
                            label='Value'
                            dataKey='value'
                            width={100}
                        />
                        <Column
                            label='Level'
                            dataKey='level'
                            width={30}
                        />
                        <Column
                            label='Parent'
                            dataKey='parentName'
                            width={100}
                        />

                    </Table>


                </div>
            );
            */
        } else {
            return null;
        }
    }
}

export default DataTable;