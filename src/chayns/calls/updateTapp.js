import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';

export function updateTapp(tappId) {
    return chaynsCall({
        'call': {
            'action': 107,
            'value': {
                'tappID': tappId
            }
        },
        'app': {
            'support': {'android': 5254, 'ios': 5204}
        },
        'web': false,
        'propTypes': {
            'tappID': propTypes.number.isRequired
        }
    });
}
