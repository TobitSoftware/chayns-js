import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';
import { getCallbackName } from '../callback';

export function getGeoLocation() {
	const callbackName = 'getGeoLocation';

	return chaynsCall({
		'call': {
			'action': 14,
			'value': {
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		callbackName,
		'propTypes': {
			'callback': propTypes.string.isRequired
		}
	});
}
