import { combineEpics } from 'redux-observable';
import { getInstance as getD2 } from 'd2/lib/d2';
import 'rxjs/add/operator/concatMap';
import * as types from '../constants/actionTypes';
import { setOrgUnitTree } from '../actions/orgUnitTree';
import { setOrgUnitGroupSets } from '../actions/orgUnitGroupSets';
import { errorActionCreator } from '../actions/helpers';

export const loadOrgUnitTree = (action$) =>
    action$
        .ofType(types.ORGANISATION_UNIT_TREE_LOAD)
        .concatMap(() =>
            getD2()
                .then((d2) => d2.models.organisationUnits.list({
                    level: 1,
                    fields: 'id,path,displayName,children[id,path,displayName,children::isNotEmpty]'
                }))
                .then(modelCollection => setOrgUnitTree(modelCollection.toArray()[0]))
                .catch(errorActionCreator(types.ORGANISATION_UNIT_TREE_LOAD_ERROR))
        );

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

export default combineEpics(loadOrgUnitTree, loadOrgUnitGroupSets);
