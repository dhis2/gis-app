import { getInstance as getD2 } from 'd2/lib/d2';

const displayPropertyMap = {
    name: 'displayName',
    displayName: 'displayName',
    shortName: 'displayShortName',
    displayShortName: 'displayShortName',
};

// TODO: Do once and make avaialble in d2 settings?
export const getDisplayPropertyUrl = (name) => (displayPropertyMap[name] || 'displayName') + '~rename(name)';



