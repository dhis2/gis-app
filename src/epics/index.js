import { combineEpics } from 'redux-observable';
import programsEpics from './programs';
import externalLayersEpics from './externalLayers';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/concatMapTo';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';

const errorEpic = (action$) =>
    action$
        .filter((action) => action.type.indexOf('ERROR') !== -1)
        .do((action) => console.error(action.error))
        .concatMapTo(Observable.empty()); // Avoid infinite loop, same as .map(action => Observable.empty()).concatAll()

export default combineEpics(programsEpics, externalLayersEpics, errorEpic);
