import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';
import {environment} from '../environment';

const listeners = [];

/**
 * This call will listen to the adminmodeswitch and will call the callback when changed.
 * When the adminswitch changed, chayns.env.user.adminMode will be set automatically to the correct value.
 * <div>Call:88</div>
 * @since App not supported | Web supported
 * @param callback This function will be called, when the mode changed
 * @return {Object} mode This contains the current mode
 * @example chayns.setAdminSwitchCallback(console.log);
 */

function _setAdminSwitchListener(callback) {
    const callbackName = 'setAdminSwitchCallback';

    return chaynsCall({
        'call': {
            'action': 88,
            'value': {
                'callback': getCallbackName(callbackName)
            }
        },
        'app': {
            'support': {'android': 5735, 'ios': 5795}
        },
        callbackName,
        'callbackFunction': (data) => {
            environment.user.adminMode = data.mode === adminSwitchStatus.ADMIN;

            for (let i = 0, l = listeners.length; i < l; i++) {
                listeners[i](data);
            }
        },
        'propTypes': {
            'callback': propTypes.string.isRequired
        }
    });
}

export function addAdminSwitchListener(cb) {
    if (listeners.length === 0) {
        _setAdminSwitchListener(true);
    }

    listeners.push(cb);
    return true;
}

export function removeAdminSwitchListener(cb) {
    let index = listeners.indexOf(cb);
    if (index !== -1) {
        listeners.splice(index, 1)
    }

    if (listeners.length === 0) {
        _setAdminSwitchListener(false);
    }

    return index !== -1;
}

export const adminSwitchStatus = {
    'ADMIN': 1,
    'USER': 0
};
