import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';

export function sendEventToTopFrame(event, object = {}) {
    return chaynsCall({
        'call': {
            'action': 112,
            'value': {
                event,
                object
            }
        },
        'app': false,
        'propTypes': {
            'event': propTypes.string.isRequired,
            'object': propTypes.object
        }
    });
}
