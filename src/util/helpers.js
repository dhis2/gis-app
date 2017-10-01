
const displayPropertyMap = {
    name: 'displayName',
    displayName: 'displayName',
    shortName: 'displayShortName',
    displayShortName: 'displayShortName',
};

// TODO: Do once and make avaialble in d2 settings?
export const getDisplayPropertyUrl = (name) => (displayPropertyMap[name] || 'displayName') + '~rename(name)';
