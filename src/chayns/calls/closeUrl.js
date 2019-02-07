import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';

export function closeUrl(closeParams) {
    return chaynsCall({
        'call': {
            'action': 62,
            'value': {
                closeParams
            }
        },
        'app': {
            'support': {'android': 4728, 'ios': 4301}
        },
        'propTypes': {
            'closeParams': propTypes.object
        }
    });
}
