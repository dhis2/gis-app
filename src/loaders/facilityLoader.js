import { getInstance as getD2 } from 'd2/lib/d2';
import isObject from 'd2-utilizr/lib/isObject';
import {isValidCoordinate} from '../util/map';

const facilityLoader = (config) => new Promise((resolve, reject) => {
    const namePropertyUrl = gis.init.namePropertyUrl; // TODO
    const keyAnalysisDisplayProperty = gis.init.userAccount.settings.keyAnalysisDisplayProperty; // TODO
    const groupSetId = config.organisationUnitGroupSet.id;
    const items = config.rows[0].items.map(item => item.id);
    const propertyMap = {
        name: 'name',
        displayName: 'name',
        shortName: 'shortName',
        displayShortName: 'shortName',
    };
    const displayProperty = (propertyMap[keyAnalysisDisplayProperty] || 'name').toUpperCase();

    console.log('facility loader', groupSetId, items, config);

    getD2()
        .then((d2) => {
            // TODO: Check if already in redux store?
            const groupSetReq = d2.models.organisationUnitGroupSet.get(groupSetId, {
                fields: `organisationUnitGroups[id,${namePropertyUrl},symbol]`,
            }).then(groupSet =>
                groupSet.organisationUnitGroups.reduce((symbols, group, index) => { // Easier lookup of unit group symbols
                    group.symbol = group.symbol || (21 + index) + '.png'; // Default symbol 21-25 are coloured circles
                    symbols[group.id] = group;
                    return symbols;
                }, {})
            );

            const facilitiesReq = d2.geoFeatures
                .byOrgUnit(items)
                .displayProperty(displayProperty)
                .getAll({
                    includeGroupSets: true,
                })
                .then(facilities => facilities.filter(facility => ( // Only add valid points belonging to an org.unit group
                    facility.ty === 1 &&
                    isObject(facility.dimensions) &&
                    facility.dimensions[groupSetId] &&
                    isValidCoordinate(JSON.parse(facility.co))
                )));

            Promise.all([groupSetReq, facilitiesReq])
                .then(([groupSet, facilities]) => {

                    // Convert API response to GeoJSON features
                    const features = facilities.map(facility => {
                        const id = facility.dimensions[groupSetId];
                        // const group = groupSet[id];

                        return {
                            type: 'Feature',
                            id: facility.id,
                            properties: {
                                id: facility.id,
                                name: facility.na,
                                label: facility.na + ' (' + groupSet[id].name + ')',
                                icon: {
                                    iconUrl: gis.init.contextPath + '/images/orgunitgroup/' + groupSet[id].symbol,
                                    iconSize: [16, 16],
                                }
                            },
                            geometry: {
                                type: 'Point',
                                coordinates: JSON.parse(facility.co),
                            }
                        }
                    });

                    resolve({
                        ...config,
                        data: features,
                        title: 'Facilities', // TODO: i18n
                        legend: {
                            items: Object.keys(groupSet).map(id => ({
                                image: gis.init.contextPath + '/images/orgunitgroup/' + groupSet[id].symbol, // TODO
                                name: groupSet[id].name,
                            })),
                        },
                        isLoaded: true,
                        isExpanded: true,
                        isVisible: true,
                    });
                })
                .catch(reject);
        });
});

export default facilityLoader;
