import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';
import {isFunction} from '../../utils/is';

function setBackButton(enabled, callback, showButton) {
    const callbackName = 'setBackButton';

    return chaynsCall({
        'call': {
            'action': 10,
            'value': {
                enabled,
                'callback': getCallbackName(callbackName),
                showButton
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        callbackName,
        'callbackFunction': callback,
        'propTypes': {
            'callback': propTypes.string.isRequired,
            'enabled': propTypes.boolean.isRequired
        }
    });
}

export function showBackButton(callback, showButton = true) {
    if (!isFunction(callback)) {
        callback = function backButtonCallback() {
            history.back();
            hideBackButton();
        };
    }

    return setBackButton(true, callback, showButton);
}

export function hideBackButton() {
    return setBackButton(false);
}

