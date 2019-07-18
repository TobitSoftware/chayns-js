import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';

const listeners = [];

function _setOnActivateCallback(enabled) {
    const callbackName = 'setOnActivateCallback';

    return chaynsCall({
        'call': {
            'action': 60,
            'value': {
                'callback': enabled ? getCallbackName(callbackName) : undefined
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        'myChaynsApp': {
            'support': {'android': 6048, 'ios': 6034}
        },
        'web': false,
        callbackName,
        'callbackFunction': (data) => {
            for (let i = 0, l = listeners.length; i < l; i++) {
                listeners[i](data);
            }
        },
        'timeout': 0,
        'propTypes': {
            'callback': propTypes.string.isRequired
        }
    });
}

export function addOnActivateListener(cb) {
    if (listeners.length === 0) {
        _setOnActivateCallback(true);
    }

    listeners.push(cb);
    return true;
}

export function removeOnActivateListener(cb) {
    let index = listeners.indexOf(cb);
    if (index !== -1) {
        listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
        _setOnActivateCallback(false);
    }

    return index !== -1;
}

export const tappEvent = {
    'ON_SHOW': 0,
    'ON_HIDE': 1,
    'ON_REFRESH': 2
};
