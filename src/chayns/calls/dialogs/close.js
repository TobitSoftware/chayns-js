import {chaynsCall} from '../../chaynsCall';

export function close() {
    return chaynsCall({
        'call': {
            'action': 113,
            'value': {}
        },
        'app': {
            'support': {'android': 5350, 'ios': 5386}
        }
    });
}
