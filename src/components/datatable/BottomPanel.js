import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResizeHandle from './ResizeHandle';
import DataTable from '../../containers/DataTable';
import { LAYERS_PANEL_WIDTH, HEADER_HEIGHT } from '../../constants/layout';
import './BottomPanel.css';

// Container for DataTable
class BottomPanel extends Component {

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
            const tableHeight = dataTableHeight < maxHeight ? dataTableHeight : maxHeight;
            const tableWidth = width - (layersPanelOpen ? LAYERS_PANEL_WIDTH : 0);

            const style = {
                left: layersPanelOpen ? LAYERS_PANEL_WIDTH : 0,
                height: tableHeight,
            };

            return (
                <div
                    ref={node => this.node = node}
                    className='BottomPanel'
                    style={style}
                >
                    <ResizeHandle
                        maxHeight={maxHeight}
                        onResize={(height) => this.onResize(height)}
                        onResizeEnd={(height) => resizeDataTable(height)}
                    />
                    <DataTable
                        width={tableWidth}
                        height={tableHeight}
                    />
                </div>
            );
        }

        return null;
    }

    // Called from resize handle
    onResize(height) {
        this.node.style.height = `${height}px`;
    }
}

export default BottomPanel;
