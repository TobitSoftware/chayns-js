import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

export function setHeight(value) {
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
