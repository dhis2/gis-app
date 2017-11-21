import { combineEpics } from 'redux-observable';
import { getInstance as getD2 } from 'd2/lib/d2';
import * as types from '../constants/actionTypes';
import { errorActionCreator } from '../actions/helpers';

export const loadIndicatorGroups = (action$) =>
    action$
        .ofType(types.INDICATOR_GROUPS_LOAD)
        .concatMap(() =>
            getD2()
                .then(d2 => d2.models.indicatorGroups.list({
                    fields: 'id,displayName~rename(name)',
                    paging: false,
                }))
                .then(indicatorGroups => console.log('indicator groups', indicatorGroups.toArray()))
                .catch(errorActionCreator(types.INDICATOR_GROUPS_LOAD_ERROR))
        );

export default combineEpics(loadIndicatorGroups);

