import {chaynsCall} from '../../chaynsCall';
import {getCallbackName} from '../../callback';

export function toast(config = {}) {
    const callbackName = 'toastCallback';

    return chaynsCall({
        'call': {
            'action': 276,
            'value': {
                'callback': getCallbackName(callbackName),
                ...config
            }
        },
        'app': {
            'support': {'android': 1, 'ios': 1}
        },
        callbackName,
    });
}
