import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'material-ui/Popover';
//import Menu, { MenuItem } from 'd2-ui/lib/menu/Menu';
import Menu, { MenuItem } from 'material-ui/Menu';
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import EditLocationIcon from 'material-ui/svg-icons/action/room';

// https://github.com/callemall/material-ui/issues/2866
const anchorEl = document.getElementById('context-menu');

const ContextMenu = (props) => {
    const { feature, layerType } = props;
    const iconColor = '#777';
    const iconDisabledColor = '#eee';
    let isRelocate;
    let isPlugin;
    let isPoint;
    let attr = {};

    if (typeof(gis) !== 'undefined') { // TODO
        isRelocate = !!GIS.app ? !!gis.init.user.isAdmin : false;
        isPlugin = gis.plugin;
    }

    if (props.position) {
        anchorEl.style.left = props.position[0] + 'px';
        anchorEl.style.top = props.position[1] + 'px';
    }

    if (feature) {
        isPoint = feature.geometry.type === 'Point';
        attr = feature.properties;
    }

    return (
        <Popover
            open={props.position ? true : false}
            anchorEl={anchorEl}
            onRequestClose={props.onClose}
        >
            <Menu>
                {layerType !== 'facility' && feature &&
                    <MenuItem
                        disabled={!attr.hasCoordinatesUp}
                        onClick={() => props.onDrill(props.layerId, attr.grandParentId, attr.grandParentParentGraph, parseInt(attr.level) - 1)}
                        leftIcon={
                            <ArrowUpIcon
                                color={attr.hasCoordinatesUp ? iconColor : iconDisabledColor}
                                style={style.icon}
                            />
                        }
                    >{GIS.i18n.drill_up_one_level}</MenuItem>
                }

                {layerType !== 'facility' && feature &&
                    <MenuItem
                        disabled={!attr.hasCoordinatesDown}
                        onClick={() => props.onDrill(props.layerId, attr.id, attr.parentGraph, parseInt(attr.level) + 1)}
                        leftIcon={
                            <ArrowDownIcon
                                color={attr.hasCoordinatesDown ? iconColor : iconDisabledColor}
                                style={style.icon}
                            />
                        }
                    >{GIS.i18n.drill_down_one_level}</MenuItem>
                }

                {isRelocate && isPoint &&
                    <MenuItem
                        onClick={() => props.onRelocateStart(props.layerId, feature)}
                        leftIcon={
                            <EditLocationIcon
                                style={style.icon}
                            />
                        }
                    >{GIS.i18n.relocate}</MenuItem>
                }

                {isRelocate && isPoint &&
                    <MenuItem
                        onClick={() => props.onSwapCoordinate(props.layerId, feature.id, feature.geometry.coordinates.slice(0).reverse())}
                        leftIcon={
                            <EditLocationIcon
                                style={style.icon}
                            />
                        }
                    >{GIS.i18n.swap_lon_lat}</MenuItem>
                }

                {!isPlugin && feature &&
                    <MenuItem
                        onClick={() => props.onShowInformation(attr)}
                        innerDivStyle={style.menuItemInner}
                        leftIcon={
                            <InfoIcon
                                style={style.icon}
                            />
                        }
                    >{GIS.i18n.show_information_sheet}</MenuItem>
                }

                {layerType === 'earthEngine' &&
                    <MenuItem
                        onClick={() => props.onShowValue()}
                        innerDivStyle={style.menuItemInner}
                        leftIcon={
                            <InfoIcon
                                style={style.icon}
                            />
                        }
                    >{GIS.i18n.show + ' todo'}</MenuItem>
                }

                {props.coordinate && !isPoint &&
                    <MenuItem
                        onClick={() => props.showCoordinate(props.coordinate)}
                        leftIcon='room'
                        disabled={true}
                    >Show longitude/latitude</MenuItem>
                }
            </Menu>
        </Popover>
    );
};

export default ContextMenu;