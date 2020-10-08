import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

const listeners = [];

function _setKeyListener(throttle = 200) {
    const callbackName = 'setKeyListener';

    return chaynsCall({
        'call': {
            'action': 257,
            'value': {
                'callback': getCallbackName(callbackName),
                'throttle': throttle
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
            'callback': propTypes.string.isRequired,
            'throttle': propTypes.number
        }
    });
}

export function addKeyListener(callback, throttle) {
    if (throttle || listeners.length === 0) {
        _setKeyListener(throttle);
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
