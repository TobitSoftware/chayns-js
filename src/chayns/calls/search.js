import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';
import { isArray } from '../../utils/is';

export function addEntries(entries) {
	return chaynsCall({
		'call': {
			'action': 85,
			'value': {
				entries
			}
		},
		'app': {
			'support': {'ios': 4474}
		},
		'web': false,
		'propTypes': {
			'entries': propTypes.array.isRequired
		}
	});
}

export function removeEntries(entries) {
	if (entries && !isArray(entries)) {
		entries = [entries];
	}

	return chaynsCall({
		'call': {
			'action': 86,
			'value': {
				entries
			}
		},
		'app': {
			'support': {'ios': 4474}
		},
		'web': false,
		'propTypes': {
			'entries': propTypes.array.isRequired
		}
	});
}

export function getEntries() {
	const callbackName = 'getSearchEntries';

	return chaynsCall({
		'call': {
			'action': 87,
			'value': {
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'ios': 4474}
		},
		'web': false,
		callbackName,
		'propTypes': {
			'callback': propTypes.string.isRequired
		}
	});
}
