import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

function setDisplayTimeout(enabled) {
	return chaynsCall({
		'call': {
			'action': 94,
			'value': {
				'enabled': !!enabled
			}
		},
		'app': {
			'support': {'android': 4972, 'ios': 4538}
		},
		'web': false,
		'propTypes': {
			'enabled': propTypes.boolean.isRequired
		}
	});
}

export function enableDisplayTimeout() {
	return setDisplayTimeout(false);
}

export function disableDisplayTimeout() {
	return setDisplayTimeout(true);
}
