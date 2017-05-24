import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResizeHandle from './ResizeHandle';
import DataTable from '../../containers/DataTable';
import { LAYERS_PANEL_WIDTH, HEADER_HEIGHT } from '../../constants/layout';

class BottomPanel extends Component {

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
            const tableHeight = dataTableHeight < maxHeight ? dataTableHeight : maxHeight;
            const tableWidth = width - (layersPanelOpen ? LAYERS_PANEL_WIDTH : 0);

            const style = {
                position: 'absolute',
                left: layersPanelOpen ? LAYERS_PANEL_WIDTH : 0,
                height: tableHeight,
                right: 0,
                bottom: 0,
                zIndex: 1040,
                background: '#fff',
                boxShadow: '0px -2px 3px rgba(0, 0, 0, 0.1)',
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
                    <DataTable width={tableWidth} height={tableHeight} />
                </div>
            );
        }

        return null;
    }
}

export default BottomPanel;
