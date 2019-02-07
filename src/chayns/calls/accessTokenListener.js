import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';
import {setEnv, environment} from '../environment';
import {parseGlobalData} from '../../utils/parseGlobalData';

const listeners = [];

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
        'callbackFunction': (data) => {
            const gd = parseGlobalData(data);

            setEnv(gd);

            for (let i = 0, l = listeners.length; i < l; i++) {
                listeners[i](data);
            }
        },
        'propTypes': {
            'enabled': propTypes.boolean.isRequired,
            'callback': propTypes.string.isRequired,
            'apiVersion': propTypes.number.isRequired
        }
    });
}

export function addAccessTokenChangeListener(cb) {
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
