import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

const listeners = [];

function _setScrollListener(throttle = 200) {
    const callbackName = 'setScrollListener';

    return chaynsCall({
        'call': {
            'action': 102,
            'value': {
                'callback': getCallbackName(callbackName),
                'throttle': throttle
            }
        },
        'app': false,
        callbackName,
        'callbackFunction': (data) => {
            for (let i = 0; i < listeners.length; i++) {
                listeners[i](data);
            }
        },
        'propTypes': {
            'callback': propTypes.string.isRequired,
            'throttle': propTypes.number
        }
    });
}

export function addScrollListener(callback, throttle) {
    if (throttle || listeners.length === 0) {
        _setScrollListener(throttle);
    }

    listeners.push(callback);
    return true;
}

export function removeScrollListener(callback) {
    let index = listeners.indexOf(callback);
    if (index !== -1) {
        listeners.splice(index, 1);
    }

    return index !== -1;
}
