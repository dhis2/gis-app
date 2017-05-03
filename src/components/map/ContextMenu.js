import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import EditLocationIcon from 'material-ui/svg-icons/action/room';

// https://github.com/callemall/material-ui/issues/2866
const anchorEl = document.getElementById('context-menu');

const ContextMenu = props => {
    const feature = props.feature;
    const layerType = props.layerType;
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

    const style = {
        list: {
            paddingTop: 4,
            paddingBottom: 4,
        },
        menuItem: {
            fontSize: 12,
            lineHeight: '24px',
            minHeight: '24px',
        },
        menuItemInner: {
            padding: '0 8px 0 34px',
        },
        icon: {
            margin: 3,
            left: 6,
            width: 18,
            height: 18,
        }
    };

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
            style={style.popover}
            anchorEl={anchorEl}
            onRequestClose={props.onClose}
        >
            <Menu autoWidth={true} style={style.menu} listStyle={style.list} menuItemStyle={style.menuItem} >

                {layerType !== 'facility' && feature &&
                    <MenuItem
                        primaryText={GIS.i18n.drill_up_one_level}
                        disabled={!attr.hasCoordinatesUp}
                        onTouchTap={() => props.onDrill(props.layerId, attr.grandParentId, attr.grandParentParentGraph, parseInt(attr.level) - 1)}
                        innerDivStyle={style.menuItemInner}
                        leftIcon={
                            <ArrowUpIcon
                                color={attr.hasCoordinatesUp ? iconColor : iconDisabledColor}
                                style={style.icon}
                            />
                        }
                    />
                }

                {layerType !== 'facility' && feature &&
                    <MenuItem
                        primaryText={GIS.i18n.drill_down_one_level}
                        disabled={!attr.hasCoordinatesDown}
                        onTouchTap={() => props.onDrill(props.layerId, attr.id, attr.parentGraph, parseInt(attr.level) + 1)}
                        innerDivStyle={style.menuItemInner}
                        leftIcon={
                            <ArrowDownIcon
                                color={attr.hasCoordinatesDown ? iconColor : iconDisabledColor}
                                style={style.icon}
                            />
                        }
                    />
                }

                {isRelocate && isPoint &&
                    <MenuItem
                        primaryText={GIS.i18n.relocate}
                        onTouchTap={() => props.onRelocateStart(props.layerId, feature)}
                        innerDivStyle={style.menuItemInner}
                        leftIcon={
                            <EditLocationIcon
                                style={style.icon}
                            />
                        }
                    />
                }

                {isRelocate && isPoint &&
                    <MenuItem
                        primaryText={GIS.i18n.swap_lon_lat}
                        onTouchTap={() => props.onSwapCoordinate(props.layerId, feature.id, feature.geometry.coordinates.slice(0).reverse())}
                        innerDivStyle={style.menuItemInner}
                        leftIcon={
                            <EditLocationIcon
                                style={style.icon}
                            />
                        }
                    />
                }

                {!isPlugin && feature &&
                    <MenuItem
                        primaryText={GIS.i18n.show_information_sheet}
                        onTouchTap={() => props.onShowInformation(attr)}
                        innerDivStyle={style.menuItemInner}
                        leftIcon={
                            <InfoIcon
                                style={style.icon}
                            />
                        }
                    />
                }

                {layerType === 'earthEngine' &&
                    <MenuItem
                        primaryText={GIS.i18n.show + ' todo'}
                        onTouchTap={() => props.onShowValue()}
                        innerDivStyle={style.menuItemInner}
                        leftIcon={
                            <InfoIcon
                                style={style.icon}
                            />
                        }
                    />
                }

                {props.coordinate && !isPoint &&
                    <MenuItem
                        primaryText="Show longitude/latitude"
                        onTouchTap={() => props.showCoordinate(props.coordinate)}
                        innerDivStyle={style.menuItemInner}
                        leftIcon={
                            <EditLocationIcon
                                style={style.icon}
                            />
                        }
                    />
                }
            </Menu>
        </Popover>
    );
};

export default ContextMenu;