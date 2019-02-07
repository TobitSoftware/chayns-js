import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';
import {getCallbackName} from '../callback';

const listeners = [];

function _setNfcCallbackRfid(enabled) {
    const callbackName = 'NfcCallbackRfid';

    return chaynsCall({
        'call': {
            'action': 38,
            'value': {
                'callback': getCallbackName(callbackName),
                enabled
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 5641}
        },
        'web': false,
        'myChaynsApp': {
            'support': {'android': 5683, 'ios': 5764}
        },
        callbackName,
        'callbackFunction': (data) => {
            for (let i = 0, l = listeners.length; i < l; i++) {
                listeners[i](data.nfcRFID || null);
            }
        },
        'propTypes': {
            'enabled': propTypes.boolean.isRequired,
            'callback': propTypes.string.isRequired
        }
    });
}

export function addNfcListener(cb) {
    if (listeners.length === 0) {
        _setNfcCallbackRfid(true);
    }

    listeners.push(cb);
}

export function removeNfcListener(cb) {
    let index = listeners.indexOf(cb);
    if (index !== -1) {
        listeners.splice(index, 1)
    }

    if (listeners.length === 0) {
        _setNfcCallbackRfid(false);
    }

    return index !== -1;
}
