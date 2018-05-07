import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

function setOverlay(enabled, color, transition, mode) {
    const callbackName = 'showOverlay';

    return chaynsCall({
        'call': {
            'action': 116,
            'value': {
                'callback': getCallbackName(callbackName),
                enabled,
                color,
                transition,
                mode
            }
        },
        'app': false,
        callbackName,
        'propTypes': {
            'enabled': propTypes.boolean.isRequired,
            'callback': propTypes.string.isRequired,
            'color': propTypes.string,
            'transition': propTypes.string
        }
    });
}

export function showOverlay(color, transition, mode) {
    return setOverlay(true, color, transition, mode);
}

export function hideOverlay(transition) {
	return setOverlay(false, undefined, transition);
} 