import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';

export function setWebviewOptions(value) {
    return chaynsCall({
        'call': {
            'action': 99,
            value
        },
        'app': {
            'support': {'android': 5126, 'ios': 5111}
        },
        'web': false,
        'propTypes': {
            'backgroundColor': propTypes.string,
            'bounces': propTypes.boolean
        }
    });
}

export function getWebviewOptions() {
    const callbackName = 'getWebviewOptions';

    return chaynsCall({
        'call': {
            'action': 100,
            'value': {
                'callback': getCallbackName(callbackName)
            }
        },
        'app': {
            'support': {'android': 5126, 'ios': 5111}
        },
        'web': false,
        callbackName,
        'propTypes': {
            'callback': propTypes.string.isRequired
        }
    });
}
