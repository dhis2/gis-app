import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Column } from 'react-virtualized';
import { LAYERS_PANEL_SIZE } from '../../constants/layout';


class DataTable extends Component {

    render() {

        const style = {
            background: 'yellow',
            position: 'absolute',
        };

        return (
            <div style={style}>DATA TABLE WILL BE HERE!</div>
        );
    }

}

export default DataTable;