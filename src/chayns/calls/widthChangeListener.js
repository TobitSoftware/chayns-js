import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';

const listeners = [];

function _setWidthChange(enabled) {
    const callbackName = 'setWidthChange';

    return chaynsCall({
        'call': {
            'action': 234,
            'value': {
                'callback': getCallbackName(callbackName),
                enabled
            }
        },
        'app': {
            'support': {'android': 4728, 'ios': 4301}
        },
        callbackName,
        'callbackFunction': (data) => {
            for (let i = 0, l = listeners.length; i < l; i++) {
                listeners[i](data);
            }
        },
        'propTypes': {
            'enabled': propTypes.boolean.isRequired,
            'callback': propTypes.string.isRequired
        }
    });
}

export function addWidthChangeListener(cb) {
    if (listeners.length === 0) {
        _setWidthChange(true);
    }

    listeners.push(cb);
    return true;
}

export function removeWidthChangeListener(cb) {
    let index = listeners.indexOf(cb);
    if (index !== -1) {
        listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
        _setWidthChange(false);
    }

    return index !== -1;
}
