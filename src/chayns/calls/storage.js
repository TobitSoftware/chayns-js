import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';

let counter = 0;

export function set(key, object, accessMode, tappIds) {
    return chaynsCall({
        'call': {
            'action': 73,
            'value': {
                key,
                object,
                accessMode,
                'tappIDs': tappIds
            }
        },
        'app': {
            'support': {'android': 4767, 'ios': 4337}
        },
        'propTypes': {
            'key': propTypes.string.isRequired,
            'object': propTypes.object,
            'accessMode': propTypes.number,
            'tappIDs': propTypes.array
        }
    });
}

export function remove(key, accessMode) {
    return set(key, null, accessMode);
}

export function get(key, accessMode) {
    const callbackName = `getObjectForKey${counter += 1}`;

    return chaynsCall({
        'call': {
            'action': 74,
            'value': {
                key,
                accessMode,
                'callback': getCallbackName(callbackName)
            }
        },
        'app': {
            'support': {'android': 4767, 'ios': 4337}
        },
        callbackName,
        'propTypes': {
            'key': propTypes.string.isRequired,
            'accessMode': propTypes.number,
            'callback': propTypes.string.isRequired
        }
    });
}

export const accessMode = {
    'PUBLIC': 0,
    'PROTECTED': 1,
    'PRIVATE': 2
};
