import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';
import {getCallbackName} from '../callback';
import {environment} from '../environment';

const listeners = [];

export function getGeoLocation() {
    const callbackName = 'getGeoLocation';

    return chaynsCall({
        'call': {
            'action': 14,
            'value': {
                'callback': getCallbackName(callbackName)
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        callbackName,
        'propTypes': {
            'callback': propTypes.string.isRequired
        }
    });
}

function _setGeoLocationCallback(enabled) {
    const callbackName = 'geoLocationCallback';

    if (!enabled && environment.isApp) {
        return chaynsCall({
            'call': {
                'action': 14,
                'value': {
                    'permanent': false
                }
            },
            'app': {
                'support': {'android': 4727, 'ios': 4301}
            }
        });
    }

    return chaynsCall({
        'call': {
            'action': 14,
            'value': {
                'callback': getCallbackName(callbackName),
                'permanent': !!enabled
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
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

export function addGeoLocationListener(cb) {
    if (listeners.length === 0) {
        _setGeoLocationCallback(true);
    }

    listeners.push(cb);
}

export function removeGeoLocationListener(cb) {
    let index = listeners.indexOf(cb);
    if (index !== -1) {
        listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
        _setGeoLocationCallback(false);
    }

    return index !== -1;
}
