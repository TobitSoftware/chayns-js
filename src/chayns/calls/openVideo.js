import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';

export function openVideo(url) {
    return chaynsCall({
        'call': {
            'action': 15,
            'value': {
                url
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        'propTypes': {
            'url': propTypes.string.isRequired
        }
    });
}
