import * as actionTypes from '../constants/actionTypes';

export const openOrgUnit = attr => {
    return {
        type: actionTypes.ORGANISATION_UNIT_OPEN,
        payload: attr,
    };
};

export const closeOrgUnit = () => {
    return {
        type: actionTypes.ORGANISATION_UNIT_CLOSE,
    };
};

export const relocateOrgUnit = () => {
    return {
        type: actionTypes.ORGANISATION_UNIT_RELOCATE,
    };
};

export const swapOrgUnitCoordinate = () => {
    return {
        type: actionTypes.ORGANISATION_UNIT_SWAP_COORDINATE,
    };
};


