import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';
import {getCallbackName} from '../callback';
import {environment} from '../environment';

const listeners = [];

const errorMessages = ['User denied the request for Geolocation.', 'Location information is unavailable.', 'The request to get user location timed out.', 'An unknown Geolocation error occurred.'];

function callValidated(data, resolve, reject) {
    if ((data.latitude === -1 && data.longitude === -1)) {
        reject({'code': 3, 'message': errorMessages[3]});
    } else if (data.code) {
        reject({'code': data.code, 'message': errorMessages[data.code]});
    } else {
        resolve(data);
    }
}

export function getGeoLocation() {
    const callbackName = 'getGeoLocation';

    return new Promise((resolve, reject) => {
        chaynsCall({
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
        }).then((data) => {
            callValidated(data, resolve, reject);
        });
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
                callValidated(data, listeners[i], listeners[i]);
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
