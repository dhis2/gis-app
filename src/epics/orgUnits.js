import { combineEpics } from 'redux-observable';
import { getInstance as getD2 } from 'd2/lib/d2';
import 'rxjs/add/operator/concatMap';
import * as types from '../constants/actionTypes';
import { setOrgUnitGroupSets } from '../actions/orgUnitGroupSets';
import { errorActionCreator } from '../actions/helpers';

export const loadOrgUnitGroupSets = (action$) =>
    action$
        .ofType(types.ORGANISATION_UNIT_GROUP_SETS_LOAD)
        .concatMap(() =>
            getD2()
                .then((d2) => d2.models.organisationUnitGroupSets.list({
                    fields: `id,${gis.init.namePropertyUrl}`,
                    pageing: false,
                }))
                .then(groupSets => setOrgUnitGroupSets(groupSets.toArray()))
                .catch(errorActionCreator(types.ORGANISATION_UNIT_GROUP_SETS_LOAD_ERROR))
        );

export default combineEpics(loadOrgUnitGroupSets);
