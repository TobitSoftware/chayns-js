import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';
import {environment} from '../environment';
import {parseGlobalData} from '../../utils/parseGlobalData';

export const listeners = [];
let apiListenerCount = 0;

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
            // reload if login status has changed and tapp has not set a listener
            if (listeners.length - apiListenerCount <= 0 && environment.isInFrame && environment.user.id !== parseGlobalData(data).user.id) {
                location.reload();
            }

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

export function addAccessTokenChangeListener(cb, isApiListener) {
    if (listeners.length === 0) {
        _setAccessTokenChange(true);
    }
    if (isApiListener) {
        apiListenerCount += 1;
    }

    listeners.push(cb);
    return true;
}

export function removeAccessTokenChangeListener(cb, isApiListener) {
    let index = listeners.indexOf(cb);
    if (index !== -1) {
        listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
        _setAccessTokenChange(false);
    }
    if (isApiListener) {
        apiListenerCount -= 1;
    }

    return index !== -1;
}
