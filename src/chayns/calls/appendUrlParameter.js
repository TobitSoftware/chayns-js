import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';

export function appendUrlParameter(parameters, overwrite) {
    return chaynsCall({
        'call': {
            'action': 67,
            'value': {
                parameters,
                overwrite
            }
        },
        'app': false,
        'propTypes': {
            'parameters': propTypes.object.isRequired,
            'overwrite': propTypes.boolean
        }
    });
}
