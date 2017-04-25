import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import FlatButton from 'material-ui/FlatButton';
import {Table, Column, Cell} from 'fixed-data-table';
import { grey600 } from 'material-ui/styles/colors';
import FileSaver from 'file-saver'; // https://github.com/eligrey/FileSaver.js

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import MenuItem from 'material-ui/MenuItem';

import '../../../node_modules/fixed-data-table/dist/fixed-data-table.css'; // TODO: Which to load?

// http://facebook.github.io/fixed-data-table/

const styles = {
    dialog: {
        padding: 0,
    },
    dialogContent: {
        width: 660,
        maxWidth: 'none',
    },
    toolbar: {
        height: 40,
        padding: '0px 16px',
    },
    toolbarTitle: {
        fontSize: 16,
    },
    searchField: {
        width: 100,
        fontSize: 12,
    },
    valueField: {
        width: 100,
        fontSize: 12,
        marginRight: 16,
    },
    icon: {
        margin: '0 8px 0 16px',
    },
    rightAlign: {
        textAlign: 'right',
    },
};

const IndexCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props} style={styles.rightAlign}>
        {rowIndex}
    </Cell>
);

const NumberCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props} style={styles.rightAlign}>
        {data[rowIndex][col]}
    </Cell>
);

const TextCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props}>
        {data[rowIndex][col]}
    </Cell>
);

const AddLayerDialog = ({ overlayId, overlays, onRequestClose }) => {
    if (overlayId) {
        const overlay = overlays.filter(layer => layer.id === overlayId)[0];

        // console.log('overlay', overlay);

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={onRequestClose}
            />
        ];

        const dataList = overlay.data.map(item => ({
            code: item.id,
            type: item.geometry.type,
            name: item.properties.name,
            value: item.properties.value,
            color: item.properties.color,
            level: item.properties.level,
            parent: item.properties.parentName,
        }));

        const geojson = {
            type: 'FeatureCollection',
            features: overlay.data,
        };

        function onFeaturesDownload() {
            console.log('onFeaturesDownload', overlay);

            // console.log('data', JSON.stringify(geojson));

            const geojson = {
                type: 'FeatureCollection',
                features: overlay.data,
            };

            const blob = new Blob([JSON.stringify(geojson)], {type: 'application/json;charset=utf-8'});

            FileSaver.saveAs(blob, overlay.id + '.geojson');
        }

        function onStyleDownload() {
            console.log('onStyleDownload', overlay);

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

                console.log(i, color, start, stop);

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

            FileSaver.saveAs(blob, overlay.id + '-7.sld');
        }

        return (
            <Dialog
                bodyStyle={styles.dialog}
                contentStyle={styles.dialogContent}
                actions={actions}
                modal={true}
                open={true}
            >

                <Toolbar style={styles.toolbar}>
                    <ToolbarGroup>
                        <ToolbarTitle style={styles.toolbarTitle} text="Data table" />
                        <SearchIcon style={styles.icon} color={grey600} />
                        <TextField style={styles.searchField} hintText="Search" />
                        <FilterIcon style={styles.icon} color={grey600} />
                        <TextField style={styles.valueField} hintText="Greater than" />
                        <TextField style={styles.valueField} hintText="Lower than" />

                    </ToolbarGroup>
                    <ToolbarGroup>
                        <IconMenu
                            iconButtonElement={
                                <IconButton touch={true}>
                                    <DownloadIcon style={styles.icon} color={grey600} />
                                </IconButton>
                            }
                        >
                            <MenuItem primaryText="Features (GeoJSON)" onTouchTap={onFeaturesDownload} />
                            <MenuItem primaryText="Style (SLD)" onTouchTap={onStyleDownload} />
                        </IconMenu>
                    </ToolbarGroup>
                </Toolbar>
                <Table
                    rowHeight={24}
                    headerHeight={24}
                    rowsCount={dataList.length}
                    width={660}
                    height={500}>
                    <Column
                        header={<Cell style={styles.rightAlign}>#</Cell>}
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
                        header={<Cell style={styles.rightAlign}>Value</Cell>}
                        cell={<NumberCell data={dataList} col="value" />}
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
            </Dialog>
        );
    } else {
        return null;
    }
};

/*
AddLayerDialog.propTypes = {
    dataList: PropTypes.array, // TODO: Use arrayOf?
};

AddLayerDialog.defaultProps = {
    dataList: [],
};
*/

export default AddLayerDialog;


/*
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:se="http://www.opengis.net/se">
    <NamedLayer>
        <se:Name>features OGRGeoJSON MultiPolygon</se:Name>
        <UserStyle>
            <se:Name>features OGRGeoJSON MultiPolygon</se:Name>
            <se:FeatureTypeStyle>
                <se:Rule>
                    <se:Name> 53.8000 - 72.0600 </se:Name>
                    <se:Description>
                        <se:Title> 53.8000 - 72.0600 </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:And>
                            <ogc:PropertyIsGreaterThanOrEqualTo>
                                <ogc:PropertyName>value</ogc:PropertyName>
                                <ogc:Literal>53.79999999999999716</ogc:Literal>
                            </ogc:PropertyIsGreaterThanOrEqualTo>
                            <ogc:PropertyIsLessThanOrEqualTo>
                                <ogc:PropertyName>value</ogc:PropertyName>
                                <ogc:Literal>72.06000000000000227</ogc:Literal>
                            </ogc:PropertyIsLessThanOrEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ffffd4</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000001</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name> 72.0600 - 90.3200 </se:Name>
                    <se:Description>
                        <se:Title> 72.0600 - 90.3200 </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:And>
                            <ogc:PropertyIsGreaterThan>
                                <ogc:PropertyName>value</ogc:PropertyName>
                                <ogc:Literal>72.06000000000000227</ogc:Literal>
                            </ogc:PropertyIsGreaterThan>
                            <ogc:PropertyIsLessThanOrEqualTo>
                                <ogc:PropertyName>value</ogc:PropertyName>
                                <ogc:Literal>90.31999999999999318</ogc:Literal>
                            </ogc:PropertyIsLessThanOrEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#fed98e</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000001</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name> 90.3200 - 108.5800 </se:Name>
                    <se:Description>
                        <se:Title> 90.3200 - 108.5800 </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:And>
                            <ogc:PropertyIsGreaterThan>
                                <ogc:PropertyName>value</ogc:PropertyName>
                                <ogc:Literal>90.31999999999999318</ogc:Literal>
                            </ogc:PropertyIsGreaterThan>
                            <ogc:PropertyIsLessThanOrEqualTo>
                                <ogc:PropertyName>value</ogc:PropertyName>
                                <ogc:Literal>108.57999999999998408</ogc:Literal>
                            </ogc:PropertyIsLessThanOrEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#fe9929</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000001</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name> 108.5800 - 126.8400 </se:Name>
                    <se:Description>
                        <se:Title> 108.5800 - 126.8400 </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:And>
                            <ogc:PropertyIsGreaterThan>
                                <ogc:PropertyName>value</ogc:PropertyName>
                                <ogc:Literal>108.57999999999998408</ogc:Literal>
                            </ogc:PropertyIsGreaterThan>
                            <ogc:PropertyIsLessThanOrEqualTo>
                                <ogc:PropertyName>value</ogc:PropertyName>
                                <ogc:Literal>126.83999999999997499</ogc:Literal>
                            </ogc:PropertyIsLessThanOrEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#d95f0e</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000001</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name> 126.8400 - 145.1000 </se:Name>
                    <se:Description>
                        <se:Title> 126.8400 - 145.1000 </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:And>
                            <ogc:PropertyIsGreaterThan>
                                <ogc:PropertyName>value</ogc:PropertyName>
                                <ogc:Literal>126.83999999999997499</ogc:Literal>
                            </ogc:PropertyIsGreaterThan>
                            <ogc:PropertyIsLessThanOrEqualTo>
                                <ogc:PropertyName>value</ogc:PropertyName>
                                <ogc:Literal>145.09999999999999432</ogc:Literal>
                            </ogc:PropertyIsLessThanOrEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#993404</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000001</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
            </se:FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor>
*/
