import { combineEpics } from 'redux-observable';
import { getInstance as getD2 } from 'd2/lib/d2';
import { relativePeriods } from '../constants/periods';
import * as types from '../constants/actionTypes';
import { setRelativePeriods } from '../actions/periods';

export const translateRelativePeriods = (action$) =>
    action$
        .ofType(types.RELATIVE_PERIODS_TRANSLATE)
        .concatMap(() =>
            getD2()
                .then((d2) => relativePeriods.map(p => ({
                    id: p.id,
                    name: d2.i18n.getTranslation(p.i18n),
                })))
                .then(setRelativePeriods)
        );

export default combineEpics(translateRelativePeriods);