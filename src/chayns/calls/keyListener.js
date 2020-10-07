import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

const listeners = [];

function _setKeyListener() {
    const callbackName = 'setKeyListener';

    return chaynsCall({
        'call': {
            'action': 257,
            'value': {
                'callback': getCallbackName(callbackName)
            }
        },
        'app': false,
        callbackName,
        'callbackFunction': (data) => {
            for (let i = 0, l = listeners.length; i < l; i++) {
                listeners[i](data);
            }
        },
        'propTypes': {
            'callback': propTypes.string.isRequired
        }
    });
}

export function addKeyListener(callback) {
    if (listeners.length === 0) {
        _setKeyListener();
    }

    listeners.push(callback);
    return true;
}

export function removeKeyListener(callback) {
    let index = listeners.indexOf(callback);
    if (index !== -1) {
        listeners.splice(index, 1);
    }

    return index !== -1;
}
