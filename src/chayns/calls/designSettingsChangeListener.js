import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';
import {getCallbackName} from '../callback';

const listeners = [];

function _setDesignSettingsChangeListener(enabled) {
    const callbackName = 'DesignSettingsChangeListener';

    return chaynsCall({
        'call': {
            'action': 254,
            'value': {
                'callback': getCallbackName(callbackName),
                enabled
            }
        },
        'app': {
            'support': {'android': 6336, 'ios': 6256}
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

export function addDesignSettingsChangeListener(cb) {
    if(window.disablev4DesignSettingsChangeListener) {
        return;
    }
    if (listeners.length === 0) {
        _setDesignSettingsChangeListener(true);
    }

    listeners.push(cb);
}

export function removeDesignSettingsChangeListener(cb) {
    let index = listeners.indexOf(cb);
    if (index !== -1) {
        listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
        _setDesignSettingsChangeListener(false);
    }

    return index !== -1;
}
