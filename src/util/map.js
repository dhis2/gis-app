import isArray from 'd2-utilizr/lib/isArray';

export function isValidCoordinate(coord) {
    return isArray(coord)
        && coord.length === 2
        && coord[0] >= -180
        && coord[0] <= 180
        && coord[1] >= -90
        && coord[1] <= 90;
}