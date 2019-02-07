import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';

function setWaitCursor(enabled, text, timeout) {
    return chaynsCall({
        'call': {
            'action': 1,
            'value': {
                enabled,
                text,
                timeout
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        'propTypes': {
            'enabled': propTypes.boolean.isRequired,
            'text': propTypes.string,
            'timeout': propTypes.number
        }
    });
}

export function showWaitCursor(text, timeout) {
    return setWaitCursor(true, text, timeout);
}

export function hideWaitCursor() {
    return setWaitCursor(false);
}
