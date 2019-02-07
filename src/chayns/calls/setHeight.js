import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';
import {environment} from '../environment';

export function setHeight(value) {
    return chaynsCall({
        'call': {
            'action': !environment.isWidget ? 77 : 133,
            value
        },
        'app': false,
        'propTypes': {
            'height': propTypes.number.isRequired,
            'growOnly': propTypes.boolean,
            'full': propTypes.boolean,
            'fullViewport': propTypes.boolean
        }
    });
}
