import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Column } from 'react-virtualized';
import ResizeHandle from './ResizeHandle';
import { LAYERS_PANEL_WIDTH, HEADER_HEIGHT } from '../../constants/layout';


class DataTable extends Component {

    // Called from resize handle
    onResize(height) {
        this.node.style.height = `${height}px`;
    }

    render() {
        const {
            layersPanelOpen,
            dataTableOpen,
            dataTableHeight,
            width,
            height,
            resizeDataTable,
        } = this.props;

        if (dataTableOpen) {
            const maxHeight = height - HEADER_HEIGHT - 20;

            const style = {
                background: 'yellow',
                position: 'absolute',
                left: layersPanelOpen ? LAYERS_PANEL_WIDTH : 0,
                height: dataTableHeight < maxHeight ? dataTableHeight : maxHeight,
                right: 0,
                bottom: 0,
                zIndex: 1040,
            };

            return (
                <div
                    ref={node => this.node = node}
                    style={style}
                >
                    <ResizeHandle
                        maxHeight={maxHeight}
                        onResize={(height) => this.onResize(height)}
                        onResizeEnd={(height) => resizeDataTable(height)}
                    />
                </div>
            );
        }

        return null;
    }

}

export default DataTable;
