import i18next from 'i18next';
import sortBy from 'lodash/fp/sortBy';
import negate from 'lodash/fp/negate';
import { relativePeriods } from '../constants/periods';

/* DATA ITEMS */

export const getDataItemsFromColumns = (columns) => {
  if (!Array.isArray(columns)) {
    return null;
  }

  const dataItems = columns.filter(item => item.dimension === 'dx')[0];
  return (dataItems && dataItems.items) ? dataItems.items : null;
};

export const getIndicatorFromColumns = columns => {
    if (!Array.isArray(columns)) {
        return null;
    }

    const indicator = columns.filter(item => item.objectName === 'in')[0];
    return (indicator && indicator.items) ? indicator.items[0] : null;
};

export const getProgramIndicatorFromColumns = columns => {
    if (!Array.isArray(columns)) {
        return null;
    }

    const indicator = columns.filter(item => item.objectName === 'pi')[0];
    return (indicator && indicator.items) ? indicator.items[0] : null;
};

export const getReportingRateFromColumns = columns => {
    if (!Array.isArray(columns)) {
        return null;
    }

    const dataItem = columns.filter(item => item.objectName === 'ds')[0];
    return (dataItem && dataItem.items) ? dataItem.items[0] : null;
};

/* DIMENSIONS */

const createDimension = (dimension, items) => ({ dimension, items });

/* ORGANISATION UNIT */

export const getOrgUnitsFromRows = (rows = []) => {
    const orgUnits = rows.filter(item => item.dimension === 'ou')[0];
    return (orgUnits && orgUnits.items) ? orgUnits.items : [];
};

/* ORGANISATION UNIT LEVELS */

const isOrgUnitLevel = (ou) => ou.id.substring(0, 6) === 'LEVEL-';
const getIdFromOrgUnitLevel = (ou) => ou.id.substring(6);
const createOrgUnitLevel = (id) => ({ id: `LEVEL-${id}` });

export const getOrgUnitLevelsFromRows = (rows = []) =>
    getOrgUnitsFromRows(rows)
        .filter(isOrgUnitLevel)
        .map(getIdFromOrgUnitLevel);

export const addOrgUnitLevelsToRows = (rows = [], levels = []) => [
    createDimension('ou', [
        ...getOrgUnitsFromRows(rows).filter(negate(isOrgUnitLevel)),
        ...levels.map(createOrgUnitLevel),
    ])
];

/* ORGANISATION UNIT GROUPS */

const isOrgUnitGroup = (ou) => ou.id.substring(0, 9) === 'OU_GROUP-';
const getIdFromOrgUnitGroup = (ou) => ou.id.substring(9);
const createOrgUnitGroup = (id) => ({ id: `OU_GROUP-${id}` });

export const getOrgUnitGroupsFromRows = (rows = []) =>
    getOrgUnitsFromRows(rows)
        .filter(isOrgUnitGroup)
        .map(getIdFromOrgUnitGroup);

export const addOrgUnitGroupsToRows = (rows = [], levels = []) => [
    createDimension('ou', [
        ...getOrgUnitsFromRows(rows).filter(negate(isOrgUnitGroup)),
        ...levels.map(createOrgUnitGroup),
    ])
];

/* USER ORGANISATION UNITS */

const isUserOrgUnit = (ou) => ou.id.substring(0, 12) === 'USER_ORGUNIT';
const getIdFromUserOrgUnit = (ou) => ou.id;
const createUserOrgUnit = (id) => ({ id });

export const getUserOrgUnitsFromRows = (rows = []) =>
    getOrgUnitsFromRows(rows)
        .filter(isUserOrgUnit)
        .map(getIdFromUserOrgUnit);

export const addUserOrgUnitsToRows = (rows = [], userOrgUnits = []) => [
    createDimension('ou', [
        ...getOrgUnitsFromRows(rows).filter(negate(isUserOrgUnit)),
        ...userOrgUnits.map(createUserOrgUnit),
    ])
];

/* PERIODS */

export const getPeriodFromFilters = (filters) => {
  if (!Array.isArray(filters)) {
    return null;
  }

  // Maps app only support one period so far
  const period = filters.filter(item => item.dimension === 'pe')[0];
  return (period && period.items) ? period.items[0] : null;
};

export const getPeriodNameFromId = (id) => {
    const period = relativePeriods.filter(period => period.id === id)[0];
    return period ? i18next.t(period.name) : null;
};

export const setFiltersFromPeriod = (period) => {
    return [{
        dimension: 'pe',
        items: [{ ...period }],
    }];
};





export const getFiltersFromColumns = (columns) => {
  if (!Array.isArray(columns)) {
    return null;
  }

  const filters = columns.filter(item => item.filter);
  return filters.length ? filters : null;
};

// TODO: Remove dependancy to global variables
export const getDimensionIndexFromHeaders = (headers, dimension) => {
  if (!Array.isArray(headers) || !dimension) {
    return null;
  }

  const dim = gis.conf.finals.dimension[dimension];

  if (!dim) {
      return null;
  }

  // TODO: findIndex is not supported by IE, is it transpiled?
  return headers.findIndex(item => item.name === dim.dimensionName);
};



// TODO: Remove dependancy to global variables
export const getDisplayProperty = (displayProperty) => {
  const propertyMap = {
    'name': 'name',
    'displayName': 'name',
    'shortName': 'shortName',
    'displayShortName': 'shortName'
  };
  const keyAnalysisDisplayProperty = gis.init.userAccount.settings.keyAnalysisDisplayProperty;
  return propertyMap[keyAnalysisDisplayProperty] || propertyMap[displayProperty] || 'name';
};

export const getFiltersAsText = (filters) => {
  if (!Array.isArray(filters)) {
    return null;
  }

  return filters.map(({ name, filter }) => {
    const [ operator, value ] = filter.split(':');
    return `${name} ${getFilterOperatorAsText(operator)} ${value}`;
  });
};

// TODO: Cache?
export const getFilterOperatorAsText = (id) => ({
  'EQ': '=',
  'GT': '>',
  'GE': '>=',
  'LT': '<',
  'LE': '<=',
  'NE': '!=',
  'IN': i18next.t('one of'),
  '!IN': i18next.t('not one of'),
  'LIKE': i18next.t('contains'),
  '!LIKE': i18next.t('doesn\'t contains'),
}[id]);

// Combine data items into one array and exclude certain value types
export const combineDataItems = (dataItemsA = [], dataItemsB = [], excludeTypes = []) =>
    sortBy('name', [ ...dataItemsA, ...dataItemsB ]
        .filter(item => !excludeTypes.includes(item.valueType)));



