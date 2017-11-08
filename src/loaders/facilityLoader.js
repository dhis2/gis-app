import i18next from 'i18next';
import isObject from 'd2-utilizr/lib/isObject';
import { getInstance as getD2 } from 'd2/lib/d2';
import {isValidCoordinate} from '../util/map';
import { getDisplayPropertyUrl } from '../util/helpers';

const facilityLoader = (config) => new Promise((resolve, reject) => {
    const groupSetId = config.organisationUnitGroupSet.id;
    const orgUnits = config.rows[0].items.map(item => item.id);

    getD2()
        .then((d2) => {
            const contextPath = d2.system.systemInfo.contextPath;
            const displayProperty = d2.currentUser.settings.keyAnalysisDisplayProperty || 'name';
            const namePropertyUrl = getDisplayPropertyUrl(displayProperty);

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
                .byOrgUnit(orgUnits)
                .displayProperty(displayProperty.toUpperCase())
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
                        const group = groupSet[id];

                        return {
                            type: 'Feature',
                            id: facility.id,
                            properties: {
                                id: facility.id,
                                name: facility.na,
                                label: `${facility.na} (${group.name})`,
                                icon: {
                                    iconUrl: `${contextPath}/images/orgunitgroup/${group.symbol}`,
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
                        title: i18next.t('Facilities'),
                        legend: {
                            items: Object.keys(groupSet).map(id => ({
                                image: `${contextPath}/images/orgunitgroup/${groupSet[id].symbol}`,
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
