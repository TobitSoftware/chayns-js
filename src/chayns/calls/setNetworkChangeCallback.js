import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';
import {getCallbackName} from '../callback';

let listeners = [];

function _setNetworkChangeCallback(ongoing, cb) {
    const callbackName = 'setNetworkChangeCallback';

    return chaynsCall({
        'call': {
            'action': 76,
            'value': {
                ongoing,
                'callback': getCallbackName(callbackName)
            }
        },
        'app': {
            'support': {'android': 4792, 'ios': 4380}
        },
        'web': false,
        callbackName,
        'callbackFunction': (data) => {
            for (let i = 0, l = listeners.length; i < l; i++) {
                listeners[i](data);
            }

            if (cb) {
                cb(data)
            }
        },
        'timeout': 0,
        'propTypes': {
            'ongoing': propTypes.boolean,
            'callback': propTypes.string.isRequired
        }
    });
}

export function addNetworkChangeListener(cb) {
    if (listeners.length === 0) {
        _setNetworkChangeCallback(true);
    }

    listeners.push(cb);
    return true;
}

export function removeNetworkChangeListener(cb) {
    let index = listeners.indexOf(cb);
    if (index !== -1) {
        listeners.splice(index, 1)
    }

    if (listeners.length === 0) {
        _setNetworkChangeCallback(false);
    }

    return index !== -1;
}

export const getNetworkStatus = () => new Promise((resolve, reject) => {
    _setNetworkChangeCallback(listeners.length > 0, resolve).catch(reject)
});

export const networkType = {
    'NO_NETWORK': 0,
    'NETWORK_TYPE_UNKNOWN': 1,
    'IDEN': 2,
    'GPRS': 3,
    'EGDE': 4,
    'CDMA_1xRTT': 5,
    'CDMA_EVDO_0': 6,
    'CDMA_EVDO_A': 7,
    'CDMA_EVDO_B': 8,
    'UMTS': 9,
    'EHRPD': 10,
    'HSDPA': 11,
    'HSPA': 12,
    'HSPAP': 13,
    'HSUPA': 14,
    'LTE': 15,
    'WIFI': 16,
    'ETHERNET': 17
};
