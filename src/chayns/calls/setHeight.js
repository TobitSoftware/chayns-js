import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';
import {environment} from '../environment';

export function setHeight(value) {
    if(environment.isWidget) {
        return setWidgetHeight(value);
    }
	return chaynsCall({
		'call': {
			'action': 77,
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

export function setWidgetHeight(value) {
    return chaynsCall({
        'call': {
            'action': 133,
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