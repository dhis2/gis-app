import React from 'react';
import PropTypes from 'prop-types';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ContentCreateIcon from 'material-ui/svg-icons/content/create';
import ActionDataTableIcon from 'material-ui/svg-icons/action/view-list';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download';
import Slider from 'material-ui/Slider';
import { grey600 } from 'material-ui/styles/colors'; // http://www.material-ui.com/#/customization/colors

import FileSaver from 'file-saver'; // https://github.com/eligrey/FileSaver.js

const styles = {
    toolbar: {
        backgroundColor: '#eee',
        height: 32,
        padding: '0 8px',
    },
    button: {
        float: 'left',
        padding: 4,
        width: 32,
        height: 32,
    },
    sliderContainer: {
        float: 'left',
        width: 100,
        marginBottom: 0,
    },
    slider: {
        margin: 8,
    },
    menuList: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    menuItem: {
        lineHeight: '32px',
        minHeight: 32,
        fontSize: 14,
    },
};

const LayerToolbar = ({ layer, onEdit, onRemove, onDataTableShow, onOpacityChange }) => {

    function onFeaturesDownload() {
        const geojson = {
            type: 'FeatureCollection',
            features: layer.data,
        };

        const blob = new Blob([JSON.stringify(geojson)], {type: 'application/json;charset=utf-8'});

        FileSaver.saveAs(blob, layer.id + '.geojson');
    }

    function onStyleDownload() {
        const bounds = [0, 40, 60, 70, 80, 90, 120, 990];
        const colors = ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026', '#CCCCCC'];

        let sld = `<?xml version="1.0" encoding="UTF-8"?>
                <StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:se="http://www.opengis.net/se">
                  <NamedLayer>
                    <se:Name>JzqNgIsKF4N</se:Name>
                    <UserStyle>
                      <se:Name>JzqNgIsKF4N</se:Name>
                      <se:FeatureTypeStyle>`;

        for (let i = 0; i < colors.length; i++) {
            const color = colors[i];
            const start = bounds[i];
            const stop = bounds[i + 1];

            let stopFilter = 'PropertyIsLessThan';

            if (i === colors.length - 1) { // If last
                let stopFilter = 'PropertyIsLessThanOrEqualTo';
            }

            // console.log(i, color, start, stop);

            sld += `<se:Rule>
                  <se:Name>${start} - ${stop}</se:Name>
                  <se:Description>
                    <se:Title>${start} - ${stop}</se:Title>
                  </se:Description>
                  <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                    <ogc:And>
                      <ogc:PropertyIsGreaterThanOrEqualTo>
                        <ogc:PropertyName>value</ogc:PropertyName>
                        <ogc:Literal>${start}</ogc:Literal>
                      </ogc:PropertyIsGreaterThanOrEqualTo>
                      <ogc:${stopFilter}>
                        <ogc:PropertyName>value</ogc:PropertyName>
                        <ogc:Literal>${stop}</ogc:Literal>
                      </ogc:${stopFilter}>
                    </ogc:And>
                  </ogc:Filter>
                  <se:PolygonSymbolizer>
                    <se:Fill>
                      <se:SvgParameter name="fill">${color}</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
                      <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                      <se:SvgParameter name="stroke-width">0.2</se:SvgParameter>
                      <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                    </se:Stroke>
                  </se:PolygonSymbolizer>
                </se:Rule>`;
        }

        sld += `</se:FeatureTypeStyle>
              </UserStyle>
              </NamedLayer>
              </StyledLayerDescriptor>`;

        const blob = new Blob([sld], {type: 'application/xml;charset=utf-8'});

        FileSaver.saveAs(blob, layer.id + '.sld');
    }

    return (
        <Toolbar style={styles.toolbar}>
            <ToolbarGroup>
                {onEdit &&
                <IconButton onClick={() => onEdit(layer)} tooltip="Edit" tooltipPosition="top-center" style={styles.button}>
                    <ContentCreateIcon color={grey600} />
                </IconButton>
                }

                {onDataTableShow &&
                <IconButton onClick={() => onDataTableShow(layer.id)} tooltip="Data table" tooltipPosition="top-center" style={styles.button}>
                    <ActionDataTableIcon color={grey600} />
                </IconButton>
                }

                {onOpacityChange &&
                <Slider
                    defaultValue={layer.opacity}
                    onChange={(evt, opacity) => onOpacityChange(layer.id, opacity)}
                    style={styles.sliderContainer}
                    sliderStyle={styles.slider}
                />
                }
            </ToolbarGroup>

            <ToolbarGroup>
                <IconMenu iconButtonElement={
                    <IconButton style={{...styles.button}}>
                        <FileDownloadIcon color={grey600} />
                    </IconButton>
                } listStyle={styles.menuList}>
                    <MenuItem primaryText="Organisation units (GeoJSON)" onTouchTap={onFeaturesDownload} style={styles.menuItem} />
                    <MenuItem primaryText="Style (SLD)" onTouchTap={onStyleDownload} style={styles.menuItem} />
                </IconMenu>

                {onRemove &&
                <IconButton onClick={onRemove} tooltip="Delete" tooltipPosition="top-center" style={styles.button}>
                    <ActionDeleteIcon color={grey600}/>
                </IconButton>
                }
            </ToolbarGroup>

        </Toolbar>
    )
};


LayerToolbar.propTypes = {
    //id: PropTypes.string.isRequired,
    //data: PropTypes.array,
    //opacity: PropTypes.number,
    layer: PropTypes.object,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onDataTableShow: PropTypes.func,
    onOpacityChange: PropTypes.func,
};

/*
LayerToolbar.defaultProps = {
    data: [],
    opacity: 1,
};
*/

export default LayerToolbar;
