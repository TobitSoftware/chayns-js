import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';
import {environment} from '../environment';
import {isFunction} from '../../utils';
import { getGlobalData } from './getGlobalData';

export const listeners = [];

function _setAccessTokenChange(enabled) {
    const callbackName = 'setAccessTokenChange';

    return chaynsCall({
        'call': {
            'action': 66,
            'value': {
                'callback': getCallbackName(callbackName),
                enabled,
                'apiVersion': environment.apiVersion
            }
        },
        'app': {
            'support': {'android': 4728, 'ios': 4301}
        },
        callbackName,
        'callbackFunction': () => {
            getGlobalData(true).then((data) => {
                for (let i = 0, l = listeners.slice(); i < l.length; i++) {
                    if (isFunction(l[i])) {
                        l[i](data);
                    }
                }
            });
        },
        'propTypes': {
            'enabled': propTypes.boolean.isRequired,
            'callback': propTypes.string.isRequired,
            'apiVersion': propTypes.number.isRequired
        }
    });
}

export function addAccessTokenChangeListener(cb) {
    if (window.disablev4AccessTokenChangeListener) {
        return;
    }
    if (listeners.length === 0) {
        _setAccessTokenChange(true);
    }

    listeners.push(cb);
    return true;
}

export function removeAccessTokenChangeListener(cb) {
    let index = listeners.indexOf(cb);
    if (index !== -1) {
        listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
        _setAccessTokenChange(false);
    }

    return index !== -1;
}
